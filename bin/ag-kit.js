#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const pkg = require("../package.json");

const REPO_URL = "https://github.com/MisonL/antigravity-kit-cn.git";
const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agent");
const WORKSPACE_INDEX_VERSION = 1;
const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";

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
        excludedPaths: [],
    };
}

function printUsage() {
    console.log("用法:");
    console.log("  ag-kit init [--force] [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
    console.log("  ag-kit update [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
    console.log("  ag-kit update-all [--branch <name>] [--prune-missing] [--quiet] [--dry-run]");
    console.log("  ag-kit exclude list [--quiet]");
    console.log("  ag-kit exclude add --path <dir> [--dry-run] [--quiet]");
    console.log("  ag-kit exclude remove --path <dir> [--dry-run] [--quiet]");
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
        subcommand: "",
        path: "",
        branch: "",
    };

    let startIndex = 1;
    if (command === "exclude") {
        if (argv.length > 1 && !argv[1].startsWith("--")) {
            options.subcommand = argv[1];
            startIndex = 2;
        } else {
            options.subcommand = "list";
            startIndex = 1;
        }
    }

    for (let i = startIndex; i < argv.length; i++) {
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

function maybeWarnUpstreamGlobalConflict(command, options) {
    if (options.quiet) {
        return;
    }
    if (process.env.AG_KIT_SKIP_UPSTREAM_CHECK === "1") {
        return;
    }
    if (command !== "init" && command !== "update" && command !== "update-all") {
        return;
    }

    const deps = readGlobalNpmDependencies();
    if (!deps) {
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(deps, UPSTREAM_GLOBAL_PACKAGE)) {
        return;
    }

    log(options, `⚠️ 检测到全局已安装上游英文版 ${UPSTREAM_GLOBAL_PACKAGE}。`);
    log(options, "⚠️ 上游英文版与当前中文版共用 `ag-kit` 命令名，后安装者会覆盖命令入口。");
    log(options, `👉 建议执行: npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}`);
}

function normalizePathList(items) {
    const set = new Set();
    for (const item of items) {
        if (typeof item !== "string" || item.trim() === "") {
            continue;
        }
        set.add(path.resolve(item));
    }
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
}

function isPathInOrUnder(basePath, targetPath) {
    if (targetPath === basePath) {
        return true;
    }
    const prefix = basePath.endsWith(path.sep) ? basePath : `${basePath}${path.sep}`;
    return targetPath.startsWith(prefix);
}

function isPathExcludedByList(excludedPaths, workspacePath) {
    return excludedPaths.some((excludedPath) => isPathInOrUnder(excludedPath, workspacePath));
}

function isToolkitSourceDirectory(workspacePath) {
    const packageJsonPath = path.join(workspacePath, "package.json");
    const cliPath = path.join(workspacePath, "bin", "ag-kit.js");

    if (!fs.existsSync(packageJsonPath) || !fs.existsSync(cliPath)) {
        return false;
    }

    try {
        const content = fs.readFileSync(packageJsonPath, "utf8");
        const parsed = JSON.parse(content);
        const name = typeof parsed.name === "string" ? parsed.name : "";
        return name === "antigravity-kit-cn" || name === "antigravity-kit";
    } catch (err) {
        return false;
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
    const excluded = Array.isArray(parsed.excludedPaths) ? parsed.excludedPaths : [];
    normalized.excludedPaths = normalizePathList(excluded);
    return { indexPath, index: normalized };
}

function writeWorkspaceIndex(indexPath, index) {
    const payload = {
        version: WORKSPACE_INDEX_VERSION,
        updatedAt: index.updatedAt || nowISO(),
        workspaces: Array.isArray(index.workspaces) ? index.workspaces : [],
        excludedPaths: normalizePathList(Array.isArray(index.excludedPaths) ? index.excludedPaths : []),
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

function evaluateWorkspaceExclusion(index, workspaceRoot) {
    const normalizedPath = path.resolve(workspaceRoot);
    const excludedPaths = Array.isArray(index.excludedPaths) ? index.excludedPaths : [];

    if (isPathExcludedByList(excludedPaths, normalizedPath)) {
        return {
            excluded: true,
            code: "user_excluded",
            reason: "命中用户排除清单",
            path: normalizedPath,
        };
    }

    if (isToolkitSourceDirectory(normalizedPath)) {
        return {
            excluded: true,
            code: "default_source",
            reason: "检测为 antigravity-kit 源码目录（默认排除）",
            path: normalizedPath,
        };
    }

    return {
        excluded: false,
        code: "",
        reason: "",
        path: normalizedPath,
    };
}

function removeWorkspaceRecord(index, workspaceRoot) {
    const normalizedPath = path.resolve(workspaceRoot);
    const before = index.workspaces.length;
    index.workspaces = index.workspaces.filter((item) => item.path !== normalizedPath);
    return before - index.workspaces.length;
}

function previewWorkspaceIndexRegistration(workspaceRoot, options) {
    const { indexPath, index } = readWorkspaceIndex();
    const exclusion = evaluateWorkspaceExclusion(index, workspaceRoot);
    const normalizedPath = path.resolve(workspaceRoot);

    if (exclusion.excluded) {
        const removedCount = index.workspaces.filter((item) => item.path === normalizedPath).length;
        log(options, `[dry-run] 索引登记已跳过: ${exclusion.reason}`);
        if (removedCount > 0) {
            log(options, `[dry-run] 将从索引中移除已存在记录: ${normalizedPath}`);
        }
        return;
    }

    const exists = index.workspaces.some((item) => item.path === normalizedPath);
    if (exists) {
        log(options, `[dry-run] 将刷新工作区索引记录: ${normalizedPath}`);
    } else {
        log(options, `[dry-run] 将登记工作区到全局索引: ${normalizedPath}`);
    }
    log(options, `[dry-run] 索引文件: ${indexPath}`);
}

function registerWorkspaceIndex(workspaceRoot, options) {
    const normalizedPath = path.resolve(workspaceRoot);
    const { indexPath, index } = readWorkspaceIndex();
    const time = nowISO();
    const exclusion = evaluateWorkspaceExclusion(index, normalizedPath);

    if (exclusion.excluded) {
        const removedCount = removeWorkspaceRecord(index, normalizedPath);
        if (removedCount > 0) {
            index.updatedAt = time;
            writeWorkspaceIndex(indexPath, index);
        }

        if (!options.silentIndexLog) {
            log(options, `⏭️ 已跳过索引登记: ${normalizedPath}`);
            log(options, `   原因: ${exclusion.reason}`);
            if (removedCount > 0) {
                log(options, `🧹 已清理旧索引记录: ${normalizedPath}`);
            }
            log(options, `   索引文件: ${indexPath}`);
        }
        return;
    }

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
                previewWorkspaceIndexRegistration(workspaceRoot, options);
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
    let removedMissing = 0;
    let removedExcluded = 0;
    const timestamp = nowISO();
    const nextRecords = [];

    for (let i = 0; i < records.length; i++) {
        const item = records[i];
        const workspacePath = path.resolve(item.path);
        const agentDir = path.join(workspacePath, ".agent");
        const exclusion = evaluateWorkspaceExclusion(index, workspacePath);

        if (exclusion.excluded) {
            removedExcluded += 1;
            if (options.dryRun) {
                log(
                    options,
                    `[dry-run] [${i + 1}/${records.length}] 将从批量索引移除排除路径: ${workspacePath}（${exclusion.reason}）`,
                );
            } else {
                log(
                    options,
                    `🧽 [${i + 1}/${records.length}] 已从批量索引中移除排除路径: ${workspacePath}（${exclusion.reason}）`,
                );
            }
            continue;
        }

        if (!fs.existsSync(workspacePath)) {
            if (options.pruneMissing) {
                removedMissing += 1;
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
    log(options, `   清理排除路径: ${removedExcluded}`);
    if (options.pruneMissing) {
        log(options, `   清理失效索引: ${removedMissing}`);
    }

    if (failed > 0) {
        process.exitCode = 1;
    }
}

function requirePathOption(options, commandUsage) {
    if (!options.path) {
        throw new Error(`${commandUsage} 需要 --path <dir> 参数`);
    }
    return resolveWorkspaceRoot(options.path);
}

function commandExcludeList(options) {
    const { indexPath, index } = readWorkspaceIndex();
    const excluded = Array.isArray(index.excludedPaths) ? index.excludedPaths : [];

    if (options.quiet) {
        for (const item of excluded) {
            console.log(item);
        }
        return;
    }

    console.log("🛡️ 工作区排除清单");
    console.log(`   索引文件: ${indexPath}`);
    console.log("   默认规则: 自动排除 antigravity-kit 源码目录（无需手动添加）");

    if (excluded.length === 0) {
        console.log("   当前无自定义排除路径。");
        return;
    }

    console.log(`   自定义排除路径 (${excluded.length}):`);
    for (let i = 0; i < excluded.length; i++) {
        console.log(`   ${i + 1}. ${excluded[i]}`);
    }
}

function commandExcludeAdd(options) {
    const targetPath = requirePathOption(options, "exclude add");
    const { indexPath, index } = readWorkspaceIndex();
    const normalizedTarget = path.resolve(targetPath);
    const existed = index.excludedPaths.includes(normalizedTarget);

    const matchedWorkspaces = index.workspaces.filter((item) => isPathInOrUnder(normalizedTarget, item.path));
    const matchedCount = matchedWorkspaces.length;

    if (options.dryRun) {
        if (existed) {
            log(options, `[dry-run] 排除路径已存在: ${normalizedTarget}`);
        } else {
            log(options, `[dry-run] 将新增排除路径: ${normalizedTarget}`);
        }
        if (matchedCount > 0) {
            log(options, `[dry-run] 将移除 ${matchedCount} 条已登记工作区记录（位于该排除路径下）。`);
        }
        return;
    }

    if (!existed) {
        index.excludedPaths.push(normalizedTarget);
        index.excludedPaths = normalizePathList(index.excludedPaths);
    }

    index.workspaces = index.workspaces.filter((item) => !isPathInOrUnder(normalizedTarget, item.path));
    index.updatedAt = nowISO();
    writeWorkspaceIndex(indexPath, index);

    if (existed) {
        log(options, `ℹ️ 排除路径已存在: ${normalizedTarget}`);
    } else {
        log(options, `✅ 已新增排除路径: ${normalizedTarget}`);
    }

    if (matchedCount > 0) {
        log(options, `🧹 已移除 ${matchedCount} 条已登记工作区记录（位于排除路径下）。`);
    }
    log(options, `📚 索引文件: ${indexPath}`);
}

function commandExcludeRemove(options) {
    const targetPath = requirePathOption(options, "exclude remove");
    const { indexPath, index } = readWorkspaceIndex();
    const normalizedTarget = path.resolve(targetPath);
    const existed = index.excludedPaths.includes(normalizedTarget);

    if (!existed) {
        log(options, `ℹ️ 排除路径不存在: ${normalizedTarget}`);
        return;
    }

    if (options.dryRun) {
        log(options, `[dry-run] 将移除排除路径: ${normalizedTarget}`);
        return;
    }

    index.excludedPaths = index.excludedPaths.filter((item) => item !== normalizedTarget);
    index.updatedAt = nowISO();
    writeWorkspaceIndex(indexPath, index);

    log(options, `✅ 已移除排除路径: ${normalizedTarget}`);
    log(options, `📚 索引文件: ${indexPath}`);
}

function commandExclude(options) {
    const subcommand = (options.subcommand || "list").toLowerCase();

    if (subcommand === "list") {
        commandExcludeList(options);
        return;
    }
    if (subcommand === "add") {
        commandExcludeAdd(options);
        return;
    }
    if (subcommand === "remove") {
        commandExcludeRemove(options);
        return;
    }

    throw new Error(`未知 exclude 子命令: ${subcommand}`);
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

        maybeWarnUpstreamGlobalConflict(command, options);

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

        if (command === "exclude") {
            commandExclude(options);
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
