const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const GitHelper = require('../bin/utils/git-helper');

describe('GitHelper', () => {
    let workDir;
    let gitIgnorePath;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-helper-test-'));
        gitIgnorePath = path.join(workDir, '.gitignore');
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test('removeIgnoreRules should remove target patterns', () => {
        const content = `
# Comment
node_modules
.agent
src/
.codex/
        `.trim();
        fs.writeFileSync(gitIgnorePath, content);

        const result = GitHelper.removeIgnoreRules(workDir, ['.agent', '.codex'], { dryRun: false });
        
        assert.strictEqual(result.removedCount, 2);
        
        const newContent = fs.readFileSync(gitIgnorePath, 'utf8');
        assert.ok(!newContent.includes('.agent'));
        assert.ok(!newContent.includes('.codex'));
        assert.ok(newContent.includes('node_modules'));
    });

    test('removeIgnoreRules should respect dryRun', () => {
        const content = `.agent\n.codex`;
        fs.writeFileSync(gitIgnorePath, content);

        const result = GitHelper.removeIgnoreRules(workDir, ['.agent'], { dryRun: true });
        
        assert.strictEqual(result.removedCount, 1);
        assert.strictEqual(result.dryRun, true);
        
        const newContent = fs.readFileSync(gitIgnorePath, 'utf8');
        assert.strictEqual(newContent, content); // Should not change
    });
});
