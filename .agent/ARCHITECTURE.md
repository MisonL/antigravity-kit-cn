# 🏗️ 架构文档 (Architecture)

> **Antigravity Kit** - 核心架构与设计原则

---

## 1. 核心设计理念

Antigravity Kit 不是一个简单的"提示词库"，而是一个**模块化的智能体操作系统**。它遵循以下核心原则：

### 🧱 模块化 (Modularity)

一切皆模块。

- **Agent (智能体)**：只有"人格"和"职责"，不包含具体知识。
- **Skill (技能)**：独立的知识单元，可被多个 Agent 复用。
- **Workflow (工作流)**：串联 Agent 和 Skill 的标准化流程。

### 🔌 动态加载 (Lazy Loading)

**硬盘全量安装，内存按需加载。**
系统不会一次性把所有 Prompt 塞给 AI。只有当用户触发特定领域时，相关的文件才会被读取。

- **P0 级**：规则文件 (全局 `~/.gemini/GEMINI.md` 或工作区 `.agent/rules/*.md`)
- **P1 级**：Agent 定义 (`.agent/agents/<agent>.md`)
- **P2 级**：Skill 指令 (`.agent/skills/<skill>/SKILL.md`)

### 🤖 智能路由 (Intelligent Routing)

用户不需要知道系统里有什么 Agent。

- 用户说："帮我修个 Bug" -> 路由到 `debugger`
- 用户说："设计个网页" -> 路由到 `frontend-specialist`
- 用户说："部署服务器" -> 路由到 `devops-engineer`

---

## 2. 目录结构说明

```
.agent/
├── ARCHITECTURE.md       # 本文件
├── agents/               # 智能体定义 (Persona)
│   ├── frontend-specialist.md
│   ├── backend-specialist.md
│   └── ...
├── rules/                # 规则 (Workspace Rules)
│   └── GEMINI.md
├── skills/               # 技能库 (Knowledge)
│   ├── nextjs-react-expert/
│   ├── api-patterns/
│   └── ...
├── workflows/            # 工作流 (Slash Commands)
│   ├── brainstorm.md
│   ├── create.md
│   └── ...
└── scripts/              # 自动化脚本 (Python/Shell)
    ├── checklist.py
    └── ...
```

补充说明：

- **全局规则**：`~/.gemini/GEMINI.md`，跨工作区生效。
- **全局技能**：`~/.gemini/antigravity/skills/<skill>/`，对所有项目可用。

### 2.1 官方标准基线（Antigravity Docs 对齐）

以下规范与 `https://antigravity.google/docs` 对齐，作为本仓库实现与文档基线：

- **Skills**（`/docs/skills`）
  - 技能目录必须包含 `SKILL.md`。
  - frontmatter 中 `description` 必填，`name` 选填（默认文件夹名）。
  - 可选目录：`scripts/`、`examples/`、`resources/`。
  - 加载模型遵循 Discovery -> Activation -> Execution。
- **Rules / Workflows**（`/docs/rules-workflows`）
  - 规则与工作流均为 Markdown 文件。
  - 单文件限制 12,000 字符。
  - Workflow 通过 `/workflow-name` 触发，可在流程内调用其他 Workflow。
- **Task Groups**（`/docs/task-groups`）
  - 规划模式下拆分复杂任务，展示目标摘要、已编辑文件与待处理步骤区。
- **Strict Mode**（`/docs/strict-mode`）
  - 受 Allowlist/Denylist 约束。
  - 终端自动执行、浏览器 JS 执行、Artifact 执行均固定为 `Request Review`。
  - 严格遵循 `.gitignore` 且限制在工作区内访问。
- **Sandboxing**（`/docs/sandbox-mode`）
  - 基于 macOS `sandbox-exec`，默认关闭，可单独控制网络访问。
  - 启用 Strict Mode 时自动启用沙箱并默认禁网。
- **MCP**（`/docs/mcp`）
  - 通过 MCP Store 管理。
  - 自定义服务入口：`Manage MCP Servers -> View raw config -> mcp_config.json`。
- **Command**（`/docs/command`）
  - 快捷键：macOS `Command + I`，Windows/Linux `Ctrl + I`。

---

## 3. 核心协议 (Protocol)

### 3.1 技能加载协议

每个 Agent 的头部 frontmatter 定义了它具备的技能：

```yaml
---
description: 前端开发专家
skills:
    - frontend-design
    - nextjs-react-expert
    - tailwind-patterns
---
```

当 `frontend-specialist` 被激活时，它**必须**读取 `skills` 列表中的 `SKILL.md` 文件。

### 3.2 脚本执行协议

Agent 可以调用 `scripts/` 下的脚本，但必须遵循：

1. **安全第一**：如果是破坏性操作，必须先询问用户。
2. **环境检查**：先检查用户环境 (Node, Python 等)。
3. **透明化**：告知用户正在执行什么脚本。

---

## 4. 扩展指南

### 如何添加新 Agent？

1. 在 `agents/` 下创建 `new-agent.md`。
2. 定义 frontmatter (description, skills)。
3. 编写 System Prompt (角色设定、规则)。

### 如何添加新 Skill？

1. 在 `skills/` 下创建新目录 `new-skill/`。
2. 创建 `SKILL.md` (核心指令)。
3. 在 `SKILL.md` 顶部提供 frontmatter（`description` 必填，`name` 可选）。
4. (可选) 添加 `scripts/`、`examples/`、`resources/`。

### 如何添加新 Workflow？

1. 在 `workflows/` 下创建 `new-flow.md`。
2. 定义触发命令 (如 `/newflow`)。
3. 编写步骤说明。
4. 单个工作流文件限制 12,000 字符，可在步骤中调用其他工作流。

---

## 5. 版本控制

- **Version**: 2.0.1
- **Last Updated**: 2026-02-04

## 上游脚本流程补充（reference 对齐）

为避免翻译过程中丢失自动化校验链路，请保留以下核心脚本执行路径：

- `python .agent/scripts/checklist.py .`
- `python .agent/scripts/verify_all.py . --url http://localhost:3000`

脚本职责：
- `checklist.py`：核心检查（快速校验）。
- `verify_all.py`：全量检查（发布前校验）。
- `scripts/README.md`：脚本能力、参数与场景说明总览。
- `scripts/references`：脚本执行时依赖的参考数据目录。

## 工作流命令索引（Slash Commands）

为保持与上游工作流入口一致，以下命令保持固定：

- `/brainstorm`
- `/create`
- `/debug`
- `/deploy`
- `/enhance`
- `/orchestrate`
- `/plan`
- `/preview`
- `/status`
- `/test`
- `/ui-ux-pro-max`
