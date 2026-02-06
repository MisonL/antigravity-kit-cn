const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { upsertManagedBlock } = require("../bin/utils/managed-block");

describe("ManagedBlock", () => {
    let tempDir;
    let targetFile;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "managed-block-test-"));
        targetFile = path.join(tempDir, "AGENTS.md");
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("should append managed block without removing user content", () => {
        fs.writeFileSync(targetFile, "# User Content\n\ncustom text\n", "utf8");
        const result = upsertManagedBlock(targetFile, "codex-core-rules", "managed line");

        assert.strictEqual(result.action, "appended");
        const content = fs.readFileSync(targetFile, "utf8");
        assert.ok(content.includes("User Content"));
        assert.ok(content.includes("BEGIN AG-KIT MANAGED BLOCK: codex-core-rules"));
        assert.ok(content.includes("managed line"));
    });

    test("should update existing managed block in place", () => {
        upsertManagedBlock(targetFile, "codex-core-rules", "v1");
        const result = upsertManagedBlock(targetFile, "codex-core-rules", "v2");

        assert.strictEqual(result.action, "updated");
        const content = fs.readFileSync(targetFile, "utf8");
        assert.ok(content.includes("v2"));
        assert.ok(!content.includes("v1"));
    });
});
