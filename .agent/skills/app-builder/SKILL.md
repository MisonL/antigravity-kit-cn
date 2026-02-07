---

2: name: app-builder
3: description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
4: allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
5: ---
6:
7: # App Builder - 应用程序构建编排器
8:
9: > 分析用户请求，确定技术栈，规划结构并协调 Agents。
10:
11: ## 🎯 选择性阅读规则
12:
13: **仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。
14:
15: | 文件 | 描述 | 何时阅读 |
16: | ----------------------- | ------------------------- | -------------------- |
17: | `project-detection.md` | 关键词矩阵, 项目类型检测 | 启动新项目时 |
18: | `tech-stack.md` | 2026 默认技术栈, 备选方案 | 选择技术时 |
19: | `agent-coordination.md` | Agent 流水线, 执行顺序 | 协调多代理工作时 |
20: | `scaffolding.md` | 目录结构, 核心文件 | 创建项目结构时 |
21: | `feature-building.md` | 功能分析, 错误处理 | 为现有项目添加功能时 |
22: | `templates/SKILL.md` | **项目模板** | 初始化新项目脚手架时 |
23:
24: ---
25:
26: ## 📦 模板 (13)
27:
28: 用于新项目的快速启动脚手架。**仅阅读匹配的模板！**
29:
30: | 模板 | 技术栈 | 何时使用 |
31: | -------------------------------------------------------------- | ------------------- | --------------------- |
32: | [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md) | Next.js + Prisma | 全栈 Web 应用 |
33: | [nextjs-saas](templates/nextjs-saas/TEMPLATE.md) | Next.js + Stripe | SaaS 产品 |
34: | [nextjs-static](templates/nextjs-static/TEMPLATE.md) | Next.js + Framer | 落地页 (Landing page) |
35: | [nuxt-app](templates/nuxt-app/TEMPLATE.md) | Nuxt 3 + Pinia | Vue 全栈应用 |
36: | [express-api](templates/express-api/TEMPLATE.md) | Express + JWT | REST API |
37: | [python-fastapi](templates/python-fastapi/TEMPLATE.md) | FastAPI | Python API |
38: | [react-native-app](templates/react-native-app/TEMPLATE.md) | Expo + Zustand | 移动端应用 |
39: | [flutter-app](templates/flutter-app/TEMPLATE.md) | Flutter + Riverpod | 跨平台移动端 |
40: | [electron-desktop](templates/electron-desktop/TEMPLATE.md) | Electron + React | 桌面端应用 |
41: | [chrome-extension](templates/chrome-extension/TEMPLATE.md) | Chrome MV3 | 浏览器扩展 |
42: | [cli-tool](templates/cli-tool/TEMPLATE.md) | Node.js + Commander | CLI 命令行工具 |
43: | [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm | Monorepo 项目 |
44:
45: ---
46:
47: ## 🔗 相关代理 (Related Agents)
48:
49: | Agent | 角色 |
50: | --------------------- | ---------------- |
51: | `project-planner` | 任务分解, 依赖图 |
52: | `frontend-specialist` | UI 组件, 页面 |
53: | `backend-specialist` | API, 业务逻辑 |
54: | `database-architect` | Schema, 迁移 |
55: | `devops-engineer` | 部署, 预览 |
56:
57: ---
58:
59: ## 使用示例 (Usage Example)
60:
61: `62: 用户: "做一个 Instagram 克隆版，有照片分享和点赞功能"
63: 
64: App Builder 流程:
65: 1. 项目类型: 社交媒体应用 (Social Media App)
66: 2. 技术栈: Next.js + Prisma + Cloudinary + Clerk
67: 3. 创建计划:
68:    ├─ 数据库 Schema (users, posts, likes, follows)
69:    ├─ API 路由 (12 个端点)
70:    ├─ 页面 (feed, profile, upload)
71:    └─ 组件 (PostCard, Feed, LikeButton)
72: 4. 协调 Agents
73: 5. 报告进度
74: 6. 启动预览
75:`
76:
