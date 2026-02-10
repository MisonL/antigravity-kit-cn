---
name: clean-code
description: 务实的编码标准—— 简洁、直接、不做过度设计、不写无用注释（Pragmatic coding standards）
allowed-tools: Read, Write, Edit
version: 2.0
priority: CRITICAL
---

# 整洁代码 - 务实的 AI 编码标准

> **Clean Code（整洁代码）是核心技能**—— 保持**简洁、直接并专注于解决方案**。

---

## 核心原则

| 原则 | 规则 |
|-----------|------|
| **SRP** | 单一职责（Single Responsibility）—— 每个函数/类只做一件事 |
| **DRY** | 不要重复（Don't Repeat Yourself）—— 提取重复项并复用 |
| **KISS** | 保持简单（Keep It Simple）—— 采用能跑通的最简单方案 |
| **YAGNI** | 你不会需要它（You Aren't Gonna Need It）—— 不构建未被要求的功能 |
| **Boy Scout** | 离开时让代码比你来时更整洁 |

---

## 命名规则

| 元素 | 规范 |
|---------|------------|
| **变量（Variables）** | 揭示意图：`userCount` 而非 `n` |
| **函数（Functions）** | 动词 + 名词：`getUserById()` 而非 `user()` |
| **布尔值（Booleans）** | 提问形式：`isActive`, `hasPermission`, `canEdit` |
| **常量（Constants）** | SCREAMING_SNAKE：`MAX_RETRY_COUNT` |

> **准则：** 如果需要注释解释命名，请直接重命名。

---

## 函数规则

| 规则 | 描述 |
|------|-------------|
| **短小（Small）** | 最多 20 行，理想 5-10 行 |
| **专注（One Thing）** | 只做一件事，并把它做好 |
| **层次（One Level）** | 每个函数只包含一个抽象层级 |
| **参数少（Few Args）** | 最多 3 个参数，优先 0-2 个 |
| **无副作用（No Side Effects）** | 不要产生预期之外的输入状态改变 |

---

## 代码结构

| 模式 | 应用建议 |
|---------|-------|
| **卫语句（Guard Clauses）** | 针对边缘情况及早返回 |
| **扁平化优先（Flat > Nested）** | 避免深度嵌套（最多 2 层） |
| **组合（Composition）** | 将短小函数组合使用 |
| **就近原则（Colocation）** | 相关代码尽量放近 |

---

## AI 编码风格

| 场景 | 行动建议 |
|-----------|--------|
| 用户要求功能 | 直接编写实现 |
| 用户报告问题 | 修复，不做多余解释 |
| 需求不明确 | 先询问，不做假设 |

---

## 反模式（Anti-Patterns）

| ❌ 错误模式 | ✅ 推荐修复 |
|-----------|-------|
| 每一行都写注释 | 删除显而易见的注释 |
| 为单行逻辑封装 helper | 直接内联 |
| 为 2 个对象写工厂模式 | 直接实例化 |
| 只有 1 个函数的 utils.ts | 代码放在被使用处 |
| “First we import...” | 直接写代码 |
| 深度嵌套 | 使用卫语句 |
| 使用魔术数字 | 使用具名常量 |
| 万能函数 | 按职责拆分 |

---

## 🔴 编辑任何文件前（先思考）

**修改文件前先问自己：**

| 提问 | 为什么 |
|----------|-----|
| **谁引用了这个文件？** | 修改可能会破坏它们 |
| **这个文件引用了谁？** | 接口可能需要变更 |
| **有哪些测试覆盖了这里？** | 测试可能会失败 |
| **这是共享组件吗？** | 可能影响多个地方 |

**快速检查：**
```
File to edit: UserService.ts
└── Who imports this? → UserController.ts, AuthController.ts
└── Do they need changes too? → Check function signatures
```

> 🔴 **准则：** 同一任务内同时编辑该文件与所有受影响的依赖文件。
> 🔴 **禁止：** 遗留断裂引用或缺失更新。

---

## 总结

| 推荐做法 | 不要做 |
|----|-------|
| 直接编写代码 | 编写教程式引导 |
| 让代码自文档化 | 添加显而易见的注释 |
| 立即修复问题 | 先解释修复方案 |
| 内联短小逻辑 | 创建不必要的文件 |
| 命名清晰准确 | 使用缩写 |
| 保持函数短小 | 编写超过 100 行的函数 |

> **谨记：** 用户想要的是能运行的代码，而不是一堂编程课。

---

## 🔴 完成前自检（强制）

**在说“任务完成”前请验证：**

| 检查项 | 确认问题 |
|-------|----------|
| ✅ **目标达成了吗？** | 是否精准完成用户要求？ |
| ✅ **文件都改了吗？** | 是否修改了所有必要文件？ |
| ✅ **代码能跑吗？** | 是否测试/验证该变更？ |
| ✅ **没有报错吗？** | Lint 和 TypeScript 是否通过？ |
| ✅ **没遗漏什么吗？** | 是否遗漏边缘情况？ |

> 🔴 **准则：** 任一检查未通过，必须先修复再结束。

---

## 验证脚本（强制）

> 🔴 **核心要求：** 每个代理完成后仅运行所属技能脚本。

### 代理 → 脚本映射

| 代理 | 脚本 | 命令 |
|-------|--------|---------|
| **frontend-specialist** | UX Audit | `python .agent/skills/frontend-design/scripts/ux_audit.py .` |
| **frontend-specialist** | A11y Check | `python .agent/skills/frontend-design/scripts/accessibility_checker.py .` |
| **backend-specialist** | API Validator | `python .agent/skills/api-patterns/scripts/api_validator.py .` |
| **mobile-developer** | Mobile Audit | `python .agent/skills/mobile-design/scripts/mobile_audit.py .` |
| **database-architect** | Schema Validate | `python .agent/skills/database-design/scripts/schema_validator.py .` |
| **security-auditor** | Security Scan | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` |
| **seo-specialist** | SEO Check | `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .` |
| **seo-specialist** | GEO Check | `python .agent/skills/geo-fundamentals/scripts/geo_checker.py .` |
| **performance-optimizer** | Lighthouse | `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py <url>` |
| **test-engineer** | Test Runner | `python .agent/skills/testing-patterns/scripts/test_runner.py .` |
| **test-engineer** | Playwright | `python .agent/skills/webapp-testing/scripts/playwright_runner.py <url>` |
| **Any agent** | Lint Check | `python .agent/skills/lint-and-validate/scripts/lint_runner.py .` |
| **Any agent** | Type Coverage | `python .agent/skills/lint-and-validate/scripts/type_coverage.py .` |
| **Any agent** | i18n Check | `python .agent/skills/i18n-localization/scripts/i18n_checker.py .` |

> ❌ **错误做法：** `test-engineer` 运行 `ux_audit.py`
> ✅ **正确做法：** `frontend-specialist` 运行 `ux_audit.py`

---

### 🔴 脚本输出处理（阅读 → 总结 → 询问）

**运行验证脚本时必须：**

1. **执行脚本**并捕获全部输出
2. **解析输出**，识别错误、警告与通过项
3. **按如下格式汇总给用户**

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

4. **Wait for user confirmation** before fixing
5. **After fixing** → Re-run script to confirm

> 🔴 **VIOLATION:** Running script and ignoring output = FAILED task.
> 🔴 **VIOLATION:** Auto-fixing without asking = Not allowed.
> 🔴 **Rule:** Always READ output → SUMMARIZE → ASK → then fix.
