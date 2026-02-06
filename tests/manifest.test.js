const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ManifestManager = require('../bin/utils/manifest');

describe('ManifestManager', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('computeHash should return correct sha256', () => {
        const content = 'hello world';
        // echo -n "hello world" | shasum -a 256
        const expected = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
        assert.strictEqual(ManifestManager.computeHash(content), expected);
    });

    test('generateFromDir should exclude directories and map files', () => {
        const file1 = path.join(tempDir, 'file1.txt');
        const dir1 = path.join(tempDir, 'dir1');
        const file2 = path.join(dir1, 'file2.txt');

        fs.writeFileSync(file1, 'content1');
        fs.mkdirSync(dir1);
        fs.writeFileSync(file2, 'content2');

        const manifest = ManifestManager.generateFromDir(tempDir);
        
        // Rel paths depend on OS separator, but manifest logic normalizes to /
        assert.strictEqual(manifest['file1.txt'], ManifestManager.computeHash('content1'));
        assert.strictEqual(manifest['dir1/file2.txt'], ManifestManager.computeHash('content2'));
    });

    test('checkDrift should detect modifications and missing files', () => {
        const manifestPath = path.join(tempDir, 'manifest.json');
        const file1 = path.join(tempDir, 'file1.txt');
        
        fs.writeFileSync(file1, 'original');
        
        const mgr = new ManifestManager(manifestPath);
        mgr.manifest.files = ManifestManager.generateFromDir(tempDir);
        mgr.save();

        // 1. No Drift
        let drift = mgr.checkDrift(tempDir);
        assert.strictEqual(drift.modified.length, 0);
        assert.strictEqual(drift.missing.length, 0);

        // 2. Modified
        fs.writeFileSync(file1, 'modified');
        drift = mgr.checkDrift(tempDir);
        assert.strictEqual(drift.modified.length, 1);
        assert.strictEqual(drift.modified[0], 'file1.txt');

        // 3. Missing
        fs.rmSync(file1);
        drift = mgr.checkDrift(tempDir);
        assert.strictEqual(drift.missing.length, 1);
        assert.strictEqual(drift.missing[0], 'file1.txt');
    });

    test('collectSmartOverwriteConflicts should only return true user conflicts', () => {
        const manifestPath = path.join(tempDir, 'manifest.json');
        const file1 = path.join(tempDir, 'file1.txt');

        fs.writeFileSync(file1, 'original');

        const mgr = new ManifestManager(manifestPath);
        mgr.manifest.files = ManifestManager.generateFileEntriesFromDir(tempDir, { baseDir: tempDir });
        mgr.save();

        // user modified file
        fs.writeFileSync(file1, 'user-modified');

        const incoming = {
            'file1.txt': {
                hash: ManifestManager.computeHash('next-version'),
                source: 'bundled/file1.txt',
            },
        };
        const conflicts = mgr.collectSmartOverwriteConflicts(tempDir, incoming);
        assert.deepStrictEqual(conflicts, ['file1.txt']);

        // if local already equals incoming hash, no conflict backup needed
        fs.writeFileSync(file1, 'next-version');
        const noConflicts = mgr.collectSmartOverwriteConflicts(tempDir, incoming);
        assert.deepStrictEqual(noConflicts, []);
    });
});
