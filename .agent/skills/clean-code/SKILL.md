---
description: 务实的代码规范 - 简洁、直接、无过度设计
---

# 整洁代码 (Clean Code)

## 核心原则

1.  **KISS (Keep It Simple, Stupid)**
    - 不要为了炫技而写复杂代码。代码是给人看的。

2.  **DRY (Don't Repeat Yourself)**
    - 提取公共逻辑，但不要过度抽象（避免 DRY 导致的偶合）。
    - **Rule of Three**: 复制粘贴三次才考虑重构。

3.  **自文档化 (Self-documenting)**
    - 变量名和函数名应该清楚解释它们在做什么。
    - ❌ `const t = 86400;`
    - ✅ `const SECONDS_IN_DAY = 86400;`

4.  **函数只做一件事**
    - 一个函数不应该超过屏幕高度（约 20-30 行）。

5.  **早返回 (Early Return)**
    - 减少 if-else 嵌套。

    ```javascript
    // ❌ Bad
    if (user) {
        if (user.isAdmin) {
            return "Admin";
        }
    }

    // ✅ Good
    if (!user) return;
    if (user.isAdmin) return "Admin";
    ```

## 注释规范

- **解释"为什么" (Why)**，而不是"做什么" (What)。代码本身已经解释了"做什么"。
- 删除所有注释掉的代码。Git 会帮你记住它们。
