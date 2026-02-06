---
name: lint-and-validate
description: 自动质量控制、Lint 检查和静态分析程序。在每次代码修改后使用，以确保语法的正确性和项目标准。触发关键词：lint, format, check, validate, types, static analysis。
allowed-tools: Read, Glob, Grep, Bash
---

# Lint 与校验技能 (Lint and Validate Skill)

> **强制要求：** 在每次代码修改后，务必运行相应的校验工具。在代码通过所有校验之前，不要宣布任务完成。

### 不同生态系统的处理流程

#### Node.js / TypeScript

1. **Lint/修复：** `npm run lint` 或 `npx eslint "path" --fix`
2. **类型检查：** `npx tsc --noEmit`
3. **安全性：** `npm audit --audit-level=high`

#### Python

1. **Linter (Ruff)：** `ruff check "path" --fix` (快速且现代)
2. **安全性 (Bandit)：** `bandit -r "path" -ll`
3. **类型检查 (MyPy)：** `mypy "path"`

---

## 质量循环 (The Quality Loop)

1. **编写/编辑代码**
2. **运行审计：** 例如 `npm run lint && npx tsc --noEmit`
3. **分析报告：** 检查审计报告中的各项输出。
4. **修复并重复：** 严禁提交带有审计失败项的代码。

---

## 错误处理 (Error Handling)

- 如果 `lint` 失败：立即修复样式或语法问题。
- 如果 `tsc` 失败：在继续之前纠正类型不匹配。
- 如果未配置工具：检查项目根目录是否有 `.eslintrc`, `tsconfig.json`, `pyproject.toml` 并建议创建一个。

---

**严格规则 (Strict Rule)：** 任何代码在通过这些检查之前，都不应被提交或报告为“完成”。

---

## 脚本 (Scripts)

| 脚本                       | 目的             | 命令                                         |
| -------------------------- | ---------------- | -------------------------------------------- |
| `scripts/lint_runner.py`   | 统一的 Lint 检查 | `python scripts/lint_runner.py <项目路径>`   |
| `scripts/type_coverage.py` | 类型覆盖率分析   | `python scripts/type_coverage.py <项目路径>` |
