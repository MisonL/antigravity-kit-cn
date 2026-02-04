---
name: nextjs-saas
description: Next.js SaaS 模版原则 (2026 标准)。React 19, Server Actions, Auth.js v6。
---

# Next.js SaaS 模版 (2026 更新)

## 技术栈

| 组件   | 技术            | 版本 / 备注                              |
| ------ | --------------- | ---------------------------------------- |
| 核心   | Next.js 16+     | App Router, Turbopack, 部分预渲染 (PPR)  |
| UI     | React 19        | Server Actions, useActionState, Compiler |
| 语言   | TypeScript      | 严格模式, TS 5.7+                        |
| 样式   | Tailwind CSS v4 | 使用 Oxide 引擎进行超快构建              |
| 数据库 | Postgres        | 托管在 Supabase 或 Neon                  |
| ORM    | Prisma          | 类型安全查询                             |
| 认证   | Auth.js v6      | (前身为 NextAuth), 无密码, OAuth         |
| 支付   | Stripe          | Embedded Checkout, Webhooks              |
| 邮件   | Resend          | 事务性邮件                               |

---

## 目录结构

针对 Server Actions 和基于功能的组织进行了优化。

```
project-name/
├── prisma/
│   └── schema.prisma    # 数据库 Schema
├── src/
│   ├── actions/         # NEW: Server Actions (替代用于数据变更的 API Routes)
│   │   ├── auth-actions.ts
│   │   ├── billing-actions.ts
│   │   └── user-actions.ts
│   ├── app/
│   │   ├── (auth)/      # 路由组: 登录, 注册
│   │   ├── (dashboard)/ # 路由组: 受保护路由 (应用布局)
│   │   ├── (marketing)/ # 路由组: 落地页, 定价 (营销布局)
│   │   └── api/         # 仅用于 Webhooks 或 Edge 情况
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── emails/      # React Email 模版
│   │   ├── forms/       # 使用 useActionState 的客户端组件 (React 19)
│   │   └── ui/          # Shadcn UI
│   ├── lib/
│   │   ├── auth.ts      # Auth.js v6 配置
│   │   ├── db.ts        # Prisma 单例
│   │   └── stripe.ts    # Stripe 单例
│   └── styles/
│       └── globals.css  # Tailwind v4 导入 (仅 CSS)
└── package.json
```

---

## SaaS 功能

| 功能          | 实现                              |
| ------------- | --------------------------------- |
| Auth          | Auth.js v6 + Passkeys + OAuth     |
| Data Mutation | Server Actions (无 API routes)    |
| Subscriptions | Stripe Checkout & Customer Portal |
| Webhooks      | 异步 Stripe 事件处理              |
| Email         | 通过 Resend 发送事务性邮件        |
| Validation    | Zod (服务端验证)                  |

---

## 数据库 Schema

| 模型    | 字段 (关键字段)                                   |
| ------- | ------------------------------------------------- |
| User    | id, email, stripeCustomerId, subscriptionId, plan |
| Account | OAuth 提供商数据 (Google, GitHub...)              |
| Session | 用户会话 (数据库策略)                             |

---

## 环境变量

| 变量                  | 目的                              |
| --------------------- | --------------------------------- |
| DATABASE_URL          | Prisma 连接字符串 (Postgres)      |
| AUTH_SECRET           | 替代 NEXTAUTH_SECRET (Auth.js v6) |
| STRIPE_SECRET_KEY     | 支付 (服务端)                     |
| STRIPE_WEBHOOK_SECRET | Webhook 验证                      |
| RESEND_API_KEY        | 邮件发送                          |
| NEXT_PUBLIC_APP_URL   | 应用程序规范 URL                  |

---

## 设置步骤

1. 初始化项目 (Node 24):

    ```bash
    npx create-next-app@latest {{name}} --typescript --eslint
    ```

2. 安装核心库:

    ```bash
    npm install next-auth@beta stripe resend @prisma/client
    ```

3. 安装 Tailwind v4 (添加到 globals.css):

    ```css
    @import "tailwindcss";
    ```

4. 配置环境 (.env.local)

5. 同步数据库:

    ```bash
    npx prisma db push
    ```

6. 运行本地 Webhook:

    ```bash
    npm run stripe:listen
    ```

7. 运行项目:
    ```bash
    npm run dev
    ```
