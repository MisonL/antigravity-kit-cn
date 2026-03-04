# 体系兼容审查（2026-03-04）

## 审查范围

- `skills / agents / workflows / rules / mcp` 机制一致性与可执行性
- 对照官方来源：
  - Antigravity 资产文档
  - Codex 官方文档（含 `skills/rules/agents-md/mcp/workflows/security`）
  - Gemini CLI 官方仓库文档（含 `skills/plan-mode/subagents/mcp-server/policy-engine/gemini-md`）

## 结论（摘要）

1. 本仓库当前机制可用，核心流程与官方规则方向兼容。
2. 先前存在的关键一致性问题已修复（见下节），回归测试通过。
3. 仍存在“产品策略差异”而非 bug：本仓库 `gemini` 目标采用 `.agent` 结构，不是 Gemini CLI 原生 `.gemini` 目录体系，属于兼容层设计取舍。

## 本次已修复项

1. Codex 完整性检查漏报：`manifest.json` 非法 JSON 现在会标记为 `broken`。
2. Gemini 完整性检查过宽：空 `.agent` 不再判定 `ok`，会校验关键目录与文件。
3. 规则路径错误：`GEMINI.md` 中设计 Agent 路径改为 `.agent/agents/...`。
4. Agent 引用失配：移除不存在的 `api-designer` 引用，能力并入 `backend-specialist` 描述。
5. Skill 交叉引用失效：替换不存在的 skill 引用为仓库内实际存在的 skill。
6. workflow 引用失效：`conversation-manager` 改为现有 `brainstorming`。
7. MCP 示例安全性：`context7` 官方通道改为环境变量注入 API Key，并新增 `context7_backup` 备用通道。
8. 官方证据索引更新：Gemini CLI 仓库最新推送时间更新至 `2026-03-04T02:20:00Z`。

## 当前建议关注

1. 若目标是“与 Gemini CLI 原生机制完全同构”，需要单独规划 `.gemini` 目录与策略引擎对齐方案。
2. `context7_backup` 可用性建议后续做一次端到端联通性验证（网络/无 key/服务异常场景）。

## 验证结果

- `bun run test`：`63/63` 通过。
- `bun run health-check`：通过。
