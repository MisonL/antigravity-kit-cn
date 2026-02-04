---
description: 检查项目和智能体状态
---

# 状态 (Status Workflow)

**触发命令**: `/status`

## 目的

显示当前项目、任务和 Agent 的状态仪表盘。

## 显示内容

1. **当前任务**:
    - 读取 `task.md`。
    - 显示当前正在进行的项目 (In Progress)。
    - 显示下一步计划。
    - 显示已完成的里程碑。

2. **Agent 状态**:
    - 当前激活的 Agent。
    - 当前加载的 Skills。
    - 使用的模式 (Planning/Execution)。

3. **项目健康度**:
    - 上次测试结果。
    - 待修复的 TODOs。

## 示例

> User: /status
> AI:
> 📊 **项目状态**: 开发中
> 🔄 **当前任务**: 实现 JWT 认证 (Step 3/5)
> 🤖 **当前 Agent**: Backend Specialist
> ✅ **已完成**: 数据库 Schema, 登录接口

---
