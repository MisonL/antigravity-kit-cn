---
name: templates
description: 新应用程序的项目脚手架模版。在从头创建新项目时使用。包含 12 个各种技术栈的模版。
allowed-tools: Read, Glob, Grep
---

# 项目模版 (Project Templates)

> 用于搭建新项目的快速启动模版。

---

## 🎯 选择性阅读规则

**仅阅读与用户项目类型匹配的模版！**

| 模版                                                 | 技术栈              | 何时使用      |
| ---------------------------------------------------- | ------------------- | ------------- |
| [nextjs-fullstack](nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | 全栈 web 应用 |
| [nextjs-saas](nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS 产品     |
| [nextjs-static](nextjs-static/TEMPLATE.md)           | Next.js + Framer    | 落地页        |
| [express-api](express-api/TEMPLATE.md)               | Express + JWT       | REST API      |
| [python-fastapi](python-fastapi/TEMPLATE.md)         | FastAPI             | Python API    |
| [react-native-app](react-native-app/TEMPLATE.md)     | Expo + Zustand      | 移动应用      |
| [flutter-app](flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | 跨平台        |
| [electron-desktop](electron-desktop/TEMPLATE.md)     | Electron + React    | 桌面应用      |
| [chrome-extension](chrome-extension/TEMPLATE.md)     | Chrome MV3          | 浏览器扩展    |
| [cli-tool](cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI 应用      |
| [monorepo-turborepo](monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo      |
| [astro-static](astro-static/TEMPLATE.md)             | Astro + MDX         | 博客 / 文档   |

---

## 用法

1. 用户说 "从头创建 [type] 应用"
2. 匹配到合适的模版
3. **仅**阅读该模版的 TEMPLATE.md
4. 遵循其技术栈和结构
