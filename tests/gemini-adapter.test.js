const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const GeminiAdapter = require("../bin/adapters/gemini");

describe("GeminiAdapter", () => {
    let workDir;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), "gemini-adapter-test-"));
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test("update should work when source and target are the same directory", () => {
        const agentDir = path.join(workDir, ".agent");
        fs.mkdirSync(agentDir, { recursive: true });
        fs.writeFileSync(path.join(agentDir, "SKILL.md"), "same-source-target", "utf8");

        const adapter = new GeminiAdapter(workDir, { quiet: true });
        adapter.update(agentDir);

        assert.ok(fs.existsSync(path.join(agentDir, "SKILL.md")));
        assert.strictEqual(fs.readFileSync(path.join(agentDir, "SKILL.md"), "utf8"), "same-source-target");
    });
});
