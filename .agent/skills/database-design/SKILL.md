---
name: database-design
description: 数据库设计原则与决策。包含模式 (Schema) 设计、索引策略、ORM 选择及 Serverless 数据库。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# 数据库设计 (Database Design)

> **学习如何思考 (THINK)，而非机械复制 SQL 模式。**

## 🎯 选择性阅读规则 (Selective Reading Rule)

**仅阅读与请求相关的文档！** 查阅内容地图，找到你需要的信息。

| 文件                    | 描述                                         | 阅读时机     |
| ----------------------- | -------------------------------------------- | ------------ |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite        | 选择数据库时 |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely                  | 选择 ORM 时  |
| `schema-design.md`      | 范式化 (Normalization)、主键 (PKs)、关系设计 | 设计模式时   |
| `indexing.md`           | 索引类型、复合索引                           | 性能调优时   |
| `optimization.md`       | N+1 问题、EXPLAIN ANALYZE                    | 查询优化时   |
| `migrations.md`         | 安全迁移、Serverless 数据库                  | 模式变更时   |

---

## ⚠️ 核心原则 (Core Principle)

- 当需求不明确时，**主动询问**老板对数据库的偏好。
- 根据**实际上下文 (CONTEXT)** 选择数据库及其 ORM。
- 不要任何场景都默认使用 PostgreSQL。

---

## 决策检查清单 (Decision Checklist)

在设计模式 (Schema) 之前：

- [ ] **是否已询问老板的数据库偏好？**
- [ ] **是否已为当前上下文选择了合适的数据库？**
- [ ] **是否考虑了部署环境？**
- [ ] **是否规划了索引策略？**
- [ ] **是否定义了关系类型？**

---

## 反模式 (Anti-Patterns)

❌ 为简单的应用默认使用 PostgreSQL（SQLite 可能已经足够）。
❌ 忽略索引设计。
❌ 在生产环境中使用 `SELECT *`。
❌ 在结构化数据更优的情况下强行存储 JSON。
❌ 忽略 N+1 查询问题。

---

