---
name: app-builder
description: 应用构建编排器 (Main application building orchestrator)。从自然语言请求创建全栈应用。确定项目类型，选择技术栈，协调代理工作。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - 应用构建编排器

> 分析用户请求，确定技术栈 (Tech stack)，规划结构，并协调代理 (Agents) 工作。

## 🎯 选择性阅读规则 (Selective Reading Rule)

**仅阅读与请求相关的文档！** 查阅内容地图，找到你需要的信息。

| 文件                    | 描述                             | 阅读时机               |
| ----------------------- | -------------------------------- | ---------------------- |
| `project-detection.md`  | 关键词矩阵、项目类型检测         | 开始新项目时           |
| `tech-stack.md`         | 2026 默认技术栈及替代方案        | 选择技术时             |
| `agent-coordination.md` | 代理流水线、执行顺序             | 协调多代理协作时       |
| `scaffolding.md`        | 目录结构、核心文件               | 创建项目结构时         |
| `feature-building.md`   | 功能分析、错误处理               | 在现有项目中添加功能时 |
| `templates/SKILL.md`    | **项目模板 (Project templates)** | 为新项目搭建脚手架时   |

---

## 📦 模板 (13) (Templates)

为新项目提供快速启动的脚手架 (Scaffolding)。**仅阅读相匹配的模板！**

| 模板                                                           | 技术栈              | 适用场景            |
| -------------------------------------------------------------- | ------------------- | ------------------- |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | 全栈 Web 应用       |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS 产品           |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | 落地页              |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue 全栈应用        |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API            |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API          |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | 移动端应用          |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | 跨平台移动端        |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | 桌面端应用          |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | 浏览器扩展          |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI 工具            |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo (单仓多包) |

---

## 🔗 相关代理 (Related Agents)

| 代理                  | 角色                 |
| --------------------- | -------------------- |
| `project-planner`     | 任务拆解、依赖图构建 |
| `frontend-specialist` | UI 组件、页面开发    |
| `backend-specialist`  | API 开发、业务逻辑   |
| `database-architect`  | 数据库模式、迁移     |
| `devops-engineer`     | 部署、预览环境       |

---

## 使用示例 (Usage Example)

```
老板: "做一个类似 Instagram 的克隆版，支持照片分享和点赞"

App Builder 执行流程：
1. 项目类型：社交媒体应用
2. 技术栈：Next.js + Prisma + Cloudinary + Clerk
3. 创建计划：
   ├─ 数据库 Schema (用户, 帖子, 点赞, 关注)
   ├─ API 路由 (12 个端点)
   ├─ 页面开发 (Feed, Profile, Upload)
   └─ 组件开发 (PostCard, Feed, LikeButton)
4. 协调代理工作
5. 汇报进度
6. 启动预览 (Start preview)
```

---

