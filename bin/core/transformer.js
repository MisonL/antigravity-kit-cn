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

        function stripWrappingQuotes(value) {
            const trimmed = String(value || "").trim();
            if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                return trimmed.slice(1, -1);
            }
            return trimmed;
        }

        function foldYamlBlock(lines) {
            const paragraphs = [];
            let current = [];

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) {
                    if (current.length > 0) {
                        paragraphs.push(current.join(" "));
                        current = [];
                    }
                    continue;
                }
                current.push(trimmed);
            }

            if (current.length > 0) {
                paragraphs.push(current.join(" "));
            }

            return paragraphs.join("\n");
        }

        function collectIndentedLines(lines, startIndex) {
            const collected = [];
            let idx = startIndex;
            let baseIndent = -1;

            while (idx < lines.length) {
                const line = lines[idx];
                if (line.trim() === "") {
                    if (collected.length > 0) {
                        collected.push("");
                    }
                    idx += 1;
                    continue;
                }

                const indentMatch = line.match(/^(\s+)/);
                if (!indentMatch) {
                    break;
                }

                const indentLength = indentMatch[1].length;
                if (baseIndent < 0) {
                    baseIndent = indentLength;
                }
                if (indentLength < baseIndent) {
                    break;
                }

                collected.push(line.slice(baseIndent));
                idx += 1;
            }

            return { lines: collected, nextIndex: idx - 1 };
        }

        function parseFrontmatter(content) {
            const normalized = String(content || "").replace(/\r\n?/g, "\n");
            if (!normalized.startsWith("---\n")) {
                return { frontmatter: {}, body: normalized };
            }

            const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
            if (!match) {
                return { frontmatter: {}, body: normalized };
            }

            const fmRaw = match[1];
            const frontmatter = {};
            const lines = fmRaw.split("\n");

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const keyMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
                if (!keyMatch) continue;

                const key = keyMatch[1];
                const inlineValue = keyMatch[2];
                if (!key) continue;

                if (inlineValue === "|" || inlineValue === ">") {
                    const block = collectIndentedLines(lines, i + 1);
                    i = Math.max(i, block.nextIndex);
                    frontmatter[key] = inlineValue === ">"
                        ? foldYamlBlock(block.lines)
                        : block.lines.join("\n").trim();
                    continue;
                }

                if (inlineValue.trim() === "") {
                    const block = collectIndentedLines(lines, i + 1);
                    if (block.lines.length > 0) {
                        i = Math.max(i, block.nextIndex);
                        frontmatter[key] = block.lines.join("\n").trim();
                    } else {
                        frontmatter[key] = "";
                    }
                    continue;
                }

                frontmatter[key] = stripWrappingQuotes(inlineValue);
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
