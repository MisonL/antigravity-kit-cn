#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const LOCAL_CLI_PATH = path.join(ROOT_DIR, "bin", "ag-kit.js");

function parseArgs(argv) {
    const options = {
        workspace: process.cwd(),
        json: false,
        quiet: false,
        useGlobalCli: false,
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--path") {
            if (i + 1 >= argv.length) {
                throw new Error("--path 需要一个目录参数");
            }
            options.workspace = path.resolve(process.cwd(), argv[++i]);
            continue;
        }
        if (arg === "--json") {
            options.json = true;
            continue;
        }
        if (arg === "--quiet") {
            options.quiet = true;
            continue;
        }
        if (arg === "--use-global-cli") {
            options.useGlobalCli = true;
            continue;
        }
        if (arg === "--help" || arg === "-h") {
            printUsage();
            process.exit(0);
        }
        throw new Error(`未知参数: ${arg}`);
    }

    return options;
}

function printUsage() {
    console.log("用法:");
    console.log("  node scripts/verify-3platform.js [--path <workspace>] [--json] [--quiet] [--use-global-cli]");
    console.log("");
    console.log("说明:");
    console.log("  - 默认调用仓库本地 CLI（node bin/ag-kit.js）。");
    console.log("  - --use-global-cli: 改为调用全局 ag-kit。");
}

function runCommand(command, args, cwd, env) {
    return spawnSync(command, args, {
        cwd,
        env,
        encoding: "utf8",
    });
}

function checkFileExists(checks, id, label, targetPath) {
    const exists = fs.existsSync(targetPath);
    checks.push({
        id,
        label,
        status: exists ? "pass" : "fail",
        detail: exists ? "存在" : `缺失: ${targetPath}`,
    });
    return exists;
}

function checkJsonFile(checks, id, label, targetPath) {
    if (!fs.existsSync(targetPath)) {
        checks.push({
            id,
            label,
            status: "fail",
            detail: `缺失: ${targetPath}`,
        });
        return null;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(targetPath, "utf8"));
        checks.push({
            id,
            label,
            status: "pass",
            detail: "JSON 结构有效",
        });
        return parsed;
    } catch (err) {
        checks.push({
            id,
            label,
            status: "fail",
            detail: `JSON 解析失败: ${err.message}`,
        });
        return null;
    }
}

function collectLocalGeminiRulePaths(workspace) {
    const results = [];
    const candidates = [
        path.join(workspace, ".agents", "rules", "GEMINI.md"),
        path.join(workspace, ".agent", "rules", "GEMINI.md"),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            results.push(candidate);
        }
    }

    const localBackupRoot = path.join(workspace, ".agents-backup");
    if (fs.existsSync(localBackupRoot)) {
        const stack = [localBackupRoot];
        while (stack.length > 0) {
            const current = stack.pop();
            const entries = fs.readdirSync(current, { withFileTypes: true });
            for (const entry of entries) {
                const absPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    stack.push(absPath);
                    continue;
                }
                if (entry.isFile() && entry.name === "GEMINI.md") {
                    results.push(absPath);
                }
            }
        }
    }

    return results;
}

function printHumanReport(report, options) {
    if (options.quiet) {
        return;
    }

    console.log(`\n[verify-3platform] 工作区: ${report.workspace}`);
    console.log(`[verify-3platform] 使用 CLI: ${report.cliMode}`);
    console.log("");

    for (const check of report.checks) {
        const icon = check.status === "pass"
            ? "✅"
            : (check.status === "warn" ? "⚠️" : "❌");
        console.log(`${icon} [${check.id}] ${check.label} - ${check.detail}`);
    }

    console.log("");
    console.log("[manual-runtime]");
    console.log("建议分别在 Codex / Antigravity / Gemini CLI 执行同一提问：");
    console.log("请只返回你当前加载到的规则来源路径（每行一个绝对路径，不解释）。");
    console.log("");
    console.log("分平台验收口径：");
    console.log("1. Codex：通常只显示指令入口 AGENTS.md，这是正常行为。");
    console.log(`   必含: ${path.join(report.workspace, "AGENTS.md")}`);
    console.log("2. Antigravity：通常显示 Global + Project 的 GEMINI 规则上下文。");
    console.log(`   项目规则可表现为: ${path.join(report.workspace, ".agents", "rules", "GEMINI.md")} 或 UI 映射后的等价项目路径`);
    console.log("3. Gemini CLI：通常显示 2~3 条来源（global / extension / project）。");
    console.log(`   项目规则建议含: ${path.join(report.workspace, ".agents", "rules", "GEMINI.md")}`);
    if (report.agentProjectionEnabled) {
        console.log(`4. .agent 投影已启用，可额外出现: ${path.join(report.workspace, ".agent")}`);
    } else {
        console.log("4. .agent 投影已停用，不出现 .agent 相关路径属于预期。");
    }
    console.log("");
    console.log(`[summary] pass=${report.summary.pass} warn=${report.summary.warn} fail=${report.summary.fail}`);
}

function runVerification(rawOptions = {}) {
    const options = {
        workspace: rawOptions.workspace || rawOptions.path || process.cwd(),
        json: !!rawOptions.json,
        quiet: !!rawOptions.quiet,
        useGlobalCli: !!rawOptions.useGlobalCli,
        print: rawOptions.print !== false,
        env: rawOptions.env || process.env,
    };

    const workspace = path.resolve(options.workspace);
    const checks = [];

    if (!fs.existsSync(workspace) || !fs.statSync(workspace).isDirectory()) {
        throw new Error(`工作区不存在或不是目录: ${workspace}`);
    }

    const agKitEnv = {
        ...options.env,
        AG_KIT_SKIP_UPSTREAM_CHECK: options.env.AG_KIT_SKIP_UPSTREAM_CHECK || "1",
    };

    const cliResult = options.useGlobalCli
        ? { command: "ag-kit", argsPrefix: [] }
        : { command: process.execPath, argsPrefix: [LOCAL_CLI_PATH] };
    const cliMode = options.useGlobalCli ? "global ag-kit" : `node ${LOCAL_CLI_PATH}`;

    if (!options.useGlobalCli && !fs.existsSync(LOCAL_CLI_PATH)) {
        throw new Error(`缺少本地 CLI: ${LOCAL_CLI_PATH}`);
    }

    const managedDir = path.join(workspace, ".agents");
    const managedManifestPath = path.join(managedDir, "manifest.json");
    const workspaceAgentsMd = path.join(workspace, "AGENTS.md");
    const geminiSettingsPath = path.join(workspace, ".gemini", "settings.json");
    const localBackupPath = path.join(workspace, ".agents-backup");
    const agentProjectionPath = path.join(workspace, ".agent");

    checkFileExists(checks, "C01", "Canonical 目录 .agents", managedDir);
    const manifest = checkJsonFile(checks, "C02", "Canonical manifest.json", managedManifestPath);
    checkFileExists(checks, "C03", "根 AGENTS.md", workspaceAgentsMd);
    const geminiSettings = checkJsonFile(checks, "C04", ".gemini/settings.json", geminiSettingsPath);

    if (manifest && String(manifest.target || "").toLowerCase() !== "full") {
        checks.push({
            id: "C05",
            label: "manifest target",
            status: "fail",
            detail: `target=${String(manifest.target || "")}，期望 full`,
        });
    } else if (manifest) {
        checks.push({
            id: "C05",
            label: "manifest target",
            status: "pass",
            detail: "target=full",
        });
    }

    if (geminiSettings) {
        const mcpServers = geminiSettings.mcpServers && typeof geminiSettings.mcpServers === "object"
            ? geminiSettings.mcpServers
            : {};
        const hasContext7 = !!mcpServers.context7;
        const hasContext7Backup = !!mcpServers.context7_backup;
        if (hasContext7 && hasContext7Backup) {
            checks.push({
                id: "C06",
                label: "Gemini MCP 主备通道",
                status: "pass",
                detail: "context7 + context7_backup 均存在",
            });
        } else {
            checks.push({
                id: "C06",
                label: "Gemini MCP 主备通道",
                status: "fail",
                detail: `缺失通道: ${[
                    hasContext7 ? "" : "context7",
                    hasContext7Backup ? "" : "context7_backup",
                ].filter(Boolean).join(", ")}`,
            });
        }
    }

    const statusCmd = runCommand(
        cliResult.command,
        [...cliResult.argsPrefix, "status", "--path", workspace, "--quiet"],
        ROOT_DIR,
        agKitEnv,
    );
    if (statusCmd.status === 0 && (statusCmd.stdout || "").trim() === "installed") {
        checks.push({
            id: "R01",
            label: "ag-kit status",
            status: "pass",
            detail: "installed",
        });
    } else {
        checks.push({
            id: "R01",
            label: "ag-kit status",
            status: "fail",
            detail: (statusCmd.stderr || statusCmd.stdout || "执行失败").trim(),
        });
    }

    const doctorCmd = runCommand(
        cliResult.command,
        [...cliResult.argsPrefix, "doctor", "--path", workspace, "--quiet"],
        ROOT_DIR,
        agKitEnv,
    );
    checks.push({
        id: "R02",
        label: "ag-kit doctor",
        status: doctorCmd.status === 0 ? "pass" : "fail",
        detail: doctorCmd.status === 0
            ? "通过"
            : (doctorCmd.stderr || doctorCmd.stdout || "执行失败").trim(),
    });

    const rollbackCmd = runCommand(
        cliResult.command,
        [...cliResult.argsPrefix, "rollback", "--path", workspace, "--dry-run", "--quiet"],
        ROOT_DIR,
        agKitEnv,
    );
    const rollbackOutput = `${rollbackCmd.stdout || ""}\n${rollbackCmd.stderr || ""}`;
    if (rollbackCmd.status === 0) {
        checks.push({
            id: "R03",
            label: "ag-kit rollback --dry-run",
            status: "pass",
            detail: "可用",
        });
    } else if (rollbackOutput.includes("未找到可用回退快照")) {
        checks.push({
            id: "R03",
            label: "ag-kit rollback --dry-run",
            status: "warn",
            detail: "当前无可用快照，可先执行一次 update/update-all 生成",
        });
    } else {
        checks.push({
            id: "R03",
            label: "ag-kit rollback --dry-run",
            status: "fail",
            detail: rollbackOutput.trim() || "执行失败",
        });
    }

    if (fs.existsSync(localBackupPath)) {
        checks.push({
            id: "W01",
            label: "本地 .agents-backup",
            status: "warn",
            detail: `检测到旧本地备份目录: ${localBackupPath}`,
        });
    } else {
        checks.push({
            id: "W01",
            label: "本地 .agents-backup",
            status: "pass",
            detail: "未检测到（符合 v3 设计）",
        });
    }

    const geminiRulePaths = collectLocalGeminiRulePaths(workspace);
    if (geminiRulePaths.length > 1) {
        checks.push({
            id: "W02",
            label: "GEMINI.md 重复风险",
            status: "warn",
            detail: `检测到 ${geminiRulePaths.length} 份（建议停用 .agent 投影或清理旧备份）`,
            paths: geminiRulePaths,
        });
    } else {
        checks.push({
            id: "W02",
            label: "GEMINI.md 重复风险",
            status: "pass",
            detail: `检测到 ${geminiRulePaths.length} 份（符合预期）`,
            paths: geminiRulePaths,
        });
    }

    const summary = checks.reduce((acc, check) => {
        if (check.status === "pass") acc.pass += 1;
        else if (check.status === "warn") acc.warn += 1;
        else acc.fail += 1;
        return acc;
    }, { pass: 0, warn: 0, fail: 0 });

    const report = {
        workspace,
        cliMode,
        agentProjectionEnabled: fs.existsSync(agentProjectionPath),
        checks,
        summary,
        generatedAt: new Date().toISOString(),
    };

    if (options.print) {
        if (options.json) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            printHumanReport(report, options);
        }
    }

    return report;
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    const report = runVerification(options);
    if (report.summary.fail > 0) {
        process.exitCode = 1;
    }
}

module.exports = {
    parseArgs,
    printUsage,
    runVerification,
    printHumanReport,
};

if (require.main === module) {
    try {
        main();
    } catch (err) {
        console.error(`❌ ${err.message}`);
        process.exit(1);
    }
}
