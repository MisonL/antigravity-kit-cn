---
name: nuxt-app
description: Nuxt 4 Full-Stack template（全栈模板）。Vue 3（Vapor Mode，蒸汽模式）、Pinia、Tailwind v4、Prisma。
---

# Nuxt 4 Full-Stack Template（全栈模板，2026 版）

Nuxt 4 的现代全栈模板，使用 Vapor Mode（蒸汽模式）与 Tailwind v4 优化性能。

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） | Version / Notes（版本/说明） |
| --- | --- | --- |
| Framework（框架） | Nuxt | v4.0+（App Directory（应用目录）结构） |
| UI Engine（UI 引擎） | Vue | v3.6+（启用 Vapor Mode） |
| Language（语言） | TypeScript | v5+（Strict Mode，严格模式） |
| State（状态） | Pinia | v3+（Store syntax（Store 语法）） |
| Database（数据库） | PostgreSQL | Prisma ORM（对象关系映射） |
| Styling（样式） | Tailwind CSS | v4.0（Vite 插件，零配置） |
| UI Lib（组件库） | Nuxt UI | v3（Tailwind v4 原生） |
| Validation（校验） | Zod | Schema validation（模式校验） |

---

## Directory Structure（Nuxt 4 标准）

使用 `app/` 结构保持根目录整洁。

```
project-name/
├── app/                  # Application Source（应用源码）
│   ├── assets/
│   │   └── css/
│   │       └── main.css  # Tailwind v4 导入
│   ├── components/       # Auto-imported components（自动导入组件）
│   ├── composables/      # Auto-imported logic（自动导入逻辑）
│   ├── layouts/
│   ├── pages/            # File-based routing（基于文件路由）
│   ├── app.vue           # Root component（根组件）
│   └── router.options.ts
├── server/               # Nitro Server Engine（服务端引擎）
│   ├── api/              # API Routes（接口路由，例如 /api/users）
│   ├── routes/           # Server Routes（服务端路由）
│   └── utils/            # Server-only helpers（仅服务端辅助，Prisma）
├── prisma/
│   └── schema.prisma
├── public/
├── nuxt.config.ts        # Main Config（主配置）
└── package.json
```

---

## Key Concepts（2026）

| Concept（概念） | Description（说明） | Future Update（未来更新） |
| --- | --- | --- |
| **App Directory（应用目录）** | `app/` | 分离应用源码与根配置文件。 |
| **Vapor Mode（蒸汽模式）** | 性能优先 | 无需 Virtual DOM（虚拟 DOM，类似 SolidJS）。在 `nuxt.config` 中启用。 |
| **Server Functions（服务端函数）** | RPC 风格调用 | 从客户端直接调用服务端函数（逐步替代手写 API routes（API 路由））。 |
| **Tailwind v4** | CSS-first | 主题直接在 CSS 中配置，无需 `tailwind.config.js`。 |
| **Nuxt Islands（岛屿组件）** | Server Components（服务端组件） | 在服务端隔离渲染组件（`<NuxtIsland name="..." />`）。 |

---

## Environment Variables（环境变量）

| Variable（变量） | Purpose（用途） |
| --- | --- |
| DATABASE_URL | Prisma connection string（PostgreSQL 连接字符串） |
| NUXT_PUBLIC_APP_URL | Canonical URL（规范 URL） |
| NUXT_SESSION_PASSWORD | Session encryption key（会话加密密钥） |

---

## Setup Steps（设置步骤）

1. Initialize Project（初始化项目）：
   ```bash
   npx nuxi@latest init my-app
   # 如有提示，选择 "Nuxt 4 structure"
   ```

2. Install Core Deps（安装核心依赖）：
   ```bash
   npm install @pinia/nuxt @prisma/client zod
   npm install -D prisma
   ```

3. Setup Tailwind v4（设置 Tailwind v4）：
   安装 Vite 插件（新标准）：
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

   添加到 `nuxt.config.ts`：
   ```ts
   import tailwindcss from '@tailwindcss/vite'
   export default defineNuxtConfig({
     vite: {
       plugins: [tailwindcss()]
     },
     css: ['~/assets/css/main.css']
   })
   ```

4. Configure CSS（配置 CSS）：
   在 `app/assets/css/main.css` 中：
   ```css
   @import "tailwindcss";
   @theme {
     --color-primary: oklch(0.6 0.15 150);
   }
   ```

5. 开发运行：
   ```bash
   npm run dev
   # 使用 Turbo/Vite 运行
   ```

---

## 最佳实践

- **Vapor Mode（Vapor 模式）**：为渲染密集型组件启用：
  ```ts
  <script setup lang="ts" vapor>
  // 此组件会编译为 Vapor 模式（无 VDOM）
  </script>
  ```
- **Data Fetching（数据获取）**：对仅客户端任务使用 `useFetch` + `server: false`，或使用 Server Functions 获得更好的类型安全。
- **State（状态）**：使用 `defineStore`（Pinia）管理全局状态，Nuxt 的 `useState` 用于服务端/客户端共享的简单状态。
- **Type Safety（类型安全）**：为 API routes（API 路由）自动生成类型（`$fetch` 自动类型化）。
