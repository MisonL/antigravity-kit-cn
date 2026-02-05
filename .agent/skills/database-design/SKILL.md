---
name: database-design
description: 数据库设计原则、Schema 设计与 ORM 选择
---

# 数据库设计 (Database Design)

## 选型指南

- **PostgreSQL**: 默认首选。通用，功能强大，支持 JSONB。
- **SQLite**: 适合原型、小型应用、嵌入式场景。
- **DuckDB**: 适合数据分析 (OLAP)。
- **Redis**: 缓存、队列、会话存储。

## 设计原则

1.  **规范化 (Normalization)**: 至少满足 3NF，消除数据冗余（除非为了性能特意反规范化）。
2.  **主键 (Primary Keys)**:
    - 使用 `UUID` 或 `CUID` 防止遍历攻击。
    - 避免使用自增 `ID` (Auto Increment Integer) 作为公开 ID。
3.  **索引 (Indexing)**:
    - 为外键列添加索引。
    - 为经常查询 (`WHERE`, `ORDER BY`) 的列添加索引。
4.  **软删除 (Soft Delete)**:
    - 添加 `deletedAt` 字段，而不是直接 `DELETE` 记录。

## Prisma 最佳实践

- **Schema 命名**: Model 使用 PascalCase (如 `User`), 字段使用 camelCase (如 `firstName`).
- **关系**: 始终明确定义反向关系。
- **枚举**: 使用 `enum` 代替魔法字符串。

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}
```
