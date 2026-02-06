const fs = require("fs");
const path = require("path");

class ResourceLoader {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.skillsDir = path.join(rootDir, ".agent", "skills");
        this.workflowsDir = path.join(rootDir, ".agent", "workflows");
    }

    /**
     * Load all skills and workflows
     */
    loadAll() {
        return {
            skills: this.loadSkills(),
            workflows: this.loadWorkflows()
        };
    }

    loadSkills() {
        if (!fs.existsSync(this.skillsDir)) return [];
        
        const skills = [];
        const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const skillPath = path.join(this.skillsDir, entry.name);
                const skillFile = path.join(skillPath, "SKILL.md");
                
                if (fs.existsSync(skillFile)) {
                    skills.push({
                        name: entry.name,
                        path: skillPath,
                        entryFile: "SKILL.md", // Relative to skillPath
                        type: "skill"
                    });
                }
            }
        }
        return skills;
    }

    loadWorkflows() {
        if (!fs.existsSync(this.workflowsDir)) return [];
        
        const workflows = [];
        const entries = fs.readdirSync(this.workflowsDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".md")) {
                workflows.push({
                    name: path.basename(entry.name, ".md"),
                    path: path.join(this.workflowsDir, entry.name),
                    type: "workflow"
                });
            }
        }
        return workflows;
    }
}

module.exports = ResourceLoader;
