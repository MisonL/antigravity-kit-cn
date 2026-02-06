---
description: 面向项目与功能的结构化头脑风暴。在落地实现前先探索多个可选方案。
---

# /brainstorm - 结构化想法探索

$ARGUMENTS

---

## 目的

此命令会激活 BRAINSTORM 模式，用于结构化地探索思路。在承诺具体实现之前需要比较方案时使用。

---

## 行为

当触发 `/brainstorm` 时：

1. **理解目标**
   - 我们要解决什么问题？
   - 用户是谁？
   - 存在哪些约束？

2. **生成选项**
   - 至少给出 3 种不同方案
   - 每种方案都包含优缺点
   - 适当考虑非常规方案

3. **对比并推荐**
   - 总结关键权衡
   - 给出带理由的推荐

---

## 输出格式

```markdown
## 🧠 Brainstorm: [Topic]

### Context
[Brief problem statement]

---

### Option A: [Name]
[Description]

✅ **Pros:**
- [benefit 1]
- [benefit 2]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

### Option B: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]
- [drawback 2]

📊 **Effort:** Low | Medium | High

---

### Option C: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

## 💡 Recommendation

**Option [X]** because [reasoning].

What direction would you like to explore?
```

---

## 示例

```
/brainstorm authentication system
/brainstorm state management for complex form
/brainstorm database schema for social app
/brainstorm caching strategy
```

---

## 关键原则

- **不写代码** - 此流程关注想法，而不是直接实现
- **必要时可视化** - 涉及架构时可使用图示
- **诚实呈现权衡** - 不要隐藏复杂度
- **由用户决策** - 提供选项，最终由用户选择方向
