const fs = require("fs");
const path = require("path");

class GitHelper {
    /**
     * Remove ignore rules matching specific patterns from .gitignore
     * @param {string} workspaceRoot Directory containing .gitignore
     * @param {string[]} targetPatterns List of patterns to remove (e.g. ['.agent', '.codex'])
     * @param {object} options { dryRun: boolean }
     * @returns {object} { fileExists, removedCount, dryRun }
     */
    static removeIgnoreRules(workspaceRoot, targetPatterns, options) {
        const gitIgnorePath = path.join(workspaceRoot, ".gitignore");
        if (!fs.existsSync(gitIgnorePath)) {
            return { fileExists: false, removedCount: 0, dryRun: options.dryRun };
        }

        const original = fs.readFileSync(gitIgnorePath, "utf8");
        const lineEnding = original.includes("\r\n") ? "\r\n" : "\n";
        const hadTrailingNewline = /\r?\n$/.test(original);
        const lines = original.split(/\r?\n/);

        const kept = [];
        let removedCount = 0;

        function isTargetRule(line) {
             const trimmed = line.trim();
             if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) return false;
             let pattern = trimmed;
             // Remove leading/trailing patterns
             while (pattern.startsWith("**/")) pattern = pattern.slice(3);
             while (pattern.startsWith("/")) pattern = pattern.slice(1);
             while (pattern.endsWith("/")) pattern = pattern.slice(0, -1);
             while (pattern.endsWith("/**")) pattern = pattern.slice(0, -3);
             
             if (!pattern) return false;
             const segments = pattern.split("/");
             
             // Check if any segment matches our target patterns
             return segments.some((segment) => targetPatterns.includes(segment));
        }

        for (const line of lines) {
            if (isTargetRule(line)) {
                removedCount += 1;
                continue;
            }
            kept.push(line);
        }

        if (removedCount === 0) {
            return { fileExists: true, removedCount: 0, dryRun: options.dryRun };
        }

        let updated = kept.join(lineEnding);
        if (hadTrailingNewline) {
            updated += lineEnding;
        }

        if (!options.dryRun) {
            fs.writeFileSync(gitIgnorePath, updated, "utf8");
        }

        return { fileExists: true, removedCount, dryRun: options.dryRun };
    }
}

module.exports = GitHelper;
