# 迁移原则 (Migration Principles)

> 零停机变更的安全迁移策略。

## 安全迁移策略

```
为了零停机变更:
│
├── 添加列
│   └── 添加为 nullable → 回填数据 → 添加 NOT NULL 约束
│
├── 移除列
│   └── 停止使用该列 → 部署代码 → 移除列
│
├── 添加索引
│   └── CREATE INDEX CONCURRENTLY (非阻塞)
│
└── 重命名列
    └── 添加新列 → 迁移数据 → 部署代码 → 删除旧列
```

## 迁移哲学

- 绝不一步完成破坏性变更 (Breaking changes)
- 先在数据副本上测试迁移
- 拥有回滚计划
- 尽可能在事务中运行

## Serverless 数据库

### Neon (Serverless PostgreSQL)

| 特性                  | 优势          |
| :-------------------- | :------------ |
| **Scale to zero**     | 节省成本      |
| **Instant branching** | 开发/预览环境 |
| **Full PostgreSQL**   | 完全兼容      |
| **Autoscaling**       | 流量处理      |

### Turso (边缘 SQLite)

| 特性                    | 优势     |
| :---------------------- | :------- |
| **Edge locations**      | 超低延迟 |
| **SQLite compatible**   | 简单     |
| **Generous free tier**  | 成本     |
| **Global distribution** | 性能     |
