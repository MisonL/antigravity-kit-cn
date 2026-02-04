# ORM 选择 (ORM Selection)

> 基于部署环境和开发体验 (DX) 选择 ORM。

## 决策树

```
上下文是什么？
│
├── 边缘部署 / 包体积敏感
│   └── Drizzle (最小，类 SQL)
│
├── 最佳 DX / Schema 优先
│   └── Prisma (强大的迁移工具, Studio)
│
├── 最大控制权
│   └── 原始 SQL 配合查询构造器
│
└── Python 生态
    └── SQLAlchemy 2.0 (支持异步)
```

## 对比

| ORM         | 最佳适用              | 权衡 (Trade-offs)  |
| :---------- | :-------------------- | :----------------- |
| **Drizzle** | 边缘, TypeScript      | 较新, 示例较少     |
| **Prisma**  | DX, Schema 管理       | 较重, 边缘支持受限 |
| **Kysely**  | 类型安全的 SQL 构造器 | 手动迁移           |
| **Raw SQL** | 复杂查询, 控制权      | 手动保证类型安全   |
