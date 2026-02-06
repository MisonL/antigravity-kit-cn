const { execSync } = require("child_process");

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

module.exports = {
    parseJsonSafe,
    readGlobalNpmDependencies,
};
