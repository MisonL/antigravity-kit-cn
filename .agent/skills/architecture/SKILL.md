---
name: architecture
description: 架构决策框架。包含需求分析、权衡评估 (Trade-off evaluation) 及 ADR 文档编写。在进行架构决策或分析系统设计时使用。
allowed-tools: Read, Glob, Grep
---

# 架构决策框架 (Architecture Decision Framework)

> “需求驱动架构。权衡决定结论。ADR 记录依据。”

## 🎯 选择性阅读规则 (Selective Reading Rule)

**仅阅读与请求相关的文档！** 查阅内容地图，找到你需要的信息。

| 文件                    | 描述                      | 阅读时机       |
| ----------------------- | ------------------------- | -------------- |
| `context-discovery.md`  | 提问列表、项目分类        | 开始架构设计时 |
| `trade-off-analysis.md` | ADR 模板、权衡分析框架    | 记录决策时     |
| `pattern-selection.md`  | 决策树、反模式            | 选择模式时     |
| `examples.md`           | MVP、SaaS、企业级应用示例 | 参考实现方案时 |
| `patterns-reference.md` | 模式快速查阅              | 模式对比时     |

---

## 🔗 相关技能 (Related Skills)

| 技能 (Skill)                      | 用途           |
| --------------------------------- | -------------- |
| `@[skills/database-design]`       | 数据库模式设计 |
| `@[skills/api-patterns]`          | API 设计模式   |
| `@[skills/deployment-procedures]` | 部署架构       |

---

## 核心原则 (Core Principle)

**“至简即至繁。”**

- 从简单开始。
- **仅**在证明必要时才增加复杂性。
- 你以后随时可以添加新的架构模式。
- 移除复杂性远比增加复杂性要困难得多。

---

## 验证检查清单 (Validation Checklist)

在最终确定架构之前：

- [ ] **需求已清晰理解。**
- [ ] **约束条件已明确。**
- [ ] **每项决策均有权衡 (Trade-off) 分析。**
- [ ] **已考虑更简单的替代方案。**
- [ ] **重大决策均已编写架构决策记录 (ADR - Architecture Decision Records)。**
- [ ] **团队技能水平与所选模式相匹配。**

---

