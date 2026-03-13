const { test, describe } = require("node:test");
const assert = require("node:assert");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";

describe("Package Tarball", () => {
    test("npm pack --dry-run should include maintenance scripts and tests", () => {
        const result = spawnSync(NPM_COMMAND, ["pack", "--json", "--dry-run"], {
            cwd: REPO_ROOT,
            encoding: "utf8",
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const payload = JSON.parse(result.stdout);
        assert.ok(Array.isArray(payload) && payload.length > 0, "missing npm pack json payload");

        const files = new Set(payload[0].files.map((item) => item.path));
        assert.ok(files.has("scripts/clean.js"), "tarball missing scripts/clean.js");
        assert.ok(files.has("scripts/ci-verify.js"), "tarball missing scripts/ci-verify.js");
        assert.ok(files.has("scripts/health-check.js"), "tarball missing scripts/health-check.js");
        assert.ok(files.has("scripts/health-check.sh"), "tarball missing scripts/health-check.sh");
        assert.ok(files.has("scripts/run-tests.js"), "tarball missing scripts/run-tests.js");
        assert.ok(files.has("tests/cli-smoke.test.js"), "tarball missing tests/cli-smoke.test.js");
        assert.ok(files.has("tests/global-sync.test.js"), "tarball missing tests/global-sync.test.js");
    });
});
