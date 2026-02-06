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

        // 1. Process Skills
        // Strategy: Skill folder -> .codex/skills/agk-<name>/SKILL.md
        for (const skill of resources.skills) {
            const codexName = `agk-${skill.name}`;
            const destDir = `skills/${codexName}`;
            
            // Map the main SKILL.md
            result.mappedFiles.push({
                src: path.join(skill.path, skill.entryFile),
                destPath: `${destDir}/SKILL.md`
            });

            // Map other resources in the skill folder
            // TODO: Deep copy/scan for other files in skill dir?
            // For v1, let's assume we copy the whole folder structure or just key files?
            // The ResourceLoader only returned the entry point. 
            // We might need to map the whole directory. 
            // Let's defer directory copy logic to the installer using this map. 
            // But wait, `src` is the folder for the skill.
            
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
        // Strategy: Workflow file -> .codex/skills/agk-workflow-<name>/SKILL.md
        // We convert workflows to skills in Codex? Or keep them as workflows?
        // Implementation Plan says: "Workflow -> Skill Conversion".
        // So we wrap them.
        for (const workflow of resources.workflows) {
            const codexName = `agk-workflow-${workflow.name}`;
            const destDir = `skills/${codexName}`;
            
            // We treat the workflow markdown as the SKILL.md
            result.mappedFiles.push({
                src: workflow.path, // The .md file
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
