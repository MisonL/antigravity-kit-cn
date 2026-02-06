---
name: database-design
description: 数据库设计原则与决策。Schema 设计、索引策略、ORM 选择、Serverless 数据库。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Database Design - 数据库设计

> **学会思考，而不是复制 SQL 模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的文件！** 检查内容映射，找到你需要的内容。

| 文件 (File)             | 描述 (Description)                    | 何时阅读 (When to Read) |
| ----------------------- | ------------------------------------- | ----------------------- |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | 选择数据库              |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely           | 选择 ORM                |
| `schema-design.md`      | 范式化、主键、关系                    | 设计 Schema             |
| `indexing.md`           | 索引类型、复合索引                    | 性能调优                |
| `optimization.md`       | N+1 问题、EXPLAIN ANALYZE             | 查询优化                |
| `migrations.md`         | 安全迁移、Serverless DB               | Schema 变更             |

---

## ⚠️ 核心原则 (Core Principle)

- 不清楚时 **询问** 用户的数据库偏好
- 根据 **上下文** 选择数据库/ORM
- 不要对所有项目都默认使用 PostgreSQL

---

## 决策检查清单 (Decision Checklist)

在设计 Schema 之前：

- [ ] 询问过用户关于数据库的偏好？
- [ ] 为 **当前** 上下文选择了数据库？
- [ ] 考虑了部署环境？
- [ ] 规划了索引策略？
- [ ] 定义了关系类型？

---

## 反模式 (Anti-Patterns)

❌ 简单应用默认使用 PostgreSQL (SQLite 可能就够了)
❌ 跳过索引
❌ 在生产环境使用 SELECT \*
❌ 当结构化数据更好时存储 JSON
❌ 忽略 N+1 查询
