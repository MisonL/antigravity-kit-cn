const fs = require("fs");
const os = require("os");
const path = require("path");
const BaseAdapter = require("./base");
const { cloneBranchAgentDir } = require("../utils");
const GitHelper = require("../utils/git-helper");

class GeminiAdapter extends BaseAdapter {
    get targetName() {
        return "gemini";
    }

    getInstalledVersion() {
        const agentDir = path.join(this.workspaceRoot, ".agent");
        if (fs.existsSync(agentDir)) {
            return null;
        }
        return null;
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

    // Remove old _removeAgentIgnoreRules implementation
    _removeAgentIgnoreRules() {
        // Deprecated, using GitHelper
        return { fileExists: false, removedCount: 0 };
    }

    _samePath(a, b) {
        const left = path.resolve(a);
        const right = path.resolve(b);
        if (process.platform === "win32") {
            return left.toLowerCase() === right.toLowerCase();
        }
        return left === right;
    }

    install(sourceDir) {
        let installSource = sourceDir;
        let cleanup = null;

        if (this.options.branch) {
             const remote = cloneBranchAgentDir(this.options.branch, { 
                 quiet: this.options.quiet,
                 logger: this.log.bind(this)
             });
             installSource = remote.agentDir;
             cleanup = remote.cleanup;
        }

        try {
            const targetDir = path.join(this.workspaceRoot, ".agent");

            if (!fs.existsSync(installSource)) {
                throw new Error(`未找到模板目录: ${installSource}`);
            }

            if (this._samePath(installSource, targetDir) && !this.options.dryRun) {
                const tempSource = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-gemini-src-"));
                this._copyDir(installSource, tempSource);
                const oldCleanup = cleanup;
                cleanup = () => {
                    if (oldCleanup) oldCleanup();
                    fs.rmSync(tempSource, { recursive: true, force: true });
                };
                installSource = tempSource;
                this.log("[info] 检测到源目录与目标目录相同，已切换为临时副本执行覆盖更新。");
            }
            
            // Log logic handled by caller mostly, but validation here
            if (fs.existsSync(targetDir)) {
                 if (!this.options.force) {
                     throw new Error(".agent 目录已存在。请使用 --force 覆盖。");
                 }
                 if (this.options.dryRun) {
                     this.log(`[dry-run] 将删除: ${targetDir}`);
                 } else {
                     fs.rmSync(targetDir, { recursive: true, force: true });
                     this.log(`[clean] 已删除旧目录: ${targetDir}`);
                 }
            }
    
            if (this.options.dryRun) {
                this.log(`[dry-run] 将复制: ${installSource} -> ${targetDir}`);
                const cleanupGit = GitHelper.removeIgnoreRules(this.workspaceRoot, [".agent"], this.options);
                if(cleanupGit.removedCount > 0) this.log(`[dry-run] 将移除 .gitignore 规则`);
                return;
            }
    
            fs.mkdirSync(this.workspaceRoot, { recursive: true });
            this._copyDir(installSource, targetDir);
            const cleanupResult = GitHelper.removeIgnoreRules(this.workspaceRoot, [".agent"], this.options);
            if(cleanupResult.removedCount > 0) {
                 this.log(`[clean] 已从 .gitignore 移除 ${cleanupResult.removedCount} 条规则`);
            }
            
            this.log("[ok] [Gemini] 安装完成 (.agent)");
        } finally {
            if (cleanup) cleanup();
        }
    }

    update(sourceDir) {
        this.options.force = true; // Updates are forced installs
        this.install(sourceDir);
    }
    
    checkIntegrity() {
        const agentDir = path.join(this.workspaceRoot, ".agent");
        if (!fs.existsSync(agentDir)) {
             return { status: "missing", issues: [".agent directory missing"] };
        }

        const issues = [];
        const requiredDirs = ["agents", "skills", "rules", "workflows"];
        for (const relPath of requiredDirs) {
            const absPath = path.join(agentDir, relPath);
            if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
                issues.push(`Missing required directory: .agent/${relPath}`);
            }
        }

        const requiredFiles = ["rules/GEMINI.md", "agents/orchestrator.md"];
        for (const relPath of requiredFiles) {
            const absPath = path.join(agentDir, relPath);
            if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
                issues.push(`Missing required file: .agent/${relPath}`);
            }
        }

        if (issues.length > 0) {
            return { status: "broken", issues };
        }

        return { status: "ok", issues: [] };
    }

    fixIntegrity() {
         return { fixed: false, summary: "Gemini Adapter does not support self-healing yet. Please run update." };
    }
}

module.exports = GeminiAdapter;
