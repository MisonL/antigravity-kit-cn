---
name: plan-writing
description: 结构化任务规划、WBS 分解与依赖管理
allowed-tools: Read, Glob, Grep
---

# 计划撰写 (Plan Writing)

## 好的计划标准

1.  **可执行 (Actionable)**: 每个任务都能直接对应到代码修改。
2.  **可验证 (Verifiable)**: 每个任务都有"完成定义" (DoD)。
3.  **原子化 (Atomic)**: 一个任务不超过 2-4 小时工作量。

## 计划模版 (Markdown)

```markdown
# 实施计划: [项目名称]

## 1. 目标 (Goal)

一句话描述要达成什么。

## 2. 关键依赖 (Dependencies)

- 需要先完成 API 接口，前端才能开发。
- 需要申请 OpenAI Key。

## 3. 任务拆解 (Tasks)

### Phase 1: 基础设施 (Infrasturcture)

- [ ] 初始化 Next.js 项目 `npx create-next-app` <!-- id: 1 -->
- [ ] 配置 ESLint 和 Prettier <!-- id: 2 -->

### Phase 2: 后端开发 (Backend)

- [ ] 设计 User Schema (Prisma) <!-- id: 3 -->
- [ ] 实现登录接口 POST /api/login <!-- id: 4 -->

### Phase 3: 前端开发 (Frontend)

- [ ] 实现登录表单组件 <!-- id: 5 -->
- [ ] 集成登录 API <!-- id: 6 -->

## 4. 验证步骤 (Verification)

- 运行 `npm test`
- 手动测试登录流程
```
