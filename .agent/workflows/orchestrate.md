---
description: 多智能体协同，处理复杂任务
skills:
    - parallel-agents
    - orchestrator
---

# 编排 (Orchestrate Workflow)

**触发命令**: `/orchestrate [complex task]`

## 目的

启动**多智能体协同模式**。当任务涉及多个领域（如"全栈开发"、"安全审计+修复"、"性能优化+测试"）时使用。

## 步骤流程

1. **任务分解**:
    - `Orchestrator` agent 介入。
    - 将大任务拆解为子任务流。

2. **角色分配**:
    - 识别每个子任务最适合的 Expert Agent。
    - 例如：Task A -> Frontend, Task B -> Backend。

3. **协同执行**:
    - 顺序或并行激活 Agent。
    - 共享上下文存储 (`memory.md` 或 `task.md`)。
    - 确保接口契约一致。

4. **最终整合**:
    - `Orchestrator` 检查所有产出。
    - 运行全量验证 `verify_all.py`。

## 示例

> User: /orchestrate 开发一个用户管理模块，包含前端页面、后端API和数据库表
> AI: 收到。启用编排模式。
> Phase 1: Database Architect 设计 Schema...
> Phase 2: Backend Specialist 生成 API...
> Phase 3: Frontend Specialist 生成页面...

---
