---
description: 权衡分析、决策框架与 ADR 模版
---

# 权衡分析与 ADR (Trade-off Analysis)

> 记录每一个架构决策的权衡。

## 决策框架

对于每一个架构组件，记录：

```markdown
## 架构决策记录 (Decision Record)

### 背景 (Context)

- **问题**: [解决什么问题？]
- **约束**: [团队规模、扩展性、时间线、预算]

### 选项考量 (Options Considered)

| 选项   | 优点   | 缺点   | 复杂度 | 适用条件 |
| :----- | :----- | :----- | :----- | :------- |
| 选项 A | 收益 1 | 成本 1 | 低     | [条件]   |
| 选项 B | 收益 2 | 成本 2 | 高     | [条件]   |

### 决策 (Decision)

**选择**: [选项 B]

### 理由 (Rationale)

1. [理由 1 - 关联约束]
2. [理由 2 - 关联需求]

### 接受的权衡 (Trade-offs Accepted)

- [我们放弃了什么]
- [为什么这是可以接受的]

### 后果 (Consequences)

- **正面**: [获得的收益]
- **负面**: [接受的成本/风险]
- **缓解**: [如何缓解负面影响]

### 重新审视触发器 (Revisit Trigger)

- [何时重新考虑此决策]
```

## ADR 模版 (轻量级)

```markdown
# ADR-[XXX]: [决策标题]

## 状态

提议 (Proposed) | 已采纳 (Accepted) | 已废弃 (Deprecated) | 被 [ADR-YYY] 取代

## 背景

[什么问题？什么约束？]

## 决策

[我们选择了什么 - 具体]

## 理由

[为什么 - 关联需求和约束]

## 权衡

[我们放弃了什么 - 诚实记录]

## 后果

- **正面**: [收益]
- **负面**: [成本]
- **缓解**: [缓解措施]
```

## ADR 存储结构

```
docs/
└── architecture/
    ├── adr-001-use-nextjs.md
    ├── adr-002-postgresql-over-mongodb.md
    └── adr-003-adopt-repository-pattern.md
```
