---
name: database-design
description: 数据库设计原则与决策。Schema 设计、索引策略、ORM 选择、Serverless 数据库。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# 数据库设计 (Database Design)

> **学会思考背景，而不仅仅是复制 SQL 模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                  | 何时阅读       |
| ----------------------- | ------------------------------------- | -------------- |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | 选择数据库时   |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely           | 选择 ORM 时    |
| `schema-design.md`      | 范式化、主键 (PK)、关系设计           | 设计 Schema 时 |
| `indexing.md`           | 索引类型、复合索引                    | 性能调优时     |
| `optimization.md`       | N+1 问题, EXPLAIN ANALYZE             | 查询优化时     |
| `migrations.md`         | 安全迁移、Serverless 数据库           | 变更 Schema 时 |

---

## ⚠️ 核心原则

- 需求不明确时，务必询问用户的数据库偏好。
- 根据 **上下文 (Context)** 选择数据库/ORM。
- 不要对所有项目都默认使用 PostgreSQL。

---

## 决策检查清单 (Decision Checklist)

在设计 Schema 之前：

- [ ] 询问过用户关于数据库的偏好？
- [ ] 为 **当前** 上下文选择了最合适的数据库？
- [ ] 考虑了部署环境 (Serverless vs VM vs Container)？
- [ ] 规划了索引策略？
- [ ] 定义了实体间的关系类型？

---

## 反模式 (Anti-Patterns)

❌ 简单应用也默认使用 PostgreSQL (SQLite 可能就足够了)
❌ 跳过索引设计
❌ 在生产环境使用 `SELECT *`
❌ 当结构化数据更好时仍存储 JSON
❌ 忽略 N+1 查询问题
