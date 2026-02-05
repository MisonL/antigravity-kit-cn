---
name: lint-and-validate
description: 代码质量检查、Linting 配置与执行
---

# Lint 与校验 (Lint and Validate)

## 为什么需要 Lint？

Lint 工具能在代码运行前发现错误。它是成本最低的测试。

## 推荐配置

1.  **ESLint** (JavaScript/TypeScript)
    - 推荐 `eslint-config-standard` 或 `antfu/eslint-config`。
    - 关注：未使用的变量、潜在的死循环、Hook 规则。

2.  **Prettier / Biome** (Formatting)
    - 自动化代码风格（缩进、分号、单引号）。
    - 再也不用在 Code Review 中争论代码风格了。

3.  **TypeScript** (Type Checking)
    - `strict: true` 是必须的。
    - 不要忽略 `any` 警告。

## 自动化 (Automation)

- **Husky + lint-staged**: 在 commit 时自动运行 Lint，只检查修改过的文件。
- **CI Pipeline**: 在合并代码前强制运行 Lint 检查。
