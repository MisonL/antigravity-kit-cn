---
name: app-builder
description: 主应用程序构建编排器。根据自然语言请求创建全栈应用程序。确定项目类型，选择技术栈，协调 Agent。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - 应用程序构建编排器

> 分析用户请求，确定技术栈，规划结构，并协调 Agent。

## 🎯 选择性阅读规则

**仅阅读与请求相关的文件！** 检查内容映射，找到你需要的内容。

| 文件 (File)             | 描述 (Description)        | 何时阅读 (When to Read) |
| ----------------------- | ------------------------- | ----------------------- |
| `project-detection.md`  | 关键词矩阵，项目类型检测  | 启动新项目时            |
| `tech-stack.md`         | 2026 默认技术栈，替代方案 | 选择技术时              |
| `agent-coordination.md` | Agent 管道，执行顺序      | 协调多 Agent 工作时     |
| `scaffolding.md`        | 目录结构，核心文件        | 创建项目结构时          |
| `feature-building.md`   | 功能分析，错误处理        | 向现有项目添加功能时    |
| `templates/SKILL.md`    | **项目模板**              | 脚手架搭建新项目时      |

---

## 📦 模板 (Templates) (13)

新项目的快速启动脚手架。**仅阅读匹配的模板！**

| 模板 (Template)                                                | 技术栈 (Tech Stack) | 何时使用 (When to Use) |
| -------------------------------------------------------------- | ------------------- | ---------------------- |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | 全栈 Web 应用          |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS 产品              |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | 落地页                 |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue 全栈应用           |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API               |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API             |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | 移动端应用             |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | 跨平台移动端应用       |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | 桌面应用               |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | 浏览器插件             |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI 工具               |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo               |

---

## 🔗 相关 Agents

| Agent                 | Role             |
| --------------------- | ---------------- |
| `project-planner`     | 任务拆解，依赖图 |
| `frontend-specialist` | UI 组件，页面    |
| `backend-specialist`  | API，业务逻辑    |
| `database-architect`  | Schema，迁移     |
| `devops-engineer`     | 部署，预览       |

---

## 使用示例 (Usage Example)

```
用户: "做一个 Instagram 克隆版，有照片分享和点赞功能"

App Builder 流程:
1. 项目类型: 社交媒体应用 (Social Media App)
2. 技术栈: Next.js + Prisma + Cloudinary + Clerk
3. 创建计划:
   ├─ 数据库 Schema (users, posts, likes, follows)
   ├─ API 路由 (12 个端点)
   ├─ 页面 (feed, profile, upload)
   └─ 组件 (PostCard, Feed, LikeButton)
4. 协调 Agents
5. 报告进度
6. 启动预览
```
