# 官方文档本地归档

本目录用于保存官方规范文档的本地快照，作为本仓库在 Antigravity + Codex 双适配时的对照基线。

- 归档时间：2026-02-12
- 归档方式：先抓取官方源，再整理为中文 Markdown 版本（不改机制语义）

## Antigravity

- `docs/official/antigravity/agent-modes-settings.md`
  - 来源：`https://antigravity.google/docs/agent-modes-settings`
  - 抓取源：`https://antigravity.google/assets/docs/agent/agent-modes-settings.md`
- `docs/official/antigravity/rules-workflows.md`
  - 来源：`https://antigravity.google/docs/rules-workflows`
  - 抓取源：`https://antigravity.google/assets/docs/agent/rules-workflows.md`
- `docs/official/antigravity/skills.md`
  - 来源：`https://antigravity.google/docs/skills`
  - 抓取源：`https://antigravity.google/assets/docs/agent/skills.md`

## Codex

- `docs/official/codex/config-basic.md`
  - 来源：`https://developers.openai.com/codex/config-basic`
  - 抓取源：`https://developers.openai.com/codex/config-basic.md`
- `docs/official/codex/config-advanced.md`
  - 来源：`https://developers.openai.com/codex/config-advanced`
  - 抓取源：`https://developers.openai.com/codex/config-advanced.md`
- `docs/official/codex/config-reference.md`
  - 来源：`https://developers.openai.com/codex/config-reference`
  - 抓取源：`https://developers.openai.com/codex/config-reference.md`
- `docs/official/codex/config-sample.md`
  - 来源：`https://developers.openai.com/codex/config-sample`
  - 抓取源：`https://developers.openai.com/codex/config-sample.md`
- `docs/official/codex/rules.md`
  - 来源：`https://developers.openai.com/codex/rules`
  - 抓取源：`https://developers.openai.com/codex/rules.md`
- `docs/official/codex/agents-md.md`
  - 来源：`https://developers.openai.com/codex/guides/agents-md`
  - 抓取源：`https://developers.openai.com/codex/guides/agents-md.md`
- `docs/official/codex/mcp.md`
  - 来源：`https://developers.openai.com/codex/mcp`
  - 抓取源：`https://developers.openai.com/codex/mcp.md`
- `docs/official/codex/skills.md`
  - 来源：`https://developers.openai.com/codex/skills`
  - 抓取源：`https://developers.openai.com/codex/skills.md`

## 更新建议

后续更新时，优先覆盖本目录快照，再做差异评审：

1. 对比上次归档与新版官方文档差异。
2. 若差异影响本仓库机制，再同步到 `docs/`、`.agent/` 相关规范文档。
