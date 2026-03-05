---
name: lint-and-validate
description: 自动质量控制、Lint 与静态分析流程。每次代码修改后使用，确保语法正确与项目规范一致。触发关键词：lint、format、check、validate、types、static analysis。
allowed-tools: Read, Glob, Grep, Bash
---

# 代码检查与校验技能

> **强制要求：** 每次代码变更后必须运行相应校验工具。在代码无错误前，不得将任务视为完成。

### 按技术栈执行流程

#### Node.js / TypeScript
1. **Lint/Fix：** `npm run lint` 或 `npx eslint "path" --fix`
2. **Types：** `npx tsc --noEmit`
3. **Security：** `npm audit --audit-level=high`

#### Python
1. **Linter（Ruff）：** `ruff check "path" --fix`（快速且现代）
2. **Security（Bandit）：** `bandit -r "path" -ll`
3. **Types（MyPy）：** `mypy "path"`

## 质量闭环
1. **编写/修改代码**
2. **执行审计：** `npm run lint && npx tsc --noEmit`
3. **分析报告：** 检查 “FINAL AUDIT REPORT” 段落。
4. **修复并重复：** “FINAL AUDIT” 失败时禁止提交代码。

## 错误处理
- 若 `lint` 失败：立即修复风格或语法问题。
- 若 `tsc` 失败：先修复类型不匹配，再继续流程。
- 若未配置工具：检查项目根目录中是否有 `.eslintrc`、`tsconfig.json`、`pyproject.toml`，并建议补齐配置。

---
**严格规则：** 未通过上述检查的代码，不得提交，也不得标记为“完成”。

---

## 脚本

| 脚本 | 用途 | 执行命令 |
| --- | --- | --- |
| `scripts/lint_runner.py` | 统一 lint 检查 | `python scripts/lint_runner.py <project_path>` |
| `scripts/type_coverage.py` | 类型覆盖率分析 | `python scripts/type_coverage.py <project_path>` |
