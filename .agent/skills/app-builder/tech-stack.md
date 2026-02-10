# 技术栈选择（2026）

> Web App（Web 应用）的默认与备选技术方案。

## 默认技术栈（Web App - 2026）

```yaml
Frontend（前端）:
  framework（框架）: Next.js 16 (Stable)
  language（语言）: TypeScript 5.7+
  styling（样式）: Tailwind CSS v4
  state（状态）: React 19 Actions / Server Components
  bundler（构建工具）: Turbopack（Stable for Dev，开发稳定）

Backend（后端）:
  runtime（运行时）: Node.js 23
  framework（框架）: Next.js API Routes / Hono（Edge，边缘）
  validation（校验）: Zod / TypeBox

Database（数据库）:
  primary（主选）: PostgreSQL
  orm: Prisma / Drizzle
  hosting（托管）: Supabase / Neon

Auth（身份认证）:
  provider（提供商）: Auth.js（v5） / Clerk

Monorepo（多仓）:
  tool（工具）: Turborepo 2.0
```

## 替代选项

| Need（需求） | Default（默认） | Alternative（替代方案） |
| --- | --- | --- |
| Real-time（实时） | - | Supabase Realtime, Socket.io |
| File storage（文件存储） | - | Cloudinary, S3 |
| Payment（支付） | Stripe | LemonSqueezy, Paddle |
| Email（邮件） | - | Resend, SendGrid |
| Search（搜索） | - | Algolia, Typesense |
