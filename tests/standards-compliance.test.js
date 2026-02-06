const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

function walkDirs(root) {
    const out = [];
    const stack = [root];
    while (stack.length > 0) {
        const current = stack.pop();
        if (!fs.existsSync(current)) continue;
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const abs = path.join(current, entry.name);
            if (entry.isDirectory()) {
                out.push(abs);
                stack.push(abs);
            }
        }
    }
    return out;
}

function collectTokens(content, regex) {
    const matches = content.match(regex);
    return new Set(matches || []);
}

describe('Standards Compliance', () => {
    test('all skill directories should include SKILL.md', () => {
        const skillsRoot = path.resolve('.agent/skills');
        assert.ok(fs.existsSync(skillsRoot), 'missing .agent/skills');

        const skillDirs = fs
            .readdirSync(skillsRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(skillsRoot, entry.name));

        for (const dir of skillDirs) {
            const skillMd = path.join(dir, 'SKILL.md');
            assert.ok(fs.existsSync(skillMd), `missing SKILL.md in ${path.relative(process.cwd(), dir)}`);
        }
    });

    test('deprecated .codex primary-layout wording should be removed from user-facing docs and generator', () => {
        const targets = [
            'README.md',
            'docs/operations.md',
            'docs/code-review-report.md',
            'bin/core/generator.js',
        ];

        for (const rel of targets) {
            const abs = path.resolve(rel);
            const content = fs.readFileSync(abs, 'utf8');
            assert.ok(!content.includes('Managed resources are synchronized under `.codex/`.'), `${rel} still contains deprecated .codex guidance`);
            assert.ok(!content.includes('Do not edit files under `.codex/` directly.'), `${rel} still contains deprecated .codex guidance`);
        }
    });

    test('critical mechanism tokens should remain aligned with reference snapshot', { skip: !fs.existsSync(path.resolve('reference/antigravity-kit')) }, () => {
        const refRoot = path.resolve('reference/antigravity-kit');
        const tokenRegex = /(ag-kit|python3?|checklist\.py|verify_all\.py|security_scan\.py|ux_audit\.py|accessibility_checker\.py|schema_validator\.py|lint_runner\.py|type_coverage\.py|playwright_runner\.py|lighthouse_audit\.py|api_validator\.py|mobile_audit\.py|seo_checker\.py|geo_checker\.py|i18n_checker\.py|\.agent\/|\.codex\/|AGENTS\.md|antigravity\.rules|manifest\.json|--target|--targets|--fix|--path|--no-index|--dry-run|--quiet|--force|\/brainstorm|\/create|\/debug|\/deploy|\/enhance|\/orchestrate|\/plan|\/preview|\/status|\/test|\/ui-ux-pro-max)/g;

        const markdownFiles = [];
        const stack = [refRoot];
        while (stack.length > 0) {
            const current = stack.pop();
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
                const abs = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    stack.push(abs);
                    continue;
                }
                if (/\.(md|mdx|txt)$/i.test(entry.name)) {
                    markdownFiles.push(abs);
                }
            }
        }

        const mismatches = [];
        for (const refFile of markdownFiles) {
            const rel = path.relative(refRoot, refFile);
            const localFile = path.resolve(rel);
            if (!fs.existsSync(localFile)) continue;

            const refTokens = collectTokens(fs.readFileSync(refFile, 'utf8'), tokenRegex);
            if (refTokens.size === 0) continue;
            const localTokens = collectTokens(fs.readFileSync(localFile, 'utf8'), tokenRegex);

            const missing = [...refTokens].filter((token) => !localTokens.has(token));
            if (missing.length > 0) {
                mismatches.push({ rel, missing });
            }
        }

        assert.strictEqual(
            mismatches.length,
            0,
            `critical mechanism tokens drifted:\n${mismatches
                .slice(0, 10)
                .map((item) => `${item.rel} -> ${item.missing.join(', ')}`)
                .join('\n')}`,
        );
    });

    test('.agent script files should stay identical to reference snapshot', { skip: !fs.existsSync(path.resolve('reference/antigravity-kit/.agent')) }, () => {
        const refScriptsRoot = path.resolve('reference/antigravity-kit/.agent');
        const mismatches = [];

        const stack = [refScriptsRoot];
        while (stack.length > 0) {
            const current = stack.pop();
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
                const abs = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    stack.push(abs);
                    continue;
                }
                if (!abs.includes(`${path.sep}scripts${path.sep}`)) continue;

                const rel = path.relative(refScriptsRoot, abs);
                const localFile = path.resolve('.agent', rel);
                if (!fs.existsSync(localFile)) {
                    mismatches.push(`${rel} (missing local file)`);
                    continue;
                }

                const refContent = fs.readFileSync(abs, 'utf8');
                const localContent = fs.readFileSync(localFile, 'utf8');
                if (refContent !== localContent) {
                    mismatches.push(rel);
                }
            }
        }

        assert.strictEqual(
            mismatches.length,
            0,
            `script content drifted:\n${mismatches.slice(0, 20).join('\n')}`,
        );
    });

    test('critical path handling should avoid hardcoded platform separators in managed paths', () => {
        const adapterFile = path.resolve('bin/adapters/codex.js');
        const content = fs.readFileSync(adapterFile, 'utf8');

        // Keep this focused on managed path constants that must remain path.join-driven.
        assert.ok(content.includes('path.join'), 'codex adapter should use path.join for managed paths');
        assert.ok(content.includes('os.tmpdir()'), 'codex adapter should use os.tmpdir() for temp paths');
    });

    test('official antigravity docs baselines should be present in localized pages', () => {
        const checks = [
            {
                file: 'web/src/app/docs/skills/page.tsx',
                required: [
                    'SKILL.md',
                    'workspace-root',
                    '~/.gemini/antigravity/skills',
                    'description',
                    'scripts/',
                    'examples/',
                    'resources/',
                    'Discovery',
                    'Activation',
                    'Execution',
                    '--help',
                ],
            },
            {
                file: 'web/src/app/docs/rules-workflows/page.tsx',
                required: [
                    '12,000',
                    '~/.gemini/GEMINI.md',
                    '.agent/rules',
                    'Manual',
                    'Always On',
                    'Model Decision',
                    'Glob',
                    '@filename',
                    '/workflow-name',
                ],
            },
            {
                file: 'web/src/app/docs/task-groups/page.tsx',
                required: ['规划模式', '总体目标', '已编辑文件', '待处理区'],
            },
            {
                file: 'web/src/app/docs/strict-mode/page.tsx',
                required: ['Allowlist/Denylist', 'Request Review', '.gitignore', '工作区隔离'],
            },
            {
                file: 'web/src/app/docs/sandbox-mode/page.tsx',
                required: [
                    'sandbox-exec',
                    'Enable Terminal Sandboxing',
                    'Sandbox Allow Network',
                    'Bypass Sandbox',
                    'Strict Mode',
                ],
            },
            {
                file: 'web/src/app/docs/mcp/page.tsx',
                required: [
                    'Model Context Protocol',
                    'MCP Store',
                    'Manage MCP Servers',
                    'View raw config',
                    'mcp_config.json',
                ],
            },
            {
                file: 'web/src/app/docs/command/page.tsx',
                required: ['Command + I', 'Ctrl + I'],
            },
            {
                file: 'web/src/app/docs/allowlist-denylist/page.tsx',
                required: ['BadUrlsChecker', 'always allow', 'localhost'],
            },
            {
                file: 'web/src/app/docs/browser-subagent/page.tsx',
                required: ['DOM 捕获', '截图', '蓝色边框'],
            },
        ];

        const missing = [];
        for (const { file, required } of checks) {
            const abs = path.resolve(file);
            const content = fs.readFileSync(abs, 'utf8');
            for (const token of required) {
                if (!content.includes(token)) {
                    missing.push(`${file} -> ${token}`);
                }
            }
        }

        assert.strictEqual(
            missing.length,
            0,
            `localized docs missing official baseline tokens:\n${missing.join('\n')}`,
        );
    });
});
