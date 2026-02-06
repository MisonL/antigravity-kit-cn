const { test, describe } = require('node:test');
const assert = require('node:assert');
const RuleGenerator = require('../bin/core/generator');

describe('RuleGenerator', () => {
    test('generate should keep codex managed guidance on .agents layout', () => {
        const transformResult = {
            metadata: [
                {
                    id: 'test-skill',
                    originalName: 'test-skill',
                    path: 'skills/test-skill/SKILL.md',
                    type: 'skill',
                },
            ],
        };

        const { agentsMd, antigravityRules, codexJson } = RuleGenerator.generate(transformResult, '2.0.1');

        assert.ok(agentsMd.includes('test-skill'));
        assert.ok(agentsMd.includes('ag-kit doctor --target codex --fix'));
        assert.ok(agentsMd.includes('.agents/skills'));

        assert.ok(antigravityRules.includes('Managed skills are stored under `.agents/skills`.'));
        assert.ok(!antigravityRules.includes('.codex'));

        assert.strictEqual(codexJson.version, '2.0.1');
        assert.strictEqual(codexJson.skills.length, 1);
        assert.strictEqual(codexJson.skills[0].id, 'test-skill');
    });

    test('generate should work with empty metadata', () => {
        const transformResult = { metadata: [] };
        const { agentsMd, antigravityRules, codexJson } = RuleGenerator.generate(transformResult, '2.0.1');

        assert.ok(agentsMd.includes('Codex Managed'));
        assert.ok(antigravityRules.includes('Antigravity Risk Controls'));
        assert.deepStrictEqual(codexJson.skills, []);
    });
});
