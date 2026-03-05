const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ag-kit.js");
const VERIFY_SCRIPT_PATH = path.join(REPO_ROOT, "scripts", "verify-3platform.js");

function runNode(args, options = {}) {
    return spawnSync(process.execPath, args, {
        cwd: options.cwd || REPO_ROOT,
        env: options.env || process.env,
        encoding: "utf8",
    });
}

describe("verify-3platform script", () => {
    let tempDir;
    let workspaceDir;
    let indexPath;
    let migrationStatePath;
    let backupRoot;
    let testEnv;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-verify3-test-"));
        workspaceDir = path.join(tempDir, "workspace");
        indexPath = path.join(tempDir, "workspaces.json");
        migrationStatePath = path.join(tempDir, "migration-v3.json");
        backupRoot = path.join(tempDir, "backups");
        fs.mkdirSync(workspaceDir, { recursive: true });
        testEnv = {
            ...process.env,
            AG_KIT_SKIP_UPSTREAM_CHECK: "1",
            AG_KIT_INDEX_PATH: indexPath,
            AG_KIT_MIGRATION_STATE_PATH: migrationStatePath,
            AG_KIT_BACKUP_ROOT: backupRoot,
            AG_KIT_CONFIG_PATH: path.join(tempDir, "config.json"),
        };
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("should pass on a valid initialized workspace", () => {
        const initResult = runNode(
            [CLI_PATH, "init", "--path", workspaceDir, "--quiet"],
            { env: testEnv },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        const verifyResult = runNode(
            [VERIFY_SCRIPT_PATH, "--path", workspaceDir, "--json"],
            { env: testEnv },
        );
        assert.strictEqual(verifyResult.status, 0, verifyResult.stderr || verifyResult.stdout);

        const report = JSON.parse(verifyResult.stdout);
        assert.strictEqual(report.summary.fail, 0);
        assert.ok(report.checks.some((check) => check.id === "C02" && check.status === "pass"));
        assert.ok(report.checks.some((check) => check.id === "R02" && check.status === "pass"));
    });

    test("should fail on empty non-installed workspace", () => {
        const verifyResult = runNode(
            [VERIFY_SCRIPT_PATH, "--path", workspaceDir, "--json"],
            { env: testEnv },
        );
        assert.notStrictEqual(verifyResult.status, 0, "empty workspace must fail verification");

        const report = JSON.parse(verifyResult.stdout);
        assert.ok(report.summary.fail > 0);
        assert.ok(report.checks.some((check) => check.id === "C01" && check.status === "fail"));
    });
});
