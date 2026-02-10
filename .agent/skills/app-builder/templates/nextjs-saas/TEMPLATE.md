---
name: nextjs-saas
description: Next.js SaaS 模板原则（2026 标准）。React 19、Server Actions、Auth.js v6。
---

# Next.js SaaS 模板（2026 更新）

## 技术栈

| 组件 | 技术 | 版本/说明 |
| --- | --- | --- |
| 框架 | Next.js | v16+（App Router、React Compiler（编译器）） |
| 运行时 | Node.js | v24（Krypton LTS） |
| 认证 | Auth.js | v6（原名 NextAuth） |
| 支付 | Stripe API | Latest（最新） |
| 数据库 | PostgreSQL | Prisma v6（Serverless Driver，无服务器驱动） |
| 邮件 | Resend | React Email（邮件模板） |
| UI | Tailwind CSS | v4（Oxide Engine、无配置文件） |

---

## 目录结构

```
project-name/
├── prisma/
│   └── schema.prisma    # 数据库 Schema
├── src/
│   ├── actions/         # NEW: Server Actions（替代用于数据变更的 API Routes（API 路由））
│   │   ├── auth-actions.ts
│   │   ├── billing-actions.ts
│   │   └── user-actions.ts
│   ├── app/
│   │   ├── (auth)/      # 路由组：登录、注册
│   │   ├── (dashboard)/ # 路由组：受保护路由（应用布局）
│   │   ├── (marketing)/ # 路由组：落地页、价格（营销布局）
│   │   └── api/         # 仅用于 Webhooks 或 Edge 情况
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── emails/      # React Email 模板
│   │   ├── forms/       # 使用 useActionState 的客户端组件（React 19）
│   │   └── ui/          # Shadcn UI
│   ├── lib/
│   │   ├── auth.ts      # Auth.js v6 配置
│   │   ├── db.ts        # Prisma 单例
│   │   └── stripe.ts    # Stripe 单例
│   └── styles/
│       └── globals.css  # Tailwind v4 导入（仅 CSS）
└── package.json
```

---

## SaaS 功能

| 功能 | 实现 |
| --- | --- |
| 认证 | Auth.js v6 + Passkeys + OAuth |
| 数据变更 | Server Actions（不使用 API routes（API 路由）） |
| 订阅 | Stripe Checkout & Customer Portal（结算与客户门户） |
| Webhooks | 异步 Stripe 事件处理 |
| 邮件 | 通过 Resend 发送事务邮件 |
| 校验 | Zod（服务端校验） |

---

## 数据库结构

| 模型 | 字段（关键字段） |
| --- | --- |
| User | id, email, stripeCustomerId, subscriptionId, plan |
| Account | OAuth 提供方数据（Google, GitHub...） |
| Session | 用户会话（Database strategy，数据库策略） |

---

## 环境变量

| 变量 | 用途 |
| --- | --- |
| DATABASE_URL | Prisma 连接字符串（Postgres） |
| AUTH_SECRET | 替代 NEXTAUTH_SECRET（Auth.js v6） |
| STRIPE_SECRET_KEY | 支付（Server-side） |
| STRIPE_WEBHOOK_SECRET | Webhook 校验 |
| RESEND_API_KEY | 邮件发送 |
| NEXT_PUBLIC_APP_URL | 应用规范 URL |

---

## 设置步骤

1. 初始化项目（Node 24）：
   ```bash
   npx create-next-app@latest {{name}} --typescript --eslint
   ```

2. 安装核心库：
   ```bash
   npm install next-auth@beta stripe resend @prisma/client
   ```

3. 安装 Tailwind v4（添加到 globals.css）：
   ```css
   @import "tailwindcss";
   ```

4. 配置环境变量（.env.local）

5. 同步数据库：
   ```bash
   npx prisma db push
   ```

6. 运行本地 Webhook：
   ```bash
   npm run stripe:listen
   ```

7. 运行项目：
   ```bash
   npm run dev
   ```
