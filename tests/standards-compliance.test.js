const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const REF_ROOT = path.resolve('reference/antigravity-kit');
const REF_AGENTS_ROOT = path.resolve('reference/antigravity-kit/.agents');
const REF_LEGACY_AGENT_ROOT = path.resolve('reference/antigravity-kit/.agent');
const REF_SCRIPTS_ROOT = fs.existsSync(REF_AGENTS_ROOT) ? REF_AGENTS_ROOT : REF_LEGACY_AGENT_ROOT;
const HAS_REF_SCRIPTS_ROOT = fs.existsSync(REF_SCRIPTS_ROOT);

function collectTokens(content, regex) {
    const tokens = new Set();
    for (const match of String(content || "").matchAll(regex)) {
        tokens.add(match[1] || match[0]);
    }
    return tokens;
}

function collectFiles(rootDir, matcher) {
    const matches = [];
    const stack = [rootDir];
    while (stack.length > 0) {
        const current = stack.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const abs = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(abs);
                continue;
            }
            if (matcher(abs)) {
                matches.push(abs);
            }
        }
    }
    return matches.sort();
}

describe('Standards Compliance', () => {
    test('all skill directories should include SKILL.md', () => {
        const skillsRoot = path.resolve('.agents/skills');
        assert.ok(fs.existsSync(skillsRoot), 'missing .agents/skills');

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
            'docs/PLAN.md',
            'docs/TECH.md',
            'bin/core/generator.js',
        ];
        const skipped = [];

        for (const rel of targets) {
            const abs = path.resolve(rel);
            if (!fs.existsSync(abs)) {
                skipped.push(rel);
                continue;
            }
            const content = fs.readFileSync(abs, 'utf8');
            assert.ok(!content.includes('Managed resources are synchronized under `.codex/`.'), `${rel} still contains deprecated .codex guidance`);
            assert.ok(!content.includes('Do not edit files under `.codex/` directly.'), `${rel} still contains deprecated .codex guidance`);
        }

        if (skipped.length > 0) {
            console.warn(`[standards-compliance] skipped missing optional files: ${skipped.join(', ')}`);
        }
    });

    test('critical mechanism tokens should remain aligned with reference snapshot', { skip: !fs.existsSync(REF_ROOT) }, () => {
        const refRoot = REF_ROOT;
        const tokenRegex = /(ling|python3?|checklist\.py|verify_all\.py|security_scan\.py|ux_audit\.py|accessibility_checker\.py|schema_validator\.py|lint_runner\.py|type_coverage\.py|playwright_runner\.py|lighthouse_audit\.py|api_validator\.py|mobile_audit\.py|seo_checker\.py|geo_checker\.py|i18n_checker\.py|\.agent\/|\.agents\/|\.agents-backup\/|\.codex\/|AGENTS\.md|antigravity\.rules|ling\.rules|manifest\.json|--target|--targets|--fix|--path|--no-index|--dry-run|--quiet|--force)/g;
        const slashCommandRegex = /(?:^|[\s`"'(\[])(\/(?:brainstorm|create|debug|deploy|enhance|orchestrate|plan|preview|status|test|ui-ux-pro-max))(?=$|[\s`"'，。,.:：)\]])/gm;

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

            const refContent = fs.readFileSync(refFile, 'utf8');
            const refTokens = new Set([
                ...collectTokens(refContent, tokenRegex),
                ...collectTokens(refContent, slashCommandRegex),
            ]);
            if (refTokens.size === 0) continue;

            const localContent = fs.readFileSync(localFile, 'utf8');
            const localTokens = new Set([
                ...collectTokens(localContent, tokenRegex),
                ...collectTokens(localContent, slashCommandRegex),
            ]);

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

    test('user-facing docs should track current repo and global skill locations', () => {
        const file = path.resolve('docs/TECH.md');
        const content = fs.readFileSync(file, 'utf8');

        assert.ok(content.includes('$HOME/.codex/skills/'), 'missing global skill path: $HOME/.codex/skills/');
        assert.ok(content.includes('$HOME/.gemini/skills/'), 'missing global skill path: $HOME/.gemini/skills/');
        assert.ok(content.includes('$HOME/.gemini/antigravity/skills/'), 'missing global skill path: $HOME/.gemini/antigravity/skills/');
        assert.ok(content.includes('.agents/skills'), 'missing repo skill path: .agents/skills');
        assert.ok(!content.includes('$HOME/.agents/skills/'), 'should not contain deprecated global path: $HOME/.agents/skills/');
    });

    test('.agents script files should stay identical to reference snapshot', { skip: !HAS_REF_SCRIPTS_ROOT }, () => {
        const refScriptsRoot = REF_SCRIPTS_ROOT;
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
                if (abs.includes(`${path.sep}__pycache__${path.sep}`) || abs.endsWith('.pyc')) continue;

                const rel = path.relative(refScriptsRoot, abs);
                const localFile = path.resolve('.agents', rel);
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

    test('cli and maintenance scripts should avoid emoji output markers', () => {
        const targetFiles = [
            ...collectFiles(path.resolve('bin'), (abs) => abs.endsWith('.js')),
            ...collectFiles(path.resolve('scripts'), (abs) => abs.endsWith('.js')),
        ];
        const emojiRegex = /[\u{2600}-\u{27BF}\u{1F300}-\u{1FAFF}]/u;
        const offenders = [];

        for (const file of targetFiles) {
            const content = fs.readFileSync(file, 'utf8');
            if (emojiRegex.test(content)) {
                offenders.push(path.relative(process.cwd(), file));
            }
        }

        assert.deepStrictEqual(offenders, [], `cli/script files should not contain emoji markers:\n${offenders.join('\n')}`);
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
