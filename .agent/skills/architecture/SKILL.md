---
name: architecture
description: Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation. Use when making architecture decisions or analyzing system design.
allowed-tools: Read, Glob, Grep
---

# 架构决策框架 (Architecture Decision Framework)

> "需求驱动架构。权衡告知决策。ADR (架构决策记录) 记录理由。"

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

| 文件                    | 描述                                                 | 何时阅读       |
| ----------------------- | ---------------------------------------------------- | -------------- |
| `context-discovery.md`  | Questions (问题), project classification (项目分类)  | 开始架构设计时 |
| `trade-off-analysis.md` | ADR templates (模板), trade-off framework (权衡框架) | 记录决策时     |
| `pattern-selection.md`  | Decision trees (决策树), anti-patterns (反模式)      | 选择模式时     |
| `examples.md`           | MVP, SaaS, Enterprise examples (企业示例)            | 参考实现时     |
| `patterns-reference.md` | Quick lookup (快速查找)                              | 模式比较时     |

---

## 🔗 相关 Skill (Related Skills)

| Skill (技能)                      | 用于               |
| --------------------------------- | ------------------ |
| `@[skills/database-design]`       | 数据库 Schema 设计 |
| `@[skills/api-patterns]`          | API 设计模式       |
| `@[skills/deployment-procedures]` | 部署架构           |

---

## 核心原则 (Core Principle)

**"简单是终极的复杂。"**

- 从简单开始
- 仅在被证明必要时增加复杂性
- 你以后总是可以添加模式
- 移除复杂性比添加复杂性难得多

---

## 验证检查清单 (Validation Checklist)

在最终确定架构之前：

- [ ] 需求已清晰理解
- [ ] 约束已识别
- [ ] 每个决策都有权衡分析
- [ ] 考虑了更简单的替代方案
- [ ] 为重大决策编写了 ADR (架构决策记录)
- [ ] 团队专业知识与所选模式匹配
