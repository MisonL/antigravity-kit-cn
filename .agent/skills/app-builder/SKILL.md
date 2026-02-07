---
name: app-builder
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 应用构建器 (App Builder) - 应用程序构建编排器

> 分析用户请求，确定技术栈，规划结构并协调 Agents (智能体)。

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                                               | 何时阅读             |
| ----------------------- | ------------------------------------------------------------------ | -------------------- |
| `project-detection.md`  | Keyword matrix (关键词矩阵), project type detection (项目类型检测) | 开始新项目时         |
| `tech-stack.md`         | 2026 default stack (2026 默认技术栈), alternatives (替代方案)      | 选择技术时           |
| `agent-coordination.md` | Agent pipeline (Agent 管道), execution order (执行顺序)            | 协调多智能体工作时   |
| `scaffolding.md`        | Directory structure (目录结构), core files (核心文件)              | 创建项目结构时       |
| `feature-building.md`   | Feature analysis (功能分析), error handling (错误处理)             | 向现有项目添加功能时 |
| `templates/SKILL.md`    | **Project templates (项目模板)**                                   | 脚手架搭建新项目时   |

---

## 📦 模板 (Templates) (13)

用于新项目的快速启动脚手架。**仅阅读匹配的模板！**

| 模板                                                           | 技术栈              | 何时使用                             |
| -------------------------------------------------------------- | ------------------- | ------------------------------------ |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | Full-stack web app (全栈 Web 应用)   |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS product (SaaS 产品)             |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | Landing page (落地页)                |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue full-stack app (Vue 全栈应用)    |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API                             |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API                           |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | Mobile app (移动端应用)              |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | Cross-platform mobile (跨平台移动端) |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | Desktop app (桌面应用)               |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | Browser extension (浏览器扩展)       |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI app (命令行应用)                 |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo                             |

---

## 🔗 相关 Agents (Related Agents)

| Agent                 | 角色                                                 |
| --------------------- | ---------------------------------------------------- |
| `project-planner`     | Task breakdown (任务分解), dependency graph (依赖图) |
| `frontend-specialist` | UI components (UI 组件), pages (页面)                |
| `backend-specialist`  | API, business logic (业务逻辑)                       |
| `database-architect`  | Schema, migrations (迁移)                            |
| `devops-engineer`     | Deployment (部署), preview (预览)                    |

---

## 使用示例 (Usage Example)

```
User: "Make an Instagram clone with photo sharing and likes"
(用户: "制作一个带有照片分享和点赞功能的 Instagram 克隆版")

App Builder Process:
1. Project type: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Create plan:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Coordinate agents
5. Report progress
6. Start preview
```
