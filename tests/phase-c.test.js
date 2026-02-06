const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const CodexAdapter = require('../bin/adapters/codex');

describe('Phase C Integration', () => {
    let workDir;
    let geminiRepo;

    beforeEach(() => {
        workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase-c-test-'));
        geminiRepo = path.join(workDir, 'gemini-repo');
        
        // Setup specialized Gemini-like structure
        const agentDir = path.join(geminiRepo, '.agent');
        const skillsDir = path.join(agentDir, 'skills');
        const workflowsDir = path.join(agentDir, 'workflows');
        
        fs.mkdirSync(skillsDir, { recursive: true });
        fs.mkdirSync(workflowsDir, { recursive: true });
        
        // Create a Skill
        const skillPath = path.join(skillsDir, 'test-skill');
        fs.mkdirSync(skillPath);
        fs.writeFileSync(path.join(skillPath, 'SKILL.md'), '# Test Skill');
        
        // Create a Workflow
        fs.writeFileSync(path.join(workflowsDir, 'test-flow.md'), '# Test Workflow');
    });

    afterEach(() => {
        fs.rmSync(workDir, { recursive: true, force: true });
    });

    test('CodexAdapter should build from Gemini structure on the fly', () => {
        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);
        
        // Install from Gemini Repo Root
        adapter.install(geminiRepo);
        
        const codexDir = path.join(workDir, '.agents');
        // Verification 1: Structure Created
        assert.ok(fs.existsSync(codexDir));
        
        // Verification 2: Transformation Happened
        const builtSkill = path.join(codexDir, 'skills', 'test-skill', 'SKILL.md');
        assert.ok(fs.existsSync(builtSkill));
        
        // Workflow: workflow-test-flow
        const builtWorkflow = path.join(codexDir, 'skills', 'workflow-test-flow', 'SKILL.md');
        assert.ok(fs.existsSync(builtWorkflow));
        
        // Verification 3: Manifest & Meta
        assert.ok(fs.existsSync(path.join(codexDir, 'codex.json')));
        assert.ok(fs.existsSync(path.join(codexDir, 'AGENTS.md')));
        assert.ok(fs.existsSync(path.join(codexDir, 'antigravity.rules')));
        
        const agentsMd = fs.readFileSync(path.join(codexDir, 'AGENTS.md'), 'utf8');
        assert.ok(agentsMd.includes('test-skill'));
        assert.ok(agentsMd.includes('(Codex Managed)'));

        // Verification 4: Workspace managed block injection
        const workspaceAgents = fs.readFileSync(path.join(workDir, 'AGENTS.md'), 'utf8');
        const workspaceRules = fs.readFileSync(path.join(workDir, 'antigravity.rules'), 'utf8');
        assert.ok(workspaceAgents.includes('BEGIN AG-KIT MANAGED BLOCK: codex-core-rules'));
        assert.ok(workspaceAgents.includes('test-skill'));
        assert.ok(workspaceRules.includes('BEGIN AG-KIT MANAGED BLOCK: codex-risk-controls'));
    });

    test('CodexBuilder should avoid ID collisions between skills and workflows', () => {
        const skillCollisionPath = path.join(geminiRepo, '.agent', 'skills', 'wf-test-flow');
        fs.mkdirSync(skillCollisionPath, { recursive: true });
        fs.writeFileSync(path.join(skillCollisionPath, 'SKILL.md'), '# Skill wf-test-flow');

        const options = { quiet: true, force: true };
        const adapter = new CodexAdapter(workDir, options);
        adapter.install(geminiRepo);

        const codexJson = JSON.parse(
            fs.readFileSync(path.join(workDir, '.agents', 'codex.json'), 'utf8')
        );
        const collisionEntries = (codexJson.skills || []).filter(
            (item) => item.originalName === 'wf-test-flow' || item.originalName === 'test-flow'
        );

        assert.strictEqual(collisionEntries.length, 2, 'skill/workflow should both be preserved');
        assert.notStrictEqual(
            collisionEntries[0].id,
            collisionEntries[1].id,
            'colliding IDs should be disambiguated',
        );

        for (const entry of collisionEntries) {
            const skillFile = path.join(workDir, '.agents', entry.path);
            assert.ok(fs.existsSync(skillFile), `missing transformed file: ${entry.path}`);
        }
    });
});
