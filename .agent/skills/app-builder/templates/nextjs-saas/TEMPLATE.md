---
name: nextjs-saas
description: Next.js SaaS template（SaaS 模板）原则（2026 Standards，2026 标准）。React 19、Server Actions（服务端动作）、Auth.js v6。
---

# Next.js SaaS Template（2026 更新）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） | Version / Notes（版本/说明） |
| --- | --- | --- |
| Framework（框架） | Next.js | v16+（App Router、React Compiler（编译器）） |
| Runtime（运行时） | Node.js | v24（Krypton LTS） |
| Auth（认证） | Auth.js | v6（原名 NextAuth） |
| Payments（支付） | Stripe API | Latest（最新） |
| Database（数据库） | PostgreSQL | Prisma v6（Serverless Driver，无服务器驱动） |
| Email（邮件） | Resend | React Email（邮件模板） |
| UI（界面） | Tailwind CSS | v4（Oxide Engine、无配置文件） |

---

## Directory Structure（目录结构）

```
project-name/
├── prisma/
│   └── schema.prisma    # Database Schema（数据库 Schema）
├── src/
│   ├── actions/         # NEW: Server Actions（用于数据变更，替代 API Routes（API 路由））
│   │   ├── auth-actions.ts
│   │   ├── billing-actions.ts
│   │   └── user-actions.ts
│   ├── app/
│   │   ├── (auth)/      # Route Group（路由组）：登录、注册
│   │   ├── (dashboard)/ # Route Group（路由组）：受保护路由（应用布局）
│   │   ├── (marketing)/ # Route Group（路由组）：落地页、价格（营销布局）
│   │   └── api/         # 仅用于 Webhooks（回调）或 Edge cases（边缘场景）
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── emails/      # React Email templates（邮件模板）
│   │   ├── forms/       # 使用 useActionState 的 Client components（客户端组件）（React 19）
│   │   └── ui/          # Shadcn UI（组件库）
│   ├── lib/
│   │   ├── auth.ts      # Auth.js v6 config（配置）
│   │   ├── db.ts        # Prisma Singleton（单例）
│   │   └── stripe.ts    # Stripe Singleton（单例）
│   └── styles/
│       └── globals.css  # Tailwind v4 导入（仅 CSS）
└── package.json
```

---

## SaaS Features（SaaS 功能）

| Feature（功能） | Implementation（实现） |
| --- | --- |
| Auth（认证） | Auth.js v6 + Passkeys（通行密钥） + OAuth（授权） |
| Data Mutation（数据变更） | Server Actions（不使用 API routes（API 路由）） |
| Subscriptions（订阅） | Stripe Checkout & Customer Portal（结算与客户门户） |
| Webhooks（回调） | 异步处理 Stripe 事件 |
| Email（邮件） | 通过 Resend 发送事务邮件 |
| Validation（校验） | Zod（服务端校验） |

---

## Database Schema（数据库结构）

| Model（模型） | Fields（字段，关键字段） |
| --- | --- |
| User | id, email, stripeCustomerId, subscriptionId, plan |
| Account | OAuth provider data（OAuth 提供方数据，Google, GitHub...） |
| Session | 用户会话（Database strategy，数据库策略） |

---

## Environment Variables（环境变量）

| Variable（变量） | Purpose（用途） |
| --- | --- |
| DATABASE_URL | Prisma 连接字符串（Postgres） |
| AUTH_SECRET | 替代 NEXTAUTH_SECRET（Auth.js v6） |
| STRIPE_SECRET_KEY | Payments（支付，服务端） |
| STRIPE_WEBHOOK_SECRET | Webhook 校验 |
| RESEND_API_KEY | 邮件发送 |
| NEXT_PUBLIC_APP_URL | 应用规范 URL |

---

## Setup Steps（设置步骤）

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
