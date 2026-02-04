---
name: nextjs-fullstack
description: Next.js 全栈模版原则。App Router, Prisma, Tailwind v4。
---

# Next.js 全栈模版 (2026 版)

## 技术栈

| 组件    | 技术                | 版本 / 备注                     |
| ------- | ------------------- | ------------------------------- |
| 框架    | Next.js             | v16+ (App Router, Turbopack)    |
| 语言    | TypeScript          | v5+ (严格模式)                  |
| 数据库  | PostgreSQL          | Prisma ORM (对 Serverless 友好) |
| 样式    | Tailwind CSS        | v4.0 (零配置, CSS 优先)         |
| 认证    | Clerk / Better Auth | 中间件保护路由                  |
| UI 逻辑 | React 19            | Server Actions, useActionState  |
| 验证    | Zod                 | Schema 验证 (API & Forms)       |

---

## 目录结构

```
project-name/
├── prisma/
│   └── schema.prisma       # 数据库 schema
├── src/
│   ├── app/
│   │   ├── (auth)/         # 登录/注册的路由组
│   │   ├── (dashboard)/    # 受保护路由
│   │   ├── api/            # 路由处理程序 (仅用于 Webhooks/外部集成)
│   │   ├── layout.tsx      # 根布局 (Metadata, Providers)
│   │   ├── page.tsx        # 落地页
│   │   └── globals.css     # Tailwind v4 配置 (@theme) 位于此处
│   ├── components/
│   │   ├── ui/             # 可重用 UI (Button, Input)
│   │   └── forms/          # 使用 useActionState 的客户端表单
│   ├── lib/
│   │   ├── db.ts           # Prisma 单例客户端
│   │   ├── utils.ts        # 助手函数
│   │   └── dal.ts          # 数据访问层 (仅服务端)
│   ├── actions/            # Server Actions (Mutations)
│   └── types/              # 全局 TS 类型
├── public/
├── next.config.ts          # TypeScript 配置
└── package.json
```

---

## 关键概念 (已更新)

| 概念                           | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| Server Components (服务端组件) | 在服务端渲染 (默认)。无需 API 即可直接访问 DB (Prisma)。     |
| Server Actions (服务端操作)    | 处理表单变更。替代传统的 API Routes。在 action={} 中使用。   |
| React 19 Hooks                 | 表单状态管理: useActionState, useFormStatus, useOptimistic。 |
| Data Access Layer (数据访问层) | 数据安全。 分离 DB 逻辑 (DTOs) 以安全重用。                  |
| Tailwind v4                    | 样式引擎。无 tailwind.config.js。直接在 CSS 中配置。         |

---

## 环境变量

| 变量                              | 目的                           |
| --------------------------------- | ------------------------------ |
| DATABASE_URL                      | PostgreSQL 连接字符串 (Prisma) |
| NEXT_PUBLIC_APP_URL               | 公共应用 URL                   |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | 认证 (如果使用 Clerk)          |
| CLERK_SECRET_KEY                  | 认证密钥 (仅服务端)            |

---

## 设置步骤

1. 初始化项目:

    ```bash
    npx create-next-app@latest my-app --typescript --tailwind --eslint
    # 选择 Yes (App Router)
    # 选择 No (src 目录) (可选, 本模版使用 src)
    ```

2. 安装 DB & 验证:

    ```bash
    npm install prisma @prisma/client zod
    npm install -D ts-node # 用于运行 seed 脚本
    ```

3. 配置 Tailwind v4 (如果缺失):
   确保 `src/app/globals.css` 使用新的导入语法而不是配置文件:

    ```css
    @import "tailwindcss";

    @theme {
        --color-primary: oklch(0.5 0.2 240);
        --font-sans: "Inter", sans-serif;
    }
    ```

4. 初始化数据库:

    ```bash
    npx prisma init
    # 更新 schema.prisma
    npm run db:push
    ```

5. 运行开发服务器:
    ```bash
    npm run dev --turbo
    # --turbo 启用更快的 Turbopack
    ```

---

## 最佳实践 (2026 标准)

- **获取数据**: 在服务端组件中直接调用 Prisma (async/await)。不要使用 useEffect 进行初始数据获取。
- **变更**: 使用 Server Actions 结合 React 19 的 `useActionState` 来处理加载和错误状态，而不是手动的 useState。
- **类型安全**: 在 Server Actions (输入验证) 和客户端表单之间共享 Zod schema。
- **安全性**: 在传递给 Prisma 之前，始终使用 Zod 验证输入数据。
- **样式**: 在 Tailwind v4 中使用原生 CSS 变量以便更容易地进行动态主题设置。
