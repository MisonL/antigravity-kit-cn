const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const LING_CLI = path.join(REPO_ROOT, "bin", "ling.js");
const AG_KIT_CLI = path.join(REPO_ROOT, "bin", "ag-kit.js");
const pkg = require(path.join(REPO_ROOT, "package.json"));

function runCli(cliPath, args, envOverrides = {}) {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ling-version-test-"));
    const env = {
        ...process.env,
        LING_SKIP_UPSTREAM_CHECK: "1",
        LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        ...envOverrides,
    };

    const result = spawnSync(process.execPath, [cliPath, ...args], {
        cwd: REPO_ROOT,
        env,
        encoding: "utf8",
    });

    fs.rmSync(tempRoot, { recursive: true, force: true });
    return result;
}

test("npm package version should remain SemVer", () => {
    assert.match(pkg.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
});

test("ling --version should print ling- prefixed version tag", () => {
    const result = runCli(LING_CLI, ["--version"]);
    assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    const stdout = String(result.stdout || "").trim();
    assert.strictEqual(stdout, `ling version ling-${pkg.version}`);
    assert.ok(!stdout.includes("[warn]"), "ling entry should not include legacy alias warning");
});

test("ag-kit --version should warn and print ling- prefixed version tag", () => {
    const result = runCli(AG_KIT_CLI, ["--version"]);
    assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    const lines = String(result.stdout || "").trim().split(/\r?\n/);
    assert.ok(lines.some((line) => line.includes("[warn]")), "ag-kit entry should include legacy alias warning");
    assert.strictEqual(lines[lines.length - 1], `ling version ling-${pkg.version}`);
});

