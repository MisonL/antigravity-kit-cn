---
name: nextjs-saas
description: Next.js SaaS 模板原则（2026 标准）。React 19、Server Actions、Auth.js v6。
---

# Next.js SaaS Template（2026 更新）

## Tech Stack（技术栈）

| Component | Technology | Version / Notes |
| --- | --- | --- |
| Framework（框架） | Next.js | v16+（App Router, React Compiler） |
| Runtime（运行时） | Node.js | v24（Krypton LTS） |
| Auth（认证） | Auth.js | v6（formerly NextAuth / 前身 NextAuth） |
| Payments（支付） | Stripe API | Latest（最新） |
| Database（数据库） | PostgreSQL | Prisma v6（Serverless Driver / 无服务器驱动） |
| Email（邮件） | Resend | React Email |
| UI | Tailwind CSS | v4（Oxide Engine / 氧化引擎，无配置文件） |

---

## Directory Structure（目录结构）

```
project-name/
├── prisma/
│   └── schema.prisma    # Database Schema（数据库结构）
├── src/
│   ├── actions/         # NEW: Server Actions（替代用于数据变更的 API Routes）
│   │   ├── auth-actions.ts
│   │   ├── billing-actions.ts
│   │   └── user-actions.ts
│   ├── app/
│   │   ├── (auth)/      # Route Group: Login, register（登录/注册）
│   │   ├── (dashboard)/ # Route Group: Protected routes（应用布局）
│   │   ├── (marketing)/ # Route Group: Landing, pricing（营销布局）
│   │   └── api/         # 仅用于 Webhooks 或 Edge 情况
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── emails/      # React Email templates（邮件模板）
│   │   ├── forms/       # Client components（useActionState, React 19）
│   │   └── ui/          # Shadcn UI
│   ├── lib/
│   │   ├── auth.ts      # Auth.js v6 config（配置）
│   │   ├── db.ts        # Prisma Singleton（单例）
│   │   └── stripe.ts    # Stripe Singleton（单例）
│   └── styles/
│       └── globals.css  # Tailwind v4 imports（CSS only）
└── package.json
```

---

## SaaS Features（SaaS 功能）

| Feature | Implementation |
| --- | --- |
| Auth | Auth.js v6 + Passkeys + OAuth |
| Data Mutation | Server Actions（不使用 API routes） |
| Subscriptions | Stripe Checkout & Customer Portal |
| Webhooks | 异步 Stripe 事件处理 |
| Email | Transactional via Resend（事务性邮件） |
| Validation | Zod（服务端验证） |

---

## Database Schema（数据库结构）

| Model | Fields（Key fields / 关键字段） |
| --- | --- |
| User | id, email, stripeCustomerId, subscriptionId, plan |
| Account | OAuth provider data（Google, GitHub...） |
| Session | User sessions（Database strategy） |

---

## Environment Variables（环境变量）

| Variable | Purpose |
| --- | --- |
| DATABASE_URL | Prisma connection string（Postgres） |
| AUTH_SECRET | Replaces NEXTAUTH_SECRET（Auth.js v6） |
| STRIPE_SECRET_KEY | Payments（Server-side / 服务端） |
| STRIPE_WEBHOOK_SECRET | Webhook verification（校验） |
| RESEND_API_KEY | Email sending（邮件发送） |
| NEXT_PUBLIC_APP_URL | Application Canonical URL（规范 URL） |

---

## Setup Steps（设置步骤）

1. Initialize project（初始化项目，Node 24）:
   ```bash
   npx create-next-app@latest {{name}} --typescript --eslint
   ```

2. Install core libraries（安装核心库）:
   ```bash
   npm install next-auth@beta stripe resend @prisma/client
   ```

3. Install Tailwind v4（添加到 globals.css）:
   ```css
   @import "tailwindcss";
   ```

4. Configure environment（配置 .env.local）

5. Sync Database（同步数据库）:
   ```bash
   npx prisma db push
   ```

6. Run local Webhook（运行本地 Webhook）:
   ```bash
   npm run stripe:listen
   ```

7. Run project（运行项目）:
   ```bash
   npm run dev
   ```
