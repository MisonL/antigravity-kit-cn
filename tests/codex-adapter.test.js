const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const CodexAdapter = require('../bin/adapters/codex');

describe('CodexAdapter', () => {
    let workDir;
    let installSource;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adapter-test-'));
        installSource = path.join(workDir, 'source');
        fs.mkdirSync(installSource);
        fs.writeFileSync(path.join(installSource, 'file.txt'), 'content');
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test('install should create .codex and not create .agents mirror', () => {
        // Mock log
        const logs = [];
        const options = { 
            quiet: true,
            logger: (msg) => logs.push(msg)
        };
        
        const adapter = new CodexAdapter(workDir, options);
        
        // Mock _removeAgentIgnoreRules since it might try to read .gitignore if we don't stub or ensure it exists
        // GitHelper handles non-existent .gitignore gracefully, so we are good.
        
        adapter.install(installSource);

        const codexDir = path.join(workDir, '.codex');
        const agentsDir = path.join(workDir, '.agents');
        const manifest = path.join(codexDir, 'manifest.json');

        assert.ok(fs.existsSync(codexDir));
        assert.ok(!fs.existsSync(agentsDir));
        assert.ok(fs.existsSync(manifest));

        const manifestJson = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        assert.strictEqual(manifestJson.target, 'codex');
        assert.ok(manifestJson.files['file.txt']);
        assert.strictEqual(typeof manifestJson.files['file.txt'].hash, 'string');
        assert.strictEqual(typeof manifestJson.files['file.txt'].source, 'string');
    });

    test('install should remove legacy .agents directory if it exists', () => {
        fs.mkdirSync(path.join(workDir, '.agents'), { recursive: true });
        fs.writeFileSync(path.join(workDir, '.agents', 'legacy.txt'), 'legacy');
        const adapter = new CodexAdapter(workDir, { quiet: true });
        adapter.install(installSource);

        const agentsDir = path.join(workDir, '.agents');
        assert.ok(!fs.existsSync(agentsDir));
    });

    test('update should detect drift and backup', () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);
        
        // Initial Install
        adapter.install(installSource);
        
        // Introduce Drift
        const codexFile = path.join(workDir, '.codex', 'file.txt');
        fs.writeFileSync(codexFile, 'modified content');
        
        // Prepare Update Source (New Version)
        const updateSource = path.join(workDir, 'update_src');
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, 'file.txt'), 'v2 content');
        fs.writeFileSync(path.join(updateSource, 'new.txt'), 'new file');

        // Run Update
        adapter.update(updateSource);

        const codexDir = path.join(workDir, '.codex');
        const backupBase = path.join(workDir, '.codex-backup');
        
        // Check 1: Content Updated
        assert.strictEqual(fs.readFileSync(path.join(codexDir, 'file.txt'), 'utf8'), 'v2 content');
        assert.ok(fs.existsSync(path.join(codexDir, 'new.txt')));
        
        // Check 2: Backup Created
        assert.ok(fs.existsSync(backupBase));
        const backups = fs.readdirSync(backupBase);
        assert.strictEqual(backups.length, 1); // One timestamp folder
        const latestBackup = path.join(backupBase, backups[0]);
        assert.ok(fs.existsSync(path.join(latestBackup, 'file.txt')));
        assert.strictEqual(fs.readFileSync(path.join(latestBackup, 'file.txt'), 'utf8'), 'modified content');
    });

    test('smart overwrite should skip backup when local content already equals incoming content', () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);

        adapter.install(installSource);

        const codexFile = path.join(workDir, '.codex', 'file.txt');
        fs.writeFileSync(codexFile, 'v2 content');

        const updateSource = path.join(workDir, 'update_src_same');
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, 'file.txt'), 'v2 content');

        adapter.update(updateSource);

        const backupBase = path.join(workDir, '.codex-backup');
        assert.ok(!fs.existsSync(backupBase), 'No backup should be created when file already equals incoming hash');
    });

    test('update should create full snapshot backup when manifest is invalid', () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);
        adapter.install(installSource);

        const codexFile = path.join(workDir, '.codex', 'file.txt');
        fs.writeFileSync(codexFile, 'user-modified');
        fs.writeFileSync(path.join(workDir, '.codex', 'manifest.json'), '{invalid-json');

        const updateSource = path.join(workDir, 'update_src_invalid_manifest');
        fs.mkdirSync(updateSource);
        fs.writeFileSync(path.join(updateSource, 'file.txt'), 'next-version');

        adapter.update(updateSource);

        const backupBase = path.join(workDir, '.codex-backup');
        assert.ok(fs.existsSync(backupBase));
        const backups = fs.readdirSync(backupBase);
        assert.strictEqual(backups.length, 1);
        const snapshotFile = path.join(backupBase, backups[0], 'codex-full-snapshot', 'file.txt');
        assert.ok(fs.existsSync(snapshotFile));
        assert.strictEqual(fs.readFileSync(snapshotFile, 'utf8'), 'user-modified');
    });
});
