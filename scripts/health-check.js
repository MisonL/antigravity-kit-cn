#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const CLI_PATH = path.join(ROOT_DIR, "bin", "ag-kit.js");

function logStep(message) {
    console.log(`[health-check] ${message}`);
}

function commandExists(command) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8" });
    return !result.error && result.status === 0;
}

function runCommand(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd || ROOT_DIR,
        env: options.env || process.env,
        encoding: "utf8",
        stdio: options.stdio || "inherit",
    });

    if (result.error) {
        throw new Error(`无法执行命令: ${command}（${result.error.message}）`);
    }
    if (result.status !== 0) {
        throw new Error(`命令执行失败: ${command} ${args.join(" ")}`);
    }
    return result;
}

function runCli(args, env) {
    return runCommand(process.execPath, [CLI_PATH, ...args], {
        cwd: ROOT_DIR,
        env,
    });
}

function runCliCapture(args, env) {
    const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: ROOT_DIR,
        env,
        encoding: "utf8",
    });
    if (result.error) {
        throw new Error(`无法执行 CLI: ${result.error.message}`);
    }
    if (result.status !== 0) {
        const output = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
        throw new Error(output || `CLI 执行失败: ${args.join(" ")}`);
    }
    return (result.stdout || "").trim();
}

function runRepoScript(name, args, options = {}) {
    const hasBun = commandExists("bun");
    if (hasBun) {
        runCommand("bun", ["run", name, ...args], options);
        return;
    }
    if (name === "test") {
        runCommand("npm", ["test", "--silent"], options);
        return;
    }
    runCommand("npm", ["run", name, "--silent", "--", ...args], options);
}

async function main() {
    logStep("检查运行环境");
    if (!fs.existsSync(CLI_PATH)) {
        throw new Error(`缺少 CLI 文件: ${CLI_PATH}`);
    }
    if (!commandExists("npm")) {
        throw new Error("缺少命令: npm");
    }

    logStep("执行测试套件");
    runRepoScript("test", []);

    logStep("验证 CLI 核心链路");
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-health-check-"));
    try {
        const workspaceDir = path.join(tmpRoot, "workspace");
        const indexPath = path.join(tmpRoot, "workspaces.json");
        const migrationStatePath = path.join(tmpRoot, "migration-v3.json");
        const backupRoot = path.join(tmpRoot, "backups");
        fs.mkdirSync(workspaceDir, { recursive: true });

        const env = {
            ...process.env,
            AG_KIT_SKIP_UPSTREAM_CHECK: "1",
            AG_KIT_INDEX_PATH: indexPath,
            AG_KIT_MIGRATION_STATE_PATH: migrationStatePath,
            AG_KIT_BACKUP_ROOT: backupRoot,
        };

        runCli(["init", "--targets", "gemini,codex", "--path", workspaceDir, "--quiet"], env);

        const status = runCliCapture(["status", "--path", workspaceDir, "--quiet"], env);
        if (status !== "installed") {
            throw new Error("status 检查失败");
        }

        runCli(["doctor", "--path", workspaceDir, "--quiet"], env);
        runCli(["update", "--path", workspaceDir, "--quiet"], env);
        runCli(["update-all", "--dry-run", "--quiet"], env);

        runCli(["exclude", "add", "--path", workspaceDir, "--quiet"], env);
        const excluded = runCliCapture(["exclude", "list", "--quiet"], env)
            .split(/\r?\n/)
            .filter(Boolean);
        if (!excluded.includes(workspaceDir)) {
            throw new Error("exclude add 未生效");
        }
        runCli(["exclude", "remove", "--path", workspaceDir, "--quiet"], env);
        const excludedAfterRemove = runCliCapture(["exclude", "list", "--quiet"], env)
            .split(/\r?\n/)
            .filter(Boolean);
        if (excludedAfterRemove.includes(workspaceDir)) {
            throw new Error("exclude remove 未生效");
        }
    } finally {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
    }

    logStep("执行清理预检");
    runRepoScript("clean:dry-run", []);

    console.log("✅ 健康检查通过");
}

main().catch((err) => {
    console.error(`❌ ${err.message}`);
    process.exit(1);
});

