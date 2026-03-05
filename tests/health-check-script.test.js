const { test, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

function commandExists(command) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8" });
    return !result.error && result.status === 0;
}

describe("Health Check Script", () => {
    test("health-check.js should exist", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.js");
        assert.ok(fs.existsSync(scriptPath), "missing scripts/health-check.js");
        assert.ok(fs.statSync(scriptPath).isFile(), "scripts/health-check.js should be a file");
    });

    test("health-check.sh should exist (unix helper)", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        assert.ok(fs.existsSync(scriptPath), "missing scripts/health-check.sh");
        assert.ok(fs.statSync(scriptPath).isFile(), "scripts/health-check.sh should be a file");
    });

    test("health-check.sh should be executable on unix", { skip: process.platform === "win32" }, () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        fs.accessSync(scriptPath, fs.constants.X_OK);
    });

    test(
        "health-check.sh should pass bash syntax check",
        { skip: process.platform === "win32" || !commandExists("bash") },
        () => {
            const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
            const result = spawnSync("bash", ["-n", scriptPath], { encoding: "utf8" });
            assert.strictEqual(result.status, 0, result.stderr || result.stdout);
        }
    );

    test("package scripts should expose health-check command", () => {
        const packageJsonPath = path.resolve(__dirname, "..", "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        assert.strictEqual(packageJson.scripts["health-check"], "node scripts/health-check.js");
    });
});
