---
name: clean-code
description: 务实的代码规范 - 简洁、直接、无过度设计
allowed-tools: Read, Write, Edit
version: 2.0
priority: CRITICAL
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

## 上游规则补全（reference 对齐）

### 编辑前依赖检查（先想再改）

修改任意文件前，至少确认：

1. 谁在引用这个文件（调用方是否会被破坏）。
2. 这个文件依赖了什么（接口变更是否连锁影响）。
3. 哪些测试覆盖这里（改完要跑哪些测试）。
4. 是否为共享组件（是否波及多处模块）。

### 反模式清单（必须避免）

- 为一行代码强行抽 helper。
- 为极小对象创建复杂工厂层。
- 深层嵌套替代早返回。
- 使用模糊缩写命名替代语义命名。
- 先讲教程后写代码（应先交付可运行结果）。

### 完成前自检（Mandatory）

- 是否精确满足用户目标。
- 是否修改了所有必须联动的文件。
- 是否完成必要验证（lint / type / tests）。
- 是否遗漏明显边界场景。

## 上游脚本流程补充（reference 对齐）

为保持“写完即验证”的闭环，请补齐上游定义的脚本映射：

- `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- `python .agent/skills/frontend-design/scripts/accessibility_checker.py .`
- `python .agent/skills/api-patterns/scripts/api_validator.py .`
- `python .agent/skills/mobile-design/scripts/mobile_audit.py .`
- `python .agent/skills/database-design/scripts/schema_validator.py .`
- `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .`
- `python .agent/skills/geo-fundamentals/scripts/geo_checker.py .`
- `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py <url>`
- `python .agent/skills/testing-patterns/scripts/test_runner.py .`
- `python .agent/skills/webapp-testing/scripts/playwright_runner.py <url>`
- `python .agent/skills/lint-and-validate/scripts/lint_runner.py .`
- `python .agent/skills/lint-and-validate/scripts/type_coverage.py .`
- `python .agent/skills/i18n-localization/scripts/i18n_checker.py .`

输出处理规则：
- 先读取脚本输出并分组（错误/警告/通过项）。
- 先向用户汇总，再询问是否修复。
- 未经确认不得自动批量修复。
