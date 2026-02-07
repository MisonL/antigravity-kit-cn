---
name: clean-code
description: Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments
allowed-tools: Read, Write, Edit
version: 2.0
priority: CRITICAL
---

# Clean Code - Pragmatic AI Coding Standards

> **CRITICAL SKILL** - Be **concise, direct, and solution-focused**.

---

## Core Principles

| Principle     | Rule                                                |
| ------------- | --------------------------------------------------- |
| **SRP**       | Single Responsibility - 每个函数/类只做一件事       |
| **DRY**       | Don't Repeat Yourself - 提取重复内容，进行复用      |
| **KISS**      | Keep It Simple - 采用能达成目标的最简方案           |
| **YAGNI**     | You Aren't Gonna Need It - 不要构建目前不使用的功能 |
| **Boy Scout** | 离开时让代码比你发现它时更整洁                      |

---

## Naming Rules

| Element       | Convention                                            |
| ------------- | ----------------------------------------------------- |
| **Variables** | Reveal intent: `userCount` 而非 `n`                   |
| **Functions** | Verb + noun: `getUserById()` 而非 `user()`            |
| **Booleans**  | Question form: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT`                    |

> **Rule:** 如果你需要注释来解释一个名字，那就重新命名它。

---

## Function Rules

| Rule                | Description                    |
| ------------------- | ------------------------------ |
| **Small**           | 最多 20 行，理想情况下 5-10 行 |
| **One Thing**       | 只做一件事，并把它做好         |
| **One Level**       | 每个函数中只包含一个抽象层级   |
| **Few Args**        | 最多 3 个参数，推荐 0-2 个     |
| **No Side Effects** | 不要对输入进行预料之外的改动   |

---

## Code Structure

| Pattern           | Apply                                    |
| ----------------- | ---------------------------------------- |
| **Guard Clauses** | 对于边缘情况采用提前返回 (Early returns) |
| **Flat > Nested** | 避免深度嵌套 (最多 2 层)                 |
| **Composition**   | 将小函数组合在一起使用                   |
| **Colocation**    | 将相关的代码放在物理邻近的位置           |

---

## AI Coding Style

| Situation             | Action                 |
| --------------------- | ---------------------- |
| User asks for feature | 直接编写代码           |
| User reports bug      | 直接修复，不要过多解释 |
| No clear requirement  | 提问澄清，不要盲目假设 |

---

## Anti-Patterns (DON'T)

| ❌ Pattern               | ✅ Fix                 |
| ------------------------ | ---------------------- |
| 每一行都加注释           | 删除显而易见的注释     |
| 为一行代码封装 Helper    | 将代码内联 (Inline)    |
| 为 2 个对象写工厂模式    | 直接实例化             |
| utils.ts with 1 function | 将代码放入使用它的位置 |
| "First we import..."     | 直接写代码             |
| Deep nesting             | 使用卫语句             |
| Magic numbers            | 使用具名常量           |
| God functions            | 按职责进行拆分         |

---

## 🔴 Before Editing ANY File (THINK FIRST!)

**在改动文件前，先问自己：**

| Question                        | Why                |
| ------------------------------- | ------------------ |
| **What imports this file?**     | 它们可能会因此损坏 |
| **What does this file import?** | 涉及接口变更       |
| **What tests cover this?**      | 测试可能会失败     |
| **Is this a shared component?** | 可能影响多个地方   |

**Quick Check:**

```
File to edit: UserService.ts
└── Who imports this? → UserController.ts, AuthController.ts
└── Do they need changes too? → Check function signatures
```

> 🔴 **Rule:** 在同一个任务中编辑该文件及其所有相关的依赖文件。
> 🔴 **Never leave broken imports or missing updates.**

---

## Summary

| Do                     | Don't                   |
| ---------------------- | ----------------------- |
| Write code directly    | 写教程式的冗长说明      |
| Let code self-document | 添加显而易见的注释      |
| Fix bugs immediately   | 修复前先长篇大论解释    |
| Inline small things    | 创建不必要的零散文件    |
| Name things clearly    | 使用简写或缩写          |
| Keep functions small   | 编写超过 100 行的长函数 |

> **Remember: 用户想要的是能运行的代码，而不是一堂编程课。**

---

## 🔴 Self-Check Before Completing (MANDATORY)

**在说 "任务完成" 之前，请核实：**

| Check                     | Question                      |
| ------------------------- | ----------------------------- |
| ✅ **Goal met?**          | 我是否精准完成了用户的要求？  |
| ✅ **Files edited?**      | 我是否修改了所有必要的文件？  |
| ✅ **Code works?**        | 我是否测试/验证了变更？       |
| ✅ **No errors?**         | Lint 和 TypeScript 是否通过？ |
| ✅ **Nothing forgotten?** | 所有的边缘情况都考虑到了吗？  |

> 🔴 **Rule:** 如果任何检查项未通过，请在说完成前修复它。

---

## Verification Scripts (MANDATORY)

> 🔴 **CRITICAL:** 每个 Agent 在完成工作后，仅运行与其技能相关的脚本。

### Agent → Script Mapping

| Agent                     | Script          | Command                                                                        |
| ------------------------- | --------------- | ------------------------------------------------------------------------------ |
| **frontend-specialist**   | UX Audit        | `python .agent/skills/frontend-design/scripts/ux_audit.py .`                   |
| **frontend-specialist**   | A11y Check      | `python .agent/skills/frontend-design/scripts/accessibility_checker.py .`      |
| **backend-specialist**    | API Validator   | `python .agent/skills/api-patterns/scripts/api_validator.py .`                 |
| **mobile-developer**      | Mobile Audit    | `python .agent/skills/mobile-design/scripts/mobile_audit.py .`                 |
| **database-architect**    | Schema Validate | `python .agent/skills/database-design/scripts/schema_validator.py .`           |
| **security-auditor**      | Security Scan   | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`        |
| **seo-specialist**        | SEO Check       | `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .`               |
| **seo-specialist**        | GEO Check       | `python .agent/skills/geo-fundamentals/scripts/geo_checker.py .`               |
| **performance-optimizer** | Lighthouse      | `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py <url>` |
| **test-engineer**         | Test Runner     | `python .agent/skills/testing-patterns/scripts/test_runner.py .`               |
| **test-engineer**         | Playwright      | `python .agent/skills/webapp-testing/scripts/playwright_runner.py <url>`       |
| **Any agent**             | Lint Check      | `python .agent/skills/lint-and-validate/scripts/lint_runner.py .`              |
| **Any agent**             | Type Coverage   | `python .agent/skills/lint-and-validate/scripts/type_coverage.py .`            |
| **Any agent**             | i18n Check      | `python .agent/skills/i18n-localization/scripts/i18n_checker.py .`             |

> ❌ **WRONG:** `test-engineer` 运行 `ux_audit.py`
> ✅ **CORRECT:** `frontend-specialist` 运行 `ux_audit.py`

---

### 🔴 Script Output Handling (READ → SUMMARIZE → ASK)

**运行验证脚本时，你必须：**

1. **运行脚本**并捕获所有输出
2. **解析输出** - 识别错误、警告和通过项
3. **Summarize to user** 使用以下格式：

```markdown
## Script Results: [script_name.py]

### ❌ Errors Found (X items)

- [File:Line] Error description 1
- [File:Line] Error description 2

### ⚠️ Warnings (Y items)

- [File:Line] Warning description

### ✅ Passed (Z items)

- Check 1 passed
- Check 2 passed

**Should I fix the X errors?**
```

4. **Wait for user confirmation** 后再开始修复
5. **After fixing** → Re-run script以确认

> 🔴 **VIOLATION:** 运行脚本并忽略输出 = 任务失败。
> 🔴 **VIOLATION:** 未经询问自动修复脚本报错 = 不允许。
> 🔴 **Rule:** 始终 阅读输出 → 汇总 → 询问 → 然后修复。
