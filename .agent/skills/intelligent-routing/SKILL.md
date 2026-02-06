---
name: intelligent-routing
description: 智能路由算法与 Agent 自动选择逻辑
version: 1.0.0
---

# 智能路由 (Intelligent Routing)

这是 Antigravity Kit 的核心大脑，负责将用户输入映射到正确的 Agent。

## 路由逻辑

1.  **关键词匹配 (Keyword Matching)**
    - `react`, `css`, `ui` -> `frontend-specialist`
    - `api`, `database`, `server` -> `backend-specialist`
    - `deploy`, `docker`, `aws` -> `devops-engineer`
    - `test`, `jest`, `e2e` -> `test-engineer`

2.  **意图分析 (Intent Analysis)**
    - 如果包含 "fix", "error", "exception" -> 倾向于 `debugger`。
    - 如果包含 "plan", "roadmap" -> 倾向于 `project-planner`。

3.  **多 Agent 协同**
    - 如果同时包含前端和后端关键词 ("我要做一个带有登录功能的 React 页面") -> 路由给 `orchestrator`，由它拆解任务。

## 覆盖机制

用户可以随时通过 `@agent-name` 强制指定。

- " @security-auditor 检查这段代码" -> 强制使用安全审计员，即使内容看起来像纯前端代码。

## 多域任务建议

跨前后端或多模块任务，建议直接进入 `/orchestrate` 由编排器统一拆解。
