# Codex `.rules` 模板（手动配置）

> 用途：给 Codex 官方规则引擎提供命令审批策略。  
> 注意：这不是 `antigravity.rules` 的替代品，二者职责不同。

## 路径约定

- 全局默认路径：`~/.codex/rules/default.rules`
- 本项目不会自动写入该文件，请按需手动创建。

## 最小模板（Starlark）

```python
# default.rules
# 允许常见只读命令直接执行，其余命令走人工审批

load("builtin://rules/rules.star", "prefix_rule")

rules = [
    prefix_rule(["ls"], action="allow"),
    prefix_rule(["cat"], action="allow"),
    prefix_rule(["rg"], action="allow"),
    prefix_rule(["git", "status"], action="allow"),
]
```

## 建议策略

1. 先放行只读命令（`ls`/`cat`/`rg`/`git status`）。
2. 对写操作、网络请求、脚本执行保持 `review` 或 `deny`。
3. 团队场景下，将策略文件纳入内部安全评审流程。

## 与 `antigravity.rules` 的关系

- `antigravity.rules`：本仓库在工作区注入的托管说明内容，用于记录受管资源与运维约束。
- `.rules`：Codex 官方可执行审批规则（Starlark），影响命令放行策略。
