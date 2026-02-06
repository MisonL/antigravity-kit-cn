const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const CodexAdapter = require('../bin/adapters/codex');
const GeminiAdapter = require('../bin/adapters/gemini');

describe('Doctor Command', () => {
    let workDir;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-test-'));
        // Setup mock environment
        // Gemini
        fs.mkdirSync(path.join(workDir, '.agent'));
        // Codex
        fs.mkdirSync(path.join(workDir, '.agents'));
        fs.writeFileSync(path.join(workDir, '.agents', 'manifest.json'), JSON.stringify({ version: 2, target: 'codex', files: {} }));
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test('GeminiAdapter checkIntegrity ok', () => {
        const adapter = new GeminiAdapter(workDir, { quiet: true });
        const res = adapter.checkIntegrity();
        assert.strictEqual(res.status, 'ok');
    });

    test('GeminiAdapter checkIntegrity missing', () => {
        fs.rmSync(path.join(workDir, '.agent'), { recursive: true });
        const adapter = new GeminiAdapter(workDir, { quiet: true });
        const res = adapter.checkIntegrity();
        assert.strictEqual(res.status, 'missing');
    });

    test('CodexAdapter checkIntegrity ok', () => {
        const adapter = new CodexAdapter(workDir, { quiet: true });
        const res = adapter.checkIntegrity();
        assert.strictEqual(res.status, 'ok');
    });

    test('CodexAdapter checkIntegrity missing', () => {
        fs.rmSync(path.join(workDir, '.agents'), { recursive: true });
        const adapter = new CodexAdapter(workDir, { quiet: true });
        const res = adapter.checkIntegrity();
        assert.strictEqual(res.status, 'missing');
    });

    test('CodexAdapter checkIntegrity should flag legacy .codex directory', () => {
        fs.mkdirSync(path.join(workDir, '.codex'), { recursive: true });
        const adapter = new CodexAdapter(workDir, { quiet: true });
        const res = adapter.checkIntegrity();
        assert.strictEqual(res.status, 'broken');
        assert.ok(res.issues.some((issue) => issue.includes('.codex')));
    });

    test('CodexAdapter fixIntegrity should migrate legacy .codex directory', () => {
        fs.rmSync(path.join(workDir, '.agents'), { recursive: true, force: true });
        fs.mkdirSync(path.join(workDir, '.codex'), { recursive: true });
        fs.writeFileSync(path.join(workDir, '.codex', 'manifest.json'), JSON.stringify({ version: 2, target: 'codex', files: {} }));
        fs.writeFileSync(path.join(workDir, '.codex', 'legacy.txt'), 'legacy');
        const adapter = new CodexAdapter(workDir, { quiet: true });
        const res = adapter.fixIntegrity();
        assert.ok(res.fixed);
        assert.ok(fs.existsSync(path.join(workDir, '.agents')));
        assert.ok(!fs.existsSync(path.join(workDir, '.codex')));
    });
});
