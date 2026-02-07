---
name: database-design
description: Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# 数据库设计 (Database Design)

> **学会思考，而不是复制 SQL 模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                  | 何时阅读                   |
| ----------------------- | ------------------------------------- | -------------------------- |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | 选择数据库时               |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely           | 选择 ORM (对象关系映射) 时 |
| `schema-design.md`      | 范式、主键、关系                      | 设计 Schema 时             |
| `indexing.md`           | 索引类型、复合索引                    | 性能调优时                 |
| `optimization.md`       | N+1 问题、EXPLAIN ANALYZE             | 查询优化时                 |
| `migrations.md`         | 安全迁移、Serverless 数据库           | Schema 变更时              |

---

## ⚠️ 核心原则 (Core Principle)

- 询问用户的数据库偏好，如果不清楚的话
- 基于**上下文**选择 Database/ORM
- 不要对所有事情都默认使用 PostgreSQL

---

## 决策检查清单 (Decision Checklist)

在设计 Schema 之前：

- [ ] 询问过用户的数据库偏好吗？
- [ ] 为**此**上下文选择了合适的数据库吗？
- [ ] 考虑过部署环境吗？
- [ ] 规划了索引策略吗？
- [ ] 定义了关系类型吗？

---

## 反模式 (Anti-Patterns)

❌ 对简单的应用默认使用 PostgreSQL (SQLite 可能就够了)
❌ 跳过索引
❌ 在生产环境使用 `SELECT *`
❌ 当结构化数据更好时存储 JSON
❌ 忽略 N+1 查询
