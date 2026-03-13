const { test, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");
const HAS_BASH = (() => {
    const probe = spawnSync("bash", ["--version"], { encoding: "utf8" });
    return !probe.error && probe.status === 0;
})();

describe("Health Check Script", () => {
    test("health-check script should exist and be executable", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        assert.ok(fs.existsSync(scriptPath), "missing scripts/health-check.sh");
        fs.accessSync(scriptPath, fs.constants.X_OK);
    });

    test("health-check node entry should exist", () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.js");
        assert.ok(fs.existsSync(scriptPath), "missing scripts/health-check.js");
    });

    test("health-check script should pass bash syntax check when bash is available", { skip: !HAS_BASH }, () => {
        const scriptPath = path.resolve(__dirname, "..", "scripts", "health-check.sh");
        const result = spawnSync("bash", ["-n", scriptPath], { encoding: "utf8" });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("package scripts should expose health-check command", () => {
        const packageJsonPath = path.resolve(__dirname, "..", "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        assert.strictEqual(packageJson.scripts["health-check"], "node scripts/health-check.js");
    });
});
