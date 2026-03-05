const fs = require("fs");
const os = require("os");
const path = require("path");
const BaseAdapter = require("./base");
const ManifestManager = require("../utils/manifest");
const AtomicWriter = require("../utils/atomic-writer");
const GitHelper = require("../utils/git-helper");
const { upsertManagedBlock } = require("../utils/managed-block");
const {
    hasManagedCanonicalManifestSignal,
    hasManagedAgentProjectionSignal,
    hasManagedGeminiProjectionSignal,
} = require("../utils/managed-evidence");
const {
    LEGACY_LOCAL_BACKUP_DIR,
    getWorkspaceBackupBucket,
    getLegacyWorkspaceBackupBucket,
} = require("../utils/backup-store");
const { cloneBranchAgentDir } = require("../utils");
const CodexBuilder = require("../core/builder");
const pkg = require("../../package.json");

const MANAGED_DIR_NAME = ".agents";
const LEGACY_DIR_NAME = ".codex";
const AGENT_DIR_NAME = ".agent";
const GEMINI_DIR_NAME = ".gemini";
const PROJECTION_MARKER = ".ag-kit-projection.json";
const ROLLBACK_MANIFEST_NAME = "rollback-manifest.json";
const DEFAULT_AGENT_CONFLICT_POLICY = "backup_replace";
const DEFAULT_GEMINI_AGENTS_POLICY = "append";

class CodexAdapter extends BaseAdapter {
    get targetName() {
        return "full";
    }

    getInstalledVersion() {
        const managedManifest = path.join(this.workspaceRoot, MANAGED_DIR_NAME, "manifest.json");
        const legacyManifest = path.join(this.workspaceRoot, LEGACY_DIR_NAME, "manifest.json");
        const manifestPath = fs.existsSync(managedManifest)
            ? managedManifest
            : (this._isManagedLegacyCodexDir(path.join(this.workspaceRoot, LEGACY_DIR_NAME)) ? legacyManifest : "");

        if (!manifestPath || !fs.existsSync(manifestPath)) {
            return null;
        }

        const manager = new ManifestManager(manifestPath, { target: "full" });
        const manifest = manager.load();
        if (manifest && typeof manifest.kitVersion === "string" && manifest.kitVersion) {
            return manifest.kitVersion;
        }

        return "1.0.0";
    }

    install(sourceDir) {
        this._applyManagedFlow("install", sourceDir);
    }

    update(sourceDir) {
        this._applyManagedFlow("update", sourceDir);
    }

    _applyManagedFlow(mode, sourceDir) {
        const managedDir = path.join(this.workspaceRoot, MANAGED_DIR_NAME);
        const legacyDir = path.join(this.workspaceRoot, LEGACY_DIR_NAME);
        const managedDirExists = fs.existsSync(managedDir);
        const managedCanonicalExists = hasManagedCanonicalManifestSignal(this.workspaceRoot);
        const legacyManaged = this._isManagedLegacyCodexDir(legacyDir);
        const legacyExists = fs.existsSync(legacyDir);
        const legacyUnmanaged = legacyExists && !legacyManaged;
        const canBootstrapFromLegacy = legacyManaged
            || hasManagedAgentProjectionSignal(this.workspaceRoot)
            || hasManagedGeminiProjectionSignal(this.workspaceRoot)
            || (this.options.acceptLegacyAgent && fs.existsSync(path.join(this.workspaceRoot, AGENT_DIR_NAME)));

        if (mode === "install" && managedDirExists && !this.options.force) {
            throw new Error(`${MANAGED_DIR_NAME} 目录已存在。请使用 --force 覆盖。`);
        }
        if (mode === "update" && !managedCanonicalExists && managedDirExists) {
            throw new Error(`${MANAGED_DIR_NAME} 目录存在但未检测到受管 manifest，已停止更新以避免覆盖非托管内容。请先清理后执行 init，或使用 init --force 覆盖安装。`);
        }
        if (mode === "update" && !managedCanonicalExists && !canBootstrapFromLegacy) {
            throw new Error(`${MANAGED_DIR_NAME} 目录不存在，且未检测到可迁移的 legacy 结构，无法更新。请先执行 init。`);
        }

        const { installSource, sourceLabel, cleanup } = this._resolveInstallSource(sourceDir);
        let stagingDir = "";

        try {
            const staging = this._createStaging(installSource, sourceLabel);
            stagingDir = staging.stagingDir;

            if (this.options.dryRun) {
                this.log(`[dry-run] 将原子更新: ${managedDir}`);
                this.log("[dry-run] 覆盖前将创建一键回退快照（rollback-manifest.json + rollback/）");
                this.log(`[dry-run] 回退快照根目录: ${getWorkspaceBackupBucket(this.workspaceRoot)}`);
                if (legacyManaged) {
                    this.log(`[dry-run] 检测到托管 legacy ${LEGACY_DIR_NAME}，将迁移并清理`);
                } else if (legacyUnmanaged) {
                    this.log(`[dry-run] 检测到非托管 ${LEGACY_DIR_NAME}，将保留不删除`);
                }
                this.log(`[dry-run] 将同步投影目录: ${AGENT_DIR_NAME}, ${GEMINI_DIR_NAME}`);
                this.log("[dry-run] 将更新工作区托管文件: AGENTS.md, antigravity.rules");
                this._cleanupGitIgnore();
                return;
            }

            this._migrateLegacyBackupLayout();

            const rollbackSnapshot = this._createRollbackSnapshot(mode);
            if (rollbackSnapshot) {
                this.log(`📦 已创建一键回退快照: ${rollbackSnapshot.backupId}`);
            }

            AtomicWriter.atomicCopyDir(stagingDir, managedDir, { logger: this.log.bind(this) });
            this.log(`⚡️ ${MANAGED_DIR_NAME} 原子更新完成`);

            if (legacyManaged) {
                const legacyBackup = this._backupDirectorySnapshot(legacyDir, "legacy-codex");
                if (legacyBackup) {
                    this.log(`📦 已备份托管 legacy 目录: ${legacyBackup}`);
                }
                fs.rmSync(legacyDir, { recursive: true, force: true });
                this.log(`🧹 已移除托管 legacy ${LEGACY_DIR_NAME} 目录`);
            } else if (legacyUnmanaged) {
                this.log(`ℹ️ 检测到非托管 ${LEGACY_DIR_NAME}，已保留不删除`);
            }

            this._syncWorkspaceManagedFiles(managedDir);
            this._syncProjectionLayouts(managedDir);
            this._cleanupGitIgnore();

            this.log(`✅ [Full] ${mode === "install" ? "安装" : "更新"}完成`);
        } finally {
            if (stagingDir) {
                fs.rmSync(stagingDir, { recursive: true, force: true });
            }
            if (cleanup) {
                cleanup();
            }
        }
    }

    _resolveInstallSource(sourceDir) {
        let installSource = sourceDir;
        let cleanup = null;
        let sourceLabel = this.options.branch ? `branch:${this.options.branch}` : "bundled";

        if (this.options.branch) {
            const remote = cloneBranchAgentDir(this.options.branch, {
                quiet: this.options.quiet,
                logger: this.log.bind(this),
            });
            installSource = remote.agentDir;
            cleanup = remote.cleanup;
        }

        const resolved = this._resolveCanonicalSourceDir(installSource);
        const canonicalSourceDir = resolved.canonicalSourceDir;
        const codexBuildRoot = resolved.codexBuildRoot;

        const mergedTemp = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-full-stage-"));
        this._copyDir(canonicalSourceDir, mergedTemp);

        let codexTemp = "";
        if (codexBuildRoot) {
            codexTemp = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-codex-bridge-"));
            CodexBuilder.build(codexBuildRoot, codexTemp);
            this._copyDir(codexTemp, mergedTemp);
        }

        const previousCleanup = cleanup;
        cleanup = () => {
            if (previousCleanup) {
                previousCleanup();
            }
            if (codexTemp) {
                fs.rmSync(codexTemp, { recursive: true, force: true });
            }
            fs.rmSync(mergedTemp, { recursive: true, force: true });
            if (resolved.mockRoot) {
                fs.rmSync(resolved.mockRoot, { recursive: true, force: true });
            }
        };

        sourceLabel = `${sourceLabel}:full`;
        return { installSource: mergedTemp, sourceLabel, cleanup };
    }

    _resolveCanonicalSourceDir(installSource) {
        const sourceAbs = path.resolve(installSource);

        if (fs.existsSync(path.join(sourceAbs, MANAGED_DIR_NAME))) {
            const mockRoot = this._createMockRoot(path.join(sourceAbs, MANAGED_DIR_NAME));
            return {
                canonicalSourceDir: path.join(sourceAbs, MANAGED_DIR_NAME),
                codexBuildRoot: mockRoot,
                mockRoot,
            };
        }

        if (fs.existsSync(path.join(sourceAbs, AGENT_DIR_NAME))) {
            return {
                canonicalSourceDir: path.join(sourceAbs, AGENT_DIR_NAME),
                codexBuildRoot: sourceAbs,
                mockRoot: "",
            };
        }

        if (fs.existsSync(path.join(sourceAbs, "skills"))) {
            const mockRoot = this._createMockRoot(sourceAbs);
            return {
                canonicalSourceDir: sourceAbs,
                codexBuildRoot: mockRoot,
                mockRoot,
            };
        }

        if (fs.existsSync(sourceAbs) && fs.statSync(sourceAbs).isDirectory()) {
            return {
                canonicalSourceDir: sourceAbs,
                codexBuildRoot: "",
                mockRoot: "",
            };
        }

        throw new Error(`未找到可安装模板目录: ${installSource}（需要 ${MANAGED_DIR_NAME} 或 ${AGENT_DIR_NAME}/skills）`);
    }

    _createMockRoot(sourceAgentLikeDir) {
        const mockRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-build-root-"));
        const mockAgentDir = path.join(mockRoot, AGENT_DIR_NAME);
        this._copyDir(sourceAgentLikeDir, mockAgentDir);
        return mockRoot;
    }

    _createStaging(installSource, sourceLabel) {
        const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-codex-stage-"));
        this._copyDir(installSource, stagingDir);
        const existingManifest = path.join(stagingDir, "manifest.json");
        if (fs.existsSync(existingManifest)) {
            fs.rmSync(existingManifest, { force: true });
        }

        const manifestPath = path.join(stagingDir, "manifest.json");
        const manager = new ManifestManager(manifestPath, {
            target: "full",
            kitVersion: pkg.version,
        });

        manager.manifest.version = 3;
        manager.manifest.target = "full";
        manager.manifest.kitVersion = pkg.version;
        manager.manifest.files = ManifestManager.generateFileEntriesFromDir(stagingDir, {
            baseDir: stagingDir,
            sourcePrefix: sourceLabel,
        });
        manager.save();

        return {
            stagingDir,
            incomingFiles: manager.manifest.files,
        };
    }

    _isManagedLegacyCodexDir(legacyDir) {
        if (!fs.existsSync(legacyDir)) {
            return false;
        }

        const manifestPath = path.join(legacyDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            return false;
        }

        try {
            const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
            if (!parsed || typeof parsed !== "object") {
                return false;
            }
            const target = typeof parsed.target === "string" ? parsed.target.toLowerCase() : "";
            const files = parsed.files;
            return (target === "codex" || target === "full") && files && typeof files === "object";
        } catch (_err) {
            return false;
        }
    }

    _backupDirectorySnapshot(sourceDir, label) {
        if (!fs.existsSync(sourceDir)) {
            return "";
        }

        const backupRoot = this._createBackupRoot();
        const snapshotDir = path.join(backupRoot, label || "snapshot");
        this._copyDir(sourceDir, snapshotDir);
        return snapshotDir;
    }

    _createBackupRoot() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const bucketRoot = getWorkspaceBackupBucket(this.workspaceRoot);
        fs.mkdirSync(bucketRoot, { recursive: true });
        let backupRoot = path.join(bucketRoot, timestamp);
        let suffix = 1;
        while (fs.existsSync(backupRoot)) {
            backupRoot = path.join(bucketRoot, `${timestamp}-${suffix}`);
            suffix += 1;
        }
        fs.mkdirSync(backupRoot, { recursive: true });
        return backupRoot;
    }

    _syncWorkspaceManagedFiles(managedDir) {
        const managedAgentsPath = path.join(managedDir, "AGENTS.md");
        const managedRulesPath = path.join(managedDir, "antigravity.rules");

        if (fs.existsSync(managedAgentsPath)) {
            const body = fs.readFileSync(managedAgentsPath, "utf8");
            const outputPath = path.join(this.workspaceRoot, "AGENTS.md");
            const result = upsertManagedBlock(outputPath, "codex-core-rules", body, {
                dryRun: this.options.dryRun,
            });
            this.log(`🧩 AGENTS.md 托管区块同步: ${result.action}`);
        }

        if (fs.existsSync(managedRulesPath)) {
            const body = fs.readFileSync(managedRulesPath, "utf8");
            const outputPath = path.join(this.workspaceRoot, "antigravity.rules");
            const result = upsertManagedBlock(outputPath, "codex-risk-controls", body, {
                dryRun: this.options.dryRun,
            });
            this.log(`🧩 antigravity.rules 托管区块同步: ${result.action}`);
        }
    }

    _syncProjectionLayouts(managedDir) {
        this._syncAgentProjection(managedDir);
        this._syncGeminiProjection(managedDir);
    }

    _syncAgentProjection(managedDir) {
        const projectionDir = path.join(this.workspaceRoot, AGENT_DIR_NAME);
        const exists = fs.existsSync(projectionDir);
        const policy = this.options.agentConflictPolicy || DEFAULT_AGENT_CONFLICT_POLICY;

        if (policy === "disable") {
            if (!exists) {
                this.log(`ℹ️ 按策略停用 ${AGENT_DIR_NAME} 投影`);
                return;
            }

            if (this._isManagedProjection(projectionDir, "agent")) {
                fs.rmSync(projectionDir, { recursive: true, force: true });
                this.log(`🧹 已停用并移除托管 ${AGENT_DIR_NAME} 投影`);
                return;
            }

            const suffix = new Date().toISOString().replace(/[:.]/g, "-");
            const renamed = path.join(this.workspaceRoot, `.agent.user.${suffix}`);
            fs.renameSync(projectionDir, renamed);
            this.log(`📦 已保留用户 ${AGENT_DIR_NAME} 并停用投影: ${path.basename(renamed)}`);
            return;
        }

        if (exists && !this._isManagedProjection(projectionDir, "agent")) {
            if (policy === "keep") {
                this.log(`ℹ️ 按策略保留已有 ${AGENT_DIR_NAME}，跳过投影同步`);
                return;
            }

            if (policy === "rename_disable") {
                const suffix = new Date().toISOString().replace(/[:.]/g, "-");
                const renamed = path.join(this.workspaceRoot, `.agent.user.${suffix}`);
                fs.renameSync(projectionDir, renamed);
                this.log(`📦 已将旧 ${AGENT_DIR_NAME} 重命名为 ${path.basename(renamed)}`);
            } else if (policy === "replace") {
                fs.rmSync(projectionDir, { recursive: true, force: true });
                this.log(`🧹 已删除冲突 ${AGENT_DIR_NAME}（未备份）`);
            } else {
                const backup = this._backupDirectorySnapshot(projectionDir, "agent-conflict");
                this.log(`📦 已备份冲突 ${AGENT_DIR_NAME}: ${backup}`);
                fs.rmSync(projectionDir, { recursive: true, force: true });
            }
        } else if (exists) {
            fs.rmSync(projectionDir, { recursive: true, force: true });
        }

        this._copyDir(managedDir, projectionDir);
        this._writeProjectionMarker(projectionDir, "agent");
    }

    _syncGeminiProjection(managedDir) {
        const geminiRoot = path.join(this.workspaceRoot, GEMINI_DIR_NAME);
        fs.mkdirSync(geminiRoot, { recursive: true });

        this._mergeGeminiSettings(managedDir, geminiRoot);
        this._syncGeminiAgents(managedDir, geminiRoot);
        this._writeProjectionMarker(geminiRoot, "gemini");
    }

    _mergeGeminiSettings(managedDir, geminiRoot) {
        const settingsPath = path.join(geminiRoot, "settings.json");
        const mcpPath = path.join(managedDir, "mcp_config.json");
        const servers = this._loadContext7Servers(mcpPath);

        if (Object.keys(servers).length === 0) {
            return;
        }

        let settings = {};
        if (fs.existsSync(settingsPath)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
            } catch (_err) {
                const backup = this._backupFile(settingsPath, "gemini-settings-invalid.json");
                this.log(`📦 已备份无效 ${GEMINI_DIR_NAME}/settings.json: ${backup}`);
                settings = {};
            }
        }

        const mcpServers = (settings.mcpServers && typeof settings.mcpServers === "object")
            ? { ...settings.mcpServers }
            : {};

        for (const [name, config] of Object.entries(servers)) {
            mcpServers[name] = config;
        }

        settings.mcpServers = mcpServers;
        fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
    }

    _loadContext7Servers(mcpPath) {
        if (!fs.existsSync(mcpPath)) {
            return {};
        }

        try {
            const parsed = JSON.parse(fs.readFileSync(mcpPath, "utf8"));
            const mcpServers = parsed && parsed.mcpServers && typeof parsed.mcpServers === "object"
                ? parsed.mcpServers
                : {};

            const selected = {};
            if (mcpServers.context7) {
                selected.context7 = mcpServers.context7;
            }
            if (mcpServers.context7_backup) {
                selected.context7_backup = mcpServers.context7_backup;
            }
            return selected;
        } catch (_err) {
            return {};
        }
    }

    _syncGeminiAgents(managedDir, geminiRoot) {
        const sourceAgentsDir = path.join(managedDir, "agents");
        if (!fs.existsSync(sourceAgentsDir)) {
            return;
        }

        const targetAgentsDir = path.join(geminiRoot, "agents");
        const policy = this.options.geminiAgentsPolicy || DEFAULT_GEMINI_AGENTS_POLICY;

        if (policy === "skip") {
            this.log(`ℹ️ 按策略跳过 ${GEMINI_DIR_NAME}/agents 写入`);
            return;
        }

        if (policy === "backup_replace" && fs.existsSync(targetAgentsDir)) {
            const backup = this._backupDirectorySnapshot(targetAgentsDir, "gemini-agents-conflict");
            this.log(`📦 已备份冲突 ${GEMINI_DIR_NAME}/agents: ${backup}`);
            fs.rmSync(targetAgentsDir, { recursive: true, force: true });
        }

        fs.mkdirSync(targetAgentsDir, { recursive: true });

        const entries = fs.readdirSync(sourceAgentsDir, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith(".md")) {
                continue;
            }
            const src = path.join(sourceAgentsDir, entry.name);
            const dest = path.join(targetAgentsDir, `ag-kit-${entry.name}`);
            fs.copyFileSync(src, dest);
        }
    }

    _isManagedProjection(dirPath, type) {
        const markerPath = path.join(dirPath, PROJECTION_MARKER);
        if (!fs.existsSync(markerPath)) {
            return false;
        }

        try {
            const parsed = JSON.parse(fs.readFileSync(markerPath, "utf8"));
            return parsed && parsed.type === type && parsed.managedBy === "ag-kit-cn";
        } catch (_err) {
            return false;
        }
    }

    _writeProjectionMarker(dirPath, type) {
        const markerPath = path.join(dirPath, PROJECTION_MARKER);
        const payload = {
            managedBy: "ag-kit-cn",
            type,
            version: pkg.version,
            generatedAt: new Date().toISOString(),
        };
        fs.writeFileSync(markerPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    }

    _backupFile(filePath, backupName) {
        const backupRoot = this._createBackupRoot();
        const target = path.join(backupRoot, backupName || path.basename(filePath));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(filePath, target);
        return target;
    }

    _createRollbackSnapshot(mode) {
        const backupRoot = this._createBackupRoot();
        const backupId = path.basename(backupRoot);
        const rollbackRoot = path.join(backupRoot, "rollback");
        fs.mkdirSync(rollbackRoot, { recursive: true });

        const targets = [
            { path: ".agents", type: "dir" },
            { path: ".agent", type: "dir" },
            { path: ".gemini", type: "dir" },
            { path: ".codex", type: "dir" },
            { path: "AGENTS.md", type: "file" },
            { path: "antigravity.rules", type: "file" },
            { path: ".gitignore", type: "file" },
        ];

        const manifestTargets = [];

        for (const target of targets) {
            const absPath = path.join(this.workspaceRoot, target.path);
            const existed = fs.existsSync(absPath);
            const entry = {
                path: target.path,
                type: target.type,
                existed,
            };
            manifestTargets.push(entry);

            if (!existed) {
                continue;
            }

            const snapshotPath = path.join(rollbackRoot, target.path);
            if (target.type === "file") {
                fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
                fs.copyFileSync(absPath, snapshotPath);
            } else {
                this._copyDir(absPath, snapshotPath);
            }
        }

        const manifestPath = path.join(backupRoot, ROLLBACK_MANIFEST_NAME);
        const manifest = {
            version: 1,
            type: "ag-kit-rollback",
            createdAt: new Date().toISOString(),
            mode,
            workspaceRoot: this.workspaceRoot,
            managedBy: "ag-kit-cn",
            targets: manifestTargets,
        };
        fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

        return {
            backupRoot,
            backupId,
            manifestPath,
        };
    }

    _migrateLegacyBackupLayout() {
        const legacyRoot = getLegacyWorkspaceBackupBucket(this.workspaceRoot);
        if (!fs.existsSync(legacyRoot)) {
            return;
        }

        let entries;
        try {
            entries = fs.readdirSync(legacyRoot, { withFileTypes: true });
        } catch (_err) {
            return;
        }

        if (!Array.isArray(entries) || entries.length === 0) {
            fs.rmSync(legacyRoot, { recursive: true, force: true });
            return;
        }

        const bucketRoot = getWorkspaceBackupBucket(this.workspaceRoot);
        fs.mkdirSync(bucketRoot, { recursive: true });

        let movedCount = 0;
        for (const entry of entries) {
            const srcPath = path.join(legacyRoot, entry.name);
            const preferredName = entry.name.startsWith("legacy-")
                ? entry.name
                : `legacy-${entry.name}`;
            const destPath = this._resolveAvailableBackupPath(path.join(bucketRoot, preferredName));
            try {
                this._movePathSafely(srcPath, destPath);
                movedCount += 1;
            } catch (err) {
                this.log(`⚠️ 迁移历史备份失败（已跳过）: ${srcPath} -> ${destPath}`);
                this.log(`   ${err.message}`);
            }
        }

        if (movedCount > 0) {
            this.log(`🧹 已迁移历史 ${LEGACY_LOCAL_BACKUP_DIR} 到全局备份目录: ${bucketRoot} (${movedCount} 项)`);
        }
        const remaining = fs.readdirSync(legacyRoot, { withFileTypes: true });
        if (remaining.length === 0) {
            fs.rmSync(legacyRoot, { recursive: true, force: true });
        }
    }

    _resolveAvailableBackupPath(basePath) {
        let candidate = basePath;
        let index = 1;
        while (fs.existsSync(candidate)) {
            candidate = `${basePath}-${index}`;
            index += 1;
        }
        return candidate;
    }

    _movePathSafely(srcPath, destPath) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        try {
            fs.renameSync(srcPath, destPath);
            return;
        } catch (err) {
            if (!err || err.code !== "EXDEV") {
                throw err;
            }
        }

        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            this._copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        fs.rmSync(srcPath, { recursive: true, force: true });
    }

    _cleanupGitIgnore() {
        const cleanupResult = GitHelper.removeIgnoreRules(
            this.workspaceRoot,
            [MANAGED_DIR_NAME, LEGACY_DIR_NAME, AGENT_DIR_NAME, GEMINI_DIR_NAME],
            this.options,
        );
        if (cleanupResult.removedCount > 0) {
            this.log(`🧹 已从 .gitignore 移除 ${cleanupResult.removedCount} 条规则`);
        }
    }

    _copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                this._copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    checkIntegrity() {
        const managedDir = path.join(this.workspaceRoot, MANAGED_DIR_NAME);
        const legacyDir = path.join(this.workspaceRoot, LEGACY_DIR_NAME);
        const result = { status: "ok", issues: [] };

        if (!fs.existsSync(managedDir)) {
            if (this._isManagedLegacyCodexDir(legacyDir)) {
                return {
                    status: "broken",
                    issues: [`Legacy: 检测到托管 ${LEGACY_DIR_NAME}，请执行 update 迁移到 ${MANAGED_DIR_NAME}`],
                };
            }
            return {
                status: "missing",
                issues: [`Critical: ${MANAGED_DIR_NAME} 目录缺失`],
            };
        }

        const manifestPath = path.join(managedDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            return {
                status: "broken",
                issues: ["Critical: manifest.json missing"],
            };
        }

        const manager = new ManifestManager(manifestPath, { target: "full" });
        manager.load();
        if (manager.lastLoadError) {
            return {
                status: "broken",
                issues: ["Critical: manifest.json invalid JSON"],
            };
        }

        const drift = manager.checkDrift(managedDir);
        if (drift.missing.length > 0) {
            result.status = "broken";
            for (const relPath of drift.missing) {
                result.issues.push(`Missing managed file: ${relPath}`);
            }
        }

        if (drift.modified.length > 0) {
            if (result.status === "ok") {
                result.status = "drift";
            }
            for (const relPath of drift.modified) {
                result.issues.push(`File modified (Drift): ${relPath}`);
            }
        }

        if (this._isManagedLegacyCodexDir(legacyDir)) {
            result.status = "broken";
            result.issues.push(`Legacy: 托管 ${LEGACY_DIR_NAME} 目录仍存在，需清理`);
        } else if (fs.existsSync(legacyDir)) {
            result.issues.push(`Notice: 非托管 ${LEGACY_DIR_NAME} 目录已保留`);
        }

        return result;
    }

    fixIntegrity() {
        const managedDir = path.join(this.workspaceRoot, MANAGED_DIR_NAME);
        const legacyDir = path.join(this.workspaceRoot, LEGACY_DIR_NAME);
        const fixes = [];

        if (!fs.existsSync(managedDir)) {
            if (this._isManagedLegacyCodexDir(legacyDir)) {
                const legacyBackup = this._backupDirectorySnapshot(legacyDir, "legacy-codex");
                AtomicWriter.atomicCopyDir(legacyDir, managedDir, { logger: this.log.bind(this) });
                fs.rmSync(legacyDir, { recursive: true, force: true });
                fixes.push(`migrated ${LEGACY_DIR_NAME} to ${MANAGED_DIR_NAME} (backup: ${legacyBackup})`);
            } else {
                return {
                    fixed: false,
                    summary: `缺少 ${MANAGED_DIR_NAME}，且无可迁移托管 legacy。请执行 ag-kit init 或 ag-kit update。`,
                };
            }
        }

        if (this._isManagedLegacyCodexDir(legacyDir)) {
            const legacyBackup = this._backupDirectorySnapshot(legacyDir, "legacy-codex");
            fs.rmSync(legacyDir, { recursive: true, force: true });
            fixes.push(`removed managed ${LEGACY_DIR_NAME} (backup: ${legacyBackup})`);
        }

        const manifestPath = path.join(managedDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            const manager = new ManifestManager(manifestPath, {
                target: "full",
                kitVersion: pkg.version,
            });
            manager.manifest.version = 3;
            manager.manifest.files = ManifestManager.generateFileEntriesFromDir(managedDir, {
                baseDir: managedDir,
                sourcePrefix: "recovered",
            });
            manager.save();
            fixes.push("regenerated manifest.json");
        }

        this._syncWorkspaceManagedFiles(managedDir);
        this._syncProjectionLayouts(managedDir);
        this._cleanupGitIgnore();

        return {
            fixed: fixes.length > 0,
            summary: fixes.length > 0 ? `Fixed: ${fixes.join(", ")}` : "No automatic fixes available.",
        };
    }
}

module.exports = CodexAdapter;
