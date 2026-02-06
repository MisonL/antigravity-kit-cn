const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const AtomicWriter = require('../bin/utils/atomic-writer');

describe('AtomicWriter', () => {
    let workDir;
    let sourceDir;
    let targetDir;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-test-'));
        sourceDir = path.join(workDir, 'source');
        targetDir = path.join(workDir, 'target');
        
        fs.mkdirSync(sourceDir);
        fs.writeFileSync(path.join(sourceDir, 'data.txt'), 'version 1');
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test('atomicCopyDir should copy directory when target does not exist', () => {
        AtomicWriter.atomicCopyDir(sourceDir, targetDir);
        
        assert.ok(fs.existsSync(targetDir));
        assert.strictEqual(fs.readFileSync(path.join(targetDir, 'data.txt'), 'utf8'), 'version 1');
    });

    test('atomicCopyDir should overwrite existing directory', () => {
        // Setup initial target
        fs.mkdirSync(targetDir);
        fs.writeFileSync(path.join(targetDir, 'old.txt'), 'old data');
        
        // Prepare new source
        fs.writeFileSync(path.join(sourceDir, 'data.txt'), 'version 2');

        AtomicWriter.atomicCopyDir(sourceDir, targetDir);

        assert.ok(fs.existsSync(targetDir));
        assert.strictEqual(fs.readFileSync(path.join(targetDir, 'data.txt'), 'utf8'), 'version 2');
        assert.ok(!fs.existsSync(path.join(targetDir, 'old.txt')), 'Old file should be gone');
    });
});
