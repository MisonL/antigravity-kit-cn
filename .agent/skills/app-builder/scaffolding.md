# 项目脚手架 (Project Scaffolding)

> 新项目的目录结构和核心文件。

---

## Next.js 全栈结构 (2025 优化版)

```
project-name/
├── src/
│   ├── app/                        # 仅路由层 (薄层)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/                 # 路由分组 - 认证页面
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/            # 路由分组 - 仪表盘布局
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [resource]/route.ts
│   │
│   ├── features/                   # 基于功能的模块
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions.ts          # Server Actions
│   │   │   ├── queries.ts          # 数据获取
│   │   │   └── types.ts
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── actions.ts
│   │   │   └── queries.ts
│   │   └── cart/
│   │       └── ...
│   │
│   ├── shared/                     # 共享公用代码
│   │   ├── components/ui/          # 可复用 UI 组件
│   │   ├── lib/                    # 工具函数, Helpers
│   │   └── hooks/                  # 全局 Hooks
│   │
│   └── server/                     # 仅限服务器端代码
│       ├── db/                     # 数据库客户端 (Prisma)
│       ├── auth/                   # 认证配置
│       └── services/               # 外部 API 集成
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 结构原则 (Structure Principles)

| 原则                             | 实现方式                                                  |
| -------------------------------- | --------------------------------------------------------- |
| **功能隔离 (Feature isolation)** | 每个功能在 `features/` 下拥有自己的组件、hooks、actions   |
| **服务器/客户端分离**            | 仅限服务器端的代码放在 `server/` 中，防止意外在客户端导入 |
| **薄路由层 (Thin routes)**       | `app/` 仅负责路由，逻辑存放在 `features/` 中              |
| **路由分组 (Route groups)**      | 使用 `(groupName)/` 共享布局而不影响 URL                  |
| **共享代码 (Shared code)**       | `shared/` 存放真正可复用的 UI 和工具函数                  |

---

## 核心文件 (Core Files)

| 文件                   | 用途                                       |
| ---------------------- | ------------------------------------------ |
| `package.json`         | 依赖管理                                   |
| `tsconfig.json`        | TypeScript 配置及路径别名 (`@/features/*`) |
| `tailwind.config.ts`   | Tailwind CSS 配置                          |
| `.env.example`         | 环境变量模板                               |
| `README.md`            | 项目文档                                   |
| `.gitignore`           | Git 忽略规则                               |
| `prisma/schema.prisma` | 数据库 Schema                              |

---

## 路径别名 (Path Aliases - tsconfig.json)

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"],
            "@/features/*": ["./src/features/*"],
            "@/shared/*": ["./src/shared/*"],
            "@/server/*": ["./src/server/*"]
        }
    }
}
```

---

## 何时使用何处 (When to Use What)

| 需求              | 位置                          |
| ----------------- | ----------------------------- |
| 新页面/路由       | `app/(group)/page.tsx`        |
| 功能组件          | `features/[name]/components/` |
| Server action     | `features/[name]/actions.ts`  |
| 数据获取          | `features/[name]/queries.ts`  |
| 可复用按钮/输入框 | `shared/components/ui/`       |
| 数据库查询        | `server/db/`                  |
| 外部 API 调用     | `server/services/`            |
