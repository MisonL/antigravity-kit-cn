const fs = require("fs");
const path = require("path");

const PROJECTION_MARKER = ".ag-kit-projection.json";
const LEGACY_AGENT_SIGNATURE_FILES = [
    path.join("skills", "doc.md"),
    path.join("rules", "GEMINI.md"),
    path.join("workflows", "create.md"),
    path.join("agents", "orchestrator.md"),
    "ARCHITECTURE.md",
    "mcp_config.json",
];

function isManagedProjectionDir(workspaceRoot, dirName, type) {
    const markerPath = path.join(workspaceRoot, dirName, PROJECTION_MARKER);
    if (!fs.existsSync(markerPath)) {
        return false;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(markerPath, "utf8"));
        return parsed
            && parsed.managedBy === "ag-kit-cn"
            && parsed.type === type;
    } catch (_err) {
        return false;
    }
}

function hasLegacyAgentLayoutSignal(workspaceRoot) {
    const agentDir = path.join(workspaceRoot, ".agent");
    if (!fs.existsSync(agentDir)) {
        return false;
    }

    if (isManagedProjectionDir(workspaceRoot, ".agent", "agent")) {
        return true;
    }

    let matched = 0;
    for (const relPath of LEGACY_AGENT_SIGNATURE_FILES) {
        const absolutePath = path.join(agentDir, relPath);
        if (fs.existsSync(absolutePath)) {
            matched += 1;
        }
    }

    return matched >= 2;
}

function hasLegacyGeminiLayoutSignal(workspaceRoot) {
    const geminiDir = path.join(workspaceRoot, ".gemini");
    if (!fs.existsSync(geminiDir)) {
        return false;
    }

    if (isManagedProjectionDir(workspaceRoot, ".gemini", "gemini")) {
        return true;
    }

    const agentsDir = path.join(geminiDir, "agents");
    if (fs.existsSync(agentsDir)) {
        try {
            const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
            if (entries.some((entry) => entry.isFile() && /^ag-kit-.*\.md$/i.test(entry.name))) {
                return true;
            }
        } catch (_err) {
            return false;
        }
    }

    return false;
}

module.exports = {
    PROJECTION_MARKER,
    isManagedProjectionDir,
    hasLegacyAgentLayoutSignal,
    hasLegacyGeminiLayoutSignal,
};
