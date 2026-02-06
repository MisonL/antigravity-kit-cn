#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const pkg = require("../package.json");
const { readGlobalNpmDependencies } = require("./utils");
const GeminiAdapter = require("./adapters/gemini");
const CodexAdapter = require("./adapters/codex");
const { selectTargets } = require("./interactive");

const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agent");
const WORKSPACE_INDEX_VERSION = 2;
const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";
const SUPPORTED_TARGETS = ["gemini", "codex"];

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
    console.log("  ag-kit init [--force] [--path <dir>] [--branch <name>] [--target <name>|--targets <a,b>] [--non-interactive] [--quiet] [--dry-run]");
    console.log("  ag-kit update [--path <dir>] [--branch <name>] [--target <name>|--targets <a,b>] [--quiet] [--dry-run]");
    console.log("  ag-kit update-all [--branch <name>] [--targets <a,b>] [--prune-missing] [--quiet] [--dry-run]");
    console.log("  ag-kit doctor [--path <dir>] [--target <name>|--targets <a,b>] [--fix] [--quiet]");
    console.log("  ag-kit exclude list [--quiet]");
    console.log("  ag-kit exclude add --path <dir> [--dry-run] [--quiet]");
    console.log("  ag-kit exclude remove --path <dir> [--dry-run] [--quiet]");
    console.log("  ag-kit status [--path <dir>] [--quiet]");
    console.log("  ag-kit --version");
}

function printVersion() {
    console.log(`ag-kit version ${pkg.version}`);
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
        nonInteractive: false,
        fix: false,
        subcommand: "",
        path: "",
        branch: "",
        targets: [],
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
        } else if (arg === "--non-interactive") {
            options.nonInteractive = true;
        } else if (arg === "--fix") {
            options.fix = true;
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
        } else if (arg === "--target") {
            if (i + 1 >= argv.length) {
                throw new Error("--target 需要一个目标参数");
            }
            options.targets.push(argv[++i]);
        } else if (arg === "--targets") {
            if (i + 1 >= argv.length) {
                throw new Error("--targets 需要一个参数");
            }
            options.targets.push(...String(argv[++i]).split(","));
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

function normalizeAbsolutePath(inputPath) {
    return path.normalize(path.resolve(inputPath));
}

function pathCompareKey(inputPath) {
    const normalized = normalizeAbsolutePath(inputPath);
    if (process.platform === "win32") {
        return normalized.toLowerCase();
    }
    return normalized;
}

function normalizePathList(items) {
    const map = new Map();
    for (const item of items) {
        if (typeof item !== "string" || item.trim() === "") {
            continue;
        }
        const normalizedPath = normalizeAbsolutePath(item);
        const key = pathCompareKey(normalizedPath);
        if (!map.has(key)) {
            map.set(key, normalizedPath);
        }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
}

function isPathInOrUnder(basePath, targetPath) {
    const normalizedBase = normalizeAbsolutePath(basePath);
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const baseKey = pathCompareKey(normalizedBase);
    const targetKey = pathCompareKey(normalizedTarget);

    if (targetKey === baseKey) {
        return true;
    }

    const prefix = baseKey.endsWith(path.sep) ? baseKey : `${baseKey}${path.sep}`;
    return targetKey.startsWith(prefix);
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

function normalizeTargetState(value) {
    if (!value || typeof value !== "object") {
        return null;
    }
    return {
        version: typeof value.version === "string" ? value.version : "",
        installedAt: typeof value.installedAt === "string" ? value.installedAt : "",
        updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
    };
}

function normalizeWorkspaceRecordV2(item, normalizedPath) {
    const targets = {};
    if (item && item.targets && typeof item.targets === "object") {
        for (const [targetName, state] of Object.entries(item.targets)) {
            const normalizedState = normalizeTargetState(state);
            if (normalizedState) {
                targets[targetName] = normalizedState;
            }
        }
    }
    return {
        path: normalizedPath,
        targets,
    };
}

function migrateRecordV1ToV2(item, normalizedPath) {
    const targets = {};
    const installedAt = typeof item.installedAt === "string" ? item.installedAt : "";
    if (installedAt) {
        targets.gemini = {
            version: typeof item.cliVersion === "string" ? item.cliVersion : "",
            installedAt,
            updatedAt: typeof item.lastUpdatedAt === "string" ? item.lastUpdatedAt : installedAt,
        };
    }
    return {
        path: normalizedPath,
        targets,
    };
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
    normalized.updatedAt = typeof parsed.updatedAt === "string" ? parsed.updatedAt : "";

    const records = Array.isArray(parsed.workspaces) ? parsed.workspaces : [];
    const dedupMap = new Map();
    const isV1 = !parsed.version || parsed.version === 1;

    for (const item of records) {
        if (!item || typeof item.path !== "string" || item.path.trim() === "") {
            continue;
        }

        const workspacePath = normalizeAbsolutePath(item.path);
        const key = pathCompareKey(workspacePath);
        const record = isV1
            ? migrateRecordV1ToV2(item, workspacePath)
            : normalizeWorkspaceRecordV2(item, workspacePath);

        dedupMap.set(key, record);
    }

    normalized.workspaces = Array.from(dedupMap.values()).sort((a, b) => a.path.localeCompare(b.path));
    normalized.excludedPaths = normalizePathList(Array.isArray(parsed.excludedPaths) ? parsed.excludedPaths : []);
    return { indexPath, index: normalized };
}

function writeWorkspaceIndex(indexPath, index) {
    const workspaceMap = new Map();

    for (const item of Array.isArray(index.workspaces) ? index.workspaces : []) {
        if (!item || typeof item.path !== "string" || item.path.trim() === "") {
            continue;
        }

        const normalizedPath = normalizeAbsolutePath(item.path);
        const normalizedRecord = normalizeWorkspaceRecordV2(item, normalizedPath);
        workspaceMap.set(pathCompareKey(normalizedPath), normalizedRecord);
    }

    const payload = {
        version: WORKSPACE_INDEX_VERSION,
        updatedAt: index.updatedAt || nowISO(),
        workspaces: Array.from(workspaceMap.values()).sort((a, b) => a.path.localeCompare(b.path)),
        excludedPaths: normalizePathList(Array.isArray(index.excludedPaths) ? index.excludedPaths : []),
    };

    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function evaluateWorkspaceExclusion(index, workspaceRoot) {
    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const excludedPaths = Array.isArray(index.excludedPaths) ? index.excludedPaths : [];

    if (isPathExcludedByList(excludedPaths, normalizedPath)) {
        return {
            excluded: true,
            reason: "命中用户排除清单",
            path: normalizedPath,
        };
    }

    if (isToolkitSourceDirectory(normalizedPath)) {
        return {
            excluded: true,
            reason: "检测为 antigravity-kit 源码目录（默认排除）",
            path: normalizedPath,
        };
    }

    return {
        excluded: false,
        reason: "",
        path: normalizedPath,
    };
}

function removeWorkspaceRecord(index, workspaceRoot) {
    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const targetKey = pathCompareKey(normalizedPath);
    const before = index.workspaces.length;
    index.workspaces = index.workspaces.filter((item) => pathCompareKey(item.path) !== targetKey);
    return before - index.workspaces.length;
}

function upsertWorkspaceTarget(index, workspaceRoot, targetName, timestamp) {
    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const targetKey = pathCompareKey(normalizedPath);

    let record = index.workspaces.find((item) => pathCompareKey(item.path) === targetKey);
    if (!record) {
        record = { path: normalizedPath, targets: {} };
        index.workspaces.push(record);
    }

    if (!record.targets || typeof record.targets !== "object") {
        record.targets = {};
    }

    const prev = normalizeTargetState(record.targets[targetName]) || {
        version: "",
        installedAt: "",
        updatedAt: "",
    };

    record.targets[targetName] = {
        version: pkg.version,
        installedAt: prev.installedAt || timestamp,
        updatedAt: timestamp,
    };
}

function previewWorkspaceIndexRegistration(workspaceRoot, targetName, options) {
    const { indexPath, index } = readWorkspaceIndex();
    const exclusion = evaluateWorkspaceExclusion(index, workspaceRoot);
    const normalizedPath = normalizeAbsolutePath(workspaceRoot);

    if (exclusion.excluded) {
        const exists = index.workspaces.some((item) => pathCompareKey(item.path) === pathCompareKey(normalizedPath));
        log(options, `[dry-run] 索引登记已跳过: ${exclusion.reason}`);
        if (exists) {
            log(options, `[dry-run] 将从索引中移除已存在记录: ${normalizedPath}`);
        }
        return;
    }

    const exists = index.workspaces.some((item) => pathCompareKey(item.path) === pathCompareKey(normalizedPath));
    if (exists) {
        log(options, `[dry-run] 将刷新工作区索引记录: ${normalizedPath} [${targetName}]`);
    } else {
        log(options, `[dry-run] 将登记工作区到全局索引: ${normalizedPath} [${targetName}]`);
    }
    log(options, `[dry-run] 索引文件: ${indexPath}`);
}

function registerWorkspaceTarget(workspaceRoot, targetName, options) {
    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const { indexPath, index } = readWorkspaceIndex();
    const timestamp = nowISO();
    const exclusion = evaluateWorkspaceExclusion(index, normalizedPath);

    if (exclusion.excluded) {
        const removedCount = removeWorkspaceRecord(index, normalizedPath);
        if (!options.dryRun && removedCount > 0) {
            index.updatedAt = timestamp;
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

    if (options.dryRun) {
        previewWorkspaceIndexRegistration(normalizedPath, targetName, options);
        return;
    }

    upsertWorkspaceTarget(index, normalizedPath, targetName, timestamp);
    index.updatedAt = timestamp;
    writeWorkspaceIndex(indexPath, index);

    if (!options.silentIndexLog) {
        log(options, `🗂️ 已登记工作区索引: ${normalizedPath} [${targetName}]`);
        log(options, `   索引文件: ${indexPath}`);
    }
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

function normalizeTargets(rawTargets) {
    const result = [];
    const seen = new Set();

    for (const raw of rawTargets || []) {
        if (typeof raw !== "string") {
            continue;
        }
        const parts = raw.split(",");
        for (const part of parts) {
            const target = part.trim().toLowerCase();
            if (!target) {
                continue;
            }
            if (!SUPPORTED_TARGETS.includes(target)) {
                throw new Error(`不支持的目标: ${target}（可选: ${SUPPORTED_TARGETS.join(", ")}）`);
            }
            if (!seen.has(target)) {
                seen.add(target);
                result.push(target);
            }
        }
    }

    return result;
}

function detectInstalledTargets(workspaceRoot) {
    const targets = [];
    if (fs.existsSync(path.join(workspaceRoot, ".agent"))) {
        targets.push("gemini");
    }
    if (fs.existsSync(path.join(workspaceRoot, ".codex"))) {
        targets.push("codex");
    }
    return targets;
}

function isTargetInstalled(workspaceRoot, targetName) {
    if (targetName === "gemini") {
        return fs.existsSync(path.join(workspaceRoot, ".agent"));
    }
    if (targetName === "codex") {
        return fs.existsSync(path.join(workspaceRoot, ".codex"));
    }
    return false;
}

function createAdapter(targetName, workspaceRoot, options) {
    if (targetName === "gemini") {
        return new GeminiAdapter(workspaceRoot, options);
    }
    if (targetName === "codex") {
        return new CodexAdapter(workspaceRoot, options);
    }
    throw new Error(`未知目标: ${targetName}`);
}

async function resolveTargetsForInit(options) {
    let targets = normalizeTargets(options.targets);

    if (targets.length > 0) {
        return targets;
    }

    if (options.nonInteractive) {
        throw new Error("非交互模式下必须通过 --target 或 --targets 指定目标");
    }

    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw new Error("当前环境不是交互终端，请通过 --target 或 --targets 指定目标");
    }

    targets = normalizeTargets(await selectTargets(options));
    if (targets.length === 0) {
        throw new Error("必须选择至少一个目标");
    }

    return targets;
}

function resolveTargetsForUpdate(workspaceRoot, options) {
    const requested = normalizeTargets(options.targets);
    if (requested.length > 0) {
        return requested;
    }
    return detectInstalledTargets(workspaceRoot);
}

async function commandInit(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targets = await resolveTargetsForInit(options);

    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, options);
        log(options, `📦 正在初始化目标 [${target}] ...`);
        adapter.install(BUNDLED_AGENT_DIR);
        registerWorkspaceTarget(workspaceRoot, target, options);
    }

    if (targets.length > 0) {
        log(options, `✅ 初始化完成 (Targets: ${targets.join(", ")})`);
    }
}

async function commandUpdate(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targets = resolveTargetsForUpdate(workspaceRoot, options);

    if (targets.length === 0) {
        throw new Error("此目录未检测到 Antigravity Kit 安装，无法更新。请先执行 init。");
    }

    log(options, `🔄 正在更新 Antigravity Kit (Targets: ${targets.join(", ")})...`);

    let updatedAny = false;
    for (const target of targets) {
        if (!isTargetInstalled(workspaceRoot, target) && options.targets.length > 0) {
            throw new Error(`目标未安装: ${target}`);
        }
        if (!isTargetInstalled(workspaceRoot, target)) {
            log(options, `⏭️ 目标未安装，跳过: ${target}`);
            continue;
        }

        const runOptions = { ...options, force: true };
        const adapter = createAdapter(target, workspaceRoot, runOptions);
        log(options, `📦 更新 [${target}] ...`);
        adapter.update(BUNDLED_AGENT_DIR);
        registerWorkspaceTarget(workspaceRoot, target, runOptions);
        updatedAny = true;
    }

    if (!updatedAny) {
        throw new Error("未找到可更新的目标");
    }
}

function mergeUpdatedTargets(record, workspacePath, targetNames, timestamp) {
    const normalizedPath = normalizeAbsolutePath(workspacePath);
    const next = normalizeWorkspaceRecordV2(record || {}, normalizedPath);

    for (const target of targetNames) {
        const prev = normalizeTargetState(next.targets[target]) || {
            version: "",
            installedAt: "",
            updatedAt: "",
        };
        next.targets[target] = {
            version: pkg.version,
            installedAt: prev.installedAt || timestamp,
            updatedAt: timestamp,
        };
    }

    return next;
}

async function commandUpdateAll(options) {
    if (options.path) {
        throw new Error("update-all 不支持 --path，请直接执行 ag-kit update-all");
    }

    const requestedTargets = normalizeTargets(options.targets);
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
        const item = normalizeWorkspaceRecordV2(records[i], normalizeAbsolutePath(records[i].path));
        const workspacePath = normalizeAbsolutePath(item.path);
        const exclusion = evaluateWorkspaceExclusion(index, workspacePath);

        if (exclusion.excluded) {
            removedExcluded += 1;
            if (options.dryRun) {
                log(options, `[dry-run] [${i + 1}/${records.length}] 将从批量索引移除排除路径: ${workspacePath}（${exclusion.reason}）`);
            } else {
                log(options, `🧽 [${i + 1}/${records.length}] 已从批量索引中移除排除路径: ${workspacePath}（${exclusion.reason}）`);
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

        let targets = Object.keys(item.targets || {});
        if (targets.length === 0) {
            targets = detectInstalledTargets(workspacePath);
        }
        if (requestedTargets.length > 0) {
            targets = targets.filter((target) => requestedTargets.includes(target));
        }
        targets = normalizeTargets(targets);

        if (targets.length === 0) {
            skipped += 1;
            log(options, `⏭️ [${i + 1}/${records.length}] 未检测到可更新目标，已跳过: ${workspacePath}`);
            nextRecords.push(item);
            continue;
        }

        log(options, `📦 [${i + 1}/${records.length}] 更新: ${workspacePath} [${targets.join(", ")}]`);

        const updatedTargets = [];
        for (const target of targets) {
            if (!isTargetInstalled(workspacePath, target)) {
                log(options, `⏭️ [${i + 1}/${records.length}] 目标未安装，跳过: ${target}`);
                continue;
            }

            try {
                const runOptions = {
                    ...options,
                    force: true,
                    path: workspacePath,
                    silentIndexLog: true,
                };
                const adapter = createAdapter(target, workspacePath, runOptions);
                adapter.update(BUNDLED_AGENT_DIR);
                updatedTargets.push(target);
            } catch (err) {
                failed += 1;
                if (!options.quiet) {
                    console.error(`❌ 更新失败: ${workspacePath} [${target}]`);
                    console.error(`   ${err.message}`);
                }
            }
        }

        if (updatedTargets.length > 0) {
            updated += 1;
            nextRecords.push(mergeUpdatedTargets(item, workspacePath, updatedTargets, timestamp));
        } else {
            skipped += 1;
            nextRecords.push(item);
        }
    }

    if (!options.dryRun) {
        index.workspaces = nextRecords.sort((a, b) => a.path.localeCompare(b.path));
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

async function commandDoctor(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    let targets = normalizeTargets(options.targets);

    if (targets.length === 0) {
        targets = detectInstalledTargets(workspaceRoot);
    }

    if (targets.length === 0) {
        throw new Error("未检测到已安装的目标。请指定 --target 或先执行 init。");
    }

    log(options, `🩺 开始诊断 (Targets: ${targets.join(", ")})...`);

    let hasIssue = false;
    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, options);
        console.log(`\n[${target.toUpperCase()}] 检查完整性...`);

        let result = adapter.checkIntegrity();
        if (result.status === "ok") {
            console.log("  ✅ 状态正常");
            continue;
        }

        let targetHasIssue = true;
        console.log(`  ❌ 状态: ${result.status}`);
        for (const issue of result.issues || []) {
            console.log(`     - ${issue}`);
        }

        if (options.fix) {
            const fixRes = adapter.fixIntegrity();
            if (fixRes && fixRes.fixed) {
                console.log(`  🛠️ 已修复: ${fixRes.summary}`);
                result = adapter.checkIntegrity();
                if (result.status === "ok") {
                    console.log("  ✅ 修复后状态正常");
                    targetHasIssue = false;
                } else {
                    console.log(`  ⚠️ 修复后仍有问题: ${result.status}`);
                    for (const issue of result.issues || []) {
                        console.log(`     - ${issue}`);
                    }
                    targetHasIssue = true;
                }
            } else {
                console.log(`  ℹ️ 自动修复未执行: ${fixRes ? fixRes.summary : "无可用修复"}`);
            }
        }

        if (targetHasIssue) {
            hasIssue = true;
        }
    }

    if (hasIssue) {
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
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const targetKey = pathCompareKey(normalizedTarget);
    const existed = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);

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
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const targetKey = pathCompareKey(normalizedTarget);
    const existed = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);

    if (!existed) {
        log(options, `ℹ️ 排除路径不存在: ${normalizedTarget}`);
        return;
    }

    if (options.dryRun) {
        log(options, `[dry-run] 将移除排除路径: ${normalizedTarget}`);
        return;
    }

    index.excludedPaths = index.excludedPaths.filter((item) => pathCompareKey(item) !== targetKey);
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

function countSkillsRecursive(dir) {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            count += countSkillsRecursive(fullPath);
        } else if (entry.name === "SKILL.md") {
            count += 1;
        }
    }
    return count;
}

function commandStatus(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const installedTargets = detectInstalledTargets(workspaceRoot);

    if (installedTargets.length === 0) {
        if (!options.quiet) {
            console.log("❌ 未检测到 Antigravity Kit 安装");
            console.log(`   目标目录: ${workspaceRoot}`);
        }
        process.exitCode = 1;
        return;
    }

    if (options.quiet) {
        console.log("installed");
        return;
    }

    console.log("✅ Antigravity Kit 已安装");
    console.log(`   CLI 版本: ${pkg.version}`);
    console.log(`   工作区: ${workspaceRoot}`);
    console.log(`   Targets: ${installedTargets.join(", ")}`);

    if (installedTargets.includes("gemini")) {
        const agentDir = path.join(workspaceRoot, ".agent");
        const agentsCount = countFilesIfExists(path.join(agentDir, "agents"), (name) => name.endsWith(".md"));
        const workflowsCount = countFilesIfExists(path.join(agentDir, "workflows"), (name) => name.endsWith(".md"));
        const skillsCount = countSkillsRecursive(path.join(agentDir, "skills"));
        console.log("\n[gemini]");
        console.log(`   路径: ${agentDir}`);
        console.log(`   Agents: ${agentsCount}`);
        console.log(`   Skills: ${skillsCount}`);
        console.log(`   Workflows: ${workflowsCount}`);
    }

    if (installedTargets.includes("codex")) {
        const codexDir = path.join(workspaceRoot, ".codex");
        const skillsCount = countSkillsRecursive(path.join(codexDir, "skills"));
        const hasManifest = fs.existsSync(path.join(codexDir, "manifest.json"));
        const hasMirror = fs.existsSync(path.join(workspaceRoot, ".agents"));
        console.log("\n[codex]");
        console.log(`   路径: ${codexDir}`);
        console.log(`   Skills: ${skillsCount}`);
        console.log(`   Manifest: ${hasManifest ? "yes" : "no"}`);
        console.log(`   Mirror(.agents): ${hasMirror ? "yes" : "no"}`);
    }
}

async function main() {
    try {
        const { command, options } = parseArgs(process.argv.slice(2));

        if (!command || command === "--help" || command === "-h") {
            printUsage();
            if (!command || command === "--help" || command === "-h") {
                return;
            }
        }

        if (command === "--version" || command === "-v") {
            printVersion();
            return;
        }

        maybeWarnUpstreamGlobalConflict(command, options);

        if (command === "init") {
            await commandInit(options);
            return;
        }

        if (command === "update") {
            await commandUpdate(options);
            return;
        }

        if (command === "update-all") {
            await commandUpdateAll(options);
            return;
        }

        if (command === "doctor") {
            await commandDoctor(options);
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
