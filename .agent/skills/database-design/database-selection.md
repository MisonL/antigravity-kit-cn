# 数据库选择 (Database Selection)

> 基于上下文选择数据库，而非由于惯性。

## 决策树

```
你的需求是什么？
│
├── 需要完整的关系型特性
│   ├── 自托管 → PostgreSQL
│   └── Serverless → Neon, Supabase
│
├── 边缘部署 / 超低延迟
│   └── Turso (Edge SQLite)
│
├── AI / 向量搜索
│   └── PostgreSQL + pgvector
│
├── 简单 / 嵌入式 / 本地优先
│   └── SQLite
│
└── 全球分布式
    └── PlanetScale, CockroachDB, Turso
```

## 对比

| 数据库          | 最佳适用                | 权衡 (Trade-offs)        |
| :-------------- | :---------------------- | :----------------------- |
| **PostgreSQL**  | 全功能，复杂查询        | 需要托管                 |
| **Neon**        | Serverless PG, 分支功能 | PG 复杂性                |
| **Turso**       | 边缘, 低延迟            | SQLite 限制              |
| **SQLite**      | 简单, 嵌入式, 本地      | 单写入者 (Single-writer) |
| **PlanetScale** | MySQL, 全球扩展         | 无外键支持               |

## 需要问的问题

1.  部署环境是什么？
2.  查询有多复杂？
3.  Edge/Serverless 是否重要？
4.  是否需要向量搜索？
5.  是否需要全球分布？
