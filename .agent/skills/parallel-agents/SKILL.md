---
name: parallel-agents
description: 多智能体协同编排模式、任务分解与合并
---

# 并行智能体 (Parallel Agents)

当任务复杂时，单一 Agent 无法胜任，需要多 Agent 协同。

## 协同模式

### 1. 顺序接力 (Sequential Handoff)

- **流程**: Agent A -> Output -> Agent B
- **场景**: 先设计 (Design) -> 后开发 (Dev)。
- **关键**: 上一个环节的输出必须是结构化的，确定的。

### 2. 扇出/扇入 (Fan-out / Fan-in)

- **流程**:
  Leader 分解任务 ->
  Agent A (Frontend) & Agent B (Backend) 并行工作 ->
  Leader 合并结果。
- **场景**: 全栈功能开发。
- **关键**: 定义好接口契约 (Interface Contract) 是并行的前提。

### 3. 该评判者 (Critic / Judge)

- **流程**: Author (写代码) <-> Critic (提意见)。
- **场景**: 复杂的算法实现，需要反复优化。

## 编排者的职责

Orchestrator 不做具体工作，它负责：

1.  **上下文剪裁**: 不要把整个项目给每个 Agent，只给相关文件。
2.  **冲突解决**: 如果前端和后端对 API 定义不一致，Orchestrator 必须裁决。
