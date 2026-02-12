---
slug: rules-workflows
section: 代理
title: 规则与工作流
path:
  - 代理
  - 规则与工作流
---

# 规则与工作流（中文整理）

> 来源：`https://antigravity.google/docs/rules-workflows`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

# Rules（规则）

Rules 是用户手动定义的约束，可在全局和工作区层级生效，用于把 Agent 的行为对齐到你的团队规范、技术栈和个人风格。

## 快速开始

1. 在编辑器 Agent 面板顶部点击 `...` 打开 Customizations。
2. 进入 `Rules` 面板。
3. 点击 `+ Global` 创建全局规则，或点击 `+ Workspace` 创建工作区规则。

规则文件本质是 Markdown 文档。每个规则文件上限为 `12,000` 字符。

## 全局规则

- 路径：`~/.gemini/GEMINI.md`
- 作用域：所有工作区

## 工作区规则

- 路径：`<workspace-root>/.agent/rules/`
- 作用域：当前工作区（或对应 Git 根目录）

## 规则激活方式

每条规则可配置激活方式：

- `Manual`：通过输入框 `@提及` 手动启用。
- `Always On`：始终启用。
- `Model Decision`：由模型根据规则自然语言描述决定是否启用。
- `Glob`：按文件匹配模式启用（例如 `*.js`、`src/**/*.ts`）。

## `@` 引用机制

规则文件可通过 `@filename` 引用其他文件：

- 相对路径：相对于规则文件所在目录解析。
- 绝对路径：优先按真实绝对路径解析。
- 若绝对路径不存在，系统会尝试按仓库相对路径解析。

示例：

- `@/path/to/file.md`：先尝试 `/path/to/file.md`，不存在则尝试 `workspace/path/to/file.md`。

# Workflows（工作流）

Workflows 用于把重复性任务固化为“可复用步骤序列”，例如部署、回评审意见、批量检查等。  
工作流保存为 Markdown 文件，可通过斜杠命令 `/workflow-name` 调用。

与 Rules 的区别：

- Rules：提供长期、可复用的行为约束（提示层）。
- Workflows：提供结构化执行步骤（流程层）。

## 创建工作流

1. 在 Agent 面板顶部点击 `...` 打开 Customizations。
2. 进入 `Workflows` 面板。
3. 点击 `+ Global` 创建全局工作流，或点击 `+ Workspace` 创建工作区工作流。

## 执行工作流

在 Agent 中输入：

```text
/workflow-name
```

工作流支持互相调用。例如 `/workflow-1` 的步骤中可包含“调用 `/workflow-2`”和“调用 `/workflow-3`”。

工作流文件包含：

- 标题
- 描述
- 有序步骤说明

每个工作流文件上限为 `12,000` 字符。

## 让 Agent 生成工作流

你也可以直接让 Agent 帮你生成工作流。  
当你已经手动完成一轮完整操作后，Agent 可以利用会话历史自动归纳并产出可复用工作流。
