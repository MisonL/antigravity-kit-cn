const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const ResourceTransformer = require("../bin/core/transformer");

describe("ResourceTransformer", () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-transformer-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    function transformWorkflow(markdown) {
        const workflowPath = path.join(tempDir, "workflow.md");
        fs.writeFileSync(workflowPath, markdown, "utf8");

        const result = ResourceTransformer.transform({
            skills: [],
            workflows: [{ name: "demo", path: workflowPath, type: "workflow" }],
        });

        return result.mappedFiles.find((item) => item.destPath.endsWith("/SKILL.md"));
    }

    test("workflow frontmatter should parse CRLF and keep colon in description", () => {
        const mapped = transformWorkflow([
            "---\r",
            "description: \"Run /debug: inspect failures\"\r",
            "---\r",
            "",
            "# Workflow body",
        ].join("\n"));

        assert.ok(mapped);
        assert.ok(mapped.content.includes("description: \"Run /debug: inspect failures\""));
        assert.ok(mapped.content.includes("# Workflow body"));
    });

    test("workflow frontmatter should parse folded multiline description", () => {
        const mapped = transformWorkflow([
            "---",
            "description: >",
            "  先执行 /plan",
            "  再执行 /debug",
            "---",
            "",
            "# Workflow body",
        ].join("\n"));

        assert.ok(mapped);
        assert.ok(mapped.content.includes("description: \"先执行 /plan 再执行 /debug\""));
    });

    test("workflow frontmatter should parse indented multiline description", () => {
        const mapped = transformWorkflow([
            "---",
            "description:",
            "  统一排查流程: 先收集日志",
            "  再定位根因",
            "---",
            "",
            "# Workflow body",
        ].join("\n"));

        assert.ok(mapped);
        assert.ok(mapped.content.includes("description: \"统一排查流程: 先收集日志 再定位根因\""));
    });
});
