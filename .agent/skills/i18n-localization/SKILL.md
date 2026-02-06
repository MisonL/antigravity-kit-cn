---
name: i18n-localization
description: 国际化与本地化模式，RTL 支持
allowed-tools: Read, Glob, Grep
---

# 国际化 (i18n & l10n)

## 核心原则

1.  **不要硬编码字符串**
    - ❌ `<h1>Welcome</h1>`
    - ✅ `<h1>{t('welcome')}</h1>`

2.  **不仅是翻译**
    - **日期格式**: MM/DD/YYYY vs DD/MM/YYYY。
    - **货币**: $ vs ¥ vs € (符号位置不同)。
    - **数字**: 1,000.00 vs 1.000,00。
    - **复数**: 英语只有单复数，某些语言有 3-4 种复数形式。

3.  **RTL 支持 (右到左)**
    - 阿拉伯语、希伯来语。
    - 使用 `margin-inline-start` 代替 `margin-left`。
    - 使用 `flex-direction` 的逻辑属性。

## 技术栈推荐

- **React**: `react-i18next` 或 `next-intl`。
- **Key 命名**: 使用层级结构 `home.hero.title`。

## 常见坑点

- 字符串拼接：不同语言语序不同。不要用 `You have ` + count + ` messages`。使用插值 `{count, plural, ...}`。
- 文本长度：德语单词通常比英语长 30%，预留 UI 空间。

## 上游脚本流程补充（reference 对齐）

- `python scripts/i18n_checker.py <project_path>`

用于检测硬编码文案、缺失翻译与 i18n 使用一致性。
