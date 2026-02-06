const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ag-kit.js");

function runCli(args, options = {}) {
    const env = {
        ...process.env,
        AG_KIT_SKIP_UPSTREAM_CHECK: "1",
        ...options.env,
    };

    return spawnSync(process.execPath, [CLI_PATH, ...args], {
        cwd: options.cwd || REPO_ROOT,
        env,
        encoding: "utf8",
    });
}

describe("CLI Smoke", () => {
    let tempDir;
    let workspaceDir;
    let indexPath;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-cli-test-"));
        workspaceDir = path.join(tempDir, "workspace");
        indexPath = path.join(tempDir, "workspaces.json");
        fs.mkdirSync(workspaceDir, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("doctor should work after codex init", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        const doctorResult = runCli(
            ["doctor", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
    });

    test("doctor --quiet should not print diagnostic details", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        const doctorResult = runCli(
            ["doctor", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(doctorResult.status, 0, doctorResult.stderr || doctorResult.stdout);
        assert.strictEqual((doctorResult.stdout || "").trim(), "");
    });

    test("doctor --fix should remove stale .codex directory", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        fs.mkdirSync(path.join(workspaceDir, ".codex"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".codex", "legacy.txt"), "legacy");
        assert.ok(fs.existsSync(path.join(workspaceDir, ".codex")));

        const doctorFixResult = runCli(
            ["doctor", "--target", "codex", "--path", workspaceDir, "--fix", "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(doctorFixResult.status, 0, doctorFixResult.stderr || doctorFixResult.stdout);
        assert.ok(!fs.existsSync(path.join(workspaceDir, ".codex")));
    });

    test("init should not index temporary workspace by default", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

        if (!fs.existsSync(indexPath)) {
            return;
        }

        const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        const hasWorkspace = (indexData.workspaces || []).some((item) => item.path === workspaceDir);
        assert.ok(!hasWorkspace, "temp workspace should not be persisted into global index");
    });

    test("codex init should create .agents managed directory", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);
        assert.ok(fs.existsSync(path.join(workspaceDir, ".agents")));
        assert.ok(!fs.existsSync(path.join(workspaceDir, ".codex")));
    });

    test("codex update should remove pre-existing legacy .codex directory", () => {
        const initResult = runCli(
            ["init", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);
        assert.ok(fs.existsSync(path.join(workspaceDir, ".agents")));
        fs.mkdirSync(path.join(workspaceDir, ".codex"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".codex", "legacy.txt"), "legacy");
        assert.ok(fs.existsSync(path.join(workspaceDir, ".codex")));

        const updateResult = runCli(
            ["update", "--target", "codex", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(updateResult.status, 0, updateResult.stderr || updateResult.stdout);
        assert.ok(!fs.existsSync(path.join(workspaceDir, ".codex")));
        assert.ok(fs.existsSync(path.join(workspaceDir, ".agents")));
    });

    test("update-all should auto-clean temp workspace records from index", () => {
        const now = new Date().toISOString();
        const tempWorkspacePath = path.join(os.tmpdir(), "ag-kit-indexed-temp", "workspace");
        const seedIndex = {
            version: 2,
            updatedAt: now,
            workspaces: [
                {
                    path: tempWorkspacePath,
                    targets: {
                        gemini: {
                            version: "2.0.1",
                            installedAt: now,
                            updatedAt: now,
                        },
                    },
                },
            ],
            excludedPaths: [],
        };
        fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

        const result = runCli(["update-all", "--quiet"], {
            env: { AG_KIT_INDEX_PATH: indexPath },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        const hasTempWorkspace = (indexData.workspaces || []).some((item) => item.path === tempWorkspacePath);
        assert.ok(!hasTempWorkspace, "temp workspace record should be removed during update-all");
    });

    test("update-all should auto-clean macOS /private/var temp alias records", () => {
        if (process.platform !== "darwin") {
            return;
        }

        const tmpRoot = os.tmpdir();
        let aliasTempPath = "";
        if (tmpRoot.startsWith("/var/")) {
            aliasTempPath = `/private${tmpRoot}/ag-kit-indexed-temp/workspace`;
        } else if (tmpRoot.startsWith("/private/var/")) {
            aliasTempPath = `${tmpRoot.replace(/^\/private/, "")}/ag-kit-indexed-temp/workspace`;
        } else {
            return;
        }

        const now = new Date().toISOString();
        const seedIndex = {
            version: 2,
            updatedAt: now,
            workspaces: [
                {
                    path: aliasTempPath,
                    targets: {
                        gemini: {
                            version: "2.0.1",
                            installedAt: now,
                            updatedAt: now,
                        },
                    },
                },
            ],
            excludedPaths: [],
        };
        fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

        const result = runCli(["update-all", "--quiet"], {
            env: { AG_KIT_INDEX_PATH: indexPath },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);

        const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        const hasAliasTempWorkspace = (indexData.workspaces || []).some((item) => item.path === aliasTempPath);
        assert.ok(!hasAliasTempWorkspace, "macOS alias temp path should be removed during update-all");
    });

    test("init in non-interactive mode should require explicit target", () => {
        const result = runCli(
            ["init", "--non-interactive", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /非交互模式下必须通过 --target 或 --targets 指定目标/);
    });

    test("update should run in gemini dry-run mode", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agent"), { recursive: true });

        const result = runCli(
            ["update", "--target", "gemini", "--path", workspaceDir, "--dry-run", "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("status should reject unsupported --no-index option", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agent"), { recursive: true });

        const result = runCli(
            ["status", "--path", workspaceDir, "--no-index"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /命令 status 不支持参数: --no-index/);
    });

    test("exclude list should reject unsupported --path option", () => {
        const result = runCli(
            ["exclude", "list", "--path", workspaceDir],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /命令 exclude list 不支持参数: --path/);
    });

    test("update-all should run in dry-run mode with indexed workspace", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agent"), { recursive: true });
        const now = new Date().toISOString();
        const seedIndex = {
            version: 2,
            updatedAt: now,
            workspaces: [
                {
                    path: workspaceDir,
                    targets: {
                        gemini: {
                            version: "2.0.1",
                            installedAt: now,
                            updatedAt: now,
                        },
                    },
                },
            ],
            excludedPaths: [],
        };
        fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

        const result = runCli(["update-all", "--dry-run", "--quiet"], {
            env: { AG_KIT_INDEX_PATH: indexPath },
        });
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("update-all should update installed target even when index target list is stale", () => {
        const localWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-update-all-stale-target-"));
        try {
            fs.mkdirSync(path.join(localWorkspace, ".codex"), { recursive: true });
            fs.writeFileSync(
                path.join(localWorkspace, ".codex", "manifest.json"),
                JSON.stringify({ version: 2, target: "codex", files: {} }),
                "utf8",
            );

            const now = new Date().toISOString();
            const seedIndex = {
                version: 2,
                updatedAt: now,
                workspaces: [
                    {
                        path: localWorkspace,
                        targets: {
                            gemini: {
                                version: "2.0.1",
                                installedAt: now,
                                updatedAt: now,
                            },
                        },
                    },
                ],
                excludedPaths: [],
            };
            fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

            const result = runCli(["update-all", "--targets", "codex", "--quiet"], {
                env: { AG_KIT_INDEX_PATH: indexPath },
            });
            assert.strictEqual(result.status, 0, result.stderr || result.stdout);

            const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            const record = (indexData.workspaces || []).find((item) => item.path === localWorkspace);
            assert.ok(record, "workspace should remain in index");
            assert.ok(record.targets && record.targets.codex, "codex target should be refreshed into index");
        } finally {
            fs.rmSync(localWorkspace, { recursive: true, force: true });
        }
    });

    test("init should respect --no-index on non-temp workspace", () => {
        const localWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-no-index-"));
        try {
            const initResult = runCli(
                ["init", "--target", "codex", "--path", localWorkspace, "--no-index", "--quiet"],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

            if (!fs.existsSync(indexPath)) {
                return;
            }

            const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            const hasWorkspace = (indexData.workspaces || []).some((item) => item.path === localWorkspace);
            assert.ok(!hasWorkspace, "--no-index should skip workspace registration");

            const updateResult = runCli(
                ["update", "--quiet"],
                { cwd: localWorkspace, env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(updateResult.status, 0, updateResult.stderr || updateResult.stdout);

            const indexAfterUpdate = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            const hasWorkspaceAfterUpdate = (indexAfterUpdate.workspaces || []).some((item) => item.path === localWorkspace);
            assert.ok(hasWorkspaceAfterUpdate, "local update without --no-index should re-register workspace");
        } finally {
            fs.rmSync(localWorkspace, { recursive: true, force: true });
        }
    });
});
