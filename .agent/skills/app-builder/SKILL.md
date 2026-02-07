---
name: app-builder
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# 应用构建器 - 应用程序构建编排器

> 分析用户请求，确定技术栈，规划结构并协调 Agents (智能体)。

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                      | 何时阅读             |
| ----------------------- | ----------------------------------------- | -------------------- |
| `project-detection.md`  | 关键词矩阵 (Keyword matrix), 项目类型检测 | 开始新项目时         |
| `tech-stack.md`         | 2026 默认技术栈, 替代方案                 | 选择技术时           |
| `agent-coordination.md` | Agent 管道, 执行顺序                      | 协调多智能体工作时   |
| `scaffolding.md`        | 目录结构, 核心文件                        | 创建项目结构时       |
| `feature-building.md`   | 功能分析, 错误处理                        | 向现有项目添加功能时 |
| `templates/SKILL.md`    | **项目模板**                              | 脚手架搭建新项目时   |

---

## 📦 模板

用于新项目的快速启动脚手架。**仅阅读匹配的模板！**

| 模板                                                           | 技术栈              | 何时使用              |
| -------------------------------------------------------------- | ------------------- | --------------------- |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | 全栈 Web 应用         |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS 产品             |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | 落地页 (Landing page) |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue 全栈应用          |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API              |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API            |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | 移动端应用            |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | 跨平台移动端          |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | 桌面应用              |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | 浏览器扩展            |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | 命令行应用            |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo              |

---

## 🔗 相关 Agents

| Agent                 | 角色             |
| --------------------- | ---------------- |
| `project-planner`     | 任务分解, 依赖图 |
| `frontend-specialist` | UI 组件, 页面    |
| `backend-specialist`  | API, 业务逻辑    |
| `database-architect`  | Schema, 迁移     |
| `devops-engineer`     | 部署, 预览       |

---

## 使用示例

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
