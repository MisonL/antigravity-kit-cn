const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ling.js");

function runCli(args, options = {}) {
    const env = {
        ...process.env,
        LING_SKIP_UPSTREAM_CHECK: "1",
        ...options.env,
    };

    return spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: options.cwd || REPO_ROOT,
        env,
        encoding: "utf8",
    });
}

describe("Spec Profile", () => {
    let tempRoot;

    beforeEach(() => {
        tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ling-spec-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    test("spec status should report missing before enable", () => {
        const result = runCli(["spec", "status", "--quiet"], {
            env: { LING_GLOBAL_ROOT: tempRoot },
        });
        assert.strictEqual(result.status, 2);
        assert.strictEqual((result.stdout || "").trim(), "missing");
    });

    test("spec enable should install skills and assets, and disable should remove them", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const codexSkill = path.join(tempRoot, ".agents", "skills", "harness-engineering", "SKILL.md");
        const stateFile = path.join(tempRoot, ".ling", "spec", "state.json");
        const templatesDir = path.join(tempRoot, ".ling", "spec", "templates");
        const referencesDir = path.join(tempRoot, ".ling", "spec", "references");
        const profilesDir = path.join(tempRoot, ".ling", "spec", "profiles");

        assert.ok(fs.existsSync(codexSkill), "missing installed codex spec skill");
        assert.ok(fs.existsSync(stateFile), "missing spec state");
        assert.ok(fs.existsSync(path.join(templatesDir, "issues.template.csv")), "missing spec template");
        assert.ok(fs.existsSync(path.join(referencesDir, "harness-engineering-digest.md")), "missing spec reference");
        assert.ok(fs.existsSync(path.join(profilesDir, "codex", "AGENTS.spec.md")), "missing spec profile");
        assert.ok(fs.existsSync(path.join(profilesDir, "codex", "ling.spec.rules.md")), "missing spec profile rules");

        const statusResult = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(statusResult.status, 0);
        assert.strictEqual((statusResult.stdout || "").trim(), "installed");

        const disableResult = runCli(["spec", "disable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(disableResult.status, 0, disableResult.stderr || disableResult.stdout);
        assert.ok(!fs.existsSync(path.join(tempRoot, ".agents", "skills", "harness-engineering")), "spec skill should be removed");
        assert.ok(!fs.existsSync(stateFile), "spec state should be removed after final disable");
        assert.ok(!fs.existsSync(templatesDir), "spec templates should be removed after final disable");
        assert.ok(!fs.existsSync(referencesDir), "spec references should be removed after final disable");
        assert.ok(!fs.existsSync(profilesDir), "spec profiles should be removed after final disable");
    });

    test("spec disable should restore pre-existing skill backup", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };
        const skillDir = path.join(tempRoot, ".agents", "skills", "harness-engineering");
        fs.mkdirSync(skillDir, { recursive: true });
        fs.writeFileSync(path.join(skillDir, "SKILL.md"), "legacy skill", "utf8");

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);
        assert.notStrictEqual(fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8"), "legacy skill");

        const disableResult = runCli(["spec", "disable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(disableResult.status, 0, disableResult.stderr || disableResult.stdout);
        assert.strictEqual(fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8"), "legacy skill");
    });

    test("spec enable should repair missing assets and skills when state exists", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const templatesDir = path.join(tempRoot, ".ling", "spec", "templates");
        const codexSkillDir = path.join(tempRoot, ".agents", "skills", "harness-engineering");
        fs.rmSync(templatesDir, { recursive: true, force: true });
        fs.rmSync(codexSkillDir, { recursive: true, force: true });

        const brokenResult = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(brokenResult.status, 1);
        assert.strictEqual((brokenResult.stdout || "").trim(), "broken");

        const repairResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(repairResult.status, 0, repairResult.stderr || repairResult.stdout);

        const repairedStatus = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(repairedStatus.status, 0);
        assert.strictEqual((repairedStatus.stdout || "").trim(), "installed");

        assert.ok(fs.existsSync(path.join(templatesDir, "issues.template.csv")), "templates should be repaired");
        assert.ok(fs.existsSync(path.join(codexSkillDir, "SKILL.md")), "spec skill should be repaired");
    });

    test("spec enable should install antigravity skills independently", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const enableResult = runCli(["spec", "enable", "--target", "antigravity", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const antigravitySkill = path.join(tempRoot, ".gemini", "antigravity", "skills", "harness-engineering", "SKILL.md");
        const geminiSkill = path.join(tempRoot, ".gemini", "skills", "harness-engineering", "SKILL.md");
        assert.ok(fs.existsSync(antigravitySkill), "missing installed antigravity spec skill");
        assert.ok(!fs.existsSync(geminiSkill), "antigravity spec enable should not install gemini skill");

        const statusResult = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(statusResult.status, 0);
        assert.strictEqual((statusResult.stdout || "").trim(), "installed");
    });

    test("spec enable should install gemini skills independently", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const enableResult = runCli(["spec", "enable", "--target", "gemini", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const geminiSkill = path.join(tempRoot, ".gemini", "skills", "harness-engineering", "SKILL.md");
        const antigravitySkill = path.join(tempRoot, ".gemini", "antigravity", "skills", "harness-engineering", "SKILL.md");
        assert.ok(fs.existsSync(geminiSkill), "missing installed gemini spec skill");
        assert.ok(!fs.existsSync(antigravitySkill), "gemini spec enable should not install antigravity skill");
    });

    test("spec enable should migrate legacy codex global skill path to ~/.agents/skills", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };
        const stateDir = path.join(tempRoot, ".ling", "spec");
        fs.mkdirSync(stateDir, { recursive: true });
        fs.writeFileSync(path.join(stateDir, "state.json"), JSON.stringify({
            version: 1,
            updatedAt: new Date().toISOString(),
            targets: {
                codex: {
                    enabledAt: new Date().toISOString(),
                    consumers: {
                        codex: {
                            skills: [
                                {
                                    name: "harness-engineering",
                                    destPath: path.join(tempRoot, ".codex", "skills", "harness-engineering"),
                                    backupPath: "",
                                    mode: "created",
                                },
                            ],
                        },
                    },
                },
            },
            assets: {},
        }, null, 2), "utf8");

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const state = JSON.parse(fs.readFileSync(path.join(stateDir, "state.json"), "utf8"));
        const skillState = state.targets.codex.consumers.codex.skills.find((skill) => skill.name === "harness-engineering");
        assert.ok(skillState.destPath.includes(`${path.sep}.agents${path.sep}skills${path.sep}harness-engineering`), "legacy codex path should be migrated to .agents/skills");
    });

    test("spec status should report broken when an asset file is missing", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const driverPrompt = path.join(tempRoot, ".ling", "spec", "templates", "driver-prompt.md");
        assert.ok(fs.existsSync(driverPrompt), "driver-prompt.md should exist after enable");
        fs.rmSync(driverPrompt, { force: true });

        const statusResult = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(statusResult.status, 1);
        assert.strictEqual((statusResult.stdout || "").trim(), "broken");

        const repairResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(repairResult.status, 0, repairResult.stderr || repairResult.stdout);
        assert.ok(fs.existsSync(driverPrompt), "driver-prompt.md should be repaired");
    });

    test("spec status should report broken when state.json is missing but assets exist", () => {
        const env = { LING_GLOBAL_ROOT: tempRoot };

        const templatesDir = path.join(tempRoot, ".ling", "spec", "templates");
        fs.mkdirSync(templatesDir, { recursive: true });
        fs.writeFileSync(path.join(templatesDir, "issues.template.csv"), "sentinel", "utf8");

        const statusResult = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(statusResult.status, 1);
        assert.strictEqual((statusResult.stdout || "").trim(), "broken");

        const repairResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(repairResult.status, 0, repairResult.stderr || repairResult.stdout);

        const repairedStatus = runCli(["spec", "status", "--quiet"], { env });
        assert.strictEqual(repairedStatus.status, 0);
        assert.strictEqual((repairedStatus.stdout || "").trim(), "installed");
    });
});
