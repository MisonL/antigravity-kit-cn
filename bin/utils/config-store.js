const fs = require("fs");
const os = require("os");
const path = require("path");

function getUserConfigPath() {
    const customPath = process.env.AG_KIT_CONFIG_PATH;
    if (customPath && customPath.trim() !== "") {
        if (path.isAbsolute(customPath)) {
            return path.resolve(customPath);
        }
        return path.resolve(process.cwd(), customPath);
    }
    return path.join(os.homedir(), ".ag-kit", "config.json");
}

function loadUserConfig() {
    const configPath = getUserConfigPath();
    if (!fs.existsSync(configPath)) {
        return { configPath, config: null, error: null };
    }

    try {
        const raw = fs.readFileSync(configPath, "utf8").trim();
        if (!raw) {
            return { configPath, config: null, error: null };
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
            return { configPath, config: null, error: new Error("配置不是对象") };
        }
        return { configPath, config: parsed, error: null };
    } catch (err) {
        return { configPath, config: null, error: err };
    }
}

function applyConfigDefaults(options, providedFlags, config) {
    if (!config || typeof config !== "object") {
        return options;
    }

    const defaults = (config.defaults && typeof config.defaults === "object")
        ? config.defaults
        : config;

    const next = { ...options };
    const hasFlag = (flag) => (providedFlags || []).includes(flag);

    if (!hasFlag("--non-interactive") && typeof defaults.nonInteractive === "boolean") {
        next.nonInteractive = defaults.nonInteractive;
    }
    if (!hasFlag("--disable-agent-projection") && typeof defaults.disableAgentProjection === "boolean") {
        next.disableAgentProjection = defaults.disableAgentProjection;
    }
    if (!hasFlag("--no-index") && typeof defaults.noIndex === "boolean") {
        next.noIndex = defaults.noIndex;
    }
    if (!hasFlag("--quiet") && typeof defaults.quiet === "boolean") {
        next.quiet = defaults.quiet;
    }
    if (!hasFlag("--accept-legacy-agent") && typeof defaults.acceptLegacyAgent === "boolean") {
        next.acceptLegacyAgent = defaults.acceptLegacyAgent;
    }

    if (!next.agentConflictPolicy && typeof defaults.agentConflictPolicy === "string") {
        next.agentConflictPolicy = defaults.agentConflictPolicy;
    }
    if (!next.geminiAgentsPolicy && typeof defaults.geminiAgentsPolicy === "string") {
        next.geminiAgentsPolicy = defaults.geminiAgentsPolicy;
    }

    return next;
}

module.exports = {
    getUserConfigPath,
    loadUserConfig,
    applyConfigDefaults,
};

