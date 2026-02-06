const fs = require("fs");
const path = require("path");

class ResourceTransformer {
    /**
     * Transform raw resources into Codex-compatible structure
     * @param {object} resources { skills: [], workflows: [] }
     * @returns {object} { mappedFiles: [], metadata: [] }
     */
    static transform(resources) {
        const result = {
            mappedFiles: [], // List of { src, destPath }
            metadata: []     // List of desc for rules
        };
        const usedIds = new Set();

        function allocateUniqueId(baseId) {
            let candidate = baseId;
            let suffix = 2;
            while (usedIds.has(candidate)) {
                candidate = `${baseId}-${suffix}`;
                suffix += 1;
            }
            usedIds.add(candidate);
            return candidate;
        }

        function parseFrontmatter(content) {
            const normalized = String(content || "");
            if (!normalized.startsWith("---")) {
                return { frontmatter: {}, body: normalized };
            }

            const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
            if (!match) {
                return { frontmatter: {}, body: normalized };
            }

            const fmRaw = match[1];
            const frontmatter = {};
            for (const line of fmRaw.split("\n")) {
                const idx = line.indexOf(":");
                if (idx <= 0) continue;
                const key = line.slice(0, idx).trim();
                const value = line.slice(idx + 1).trim();
                if (!key) continue;
                frontmatter[key] = value;
            }

            const body = normalized.slice(match[0].length);
            return { frontmatter, body };
        }

        // 1. Process Skills
        // Strategy: Skill folder -> skills/<name>/SKILL.md
        for (const skill of resources.skills) {
            const codexName = allocateUniqueId(skill.name);
            const destDir = `skills/${codexName}`;

            // Keep the full skill folder to preserve resources/scripts exactly.
            result.mappedFiles.push({
                src: skill.path, // The folder
                destPath: destDir,
                isDir: true
            });

            result.metadata.push({
                id: codexName,
                originalName: skill.name,
                type: "skill",
                path: `${destDir}/SKILL.md`
            });
        }

        // 2. Process Workflows
        // Codex only understands skills. Convert each workflow markdown to a valid SKILL.md.
        for (const workflow of resources.workflows) {
            const codexName = allocateUniqueId(`workflow-${workflow.name}`);
            const destDir = `skills/${codexName}`;

            const rawWorkflow = fs.existsSync(workflow.path)
                ? fs.readFileSync(workflow.path, "utf8")
                : "";
            const parsed = parseFrontmatter(rawWorkflow);
            const descriptionRaw = parsed.frontmatter.description
                || `Antigravity workflow bridge for /${workflow.name}`;
            const description = JSON.stringify(String(descriptionRaw).replace(/\s+/g, " ").trim());

            const generatedSkill = [
                "---",
                `name: ${codexName}`,
                `description: ${description}`,
                "---",
                "",
                parsed.body.trimStart(),
                "",
            ].join("\n");

            result.mappedFiles.push({
                content: generatedSkill,
                destPath: `${destDir}/SKILL.md`,
                isDir: false
            });

            result.metadata.push({
                id: codexName,
                originalName: workflow.name,
                type: "workflow-as-skill",
                path: `${destDir}/SKILL.md`
            });
        }

        return result;
    }
}

module.exports = ResourceTransformer;
