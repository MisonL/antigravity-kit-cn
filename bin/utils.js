const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const REPO_URL = "https://github.com/MisonL/antigravity-kit-cn.git";

function parseJsonSafe(raw) {
    try {
        return JSON.parse(raw);
    } catch (err) {
        return null;
    }
}

function readGlobalNpmDependencies() {
    const cmd = "npm ls --global --depth=0 --json --silent";
    let output = "";

    try {
        output = execSync(cmd, {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
    } catch (err) {
        output = typeof err.stdout === "string" ? err.stdout : "";
    }

    if (!output || output.trim() === "") {
        return null;
    }

    const data = parseJsonSafe(output);
    if (!data || typeof data !== "object") {
        return null;
    }

    const deps = data.dependencies;
    if (!deps || typeof deps !== "object") {
        return {};
    }

    return deps;
}

function cloneBranchAgentDir(branch, options) {
    const safeBranch = branch.trim();
    if (!/^[A-Za-z0-9._/-]+$/.test(safeBranch)) {
        throw new Error(`非法分支名: ${branch}`);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-"));
    const logFn = options && options.logger ? options.logger : console.log;

    if (!options.quiet) logFn(`📥 正在从 ${REPO_URL} 拉取分支 ${safeBranch} ...`);

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

module.exports = {
    parseJsonSafe,
    readGlobalNpmDependencies,
    cloneBranchAgentDir
};
