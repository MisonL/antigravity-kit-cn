# Project Scaffolding（项目脚手架）

> 新项目的目录结构与核心文件。

---

## Next.js Full-Stack Structure（2025 优化版）

```
project-name/
├── src/
│   ├── app/                        # Routes only（仅路由层，薄层）
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/                 # Route group（路由分组）- 认证页面
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/            # Route group（路由分组）- 仪表盘布局
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [resource]/route.ts
│   │
│   ├── features/                   # Feature-based modules（按功能模块）
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/              # Hooks（钩子）
│   │   │   ├── actions.ts          # Server Actions（服务端动作）
│   │   │   ├── queries.ts          # Data fetching（数据获取）
│   │   │   └── types.ts
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── actions.ts
│   │   │   └── queries.ts
│   │   └── cart/
│   │       └── ...
│   │
│   ├── shared/                     # Shared utilities（共享工具）
│   │   ├── components/ui/          # Reusable UI components（可复用 UI 组件）
│   │   ├── lib/                    # Utils / helpers（工具/辅助）
│   │   └── hooks/                  # Global hooks（全局钩子）
│   │
│   └── server/                     # Server-only code（仅服务器端代码）
│       ├── db/                     # Database client（Prisma）
│       ├── auth/                   # Auth config（认证配置）
│       └── services/               # External API integrations（外部 API 集成）
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

## Structure Principles（结构原则）

| Principle（原则） | Implementation（实现方式） |
| --- | --- |
| **Feature isolation（功能隔离）** | 每个功能在 `features/` 下拥有自己的组件、hooks（钩子）、actions |
| **Server/Client separation（服务端/客户端分离）** | 仅服务器端代码放在 `server/`，防止客户端误导入 |
| **Thin routes（薄路由层）** | `app/` 仅负责路由，逻辑存放在 `features/` |
| **Route groups（路由分组）** | 使用 `(groupName)/` 共享布局而不影响 URL |
| **Shared code（共享代码）** | `shared/` 存放真正可复用的 UI 与工具函数 |

---

## Core Files（核心文件）

| File | Purpose |
| --- | --- |
| `package.json` | 依赖管理 |
| `tsconfig.json` | TypeScript 配置与路径别名（`@/features/*`） |
| `tailwind.config.ts` | Tailwind CSS 配置 |
| `.env.example` | 环境变量模板 |
| `README.md` | 项目文档 |
| `.gitignore` | Git 忽略规则 |
| `prisma/schema.prisma` | Database schema（数据库结构） |

---

## Path Aliases（tsconfig.json）

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

## When to Use What（使用位置指引）

| Need（需求） | Location（位置） |
| --- | --- |
| 新页面/路由 | `app/(group)/page.tsx` |
| 功能组件 | `features/[name]/components/` |
| Server action（服务端动作） | `features/[name]/actions.ts` |
| Data fetching（数据获取） | `features/[name]/queries.ts` |
| 可复用按钮/输入框 | `shared/components/ui/` |
| 数据库查询 | `server/db/` |
| 外部 API 调用 | `server/services/` |
