---
name: intelligent-routing
description: 自动 Agent 选择与智能任务路由。分析用户请求并自动选择最佳专家 Agent，无需显式提及。
version: 1.0.0
---

# 智能 Agent 路由 (Intelligent Agent Routing)

**目的**：自动分析用户请求并将其路由至最合适的专家 Agent，无需用户显式提及。

## 核心原则

> **AI 应充当智能项目经理**，分析每一项请求并自动为该任务匹配最佳专家。

---

## 工作原理

### 1. 请求分析

在响应任何用户请求前，自动进行以下分析：

- **关键词**：识别技术术语。
- **领域**：确定涉及的技术领域 (前端、后端、安全等)。
- **复杂度**：评估任务的广度与深度。

### 2. Agent 选择矩阵 (部分)

| 用户意图        | 关键词                          | 选择的 Agent                                |
| :-------------- | :------------------------------ | :------------------------------------------ |
| **认证/登录**   | login, auth, signup, jwt        | `security-auditor` + `backend-specialist`   |
| **UI 组件**     | button, card, layout, style     | `frontend-specialist`                       |
| **移动端 UI**   | screen, navigation, touch       | `mobile-developer`                          |
| **数据库**      | schema, migration, query, table | `database-architect` + `backend-specialist` |
| **Bug 修复**    | error, bug, not working         | `debugger`                                  |
| **性能优化**    | slow, lag, optimize             | `performance-optimizer`                     |
| **复杂/新功能** | 检测到多个领域                  | `orchestrator` (多智能体协作)               |

---

## 自动路由协议 (TIER 0)

### 响应格式 (强制说明)

在自动选择 Agent 时，应简洁地告知用户：

```markdown
🤖 **正在应用 `@security-auditor` + `@backend-specialist` 的知识...**

[继续特定的专业响应]
```

**这样做的好处：**

- ✅ 用户清晰地知道正在应用哪方面的专业知识。
- ✅ 决策过程透明。
- ✅ 依然保持自动化，无需用户记住 `/orchestrate` 等命令。

---

## 领域检测规则

### 单领域任务 (自动调用单个 Agent)

涉及认证、加密等路由至 `security-auditor`；涉及组件、样式等路由至 `frontend-specialist`；以此类推。

### 多领域任务 (自动调用 Orchestrator)

如果请求涉及两个或更多不同类别的领域 (例如：“创建一个带深色模式的安全登录系统”)，系统将自动调用 `orchestrator`。Orchestrator 将负责协调 `security-auditor`、`frontend-specialist` 等多个专家。

---

## 复杂度评估

- **简单 (SIMPLE)**：单一文件修改、明确具体、单一领域。 -> **直接调用对应 Agent**。
- **中等 (MODERATE)**：影响 2-3 个文件、需求清晰、最多 2 个领域。 -> **按顺序调用相关 Agent**。
- **复杂 (COMPLEX)**：跨多个文件/领域、需要架构决策、需求尚不明确。 -> **调用 `orchestrator` 并触发“苏格拉底之门”进行提问确认**。

---

## 实施规则

### 规则 1：静默分析

- ✅ 静默分析。
- ✅ 直接告知正在应用的 Agent。
- ❌ 避免冗长的元对话 (如：“我正在分析您的请求并为您选择合适的专家...”)。

### 规则 2：显式覆盖 (Override)

如果用户显式提及了某个 Agent (如：“让 @backend-specialist 来审查这段代码”)，系统将忽略自动路由，严格遵循用户的指示。

---

## 总结

**intelligent-routing 技能实现了：**

✅ **零操作开销**：无需手动输入 `/orchestrate`。
✅ **自动匹配**：基于请求分析自动选择专家。
✅ **透明沟通**：明确告知用户当前正在应用的专业视角。
✅ **无缝集成**：与现有的项目规则和工作流完美结合。
✅ **容错机制**：复杂任务自动回退至 Orchestrator 进行全局把控。

**结果**：用户无论提出什么问题，都能获得“专家级”的响应，而无需了解背后的系统架构。
