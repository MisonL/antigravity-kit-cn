---
name: lint-and-validate
description: Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers onKeywords: lint, format, check, validate, types, static analysis.
allowed-tools: Read, Glob, Grep, Bash
---

# 校验与验证技能 (Lint and Validate Skill)

> **MANDATORY:** 在每次代码修改后，务必运行相应的验证工具。在代码通过所有校验之前，不要宣布任务完成。

### 不同生态系统的处理流程 (Procedures by Ecosystem)

#### Node.js / TypeScript

1. **Lint/修复:** `npm run lint` 或 `npx eslint "path" --fix`
2. **类型检查:** `npx tsc --noEmit`
3. **安全性:** `npm audit --audit-level=high`

#### Python

1. **Linter (Ruff):** `ruff check "path" --fix` (快速且现代)
2. **安全性 (Bandit):** `bandit -r "path" -ll`
3. **类型检查 (MyPy):** `mypy "path"`

## 质量闭环 (The Quality Loop)

1. **编写/编辑代码**
2. **运行审计:** `npm run lint && npx tsc --noEmit`
3. **分析报告:** 检查 "FINAL AUDIT REPORT" 部分。
4. **修复并重复:** 严禁提交包含 "FINAL AUDIT" 失败项的代码。

## 错误处理 (Error Handling)

- 如果 `lint` 失败：立即修复样式或语法错误。
- 如果 `tsc` 失败：在继续之前修正类型不匹配。
- 如果未配置工具：检查项目根目录是否存在 `.eslintrc`, `tsconfig.json`, `pyproject.toml` 并建议创建配置。

---

**Strict Rule:** 任何代码在通过这些检查之前，都不应被提交或报告为“完成”。

---

## 脚本 (Scripts)

| 脚本                       | 用途           | 命令                                             |
| -------------------------- | -------------- | ------------------------------------------------ |
| `scripts/lint_runner.py`   | 统一 Lint 检查 | `python scripts/lint_runner.py <project_path>`   |
| `scripts/type_coverage.py` | 类型覆盖率分析 | `python scripts/type_coverage.py <project_path>` |
