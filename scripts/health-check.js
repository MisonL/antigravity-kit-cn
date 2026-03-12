#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname, "..");

function logStep(message) {
    console.log(`[health-check] ${message}`);
}

function runCommand(command, options = {}) {
    const result = spawnSync(command, {
        cwd: options.cwd || ROOT_DIR,
        env: {
            ...process.env,
            ...options.env,
        },
        encoding: "utf8",
        shell: true,
    });

    if (result.status !== 0) {
        const detail = result.stderr || result.stdout || "";
        throw new Error(`${command}\n${detail}`.trim());
    }

    return result.stdout || "";
}

function commandExists(command) {
    const probe = spawnSync(command, {
        encoding: "utf8",
        shell: true,
        stdio: "ignore",
    });
    return probe.status === 0;
}

function main() {
    logStep("检查运行环境");
    if (!commandExists("node --version")) {
        throw new Error("缺少命令: node");
    }

    const packageRunner = commandExists("bun --version") ? "bun" : "npm";
    if (!commandExists(`${packageRunner} --version`)) {
        throw new Error(`缺少命令: ${packageRunner}`);
    }

    logStep("执行测试套件");
    if (packageRunner === "bun") {
        runCommand("bun run test");
    } else {
        runCommand("npm test --silent");
    }

    logStep("验证 CLI 核心链路");
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-health-check-"));
    try {
        const workspaceDir = path.join(tempRoot, "workspace");
        const indexPath = path.join(tempRoot, "workspaces.json");
        const globalRoot = path.join(tempRoot, "global-root");
        fs.mkdirSync(workspaceDir, { recursive: true });

        const env = {
            AG_KIT_INDEX_PATH: indexPath,
            AG_KIT_GLOBAL_ROOT: globalRoot,
            AG_KIT_SKIP_UPSTREAM_CHECK: "1",
        };

        runCommand(`node bin/ag-kit.js init --targets gemini,codex --path "${workspaceDir}" --quiet`, { env });

        const status = runCommand(`node bin/ag-kit.js status --path "${workspaceDir}" --quiet`, { env }).trim();
        if (status !== "installed") {
            throw new Error(`status 结果异常: ${status}`);
        }

        runCommand(`node bin/ag-kit.js doctor --path "${workspaceDir}" --quiet`, { env });
        runCommand(`node bin/ag-kit.js update --path "${workspaceDir}" --quiet`, { env });
        runCommand("node bin/ag-kit.js update-all --dry-run --quiet", { env });
        runCommand(`node bin/ag-kit.js exclude add --path "${workspaceDir}" --quiet`, { env });

        const excluded = runCommand("node bin/ag-kit.js exclude list --quiet", { env });
        if (!excluded.split(/\r?\n/).includes(workspaceDir)) {
            throw new Error("exclude add 未生效");
        }

        runCommand(`node bin/ag-kit.js exclude remove --path "${workspaceDir}" --quiet`, { env });
        const excludedAfter = runCommand("node bin/ag-kit.js exclude list --quiet", { env });
        if (excludedAfter.split(/\r?\n/).includes(workspaceDir)) {
            throw new Error("exclude remove 未生效");
        }

        runCommand("node bin/ag-kit.js global sync --quiet", { env });
        const globalStatus = runCommand("node bin/ag-kit.js global status --quiet", { env }).trim();
        if (globalStatus !== "installed") {
            throw new Error(`global status 结果异常: ${globalStatus}`);
        }
    } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    }

    logStep("执行清理预检");
    if (packageRunner === "bun") {
        runCommand("bun run clean:dry-run");
    } else {
        runCommand("npm run clean:dry-run --silent");
    }

    console.log("✅ 健康检查通过");
}

try {
    main();
} catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
}
