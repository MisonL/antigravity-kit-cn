---
name: lint-and-validate
description: Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers onKeywords: lint, format, check, validate, types, static analysis.
allowed-tools: Read, Glob, Grep, Bash
---

# Lint 与验证技能 (Lint and Validate Skill)

> **MANDATORY (强制):** 在**每次**代码更改后运行适当的验证工具。在代码无错误之前，不要结束任务。

### 各生态系统流程 (Procedures by Ecosystem)

#### Node.js / TypeScript

1. **Lint (代码检查)/Fix (修复):** `npm run lint` 或 `npx eslint "path" --fix`
2. **Types (类型):** `npx tsc --noEmit`
3. **Security (安全):** `npm audit --audit-level=high`

#### Python

1. **Linter (代码检查) (Ruff):** `ruff check "path" --fix` (快速且现代)
2. **Security (安全) (Bandit):** `bandit -r "path" -ll`
3. **Types (类型) (MyPy):** `mypy "path"`

## 质量闭环 (The Quality Loop)

1. **编写/编辑代码 (Write/Edit Code)**
2. **运行审计 (Run Audit):** `npm run lint && npx tsc --noEmit`
3. **分析报告 (Analyze Report):** 检查 "FINAL AUDIT REPORT" 部分。
4. **修复并重复 (Fix & Repeat):** 不允许提交带有 "FINAL AUDIT" 失败的代码。

## 错误处理 (Error Handling)

- 如果 `lint` 失败：立即修复样式或语法问题。
- 如果 `tsc` 失败：在继续之前更正类型不匹配。
- 如果未配置工具：检查项目根目录是否有 `.eslintrc`, `tsconfig.json`, `pyproject.toml` 并建议创建一个。

---

**严格规则 (Strict Rule):** 没有通过这些检查的代码不应提交或报告为“完成”。

---

## 脚本 (Scripts)

| 脚本                       | 用途           | 命令                                             |
| -------------------------- | -------------- | ------------------------------------------------ |
| `scripts/lint_runner.py`   | 统一 lint 检查 | `python scripts/lint_runner.py <project_path>`   |
| `scripts/type_coverage.py` | 类型覆盖率分析 | `python scripts/type_coverage.py <project_path>` |
