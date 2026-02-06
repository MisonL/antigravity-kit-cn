# 迁移原则 (Migration Principles)

> 零停机变更的安全迁移策略。

## 安全迁移策略 (Safe Migration Strategy)

```
针对零停机变更建议：
│
├── 新增列 (Adding column)
│   └── 先添加为可空 (nullable) → 数据回填 → 添加 NOT NULL 约束
│
├── 删除列 (Removing column)
│   └── 停止程序调用 → 部署更新 → 从数据库中删除该列
│
├── 新增索引 (Adding index)
│   └── 使用 CREATE INDEX CONCURRENTLY (非阻塞式创建)
│
└── 重命名列 (Renaming column)
    └── 添加新列 → 迁移旧数据至新列 → 部署更新 → 删掉旧列
```

## 迁移哲学 (Migration Philosophy)

- 永远不要在一步操作内完成破坏性变更 (Breaking changes)。
- 在真实数据副本上先行测试迁移脚本。
- 必须备好回滚方案 (Rollback plan)。
- 尽可能在事务 (Transaction) 中运行迁移。

## Serverless 数据库特性

### Neon (Serverless PostgreSQL)

| 特性                  | 优势                          |
| --------------------- | ----------------------------- |
| **Scale to zero**     | 节省成本 (闲置时不计费)       |
| **Instant branching** | 极速分支，适用于开发/预览环境 |
| **Full PostgreSQL**   | 完整兼容 PostgreSQL 协议      |
| **Autoscaling**       | 随流量自动伸缩性能            |

### Turso (边缘 SQLite)

| 特性                    | 优势                       |
| ----------------------- | -------------------------- |
| **Edge locations**      | 边缘节点，超低访问延迟     |
| **SQLite compatible**   | 简单易用，兼容 SQLite 语法 |
| **Generous free tier**  | 免费额度高，低成本         |
| **Global distribution** | 全球分布，提升访问性能     |

---

## 迁移预览建议

在复杂的数据库迁移执行前，可以通过 `/preview` 先审阅变更清单与对应的回滚路径。
