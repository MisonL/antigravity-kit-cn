---
title: 技能
slug: skills
path: ['代理', '技能']
---

# Agent 技能（中文整理）

> 来源：`https://antigravity.google/docs/skills`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

Skills 是扩展 Agent 能力的开放标准（见 `https://agentskills.io`）。  
一个 Skill 是一个目录，至少包含一个 `SKILL.md` 指令文件。

## 什么是 Skill

Skill 是可复用的能力包，通常包含：

- 任务处理指令
- 最佳实践与约束
- 可选脚本与资源文件

会话开始时，Agent 先看到所有 Skill 的元信息（名称、描述）。  
当某个 Skill 与当前任务相关时，Agent 再读取完整 `SKILL.md` 并执行。

## Skill 存放位置

Antigravity 支持两类 Skill：

| 位置 | 作用域 |
| :--- | :--- |
| `<workspace-root>/.agent/skills/<skill-folder>/` | 工作区级 |
| `~/.gemini/antigravity/skills/<skill-folder>/` | 全局级（所有工作区） |

- 工作区 Skill：适合项目专属流程（如部署规范、测试约定）。
- 全局 Skill：适合跨项目复用的个人工具或通用能力。

## 如何创建 Skill

1. 在 Skill 目录下创建文件夹。
2. 在该文件夹中创建 `SKILL.md`。

```text
.agent/skills/
└── my-skill/
    └── SKILL.md
```

`SKILL.md` 示例：

```markdown
---
name: my-skill
description: 用于处理某类任务，在需要 X 或 Y 时使用。
---

# 我的 Skill

这里写详细指令。

## 何时使用

- 场景 1
- 场景 2

## 如何执行

按步骤给出模式、约束、输出要求。
```

## Frontmatter 字段

| 字段 | 是否必填 | 说明 |
| :--- | :--- | :--- |
| `name` | 否 | Skill 唯一标识（建议小写 + 连字符）。省略时默认使用目录名。 |
| `description` | 是 | 描述 Skill 的用途与触发场景，供 Agent 判断是否启用。 |

建议：

- 用第三人称描述 Skill 行为。
- 包含关键触发词，便于 Agent 识别。

## 推荐目录结构

`SKILL.md` 是必需项，其他目录可选：

```text
.agent/skills/my-skill/
├── SKILL.md        # 必需：核心指令
├── scripts/        # 可选：执行脚本
├── examples/       # 可选：示例实现
└── resources/      # 可选：模板/资源
```

## Agent 如何使用 Skill

Skill 使用“渐进式加载（progressive disclosure）”模式：

1. **发现**：会话开始时仅加载 Skill 名称和描述。
2. **激活**：判断相关后才读取完整 `SKILL.md`。
3. **执行**：按 Skill 指令完成当前任务。

你通常无需显式指定 Skill；Agent 会按上下文决定。  
如需强制使用，可在对话中点名 Skill。

## 编写最佳实践

### 单一职责

每个 Skill 聚焦一个能力，避免“全能型”大杂烩 Skill。

### 描述精确

`description` 要明确写出“做什么 + 什么时候用”。

### 脚本黑盒化

若包含脚本，优先让 Agent 用 `--help` 理解用法，避免无谓读取完整源码。

### 添加决策分支

复杂 Skill 建议加入“条件分支”说明，帮助 Agent 在不同场景选择正确路径。

## 示例：代码审查 Skill

```markdown
---
name: code-review
description: 审查代码中的缺陷、风格问题与最佳实践偏差，适用于 PR 审查与质量检查。
---

# 代码审查 Skill

## 审查清单

1. 正确性：是否满足需求与预期行为？
2. 边界条件：异常与错误路径是否覆盖？
3. 风格一致性：是否符合项目规范？
4. 性能：是否存在明显低效实现？

## 反馈方式

- 说明具体问题位置与影响
- 解释原因，不只给结论
- 提供可执行替代方案
```
