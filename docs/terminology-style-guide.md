# 术语风格统一表

本表用于约束仓库内中文文案写法，目标是“中文叙述、专有名词英文保留、术语稳定”。

## 写法规则

1. 专有名词英文保留：官方名词优先保留英文（如 `Agent`、`Strict Mode`、`Task List`）。
2. 中文作解释：需要降低理解门槛时使用 `中文（English）`，但不要反过来“强翻主词”。
3. 保留关键字：命令、参数、路径、快捷键、按钮文案保持原样（如 `--fix`、`/workflow-name`、`Command + I`）。
4. 语义优先：不改变机制、不改变行为，仅调整语言表述。

## 统一术语

| 推荐写法 | 可接受别名（仅历史兼容） | 说明 |
| --- | --- | --- |
| Agent（智能体） | 智能体 | 平台执行主体 |
| Skill（技能） | Skills、技能 | 能力模块 |
| Workflow（工作流） | Workflows、工作流 | 任务流程 |
| 工作区（Workspace） | 工作空间 | 项目作用域 |
| 全局（Global） | Global | 跨工作区作用域 |
| Allowlist（允许列表） | 允许列表 | 白名单语义 |
| Denylist（拒绝列表） | 拒绝列表 | 黑名单语义 |
| Strict Mode（严格模式） | Strict Mode | 安全策略组合 |
| Sandboxing（终端沙箱） | Sandboxing | 命令执行隔离 |
| Artifact（产物） | Artifacts、产物 | 过程与结果载体 |
| Command（命令面板） | Command | 内联指令入口 |
| MCP Store（MCP 商店） | MCP Store | MCP 连接入口 |
| Browser Subagent（浏览器子智能体） | Browser Subagent | 浏览器操作代理 |
| Task List（任务清单） | Task List | 任务追踪产物 |
| Implementation Plan（实施计划） | Implementation Plan | 计划产物 |
| Knowledge（知识库） | Knowledge | 持久化知识能力 |

## 本轮覆盖范围

- `web/src/app/docs/**/page.tsx`
- `web/src/components/docs/sidebar.tsx`
- `.agent/rules/GEMINI.md`
- `docs/operations.md`

后续新增文档默认遵循本表。
