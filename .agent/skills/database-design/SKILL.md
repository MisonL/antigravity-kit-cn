---
name: database-design
description: Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Database Design

> **学会思考背景，而不仅仅是复制 SQL 模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                  | 何时阅读    |
| ----------------------- | ------------------------------------- | ----------- |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | 选择数据库  |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely           | 选择 ORM    |
| `schema-design.md`      | 范式化、主键 (PK)、关系设计           | 设计 Schema |
| `indexing.md`           | 索引类型、复合索引                    | 性能调优    |
| `optimization.md`       | N+1, EXPLAIN ANALYZE                  | 查询优化    |
| `migrations.md`         | 安全迁移、Serverless 数据库           | 变更 Schema |

---

## ⚠️ Core Principle

- 需求不明确时，务必询问用户的数据库偏好。
- 根据 **CONTEXT** 选择数据库/ORM。
- 不要对所有项目都默认使用 PostgreSQL。

---

## Decision Checklist

在设计 Schema 之前：

- [ ] **询问过用户关于数据库的偏好吗？**
- [ ] **为当前上下文选择了最合适的数据库吗？**
- [ ] **考虑了部署环境吗？**
- [ ] **规划了索引策略吗？**
- [ ] **定义了实体间的关系类型吗？**

---

## Anti-Patterns

❌ 简单应用也默认使用 PostgreSQL (SQLite 可能就足够了)
❌ 跳过索引设计
❌ 在生产环境使用 `SELECT *`
❌ 当结构化数据更好时仍存储 JSON
❌ 忽略 N+1 查询问题
