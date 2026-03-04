const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const CLI_PATH = path.join(REPO_ROOT, "bin", "ag-kit.js");
const PROJECTION_MARKER = ".ag-kit-projection.json";

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

function writeManagedProjectionMarker(workspaceDir, dirName, type) {
    const projectionDir = path.join(workspaceDir, dirName);
    fs.mkdirSync(projectionDir, { recursive: true });
    const markerPath = path.join(projectionDir, PROJECTION_MARKER);
    fs.writeFileSync(markerPath, `${JSON.stringify({
        managedBy: "ag-kit-cn",
        type,
        version: "test",
        generatedAt: new Date().toISOString(),
    }, null, 2)}\n`, "utf8");
}

describe("CLI Smoke", () => {
    let tempDir;
    let workspaceDir;
    let indexPath;
    let migrationStatePath;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ag-kit-cli-test-"));
        workspaceDir = path.join(tempDir, "workspace");
        indexPath = path.join(tempDir, "workspaces.json");
        migrationStatePath = path.join(tempDir, "migration-v3.json");
        process.env.AG_KIT_MIGRATION_STATE_PATH = migrationStatePath;
        fs.mkdirSync(workspaceDir, { recursive: true });
    });

    afterEach(() => {
        delete process.env.AG_KIT_MIGRATION_STATE_PATH;
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

    test("doctor --fix should keep non-managed .codex directory", () => {
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
        assert.ok(fs.existsSync(path.join(workspaceDir, ".codex")));
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

    test("codex update should keep pre-existing non-managed .codex directory", () => {
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
        assert.ok(fs.existsSync(path.join(workspaceDir, ".codex")));
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

    test("init in non-interactive mode should default to full mode", () => {
        const result = runCli(
            ["init", "--non-interactive", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
        assert.ok(fs.existsSync(path.join(workspaceDir, ".agents")));
    });

    test("update should run in gemini dry-run mode", () => {
        writeManagedProjectionMarker(workspaceDir, ".agent", "agent");

        const result = runCli(
            ["update", "--target", "gemini", "--path", workspaceDir, "--dry-run", "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("update should accept --non-interactive option", () => {
        writeManagedProjectionMarker(workspaceDir, ".agent", "agent");

        const result = runCli(
            ["update", "--target", "gemini", "--non-interactive", "--path", workspaceDir, "--dry-run", "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    });

    test("update should fail when only non-managed .agent exists", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agent"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".agent", "custom.md"), "# custom agent config\n", "utf8");

        const result = runCli(
            ["update", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
    });

    test("update should fail when .agent has legacy-like files but no managed evidence", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agent", "skills"), { recursive: true });
        fs.mkdirSync(path.join(workspaceDir, ".agent", "rules"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".agent", "skills", "doc.md"), "# legacy skill\n", "utf8");
        fs.writeFileSync(path.join(workspaceDir, ".agent", "rules", "GEMINI.md"), "# legacy rule\n", "utf8");

        const result = runCli(
            ["update", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
    });

    test("update should fail when only non-managed .gemini exists", () => {
        fs.mkdirSync(path.join(workspaceDir, ".gemini"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".gemini", "settings.json"), JSON.stringify({ theme: "custom" }));

        const result = runCli(
            ["update", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
    });

    test("update should fail when non-managed .gemini has context7 settings only", () => {
        fs.mkdirSync(path.join(workspaceDir, ".gemini"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".gemini", "settings.json"), JSON.stringify({
            mcpServers: {
                context7: {
                    command: "npx",
                    args: ["-y", "@upstash/context7-mcp"],
                },
            },
        }), "utf8");

        const result = runCli(
            ["update", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
    });

    test("update should fail when .agents exists without managed manifest", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agents"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".agents", "custom.txt"), "user managed\n", "utf8");

        const result = runCli(
            ["update", "--path", workspaceDir, "--quiet"],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
    });

    test("status should fail when .agents exists without managed manifest", () => {
        fs.mkdirSync(path.join(workspaceDir, ".agents"), { recursive: true });
        fs.writeFileSync(path.join(workspaceDir, ".agents", "custom.txt"), "user managed\n", "utf8");

        const result = runCli(
            ["status", "--path", workspaceDir],
            { env: { AG_KIT_INDEX_PATH: indexPath } },
        );
        assert.notStrictEqual(result.status, 0);
        assert.match(result.stderr || result.stdout, /未检测到 Antigravity Kit 安装/);
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
        writeManagedProjectionMarker(workspaceDir, ".agent", "agent");
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
            assert.ok(record.targets && record.targets.full, "full target should be refreshed into index");
        } finally {
            fs.rmSync(localWorkspace, { recursive: true, force: true });
        }
    });

    test("init should auto-migrate indexed managed legacy workspace once", () => {
        const legacyWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-auto-migrate-"));
        const triggerWorkspace = path.join(tempDir, "trigger-workspace");
        const triggerWorkspace2 = path.join(tempDir, "trigger-workspace-2");
        try {
            fs.mkdirSync(triggerWorkspace, { recursive: true });
            fs.mkdirSync(triggerWorkspace2, { recursive: true });
            writeManagedProjectionMarker(legacyWorkspace, ".agent", "agent");
            fs.writeFileSync(path.join(legacyWorkspace, ".agent", "legacy.md"), "# legacy\n", "utf8");

            const now = new Date().toISOString();
            const seedIndex = {
                version: 2,
                updatedAt: now,
                workspaces: [
                    {
                        path: legacyWorkspace,
                        targets: {},
                    },
                ],
                excludedPaths: [],
            };
            fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

            const first = runCli(
                ["init", "--path", triggerWorkspace, "--quiet"],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(first.status, 0, first.stderr || first.stdout);
            assert.ok(fs.existsSync(path.join(legacyWorkspace, ".agents", "manifest.json")), "legacy workspace should be migrated");

            const state = JSON.parse(fs.readFileSync(migrationStatePath, "utf8"));
            const migrationEntries = Object.values(state.migratedWorkspaces || {});
            assert.ok(migrationEntries.some((entry) => entry && entry.path === legacyWorkspace), "migration state should record legacy workspace");

            const sentinel = path.join(legacyWorkspace, ".agents", "sentinel.txt");
            fs.writeFileSync(sentinel, "keep\n", "utf8");

            const second = runCli(
                ["init", "--path", triggerWorkspace2, "--quiet"],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(second.status, 0, second.stderr || second.stdout);
            assert.ok(fs.existsSync(sentinel), "auto migration should run once per workspace");

            const statusResult = runCli(
                ["status", "--path", legacyWorkspace],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(statusResult.status, 0, statusResult.stderr || statusResult.stdout);
            assert.match(statusResult.stdout, /Auto-Migration\(v3\): done/);
        } finally {
            fs.rmSync(legacyWorkspace, { recursive: true, force: true });
        }
    });

    test("init should keep migrating other workspaces when one auto-migration target fails", () => {
        if (process.platform === "win32") {
            return;
        }

        const successWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-auto-migrate-success-"));
        const failedWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-auto-migrate-failed-"));
        const triggerWorkspace = path.join(tempDir, "trigger-workspace-partial-failure");
        let originalMode = null;

        try {
            fs.mkdirSync(triggerWorkspace, { recursive: true });

            writeManagedProjectionMarker(successWorkspace, ".agent", "agent");
            fs.writeFileSync(path.join(successWorkspace, ".agent", "legacy.md"), "# legacy success\n", "utf8");

            writeManagedProjectionMarker(failedWorkspace, ".agent", "agent");
            fs.writeFileSync(path.join(failedWorkspace, ".agent", "legacy.md"), "# legacy failed\n", "utf8");

            originalMode = fs.statSync(failedWorkspace).mode & 0o777;
            fs.chmodSync(failedWorkspace, 0o555);

            const now = new Date().toISOString();
            const seedIndex = {
                version: 2,
                updatedAt: now,
                workspaces: [
                    { path: successWorkspace, targets: {} },
                    { path: failedWorkspace, targets: {} },
                ],
                excludedPaths: [],
            };
            fs.writeFileSync(indexPath, `${JSON.stringify(seedIndex, null, 2)}\n`, "utf8");

            const result = runCli(
                ["init", "--path", triggerWorkspace, "--quiet"],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(result.status, 0, result.stderr || result.stdout);

            assert.ok(fs.existsSync(path.join(successWorkspace, ".agents", "manifest.json")), "success workspace should still be migrated");
            assert.ok(!fs.existsSync(path.join(failedWorkspace, ".agents", "manifest.json")), "failed workspace should not be marked as migrated");

            const state = JSON.parse(fs.readFileSync(migrationStatePath, "utf8"));
            const entries = Object.values(state.migratedWorkspaces || {});
            assert.ok(entries.some((entry) => entry && entry.path === successWorkspace && entry.status === "migrated"));
            assert.ok(!entries.some((entry) => entry && entry.path === failedWorkspace), "failed workspace should not be persisted as done");
        } finally {
            if (originalMode !== null) {
                try {
                    fs.chmodSync(failedWorkspace, originalMode);
                } catch (_err) {
                    // ignore chmod restore error in cleanup
                }
            }
            fs.rmSync(successWorkspace, { recursive: true, force: true });
            fs.rmSync(failedWorkspace, { recursive: true, force: true });
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

    test("init should skip indexing toolkit source-like workspace by package name", () => {
        const toolkitWorkspace = fs.mkdtempSync(path.join(REPO_ROOT, ".tmp-ag-kit-toolkit-source-"));
        try {
            fs.mkdirSync(path.join(toolkitWorkspace, "bin"), { recursive: true });
            fs.writeFileSync(
                path.join(toolkitWorkspace, "package.json"),
                JSON.stringify({ name: "@mison/ag-kit-cn", version: "2.0.1" }, null, 2),
                "utf8",
            );
            fs.writeFileSync(path.join(toolkitWorkspace, "bin", "ag-kit.js"), "#!/usr/bin/env node\n", "utf8");

            const initResult = runCli(
                ["init", "--target", "gemini", "--path", toolkitWorkspace, "--quiet"],
                { env: { AG_KIT_INDEX_PATH: indexPath } },
            );
            assert.strictEqual(initResult.status, 0, initResult.stderr || initResult.stdout);

            if (!fs.existsSync(indexPath)) {
                return;
            }

            const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
            const hasWorkspace = (indexData.workspaces || []).some((item) => item.path === toolkitWorkspace);
            assert.ok(!hasWorkspace, "toolkit source-like workspace should be excluded from index");
        } finally {
            fs.rmSync(toolkitWorkspace, { recursive: true, force: true });
        }
    });
});
