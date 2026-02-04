---
description: 结构化头脑风暴，明确项目需求
---

# 头脑风暴 (Brainstorm Workflow)

**触发命令**: `/brainstorm [topic]`

## 目的

当用户只有一个模糊的想法，或者面临复杂问题不知从何下手时，使用此工作流。不要直接写代码，先理清思路。

## 步骤流程

1. **初始提问**:
    - 询问项目的核心目标 (Goal)。
    - 询问目标用户 (Target User)。
    - 询问核心价值 (Value Proposition)。

2. **苏格拉底式追问 (Socratic Questioning)**:
    - 基于用户的回答，提出 3 个以上的深化问题。
    - 挑战用户的假设 (例如："如果用户离线了怎么办？")。
    - 探索边界情况 (Edge Cases)。

3. **方案发散**:
    - 提出至少 3 种可能的解决方案或技术路线。
    - 分析每种方案的优缺点 (Pros & Cons)。

4. **收敛总结**:
    - 如果用户选定了方案，生成一份 `requirements.md` 或 `feature_spec.md`。
    - 建议下一步行动 (Next Steps)。

## 示例

> User: /brainstorm 我想做一个待办事项 App
> AI: 没问题。市面上有很多 Todo App，你想解决什么特定的痛点？是针对极客的纯键盘操作？还是针对团队的协作？

---
