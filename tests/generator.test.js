const { test, describe } = require('node:test');
const assert = require('node:assert');
const RuleGenerator = require('../bin/core/generator');

describe('RuleGenerator', () => {
    test('generate should keep codex managed guidance and remove legacy .agents wording', () => {
        const transformResult = {
            metadata: [
                {
                    id: 'agk-test-skill',
                    originalName: 'test-skill',
                    path: 'skills/agk-test-skill/SKILL.md',
                    type: 'skill',
                },
            ],
        };

        const { agentsMd, antigravityRules, codexJson } = RuleGenerator.generate(transformResult, '2.0.1');

        assert.ok(agentsMd.includes('agk-test-skill'));
        assert.ok(agentsMd.includes('ag-kit doctor --target codex --fix'));
        assert.ok(!agentsMd.includes('.agents'));

        assert.ok(antigravityRules.includes('Do not edit files under `.codex/` directly.'));
        assert.ok(!antigravityRules.includes('.agents'));

        assert.strictEqual(codexJson.version, '2.0.1');
        assert.strictEqual(codexJson.skills.length, 1);
        assert.strictEqual(codexJson.skills[0].id, 'agk-test-skill');
    });

    test('generate should work with empty metadata', () => {
        const transformResult = { metadata: [] };
        const { agentsMd, antigravityRules, codexJson } = RuleGenerator.generate(transformResult, '2.0.1');

        assert.ok(agentsMd.includes('Codex Managed'));
        assert.ok(antigravityRules.includes('Antigravity Risk Controls'));
        assert.deepStrictEqual(codexJson.skills, []);
    });
});
