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

describe("Spec init/doctor", () => {
    let tempRoot;
    let workspaceRoot;

    beforeEach(() => {
        tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ling-spec-init-"));
        workspaceRoot = path.join(tempRoot, "workspace");
        fs.mkdirSync(workspaceRoot, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    test("spec init should create workspace assets and doctor should report installed", () => {
        const env = {
            LING_GLOBAL_ROOT: tempRoot,
            LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        };

        const initResult = runCli(["spec", "init", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        assert.ok(fs.existsSync(path.join(workspaceRoot, "issues.csv")), "issues.csv should be created");
        assert.ok(fs.existsSync(path.join(workspaceRoot, ".ling", "spec", "templates", "driver-prompt.md")), "spec templates should be created");
        assert.ok(fs.existsSync(path.join(workspaceRoot, ".ling", "spec", "references", "gda-framework.md")), "spec references should be created");
        assert.ok(fs.existsSync(path.join(workspaceRoot, ".ling", "spec", "profiles", "codex", "AGENTS.spec.md")), "spec profiles should be created");
        assert.ok(
            fs.existsSync(path.join(workspaceRoot, ".ling", "spec", "profiles", "codex", "ling.spec.rules.md")),
            "spec profile rules should be created",
        );
        assert.ok(fs.existsSync(path.join(workspaceRoot, ".ling", "spec", "profiles", "gemini", "GEMINI.spec.md")), "spec profiles should be created");
        assert.ok(fs.existsSync(path.join(workspaceRoot, "docs", "reviews")), "docs/reviews should exist");
        assert.ok(fs.existsSync(path.join(workspaceRoot, "docs", "handoff")), "docs/handoff should exist");

        const doctorResult = runCli(["spec", "doctor", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "installed");
    });

    test("spec init --csv-only should generate issues.csv and rely on global spec assets", () => {
        const env = {
            LING_GLOBAL_ROOT: tempRoot,
            LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        };

        const enableResult = runCli(["spec", "enable", "--target", "codex", "--quiet"], { env });
        assert.strictEqual(enableResult.status, 0, enableResult.stderr || enableResult.stdout);

        const initResult = runCli(["spec", "init", "--path", workspaceRoot, "--csv-only", "--quiet"], { env });
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        assert.ok(fs.existsSync(path.join(workspaceRoot, "issues.csv")), "issues.csv should be created");
        assert.ok(fs.existsSync(path.join(workspaceRoot, "docs", "reviews")), "docs/reviews should exist");
        assert.ok(fs.existsSync(path.join(workspaceRoot, "docs", "handoff")), "docs/handoff should exist");
        assert.ok(!fs.existsSync(path.join(workspaceRoot, ".ling", "spec")), "spec assets should not be created in csv-only mode");

        const doctorResult = runCli(["spec", "doctor", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "installed");
    });

    test("spec init without --path should initialize default spec-workspace and include targets", () => {
        const nonTempRoot = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ling-spec-global-"));
        const indexPath = path.join(nonTempRoot, "workspaces.json");
        const env = {
            LING_GLOBAL_ROOT: nonTempRoot,
            LING_INDEX_PATH: indexPath,
        };

        try {
            const initResult = runCli(["spec", "init", "--spec-workspace", "--quiet"], { env });
            assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

            const defaultWorkspace = path.join(nonTempRoot, ".ling", "spec-workspace");
            assert.ok(fs.existsSync(path.join(defaultWorkspace, "issues.csv")), "default workspace should include issues.csv");
            assert.ok(
                fs.existsSync(path.join(defaultWorkspace, ".ling", "spec", "templates", "driver-prompt.md")),
                "default workspace should include spec templates",
            );
            assert.ok(fs.existsSync(path.join(defaultWorkspace, ".agent")), "default workspace should include gemini .agent");
            assert.ok(fs.existsSync(path.join(defaultWorkspace, ".agents")), "default workspace should include codex .agents");

            const doctorResult = runCli(["spec", "doctor", "--spec-workspace", "--quiet"], { env });
            assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
            assert.strictEqual((doctorResult.stdout || "").trim(), "installed");

            assert.ok(fs.existsSync(indexPath), "workspace index should be created for non-temp global root");
            const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            assert.ok(
                (index.workspaces || []).some((workspace) => workspace && workspace.path === defaultWorkspace),
                "default spec-workspace should be registered into index",
            );
        } finally {
            fs.rmSync(nonTempRoot, { recursive: true, force: true });
        }
    });

    test("spec doctor should report broken when multiple tasks are in 进行中", () => {
        const env = {
            LING_GLOBAL_ROOT: tempRoot,
            LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        };

        const initResult = runCli(["spec", "init", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        const issuesPath = path.join(workspaceRoot, "issues.csv");
        fs.writeFileSync(
            issuesPath,
            [
                "ID,标题,内容,验收标准,审查要求,状态,标签",
                "A,任务A,内容A,验收A,审查A,进行中,高优先级",
                "B,任务B,内容B,验收B,审查B,进行中,高优先级",
                "",
            ].join("\n"),
            "utf8",
        );

        const doctorResult = runCli(["spec", "doctor", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(doctorResult.status, 1, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "broken");
    });

    test("spec doctor should report broken when issues.csv is missing but spec directory exists", () => {
        const env = {
            LING_GLOBAL_ROOT: tempRoot,
            LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        };

        const initResult = runCli(["spec", "init", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        fs.rmSync(path.join(workspaceRoot, "issues.csv"), { force: true });

        const doctorResult = runCli(["spec", "doctor", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(doctorResult.status, 1, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "broken");
    });

    test("spec init should support --branch for spec assets", () => {
        const gitCheck = spawnSync("git", ["--version"], { encoding: "utf8" });
        if (gitCheck.status !== 0) {
            return;
        }

        const sourceRepo = path.join(tempRoot, "spec-source-repo");
        fs.mkdirSync(sourceRepo, { recursive: true });

        const runGit = (args) =>
            spawnSync("git", args, {
                cwd: sourceRepo,
                encoding: "utf8",
            });

        const initRes = runGit(["init", "--initial-branch", "main"]);
        if (initRes.status !== 0) {
            assert.strictEqual(runGit(["init"]).status, 0);
            assert.strictEqual(runGit(["checkout", "-b", "main"]).status, 0);
        }

        const specRoot = path.join(sourceRepo, ".spec");
        const templatesDir = path.join(specRoot, "templates");
        const referencesDir = path.join(specRoot, "references");
        const profilesCodexDir = path.join(specRoot, "profiles", "codex");
        const profilesGeminiDir = path.join(specRoot, "profiles", "gemini");
        fs.mkdirSync(templatesDir, { recursive: true });
        fs.mkdirSync(referencesDir, { recursive: true });
        fs.mkdirSync(profilesCodexDir, { recursive: true });
        fs.mkdirSync(profilesGeminiDir, { recursive: true });

        fs.writeFileSync(path.join(templatesDir, "issues.template.csv"), "ID,状态\nX,未开始\n", "utf8");
        fs.writeFileSync(path.join(templatesDir, "driver-prompt.md"), "branch driver prompt", "utf8");
        fs.writeFileSync(path.join(templatesDir, "review-report.md"), "branch review report", "utf8");
        fs.writeFileSync(path.join(templatesDir, "phase-acceptance.md"), "branch acceptance", "utf8");
        fs.writeFileSync(path.join(templatesDir, "handoff.md"), "branch handoff", "utf8");

        fs.writeFileSync(path.join(referencesDir, "README.md"), "branch readme", "utf8");
        fs.writeFileSync(path.join(referencesDir, "harness-engineering-digest.md"), "branch digest", "utf8");
        fs.writeFileSync(path.join(referencesDir, "gda-framework.md"), "branch gda", "utf8");
        fs.writeFileSync(path.join(referencesDir, "cse-quickstart.md"), "branch quickstart", "utf8");

        fs.writeFileSync(path.join(profilesCodexDir, "AGENTS.spec.md"), "branch codex agents", "utf8");
        fs.writeFileSync(path.join(profilesCodexDir, "ling.spec.rules.md"), "branch codex rules", "utf8");
        fs.writeFileSync(path.join(profilesGeminiDir, "GEMINI.spec.md"), "branch gemini profile", "utf8");

        assert.strictEqual(runGit(["add", "."]).status, 0);
        assert.strictEqual(
            runGit(["-c", "user.name=ling-test", "-c", "user.email=ling-test@example.com", "commit", "-m", "spec assets"]).status,
            0,
        );

        const env = {
            LING_GLOBAL_ROOT: tempRoot,
            LING_REPO_URL: sourceRepo,
            LING_INDEX_PATH: path.join(tempRoot, "workspaces.json"),
        };

        const initResult = runCli(["spec", "init", "--path", workspaceRoot, "--branch", "main", "--quiet"], { env });
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        const installedPrompt = path.join(workspaceRoot, ".ling", "spec", "templates", "driver-prompt.md");
        assert.strictEqual(fs.readFileSync(installedPrompt, "utf8"), "branch driver prompt");

        const doctorResult = runCli(["spec", "doctor", "--path", workspaceRoot, "--quiet"], { env });
        assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "installed");
    });
});
