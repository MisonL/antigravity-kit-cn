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

class CodexAdapter extends BaseAdapter {
    get targetName() {
        return "codex";
    }

    getInstalledVersion() {
        const manifestPath = path.join(this.workspaceRoot, ".codex", "manifest.json");
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
        const codexDir = path.join(this.workspaceRoot, ".codex");
        const agentsMirrorDir = path.join(this.workspaceRoot, ".agents");
        const codexExists = fs.existsSync(codexDir);

        if (mode === "install" && codexExists && !this.options.force) {
            throw new Error(".codex 目录已存在。请使用 --force 覆盖。");
        }
        if (mode === "update" && !codexExists) {
            throw new Error(".codex 目录不存在，无法更新。请先执行 init --target codex。");
        }

        const { installSource, sourceLabel, cleanup } = this._resolveInstallSource(sourceDir);
        let stagingDir = "";
        let incomingFiles = {};

        try {
            const staging = this._createStaging(installSource, sourceLabel);
            stagingDir = staging.stagingDir;
            incomingFiles = staging.incomingFiles;

            if (this.options.dryRun) {
                this.log(`[dry-run] 将原子更新: ${codexDir}`);
                this.log(`[dry-run] 将同步镜像: ${agentsMirrorDir}`);
                if (codexExists && this.options.force) {
                    const candidates = this._collectBackupCandidates(codexDir, incomingFiles);
                    if (candidates.fullSnapshot) {
                        this.log("[dry-run] 发现旧版或缺失 manifest，覆盖前将备份整目录 .codex");
                    } else if (candidates.files.length > 0) {
                        this.log(`[dry-run] 将备份 ${candidates.files.length} 个用户修改文件到 .codex-backup`);
                    }
                }
                this.log("[dry-run] 将更新工作区托管文件: AGENTS.md, antigravity.rules");
                this._cleanupGitIgnore();
                return;
            }

            if (codexExists && this.options.force) {
                const candidates = this._collectBackupCandidates(codexDir, incomingFiles);
                const backupResult = this._backupCandidates(codexDir, candidates);
                if (backupResult) {
                    this.log(`📦 已备份覆盖前文件: ${backupResult.summary}`);
                }
            }

            AtomicWriter.atomicCopyDir(stagingDir, codexDir, { logger: this.log.bind(this) });
            this.log("⚡️ .codex 原子更新完成");

            AtomicWriter.atomicCopyDir(codexDir, agentsMirrorDir, { logger: this.log.bind(this) });
            this.log("🪞 .agents 镜像同步完成");

            this._syncWorkspaceManagedFiles(codexDir);
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

    _collectBackupCandidates(codexDir, incomingFiles) {
        const manifestPath = path.join(codexDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            return { fullSnapshot: true, files: [] };
        }

        const manager = new ManifestManager(manifestPath, { target: "codex" });
        manager.load();

        return {
            fullSnapshot: false,
            files: manager.collectSmartOverwriteConflicts(codexDir, incomingFiles),
        };
    }

    _backupCandidates(codexDir, candidates) {
        if (!candidates.fullSnapshot && candidates.files.length === 0) {
            return null;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupRoot = path.join(this.workspaceRoot, ".codex-backup", timestamp);
        fs.mkdirSync(backupRoot, { recursive: true });

        if (candidates.fullSnapshot) {
            const snapshotDir = path.join(backupRoot, "codex-full-snapshot");
            this._copyDir(codexDir, snapshotDir);
            return { summary: `${backupRoot} (full snapshot)` };
        }

        for (const relPath of candidates.files) {
            const src = path.join(codexDir, relPath);
            if (!fs.existsSync(src)) {
                continue;
            }
            const dest = path.join(backupRoot, relPath);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(src, dest);
        }

        return { summary: `${backupRoot} (${candidates.files.length} files)` };
    }

    _syncWorkspaceManagedFiles(codexDir) {
        const codexAgentsPath = path.join(codexDir, "AGENTS.md");
        const codexRulesPath = path.join(codexDir, "antigravity.rules");

        if (fs.existsSync(codexAgentsPath)) {
            const body = fs.readFileSync(codexAgentsPath, "utf8");
            const outputPath = path.join(this.workspaceRoot, "AGENTS.md");
            const result = upsertManagedBlock(outputPath, "codex-core-rules", body, {
                dryRun: this.options.dryRun,
            });
            this.log(`🧩 AGENTS.md 托管区块同步: ${result.action}`);
        }

        if (fs.existsSync(codexRulesPath)) {
            const body = fs.readFileSync(codexRulesPath, "utf8");
            const outputPath = path.join(this.workspaceRoot, "antigravity.rules");
            const result = upsertManagedBlock(outputPath, "codex-risk-controls", body, {
                dryRun: this.options.dryRun,
            });
            this.log(`🧩 antigravity.rules 托管区块同步: ${result.action}`);
        }
    }

    _cleanupGitIgnore() {
        const cleanupResult = GitHelper.removeIgnoreRules(this.workspaceRoot, [".codex", ".agents"], this.options);
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
        const codexDir = path.join(this.workspaceRoot, ".codex");
        const result = { status: "ok", issues: [] };

        if (!fs.existsSync(codexDir)) {
            return { status: "missing", issues: ["Critical: .codex directory missing"] };
        }

        const manifestPath = path.join(codexDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            return { status: "broken", issues: ["Critical: manifest.json missing"] };
        }

        const manager = new ManifestManager(manifestPath, { target: "codex" });
        manager.load();
        const drift = manager.checkDrift(codexDir);

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
        const codexDir = path.join(this.workspaceRoot, ".codex");
        const agentsMirrorDir = path.join(this.workspaceRoot, ".agents");
        const fixes = [];

        if (!fs.existsSync(codexDir)) {
            return {
                fixed: false,
                summary: "缺少 .codex，无法自动修复。请执行 ag-kit init --target codex 或 ag-kit update。",
            };
        }

        if (!fs.existsSync(agentsMirrorDir)) {
            AtomicWriter.atomicCopyDir(codexDir, agentsMirrorDir, { logger: this.log.bind(this) });
            fixes.push("restored .agents mirror");
        }

        const manifestPath = path.join(codexDir, "manifest.json");
        if (!fs.existsSync(manifestPath)) {
            const manager = new ManifestManager(manifestPath, {
                target: "codex",
                kitVersion: pkg.version,
            });
            manager.manifest.files = ManifestManager.generateFileEntriesFromDir(codexDir, {
                baseDir: codexDir,
                sourcePrefix: "recovered",
            });
            manager.save();
            fixes.push("regenerated manifest.json");
        }

        this._syncWorkspaceManagedFiles(codexDir);
        this._cleanupGitIgnore();

        return {
            fixed: fixes.length > 0,
            summary: fixes.length > 0 ? `Fixed: ${fixes.join(", ")}` : "No automatic fixes available.",
        };
    }
}

module.exports = CodexAdapter;
