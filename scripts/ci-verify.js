#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ag-kit.js");

function runCli(args, options = {}) {
    const env = {
        ...process.env,
        AG_KIT_SKIP_UPSTREAM_CHECK: "1",
        ...options.env,
    };

    const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: REPO_ROOT,
        env,
        encoding: "utf8",
    });

    if (result.status !== 0) {
        const message = result.stderr || result.stdout || "";
        throw new Error(`命令失败: ag-kit ${args.join(" ")}\n${message}`);
    }

    return result.stdout || "";
}

function ensureExists(targetPath, label) {
    if (!fs.existsSync(targetPath)) {
        throw new Error(`缺少 ${label}: ${targetPath}`);
    }
}

function main() {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-ci-"));
    const workspaceDir = path.join(tempRoot, "workspace");
    const indexPath = path.join(tempRoot, "workspaces.json");
    const globalRoot = path.join(tempRoot, "global-root");

    fs.mkdirSync(workspaceDir, { recursive: true });

    const env = {
        AG_KIT_INDEX_PATH: indexPath,
        AG_KIT_GLOBAL_ROOT: globalRoot,
    };

    runCli(["init", "--targets", "gemini,codex", "--path", workspaceDir, "--quiet"], { env });

    const status = runCli(["status", "--path", workspaceDir, "--quiet"], { env }).trim();
    if (status !== "installed") {
        throw new Error(`status 结果异常: ${status}`);
    }

    runCli(["doctor", "--path", workspaceDir, "--quiet"], { env });
    runCli(["update", "--path", workspaceDir, "--quiet"], { env });
    runCli(["update-all", "--dry-run", "--quiet"], { env });

    runCli(["exclude", "add", "--path", workspaceDir, "--quiet"], { env });
    const excluded = runCli(["exclude", "list", "--quiet"], { env });
    if (!excluded.split(/\r?\n/).includes(workspaceDir)) {
        throw new Error("exclude add 未生效");
    }
    runCli(["exclude", "remove", "--path", workspaceDir, "--quiet"], { env });
    const excludedAfter = runCli(["exclude", "list", "--quiet"], { env });
    if (excludedAfter.split(/\r?\n/).includes(workspaceDir)) {
        throw new Error("exclude remove 未生效");
    }

    runCli(["global", "sync", "--target", "codex", "--quiet"], { env });
    runCli(["global", "sync", "--target", "gemini", "--quiet"], { env });
    runCli(["global", "status", "--quiet"], { env });

    const codexSkill = path.join(globalRoot, ".agents", "skills", "workflow-plan", "SKILL.md");
    const geminiSkill = path.join(globalRoot, ".gemini", "antigravity", "skills", "clean-code", "SKILL.md");
    ensureExists(codexSkill, "全局 Codex workflow-plan Skill");
    ensureExists(geminiSkill, "全局 Antigravity clean-code Skill");

    fs.rmSync(tempRoot, { recursive: true, force: true });
}

try {
    main();
    console.log("✅ CI 全链路演练通过");
} catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
}
