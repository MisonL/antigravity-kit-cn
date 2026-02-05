---
name: app-builder
description: 应用程序构建编排器，负责项目初始化和脚手架生成
---

# 应用构建器 (App Builder)

此技能是 `/create` 工作流的核心引擎。它负责根据用户需求选择正确的技术栈并生成初始代码。

## 支持的模版类型

### 1. Web 应用 (Web App)

- **Stack**: Next.js (App Router) + Tailwind CSS + Shadcn/UI
- **适用**: 仪表盘、SaaS、官网。

### 2. API 服务 (Backend API)

- **Stack**: ElysiaJS (Bun) 或 NestJS
- **适用**: 微服务、独立后端。

### 3. 移动应用 (Mobile App)

- **Stack**: React Native (Expo)
- **适用**: iOS/Android 原生应用。

### 4. 命令行工具 (CLI)

- **Stack**: Node.js + Commander + Inquirer
- **适用**: 开发者工具、脚本。

## 构建步骤

1. **结构生成**: 创建文件夹结构。
2. **依赖配置**: 生成 `package.json`。
3. **配置初始化**: 生成 `tsconfig.json`, `.eslintrc`, `tailwind.config.js`。
4. **基础代码**: 写入 `main.ts` 或 `app/page.tsx`。

## 最佳实践

- **Bun 优先**: 默认使用 Bun 作为运行时和包管理器。
- **TypeScript**: 默认开启严格模式。
- **Monorepo**: 如果涉及多个包，推荐使用 Workspaces。
