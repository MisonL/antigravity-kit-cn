const fs = require("fs");
const path = require("path");

const PROJECTION_MARKER = ".ag-kit-projection.json";

function hasManagedCanonicalManifestSignal(workspaceRoot) {
    const manifestPath = path.join(workspaceRoot, ".agents", "manifest.json");
    return fs.existsSync(manifestPath);
}

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

function hasManagedAgentProjectionSignal(workspaceRoot) {
    return isManagedProjectionDir(workspaceRoot, ".agent", "agent");
}

function hasManagedGeminiAgentsNamespace(workspaceRoot) {
    const agentsDir = path.join(workspaceRoot, ".gemini", "agents");
    if (!fs.existsSync(agentsDir)) {
        return false;
    }

    try {
        const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
        return entries.some((entry) => entry.isFile() && /^ag-kit-.*\.md$/i.test(entry.name));
    } catch (_err) {
        return false;
    }
}

function hasManagedGeminiProjectionSignal(workspaceRoot) {
    return isManagedProjectionDir(workspaceRoot, ".gemini", "gemini")
        || hasManagedGeminiAgentsNamespace(workspaceRoot);
}

module.exports = {
    PROJECTION_MARKER,
    hasManagedCanonicalManifestSignal,
    isManagedProjectionDir,
    hasManagedAgentProjectionSignal,
    hasManagedGeminiAgentsNamespace,
    hasManagedGeminiProjectionSignal,
};
