# 术语风格统一表

本表用于约束仓库内中文文案写法，目标是“中文主叙述、术语级双语、机制文本不变形”。

## 写法规则

1. 中文主叙述：标题、段落、表头、说明文本默认使用中文表达。
2. 专有名词英文保留：官方名词优先保留英文（如 `Agent`、`Strict Mode`、`Task List`）。
3. 首次双语标注（仅术语级）：同一文档首次出现时写作 `English（中文）`，后续可简写为 `English`。
4. 禁止标题整句双语：禁止 `中文标题 (English sentence...)` 或 `English title (中文整句...)`。
5. 禁止段落整句双语：禁止“英文整句 + 中文整句括号翻译”并排出现。
6. 保留关键字：命令、参数、路径、快捷键、按钮文案保持原样（如 `--fix`、`/workflow-name`、`Command + I`）。
7. 机制文本例外：代码块、命令块、Frontmatter key、配置键名不做双语拼接。
8. 示例命令含提示词时：仅翻译提示词语义（prompt/query），命令结构保持不变。
9. 语义优先：不改变机制、不改变行为，仅调整语言表述。

## 统一术语

| 推荐写法 | 可接受别名（仅历史兼容） | 说明 |
| --- | --- | --- |
| Agent（智能体） | 智能体 | 平台执行主体；首现必须双语 |
| Skill（技能） | Skills、技能 | 能力模块；首现必须双语 |
| Workflow（工作流） | Workflows、工作流 | 任务流程；首现必须双语 |
| 工作区（Workspace） | 工作空间 | 项目作用域 |
| 全局（Global） | Global | 跨工作区作用域 |
| Allowlist（允许列表） | 允许列表 | 白名单语义 |
| Denylist（拒绝列表） | 拒绝列表 | 黑名单语义 |
| Strict Mode（严格模式） | Strict Mode | 安全策略组合；首现必须双语 |
| Sandboxing（终端沙箱） | Sandboxing | 命令执行隔离；首现必须双语 |
| Artifact（产物） | Artifacts、产物 | 过程与结果载体；首现必须双语 |
| Command（命令面板） | Command | 内联指令入口；首现必须双语 |
| MCP Store（MCP 商店） | MCP Store | MCP 连接入口；首现必须双语 |
| Browser Subagent（浏览器子智能体） | Browser Subagent | 浏览器操作代理；首现必须双语 |
| Task List（任务清单） | Task List | 任务追踪产物；首现必须双语 |
| Implementation Plan（实施计划） | Implementation Plan | 计划产物；首现必须双语 |
| Knowledge（知识库） | Knowledge | 持久化知识能力；首现必须双语 |

## 双语边界（强制）

- 允许（术语级）：
  - `Orchestrator skill（编排器技能）`
  - `MCP（模型上下文协议）`
- 禁止（整句级）：
  - `This skill routes to sub-skills.（此技能会路由到子技能。）`
  - `## 移动端设计系统 (Mobile Design System)`

## 首次标注模板

- 正文首现：`Agent（智能体）`、`Workflow（工作流）`、`MCP（模型上下文协议）`
- 后续正文：`Agent`、`Workflow`、`MCP`
- 禁止写法：`智能体（Agent）` 作为主格式、`Agent智能体`（无括号）、`Agent/智能体`（斜杠混写）、`中文标题 (English sentence)`

## 示例命令中的提示词翻译

- 目标：让示例命令在中文语境下可直接复用，同时不破坏命令机制。
- 规则：只翻译自然语言提示词；命令、参数、路径、开关、子命令保持原样。
- 示例：
  - 原文：`python scripts/search.py "fintech crypto" --design-system`
  - 推荐：`python scripts/search.py "金融 科技 加密" --design-system`
  - 推荐：`python scripts/search.py "为金融科技产品生成设计系统关键词" --design-system`

## 本轮覆盖范围

- `web/src/app/docs/**/page.tsx`
- `web/src/components/docs/sidebar.tsx`
- `.agent/rules/GEMINI.md`
- `docs/operations.md`

后续新增文档默认遵循本表。
