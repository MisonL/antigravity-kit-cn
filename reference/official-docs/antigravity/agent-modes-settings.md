---
slug: agent-modes-settings
section: 代理
title: Agent 模式与设置
path:
  - 代理
  - 模式与设置
---

# Agent 模式与设置（中文整理）

> 来源：`https://antigravity.google/docs/agent-modes-settings`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

## 会话级模式

开始新的 Agent 会话时，用户可以选择不同模式：

- `Planning`：先规划后执行，适合深度研究、复杂任务、协作任务。该模式下，Agent 会使用任务分组、产出 Artifacts，并在执行前进行更充分的分析与规划。
- `Fast`：直接执行，适合简单且局部的任务，例如重命名变量、执行少量命令等，强调速度。

## 全局设置

全局设置位于设置面板的 `Agent` 标签页，影响所有会话。重点配置如下。

### Artifact 审阅策略

可选项：

- `Always Proceed`：Agent 不等待人工审阅，继续执行。
- `Request Review`：Agent 在请求审阅后停止，等待用户确认和补充意见。

适用建议：

- 需要严格把关实施计划时，使用 `Request Review`。
- 追求流程速度且信任当前指令时，使用 `Always Proceed`。

### 终端命令自动执行

针对终端命令生成工具：

- `Request Review`：默认不自动执行命令（允许名单中的命令可自动执行）。
- `Always Proceed`：默认自动执行命令（拒绝名单中的命令例外）。

补充规则：

- 允许名单（Allow list）和拒绝名单（Deny list）可在 `Agent` 设置中配置。
- 设置变更仅对后续新消息生效，不影响当前正在进行的回复。
- 在 Unix shell 中，规则按“命令 token 前缀匹配”。
- 在 PowerShell 中，规则可匹配命令 token 的任意连续子序列。

### 非工作区文件访问

该选项控制 Agent 是否可访问和编辑当前工作区之外的文件。

默认情况下，Agent 仅能访问：

- 当前工作区文件
- 应用根目录 `~/.antigravity/` 下的 Antigravity 相关数据（如 Artifacts、Knowledge Items）

风险提示：

- 开启该能力可能暴露本地敏感信息或密钥，请谨慎使用。
