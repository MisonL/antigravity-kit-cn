# 数据库选择（2025）

> 根据上下文选择数据库，不要只用默认选项。

## 决策树

```
您的需求是什么？
│
├── 需要完整的关系型功能
│   ├── 自托管（Self-hosted） → PostgreSQL
│   └── 无服务器（Serverless） → Neon, Supabase
│
├── 边缘部署（edge）/ 超低延迟
│   └── Turso（边缘级 SQLite）
│
├── AI / 向量搜索（vector search）
│   └── PostgreSQL + pgvector
│
├── 简单 / 嵌入式 / 本地存储
│   └── SQLite
│
└── 全球分布式挂载
    └── PlanetScale, CockroachDB, Turso
```

## 各数据库对比

| 数据库 | 最佳适用 | 权衡 |
| ------ | -------- | ------------------ |
| **PostgreSQL** | 全功能，复杂查询 | 需要托管 |
| **Neon** | Serverless PG（无服务器 PostgreSQL），分支功能 | PG 自身的复杂度 |
| **Turso** | 边缘环境，低延迟 | SQLite 的局限性 |
| **SQLite** | 简单、嵌入式、本地 | 单个写入者（single-writer）限制 |
| **PlanetScale** | MySQL，全球量级扩展 | 无外键约束支持 |

## 需要问的问题

1. 部署环境是什么？（Serverless（无服务器）、容器、虚拟机等）
2. 查询有多复杂？（是否涉及深度嵌套、地理空间等）
3. Edge（边缘）/Serverless（无服务器）特性是否重要？
4. 是否需要向量搜索功能？
5. 是否需要全球分布支持？
