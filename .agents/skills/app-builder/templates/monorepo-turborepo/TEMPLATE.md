---
name: monorepo-turborepo
description: Turborepo monorepo template principles（模板原则）。pnpm workspaces（工作区）、shared packages（共享包）。
---

# Turborepo Monorepo Template（模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Build System（构建系统） | Turborepo |
| Package Manager（包管理器） | pnpm |
| Apps（应用） | Next.js、Express |
| Packages（包） | Shared UI, Config, Types（共享 UI/配置/类型） |
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
│   ├── config/          # ESLint, TS, Tailwind
│   ├── types/           # Shared types（共享类型）
│   └── utils/           # Shared utilities（共享工具）
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Key Concepts（关键概念）

| Concept（概念） | Description（说明） |
| --- | --- |
| Workspaces（工作区） | pnpm-workspace.yaml |
| Pipeline（管道） | turbo.json task graph（任务图） |
| Caching（缓存） | Remote/local task caching（远程/本地任务缓存） |
| Dependencies（依赖） | `workspace:*` protocol（协议） |

---

## Turbo Pipeline（任务管道）

| Task（任务） | Depends On（依赖） |
| --- | --- |
| build | ^build (dependencies first)（依赖优先） |
| dev | cache: false, persistent（不缓存，常驻） |
| lint | ^build |
| test | ^build |

---

## Setup Steps（设置步骤）

1. Create root directory（创建根目录）
2. `pnpm init`
3. Create pnpm-workspace.yaml（创建）
4. Create turbo.json（创建）
5. Add apps and packages（添加应用与包）
6. `pnpm install`
7. `pnpm dev`

---

## Common Commands（常用命令）

| Command（命令） | Description（说明） |
| --- | --- |
| `pnpm dev` | Run all apps（运行全部应用） |
| `pnpm build` | Build all（构建全部） |
| `pnpm --filter @name/web dev` | Run specific app（运行指定应用） |
| `pnpm --filter @name/web add axios` | Add dep to app（为应用添加依赖） |

---

## Best Practices（最佳实践）

- Shared configs in packages/config（共享配置）
- Shared types in packages/types（共享类型）
- Internal packages with `workspace:*`
- Use Turbo remote caching for CI（CI 远程缓存）
