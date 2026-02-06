---
name: lint-and-validate
description: 自动质量控制、Lint 检查和静态分析程序。在每次代码修改后使用，以确保语法的正确性和项目标准。触发关键词：lint, format, check, validate, types, static analysis。
allowed-tools: Read, Glob, Grep, Bash
---

# Lint and Validate Skill - Lint 与验证

> **强制要求 (MANDATORY):** 每次代码变更后运行适当的验证工具。在代码无错误之前，不要完成任务。

### 0. 生态系统程序 (Procedures by Ecosystem)

#### Node.js / TypeScript

1. **Lint/Fix:** `npm run lint` 或 `npx eslint "path" --fix`
2. **Types:** `npx tsc --noEmit`
3. **Security:** `npm audit --audit-level=high`

#### Python

1. **Linter (Ruff):** `ruff check "path" --fix` (快速且现代)
2. **Security (Bandit):** `bandit -r "path" -ll`
3. **Types (MyPy):** `mypy "path"`

## 1. 质量循环 (The Quality Loop)

1. **编写/编辑代码 (Write/Edit Code)**
2. **运行审计 (Run Audit):** `npm run lint && npx tsc --noEmit`
3. **分析报告 (Analyze Report):** 检查 "FINAL AUDIT REPORT" 部分。
4. **修复并重复 (Fix & Repeat):** **不允许** 提交有 "FINAL AUDIT" 失败的代码。

## 2. 错误处理 (Error Handling)

- 如果 `lint` 失败：立即修复样式或语法问题。
- 如果 `tsc` 失败：在继续之前更正类型不匹配。
- 如果未配置工具：检查项目根目录是否有 `.eslintrc`, `tsconfig.json`, `pyproject.toml` 并建议创建一个。

---

**严格规则 (Strict Rule):** 任何代码在通过这些检查之前，都不应被提交或报告为“完成”。

---

## 脚本 (Scripts)

| Script                     | Purpose        | Command                                          |
| -------------------------- | -------------- | ------------------------------------------------ |
| `scripts/lint_runner.py`   | 统一 Lint 检查 | `python scripts/lint_runner.py <project_path>`   |
| `scripts/type_coverage.py` | 类型覆盖率分析 | `python scripts/type_coverage.py <project_path>` |
