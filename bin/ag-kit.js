#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const pkg = require("../package.json");

const REPO_URL = "https://github.com/vudovn/antigravity-kit.git";
const BUNDLED_AGENT_DIR = path.resolve(__dirname, "../.agent");

function printUsage() {
    console.log("用法:");
    console.log("  ag-kit init [--force] [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
    console.log("  ag-kit update [--path <dir>] [--branch <name>] [--quiet] [--dry-run]");
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
            log(options, "✅ dry-run 完成，未写入任何文件。");
            return;
        }

        fs.mkdirSync(workspaceRoot, { recursive: true });
        copyDir(sourceDir, targetDir);
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
