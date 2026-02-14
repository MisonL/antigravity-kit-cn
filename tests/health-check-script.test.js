const { test, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

describe("Health Check Script", () => {
    test("health-check script should exist and be executable", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        assert.ok(fs.existsSync(scriptPath), "missing scripts/health-check.sh");
        fs.accessSync(scriptPath, fs.constants.X_OK);
    });

    test("health-check script should pass bash syntax check", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        const result = spawnSync("bash", ["-n", scriptPath], { encoding: "utf8" });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("package scripts should expose health-check command", () => {
        const packageJsonPath = path.resolve(__dirname, "..", "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        assert.strictEqual(packageJson.scripts["health-check"], "bash scripts/health-check.sh");
    });
});
