---
name: nextjs-fullstack
description: Next.js 全栈模板原则。App Router（应用路由）、Prisma、Tailwind v4。
---

# Next.js Full-Stack Template（2026 版）

## Tech Stack（技术栈）

| Component | Technology | Version / Notes |
| --- | --- | --- |
| 框架（Framework） | Next.js | v16+（App Router, Turbopack） |
| 语言（Language） | TypeScript | v5+（Strict Mode / 严格模式） |
| 数据库（Database） | PostgreSQL | Prisma ORM（Serverless 友好） |
| 样式（Styling） | Tailwind CSS | v4.0（零配置，CSS 优先） |
| 认证（Auth） | Clerk / Better Auth | Middleware Protected Routes（中间件保护路由） |
| UI 逻辑（UI Logic） | React 19 | Server Actions（服务端动作）, useActionState |
| 验证（Validation） | Zod | Schema validation（模式校验，API & Forms） |

---

## 目录结构

```
project-name/
├── prisma/
│   └── schema.prisma       # Database schema（数据库结构）
├── src/
│   ├── app/
│   │   ├── (auth)/         # Route groups for Login/Register（登录/注册）
│   │   ├── (dashboard)/    # Protected routes（受保护路由）
│   │   ├── api/            # Route Handlers（仅 Webhooks/外部集成）
│   │   ├── layout.tsx      # Root Layout（Metadata, Providers）
│   │   ├── page.tsx        # Landing Page（落地页）
│   │   └── globals.css     # Tailwind v4 config（@theme 在此）
│   ├── components/
│   │   ├── ui/             # Reusable UI（Button, Input）
│   │   └── forms/          # Client forms（useActionState）
│   ├── lib/
│   │   ├── db.ts           # Prisma singleton client（单例客户端）
│   │   ├── utils.ts        # Helper functions（辅助函数）
│   │   └── dal.ts          # Data Access Layer（Server-only）
│   ├── actions/            # Server Actions（Mutations）
│   └── types/              # Global TS Types（全局类型）
├── public/
├── next.config.ts          # TypeScript Config（TS 配置）
└── package.json
```

---

## Key Concepts（已更新）

| Concept | Description |
| --- | --- |
| Server Components（服务端组件） | 在服务端渲染（默认）。无需 API 即可直接访问 DB（Prisma）。 |
| Server Actions（服务端操作） | 处理表单变更，替代传统 API Routes。用于 `action={}`。 |
| React 19 Hooks（钩子） | 表单状态管理：useActionState, useFormStatus, useOptimistic |
| Data Access Layer（数据访问层） | 数据安全。分离 DB 逻辑（DTOs）以安全复用。 |
| Tailwind v4 | 样式引擎。无 tailwind.config.js，直接在 CSS 中配置。 |

---

## Environment Variables（环境变量）

| Variable | Purpose |
| --- | --- |
| DATABASE_URL | PostgreSQL 连接字符串（Prisma） |
| NEXT_PUBLIC_APP_URL | 公共应用 URL |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | 认证（如果使用 Clerk） |
| CLERK_SECRET_KEY | 认证密钥（仅服务端） |

---

## Setup Steps（设置步骤）

1. Initialize Project（初始化项目）:

    ```bash
    npx create-next-app@latest my-app --typescript --tailwind --eslint
    # 选择 Yes（App Router）
    # 选择 No（src 目录）（可选，本模板使用 src）
    ```

2. Install DB & Validation（安装数据库与验证）:

    ```bash
    npm install prisma @prisma/client zod
    npm install -D ts-node # 用于运行 seed 脚本
    ```

3. Configure Tailwind v4（如果缺失）:
   确保 `src/app/globals.css` 使用新的导入语法，而不是配置文件：

    ```css
    @import "tailwindcss";

    @theme {
        --color-primary: oklch(0.5 0.2 240);
        --font-sans: "Inter", sans-serif;
    }
    ```

4. Initialize Database（初始化数据库）:

    ```bash
    npx prisma init
    # 更新 schema.prisma
    npm run db:push
    ```

5. Run Developer Server（启动开发服务器）:
    ```bash
    npm run dev --turbo
    # --turbo 启用更快的 Turbopack
    ```

---

## Best Practices（2026 标准）

- **Fetch Data（获取数据）**：在 Server Components 中直接调用 Prisma（async/await）。不要用 useEffect 做初始数据获取。
- **Mutations（变更）**：使用 Server Actions + React 19 的 `useActionState` 处理加载与错误状态，避免手动 useState。
- **Type Safety（类型安全）**：在 Server Actions（输入验证）与客户端表单之间共享 Zod schema。
- **Security（安全）**：传给 Prisma 前必须使用 Zod 验证输入数据。
- **Styling（样式）**：在 Tailwind v4 中使用原生 CSS 变量，便于动态主题。
