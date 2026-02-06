const fs = require("fs");
const os = require("os");
const path = require("path");
const BaseAdapter = require("./base");
const ManifestManager = require("../utils/manifest");
const AtomicWriter = require("../utils/atomic-writer");
const GitHelper = require("../utils/git-helper");
const { upsertManagedBlock } = require("../utils/managed-block");
const { cloneBranchAgentDir } = require("../utils");
const pkg = require("../../package.json");

const MANAGED_DIR_NAME = ".agents";
const LEGACY_DIR_NAME = ".codex";

class CodexAdapter extends BaseAdapter {
    get targetName() {
        return "codex";
    }

    getInstalledVersion() {
        const managedManifest = path.join(this.workspaceRoot, MANAGED_DIR_NAME, "manifest.json");
        const legacyManifest = path.join(this.workspaceRoot, LEGACY_DIR_NAME, "manifest.json");
        const manifestPath = fs.existsSync(managedManifest) ? managedManifest : legacyManifest;

        if (!fs.existsSync(manifestPath)) {
            return null;
        }

        const manager = new ManifestManager(manifestPath, { target: "codex" });
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
        const managedExists = fs.existsSync(managedDir);
        const legacyExists = fs.existsSync(legacyDir);
        const hasExistingInstall = managedExists || legacyExists;
        const currentDataDir = managedExists ? managedDir : legacyDir;

        if (mode === "install" && hasExistingInstall && !this.options.force) {
            throw new Error(`${MANAGED_DIR_NAME} 或 ${LEGACY_DIR_NAME} 目录已存在。请使用 --force 覆盖。`);
        }
        if (mode === "update" && !hasExistingInstall) {
            throw new Error(`${MANAGED_DIR_NAME} 目录不存在，无法更新。请先执行 init --target codex。`);
        }

        const { installSource, sourceLabel, cleanup } = this._resolveInstallSource(sourceDir);
        let stagingDir = "";
        let incomingFiles = {};

        try {
            const staging = this._createStaging(installSource, sourceLabel);
            stagingDir = staging.stagingDir;
            incomingFiles = staging.incomingFiles;

            if (this.options.dryRun) {
                this.log(`[dry-run] 将原子更新: ${managedDir}`);
                if (legacyExists) {
                    this.log(`[dry-run] 将删除遗留目录: ${legacyDir}`);
                }
                if (hasExistingInstall && this.options.force) {
                    const candidates = this._collectBackupCandidates(currentDataDir, incomingFiles);
                    if (candidates.fullSnapshot) {
                        this.log(`[dry-run] 发现旧版或缺失 manifest，覆盖前将备份整目录 ${path.basename(currentDataDir)}`);
                    } else if (candidates.files.length > 0) {
                        this.log(`[dry-run] 将备份 ${candidates.files.length} 个用户修改文件到 .agents-backup`);
                    }
                }
                this.log("[dry-run] 将更新工作区托管文件: AGENTS.md, antigravity.rules");
                this._cleanupGitIgnore();
                return;
            }

            if (hasExistingInstall && this.options.force) {
                const candidates = this._collectBackupCandidates(currentDataDir, incomingFiles);
                const backupResult = this._backupCandidates(currentDataDir, candidates);
                if (backupResult) {
                    this.log(`📦 已备份覆盖前文件: ${backupResult.summary}`);
                }
            }

            AtomicWriter.atomicCopyDir(stagingDir, managedDir, { logger: this.log.bind(this) });
            this.log(`⚡️ ${MANAGED_DIR_NAME} 原子更新完成`);

            if (legacyExists) {
                fs.rmSync(legacyDir, { recursive: true, force: true });
                this.log(`🧹 已移除遗留 ${LEGACY_DIR_NAME} 目录`);
            }

            this._syncWorkspaceManagedFiles(managedDir);
            this._cleanupGitIgnore();

            this.log(`✅ [Codex] ${mode === "install" ? "安装" : "更新"}完成`);
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

        const CodexBuilder = require("../core/builder");
        let buildTemp = "";

        const hasAgentDir = fs.existsSync(path.join(installSource, ".agent"));
        const hasSkillsDir = fs.existsSync(path.join(installSource, "skills"));
        const isCodexPrebuilt = fs.existsSync(path.join(installSource, "manifest.json"));

        if (!isCodexPrebuilt) {
            if (hasSkillsDir) {
                this.log("🛠️ 检测到 .agent 内容格式，正在构建 Codex 结构...");
                const mockRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-build-root-"));
                const mockAgent = path.join(mockRoot, ".agent");
                this._copyDir(installSource, mockAgent);

                buildTemp = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-build-out-"));
                CodexBuilder.build(mockRoot, buildTemp);
                installSource = buildTemp;
                sourceLabel = `${sourceLabel}:compiled`;

                const previousCleanup = cleanup;
                cleanup = () => {
                    if (previousCleanup) previousCleanup();
                    fs.rmSync(mockRoot, { recursive: true, force: true });
                    fs.rmSync(buildTemp, { recursive: true, force: true });
                };
            } else if (hasAgentDir) {
                this.log("🛠️ 检测到仓库根目录格式，正在构建 Codex 结构...");
                buildTemp = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-build-out-"));
                CodexBuilder.build(installSource, buildTemp);
                installSource = buildTemp;
                sourceLabel = `${sourceLabel}:compiled`;

                const previousCleanup = cleanup;
                cleanup = () => {
                    if (previousCleanup) previousCleanup();
                    fs.rmSync(buildTemp, { recursive: true, force: true });
                };
            }
        }

        return { installSource, sourceLabel, cleanup };
    }

    _createStaging(installSource, sourceLabel) {
        const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-codex-stage-"));
        this._copyDir(installSource, stagingDir);

        const manifestPath = path.join(stagingDir, "manifest.json");
        const manager = new ManifestManager(manifestPath, {
            target: "codex",
            kitVersion: pkg.version,
        });
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

    _collectBackupCandidates(targetDir, incomingFiles) {
        const manifestPath = path.join(targetDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            return { fullSnapshot: true, files: [] };
        }

        try {
            const raw = fs.readFileSync(manifestPath, "utf8");
            const parsed = JSON.parse(raw);
            const files = parsed && typeof parsed.files === "object" ? parsed.files : null;
            if (!files || Object.keys(files).length === 0) {
                return { fullSnapshot: true, files: [] };
            }
        } catch (err) {
            return { fullSnapshot: true, files: [] };
        }

        const manager = new ManifestManager(manifestPath, { target: "codex" });
        manager.load();

        return {
            fullSnapshot: false,
            files: manager.collectSmartOverwriteConflicts(targetDir, incomingFiles),
        };
    }

    _backupCandidates(targetDir, candidates) {
        if (!candidates.fullSnapshot && candidates.files.length === 0) {
            return null;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupRoot = path.join(this.workspaceRoot, ".agents-backup", timestamp);
        fs.mkdirSync(backupRoot, { recursive: true });

        if (candidates.fullSnapshot) {
            const snapshotDir = path.join(backupRoot, "full-snapshot");
            this._copyDir(targetDir, snapshotDir);
            return { summary: `${backupRoot} (full snapshot)` };
        }

        for (const relPath of candidates.files) {
            const src = path.join(targetDir, relPath);
            if (!fs.existsSync(src)) {
                continue;
            }
            const dest = path.join(backupRoot, relPath);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(src, dest);
        }

        return { summary: `${backupRoot} (${candidates.files.length} files)` };
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

    _cleanupGitIgnore() {
        const cleanupResult = GitHelper.removeIgnoreRules(this.workspaceRoot, [MANAGED_DIR_NAME, LEGACY_DIR_NAME], this.options);
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
            if (fs.existsSync(legacyDir)) {
                return {
                    status: "broken",
                    issues: [`Legacy: ${LEGACY_DIR_NAME} directory detected; run update to migrate to ${MANAGED_DIR_NAME}`],
                };
            }
            return { status: "missing", issues: [`Critical: ${MANAGED_DIR_NAME} directory missing`] };
        }

        const manifestPath = path.join(managedDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            result.status = "broken";
            result.issues.push("Critical: manifest.json missing");
            return result;
        }

        if (fs.existsSync(legacyDir)) {
            result.status = "broken";
            result.issues.push(`Legacy: ${LEGACY_DIR_NAME} directory should be removed`);
        }

        const manager = new ManifestManager(manifestPath, { target: "codex" });
        manager.load();
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

        return result;
    }

    fixIntegrity() {
        const managedDir = path.join(this.workspaceRoot, MANAGED_DIR_NAME);
        const legacyDir = path.join(this.workspaceRoot, LEGACY_DIR_NAME);
        const fixes = [];

        if (!fs.existsSync(managedDir)) {
            if (fs.existsSync(legacyDir)) {
                AtomicWriter.atomicCopyDir(legacyDir, managedDir, { logger: this.log.bind(this) });
                fs.rmSync(legacyDir, { recursive: true, force: true });
                fixes.push(`migrated ${LEGACY_DIR_NAME} to ${MANAGED_DIR_NAME}`);
            } else {
                return {
                    fixed: false,
                    summary: `缺少 ${MANAGED_DIR_NAME}，无法自动修复。请执行 ag-kit init --target codex 或 ag-kit update。`,
                };
            }
        }

        if (fs.existsSync(legacyDir)) {
            fs.rmSync(legacyDir, { recursive: true, force: true });
            fixes.push(`removed stale ${LEGACY_DIR_NAME} directory`);
        }

        const manifestPath = path.join(managedDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            const manager = new ManifestManager(manifestPath, {
                target: "codex",
                kitVersion: pkg.version,
            });
            manager.manifest.files = ManifestManager.generateFileEntriesFromDir(managedDir, {
                baseDir: managedDir,
                sourcePrefix: "recovered",
            });
            manager.save();
            fixes.push("regenerated manifest.json");
        }

        this._syncWorkspaceManagedFiles(managedDir);
        this._cleanupGitIgnore();

        return {
            fixed: fixes.length > 0,
            summary: fixes.length > 0 ? `Fixed: ${fixes.join(", ")}` : "No automatic fixes available.",
        };
    }
}

module.exports = CodexAdapter;
