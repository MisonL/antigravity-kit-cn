const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ag-kit.js");

function runCli(args, options = {}) {
    const env = {
        ...process.env,
        AG_KIT_SKIP_UPSTREAM_CHECK: "1",
        ...options.env,
    };

    return spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: options.cwd || REPO_ROOT,
        env,
        encoding: "utf8",
    });
}

describe("Global Sync", () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-global-sync-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("global status should report missing when no global skills installed", () => {
        const result = runCli(["global", "status", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 2);
        assert.strictEqual((result.stdout || "").trim(), "missing");
    });

    test("global status should report broken when target root exists but skills are incomplete", () => {
        fs.mkdirSync(path.join(tempDir, ".codex"), { recursive: true });

        const result = runCli(["global", "status", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 1);
        assert.strictEqual((result.stdout || "").trim(), "broken");
    });

    test("global sync should install codex skills into $HOME/.codex/skills", () => {
        const result = runCli(["global", "sync", "--target", "codex", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const skillsRoot = path.join(tempDir, ".codex", "skills");
        assert.ok(fs.existsSync(skillsRoot), "missing global codex skills root");
        assert.ok(fs.existsSync(path.join(skillsRoot, "clean-code", "SKILL.md")), "missing expected skill: clean-code");
        assert.ok(fs.existsSync(path.join(skillsRoot, "workflow-plan", "SKILL.md")), "missing expected workflow skill: workflow-plan");
    });

    test("global sync should default to syncing codex and gemini when no target is provided", () => {
        const result = runCli(["global", "sync", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const codexRoot = path.join(tempDir, ".codex", "skills");
        assert.ok(fs.existsSync(path.join(codexRoot, "clean-code", "SKILL.md")), "missing expected codex skill: clean-code");
        assert.ok(fs.existsSync(path.join(codexRoot, "workflow-plan", "SKILL.md")), "missing expected codex workflow skill: workflow-plan");

        const geminiCliRoot = path.join(tempDir, ".gemini", "skills");
        assert.ok(fs.existsSync(path.join(geminiCliRoot, "clean-code", "SKILL.md")), "missing expected gemini-cli skill: clean-code");

        const antigravityRoot = path.join(tempDir, ".gemini", "antigravity", "skills");
        assert.ok(fs.existsSync(path.join(antigravityRoot, "clean-code", "SKILL.md")), "missing expected antigravity skill: clean-code");
    });

    test("global status should report installed after global sync", () => {
        const syncResult = runCli(["global", "sync", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(syncResult.status, 0, syncResult.stderr || syncResult.stdout);

        const statusResult = runCli(["global", "status", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(statusResult.status, 0, statusResult.stderr || statusResult.stdout);
        assert.strictEqual((statusResult.stdout || "").trim(), "installed");
    });

    test("global sync should install gemini skills into both ~/.gemini/skills and ~/.gemini/antigravity/skills", () => {
        const result = runCli(["global", "sync", "--target", "gemini", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const geminiCliRoot = path.join(tempDir, ".gemini", "skills");
        assert.ok(fs.existsSync(geminiCliRoot), "missing global gemini-cli skills root");
        assert.ok(fs.existsSync(path.join(geminiCliRoot, "clean-code", "SKILL.md")), "missing expected gemini-cli skill: clean-code");

        const antigravityRoot = path.join(tempDir, ".gemini", "antigravity", "skills");
        assert.ok(fs.existsSync(antigravityRoot), "missing global antigravity skills root");
        assert.ok(fs.existsSync(path.join(antigravityRoot, "clean-code", "SKILL.md")), "missing expected antigravity skill: clean-code");
    });

    test("global sync should create backup when overwriting an existing skill", () => {
        const skillsRoot = path.join(tempDir, ".codex", "skills", "clean-code");
        fs.mkdirSync(skillsRoot, { recursive: true });
        fs.writeFileSync(path.join(skillsRoot, "SKILL.md"), "modified", "utf8");

        const result = runCli(["global", "sync", "--target", "codex", "--quiet"], {
            env: { AG_KIT_GLOBAL_ROOT: tempDir },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const backupRoot = path.join(tempDir, ".ag-kit", "backups", "global");
        assert.ok(fs.existsSync(backupRoot), "missing backup root");

        const timestamps = fs
            .readdirSync(backupRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
        assert.ok(timestamps.length > 0, "backup timestamp directory missing");

        const backupSkillPath = path.join(backupRoot, timestamps[0], "codex", "clean-code", "SKILL.md");
        assert.ok(fs.existsSync(backupSkillPath), "backup for clean-code skill missing");
    });
});
