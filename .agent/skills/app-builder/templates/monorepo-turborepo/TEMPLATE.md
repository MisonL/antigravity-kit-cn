---
name: monorepo-turborepo
description: Turborepo monorepo 模版原则。pnpm workspaces（工作区）、共享包。
---

# Turborepo Monorepo 模版（单仓多包）

## 技术栈

| 组件 | 技术 |
| ---- | ---- |
| 构建系统 | Turborepo |
| 包管理器 | pnpm |
| 应用 | Next.js, Express |
| 包 | 共享 UI、配置、类型 |
| 语言 | TypeScript |

---

## 目录结构

```
project-name/
├── apps/
│   ├── web/             # Next.js 应用
│   ├── api/             # Express API
│   └── docs/            # 文档
├── packages/
│   ├── ui/              # 共享组件
│   ├── config/          # ESLint、TS、Tailwind
│   ├── types/           # 共享类型
│   └── utils/           # 共享实用程序
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 关键概念

| 概念 | 描述 |
| ---- | ---- |
| Workspaces（工作区） | pnpm-workspace.yaml |
| Pipeline（管道） | turbo.json 任务图 |
| Caching（缓存） | 远程/本地任务缓存 |
| Dependencies（依赖） | `workspace:*` 协议 |

---

## Turbo 管道（Pipeline）

| 任务 | 依赖于 |
| ---- | ------ |
| build | ^build（依赖优先） |
| dev | cache: false, persistent |
| lint | ^build |
| test | ^build |

---

## 设置步骤

1. 创建根目录
2. `pnpm init`
3. 创建 pnpm-workspace.yaml
4. 创建 turbo.json
5. 添加应用和包
6. `pnpm install`
7. `pnpm dev`

---

## 常用命令

| 命令 | 描述 |
| ---- | ---- |
| `pnpm dev` | 运行所有应用 |
| `pnpm build` | 构建所有 |
| `pnpm --filter @name/web dev` | 运行特定应用 |
| `pnpm --filter @name/web add axios` | 将依赖添加到应用 |

---

## 最佳实践

- 在 packages/config 中共享配置
- 在 packages/types 中共享类型
- 内部包使用 `workspace:*`
- 使用 Turbo 远程缓存进行 CI（持续集成）
