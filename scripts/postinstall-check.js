#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";

const { readGlobalNpmDependencies } = require("../bin/utils");

function canPromptUser() {
    return Boolean(input.isTTY && output.isTTY);
}

function askQuestion(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input, output });
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function parseYesNo(answer, defaultYes) {
    const text = String(answer || "").trim().toLowerCase();
    if (!text) {
        return defaultYes;
    }
    if (["y", "yes", "1", "true", "是"].includes(text)) {
        return true;
    }
    if (["n", "no", "0", "false", "否"].includes(text)) {
        return false;
    }
    return defaultYes;
}

async function askForUninstallConfirmation() {
    const answer = await askQuestion(`是否现在自动卸载 ${UPSTREAM_GLOBAL_PACKAGE}？[Y/n]: `);
    return parseYesNo(answer, true);
}

function uninstallUpstreamPackage() {
    try {
        execSync(`npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}`, {
            stdio: "inherit",
        });
        return true;
    } catch (err) {
        return false;
    }
}

async function main() {
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

    console.warn(`\n[warn] 检测到全局已安装上游英文版 ${UPSTREAM_GLOBAL_PACKAGE}`);
    console.warn("[warn] 上游英文版与当前中文版共用 `ag-kit` 命令名，后安装者会覆盖命令入口。");
    console.warn("[warn] 为避免后续混淆，建议仅保留一个来源。\n");

    if (!canPromptUser()) {
        console.warn("[info] 当前环境不是交互式终端，无法确认是否自动卸载。");
        console.warn(`[hint] 如需卸载，请手动执行: npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}`);
        console.warn("[info] 本次将继续安装；安装完成后由最后安装的版本接管 `ag-kit` 命令。\n");
        return;
    }

    const shouldUninstall = await askForUninstallConfirmation();

    if (!shouldUninstall) {
        console.warn(`[info] 已保留 ${UPSTREAM_GLOBAL_PACKAGE}，继续安装当前版本。`);
        console.warn("[info] 结果说明：`ag-kit` 命令由最后安装的包生效。\n");
        return;
    }

    console.warn(`\n[clean] 正在卸载 ${UPSTREAM_GLOBAL_PACKAGE} ...`);
    const ok = uninstallUpstreamPackage();

    if (ok) {
        console.warn(`[ok] 已卸载 ${UPSTREAM_GLOBAL_PACKAGE}，继续安装当前版本。\n`);
        return;
    }

    console.warn(`[error] 自动卸载 ${UPSTREAM_GLOBAL_PACKAGE} 失败，将继续安装当前版本。`);
    console.warn("[info] 若需手动处理，请执行：");
    console.warn(`   npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}`);
    console.warn("[info] 安装完成后，`ag-kit` 命令仍由最后安装的版本生效。\n");
}

main().catch((err) => {
    console.warn("[warn] postinstall 冲突检测出现异常，已跳过，不影响安装继续。");
    if (err && err.message) {
        console.warn(`   ${err.message}`);
    }
});
