# 规则（命令审批规则）

> 来源：`https://developers.openai.com/codex/rules`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

Codex Rules 用于控制“哪些命令允许在沙箱外执行”，属于安全与审批策略层。  
该能力为实验特性，后续可能调整。

## 创建规则文件

1. 在 `./codex/rules/` 下创建 `.rules` 文件（例如 `~/.codex/rules/default.rules`）。
2. 写入规则。

示例：在沙箱外执行 `gh pr view` 前必须提示审批。

```python
prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",
    justification = "查看 PR 需要人工确认",
    match = [
        "gh pr view 7888",
        "gh pr view --repo openai/codex",
    ],
    not_match = [
        "gh pr list",
    ],
)
```

## 规则字段说明

`prefix_rule(...)` 常用字段：

- `pattern`：命令前缀（按 token 匹配）
- `decision`：命中后的动作
- `justification`：规则说明（可选）
- `match`：应命中的测试样例（可选）
- `not_match`：不应命中的测试样例（可选）

`decision` 常见值：

- `prompt`：询问用户
- `allow`：允许
- `deny`：拒绝

## 关于 shell 包装命令与复合命令

常见包装命令包括：

- `bash -lc "..."`
- `sh -c "..."`
- `zsh -lc "..."`
- `python -c "..."`

在可安全拆分时，Codex 可能提取出真实命令做前缀匹配；  
在不可安全拆分时，会把整体当作一个命令匹配。

### 可安全拆分的典型情况

- 单一命令、无复杂重定向/管道/变量展开
- 命令结构明确，不会因拆分改变语义

### 不拆分的典型情况

- 包含复杂 shell 语法（多条命令、重定向、条件、子 shell 等）
- 拆分后可能造成语义偏差或安全风险

## 测试规则文件

建议每条规则都写 `match` / `not_match` 示例，作为“内联单元测试”。  
这样可以在维护规则时快速验证匹配行为，减少误放行或误阻断。

## 规则语言边界

- Rules 只负责命令级审批策略，不负责业务逻辑说明。
- 业务约束建议放在 `AGENTS.md` 或项目文档中。
- 高风险命令建议默认 `prompt` 或 `deny`，再按需要放开。
