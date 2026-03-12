# 官方规则基线（2026-03-04）

> 本文只记录官方约定，不引入本仓库私有机制。证据见 `docs/official/sources-index.md`。

## Antigravity

官方文档：

- Skills：`/agent/skills.md`
- Rules / Workflows：`/agent/rules-workflows.md`
- Agent Modes / Settings：`/agent/agent-modes-settings.md`
- Strict Mode：`/agent/strict-mode.md`
- Sandboxing：`/agent/sandbox-mode.md`
- MCP：`/tools/mcp.md`

规则要点（按官方语义）：

1. Skills 以 `SKILL.md` 为核心，依赖描述触发并按需加载完整内容。
2. Rules 与 Workflows 是两套机制：规则用于行为约束，工作流用于步骤化执行。
3. Strict Mode 与 Sandboxing 分别约束访问边界和命令执行能力，可叠加使用。
4. MCP 通过 MCP Store / 配置入口接入外部能力，不等价于本地脚本直接执行。

## Codex

官方文档：

- Skills：`/codex/skills.md`
- Rules：`/codex/rules.md`
- AGENTS.md：`/codex/guides/agents-md.md`
- MCP：`/codex/mcp.md`
- Workflows：`/codex/workflows.md`
- Security：`/codex/security.md`

规则要点（按官方语义）：

1. Skills 约定 `name`、`description` 元信息，支持启停和目录扫描。
2. Rules 是命令审批规则体系（`.rules` / `prefix_rule` / 校验命令），用于控制高风险命令。
3. `AGENTS.md` 是项目级指令入口，支持分层发现与覆盖。
4. MCP 在 `config.toml` 配置，支持 stdio / streamable HTTP / OAuth 等模式。
5. Workflows 文档描述的是推荐用法范式，不等同于 Antigravity 的自定义 workflow 注册机制。
6. Security 定义审批策略、沙箱模式和网络访问边界。

## Gemini CLI

官方文档（仓库 `google-gemini/gemini-cli`）：

- `docs/cli/skills.md`
- `docs/cli/gemini-md.md`
- `docs/cli/plan-mode.md`
- `docs/core/subagents.md`
- `docs/core/remote-agents.md`
- `docs/tools/mcp-server.md`
- `docs/reference/policy-engine.md`

规则要点（按官方语义）：

1. Skills 支持发现、安装、启用/禁用与作用域管理（user/workspace）。
2. `gemini.md` 用于项目指令与上下文约束。
3. Plan Mode 是受限规划模式，可配合策略规则开放只读工具。
4. Subagents / Remote Agents 提供多代理协作能力，受实验特性与配置开关约束。
5. MCP Server 与 Policy Engine 联合定义工具接入和审批策略。

## 使用建议

1. 先看官方规则，再决定本仓库是否需要兼容层改动。
2. 文档更新先改 `sources-index.md`，再更新本文件的规则要点。
3. 若官方文档术语有歧义，保留英文术语并附中文解释，避免语义漂移。
