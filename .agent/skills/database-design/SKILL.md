---
name: database-design
description: Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# 数据库设计 (Database Design)

> **学会思考，而不是复制 SQL 模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                                        | 何时阅读                   |
| ----------------------- | ----------------------------------------------------------- | -------------------------- |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite                       | 选择数据库时               |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely                                 | 选择 ORM (对象关系映射) 时 |
| `schema-design.md`      | Normalization (规范化), PKs (主键), relationships (关系)    | 设计 Schema (模式) 时      |
| `indexing.md`           | Index types (索引类型), composite indexes (复合索引)        | 性能调优时                 |
| `optimization.md`       | N+1, EXPLAIN ANALYZE                                        | 查询优化时                 |
| `migrations.md`         | Safe migrations (安全迁移), serverless DBs (无服务器数据库) | Schema 变更时              |

---

## ⚠️ 核心原则 (Core Principle)

- 询问用户不明确的数据库偏好
- 根据上下文选择 Database/ORM
- 不要总是默认使用 PostgreSQL (Postgres)

---

## 决策检查清单 (Decision Checklist)

在设计 Schema 之前：

- [ ] 询问过用户的数据库偏好了吗？
- [ ] 为此场景选择了合适的数据库吗？
- [ ] 考虑了部署环境吗？
- [ ] 规划了索引策略吗？
- [ ] 定义了关系类型吗？

---

## 反模式 (Anti-Patterns)

❌ 对于简单应用默认使用 PostgreSQL (SQLite 可能就够了)
❌ 跳过索引
❌ 在生产环境使用 SELECT \*
❌ 当结构化数据更好时使用 JSON 存储
❌ 忽略 N+1 查询
