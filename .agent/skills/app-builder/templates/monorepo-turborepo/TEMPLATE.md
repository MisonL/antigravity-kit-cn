---
name: monorepo-turborepo
description: Turborepo monorepo 模板原则。pnpm workspaces（工作区）、共享包。
---

# Turborepo Monorepo Template（单仓多包）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Build System（构建系统） | Turborepo |
| Package Manager（包管理器） | pnpm |
| Apps（应用） | Next.js, Express |
| Packages（包） | Shared UI, Config, Types |
| Language（语言） | TypeScript |

---

## Directory Structure（目录结构）

```
project-name/
├── apps/
│   ├── web/             # Next.js app（应用）
│   ├── api/             # Express API
│   └── docs/            # Documentation（文档）
├── packages/
│   ├── ui/              # Shared components（共享组件）
│   ├── config/          # ESLint、TS、Tailwind
│   ├── types/           # Shared types（共享类型）
│   └── utils/           # Shared utilities（共享工具）
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Key Concepts（关键概念）

| Concept | Description |
| --- | --- |
| Workspaces | pnpm-workspace.yaml |
| Pipeline | turbo.json task graph |
| Caching | Remote/local task caching |
| Dependencies | `workspace:*` protocol |

---

## Turbo Pipeline（任务管道）

| 任务 | 依赖于 |
| ---- | ------ |
| build | ^build（依赖优先） |
| dev | cache: false, persistent |
| lint | ^build |
| test | ^build |

---

## Setup Steps（设置步骤）

1. Create root directory（创建根目录）
2. `pnpm init`
3. 创建 pnpm-workspace.yaml
4. 创建 turbo.json
5. 添加应用和包
6. `pnpm install`
7. `pnpm dev`

---

## Common Commands（常用命令）

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps（运行全部应用） |
| `pnpm build` | Build all（构建全部） |
| `pnpm --filter @name/web dev` | Run specific app（运行指定应用） |
| `pnpm --filter @name/web add axios` | Add dep to app（添加依赖） |

---

## Best Practices（最佳实践）

- 在 packages/config 中共享配置
- 在 packages/types 中共享类型
- 内部包使用 `workspace:*`
- 在 CI 中使用 Turbo 远程缓存
