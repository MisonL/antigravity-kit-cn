# 技术栈选择（2026）

> Web 应用的默认与备选技术方案。

## 默认技术栈（Web App - 2026）

```yaml
前端（Frontend）:
  框架（Framework）: Next.js 16（Stable）
  语言（Language）: TypeScript 5.7+
  样式（Styling）: Tailwind CSS v4
  状态（State）: React 19 Actions / Server Components
  构建工具（Bundler）: Turbopack（开发稳定 / Stable for Dev）

后端（Backend）:
  运行时（Runtime）: Node.js 23
  框架（Framework）: Next.js API Routes / Hono（Edge / 边缘）
  校验（Validation）: Zod / TypeBox

数据库（Database）:
  主选（Primary）: PostgreSQL
  ORM: Prisma / Drizzle
  托管（Hosting）: Supabase / Neon

身份认证（Auth）:
  提供商（Provider）: Auth.js（v5） / Clerk

Monorepo:
  工具（Tool）: Turborepo 2.0
```

## 替代选项

| 需求 | 默认 | 替代方案 |
| --- | --- | --- |
| 实时（Real-time） | - | Supabase Realtime, Socket.io |
| 文件存储（File storage） | - | Cloudinary, S3 |
| 支付（Payment） | Stripe | LemonSqueezy, Paddle |
| 邮件（Email） | - | Resend, SendGrid |
| 搜索（Search） | - | Algolia, Typesense |
