---
name: architecture
description: 架构决策框架。需求分析、权衡评估、ADR 文档。在做架构决策或分析系统设计时使用。
allowed-tools: Read, Glob, Grep
---

# Architecture Decision Framework - 架构决策框架

> "需求驱动架构。权衡告知决策。ADR 记录理由。"

## 🎯 选择性阅读规则

**仅阅读与请求相关的文件！** 检查内容映射，找到你需要的内容。

| 文件 (File)             | 描述 (Description)    | 何时阅读 (When to Read) |
| ----------------------- | --------------------- | ----------------------- |
| `context-discovery.md`  | 提问列表、项目分类    | 开始架构设计时          |
| `trade-off-analysis.md` | ADR 模板、权衡框架    | 记录决策时              |
| `pattern-selection.md`  | 决策树、反模式        | 选择模式时              |
| `examples.md`           | MVP、SaaS、企业级示例 | 参考实现                |
| `patterns-reference.md` | 模式快速查找          | 模式比较时              |

---

## 🔗 相关 Skill

| Skill                             | Use For            |
| --------------------------------- | ------------------ |
| `@[skills/database-design]`       | 数据库 Schema 设计 |
| `@[skills/api-patterns]`          | API 设计模式       |
| `@[skills/deployment-procedures]` | 部署架构           |

---

## 核心原则 (Core Principle)

**"简单是终极的复杂。" (Simplicity is the ultimate sophistication.)**

- 从简单开始
- 仅在被证明必要时才增加复杂性
- 你总是可以在以后添加模式
- 移除复杂性远比增加它要困难得多

---

## 验证检查清单 (Validation Checklist)

在最终确定架构之前：

- [ ] 需求已清晰理解
- [ ] 约束已识别
- [ ] 每个决策都进行了权衡分析
- [ ] 已考虑更简单的替代方案
- [ ] 为重大决策编写了 ADR
- [ ] 团队专长与所选模式匹配
