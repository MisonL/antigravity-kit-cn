# Full 模式资源映射规范

本文描述 v3 统一目录体系下的资源映射。

## 1. Canonical 与 Projection

- Canonical：`.agents/**`
- Projection：`.agent/**`、`.gemini/**`、根 `AGENTS.md`/`antigravity.rules` 托管区块

## 2. 关键映射规则

### 2.1 Skills
- Canonical 路径：`.agents/skills/<name>/SKILL.md`
- Antigravity 兼容：投影到 `.agent/skills/<name>/SKILL.md`
- Codex 兼容：直接读取 `.agents/skills/*`

### 2.2 Workflows
- Canonical 路径：`.agents/workflows/<name>.md`
- Codex 兼容增强：额外生成 `workflow-<name>` 的技能桥接（位于 `.agents/skills/`）

### 2.3 Agents
- Canonical 路径：`.agents/agents/*.md`
- Gemini 兼容：写入 `.gemini/agents/ag-kit-*.md`（追加模式，保留用户文件）

### 2.4 MCP
- Canonical：`.agents/mcp_config.json`
- Gemini 兼容：合并到 `.gemini/settings.json#mcpServers`
- Context7：同步 `context7` 与 `context7_backup`

## 3. 托管清单 manifest

`manifest.json`（v3）用于：
- 受管文件哈希校验
- 漂移检测
- 覆盖前冲突备份判定

示例：

```json
{
  "version": 3,
  "target": "full",
  "kitVersion": "3.0.0-beta.0",
  "files": {
    "skills/example/SKILL.md": {
      "hash": "sha256...",
      "source": "bundled:full/skills/example/SKILL.md"
    }
  }
}
```

## 4. Legacy 迁移边界

1. 托管 `.codex`：迁移到 `.agents` 后清理。
2. 非托管 `.codex`：保留不删。
3. `.agent`/`.gemini`：用于迁移输入或投影冲突处理，不作为主源。

## 5. 官方规则边界

- `antigravity.rules` 是本项目托管说明文件，不是 Codex 官方 `.rules`。
- Codex 官方审批规则仍在 `~/.codex/rules/default.rules`（参考 `docs/codex-rules-template.md`）。
