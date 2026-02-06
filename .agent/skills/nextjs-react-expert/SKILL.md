---
name: nextjs-react-expert
description: Next.js 与 React 性能优化、架构与渲染模式 (SSR/CSR/RSC)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js & React 专家

## 渲染模式选择

1.  **Server Components (RSC)**: **默认选择**。
    - 用于获取数据、访问数据库、保护密钥。
    - 零 Bundle Size。

2.  **Client Components ("use client")**:
    - 仅用于：交互 (onClick/onChange)、Hook (useState/useEffect)、浏览器 API。
    - 尽可能将 Client Component 下沉到组件树末端。

## 对比

| 特性            | Server Component | Client Component   |
| :-------------- | :--------------- | :----------------- |
| **数据获取**    | 直接 DB/API      | fetch/SWR/TanStack |
| **访问后端**    | ✅               | ❌                 |
| **交互性**      | ❌ (静态)        | ✅                 |
| **Bundle Size** | 0                | 增加               |

## 性能优化

- **next/image**: 必须使用。自动转换 WebP/AVIF，防止布局偏移 (CLS)。
- **next/font**: 自动优化字体加载，零布局偏移。
- **Dynamic Imports**: `next/dynamic` 懒加载重型组件。

## 目录结构 (App Router)

- `app/page.tsx`: 路由入口。
- `app/layout.tsx`: 共享布局。
- `app/loading.tsx`: 自动加载骨架屏。
- `app/error.tsx`: 错误边界。

## 上游脚本流程补充（reference 对齐）

- `python scripts/react_performance_checker.py <project_path>`

用于 React/Next.js 性能审计与重渲染热点检测。
建议在 `/test` 阶段纳入性能校验，并在 `/deploy` 前完成回归验证。
