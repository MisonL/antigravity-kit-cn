# Agent 技能（Codex）

> 来源：`https://developers.openai.com/codex/skills`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

Skills 用于给 Codex 增加任务专用能力。  
一个 Skill 通常打包了指令、参考资料以及可选脚本，便于 Agent 稳定复用某类流程。

Skills 适用于 Codex CLI、IDE 扩展和 Codex App。

## Skill 基本结构

一个 Skill 目录至少包含 `SKILL.md`：

```text
my-skill/
├── SKILL.md        # 必需：元信息 + 指令
├── scripts/        # 可选：可执行脚本
├── references/     # 可选：参考文档
└── assets/         # 可选：模板/资源
```

`SKILL.md` 需包含 `name` 与 `description`：

```markdown
---
name: skill-name
description: 说明该 skill 的用途与触发场景
metadata:
  short-description: 可选的简短说明
---

# Skill 标题

在此编写可执行指令。
```

## Codex 如何使用 Skills

Codex 采用“渐进式加载”：

1. 会话开始时先读取各 Skill 的元信息（`name`、`description`、路径等）。
2. 仅当某 Skill 与当前任务相关时，才读取完整 `SKILL.md`。
3. 执行过程中按 Skill 指令调用脚本/引用资料。

## 创建 Skill

两种方式：

- 使用内置 Skill（例如 `$skill-creator`）辅助生成
- 手动创建目录与 `SKILL.md`

手动创建建议流程：

1. 创建目录 `my-skill/`
2. 写好 `SKILL.md` 的 frontmatter
3. 按需补充 `scripts/`、`references/`、`assets/`

## Skill 存放位置

常见位置：

- 全局：`$HOME/.agents/skills/`
- 项目：从当前工作目录开始，向上到仓库根目录，按链路扫描 `.agents/skills/`

实践建议：

- 跨项目复用放全局
- 项目专属流程放仓库内并随代码版本管理

## 安装与管理

可通过 CLI 管理技能开关与列表（实际命令以当前版本为准）：

```bash
codex skills list
codex skills enable <skill-name>
codex skills disable <skill-name>
```

对于 App/Server 场景，也可通过 API 传入 Skill 项。

## 可选元数据

除必填字段外，可在 frontmatter 增加元数据（如 `short-description`），用于改善 UI 展示和匹配体验。  
但不要把业务逻辑藏在元数据里，核心行为应写在正文指令区。

## 编写最佳实践

### 1. 描述要能触发

`description` 建议写清：

- 做什么
- 何时用
- 不适用场景

### 2. 单一职责

一个 Skill 解决一类问题，不要做“万能包”。

### 3. 脚本优先可执行

把复杂流程写进 `scripts/`，在 `SKILL.md` 中说明参数与调用方式。  
避免要求 Agent 反复阅读大段脚本源码。

### 4. 给出决策分支

复杂任务建议提供“条件 -> 路径”决策表，降低误用率。

### 5. 保持可迁移

尽量避免绑定私有路径与私有环境变量，必要时在 `references/` 说明依赖前置条件。
