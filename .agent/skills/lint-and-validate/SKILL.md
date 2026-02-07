---
name: lint-and-validate
description: 自动化质量控制、Lint 检查与静态分析规程。在每次代码修改后使用，以确保语法正确性并符合项目标准。
allowed-tools: Read, Glob, Grep, Bash
---

# Lint 与验证技能 (Lint & Validate)

> **强制要求 (MANDATORY)：** 在**每次**代码更改后运行适当的验证工具。在代码 100% 无错误之前，不得宣布任务完成。

---

### 不同生态系统的审核规程 (Procedures by Ecosystem)

#### Node.js / TypeScript

1. **代码检查与修复 (Lint/Fix)**：运行 `npm run lint` 或 `npx eslint "path" --fix`。
2. **类型检查 (Types)**：运行 `npx tsc --noEmit`。
3. **安全性审计 (Security)**：运行 `npm audit --audit-level=high`。

#### Python

1. **代码检查 (Ruff)**：运行 `ruff check "path" --fix` (2025 年推荐的快速、现代方案)。
2. **安全性扫描 (Bandit)**：运行 `bandit -r "path" -ll`。
3. **类型检查 (MyPy)**：运行 `mypy "path"`。

---

## 质量闭环准则 (The Quality Loop)

1. **编写/编辑代码 (Write/Edit Code)**。
2. **运行全量审计 (Run Audit)**：执行 Lint 与类型检查。
3. **分析报告内容 (Analyze Report)**：仔细核对“最终审计报告 (FINAL AUDIT REPORT)”章节。
4. **修复并重复 (Fix & Repeat)**：严禁提交任何带有“最终审计 (FINAL AUDIT)”失败项的代码。

---

## 错误处理建议 (Error Handling)

- 如果 **Lint** 失败：立即修复代码风格或语法问题。
- 如果 **TSC/MyPy** 失败：在进行下一步之前，必须先纠正类型不匹配问题。
- 如果**未配置工具**：检查项目根目录是否存在 `.eslintrc`, `tsconfig.json`, `pyproject.toml` 等配置文件，若缺失则建议立即创建一个。

---

## 严格规则 (Strict Rule)

**凡是未通过上述自动验证检查的代码，一律不得提交，也不得向老板汇报为“已完成”。**

---

## 运行时验证脚本 (Scripts)

| 脚本                       | 核心用途             | 执行命令                                     |
| -------------------------- | -------------------- | -------------------------------------------- |
| `scripts/lint_runner.py`   | 统一的 Lint 检查插件 | `python scripts/lint_runner.py <项目路径>`   |
| `scripts/type_coverage.py` | 全局类型覆盖率分析   | `python scripts/type_coverage.py <项目路径>` |

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/lint-and-validate/SKILL.md`。
- **Codex 适配**：由于 Codex 环境可能涉及多环境（Local/Dev/Prod）切换，请在执行验证前确认当前的 `CONTEXT_ID`。
- **注意**：文档层仅定义了质量检查的工作流；具体规则由底层 Linter 配置文件定义。
