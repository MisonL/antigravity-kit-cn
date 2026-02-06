#!/usr/bin/env node

const { execSync } = require("child_process");

const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";

function parseJsonSafe(raw) {
    try {
        return JSON.parse(raw);
    } catch (err) {
        return null;
    }
}

function readGlobalNpmDependencies() {
    const cmd = "npm ls --global --depth=0 --json --silent";
    let output = "";

    try {
        output = execSync(cmd, {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
    } catch (err) {
        output = typeof err.stdout === "string" ? err.stdout : "";
    }

    if (!output || output.trim() === "") {
        return null;
    }

    const data = parseJsonSafe(output);
    if (!data || typeof data !== "object") {
        return null;
    }

    const deps = data.dependencies;
    if (!deps || typeof deps !== "object") {
        return {};
    }

    return deps;
}

function main() {
    const isGlobalInstall = process.env.npm_config_global === "true";
    if (!isGlobalInstall) {
        return;
    }

    if (process.env.AG_KIT_SKIP_UPSTREAM_CHECK === "1") {
        return;
    }

    const deps = readGlobalNpmDependencies();
    if (!deps) {
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(deps, UPSTREAM_GLOBAL_PACKAGE)) {
        return;
    }

    console.warn(`\n⚠️  检测到全局已安装上游英文版 ${UPSTREAM_GLOBAL_PACKAGE}`);
    console.warn("⚠️  上游英文版与当前中文版共用 `ag-kit` 命令名，后安装者会覆盖命令入口。");
    console.warn(`👉 建议执行: npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}\n`);
}

main();
