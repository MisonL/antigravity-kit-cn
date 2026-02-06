# 技术栈选择 (Tech Stack Selection - 2026)

> Web 应用程序的默认及备选技术方案。

## 默认技术栈 (Web App - 2026)

```yaml
前端 (Frontend):
    框架 (Framework): Next.js 16 (Stable)
    语言 (Language): TypeScript 5.7+
    样式 (Styling): Tailwind CSS v4
    状态管理 (State): React 19 Actions / Server Components
    构建工具 (Bundler): Turbopack (Stable for Dev)

后端 (Backend):
    运行时 (Runtime): Node.js 23
    框架 (Framework): Next.js API Routes / Hono (针对 Edge)
    校验 (Validation): Zod / TypeBox

数据库 (Database):
    主选 (Primary): PostgreSQL
    ORM: Prisma / Drizzle
    托管 (Hosting): Supabase / Neon

身份认证 (Auth):
    提供商 (Provider): Auth.js (v5) / Clerk

Monorepo:
    工具 (Tool): Turborepo 2.0
```

## 替代选项 (Alternative Options)

| 需求     | 默认   | 替代方案                     |
| -------- | ------ | ---------------------------- |
| 实时通讯 | -      | Supabase Realtime, Socket.io |
| 文件存储 | -      | Cloudinary, S3               |
| 支付系统 | Stripe | LemonSqueezy, Paddle         |
| 邮件服务 | -      | Resend, SendGrid             |
| 搜索功能 | -      | Algolia, Typesense           |
