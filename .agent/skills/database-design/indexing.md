# 索引原则 (Indexing Principles)

> 选对时机和方式，高效创建索引。

## 何时创建索引

```
应该建立索引的情况：
├── WHERE 子句中使用的列
├── JOIN 连接条件中使用的列
├── ORDER BY 中使用的列
├── 外键 (Foreign key) 列
└── 唯一性约束 (Unique constraints) 列

避免过度索引的情况：
├── 写操作频繁的表 (会降低插入速度)
├── 区分度低 (Low-cardinality) 的列
├── 很少被查询的列
```

## 索引类型选择 (Index Type Selection)

| 类型             | 用途                     |
| ---------------- | ------------------------ |
| **B-tree**       | 通用目的，等值和范围查询 |
| **Hash**         | 仅等值查询，速度更快     |
| **GIN**          | JSONB, 数组, 全文搜索    |
| **GiST**         | 几何、物理范围类型       |
| **HNSW/IVFFlat** | 向量相似度 (pgvector)    |

## 复合索引原则 (Composite Index Principles)

```
复合索引的列顺序至关重要：
├── 等值过滤列在前 (Equality)
├── 范围过滤列在后 (Range)
├── 区分度高 (指重复率低) 的列在前
└── 必须匹配查询模式中的列序
```
