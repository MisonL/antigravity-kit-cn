#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const pkg = require("../package.json");

const REPO_URL = "https://github.com/MisonL/antigravity-kit-cn.git";
const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agent");
const WORKSPACE_INDEX_VERSION = 1;

function nowISO() {
    return new Date().toISOString();
}

function getWorkspaceIndexPath() {
    const customPath = process.env.AG_KIT_INDEX_PATH;
    if (customPath) {
        return path.resolve(process.cwd(), customPath);
    }
    return path.join(os.homedir(), ".ag-kit", "workspaces.json");
}

function createEmptyWorkspaceIndex() {
    return {
        version: WORKSPACE_INDEX_VERSION,
        updatedAt: "",
        workspaces: [],
    };
}

function printUsage() {
    console.log("用法:");
    console.log("  ag-kit init [--force] [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
    console.log("  ag-kit update [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
    console.log("  ag-kit update-all [--branch <name>] [--prune-missing] [--quiet] [--dry-run]");
    console.log("  ag-kit status [--path <dir>] [--quiet]");
}

function parseArgs(argv) {
    if (argv.length === 0) {
        return { command: "", options: {} };
    }

    const command = argv[0];
    const options = {
        force: false,
        quiet: false,
        dryRun: false,
        pruneMissing: false,
        path: "",
        branch: "",
    };

    for (let i = 1; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--force") {
            options.force = true;
        } else if (arg === "--quiet") {
            options.quiet = true;
        } else if (arg === "--dry-run") {
            options.dryRun = true;
        } else if (arg === "--prune-missing") {
            options.pruneMissing = true;
        } else if (arg === "--path") {
            if (i + 1 >= argv.length) {
                throw new Error("--path 需要一个目录参数");
            }
            options.path = argv[++i];
        } else if (arg === "--branch") {
            if (i + 1 >= argv.length) {
                throw new Error("--branch 需要一个分支名参数");
            }
            options.branch = argv[++i];
        } else {
            throw new Error(`未知参数: ${arg}`);
        }
    }

    return { command, options };
}

function resolveWorkspaceRoot(customPath) {
    if (!customPath) {
        return process.cwd();
    }
    return path.resolve(process.cwd(), customPath);
}

function log(options, message) {
    if (!options.quiet) {
        console.log(message);
    }
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function readWorkspaceIndex() {
    const indexPath = getWorkspaceIndexPath();
    if (!fs.existsSync(indexPath)) {
        return { indexPath, index: createEmptyWorkspaceIndex() };
    }

    const raw = fs.readFileSync(indexPath, "utf8").trim();
    if (!raw) {
        return { indexPath, index: createEmptyWorkspaceIndex() };
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        throw new Error(`工作区索引文件解析失败: ${indexPath}`);
    }

    const normalized = createEmptyWorkspaceIndex();
    normalized.version = WORKSPACE_INDEX_VERSION;
    normalized.updatedAt = typeof parsed.updatedAt === "string" ? parsed.updatedAt : "";

    const records = Array.isArray(parsed.workspaces) ? parsed.workspaces : [];
    const dedupMap = new Map();

    for (const item of records) {
        if (!item || typeof item.path !== "string" || item.path.trim() === "") {
            continue;
        }

        const workspacePath = path.resolve(item.path);
        dedupMap.set(workspacePath, {
            path: workspacePath,
            installedAt: typeof item.installedAt === "string" ? item.installedAt : "",
            lastUpdatedAt: typeof item.lastUpdatedAt === "string" ? item.lastUpdatedAt : "",
            cliVersion: typeof item.cliVersion === "string" ? item.cliVersion : "",
        });
    }

    normalized.workspaces = Array.from(dedupMap.values()).sort((a, b) => a.path.localeCompare(b.path));
    return { indexPath, index: normalized };
}

function writeWorkspaceIndex(indexPath, index) {
    const payload = {
        version: WORKSPACE_INDEX_VERSION,
        updatedAt: index.updatedAt || nowISO(),
        workspaces: Array.isArray(index.workspaces) ? index.workspaces : [],
    };

    payload.workspaces = payload.workspaces
        .filter((item) => item && typeof item.path === "string" && item.path.trim() !== "")
        .map((item) => ({
            path: path.resolve(item.path),
            installedAt: typeof item.installedAt === "string" ? item.installedAt : "",
            lastUpdatedAt: typeof item.lastUpdatedAt === "string" ? item.lastUpdatedAt : "",
            cliVersion: typeof item.cliVersion === "string" ? item.cliVersion : "",
        }))
        .sort((a, b) => a.path.localeCompare(b.path));

    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function registerWorkspaceIndex(workspaceRoot, options) {
    const normalizedPath = path.resolve(workspaceRoot);
    const { indexPath, index } = readWorkspaceIndex();
    const time = nowISO();

    let inserted = true;
    index.workspaces = index.workspaces.map((item) => {
        if (item.path !== normalizedPath) {
            return item;
        }
        inserted = false;
        return {
            path: normalizedPath,
            installedAt: item.installedAt || time,
            lastUpdatedAt: time,
            cliVersion: pkg.version,
        };
    });

    if (inserted) {
        index.workspaces.push({
            path: normalizedPath,
            installedAt: time,
            lastUpdatedAt: time,
            cliVersion: pkg.version,
        });
    }

    index.updatedAt = time;
    writeWorkspaceIndex(indexPath, index);

    if (!options.silentIndexLog) {
        if (inserted) {
            log(options, `🗂️ 已登记工作区到全局索引: ${normalizedPath}`);
        } else {
            log(options, `🗂️ 已刷新工作区索引记录: ${normalizedPath}`);
        }
        log(options, `   索引文件: ${indexPath}`);
    }
}

function isAgentIgnoreRule(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) {
        return false;
    }

    let pattern = trimmed;

    while (pattern.startsWith("**/")) {
        pattern = pattern.slice(3);
    }
    while (pattern.startsWith("/")) {
        pattern = pattern.slice(1);
    }
    while (pattern.endsWith("/")) {
        pattern = pattern.slice(0, -1);
    }
    while (pattern.endsWith("/**")) {
        pattern = pattern.slice(0, -3);
    }

    if (!pattern) {
        return false;
    }

    const segments = pattern.split("/");
    return segments.some((segment) => segment === ".agent");
}

function removeAgentIgnoreRules(workspaceRoot, options) {
    const gitIgnorePath = path.join(workspaceRoot, ".gitignore");
    if (!fs.existsSync(gitIgnorePath)) {
        return { fileExists: false, removedCount: 0, dryRun: options.dryRun };
    }

    const original = fs.readFileSync(gitIgnorePath, "utf8");
    const lineEnding = original.includes("\r\n") ? "\r\n" : "\n";
    const hadTrailingNewline = /\r?\n$/.test(original);
    const lines = original.split(/\r?\n/);

    const kept = [];
    let removedCount = 0;

    for (const line of lines) {
        if (isAgentIgnoreRule(line)) {
            removedCount += 1;
            continue;
        }
        kept.push(line);
    }

    if (removedCount === 0) {
        return { fileExists: true, removedCount: 0, dryRun: options.dryRun };
    }

    let updated = kept.join(lineEnding);
    if (hadTrailingNewline) {
        updated += lineEnding;
    }

    if (!options.dryRun) {
        fs.writeFileSync(gitIgnorePath, updated, "utf8");
    }

    return { fileExists: true, removedCount, dryRun: options.dryRun };
}

function logGitIgnoreCleanup(workspaceRoot, cleanupResult, options) {
    const gitIgnorePath = path.join(workspaceRoot, ".gitignore");

    if (!cleanupResult.fileExists) {
        log(options, "ℹ️ 未发现 .gitignore，跳过 Git 忽略规则扫描。");
        return;
    }

    if (cleanupResult.removedCount === 0) {
        log(options, "ℹ️ Git 忽略规则检查完成：未发现会忽略 .agent 的规则。");
        return;
    }

    if (cleanupResult.dryRun) {
        log(
            options,
            `[dry-run] 将从 ${gitIgnorePath} 移除 ${cleanupResult.removedCount} 条 .agent 忽略规则。`,
        );
        return;
    }

    log(options, `🧹 已从 ${gitIgnorePath} 移除 ${cleanupResult.removedCount} 条 .agent 忽略规则。`);
    log(options, "✅ 已确保 .agent 不会因 .gitignore 配置而失效。");
}

function cloneBranchAgentDir(branch, options) {
    const safeBranch = branch.trim();
    if (!/^[A-Za-z0-9._/-]+$/.test(safeBranch)) {
        throw new Error(`非法分支名: ${branch}`);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-"));
    log(options, `📥 正在从 ${REPO_URL} 拉取分支 ${safeBranch} ...`);

    try {
        execSync(`git clone --depth 1 --branch ${safeBranch} ${REPO_URL} "${tempDir}"`, {
            stdio: options.quiet ? "ignore" : "pipe",
        });
    } catch (err) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`无法拉取分支 ${safeBranch}，请确认分支存在且网络可用`);
    }

    const clonedAgentDir = path.join(tempDir, ".agent");
    if (!fs.existsSync(clonedAgentDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`分支 ${safeBranch} 中未找到 .agent 目录`);
    }

    return {
        agentDir: clonedAgentDir,
        cleanup: () => fs.rmSync(tempDir, { recursive: true, force: true }),
    };
}

function installAgent(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targetDir = path.join(workspaceRoot, ".agent");
    let sourceDir = BUNDLED_AGENT_DIR;
    let cleanup = null;

    if (options.branch) {
        const remote = cloneBranchAgentDir(options.branch, options);
        sourceDir = remote.agentDir;
        cleanup = remote.cleanup;
    }

    try {
        if (!fs.existsSync(sourceDir)) {
            throw new Error(`未找到模板目录: ${sourceDir}`);
        }

        log(options, "🚀 正在初始化 Antigravity Kit ...");
        log(options, `📂 目标目录: ${workspaceRoot}`);

        if (fs.existsSync(targetDir)) {
            if (!options.force) {
                throw new Error(".agent 目录已存在。请使用 --force 覆盖。");
            }
            if (options.dryRun) {
                log(options, `[dry-run] 将删除: ${targetDir}`);
            } else {
                fs.rmSync(targetDir, { recursive: true, force: true });
                log(options, `🗑️  已删除旧目录: ${targetDir}`);
            }
        }

        if (options.dryRun) {
            log(options, `[dry-run] 将复制: ${sourceDir} -> ${targetDir}`);
            const cleanupPreview = removeAgentIgnoreRules(workspaceRoot, options);
            logGitIgnoreCleanup(workspaceRoot, cleanupPreview, options);
            if (options.manageIndex !== false) {
                log(options, `[dry-run] 将登记工作区到全局索引: ${workspaceRoot}`);
            }
            log(options, "✅ dry-run 完成，未写入任何文件。");
            return;
        }

        fs.mkdirSync(workspaceRoot, { recursive: true });
        copyDir(sourceDir, targetDir);
        const cleanupResult = removeAgentIgnoreRules(workspaceRoot, options);
        logGitIgnoreCleanup(workspaceRoot, cleanupResult, options);
        if (options.manageIndex !== false) {
            registerWorkspaceIndex(workspaceRoot, options);
        }
        log(options, "✅ .agent 已安装完成");
        log(options, '👉 现在可以使用 "/brainstorm", "/create" 等命令');
    } finally {
        if (cleanup) {
            cleanup();
        }
    }
}

function commandInit(options) {
    installAgent(options);
}

function commandUpdate(options) {
    const merged = { ...options, force: true };
    log(merged, "🔄 正在更新 Antigravity Kit ...");
    installAgent(merged);
}

function commandUpdateAll(options) {
    if (options.path) {
        throw new Error("update-all 不支持 --path，请直接执行 ag-kit update-all");
    }

    const { indexPath, index } = readWorkspaceIndex();
    const records = index.workspaces || [];

    if (records.length === 0) {
        log(options, "ℹ️ 全局索引为空，没有可批量更新的工作区。");
        log(options, "   先在项目中执行 ag-kit init 或 ag-kit update 建立索引。");
        return;
    }

    log(options, `🔄 开始批量更新工作区（共 ${records.length} 个）...`);
    log(options, `📚 索引文件: ${indexPath}`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;
    let removed = 0;
    const timestamp = nowISO();
    const nextRecords = [];

    for (let i = 0; i < records.length; i++) {
        const item = records[i];
        const workspacePath = path.resolve(item.path);
        const agentDir = path.join(workspacePath, ".agent");

        if (!fs.existsSync(workspacePath)) {
            if (options.pruneMissing) {
                removed += 1;
                log(options, `🧽 [${i + 1}/${records.length}] 已移除失效工作区索引: ${workspacePath}`);
            } else {
                skipped += 1;
                log(options, `⏭️ [${i + 1}/${records.length}] 工作区不存在，已跳过: ${workspacePath}`);
                nextRecords.push(item);
            }
            continue;
        }

        if (!fs.existsSync(agentDir)) {
            skipped += 1;
            log(options, `⏭️ [${i + 1}/${records.length}] 未检测到 .agent，已跳过: ${workspacePath}`);
            nextRecords.push(item);
            continue;
        }

        log(options, `📦 [${i + 1}/${records.length}] 更新: ${workspacePath}`);

        try {
            const runOptions = {
                ...options,
                force: true,
                path: workspacePath,
                manageIndex: false,
            };
            installAgent(runOptions);
            updated += 1;
            nextRecords.push({
                path: workspacePath,
                installedAt: item.installedAt || timestamp,
                lastUpdatedAt: timestamp,
                cliVersion: pkg.version,
            });
        } catch (err) {
            failed += 1;
            nextRecords.push(item);
            if (!options.quiet) {
                console.error(`❌ 更新失败: ${workspacePath}`);
                console.error(`   ${err.message}`);
            }
        }
    }

    if (!options.dryRun) {
        index.workspaces = nextRecords;
        index.updatedAt = timestamp;
        writeWorkspaceIndex(indexPath, index);
    }

    log(options, "📊 批量更新完成");
    log(options, `   成功: ${updated}`);
    log(options, `   跳过: ${skipped}`);
    log(options, `   失败: ${failed}`);
    if (options.pruneMissing) {
        log(options, `   清理失效索引: ${removed}`);
    }

    if (failed > 0) {
        process.exitCode = 1;
    }
}

function countFilesIfExists(dir, filterFn) {
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).filter(filterFn).length;
}

function commandStatus(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const agentDir = path.join(workspaceRoot, ".agent");

    if (!fs.existsSync(agentDir)) {
        if (!options.quiet) {
            console.log("❌ 未检测到 .agent 安装");
            console.log(`   目标目录: ${workspaceRoot}`);
        }
        process.exitCode = 1;
        return;
    }

    const agentsCount = countFilesIfExists(path.join(agentDir, "agents"), (name) => name.endsWith(".md"));
    const workflowsCount = countFilesIfExists(path.join(agentDir, "workflows"), (name) => name.endsWith(".md"));
    const skillsCount = fs.existsSync(path.join(agentDir, "skills"))
        ? execSync(`find "${path.join(agentDir, "skills")}" -name SKILL.md | wc -l`, { encoding: "utf8" }).trim()
        : "0";

    if (options.quiet) {
        console.log("installed");
        return;
    }

    console.log("✅ Antigravity Kit 已安装");
    console.log(`   版本: ${pkg.version}`);
    console.log(`   路径: ${agentDir}`);
    console.log(`   Agents: ${agentsCount}`);
    console.log(`   Skills: ${skillsCount}`);
    console.log(`   Workflows: ${workflowsCount}`);
}

function main() {
    try {
        const { command, options } = parseArgs(process.argv.slice(2));

        if (!command) {
            printUsage();
            process.exitCode = 1;
            return;
        }

        if (command === "init") {
            commandInit(options);
            return;
        }

        if (command === "update") {
            commandUpdate(options);
            return;
        }

        if (command === "update-all") {
            commandUpdateAll(options);
            return;
        }

        if (command === "status") {
            commandStatus(options);
            return;
        }

        console.error(`未知命令: ${command}`);
        printUsage();
        process.exitCode = 1;
    } catch (err) {
        console.error(`❌ ${err.message}`);
        process.exitCode = 1;
    }
}

main();
