#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const pkg = require("../package.json");
const { readGlobalNpmDependencies, cloneBranchAgentDir } = require("./utils");
const ManifestManager = require("./utils/manifest");
const AtomicWriter = require("./utils/atomic-writer");
const CodexBuilder = require("./core/builder");
const GeminiAdapter = require("./adapters/gemini");
const CodexAdapter = require("./adapters/codex");
const { selectTargets } = require("./interactive");

const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agents");
const BUNDLED_SPEC_DIR = path.resolve(__dirname, "../.spec");
const PRIMARY_CLI_NAME = "ling";
const LEGACY_CLI_NAME = "ag-kit";
const CURRENT_CLI_BASENAME = path.basename(process.argv[1] || "", path.extname(process.argv[1] || "")) || PRIMARY_CLI_NAME;
const WORKSPACE_INDEX_VERSION = 2;
const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";
const TOOLKIT_PACKAGE_NAMES = new Set(["@mison/ling", "@mison/ag-kit-cn", "antigravity-kit-cn", "antigravity-kit"]);
const SUPPORTED_TARGETS = ["gemini", "codex"];
const LEGACY_INDEX_TARGET_ALIASES = {
    full: "gemini",
};
const GLOBAL_TARGET_DESTINATIONS = {
    codex: [
        {
            id: "codex",
            rootParts: [".codex"],
            skillsParts: [".codex", "skills"],
        },
    ],
    gemini: [
        {
            id: "gemini-cli",
            rootParts: [".gemini", "skills"],
            skillsParts: [".gemini", "skills"],
        },
        {
            id: "antigravity",
            rootParts: [".gemini", "antigravity"],
            skillsParts: [".gemini", "antigravity", "skills"],
        },
    ],
};
const INDEX_LOCK_RETRY_MS = 50;
const INDEX_LOCK_TIMEOUT_MS = 3000;
const INDEX_LOCK_STALE_MS = 30000;
const QUIET_STATUS_EXIT_CODES = {
    installed: 0,
    broken: 1,
    missing: 2,
};
const SPEC_STATE_VERSION = 1;
const SPEC_SKILL_NAMES = ["harness-engineering", "cybernetic-systems-engineering"];

function nowISO() {
    return new Date().toISOString();
}

function getControlHomeDir() {
    const preferred = path.join(os.homedir(), ".ling");
    const legacy = path.join(os.homedir(), ".ag-kit");

    if (fs.existsSync(preferred)) {
        return preferred;
    }
    if (fs.existsSync(legacy)) {
        return legacy;
    }
    return preferred;
}

function migrateLegacyControlHomeDir() {
    if (process.env.LING_INDEX_PATH || process.env.AG_KIT_INDEX_PATH) {
        return null;
    }

    const preferred = path.join(os.homedir(), ".ling");
    const legacy = path.join(os.homedir(), ".ag-kit");

    if (fs.existsSync(preferred) || !fs.existsSync(legacy)) {
        return null;
    }

    copyDirRecursive(legacy, preferred);
    return { from: legacy, to: preferred };
}

function getWorkspaceIndexPath() {
    const customPath = process.env.LING_INDEX_PATH || process.env.AG_KIT_INDEX_PATH;
    if (customPath) {
        return path.resolve(process.cwd(), customPath);
    }
    return path.join(getControlHomeDir(), "workspaces.json");
}

function createEmptyWorkspaceIndex() {
    return {
        version: WORKSPACE_INDEX_VERSION,
        updatedAt: "",
        workspaces: [],
        excludedPaths: [],
    };
}

function resolveGlobalRootDir() {
    const customRoot = process.env.LING_GLOBAL_ROOT || process.env.AG_KIT_GLOBAL_ROOT;
    if (typeof customRoot === "string" && customRoot.trim()) {
        return path.resolve(process.cwd(), customRoot);
    }
    return os.homedir();
}

function getGlobalDestinations(targetName, globalRoot = resolveGlobalRootDir()) {
    const config = GLOBAL_TARGET_DESTINATIONS[targetName];
    if (!config) {
        throw new Error(`未知目标: ${targetName}`);
    }
    return config.map((item) => ({
        ...item,
        targetName,
        rootDir: path.join(globalRoot, ...item.rootParts),
        skillsRoot: path.join(globalRoot, ...item.skillsParts),
    }));
}

function listGlobalDestinations(globalRoot = resolveGlobalRootDir()) {
    return Object.keys(GLOBAL_TARGET_DESTINATIONS).flatMap((targetName) => getGlobalDestinations(targetName, globalRoot));
}

function resolveGlobalBackupRoot(timestamp) {
    const globalRoot = resolveGlobalRootDir();
    return path.join(globalRoot, ".ling", "backups", "global", timestamp);
}

function copyDirRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function areDirectoriesEqual(leftDir, rightDir) {
    const left = ManifestManager.generateFromDir(leftDir);
    const right = ManifestManager.generateFromDir(rightDir);
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
        return false;
    }
    for (const key of leftKeys) {
        if (left[key] !== right[key]) {
            return false;
        }
    }
    return true;
}

function printUsage() {
    console.log("用法:");
    console.log(`  ${PRIMARY_CLI_NAME} init [--force] [--path <dir>] [--branch <name>] [--target <name>|--targets <a,b>] [--non-interactive] [--no-index] [--quiet] [--dry-run]`);
    console.log(`  ${PRIMARY_CLI_NAME} update [--path <dir>] [--branch <name>] [--target <name>|--targets <a,b>] [--no-index] [--quiet] [--dry-run]`);
    console.log(`  ${PRIMARY_CLI_NAME} update-all [--branch <name>] [--targets <a,b>] [--prune-missing] [--quiet] [--dry-run]`);
    console.log(`  ${PRIMARY_CLI_NAME} doctor [--path <dir>] [--target <name>|--targets <a,b>] [--fix] [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} global sync [--target <name>|--targets <a,b>] [--branch <name>] [--quiet] [--dry-run]  # 默认同步 codex + gemini(cli+antigravity)`);
    console.log(`  ${PRIMARY_CLI_NAME} global status [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} spec enable [--target <name>|--targets <a,b>] [--quiet] [--dry-run]`);
    console.log(`  ${PRIMARY_CLI_NAME} spec disable [--target <name>|--targets <a,b>] [--quiet] [--dry-run]`);
    console.log(`  ${PRIMARY_CLI_NAME} spec status [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} exclude list [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} exclude add --path <dir> [--dry-run] [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} exclude remove --path <dir> [--dry-run] [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} status [--path <dir>] [--quiet]`);
    console.log(`  ${PRIMARY_CLI_NAME} --version`);
}

function printVersion() {
    console.log(`${PRIMARY_CLI_NAME} version ${pkg.version}`);
}

function parseArgs(argv) {
    if (argv.length === 0) {
        return { command: "", options: {}, providedFlags: [] };
    }

    const command = argv[0];
    const options = {
        force: false,
        quiet: false,
        dryRun: false,
        pruneMissing: false,
        nonInteractive: false,
        noIndex: false,
        fix: false,
        subcommand: "",
        path: "",
        branch: "",
        targets: [],
    };
    const providedFlags = [];

    let startIndex = 1;
    if (command === "exclude" || command === "global") {
    if (argv.length > 1 && !argv[1].startsWith("--")) {
            options.subcommand = argv[1];
            startIndex = 2;
        } else {
            options.subcommand = command === "global" ? "status" : "list";
            startIndex = 1;
        }
    } else if (command === "spec") {
        if (argv.length > 1 && !argv[1].startsWith("--")) {
            options.subcommand = argv[1];
            startIndex = 2;
        } else {
            options.subcommand = "status";
            startIndex = 1;
        }
    }

    for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--force") {
            providedFlags.push(arg);
            options.force = true;
        } else if (arg === "--quiet") {
            providedFlags.push(arg);
            options.quiet = true;
        } else if (arg === "--dry-run") {
            providedFlags.push(arg);
            options.dryRun = true;
        } else if (arg === "--prune-missing") {
            providedFlags.push(arg);
            options.pruneMissing = true;
        } else if (arg === "--non-interactive") {
            providedFlags.push(arg);
            options.nonInteractive = true;
        } else if (arg === "--no-index") {
            providedFlags.push(arg);
            options.noIndex = true;
        } else if (arg === "--fix") {
            providedFlags.push(arg);
            options.fix = true;
        } else if (arg === "--path") {
            providedFlags.push(arg);
            if (i + 1 >= argv.length) {
                throw new Error("--path 需要一个目录参数");
            }
            options.path = argv[++i];
        } else if (arg === "--branch") {
            providedFlags.push(arg);
            if (i + 1 >= argv.length) {
                throw new Error("--branch 需要一个分支名参数");
            }
            options.branch = argv[++i];
        } else if (arg === "--target") {
            providedFlags.push(arg);
            if (i + 1 >= argv.length) {
                throw new Error("--target 需要一个目标参数");
            }
            options.targets.push(argv[++i]);
        } else if (arg === "--targets") {
            providedFlags.push(arg);
            if (i + 1 >= argv.length) {
                throw new Error("--targets 需要一个参数");
            }
            options.targets.push(...String(argv[++i]).split(","));
        } else {
            throw new Error(`未知参数: ${arg}`);
        }
    }

    return { command, options, providedFlags };
}

const COMMAND_ALLOWED_FLAGS = {
    init: ["--force", "--path", "--branch", "--target", "--targets", "--non-interactive", "--no-index", "--quiet", "--dry-run"],
    update: ["--path", "--branch", "--target", "--targets", "--no-index", "--quiet", "--dry-run"],
    "update-all": ["--branch", "--targets", "--prune-missing", "--quiet", "--dry-run"],
    doctor: ["--path", "--target", "--targets", "--fix", "--quiet"],
    status: ["--path", "--quiet"],
    "global:sync": ["--target", "--targets", "--branch", "--quiet", "--dry-run"],
    "global:status": ["--quiet"],
    "spec:enable": ["--target", "--targets", "--quiet", "--dry-run"],
    "spec:disable": ["--target", "--targets", "--quiet", "--dry-run"],
    "spec:status": ["--quiet"],
    "exclude:list": ["--quiet"],
    "exclude:add": ["--path", "--dry-run", "--quiet"],
    "exclude:remove": ["--path", "--dry-run", "--quiet"],
};

function resolveAllowedFlags(command, options) {
    if (command === "exclude") {
        const subcommand = String(options.subcommand || "list").toLowerCase();
        const key = `exclude:${subcommand}`;
        return COMMAND_ALLOWED_FLAGS[key] || null;
    }
    if (command === "global") {
        const subcommand = String(options.subcommand || "status").toLowerCase();
        const key = `global:${subcommand}`;
        return COMMAND_ALLOWED_FLAGS[key] || null;
    }
    if (command === "spec") {
        const subcommand = String(options.subcommand || "status").toLowerCase();
        const key = `spec:${subcommand}`;
        return COMMAND_ALLOWED_FLAGS[key] || null;
    }
    return COMMAND_ALLOWED_FLAGS[command] || null;
}

function resolveCommandLabel(command, options) {
    if (command === "exclude") {
        const subcommand = String(options.subcommand || "list").toLowerCase();
        return `exclude ${subcommand}`;
    }
    if (command === "global") {
        const subcommand = String(options.subcommand || "status").toLowerCase();
        return `global ${subcommand}`;
    }
    if (command === "spec") {
        const subcommand = String(options.subcommand || "status").toLowerCase();
        return `spec ${subcommand}`;
    }
    return command;
}

function validateOptionScope(command, options, providedFlags) {
    const allowedFlags = resolveAllowedFlags(command, options);
    if (!allowedFlags) {
        return;
    }

    const allowedSet = new Set(allowedFlags);
    const unsupported = [];
    const seen = new Set();
    for (const flag of providedFlags || []) {
        if (allowedSet.has(flag)) {
            continue;
        }
        if (!seen.has(flag)) {
            unsupported.push(flag);
            seen.add(flag);
        }
    }

    if (unsupported.length === 0) {
        return;
    }

    const commandLabel = resolveCommandLabel(command, options);
    throw new Error(`命令 ${commandLabel} 不支持参数: ${unsupported.join(", ")}。可用参数: ${allowedFlags.join(", ")}`);
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
    const legacyCliPath = path.join(workspacePath, "bin", "ag-kit.js");
    const primaryCliPath = path.join(workspacePath, "bin", "ling.js");

    if (!fs.existsSync(packageJsonPath) || (!fs.existsSync(legacyCliPath) && !fs.existsSync(primaryCliPath))) {
        return false;
    }

    try {
        const content = fs.readFileSync(packageJsonPath, "utf8");
        const parsed = JSON.parse(content);
        const name = typeof parsed.name === "string" ? parsed.name : "";
        return TOOLKIT_PACKAGE_NAMES.has(name);
    } catch (err) {
        return false;
    }
}

function getSystemTempRoots() {
    const rawRoots = [
        os.tmpdir(),
        process.env.TMPDIR,
        process.env.TMP,
        process.env.TEMP,
    ];

    // Add common POSIX temp roots explicitly.
    // On macOS, os.tmpdir() usually resolves to /var/folders/... and may not cover /tmp.
    if (process.platform !== "win32") {
        rawRoots.push("/tmp", "/var/tmp");
        if (process.platform === "darwin") {
            rawRoots.push("/private/tmp", "/private/var/tmp");
        }
    }

    const expandedRoots = [];

    for (const root of rawRoots) {
        if (typeof root !== "string" || root.trim() === "") {
            continue;
        }

        expandedRoots.push(root);

        const normalized = normalizeAbsolutePath(root);
        try {
            const realPath = fs.realpathSync.native
                ? fs.realpathSync.native(normalized)
                : fs.realpathSync(normalized);
            expandedRoots.push(realPath);
        } catch (err) {
            // Ignore missing or inaccessible tmp roots from environment variables.
        }

        if (process.platform === "darwin") {
            if (normalized === "/var" || normalized.startsWith("/var/")) {
                expandedRoots.push(normalized.replace(/^\/var\b/, "/private/var"));
            } else if (normalized === "/private/var" || normalized.startsWith("/private/var/")) {
                expandedRoots.push(normalized.replace(/^\/private\/var\b/, "/var"));
            }
        }
    }

    return normalizePathList(expandedRoots);
}

const SYSTEM_TEMP_ROOTS = getSystemTempRoots();

function isSystemTempDirectory(workspacePath) {
    return SYSTEM_TEMP_ROOTS.some((tempRoot) => isPathInOrUnder(tempRoot, workspacePath));
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

function normalizeIndexTargetName(targetName) {
    if (typeof targetName !== "string") {
        return null;
    }
    const normalized = targetName.trim().toLowerCase();
    if (!normalized) {
        return null;
    }
    if (Object.prototype.hasOwnProperty.call(LEGACY_INDEX_TARGET_ALIASES, normalized)) {
        return LEGACY_INDEX_TARGET_ALIASES[normalized];
    }
    if (SUPPORTED_TARGETS.includes(normalized)) {
        return normalized;
    }
    return null;
}

function normalizeWorkspaceRecordV2(item, normalizedPath) {
    const targets = {};
    if (item && item.targets && typeof item.targets === "object") {
        for (const [targetName, state] of Object.entries(item.targets)) {
            const normalizedTargetName = normalizeIndexTargetName(targetName);
            if (!normalizedTargetName) {
                continue;
            }
            const normalizedState = normalizeTargetState(state);
            if (normalizedState) {
                targets[normalizedTargetName] = normalizedState;
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

function sleepSync(ms) {
    const buffer = new SharedArrayBuffer(4);
    const view = new Int32Array(buffer);
    Atomics.wait(view, 0, 0, ms);
}

function acquireWorkspaceIndexLock(indexPath) {
    const lockPath = `${indexPath}.lock`;
    const startedAt = Date.now();

    while (true) {
        try {
            fs.mkdirSync(path.dirname(indexPath), { recursive: true });
            const fd = fs.openSync(lockPath, "wx");
            fs.writeFileSync(fd, `${process.pid}\n${nowISO()}\n`, "utf8");
            return { lockPath, fd };
        } catch (err) {
            if (err && err.code !== "EEXIST") {
                throw new Error(`索引锁创建失败: ${lockPath}`);
            }

            let removedStale = false;
            try {
                const stat = fs.statSync(lockPath);
                if (Date.now() - stat.mtimeMs > INDEX_LOCK_STALE_MS) {
                    fs.rmSync(lockPath, { force: true });
                    removedStale = true;
                }
            } catch (_statErr) {
                removedStale = false;
            }
            if (removedStale) {
                continue;
            }

            if (Date.now() - startedAt >= INDEX_LOCK_TIMEOUT_MS) {
                throw new Error(`工作区索引正被其他进程占用: ${indexPath}`);
            }
            sleepSync(INDEX_LOCK_RETRY_MS);
        }
    }
}

function releaseWorkspaceIndexLock(lockHandle) {
    if (!lockHandle) return;
    try {
        if (typeof lockHandle.fd === "number") {
            fs.closeSync(lockHandle.fd);
        }
    } catch (_closeErr) {
        // ignore
    }
    try {
        fs.rmSync(lockHandle.lockPath, { force: true });
    } catch (_rmErr) {
        // ignore
    }
}

function withWorkspaceIndexLock(indexPath, fn) {
    const lockHandle = acquireWorkspaceIndexLock(indexPath);
    try {
        return fn();
    } finally {
        releaseWorkspaceIndexLock(lockHandle);
    }
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
            reason: "检测为灵轨工具包源码目录（默认排除）",
            path: normalizedPath,
        };
    }

    if (isSystemTempDirectory(normalizedPath)) {
        return {
            excluded: true,
            reason: "检测为系统临时目录（默认排除）",
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
    if (options.noIndex) {
        if (!options.silentIndexLog) {
            log(options, `[skip] 已跳过索引登记: ${normalizeAbsolutePath(workspaceRoot)}`);
            log(options, "   原因: 启用了 --no-index");
        }
        return;
    }

    if (options.dryRun) {
        const normalizedPath = normalizeAbsolutePath(workspaceRoot);
        previewWorkspaceIndexRegistration(normalizedPath, targetName, options);
        return;
    }

    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const indexPath = getWorkspaceIndexPath();
    const timestamp = nowISO();
    let removedCount = 0;
    let exclusionReason = "";
    let excluded = false;

    withWorkspaceIndexLock(indexPath, () => {
        const { index } = readWorkspaceIndex();
        const exclusion = evaluateWorkspaceExclusion(index, normalizedPath);
        excluded = exclusion.excluded;
        exclusionReason = exclusion.reason;

        if (exclusion.excluded) {
            removedCount = removeWorkspaceRecord(index, normalizedPath);
            if (removedCount > 0) {
                index.updatedAt = timestamp;
                writeWorkspaceIndex(indexPath, index);
            }
            return;
        }

        upsertWorkspaceTarget(index, normalizedPath, targetName, timestamp);
        index.updatedAt = timestamp;
        writeWorkspaceIndex(indexPath, index);
    });

    if (excluded) {
        if (!options.silentIndexLog) {
            log(options, `[skip] 已跳过索引登记: ${normalizedPath}`);
            log(options, `   原因: ${exclusionReason}`);
            if (removedCount > 0) {
                log(options, `[clean] 已清理旧索引记录: ${normalizedPath}`);
            }
            log(options, `   索引文件: ${indexPath}`);
        }
        return;
    }

    if (!options.silentIndexLog) {
        log(options, `[index] 已登记工作区索引: ${normalizedPath} [${targetName}]`);
        log(options, `   索引文件: ${indexPath}`);
    }
}

function maybeWarnUpstreamGlobalConflict(command, options) {
    if (options.quiet) {
        return;
    }
    if (process.env.LING_SKIP_UPSTREAM_CHECK === "1" || process.env.AG_KIT_SKIP_UPSTREAM_CHECK === "1") {
        return;
    }
    const shouldWarn =
        command === "init"
        || command === "update"
        || command === "update-all"
        || (command === "global" && String(options.subcommand || "").toLowerCase() === "sync")
        || (command === "spec" && String(options.subcommand || "").toLowerCase() === "enable");
    if (!shouldWarn) {
        return;
    }

    const deps = readGlobalNpmDependencies();
    if (!deps) {
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(deps, UPSTREAM_GLOBAL_PACKAGE)) {
        return;
    }

    log(options, `[warn] 检测到全局已安装上游英文版 ${UPSTREAM_GLOBAL_PACKAGE}。`);
    log(options, `[warn] 上游英文版与当前版本共用 \`${LEGACY_CLI_NAME}\` 兼容命令名，后安装者会覆盖该入口。`);
    log(options, `[hint] 建议执行: npm uninstall -g ${UPSTREAM_GLOBAL_PACKAGE}`);
    log(options, `[info] 正式命令已切换为 \`${PRIMARY_CLI_NAME}\`。若你通过 bun install -g 安装，Bun 默认会阻止本包 postinstall；因此这里会在首次执行 CLI 时再次提醒。`);
}

function maybeWarnLegacyCliAlias(options) {
    if (options.quiet) {
        return;
    }
    if (CURRENT_CLI_BASENAME !== LEGACY_CLI_NAME) {
        return;
    }

    console.log(`[warn] \`${LEGACY_CLI_NAME}\` 已进入兼容模式，请改用 \`${PRIMARY_CLI_NAME}\`.`);
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
    if (fs.existsSync(path.join(workspaceRoot, ".agents")) || fs.existsSync(path.join(workspaceRoot, ".codex"))) {
        targets.push("codex");
    }
    return targets;
}

function isTargetInstalled(workspaceRoot, targetName) {
    if (targetName === "gemini") {
        return fs.existsSync(path.join(workspaceRoot, ".agent"));
    }
    if (targetName === "codex") {
        return fs.existsSync(path.join(workspaceRoot, ".agents")) || fs.existsSync(path.join(workspaceRoot, ".codex"));
    }
    return false;
}

function setQuietStatusExitCode(state) {
    process.exitCode = Object.prototype.hasOwnProperty.call(QUIET_STATUS_EXIT_CODES, state)
        ? QUIET_STATUS_EXIT_CODES[state]
        : 1;
}

function normalizeIntegrityState(result) {
    if (!result || result.status === "missing") {
        return "missing";
    }
    if (result.status === "ok") {
        return "installed";
    }
    return "broken";
}

function evaluateWorkspaceState(workspaceRoot, options) {
    const targets = detectInstalledTargets(workspaceRoot);
    if (targets.length === 0) {
        return {
            state: "missing",
            targets: [],
        };
    }

    const targetStates = targets.map((targetName) => {
        const adapter = createAdapter(targetName, workspaceRoot, {
            ...options,
            quiet: true,
        });
        const integrity = adapter.checkIntegrity();
        return {
            targetName,
            state: normalizeIntegrityState(integrity),
            integrity,
            version: typeof adapter.getInstalledVersion === "function" ? adapter.getInstalledVersion() : null,
        };
    });

    const hasIssue = targetStates.some((item) => item.state !== "installed");
    return {
        state: hasIssue ? "broken" : "installed",
        targets: targetStates,
    };
}

function evaluateGlobalState() {
    const globalRoot = resolveGlobalRootDir();
    const targetStates = listGlobalDestinations(globalRoot).map((destination) => {
        const rootExists = fs.existsSync(destination.rootDir);
        const skillsExists = fs.existsSync(destination.skillsRoot);
        const skillsCount = skillsExists ? countSkillsRecursive(destination.skillsRoot) : 0;
        let state = "missing";
        const issues = [];

        if (rootExists || skillsExists) {
            if (!skillsExists) {
                state = "broken";
                issues.push("Skills 根目录缺失");
            } else if (skillsCount === 0) {
                state = "broken";
                issues.push("未检测到任何 SKILL.md");
            } else {
                state = "installed";
            }
        }

        return {
            targetName: destination.id,
            family: destination.targetName,
            state,
            rootDir: destination.rootDir,
            skillsRoot: destination.skillsRoot,
            skillsCount,
            issues,
        };
    }).filter((item) => item.state !== "missing");

    if (targetStates.length === 0) {
        return {
            globalRoot,
            state: "missing",
            targets: [],
        };
    }

    const hasIssue = targetStates.some((item) => item.state !== "installed");
    return {
        globalRoot,
        state: hasIssue ? "broken" : "installed",
        targets: targetStates,
    };
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

function resolveTargetsForGlobalSync(options) {
    const requested = normalizeTargets(options.targets);
    if (requested.length > 0) {
        return requested;
    }
    // 保持 global sync 简洁：默认同步 codex + gemini；其中 gemini 会展开为 gemini-cli 与 antigravity。
    return ["codex", "gemini"];
}

function resolveAgentInstallSource(options) {
    let agentDir = BUNDLED_AGENT_DIR;
    let cleanup = null;
    let sourceLabel = "bundled";

    if (options.branch) {
        const remote = cloneBranchAgentDir(options.branch, {
            quiet: options.quiet,
            logger: log.bind(null, options),
        });
        agentDir = remote.agentDir;
        cleanup = remote.cleanup;
        sourceLabel = `branch:${options.branch}`;
    }

    if (!fs.existsSync(agentDir) && !options.branch) {
        const legacyDir = path.resolve(__dirname, "../.agent");
        if (fs.existsSync(legacyDir)) {
            agentDir = legacyDir;
            sourceLabel = "bundled:legacy";
        }
    }

    if (!fs.existsSync(agentDir)) {
        throw new Error(`未找到模板目录: ${agentDir}`);
    }

    return { agentDir, cleanup, sourceLabel };
}

function listSkillDirectories(skillsRoot) {
    if (!fs.existsSync(skillsRoot)) {
        return [];
    }
    return fs
        .readdirSync(skillsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => fs.existsSync(path.join(skillsRoot, name, "SKILL.md")));
}

function backupSkillDirectory(targetName, skillName, sourceDir, timestamp, options) {
    const backupRoot = resolveGlobalBackupRoot(timestamp);
    const backupDir = path.join(backupRoot, targetName, skillName);
    fs.mkdirSync(path.dirname(backupDir), { recursive: true });
    copyDirRecursive(sourceDir, backupDir);
    log(options, `[backup] 已备份 ${targetName} 全局 Skill: ${skillName} -> ${backupDir}`);
}

function syncSkillDirectory(destination, srcDir, destDir, timestamp, options) {
    const exists = fs.existsSync(destDir);
    if (exists) {
        if (areDirectoriesEqual(srcDir, destDir)) {
            log(options, `[skip] 全局 Skill 已最新，无需同步: ${destination.id}/${path.basename(destDir)}`);
            return { skipped: 1, synced: 0, backedUp: 0 };
        }
    }

    if (options.dryRun) {
        log(options, `[dry-run] 将同步全局 Skill: ${destination.id}/${path.basename(destDir)}`);
        return { skipped: 0, synced: 0, backedUp: exists ? 1 : 0 };
    }

    let backedUp = 0;
    if (exists) {
        backupSkillDirectory(destination.id, path.basename(destDir), destDir, timestamp, options);
        backedUp = 1;
    }

    const logger = options.quiet ? (() => {}) : log.bind(null, options);
    AtomicWriter.atomicCopyDir(srcDir, destDir, { logger });
    log(options, `[ok] 已同步全局 Skill: ${destination.id}/${path.basename(destDir)}`);

    return { skipped: 0, synced: 1, backedUp };
}

function syncGlobalSkillsFromRoot(targetName, skillsRoot, timestamp, options) {
    const destinations = getGlobalDestinations(targetName);
    const skillNames = listSkillDirectories(skillsRoot);
    if (skillNames.length === 0) {
        throw new Error(`未检测到可同步的 Skills: ${skillsRoot}`);
    }

    if (options.dryRun) {
        for (const destination of destinations) {
            log(options, `[dry-run] 将同步 ${skillNames.length} 个全局 Skills -> ${destination.skillsRoot}`);
        }
    }

    let synced = 0;
    let skipped = 0;
    let backedUp = 0;
    const destinationResults = [];

    for (const destination of destinations) {
        let destinationSynced = 0;
        let destinationSkipped = 0;
        let destinationBackedUp = 0;

        for (const skillName of skillNames) {
            const srcDir = path.join(skillsRoot, skillName);
            const destDir = path.join(destination.skillsRoot, skillName);
            const result = syncSkillDirectory(destination, srcDir, destDir, timestamp, options);
            synced += result.synced;
            skipped += result.skipped;
            backedUp += result.backedUp;
            destinationSynced += result.synced;
            destinationSkipped += result.skipped;
            destinationBackedUp += result.backedUp;
        }

        destinationResults.push({
            targetName: destination.id,
            family: destination.targetName,
            destRoot: destination.skillsRoot,
            total: skillNames.length,
            synced: destinationSynced,
            skipped: destinationSkipped,
            backedUp: destinationBackedUp,
        });
    }

    return {
        total: skillNames.length * destinations.length,
        skillsPerDestination: skillNames.length,
        synced,
        skipped,
        backedUp,
        destinations: destinationResults,
    };
}

function applyGlobalSync(targetName, agentDir, timestamp, options) {
    if (targetName === "codex") {
        const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-global-codex-"));
        const mockRoot = path.join(tempRoot, "source");
        const mockAgent = path.join(mockRoot, ".agents");
        const outputDir = path.join(tempRoot, "out");

        try {
            copyDirRecursive(agentDir, mockAgent);
            CodexBuilder.build(mockRoot, outputDir);
            const skillsRoot = path.join(outputDir, "skills");
            return syncGlobalSkillsFromRoot(targetName, skillsRoot, timestamp, options);
        } finally {
            fs.rmSync(tempRoot, { recursive: true, force: true });
        }
    }

    if (targetName === "gemini") {
        const skillsRoot = path.join(agentDir, "skills");
        return syncGlobalSkillsFromRoot(targetName, skillsRoot, timestamp, options);
    }

    throw new Error(`未知目标: ${targetName}`);
}

async function commandGlobalSync(options) {
    const targets = await resolveTargetsForGlobalSync(options);
    const { agentDir, cleanup, sourceLabel } = resolveAgentInstallSource(options);
    const timestamp = nowISO().replace(/[:.]/g, "-");

    try {
        log(options, `[global] 全局同步源: ${sourceLabel}`);
        for (const target of targets) {
            log(options, `[sync] 正在同步全局目标 [${target}] ...`);
            const result = applyGlobalSync(target, agentDir, timestamp, options);
            if (!options.dryRun) {
                log(options, `[summary] 全局同步完成 [${target}]：总计 ${result.total}，新增/覆盖 ${result.synced}，跳过 ${result.skipped}，备份 ${result.backedUp}`);
                for (const item of result.destinations) {
                    log(options, `   - ${item.targetName}: ${item.destRoot}（每目标 ${item.total} 个 Skills）`);
                }
            }
        }
    } finally {
        if (cleanup) cleanup();
    }
}

function commandGlobalStatus(options) {
    const summary = evaluateGlobalState();

    if (summary.state === "missing") {
        if (options.quiet) {
            console.log("missing");
        }
        if (!options.quiet) {
            console.log("[error] 未检测到全局安装的 Skills");
            console.log(`   全局根目录: ${summary.globalRoot}`);
        }
        setQuietStatusExitCode("missing");
        return;
    }

    if (options.quiet) {
        console.log(summary.state);
        setQuietStatusExitCode(summary.state);
        return;
    }

    console.log(summary.state === "installed" ? "[ok] 全局 Skills 状态正常" : "[warn] 全局 Skills 存在问题");
    console.log(`   全局根目录: ${summary.globalRoot}`);
    console.log(`   总体状态: ${summary.state}`);
    console.log(`   Targets: ${summary.targets.map((item) => item.targetName).join(", ")}`);

    for (const item of summary.targets) {
        console.log(`\n[${item.targetName}:global]`);
        console.log(`   家族: ${item.family}`);
        console.log(`   状态: ${item.state}`);
        console.log(`   路径: ${item.skillsRoot}`);
        if (item.state === "installed") {
            console.log(`   Skills: ${item.skillsCount}`);
            continue;
        }
        for (const issue of item.issues) {
            console.log(`   Issue: ${issue}`);
        }
    }

    setQuietStatusExitCode(summary.state);
}

function commandGlobal(options) {
    const subcommand = String(options.subcommand || "status").toLowerCase();
    if (subcommand === "sync") {
        return commandGlobalSync(options);
    }
    if (subcommand === "status") {
        return commandGlobalStatus(options);
    }
    throw new Error(`未知 global 子命令: ${subcommand}`);
}

function getSpecHomeDir() {
    return path.join(resolveGlobalRootDir(), ".ling", "spec");
}

function getSpecStatePath() {
    return path.join(getSpecHomeDir(), "state.json");
}

function resolveSpecBackupRoot(timestamp) {
    return path.join(resolveGlobalRootDir(), ".ling", "backups", "spec", timestamp, "before");
}

function createEmptySpecState() {
    return {
        version: SPEC_STATE_VERSION,
        updatedAt: "",
        targets: {},
        assets: {},
    };
}

function readSpecState() {
    const statePath = getSpecStatePath();
    if (!fs.existsSync(statePath)) {
        return { statePath, state: createEmptySpecState() };
    }

    const raw = fs.readFileSync(statePath, "utf8").trim();
    if (!raw) {
        return { statePath, state: createEmptySpecState() };
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        throw new Error(`Spec 状态文件解析失败: ${statePath}`);
    }

    const state = createEmptySpecState();
    state.updatedAt = typeof parsed.updatedAt === "string" ? parsed.updatedAt : "";
    state.targets = parsed && typeof parsed.targets === "object" && parsed.targets ? parsed.targets : {};
    state.assets = parsed && typeof parsed.assets === "object" && parsed.assets ? parsed.assets : {};
    return { statePath, state };
}

function writeSpecState(statePath, state) {
    const payload = {
        version: SPEC_STATE_VERSION,
        updatedAt: state.updatedAt || nowISO(),
        targets: state.targets || {},
        assets: state.assets || {},
    };
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function removeSpecStateFile() {
    const statePath = getSpecStatePath();
    if (fs.existsSync(statePath)) {
        fs.rmSync(statePath, { force: true });
    }
}

function resolveTargetsForSpec(options) {
    if (options.targets.length === 0) {
        return [...SUPPORTED_TARGETS];
    }
    return normalizeTargets(options.targets);
}

function ensureBundledSpecResources() {
    for (const skillName of SPEC_SKILL_NAMES) {
        const skillDir = path.join(BUNDLED_SPEC_DIR, "skills", skillName);
        const skillFile = path.join(skillDir, "SKILL.md");
        if (!fs.existsSync(skillFile)) {
            throw new Error(`缺少 Spec Skill 资源: ${skillFile}`);
        }
    }
}

function backupDirSnapshot(sourceDir, backupDir, options, label) {
    if (!fs.existsSync(sourceDir)) {
        return "";
    }
    if (options.dryRun) {
        log(options, `[dry-run] 将备份 ${label}: ${sourceDir} -> ${backupDir}`);
        return backupDir;
    }
    fs.mkdirSync(path.dirname(backupDir), { recursive: true });
    copyDirRecursive(sourceDir, backupDir);
    log(options, `[backup] 已备份 ${label}: ${sourceDir} -> ${backupDir}`);
    return backupDir;
}

function applyDirSnapshot(srcDir, destDir, options, label) {
    if (options.dryRun) {
        log(options, `[dry-run] 将写入 ${label}: ${srcDir} -> ${destDir}`);
        return;
    }
    const logger = options.quiet ? (() => {}) : log.bind(null, options);
    AtomicWriter.atomicCopyDir(srcDir, destDir, { logger });
    log(options, `[ok] 已写入 ${label}: ${destDir}`);
}

function removeDirIfExists(targetDir, options, label) {
    if (!fs.existsSync(targetDir)) {
        return;
    }
    if (options.dryRun) {
        log(options, `[dry-run] 将删除 ${label}: ${targetDir}`);
        return;
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
    log(options, `[clean] 已删除 ${label}: ${targetDir}`);
}

function ensureSpecAssetsInstalled(state, timestamp, options) {
    const specHome = getSpecHomeDir();
    const assets = {
        templates: {
            sourceDir: path.join(BUNDLED_SPEC_DIR, "templates"),
            destDir: path.join(specHome, "templates"),
        },
        references: {
            sourceDir: path.join(BUNDLED_SPEC_DIR, "references"),
            destDir: path.join(specHome, "references"),
        },
    };

    for (const [assetName, config] of Object.entries(assets)) {
        if (state.assets[assetName] && state.assets[assetName].installedAt) {
            continue;
        }

        const backupPath = backupDirSnapshot(
            config.destDir,
            path.join(resolveSpecBackupRoot(timestamp), "assets", assetName),
            options,
            `Spec ${assetName}`,
        );
        applyDirSnapshot(config.sourceDir, config.destDir, options, `Spec ${assetName}`);
        state.assets[assetName] = {
            destPath: config.destDir,
            backupPath,
            installedAt: nowISO(),
        };
    }
}

function restoreSpecAsset(assetState, options, label) {
    if (!assetState || typeof assetState.destPath !== "string") {
        return;
    }
    if (assetState.backupPath && fs.existsSync(assetState.backupPath)) {
        applyDirSnapshot(assetState.backupPath, assetState.destPath, options, label);
        return;
    }
    removeDirIfExists(assetState.destPath, options, label);
}

function enableSpecTarget(targetName, state, timestamp, options) {
    if (state.targets[targetName]) {
        log(options, `[skip] Spec 目标已启用: ${targetName}`);
        return;
    }

    const destinations = getGlobalDestinations(targetName);
    const targetState = {
        enabledAt: nowISO(),
        consumers: {},
    };

    for (const destination of destinations) {
        const consumerState = {
            skills: [],
        };

        for (const skillName of SPEC_SKILL_NAMES) {
            const srcDir = path.join(BUNDLED_SPEC_DIR, "skills", skillName);
            const destDir = path.join(destination.skillsRoot, skillName);
            const backupPath = backupDirSnapshot(
                destDir,
                path.join(resolveSpecBackupRoot(timestamp), destination.id, "skills", skillName),
                options,
                `Spec Skill ${destination.id}/${skillName}`,
            );
            applyDirSnapshot(srcDir, destDir, options, `Spec Skill ${destination.id}/${skillName}`);
            consumerState.skills.push({
                name: skillName,
                destPath: destDir,
                backupPath,
            });
        }

        targetState.consumers[destination.id] = consumerState;
    }

    state.targets[targetName] = targetState;
}

function disableSpecTarget(targetName, state, options) {
    const targetState = state.targets[targetName];
    if (!targetState) {
        log(options, `[skip] Spec 目标未启用: ${targetName}`);
        return;
    }

    for (const [consumerId, consumerState] of Object.entries(targetState.consumers || {})) {
        for (const skill of consumerState.skills || []) {
            if (skill.backupPath && fs.existsSync(skill.backupPath)) {
                applyDirSnapshot(skill.backupPath, skill.destPath, options, `恢复 Spec Skill ${consumerId}/${skill.name}`);
            } else {
                removeDirIfExists(skill.destPath, options, `Spec Skill ${consumerId}/${skill.name}`);
            }
        }
    }

    delete state.targets[targetName];
}

function evaluateSpecState() {
    const { state } = readSpecState();
    const targetNames = Object.keys(state.targets || {});
    if (targetNames.length === 0) {
        return {
            state: "missing",
            targets: [],
            assets: state.assets || {},
            specHome: getSpecHomeDir(),
        };
    }

    const issues = [];
    for (const targetName of targetNames) {
        const targetState = state.targets[targetName];
        for (const consumerState of Object.values(targetState.consumers || {})) {
            for (const skill of consumerState.skills || []) {
                if (!fs.existsSync(path.join(skill.destPath, "SKILL.md"))) {
                    issues.push(`Missing spec skill: ${skill.destPath}`);
                }
            }
        }
    }

    for (const assetName of ["templates", "references"]) {
        const asset = state.assets[assetName];
        if (!asset || !asset.destPath || !fs.existsSync(asset.destPath)) {
            issues.push(`Missing spec asset: ${assetName}`);
        }
    }

    return {
        state: issues.length > 0 ? "broken" : "installed",
        targets: targetNames,
        issues,
        assets: state.assets || {},
        specHome: getSpecHomeDir(),
    };
}

function commandSpecStatus(options) {
    const summary = evaluateSpecState();
    if (options.quiet) {
        console.log(summary.state);
        setQuietStatusExitCode(summary.state);
        return;
    }

    if (summary.state === "missing") {
        console.log("[warn] Spec Profile 未启用");
        console.log(`   Spec 目录: ${summary.specHome}`);
        setQuietStatusExitCode("missing");
        return;
    }

    console.log(summary.state === "installed" ? "[ok] Spec Profile 状态正常" : "[warn] Spec Profile 存在问题");
    console.log(`   Spec 目录: ${summary.specHome}`);
    console.log(`   Targets: ${summary.targets.join(", ")}`);
    for (const assetName of Object.keys(summary.assets || {})) {
        console.log(`   Asset: ${assetName} -> ${summary.assets[assetName].destPath}`);
    }
    for (const issue of summary.issues || []) {
        console.log(`   Issue: ${issue}`);
    }
    setQuietStatusExitCode(summary.state);
}

function commandSpecEnable(options) {
    ensureBundledSpecResources();
    const targets = resolveTargetsForSpec(options);
    const { statePath, state } = readSpecState();
    const timestamp = nowISO().replace(/[:.]/g, "-");

    ensureSpecAssetsInstalled(state, timestamp, options);
    for (const targetName of targets) {
        enableSpecTarget(targetName, state, timestamp, options);
    }

    state.updatedAt = nowISO();
    if (!options.dryRun) {
        writeSpecState(statePath, state);
    }

    log(options, `[ok] Spec Profile 已启用 (Targets: ${targets.join(", ")})`);
}

function commandSpecDisable(options) {
    const targets = resolveTargetsForSpec(options);
    const { statePath, state } = readSpecState();

    for (const targetName of targets) {
        disableSpecTarget(targetName, state, options);
    }

    const remainingTargets = Object.keys(state.targets || {});
    if (remainingTargets.length === 0) {
        restoreSpecAsset(state.assets.templates, options, "Spec templates");
        restoreSpecAsset(state.assets.references, options, "Spec references");
        state.assets = {};
    }

    state.updatedAt = nowISO();
    if (!options.dryRun) {
        if (remainingTargets.length === 0) {
            removeSpecStateFile();
        } else {
            writeSpecState(statePath, state);
        }
    }

    log(options, `[ok] Spec Profile 已停用 (Targets: ${targets.join(", ")})`);
}

function commandSpec(options) {
    const subcommand = String(options.subcommand || "status").toLowerCase();
    if (subcommand === "status") {
        return commandSpecStatus(options);
    }
    if (subcommand === "enable") {
        return commandSpecEnable(options);
    }
    if (subcommand === "disable") {
        return commandSpecDisable(options);
    }
    throw new Error(`未知 spec 子命令: ${subcommand}`);
}

async function commandInit(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targets = await resolveTargetsForInit(options);

    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, options);
        log(options, `[sync] 正在初始化目标 [${target}] ...`);
        adapter.install(BUNDLED_AGENT_DIR);
        registerWorkspaceTarget(workspaceRoot, target, options);
    }

    if (targets.length > 0) {
        log(options, `[ok] 初始化完成 (Targets: ${targets.join(", ")})`);
    }
}

async function commandUpdate(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targets = resolveTargetsForUpdate(workspaceRoot, options);

    if (targets.length === 0) {
        throw new Error(`此目录未检测到 ${PRIMARY_CLI_NAME} 安装，无法更新。请先执行 init。`);
    }

    log(options, `[update] 正在更新 Ling (Targets: ${targets.join(", ")})...`);

    let updatedAny = false;
    for (const target of targets) {
        if (!isTargetInstalled(workspaceRoot, target) && options.targets.length > 0) {
            throw new Error(`目标未安装: ${target}`);
        }
        if (!isTargetInstalled(workspaceRoot, target)) {
            log(options, `[skip] 目标未安装，跳过: ${target}`);
            continue;
        }

        const runOptions = { ...options, force: true };
        const adapter = createAdapter(target, workspaceRoot, runOptions);
        log(options, `[sync] 更新 [${target}] ...`);
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
        throw new Error(`update-all 不支持 --path，请直接执行 ${PRIMARY_CLI_NAME} update-all`);
    }

    const requestedTargets = normalizeTargets(options.targets);
    const { indexPath, index } = readWorkspaceIndex();
    const records = index.workspaces || [];

    if (records.length === 0) {
        log(options, "[info] 全局索引为空，没有可批量更新的工作区。");
        log(options, `   先在项目中执行 ${PRIMARY_CLI_NAME} init 或 ${PRIMARY_CLI_NAME} update 建立索引。`);
        return;
    }

    log(options, `[update] 开始批量更新工作区（共 ${records.length} 个）...`);
    log(options, `[index] 索引文件: ${indexPath}`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;
    let removedMissing = 0;
    let removedExcluded = 0;
    const timestamp = nowISO();
    const nextRecords = [];
    const removedRecordKeys = new Set();

    for (let i = 0; i < records.length; i++) {
        const item = normalizeWorkspaceRecordV2(records[i], normalizeAbsolutePath(records[i].path));
        const workspacePath = normalizeAbsolutePath(item.path);
        const exclusion = evaluateWorkspaceExclusion(index, workspacePath);

        if (exclusion.excluded) {
            removedExcluded += 1;
            removedRecordKeys.add(pathCompareKey(workspacePath));
            if (options.dryRun) {
                log(options, `[dry-run] [${i + 1}/${records.length}] 将从批量索引移除排除路径: ${workspacePath}（${exclusion.reason}）`);
            } else {
                log(options, `[clean] [${i + 1}/${records.length}] 已从批量索引中移除排除路径: ${workspacePath}（${exclusion.reason}）`);
            }
            continue;
        }

        if (!fs.existsSync(workspacePath)) {
            if (options.pruneMissing) {
                removedMissing += 1;
                removedRecordKeys.add(pathCompareKey(workspacePath));
                log(options, `[clean] [${i + 1}/${records.length}] 已移除失效工作区索引: ${workspacePath}`);
            } else {
                skipped += 1;
                log(options, `[skip] [${i + 1}/${records.length}] 工作区不存在，已跳过: ${workspacePath}`);
                nextRecords.push(item);
            }
            continue;
        }

        const installedTargets = detectInstalledTargets(workspacePath);
        let targets = [];
        if (requestedTargets.length > 0) {
            targets = installedTargets.filter((target) => requestedTargets.includes(target));
        } else {
            targets = [...Object.keys(item.targets || {}), ...installedTargets];
        }
        targets = normalizeTargets(targets);

        if (targets.length === 0) {
            skipped += 1;
            log(options, `[skip] [${i + 1}/${records.length}] 未检测到可更新目标，已跳过: ${workspacePath}`);
            nextRecords.push(item);
            continue;
        }

        log(options, `[sync] [${i + 1}/${records.length}] 更新: ${workspacePath} [${targets.join(", ")}]`);

        const updatedTargets = [];
        for (const target of targets) {
            if (!isTargetInstalled(workspacePath, target)) {
                log(options, `[skip] [${i + 1}/${records.length}] 目标未安装，跳过: ${target}`);
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
                    console.error(`[error] 更新失败: ${workspacePath} [${target}]`);
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
        withWorkspaceIndexLock(indexPath, () => {
            const { index: latestIndex } = readWorkspaceIndex();
            const mergedMap = new Map();

            for (const item of latestIndex.workspaces || []) {
                if (!item || typeof item.path !== "string") continue;
                mergedMap.set(pathCompareKey(item.path), normalizeWorkspaceRecordV2(item, normalizeAbsolutePath(item.path)));
            }

            for (const removedKey of removedRecordKeys) {
                mergedMap.delete(removedKey);
            }

            for (const item of nextRecords) {
                if (!item || typeof item.path !== "string") continue;
                mergedMap.set(pathCompareKey(item.path), normalizeWorkspaceRecordV2(item, normalizeAbsolutePath(item.path)));
            }

            latestIndex.workspaces = Array.from(mergedMap.values()).sort((a, b) => a.path.localeCompare(b.path));
            latestIndex.updatedAt = timestamp;
            writeWorkspaceIndex(indexPath, latestIndex);
        });
    }

    log(options, "[summary] 批量更新完成");
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
    const out = (message) => {
        if (!options.quiet) {
            console.log(message);
        }
    };

    if (targets.length === 0) {
        targets = detectInstalledTargets(workspaceRoot);
    }

    if (targets.length === 0) {
        throw new Error("未检测到已安装的目标。请指定 --target 或先执行 init。");
    }

    log(options, `[doctor] 开始诊断 (Targets: ${targets.join(", ")})...`);

    let hasIssue = false;
    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, options);
        out(`\n[${target.toUpperCase()}] 检查完整性...`);

        let result = adapter.checkIntegrity();
        if (result.status === "ok") {
            out("  [ok] 状态正常");
            continue;
        }

        let targetHasIssue = true;
        out(`  [error] 状态: ${result.status}`);
        for (const issue of result.issues || []) {
            out(`     - ${issue}`);
        }

        if (options.fix) {
            const fixRes = adapter.fixIntegrity();
            if (fixRes && fixRes.fixed) {
                out(`  [fix] 已修复: ${fixRes.summary}`);
                result = adapter.checkIntegrity();
                if (result.status === "ok") {
                    out("  [ok] 修复后状态正常");
                    targetHasIssue = false;
                } else {
                    out(`  [warn] 修复后仍有问题: ${result.status}`);
                    for (const issue of result.issues || []) {
                        out(`     - ${issue}`);
                    }
                    targetHasIssue = true;
                }
            } else {
                out(`  [info] 自动修复未执行: ${fixRes ? fixRes.summary : "无可用修复"}`);
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

    console.log("[exclude] 工作区排除清单");
    console.log(`   索引文件: ${indexPath}`);
    console.log("   默认规则: 自动排除灵轨工具包源码目录与系统临时目录（无需手动添加）");

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
    const indexPath = getWorkspaceIndexPath();
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const targetKey = pathCompareKey(normalizedTarget);
    let existed = false;
    let matchedCount = 0;

    withWorkspaceIndexLock(indexPath, () => {
        const { index } = readWorkspaceIndex();
        existed = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);
        matchedCount = index.workspaces.filter((item) => isPathInOrUnder(normalizedTarget, item.path)).length;
    });

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
        withWorkspaceIndexLock(indexPath, () => {
            const { index } = readWorkspaceIndex();
            const hasTarget = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);
            if (!hasTarget) {
                index.excludedPaths.push(normalizedTarget);
                index.excludedPaths = normalizePathList(index.excludedPaths);
            }
            index.workspaces = index.workspaces.filter((item) => !isPathInOrUnder(normalizedTarget, item.path));
            index.updatedAt = nowISO();
            writeWorkspaceIndex(indexPath, index);
        });
    } else {
        withWorkspaceIndexLock(indexPath, () => {
            const { index } = readWorkspaceIndex();
            index.workspaces = index.workspaces.filter((item) => !isPathInOrUnder(normalizedTarget, item.path));
            index.updatedAt = nowISO();
            writeWorkspaceIndex(indexPath, index);
        });
    }

    if (existed) {
        log(options, `[info] 排除路径已存在: ${normalizedTarget}`);
    } else {
        log(options, `[ok] 已新增排除路径: ${normalizedTarget}`);
    }

    if (matchedCount > 0) {
        log(options, `[clean] 已移除 ${matchedCount} 条已登记工作区记录（位于排除路径下）。`);
    }
    log(options, `[index] 索引文件: ${indexPath}`);
}

function commandExcludeRemove(options) {
    const targetPath = requirePathOption(options, "exclude remove");
    const indexPath = getWorkspaceIndexPath();
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const targetKey = pathCompareKey(normalizedTarget);
    let existed = false;

    withWorkspaceIndexLock(indexPath, () => {
        const { index } = readWorkspaceIndex();
        existed = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);
    });

    if (!existed) {
        log(options, `[info] 排除路径不存在: ${normalizedTarget}`);
        return;
    }

    if (options.dryRun) {
        log(options, `[dry-run] 将移除排除路径: ${normalizedTarget}`);
        return;
    }

    withWorkspaceIndexLock(indexPath, () => {
        const { index } = readWorkspaceIndex();
        index.excludedPaths = index.excludedPaths.filter((item) => pathCompareKey(item) !== targetKey);
        index.updatedAt = nowISO();
        writeWorkspaceIndex(indexPath, index);
    });

    log(options, `[ok] 已移除排除路径: ${normalizedTarget}`);
    log(options, `[index] 索引文件: ${indexPath}`);
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
    const summary = evaluateWorkspaceState(workspaceRoot, options);

    if (summary.state === "missing") {
        if (options.quiet) {
            console.log("missing");
        }
        if (!options.quiet) {
            console.log("[error] 未检测到 Ling 安装");
            console.log(`   目标目录: ${workspaceRoot}`);
        }
        setQuietStatusExitCode("missing");
        return;
    }

    if (options.quiet) {
        console.log(summary.state);
        setQuietStatusExitCode(summary.state);
        return;
    }

    console.log(summary.state === "installed" ? "[ok] Ling 状态正常" : "[warn] Ling 存在问题");
    console.log(`   CLI 版本: ${pkg.version}`);
    console.log(`   工作区: ${workspaceRoot}`);
    console.log(`   总体状态: ${summary.state}`);
    console.log(`   Targets: ${summary.targets.map((item) => item.targetName).join(", ")}`);

    const geminiState = summary.targets.find((item) => item.targetName === "gemini");
    if (geminiState) {
        const agentDir = path.join(workspaceRoot, ".agent");
        const agentsCount = countFilesIfExists(path.join(agentDir, "agents"), (name) => name.endsWith(".md"));
        const workflowsCount = countFilesIfExists(path.join(agentDir, "workflows"), (name) => name.endsWith(".md"));
        const skillsCount = countSkillsRecursive(path.join(agentDir, "skills"));
        console.log("\n[gemini]");
        console.log(`   状态: ${geminiState.state}`);
        console.log(`   路径: ${agentDir}`);
        if (geminiState.state === "installed") {
            console.log(`   Agents: ${agentsCount}`);
            console.log(`   Skills: ${skillsCount}`);
            console.log(`   Workflows: ${workflowsCount}`);
        } else {
            for (const issue of geminiState.integrity.issues || []) {
                console.log(`   Issue: ${issue}`);
            }
        }
    }

    const codexState = summary.targets.find((item) => item.targetName === "codex");
    if (codexState) {
        const managedDir = path.join(workspaceRoot, ".agents");
        const legacyDir = path.join(workspaceRoot, ".codex");
        const activeDir = fs.existsSync(managedDir) ? managedDir : legacyDir;
        const skillsCount = countSkillsRecursive(path.join(activeDir, "skills"));
        const hasManifest = fs.existsSync(path.join(activeDir, "manifest.json"));
        const legacyDetected = fs.existsSync(legacyDir);
        console.log("\n[codex]");
        console.log(`   状态: ${codexState.state}`);
        console.log(`   路径: ${activeDir}`);
        console.log(`   Skills: ${skillsCount}`);
        console.log(`   Manifest: ${hasManifest ? "yes" : "no"}`);
        if (legacyDetected) {
            console.log(`   Legacy: 检测到 .codex（建议执行 ${PRIMARY_CLI_NAME} update 迁移清理）`);
        }
        if (codexState.state !== "installed") {
            for (const issue of codexState.integrity.issues || []) {
                console.log(`   Issue: ${issue}`);
            }
        }
    }

    setQuietStatusExitCode(summary.state);
}

async function main() {
    try {
        const migration = migrateLegacyControlHomeDir();
        const { command, options, providedFlags } = parseArgs(process.argv.slice(2));

        if (migration && !options.quiet) {
            console.log(`[migrate] 已迁移控制目录: ${migration.from} -> ${migration.to}`);
        }
        maybeWarnLegacyCliAlias(options);

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

        validateOptionScope(command, options, providedFlags);
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

        if (command === "global") {
            await commandGlobal(options);
            return;
        }

        if (command === "spec") {
            commandSpec(options);
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
        console.error(`[error] ${err.message}`);
        process.exitCode = 1;
    }
}

main();
