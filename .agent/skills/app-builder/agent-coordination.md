# Agent Coordination（智能体协同）

> App Builder（应用构建编排器）如何编排各领域专家 Agent。

## Agent Pipeline（智能体流水线）

```
┌─────────────────────────────────────────────────────────────┐
│                 APP BUILDER（编排器）                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                PROJECT PLANNER（项目规划）                   │
│  • 任务拆解                                                  │
│  • 依赖图                                                    │
│  • 文件结构规划                                              │
│  • 在项目根目录创建 {task-slug}.md（MANDATORY）              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│      CHECKPOINT: PLAN VERIFICATION（计划验证）               │
│  🔴 VERIFY（验证）：项目根目录是否存在 {task-slug}.md？        │
│  🔴 若否 → 停止 → 先创建计划文件                              │
│  🔴 若是 → 继续执行专家 Agent                                 │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ DATABASE        │ │ BACKEND         │ │ FRONTEND        │
│ ARCHITECT       │ │ SPECIALIST      │ │ SPECIALIST      │
│                 │ │                 │ │                 │
│ • Schema design │ │ • API routes    │ │ • Components    │
│   （模式设计）  │ │   （接口路由）  │ │   （组件）      │
│ • Migrations    │ │ • Controllers   │ │ • Pages         │
│   （迁移）      │ │   （控制器）    │ │   （页面）      │
│ • Seed data     │ │ • Middleware    │ │ • Styling       │
│   （种子数据）  │ │   （中间件）    │ │   （样式）      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           PARALLEL PHASE（并行阶段，可选）                   │
│  • Security Auditor（安全审计） → 漏洞检查                    │
│  • Test Engineer（测试工程） → 单元测试                      │
│  • Performance Optimizer（性能优化） → 包体分析               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DEVOPS ENGINEER                          │
│  • 环境设置                                                  │
│  • 预览部署                                                  │
│  • 健康检查                                                  │
└─────────────────────────────────────────────────────────────┘
```

## Execution Order（执行顺序）

| Phase（阶段） | Agent(s)（智能体） | Parallel?（是否并行） | Prerequisite（前置条件） | CHECKPOINT（检查点） |
| --- | --- | --- | --- | --- |
| 0 | Socratic Gate（苏格拉底之门） | ❌ | - | ✅ Ask 3 questions（先问 3 个问题） |
| 1 | Project Planner（项目规划） | ❌ | Questions answered（问题已回答） | ✅ **`{task-slug}.md` created（已创建）** |
| 1.5 | **PLAN VERIFICATION（计划验证）** | ❌ | `{task-slug}.md` exists（已存在） | ✅ **File exists in root（根目录存在）** |
| 2 | Database Architect（数据库架构师） | ❌ | Plan ready（计划就绪） | Schema defined（模式已定义） |
| 3 | Backend Specialist（后端专家） | ❌ | Schema ready（模式就绪） | API routes created（路由已创建） |
| 4 | Frontend Specialist（前端专家） | ✅ | API ready (partial)（接口部分就绪） | UI components ready（组件就绪） |
| 5 | Security Auditor（安全审计员）, Test Engineer（测试工程师） | ✅ | Code ready（代码就绪） | Tests & audit pass（测试与审计通过） |
| 6 | DevOps Engineer（运维工程师） | ❌ | All code ready（代码就绪） | Deployment ready（部署就绪） |

> 🔴 **CRITICAL（关键）：** Phase 1.5 is MANDATORY。没有 `{task-slug}.md` 验证，任何专家 Agent 不得进行后续操作。
