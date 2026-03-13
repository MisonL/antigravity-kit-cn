const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const DEFAULT_REPO_URL = "https://github.com/MisonL/Ling.git";

function resolveRepoUrl() {
    const override = process.env.LING_REPO_URL;
    if (typeof override === "string" && override.trim()) {
        return override.trim();
    }
    return DEFAULT_REPO_URL;
}

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

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ling-"));
    const logFn = options && options.logger ? options.logger : console.log;
    const repoUrl = resolveRepoUrl();

    if (!options.quiet) logFn(`[download] 正在从 ${repoUrl} 拉取分支 ${safeBranch} ...`);

    const cloneResult = spawnSync("git", ["clone", "--depth", "1", "--branch", safeBranch, repoUrl, tempDir], {
        encoding: "utf8",
        stdio: options.quiet ? "ignore" : "pipe",
    });
    if (cloneResult.status !== 0) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`无法拉取分支 ${safeBranch}，请确认分支存在且网络可用`);
    }

    const clonedAgentsDir = path.join(tempDir, ".agents");
    const clonedAgentDir = path.join(tempDir, ".agent");
    let templateDir = "";

    if (fs.existsSync(clonedAgentsDir)) {
        templateDir = clonedAgentsDir;
    } else if (fs.existsSync(clonedAgentDir)) {
        templateDir = clonedAgentDir;
    } else {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`分支 ${safeBranch} 中未找到 .agents 或 .agent 目录`);
    }

    return {
        agentDir: templateDir,
        cleanup: () => fs.rmSync(tempDir, { recursive: true, force: true }),
    };
}

function cloneBranchSpecDir(branch, options) {
    const safeBranch = branch.trim();
    if (!/^[A-Za-z0-9._/-]+$/.test(safeBranch)) {
        throw new Error(`非法分支名: ${branch}`);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ling-"));
    const logFn = options && options.logger ? options.logger : console.log;
    const repoUrl = resolveRepoUrl();

    if (!options.quiet) logFn(`[download] 正在从 ${repoUrl} 拉取分支 ${safeBranch} (spec) ...`);

    const cloneResult = spawnSync("git", ["clone", "--depth", "1", "--branch", safeBranch, repoUrl, tempDir], {
        encoding: "utf8",
        stdio: options.quiet ? "ignore" : "pipe",
    });
    if (cloneResult.status !== 0) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`无法拉取分支 ${safeBranch}，请确认分支存在且网络可用`);
    }

    const specDir = path.join(tempDir, ".spec");
    if (!fs.existsSync(specDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw new Error(`分支 ${safeBranch} 中未找到 .spec 目录`);
    }

    return {
        specDir,
        cleanup: () => fs.rmSync(tempDir, { recursive: true, force: true }),
    };
}

module.exports = {
    parseJsonSafe,
    readGlobalNpmDependencies,
    cloneBranchAgentDir,
    cloneBranchSpecDir
};
