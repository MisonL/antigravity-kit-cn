#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const pkg = require("../package.json");
const { readGlobalNpmDependencies } = require("./utils");
const CodexAdapter = require("./adapters/codex");
const { loadUserConfig, applyConfigDefaults } = require("./utils/config-store");
const {
    hasManagedCanonicalManifestSignal,
    isManagedProjectionDir,
    hasManagedAgentProjectionSignal,
    hasManagedGeminiProjectionSignal,
} = require("./utils/managed-evidence");
const {
    getWorkspaceBackupBucket,
    getLegacyWorkspaceBackupBucket,
} = require("./utils/backup-store");
const {
    selectTargets,
    selectAgentConflictPolicy,
    selectGeminiAgentsPolicy,
    confirmLegacyAgentMigration,
} = require("./interactive");
const { runVerification } = require("../scripts/verify-3platform");

const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agents");
const WORKSPACE_INDEX_VERSION = 2;
const MIGRATION_STATE_VERSION = 1;
const UPSTREAM_GLOBAL_PACKAGE = "@vudovn/ag-kit";
const TOOLKIT_PACKAGE_NAMES = new Set(["@mison/ag-kit-cn", "antigravity-kit-cn", "antigravity-kit"]);
const SUPPORTED_TARGETS = ["full", "agents", "gemini", "codex"];
const TARGET_ALIAS_MAP = {
    full: "full",
    agents: "full",
    gemini: "full",
    codex: "full",
};
const INDEX_LOCK_RETRY_MS = 50;
const INDEX_LOCK_TIMEOUT_MS = 3000;
const INDEX_LOCK_STALE_MS = 30000;

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

function getMigrationStatePath() {
    const customPath = process.env.AG_KIT_MIGRATION_STATE_PATH;
    if (customPath) {
        return path.resolve(process.cwd(), customPath);
    }
    return path.join(os.homedir(), ".ag-kit", "migrations", "v3.json");
}

function createEmptyMigrationState() {
    return {
        version: MIGRATION_STATE_VERSION,
        updatedAt: "",
        migratedWorkspaces: {},
    };
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
    printHelpGeneral({ advanced: false });
}

function printVersion() {
    console.log(`ag-kit version ${pkg.version}`);
}

function printHelpGeneral({ advanced }) {
    console.log(`Ag-Kit CLI（v${pkg.version}）`);
    console.log("");
    console.log("推荐（大多数人只需要这些）:");
    console.log("  ag-kit sync                 # 安装/升级/自愈（默认推荐）");
    console.log("  ag-kit verify --json        # CI 校验（结构化输出）");
    console.log("  ag-kit rollback --dry-run   # 先预演再回退");
    console.log("");
    console.log("帮助:");
    console.log("  ag-kit help");
    console.log("  ag-kit help <command>");
    console.log("  ag-kit help --advanced");
    console.log("  ag-kit <command> --help");

    if (advanced) {
        console.log("");
        console.log("高级命令（少用）:");
        console.log("  ag-kit init / update / update-all / doctor / status / exclude");
        console.log("");
        console.log("高级说明:");
        console.log("  - `--target/--targets` 为兼容参数，已归一为 full（.agents 为唯一主目录）。");
        console.log("  - 环境变量: AG_KIT_INDEX_PATH / AG_KIT_MIGRATION_STATE_PATH / AG_KIT_BACKUP_ROOT 等见 docs/operations.md。");
        console.log("  - 用户配置: ~/.ag-kit/config.json（或 AG_KIT_CONFIG_PATH）可设置默认 nonInteractive/disableAgentProjection 等。");
    }
}

function printHelpForCommand(command, options = {}) {
    const advanced = !!options.advanced;
    const name = String(command || "").trim().toLowerCase();

    if (!name) {
        printHelpGeneral({ advanced });
        return;
    }

    const header = (title) => {
        console.log(`ag-kit ${title}`);
        console.log("");
    };

    if (name === "init") {
        header("init");
        console.log("用途: 首次安装 v3 统一结构（.agents 为主目录），并生成 .agent/.gemini 投影与根托管区块。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit init");
        console.log("  ag-kit init --path <dir>");
        console.log("  ag-kit init --force");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --force                     覆盖安装（危险：会替换受管目录）");
        console.log("  --quiet                     静默输出");
        console.log("  --dry-run                   仅预览，不写入文件");
        if (!advanced) {
            console.log("");
            console.log("更多选项: ag-kit help init --advanced");
        } else {
            console.log("  --non-interactive           禁用交互询问，按默认策略处理冲突");
            console.log("  --disable-agent-projection  停用 .agent 投影（避免重复规则扫描）");
            console.log("  --no-index                  不写入全局工作区索引（避免副作用）");
            console.log("  --branch <name>             从远程分支拉取模板（需网络与 git）");
            console.log("  --target/--targets           兼容参数（仍归一为 full）");
        }
        return;
    }

    if (name === "sync") {
        header("sync");
        console.log("用途: 一键同步当前项目到最新状态。未安装则执行 init；已安装则执行 update；遇到 legacy .agent 会按迁移策略处理。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit sync");
        console.log("  ag-kit sync --path <dir>");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --quiet                     静默输出");
        console.log("  --dry-run                   仅预览，不写入文件");
        if (!advanced) {
            console.log("");
            console.log("更多选项: ag-kit help sync --advanced");
        } else {
            console.log("  --accept-legacy-agent       允许迁移“仅 legacy .agent 且无托管证据”的旧安装（非交互必需）");
            console.log("  --non-interactive           禁用交互询问，按默认策略处理冲突");
            console.log("  --disable-agent-projection  停用 .agent 投影");
            console.log("  --no-index                  不写入/刷新全局索引");
            console.log("  --branch <name>             从远程分支拉取模板（需网络与 git）");
            console.log("  --force                     当需要覆盖安装时可用（等价 init --force 的覆盖语义）");
            console.log("  --target/--targets           兼容参数（仍归一为 full）");
            console.log("");
            console.log("配置文件（可选）:");
            console.log("  - 默认路径: ~/.ag-kit/config.json（或 AG_KIT_CONFIG_PATH 指定）");
            console.log("  - 支持 defaults: { nonInteractive, disableAgentProjection, noIndex, quiet, acceptLegacyAgent, agentConflictPolicy, geminiAgentsPolicy }");
        }
        return;
    }

    if (name === "update") {
        header("update");
        console.log("用途: 升级当前项目（.agents 原子更新 + 投影同步 + 托管区块刷新），并收敛 legacy 结构。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit update");
        console.log("  ag-kit update --accept-legacy-agent   # 迁移仅 legacy .agent 的旧安装");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --quiet                     静默输出");
        console.log("  --dry-run                   仅预览，不写入文件");
        if (!advanced) {
            console.log("");
            console.log("更多选项: ag-kit help update --advanced");
        } else {
            console.log("  --accept-legacy-agent       允许迁移“仅 legacy .agent 且无托管证据”的旧安装（非交互必需）");
            console.log("  --non-interactive           禁用交互询问，按默认策略处理冲突");
            console.log("  --disable-agent-projection  停用 .agent 投影");
            console.log("  --no-index                  更新但不刷新全局索引");
            console.log("  --branch <name>             从远程分支拉取模板（需网络与 git）");
            console.log("  --target/--targets           兼容参数（仍归一为 full）");
        }
        return;
    }

    if (name === "update-all") {
        header("update-all");
        console.log("用途: 遍历全局索引批量升级所有工作区。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit update-all");
        console.log("  ag-kit update-all --prune-missing");
        console.log("  ag-kit update-all --accept-legacy-agent");
        console.log("");
        console.log("选项:");
        console.log("  --prune-missing             从索引移除已不存在的路径");
        console.log("  --quiet                     静默输出");
        console.log("  --dry-run                   仅预览，不写入文件/索引");
        if (!advanced) {
            console.log("");
            console.log("更多选项: ag-kit help update-all --advanced");
        } else {
            console.log("  --accept-legacy-agent       允许批量迁移 legacy .agent 工作区");
            console.log("  --non-interactive           禁用交互询问，按默认策略处理冲突");
            console.log("  --disable-agent-projection  停用 .agent 投影");
            console.log("  --branch <name>             从远程分支拉取模板（需网络与 git）");
            console.log("  --targets <a,b>             兼容参数（仍归一为 full）");
        }
        return;
    }

    if (name === "doctor") {
        header("doctor");
        console.log("用途: 诊断安装完整性；可用 --fix 执行幂等修复。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit doctor");
        console.log("  ag-kit doctor --fix");
        console.log("  ag-kit doctor --fix --accept-legacy-agent");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --fix                       自动修复（会创建 rollback 快照）");
        console.log("  --quiet                     静默输出");
        if (!advanced) {
            console.log("");
            console.log("更多选项: ag-kit help doctor --advanced");
        } else {
            console.log("  --accept-legacy-agent       允许迁移 legacy .agent（仅在 --fix 时生效）");
            console.log("  --non-interactive           禁用交互询问");
            console.log("  --target/--targets           兼容参数（仍归一为 full）");
        }
        return;
    }

    if (name === "rollback") {
        header("rollback");
        console.log("用途: 回退到升级/安装前自动创建的 rollback 快照。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit rollback --dry-run");
        console.log("  ag-kit rollback");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --backup <id>               指定快照（默认最近一次）");
        console.log("  --dry-run                   仅预演，不写入文件");
        console.log("  --quiet                     静默输出");
        return;
    }

    if (name === "verify") {
        header("verify");
        console.log("用途: 三平台（Codex/Gemini/Antigravity）可用性与一致性检查。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit verify");
        console.log("  ag-kit verify --json");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --json                      输出 JSON 报告（CI 友好）");
        console.log("  --quiet                     静默输出");
        return;
    }

    if (name === "status") {
        header("status");
        console.log("用途: 检查当前工作区安装状态（只读）。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit status");
        console.log("");
        console.log("选项:");
        console.log("  --path <dir>                指定工作区（默认当前目录）");
        console.log("  --quiet                     静默输出（仅输出 installed/错误）");
        return;
    }

    if (name === "exclude") {
        header("exclude");
        console.log("用途: 管理全局索引排除清单。");
        console.log("");
        console.log("常用:");
        console.log("  ag-kit exclude list");
        console.log("  ag-kit exclude add --path <dir>");
        console.log("  ag-kit exclude remove --path <dir>");
        console.log("");
        console.log("说明:");
        console.log("  - 排除路径支持整棵目录树；会影响 update-all 的批量范围。");
        return;
    }

    console.log(`未知命令: ${name}`);
    console.log("推荐命令: sync, verify, rollback");
    console.log("提示: ag-kit help（或 ag-kit help --advanced 查看全部命令）");
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
        help: false,
        advanced: false,
        path: "",
        json: false,
        backup: "",
        branch: "",
        targets: [],
        disableAgentProjection: false,
        acceptLegacyAgent: false,
        agentConflictPolicy: "",
        geminiAgentsPolicy: "",
    };
    const providedFlags = [];

    let startIndex = 1;
    if (command === "exclude" || command === "help") {
        if (argv.length > 1 && !argv[1].startsWith("--")) {
            options.subcommand = argv[1];
            startIndex = 2;
        } else {
            options.subcommand = command === "exclude" ? "list" : "";
            startIndex = 1;
        }
    }

    for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === "--help" || arg === "-h") {
            options.help = true;
            continue;
        }
        if (arg === "--advanced") {
            options.advanced = true;
            continue;
        }

        if (arg === "--force") {
            providedFlags.push(arg);
            options.force = true;
        } else if (arg === "--quiet") {
            providedFlags.push(arg);
            options.quiet = true;
        } else if (arg === "--json") {
            providedFlags.push(arg);
            options.json = true;
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
        } else if (arg === "--disable-agent-projection") {
            providedFlags.push(arg);
            options.disableAgentProjection = true;
        } else if (arg === "--accept-legacy-agent") {
            providedFlags.push(arg);
            options.acceptLegacyAgent = true;
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
        } else if (arg === "--backup") {
            providedFlags.push(arg);
            if (i + 1 >= argv.length) {
                throw new Error("--backup 需要一个备份标识参数");
            }
            options.backup = argv[++i];
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
    sync: ["--force", "--path", "--branch", "--target", "--targets", "--accept-legacy-agent", "--non-interactive", "--disable-agent-projection", "--no-index", "--quiet", "--dry-run"],
    init: ["--force", "--path", "--branch", "--target", "--targets", "--non-interactive", "--disable-agent-projection", "--no-index", "--quiet", "--dry-run"],
    update: ["--path", "--branch", "--target", "--targets", "--accept-legacy-agent", "--non-interactive", "--disable-agent-projection", "--no-index", "--quiet", "--dry-run"],
    "update-all": ["--branch", "--targets", "--accept-legacy-agent", "--non-interactive", "--prune-missing", "--disable-agent-projection", "--quiet", "--dry-run"],
    verify: ["--path", "--json", "--quiet"],
    rollback: ["--path", "--backup", "--quiet", "--dry-run"],
    doctor: ["--path", "--target", "--targets", "--accept-legacy-agent", "--non-interactive", "--fix", "--quiet"],
    status: ["--path", "--quiet"],
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
    return COMMAND_ALLOWED_FLAGS[command] || null;
}

function resolveCommandLabel(command, options) {
    if (command === "exclude") {
        const subcommand = String(options.subcommand || "list").toLowerCase();
        return `exclude ${subcommand}`;
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
    const cliPath = path.join(workspacePath, "bin", "ag-kit.js");

    if (!fs.existsSync(packageJsonPath) || !fs.existsSync(cliPath)) {
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

function normalizeTargetName(rawTarget) {
    const key = String(rawTarget || "").trim().toLowerCase();
    if (!key) {
        return "";
    }
    return TARGET_ALIAS_MAP[key] || "";
}

function normalizeWorkspaceRecordV2(item, normalizedPath) {
    const targets = {};
    if (item && item.targets && typeof item.targets === "object") {
        for (const [targetName, state] of Object.entries(item.targets)) {
            const normalizedTarget = normalizeTargetName(targetName);
            if (!normalizedTarget) {
                continue;
            }
            const normalizedState = normalizeTargetState(state);
            if (normalizedState) {
                targets[normalizedTarget] = normalizedState;
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
        targets.full = {
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

function normalizeMigrationEntry(entry, normalizedPath) {
    if (!entry || typeof entry !== "object") {
        return null;
    }

    const status = typeof entry.status === "string" ? entry.status : "";
    if (!status) {
        return null;
    }

    return {
        path: normalizedPath,
        status,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
        cliVersion: typeof entry.cliVersion === "string" ? entry.cliVersion : "",
    };
}

function readMigrationState() {
    const statePath = getMigrationStatePath();
    if (!fs.existsSync(statePath)) {
        return { statePath, state: createEmptyMigrationState() };
    }

    const raw = fs.readFileSync(statePath, "utf8").trim();
    if (!raw) {
        return { statePath, state: createEmptyMigrationState() };
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (_err) {
        return { statePath, state: createEmptyMigrationState() };
    }

    const normalized = createEmptyMigrationState();
    normalized.updatedAt = typeof parsed.updatedAt === "string" ? parsed.updatedAt : "";

    const migratedWorkspaces = parsed && parsed.migratedWorkspaces && typeof parsed.migratedWorkspaces === "object"
        ? parsed.migratedWorkspaces
        : {};

    for (const [rawPath, entry] of Object.entries(migratedWorkspaces)) {
        if (typeof rawPath !== "string" || rawPath.trim() === "") {
            continue;
        }
        const normalizedPath = normalizeAbsolutePath(rawPath);
        const normalizedEntry = normalizeMigrationEntry(entry, normalizedPath);
        if (!normalizedEntry) {
            continue;
        }
        normalized.migratedWorkspaces[pathCompareKey(normalizedPath)] = normalizedEntry;
    }

    return { statePath, state: normalized };
}

function writeMigrationState(statePath, state) {
    const payload = createEmptyMigrationState();
    payload.updatedAt = state.updatedAt || nowISO();

    const entries = state && state.migratedWorkspaces && typeof state.migratedWorkspaces === "object"
        ? state.migratedWorkspaces
        : {};

    for (const entry of Object.values(entries)) {
        if (!entry || typeof entry.path !== "string" || entry.path.trim() === "") {
            continue;
        }

        const normalizedPath = normalizeAbsolutePath(entry.path);
        const normalizedEntry = normalizeMigrationEntry(entry, normalizedPath);
        if (!normalizedEntry) {
            continue;
        }
        payload.migratedWorkspaces[normalizedPath] = normalizedEntry;
    }

    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function upsertMigrationRecord(state, workspaceRoot, status, timestamp) {
    if (!state.migratedWorkspaces || typeof state.migratedWorkspaces !== "object") {
        state.migratedWorkspaces = {};
    }

    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    state.migratedWorkspaces[pathCompareKey(normalizedPath)] = {
        path: normalizedPath,
        status,
        updatedAt: timestamp,
        cliVersion: pkg.version,
    };
}

function getMigrationRecord(state, workspaceRoot) {
    if (!state || !state.migratedWorkspaces || typeof state.migratedWorkspaces !== "object") {
        return null;
    }

    const normalizedPath = normalizeAbsolutePath(workspaceRoot);
    const key = pathCompareKey(normalizedPath);
    const entry = state.migratedWorkspaces[key];
    if (!entry || typeof entry !== "object") {
        return null;
    }

    return {
        path: typeof entry.path === "string" ? entry.path : normalizedPath,
        status: typeof entry.status === "string" ? entry.status : "",
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : "",
        cliVersion: typeof entry.cliVersion === "string" ? entry.cliVersion : "",
    };
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
            reason: "检测为 Ag-Kit 工具包源码目录（默认排除）",
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

    const normalizedTarget = normalizeTargetName(targetName) || "full";
    const prev = normalizeTargetState(record.targets[normalizedTarget]) || {
        version: "",
        installedAt: "",
        updatedAt: "",
    };

    record.targets[normalizedTarget] = {
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
            log(options, `⏭️ 已跳过索引登记: ${normalizeAbsolutePath(workspaceRoot)}`);
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
            log(options, `⏭️ 已跳过索引登记: ${normalizedPath}`);
            log(options, `   原因: ${exclusionReason}`);
            if (removedCount > 0) {
                log(options, `🧹 已清理旧索引记录: ${normalizedPath}`);
            }
            log(options, `   索引文件: ${indexPath}`);
        }
        return;
    }

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
    if (command !== "init" && command !== "update" && command !== "sync" && command !== "update-all") {
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

function maybeWarnLegacyTargetAlias(options, rawTargets) {
    if (options.quiet) {
        return;
    }
    const aliases = [];
    for (const raw of rawTargets || []) {
        const key = String(raw || "").trim().toLowerCase();
        if (!key || key === "full" || key === "agents") {
            continue;
        }
        if (key === "gemini" || key === "codex") {
            aliases.push(key);
        }
    }
    if (aliases.length > 0) {
        log(options, `ℹ️ 检测到兼容目标参数: ${Array.from(new Set(aliases)).join(", ")}，将自动归一为 full 安装流程。`);
    }
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
            const normalized = normalizeTargetName(target);
            if (!normalized) {
                continue;
            }
            if (!seen.has(normalized)) {
                seen.add(normalized);
                result.push(normalized);
            }
        }
    }

    return result;
}

function isManagedLegacyCodexDir(workspaceRoot) {
    const legacyManifest = path.join(workspaceRoot, ".codex", "manifest.json");
    if (!fs.existsSync(legacyManifest)) {
        return false;
    }
    try {
        const parsed = JSON.parse(fs.readFileSync(legacyManifest, "utf8"));
        const target = typeof parsed.target === "string" ? parsed.target.toLowerCase() : "";
        return (target === "codex" || target === "full") && parsed.files && typeof parsed.files === "object";
    } catch (_err) {
        return false;
    }
}

function looksLikeLegacyAgentWorkspace(workspaceRoot) {
    const agentDir = path.join(workspaceRoot, ".agent");
    try {
        if (!fs.existsSync(agentDir) || !fs.statSync(agentDir).isDirectory()) {
            return false;
        }
    } catch (_err) {
        return false;
    }

    const requiredDirs = ["agents", "skills", "rules", "workflows"];
    for (const relPath of requiredDirs) {
        const absPath = path.join(agentDir, relPath);
        try {
            if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
                return false;
            }
        } catch (_err) {
            return false;
        }
    }

    const requiredFiles = ["rules/GEMINI.md", "agents/orchestrator.md"];
    for (const relPath of requiredFiles) {
        const absPath = path.join(agentDir, relPath);
        try {
            if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
                return false;
            }
        } catch (_err) {
            return false;
        }
    }

    return true;
}

function hasManagedLegacyLayoutSignal(workspaceRoot) {
    return hasManagedAgentProjectionSignal(workspaceRoot)
        || hasManagedGeminiProjectionSignal(workspaceRoot)
        || isManagedLegacyCodexDir(workspaceRoot);
}

function detectInstalledTargets(workspaceRoot) {
    if (hasManagedCanonicalManifestSignal(workspaceRoot) || hasManagedLegacyLayoutSignal(workspaceRoot)) {
        return ["full"];
    }
    return [];
}

function isTargetInstalled(workspaceRoot, targetName) {
    const normalized = normalizeTargetName(targetName);
    if (normalized === "full") {
        return hasManagedCanonicalManifestSignal(workspaceRoot) || hasManagedLegacyLayoutSignal(workspaceRoot);
    }
    return false;
}

function createAdapter(targetName, workspaceRoot, options) {
    const normalized = normalizeTargetName(targetName);
    if (normalized === "full") {
        return new CodexAdapter(workspaceRoot, options);
    }
    throw new Error(`未知目标: ${targetName}`);
}

async function resolveTargetsForInit(options) {
    maybeWarnLegacyTargetAlias(options, options.targets);
    let targets = normalizeTargets(options.targets);

    if (targets.length > 0) {
        return targets;
    }
    targets = normalizeTargets(await selectTargets(options));
    if (targets.length === 0) {
        return ["full"];
    }

    return targets;
}

function resolveTargetsForUpdate(workspaceRoot, options) {
    maybeWarnLegacyTargetAlias(options, options.targets);
    const requested = normalizeTargets(options.targets);
    if (requested.length > 0) {
        return requested;
    }
    return detectInstalledTargets(workspaceRoot);
}

async function resolveConflictPolicies(workspaceRoot, options) {
    const next = { ...options };
    const isInteractive = !next.nonInteractive && process.stdin.isTTY && process.stdout.isTTY;
    const hasAgentDir = fs.existsSync(path.join(workspaceRoot, ".agent"));
    const hasGeminiAgentsDir = fs.existsSync(path.join(workspaceRoot, ".gemini", "agents"));
    const managedAgentProjection = isManagedProjectionDir(workspaceRoot, ".agent", "agent");
    const managedGeminiProjection = hasManagedGeminiProjectionSignal(workspaceRoot);

    if (next.disableAgentProjection && !next.agentConflictPolicy) {
        next.agentConflictPolicy = "disable";
    }

    if (!next.agentConflictPolicy) {
        if (hasAgentDir && !managedAgentProjection && isInteractive) {
            next.agentConflictPolicy = await selectAgentConflictPolicy();
        } else {
            next.agentConflictPolicy = "backup_replace";
        }
    }

    if (!next.geminiAgentsPolicy) {
        if (hasGeminiAgentsDir && !managedGeminiProjection && isInteractive) {
            next.geminiAgentsPolicy = await selectGeminiAgentsPolicy();
        } else {
            next.geminiAgentsPolicy = "append";
        }
    }

    return next;
}

function shouldRunAutoMigration(command, options) {
    if (options.dryRun) {
        return false;
    }
    if (options.noIndex) {
        return false;
    }

    if (command === "init" || command === "update" || command === "sync" || command === "update-all") {
        return true;
    }

    return command === "doctor" && options.fix;
}

function ensureBundledTemplates() {
    if (fs.existsSync(BUNDLED_AGENT_DIR)) {
        return;
    }
    throw new Error(`缺少内置模板目录: ${BUNDLED_AGENT_DIR}`);
}

async function runAutoMigrationOnce(command, options) {
    if (!shouldRunAutoMigration(command, options)) {
        return;
    }
    if (process.env.AG_KIT_SKIP_AUTO_MIGRATION === "1") {
        return;
    }

    const { index } = readWorkspaceIndex();
    const records = Array.isArray(index.workspaces) ? index.workspaces : [];
    if (records.length === 0) {
        return;
    }

    const { statePath, state } = readMigrationState();
    let touchedState = false;
    let migratedCount = 0;
    let failedCount = 0;
    let alreadyManagedCount = 0;

    for (const rawRecord of records) {
        if (!rawRecord || typeof rawRecord.path !== "string" || rawRecord.path.trim() === "") {
            continue;
        }

        const workspacePath = normalizeAbsolutePath(rawRecord.path);
        if (getMigrationRecord(state, workspacePath)) {
            continue;
        }

        if (!fs.existsSync(workspacePath)) {
            continue;
        }

        const exclusion = evaluateWorkspaceExclusion(index, workspacePath);
        if (exclusion.excluded) {
            continue;
        }

        const managedCanonical = hasManagedCanonicalManifestSignal(workspacePath);
        const agentsDirExists = fs.existsSync(path.join(workspacePath, ".agents"));

        if (managedCanonical) {
            upsertMigrationRecord(state, workspacePath, "already_v3", nowISO());
            touchedState = true;
            alreadyManagedCount += 1;
            continue;
        }

        if (agentsDirExists) {
            // Avoid touching user-managed .agents directory without managed manifest evidence.
            continue;
        }

        if (!hasManagedLegacyLayoutSignal(workspacePath)) {
            continue;
        }

        try {
            const runOptions = {
                ...options,
                path: workspacePath,
                force: true,
                nonInteractive: true,
                noIndex: false,
                quiet: true,
                silentIndexLog: true,
                agentConflictPolicy: "backup_replace",
                geminiAgentsPolicy: "append",
            };
            const adapter = createAdapter("full", workspacePath, runOptions);
            adapter.update(BUNDLED_AGENT_DIR);
            registerWorkspaceTarget(workspacePath, "full", runOptions);
            upsertMigrationRecord(state, workspacePath, "migrated", nowISO());
            touchedState = true;
            migratedCount += 1;
        } catch (err) {
            failedCount += 1;
            if (!options.quiet) {
                console.warn(`⚠️ 自动迁移失败: ${workspacePath}`);
                console.warn(`   ${err.message}`);
            }
        }
    }

    if (touchedState) {
        state.updatedAt = nowISO();
        writeMigrationState(statePath, state);
    }

    if (!options.quiet && (migratedCount > 0 || failedCount > 0 || alreadyManagedCount > 0)) {
        log(options, "🧭 自动迁移检查（v3）完成");
        log(options, `   已迁移: ${migratedCount}`);
        log(options, `   已是 v3: ${alreadyManagedCount}`);
        log(options, `   失败: ${failedCount}`);
        log(options, `   状态文件: ${statePath}`);
    }
}

async function commandInit(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const targets = await resolveTargetsForInit(options);
    const runOptions = await resolveConflictPolicies(workspaceRoot, options);

    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, runOptions);
        log(options, `📦 正在初始化目标 [${target}] ...`);
        adapter.install(BUNDLED_AGENT_DIR);
        registerWorkspaceTarget(workspaceRoot, target, runOptions);
    }

    if (targets.length > 0) {
        log(options, `✅ 初始化完成 (Mode: ${targets.join(", ")})`);
    }
}

async function commandUpdate(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    let targets = resolveTargetsForUpdate(workspaceRoot, options);
    const legacyAgentCandidate = looksLikeLegacyAgentWorkspace(workspaceRoot);

    if (targets.length === 0 && legacyAgentCandidate) {
        if (options.acceptLegacyAgent) {
            targets = ["full"];
        } else if (!options.nonInteractive && process.stdin.isTTY && process.stdout.isTTY) {
            const confirmed = await confirmLegacyAgentMigration();
            if (confirmed) {
                options.acceptLegacyAgent = true;
                options.agentConflictPolicy = options.agentConflictPolicy || "backup_replace";
                targets = ["full"];
            }
        }
    }

    if (targets.length === 0) {
        if (legacyAgentCandidate) {
            throw new Error(
                "此目录未检测到 Antigravity Kit 安装，无法更新。\n"
                + "检测到疑似旧版仅 .agent 安装，但当前为非交互环境或未显式允许迁移。\n"
                + "可选方案:\n"
                + "1) 执行 ag-kit update --accept-legacy-agent --path <dir> 进行迁移（会创建 rollback 快照）\n"
                + "2) 或执行 ag-kit init --force --path <dir> 直接覆盖升级（同样会备份冲突目录）"
            );
        }
        throw new Error("此目录未检测到 Antigravity Kit 安装，无法更新。请先执行 init。");
    }

    const runOptions = await resolveConflictPolicies(workspaceRoot, options);

    log(options, `🔄 正在更新 Antigravity Kit (Targets: ${targets.join(", ")})...`);

    let updatedAny = false;
    for (const target of targets) {
        const installed = isTargetInstalled(workspaceRoot, target)
            || (target === "full" && runOptions.acceptLegacyAgent && legacyAgentCandidate);
        if (!installed && options.targets.length > 0) {
            throw new Error(`目标未安装: ${target}`);
        }
        if (!installed) {
            log(options, `⏭️ 目标未安装，跳过: ${target}`);
            continue;
        }

        const targetOptions = { ...runOptions, force: true };
        const adapter = createAdapter(target, workspaceRoot, targetOptions);
        log(options, `📦 更新 [${target}] ...`);
        adapter.update(BUNDLED_AGENT_DIR);
        registerWorkspaceTarget(workspaceRoot, target, targetOptions);
        updatedAny = true;
    }

    if (!updatedAny) {
        throw new Error("未找到可更新的目标");
    }
}

async function commandSync(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const installedTargets = detectInstalledTargets(workspaceRoot);
    const legacyAgentCandidate = looksLikeLegacyAgentWorkspace(workspaceRoot);

    const hasManagedSignal = hasManagedAgentProjectionSignal(workspaceRoot)
        || hasManagedGeminiProjectionSignal(workspaceRoot)
        || isManagedLegacyCodexDir(workspaceRoot);

    if (installedTargets.length > 0 || legacyAgentCandidate) {
        try {
            await commandUpdate(options);
            return;
        } catch (err) {
            const message = err && err.message ? String(err.message) : "";
            if (
                message.includes("目录存在但未检测到受管 manifest")
                && fs.existsSync(path.join(workspaceRoot, ".agents"))
                && hasManagedSignal
            ) {
                if (options.dryRun) {
                    log(options, "[dry-run] 检测到 .agents 缺少受管 manifest，但存在托管信号；正式运行将尝试通过 doctor --fix 修复。");
                    return;
                }
                await commandDoctor({ ...options, fix: true });
                return;
            }
            throw err;
        }
    }

    await commandInit(options);
}

function mergeUpdatedTargets(record, workspacePath, targetNames, timestamp) {
    const normalizedPath = normalizeAbsolutePath(workspacePath);
    const next = normalizeWorkspaceRecordV2(record || {}, normalizedPath);

    for (const target of targetNames) {
        const normalizedTarget = normalizeTargetName(target) || "full";
        const prev = normalizeTargetState(next.targets[normalizedTarget]) || {
            version: "",
            installedAt: "",
            updatedAt: "",
        };
        next.targets[normalizedTarget] = {
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

    maybeWarnLegacyTargetAlias(options, options.targets);
    const requestedTargets = normalizeTargets(options.targets);
    const { indexPath, index } = readWorkspaceIndex();
    const records = index.workspaces || [];
    const isInteractive = !options.nonInteractive && process.stdin.isTTY && process.stdout.isTTY;

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
    const removedRecordKeys = new Set();

    const isInstalledOrLegacy = (workspacePath, targetName, acceptLegacyAgent, legacyAgentCandidate) => {
        return isTargetInstalled(workspacePath, targetName)
            || (targetName === "full" && acceptLegacyAgent && legacyAgentCandidate);
    };

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
                log(options, `🧽 [${i + 1}/${records.length}] 已从批量索引中移除排除路径: ${workspacePath}（${exclusion.reason}）`);
            }
            continue;
        }

        if (!fs.existsSync(workspacePath)) {
            if (options.pruneMissing) {
                removedMissing += 1;
                removedRecordKeys.add(pathCompareKey(workspacePath));
                log(options, `🧽 [${i + 1}/${records.length}] 已移除失效工作区索引: ${workspacePath}`);
            } else {
                skipped += 1;
                log(options, `⏭️ [${i + 1}/${records.length}] 工作区不存在，已跳过: ${workspacePath}`);
                nextRecords.push(item);
            }
            continue;
        }

        const legacyAgentCandidate = looksLikeLegacyAgentWorkspace(workspacePath);
        let acceptLegacyAgent = !!options.acceptLegacyAgent;

        const installedTargets = detectInstalledTargets(workspacePath);
        let targets = [];
        if (requestedTargets.length > 0) {
            targets = installedTargets.filter((target) => requestedTargets.includes(target));
        } else {
            targets = [...Object.keys(item.targets || {}), ...installedTargets];
        }
        targets = normalizeTargets(targets);

        const anyUpdatable = targets.some((target) => isInstalledOrLegacy(workspacePath, target, acceptLegacyAgent, legacyAgentCandidate));
        if (targets.length === 0 || !anyUpdatable) {
            if (legacyAgentCandidate) {
                if (!acceptLegacyAgent) {
                    if (isInteractive) {
                        log(options, `ℹ️ [${i + 1}/${records.length}] 检测到疑似旧版仅 .agent 安装: ${workspacePath}`);
                        const confirmed = await confirmLegacyAgentMigration();
                        if (confirmed) {
                            acceptLegacyAgent = true;
                        }
                    }
                }

                if (!acceptLegacyAgent) {
                    skipped += 1;
                    log(options, `⏭️ [${i + 1}/${records.length}] 检测到疑似旧版仅 .agent 安装，但当前为非交互环境或未显式允许迁移，已跳过: ${workspacePath}`);
                    if (!options.quiet) {
                        log(options, "   可选方案:");
                        log(options, "   1) 执行 ag-kit update-all --accept-legacy-agent 进行迁移（会创建 rollback 快照）");
                        log(options, "   2) 或对单个项目执行 ag-kit update --accept-legacy-agent --path <dir>");
                        log(options, "   3) 或执行 ag-kit init --force --path <dir> 覆盖升级");
                    }
                    nextRecords.push(item);
                    continue;
                }

                targets = ["full"];
            } else {
                skipped += 1;
                log(options, `⏭️ [${i + 1}/${records.length}] 未检测到可更新目标，已跳过: ${workspacePath}`);
                nextRecords.push(item);
                continue;
            }
        }

        log(options, `📦 [${i + 1}/${records.length}] 更新: ${workspacePath} [${targets.join(", ")}]`);

        const updatedTargets = [];
        for (const target of targets) {
            if (!isInstalledOrLegacy(workspacePath, target, acceptLegacyAgent, legacyAgentCandidate)) {
                log(options, `⏭️ [${i + 1}/${records.length}] 目标未安装，跳过: ${target}`);
                continue;
            }

            try {
                const baseOptions = acceptLegacyAgent && legacyAgentCandidate
                    ? {
                        ...options,
                        agentConflictPolicy: options.agentConflictPolicy || "backup_replace",
                    }
                    : options;
                const conflictOptions = await resolveConflictPolicies(workspacePath, baseOptions);
                const runOptions = {
                    ...conflictOptions,
                    force: true,
                    path: workspacePath,
                    silentIndexLog: true,
                    acceptLegacyAgent,
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

function removePathIfExists(targetPath) {
    if (!fs.existsSync(targetPath)) {
        return;
    }
    fs.rmSync(targetPath, { recursive: true, force: true });
}

function isSafeRollbackTarget(relPath) {
    if (typeof relPath !== "string" || relPath.trim() === "") {
        return false;
    }
    if (path.isAbsolute(relPath)) {
        return false;
    }
    const normalized = path.normalize(relPath);
    if (normalized === ".." || normalized.startsWith(`..${path.sep}`)) {
        return false;
    }
    return true;
}

function parseRollbackManifest(manifestPath) {
    if (!fs.existsSync(manifestPath)) {
        return null;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.targets)) {
            return null;
        }
        return parsed;
    } catch (_err) {
        return null;
    }
}

function listRollbackSnapshots(workspaceRoot) {
    const backupBases = [
        { type: "global", dir: getWorkspaceBackupBucket(workspaceRoot) },
        { type: "legacy-local", dir: getLegacyWorkspaceBackupBucket(workspaceRoot) },
    ];
    const snapshots = [];
    for (const backupBase of backupBases) {
        if (!fs.existsSync(backupBase.dir)) {
            continue;
        }

        const entries = fs.readdirSync(backupBase.dir, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }

            const backupId = entry.name;
            const backupRoot = path.join(backupBase.dir, backupId);
            const manifestPath = path.join(backupRoot, "rollback-manifest.json");
            const manifest = parseRollbackManifest(manifestPath);
            if (!manifest) {
                continue;
            }

            snapshots.push({
                backupId,
                backupRoot,
                manifest,
                source: backupBase.type,
            });
        }
    }

    snapshots.sort((a, b) => {
        const timeA = Date.parse(a.manifest.createdAt || "");
        const timeB = Date.parse(b.manifest.createdAt || "");
        if (Number.isFinite(timeA) && Number.isFinite(timeB) && timeA !== timeB) {
            return timeB - timeA;
        }
        return b.backupId.localeCompare(a.backupId);
    });
    return snapshots;
}

function commandRollback(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const snapshots = listRollbackSnapshots(workspaceRoot);
    if (snapshots.length === 0) {
        throw new Error(`未找到可用回退快照。已检查: ${getWorkspaceBackupBucket(workspaceRoot)} 与 ${getLegacyWorkspaceBackupBucket(workspaceRoot)}`);
    }

    let selected = snapshots[0];
    if (options.backup) {
        const found = snapshots.find((item) => item.backupId === options.backup);
        if (!found) {
            const candidates = snapshots.slice(0, 5).map((item) => item.backupId).join(", ");
            throw new Error(`未找到备份: ${options.backup}。可用备份(最近 5 条): ${candidates}`);
        }
        selected = found;
    }

    const rollbackRoot = path.join(selected.backupRoot, "rollback");
    if (!fs.existsSync(rollbackRoot)) {
        throw new Error(`回退快照目录缺失: ${rollbackRoot}`);
    }

    log(options, `↩️ 准备回退工作区: ${workspaceRoot}`);
    log(options, `📦 使用备份: ${selected.backupId}`);
    log(options, `📁 备份位置: ${selected.backupRoot} (${selected.source})`);

    for (const target of selected.manifest.targets) {
        const relPath = target && typeof target.path === "string" ? target.path : "";
        if (!isSafeRollbackTarget(relPath)) {
            throw new Error(`回退清单包含非法路径: ${String(relPath)}`);
        }

        const type = target && target.type === "file" ? "file" : "dir";
        const existed = !!(target && target.existed);
        const absPath = path.join(workspaceRoot, relPath);
        const snapshotPath = path.join(rollbackRoot, relPath);

        if (existed) {
            if (!fs.existsSync(snapshotPath)) {
                throw new Error(`回退快照缺失: ${snapshotPath}`);
            }

            if (options.dryRun) {
                log(options, `[dry-run] 将恢复 ${relPath}`);
                continue;
            }

            removePathIfExists(absPath);
            if (type === "file") {
                fs.mkdirSync(path.dirname(absPath), { recursive: true });
                fs.copyFileSync(snapshotPath, absPath);
            } else {
                copyDirRecursive(snapshotPath, absPath);
            }
        } else {
            if (options.dryRun) {
                log(options, `[dry-run] 将移除 ${relPath}（回退前不存在）`);
                continue;
            }
            removePathIfExists(absPath);
        }
    }

    if (options.dryRun) {
        log(options, "✅ 回退预演完成（未写入文件）");
        return;
    }

    log(options, "✅ 回退完成");
}

function commandVerify(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    const report = runVerification({
        workspace: workspaceRoot,
        json: options.json,
        quiet: options.quiet,
        print: true,
        useGlobalCli: false,
        env: process.env,
    });

    if (report.summary.fail > 0) {
        process.exitCode = 1;
    }
}

async function commandDoctor(options) {
    const workspaceRoot = resolveWorkspaceRoot(options.path);
    let targets = normalizeTargets(options.targets);
    const legacyAgentCandidate = looksLikeLegacyAgentWorkspace(workspaceRoot);
    const isInteractive = !options.nonInteractive && process.stdin.isTTY && process.stdout.isTTY;
    const out = (message) => {
        if (!options.quiet) {
            console.log(message);
        }
    };

    if (targets.length === 0) {
        targets = detectInstalledTargets(workspaceRoot);
    }

    const anyInstalledTarget = targets.some((target) => isTargetInstalled(workspaceRoot, target));
    if (!anyInstalledTarget && legacyAgentCandidate && options.fix) {
        if (options.acceptLegacyAgent) {
            targets = ["full"];
            options.agentConflictPolicy = options.agentConflictPolicy || "backup_replace";
        } else if (isInteractive) {
            const confirmed = await confirmLegacyAgentMigration();
            if (confirmed) {
                options.acceptLegacyAgent = true;
                options.agentConflictPolicy = options.agentConflictPolicy || "backup_replace";
                targets = ["full"];
            } else {
                throw new Error(
                    "未检测到已安装的目标。\n"
                    + "检测到疑似旧版仅 .agent 安装，但当前未启用迁移。\n"
                    + "可选方案:\n"
                    + "1) 执行 ag-kit doctor --fix --accept-legacy-agent --path <dir> 进行迁移（会创建 rollback 快照）\n"
                    + "2) 或执行 ag-kit update --accept-legacy-agent --path <dir> 进行迁移\n"
                    + "3) 或执行 ag-kit init --force --path <dir> 覆盖升级"
                );
            }
        } else {
            throw new Error(
                "未检测到已安装的目标。\n"
                + "检测到疑似旧版仅 .agent 安装，但当前为非交互环境或未显式允许迁移。\n"
                + "可选方案:\n"
                + "1) 执行 ag-kit doctor --fix --accept-legacy-agent --path <dir> 进行迁移（会创建 rollback 快照）\n"
                + "2) 或执行 ag-kit update --accept-legacy-agent --path <dir> 进行迁移\n"
                + "3) 或执行 ag-kit init --force --path <dir> 覆盖升级"
            );
        }
    }

    if (targets.length === 0) {
        if (legacyAgentCandidate) {
            throw new Error(
                "未检测到已安装的目标。\n"
                + "检测到疑似旧版仅 .agent 安装，但当前未启用迁移。\n"
                + "可选方案:\n"
                + "1) 执行 ag-kit doctor --fix --accept-legacy-agent --path <dir> 进行迁移（会创建 rollback 快照）\n"
                + "2) 或执行 ag-kit update --accept-legacy-agent --path <dir> 进行迁移\n"
                + "3) 或执行 ag-kit init --force --path <dir> 覆盖升级"
            );
        }
        throw new Error("未检测到已安装的目标。请指定 --target 或先执行 init。");
    }

    log(options, `🩺 开始诊断 (Targets: ${targets.join(", ")})...`);

    let hasIssue = false;
    for (const target of targets) {
        const adapter = createAdapter(target, workspaceRoot, options);
        out(`\n[${target.toUpperCase()}] 检查完整性...`);

        let result = adapter.checkIntegrity();
        if (result.status === "ok") {
            out("  ✅ 状态正常");
            continue;
        }

        let targetHasIssue = true;
        out(`  ❌ 状态: ${result.status}`);
        for (const issue of result.issues || []) {
            out(`     - ${issue}`);
        }

        if (options.fix) {
            if (target === "full" && options.acceptLegacyAgent && legacyAgentCandidate && !isTargetInstalled(workspaceRoot, "full")) {
                try {
                    adapter.update(BUNDLED_AGENT_DIR);
                    out("  🛠️ 已迁移 legacy .agent 并收敛到 v3 (.agents)");
                    result = adapter.checkIntegrity();
                    if (result.status === "ok") {
                        out("  ✅ 修复后状态正常");
                        targetHasIssue = false;
                    } else {
                        out(`  ⚠️ 修复后仍有问题: ${result.status}`);
                        for (const issue of result.issues || []) {
                            out(`     - ${issue}`);
                        }
                        targetHasIssue = true;
                    }
                } catch (err) {
                    out(`  ❌ legacy .agent 迁移失败: ${err.message}`);
                    targetHasIssue = true;
                }
            } else {
                const fixRes = adapter.fixIntegrity();
                if (fixRes && fixRes.fixed) {
                    out(`  🛠️ 已修复: ${fixRes.summary}`);
                    result = adapter.checkIntegrity();
                    if (result.status === "ok") {
                        out("  ✅ 修复后状态正常");
                        targetHasIssue = false;
                    } else {
                        out(`  ⚠️ 修复后仍有问题: ${result.status}`);
                        for (const issue of result.issues || []) {
                            out(`     - ${issue}`);
                        }
                        targetHasIssue = true;
                    }
                } else {
                    out(`  ℹ️ 自动修复未执行: ${fixRes ? fixRes.summary : "无可用修复"}`);
                }
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
    console.log("   默认规则: 自动排除 Ag-Kit 工具包源码目录与系统临时目录（无需手动添加）");

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
    const indexPath = getWorkspaceIndexPath();
    const normalizedTarget = normalizeAbsolutePath(targetPath);
    const targetKey = pathCompareKey(normalizedTarget);
    let existed = false;

    withWorkspaceIndexLock(indexPath, () => {
        const { index } = readWorkspaceIndex();
        existed = index.excludedPaths.some((item) => pathCompareKey(item) === targetKey);
    });

    if (!existed) {
        log(options, `ℹ️ 排除路径不存在: ${normalizedTarget}`);
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
    const legacyAgentCandidate = looksLikeLegacyAgentWorkspace(workspaceRoot);

    if (installedTargets.length === 0) {
        if (!options.quiet) {
            console.log("❌ 未检测到 Antigravity Kit 安装");
            console.log(`   目标目录: ${workspaceRoot}`);
            if (legacyAgentCandidate) {
                console.log("   检测到疑似旧版仅 .agent 安装（未托管）");
                console.log("   可选方案:");
                console.log("   1) 执行 ag-kit update --accept-legacy-agent --path <dir> 进行迁移（会创建 rollback 快照）");
                console.log("   2) 或执行 ag-kit init --force --path <dir> 覆盖升级");
            }
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
    console.log(`   Mode: ${installedTargets.join(", ")}`);
    let migrationStatus = "pending";
    try {
        const { state } = readMigrationState();
        const entry = getMigrationRecord(state, workspaceRoot);
        if (entry && (entry.status === "migrated" || entry.status === "already_v3")) {
            migrationStatus = "done";
        }
    } catch (_err) {
        migrationStatus = "pending";
    }
    console.log(`   Auto-Migration(v3): ${migrationStatus}`);

    const managedDir = path.join(workspaceRoot, ".agents");
    const agentProjectionDir = path.join(workspaceRoot, ".agent");
    const geminiProjectionDir = path.join(workspaceRoot, ".gemini");
    const legacyDir = path.join(workspaceRoot, ".codex");
    const hasManaged = hasManagedCanonicalManifestSignal(workspaceRoot);
    const hasLegacy = fs.existsSync(legacyDir);
    const isManagedLegacy = isManagedLegacyCodexDir(workspaceRoot);

    const skillsCount = countSkillsRecursive(path.join(managedDir, "skills"));
    const agentsCount = countFilesIfExists(path.join(managedDir, "agents"), (name) => name.endsWith(".md"));
    const workflowsCount = countFilesIfExists(path.join(managedDir, "workflows"), (name) => name.endsWith(".md"));
    const hasManifest = fs.existsSync(path.join(managedDir, "manifest.json"));

    console.log("\n[full]");
    console.log(`   Canonical(.agents): ${hasManaged ? "yes" : "no"}`);
    if (hasManaged) {
        console.log(`   Skills: ${skillsCount}`);
        console.log(`   Agents: ${agentsCount}`);
        console.log(`   Workflows: ${workflowsCount}`);
        console.log(`   Manifest: ${hasManifest ? "yes" : "no"}`);
    }

    console.log("\n[projections]");
    console.log(`   .agent: ${fs.existsSync(agentProjectionDir) ? "yes" : "no"}`);
    console.log(`   .gemini: ${fs.existsSync(geminiProjectionDir) ? "yes" : "no"}`);

    if (hasLegacy) {
        console.log("\n[legacy]");
        if (isManagedLegacy) {
            console.log("   .codex: 托管 legacy（建议执行 ag-kit update 迁移清理）");
        } else {
            console.log("   .codex: 非托管目录（已保留，不会自动删除）");
        }
    }
}

async function main() {
    try {
        const { command, options, providedFlags } = parseArgs(process.argv.slice(2));

        if (!command) {
            printUsage();
            return;
        }

        if (command === "--help" || command === "-h") {
            printHelpGeneral({ advanced: options.advanced });
            return;
        }

        if (command === "help") {
            printHelpForCommand(options.subcommand || "", { advanced: options.advanced });
            return;
        }

        if (options.help) {
            printHelpForCommand(command, { advanced: options.advanced });
            return;
        }

        if (command === "--version" || command === "-v") {
            printVersion();
            return;
        }

        let effectiveOptions = options;
        const { configPath, config, error } = loadUserConfig();
        if (error && !options.quiet) {
            console.warn(`⚠️ 用户配置解析失败，已忽略: ${configPath}`);
            console.warn(`   ${error.message}`);
        } else {
            effectiveOptions = applyConfigDefaults(options, providedFlags, config);
        }

        validateOptionScope(command, effectiveOptions, providedFlags);
        maybeWarnUpstreamGlobalConflict(command, effectiveOptions);
        const requiresBundledTemplates = command === "init"
            || command === "update"
            || command === "sync"
            || command === "update-all"
            || (command === "doctor" && effectiveOptions.fix);
        if (requiresBundledTemplates) {
            ensureBundledTemplates();
        }
        await runAutoMigrationOnce(command, effectiveOptions);

        if (command === "init") {
            await commandInit(effectiveOptions);
            return;
        }

        if (command === "update") {
            await commandUpdate(effectiveOptions);
            return;
        }

        if (command === "sync") {
            await commandSync(effectiveOptions);
            return;
        }

        if (command === "update-all") {
            await commandUpdateAll(effectiveOptions);
            return;
        }

        if (command === "verify") {
            commandVerify(effectiveOptions);
            return;
        }

        if (command === "rollback") {
            commandRollback(effectiveOptions);
            return;
        }

        if (command === "doctor") {
            await commandDoctor(effectiveOptions);
            return;
        }

        if (command === "exclude") {
            commandExclude(effectiveOptions);
            return;
        }

        if (command === "status") {
            commandStatus(effectiveOptions);
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
