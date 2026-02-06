const fs = require("fs");
const path = require("path");
const os = require("os");
const ResourceLoader = require("./resource-loader");
const ResourceTransformer = require("./transformer");
const RuleGenerator = require("./generator");

class CodexBuilder {
    /**
     * Build a Codex structure from a legacy/source repository
     * @param {string} sourceRoot Root of the repo (containing .agent/)
     * @param {string} outputDir Directory to output the built .agents-compatible structure
     */
    static build(sourceRoot, outputDir) {
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });

        // 1. Load Resources
        const loader = new ResourceLoader(sourceRoot);
        const resources = loader.loadAll();

        // 2. Transform
        const transformResult = ResourceTransformer.transform(resources);

        // 3. Execute File/Dir Copying based on Transform Map
        for (const map of transformResult.mappedFiles) {
             const dest = path.join(outputDir, map.destPath);
             const destParent = path.dirname(dest);
             
             if (!fs.existsSync(destParent)) {
                 fs.mkdirSync(destParent, { recursive: true });
             }

             if (map.isDir) {
                 // Recursive copy
                 CodexBuilder._copyDir(map.src, dest);
             } else if (typeof map.content === "string") {
                 fs.writeFileSync(dest, map.content);
             } else {
                 if (fs.existsSync(map.src)) {
                    fs.copyFileSync(map.src, dest);
                 }
             }
        }

        // 4. Generate & Write Metadata
        const { agentsMd, antigravityRules, codexJson } = RuleGenerator.generate(transformResult);
        
        fs.writeFileSync(path.join(outputDir, "codex.json"), `${JSON.stringify(codexJson, null, 2)}\n`);
        fs.writeFileSync(path.join(outputDir, "AGENTS.md"), `${agentsMd}\n`);
        fs.writeFileSync(path.join(outputDir, "antigravity.rules"), `${antigravityRules}\n`);

        return {
            outputDir,
            stats: {
                skills: resources.skills.length,
                workflows: resources.workflows.length
            }
        };
    }

    static _copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                CodexBuilder._copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

module.exports = CodexBuilder;
