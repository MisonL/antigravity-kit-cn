#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ling.js");

function runCli(args, options = {}) {
    const allowedStatuses = options.allowedStatuses || [0];
    const env = {
        ...process.env,
        LING_SKIP_UPSTREAM_CHECK: "1",
        ...options.env,
    };

    const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: REPO_ROOT,
        env,
        encoding: "utf8",
    });

    if (!allowedStatuses.includes(result.status)) {
        const message = result.stderr || result.stdout || "";
        throw new Error(
            `命令失败: ling ${args.join(" ")}\n(exit=${result.status})\n${message}`.trim(),
        );
    }

    return result.stdout || "";
}

function ensureExists(targetPath, label) {
    if (!fs.existsSync(targetPath)) {
        throw new Error(`缺少 ${label}: ${targetPath}`);
    }
}

function main() {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ling-ci-"));
    const workspaceDir = path.join(tempRoot, "workspace");
    const indexPath = path.join(tempRoot, "workspaces.json");
    const globalRoot = path.join(tempRoot, "global-root");

    fs.mkdirSync(workspaceDir, { recursive: true });

    const env = {
        LING_INDEX_PATH: indexPath,
        LING_GLOBAL_ROOT: globalRoot,
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

    runCli(["global", "sync", "--quiet"], { env });
    const globalStatus = runCli(["global", "status", "--quiet"], { env }).trim();
    if (globalStatus !== "installed") {
        throw new Error(`global status 结果异常: ${globalStatus}`);
    }

    runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
    const specStatus = runCli(["spec", "status", "--quiet"], { env }).trim();
    if (specStatus !== "installed") {
        throw new Error(`spec status 结果异常: ${specStatus}`);
    }
    runCli(["spec", "disable", "--target", "codex", "--quiet"], { env });
    const specStatusAfterDisable = runCli(["spec", "status", "--quiet"], {
        env,
        allowedStatuses: [0, 2],
    }).trim();
    if (specStatusAfterDisable !== "missing") {
        throw new Error(`spec disable 后状态异常: ${specStatusAfterDisable}`);
    }

    const codexSkill = path.join(globalRoot, ".codex", "skills", "workflow-plan", "SKILL.md");
    const geminiCliSkill = path.join(globalRoot, ".gemini", "skills", "clean-code", "SKILL.md");
    const antigravitySkill = path.join(globalRoot, ".gemini", "antigravity", "skills", "clean-code", "SKILL.md");
    const specCodexSkill = path.join(globalRoot, ".codex", "skills", "harness-engineering");
    ensureExists(codexSkill, "全局 Codex workflow-plan Skill");
    ensureExists(geminiCliSkill, "全局 Gemini CLI clean-code Skill");
    ensureExists(antigravitySkill, "全局 Antigravity clean-code Skill");
    if (fs.existsSync(specCodexSkill)) {
        throw new Error(`spec disable 后仍残留 Spec Skill: ${specCodexSkill}`);
    }

    fs.rmSync(tempRoot, { recursive: true, force: true });
}

try {
    main();
    console.log("[ok] CI 全链路演练通过");
} catch (err) {
    console.error(`[error] ${err.message}`);
    process.exit(1);
}
