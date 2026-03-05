const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const os = require("os");
const CodexAdapter = require("../bin/adapters/codex");
const { getWorkspaceBackupBucket } = require("../bin/utils/backup-store");

describe("CodexAdapter", () => {
    let workDir;
    let installSource;
    let backupRoot;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), "adapter-test-"));
        backupRoot = path.join(workDir, ".tmp-backups");
        process.env.AG_KIT_BACKUP_ROOT = backupRoot;
        installSource = path.join(workDir, "source");
        fs.mkdirSync(installSource);
        fs.writeFileSync(path.join(installSource, "file.txt"), "content");
    });

    afterEach(() => {
        delete process.env.AG_KIT_BACKUP_ROOT;
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    function listBackupDirs() {
        const bucket = getWorkspaceBackupBucket(workDir);
        if (!fs.existsSync(bucket)) {
            return [];
        }
        return fs.readdirSync(bucket, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(bucket, entry.name));
    }

    function findBackupContaining(relPath) {
        const dirs = listBackupDirs();
        for (const dir of dirs) {
            const candidate = path.join(dir, relPath);
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
        return "";
    }

    test("install should create .agents as managed codex directory", () => {
        const adapter = new CodexAdapter(workDir, { quiet: true });
        adapter.install(installSource);

        const agentsDir = path.join(workDir, ".agents");
        const legacyDir = path.join(workDir, ".codex");
        const manifest = path.join(agentsDir, "manifest.json");

        assert.ok(fs.existsSync(agentsDir));
        assert.ok(!fs.existsSync(legacyDir));
        assert.ok(fs.existsSync(manifest));

        const manifestJson = JSON.parse(fs.readFileSync(manifest, "utf8"));
        assert.strictEqual(manifestJson.target, "full");
        assert.ok(manifestJson.files["file.txt"]);
        assert.strictEqual(typeof manifestJson.files["file.txt"].hash, "string");
        assert.strictEqual(typeof manifestJson.files["file.txt"].source, "string");
    });

    test("update should migrate legacy .codex directory to .agents", () => {
        const legacyDir = path.join(workDir, ".codex");
        fs.mkdirSync(legacyDir, { recursive: true });
        fs.writeFileSync(path.join(legacyDir, "manifest.json"), JSON.stringify({ version: 2, target: "codex", files: {} }));
        fs.writeFileSync(path.join(legacyDir, "legacy.txt"), "legacy");

        const updateSource = path.join(workDir, "update-src");
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, "new.txt"), "new");

        const adapter = new CodexAdapter(workDir, { quiet: true, force: true });
        adapter.update(updateSource);

        assert.ok(fs.existsSync(path.join(workDir, ".agents")));
        assert.ok(!fs.existsSync(path.join(workDir, ".codex")));
        assert.ok(fs.existsSync(path.join(workDir, ".agents", "new.txt")));
    });

    test("update should detect drift and backup", () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);

        adapter.install(installSource);

        const managedFile = path.join(workDir, ".agents", "file.txt");
        fs.writeFileSync(managedFile, "modified content");

        const updateSource = path.join(workDir, "update_src");
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, "file.txt"), "v2 content");
        fs.writeFileSync(path.join(updateSource, "new.txt"), "new file");

        adapter.update(updateSource);

        const agentsDir = path.join(workDir, ".agents");
        const backupBase = getWorkspaceBackupBucket(workDir);

        assert.strictEqual(fs.readFileSync(path.join(agentsDir, "file.txt"), "utf8"), "v2 content");
        assert.ok(fs.existsSync(path.join(agentsDir, "new.txt")));

        assert.ok(fs.existsSync(backupBase));
        const backupFile = findBackupContaining("file.txt");
        assert.ok(backupFile, "should contain backed up conflict file");
        assert.strictEqual(fs.readFileSync(backupFile, "utf8"), "modified content");
    });

    test("smart overwrite should skip backup when local content already equals incoming content", () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);

        adapter.install(installSource);

        const managedFile = path.join(workDir, ".agents", "file.txt");
        fs.writeFileSync(managedFile, "v2 content");

        const updateSource = path.join(workDir, "update_src_same");
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, "file.txt"), "v2 content");

        adapter.update(updateSource);

        const backupBase = getWorkspaceBackupBucket(workDir);
        assert.ok(fs.existsSync(backupBase), "rollback 快照目录应存在");
        const fullSnapshot = findBackupContaining(path.join("full-snapshot", "file.txt"));
        assert.strictEqual(fullSnapshot, "", "smart overwrite 命中同哈希时不应创建覆盖冲突备份");
    });

    test("update should create full snapshot backup when manifest is invalid", () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);
        adapter.install(installSource);

        const managedFile = path.join(workDir, ".agents", "file.txt");
        fs.writeFileSync(managedFile, "user-modified");
        fs.writeFileSync(path.join(workDir, ".agents", "manifest.json"), "{invalid-json");

        const updateSource = path.join(workDir, "update_src_invalid_manifest");
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, "file.txt"), "next-version");

        adapter.update(updateSource);

        const backupBase = getWorkspaceBackupBucket(workDir);
        assert.ok(fs.existsSync(backupBase));
        const snapshotFile = findBackupContaining(path.join("full-snapshot", "file.txt"));
        assert.ok(fs.existsSync(snapshotFile));
        assert.strictEqual(fs.readFileSync(snapshotFile, "utf8"), "user-modified");
    });
});
