const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { parseArgs, runClean } = require("../scripts/clean");

describe("Clean Script", () => {
    let tempRoot;

    beforeEach(() => {
        tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-clean-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    test("parseArgs should parse dry-run and quiet options", () => {
        const options = parseArgs(["--dry-run", "--quiet"]);
        assert.strictEqual(options.dryRun, true);
        assert.strictEqual(options.quiet, true);
    });

    test("runClean should remove existing generated directories", () => {
        const targetA = path.join(tempRoot, "web", ".next");
        const targetB = path.join(tempRoot, "web", "node_modules");
        fs.mkdirSync(targetA, { recursive: true });
        fs.mkdirSync(targetB, { recursive: true });
        fs.writeFileSync(path.join(targetA, "cache.txt"), "x");
        fs.writeFileSync(path.join(targetB, "dep.txt"), "x");

        const result = runClean({
            rootDir: tempRoot,
            quiet: true,
            targets: ["web/.next", "web/node_modules"],
        });

        assert.strictEqual(result.removedCount, 2);
        assert.ok(!fs.existsSync(targetA));
        assert.ok(!fs.existsSync(targetB));
    });

    test("runClean dry-run should not remove directories", () => {
        const target = path.join(tempRoot, "web", ".next");
        fs.mkdirSync(target, { recursive: true });

        const result = runClean({
            rootDir: tempRoot,
            dryRun: true,
            quiet: true,
            targets: ["web/.next"],
        });

        assert.strictEqual(result.wouldRemoveCount, 1);
        assert.ok(fs.existsSync(target));
    });

    test("runClean should skip missing paths", () => {
        const result = runClean({
            rootDir: tempRoot,
            quiet: true,
            targets: ["web/.next"],
        });

        assert.strictEqual(result.skippedCount, 1);
        assert.strictEqual(result.results[0].reason, "not_found");
    });

    test("package scripts should keep scoped test and clean commands", () => {
        const packageJsonPath = path.resolve(__dirname, "..", "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

        assert.strictEqual(packageJson.scripts.test, "node --test tests");
        assert.strictEqual(packageJson.scripts.clean, "node scripts/clean.js");
    });
});
