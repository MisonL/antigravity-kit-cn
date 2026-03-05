---
name: nextjs-fullstack
description: Next.js Full-Stack template（全栈模板）原则。App Router、Prisma、Tailwind v4。
---

# Next.js Full-Stack Template（全栈模板，2026 版）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） | Version / Notes（版本/说明） |
| --- | --- | --- |
| Framework（框架） | Next.js | v16+（App Router、Turbopack） |
| Language（语言） | TypeScript | v5+（Strict Mode，严格模式） |
| Database（数据库） | PostgreSQL | Prisma ORM（Serverless-friendly，适配 Serverless） |
| Styling（样式） | Tailwind CSS | v4.0（零配置，CSS-first） |
| Auth（认证） | Clerk / Better Auth | 中间件保护路由 |
| UI Logic（UI 逻辑） | React 19 | Server Actions、useActionState |
| Validation（验证） | Zod | Schema 校验（API & Forms） |

---

## Directory Structure（目录结构）

```
project-name/
├── prisma/
│   └── schema.prisma       # Database schema（数据库结构）
├── src/
│   ├── app/
│   │   ├── (auth)/         # 登录/注册路由组
│   │   ├── (dashboard)/    # 受保护路由
│   │   ├── api/            # Route Handlers（仅用于 Webhooks/外部集成）
│   │   ├── layout.tsx      # Root Layout（Metadata, Providers）
│   │   ├── page.tsx        # Landing Page（落地页）
│   │   └── globals.css     # Tailwind v4 配置（@theme 在此）
│   ├── components/
│   │   ├── ui/             # 可复用 UI（Button, Input）
│   │   └── forms/          # Client forms（useActionState）
│   ├── lib/
│   │   ├── db.ts           # Prisma singleton client（单例客户端）
│   │   ├── utils.ts        # Helper functions（辅助函数）
│   │   └── dal.ts          # Data Access Layer（仅服务端）
│   ├── actions/            # Server Actions（变更）
│   └── types/              # Global TS Types（类型）
├── public/
├── next.config.ts          # TypeScript Config（配置）
└── package.json
```

---

## Key Concepts（更新）

| Concept（概念） | Description（说明） |
| --- | --- |
| Server Components（服务端组件） | 在服务端渲染（默认）。无需 API 即可直接访问 Prisma。 |
| Server Actions（服务端动作） | 处理表单变更，替代传统 API Routes。用于 `action={}`。 |
| React 19 Hooks（钩子） | 表单状态管理：useActionState、useFormStatus、useOptimistic。 |
| Data Access Layer（数据访问层） | 数据安全。分离数据库逻辑（DTOs）以安全复用。 |
| Tailwind v4 | 样式引擎。无需 tailwind.config.js，在 CSS 中直接配置。 |

---

## Environment Variables（环境变量）

| Variable（变量） | Purpose（用途） |
| --- | --- |
| DATABASE_URL | PostgreSQL connection string（Prisma） |
| NEXT_PUBLIC_APP_URL | Public application URL（公共应用 URL） |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Auth（使用 Clerk 时） |
| CLERK_SECRET_KEY | Auth secret（仅服务端） |

---

## Setup Steps（设置步骤）

1. Initialize Project（初始化项目）：
   ```bash
   npx create-next-app@latest my-app --typescript --tailwind --eslint
   # 选择 Yes（App Router）
   # 选择 No（src 目录）（可选，本模板使用 src）
   ```

2. Install DB & Validation（安装数据库与校验）：
   ```bash
   npm install prisma @prisma/client zod
   npm install -D ts-node # 用于运行 seed 脚本
   ```

3. Configure Tailwind v4（如缺失）：
   确保 `src/app/globals.css` 使用新的导入语法，而不是配置文件：
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: oklch(0.5 0.2 240);
     --font-sans: "Inter", sans-serif;
   }
   ```

4. Initialize Database（初始化数据库）：
   ```bash
   npx prisma init
   # 更新 schema.prisma
   npm run db:push
   ```

5. 启动开发服务器：
   ```bash
   npm run dev --turbo
   # --turbo 启用更快的 Turbopack
   ```

---

## 最佳实践（2026 标准）

- **获取数据（Fetch Data）**：在 Server Components 中直接调用 Prisma（async/await），不要用 useEffect 获取初始数据。
- **变更（Mutations）**：使用 Server Actions + React 19 的 `useActionState` 处理加载与错误状态，避免手动 useState。
- **类型安全（Type Safety）**：在 Server Actions（输入验证）与客户端表单之间共享 Zod schema。
- **安全（Security）**：将数据传给 Prisma 前必须用 Zod 验证输入。
- **样式（Styling）**：在 Tailwind v4 中使用原生 CSS 变量，便于动态主题。
