# ORM 选择 (ORM Selection - 2025)

> 根据部署需求和开发体验 (DX) 选择 ORM。

## 决策树 (Decision Tree)

```
开发背景是什么？
│
├── 边缘部署 (Edge) / 关注包体积
│   └── Drizzle (体积最小, 贴近 SQL 语法)
│
├── 最佳开发体验 (DX) / Schema 优先
│   └── Prisma (自带迁移工具和可视化 Studio)
│
├── 追求最大控制权
│   └── 原始 SQL 配合查询构造器 (Query builder)
│
└── Python 生态
    └── SQLAlchemy 2.0 (支持异步)
```

## 各 ORM 对比 (Comparison)

| ORM         | 最佳适用               | 权衡 (Trade-offs)        |
| ----------- | ---------------------- | ------------------------ |
| **Drizzle** | 边缘端环境, TypeScript | 相对较新, 生态示例较少   |
| **Prisma**  | 开发体验, Schema 管理  | 运行较重, 边缘端支持不佳 |
| **Kysely**  | 类型安全的 SQL 构造器  | 需要手动管理迁移         |
| **Raw SQL** | 复杂查询, 极致控制权   | 需要手动维护类型安全     |
