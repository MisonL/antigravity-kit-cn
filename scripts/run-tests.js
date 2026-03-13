#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const TESTS_DIR = path.join(ROOT_DIR, "tests");

function collectTestFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectTestFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".test.js")) {
            files.push(fullPath);
        }
    }

    return files.sort();
}

function main() {
    const testFiles = collectTestFiles(TESTS_DIR);
    if (testFiles.length === 0) {
        console.error("未找到测试文件");
        process.exit(1);
    }

    const result = spawnSync(process.execPath, ["--test", ...testFiles], {
        cwd: ROOT_DIR,
        stdio: "inherit",
    });

    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }

    process.exit(result.status || 0);
}

main();
