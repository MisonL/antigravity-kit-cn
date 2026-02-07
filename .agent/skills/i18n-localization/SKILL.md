---
name: i18n-localization
description: Internationalization and localization patterns. Detecting hardcoded strings, managing translations, locale files, RTL support.
allowed-tools: Read, Glob, Grep
---

# 国际化与本地化

> 国际化 (i18n) 与本地化 (L10n) 最佳实践。

---

## 1. 核心概念

| 术语                  | 含义                                         |
| --------------------- | -------------------------------------------- |
| **i18n**              | Internationalization (国际化) - 让应用可翻译 |
| **L10n**              | Localization (本地化) - 实际翻译             |
| **Locale (区域设置)** | 语言 + 地区 (en-US, tr-TR)                   |
| **RTL**               | 从右到左语言 (Arabic, Hebrew)                |

---

## 2. 何时使用 i18n

| 项目类型      | 需要 i18n 吗？ |
| ------------- | -------------- |
| 公共 Web 应用 | ✅ 是          |
| SaaS 产品     | ✅ 是          |
| 内部工具      | ⚠️ 也许        |
| 单区域应用    | ⚠️ 考虑未来    |
| 个人项目      | ❌ 可选        |

---

## 3. 实现模式

### React

```tsx
import { useTranslation } from "react-i18next";

function Welcome() {
    const { t } = useTranslation();
    return <h1>{t("welcome.title")}</h1>;
}
```

### Next.js

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("Home");
    return <h1>{t("title")}</h1>;
}
```

### Python

```python
from gettext import gettext as _

print(_("Welcome to our app"))
```

---

## 4. 文件结构

```
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── tr/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── ar/          # RTL
│   └── ...
```

---

## 5. 最佳实践

### DO ✅ (要)

- 使用翻译键，而非原始文本
- 按功能命名空间化翻译
- 支持复数形式
- 按区域设置处理日期/数字格式
- 从一开始就规划 RTL (从右到左布局)
- 对复杂字符串使用 ICU 消息格式

### DON'T ❌ (不要)

- 在组件中硬编码字符串
- 拼接翻译后的字符串
- 假设文本长度 (德语通常长 30%)
- 忘记 RTL 布局
- 在同一文件中混合语言

---

## 6. 常见问题

| 问题         | 解决方案                 |
| ------------ | ------------------------ |
| 缺失翻译     | 回退到默认语言           |
| 硬编码字符串 | 使用 linter/检查脚本     |
| 日期格式     | 使用 Intl.DateTimeFormat |
| 数字格式     | 使用 Intl.NumberFormat   |
| 复数形式     | 使用 ICU 消息格式        |

---

## 7. RTL 支持

```css
/* CSS 逻辑属性 */
.container {
    margin-inline-start: 1rem; /* 不是 margin-left */
    padding-inline-end: 1rem; /* 不是 padding-right */
}

[dir="rtl"] .icon {
    transform: scaleX(-1);
}
```

---

## 8. 检查清单

发布之前：

- [ ] 所有面向用户的字符串都使用翻译键
- [ ] 所有支持的语言都存在区域文件
- [ ] 日期/数字格式化使用 Intl API
- [ ] RTL 布局已测试 (如果适用)
- [ ] 回退语言已配置
- [ ] 组件中无硬编码字符串

---

## 脚本

| 脚本                      | 用途                         | 命令                                            |
| ------------------------- | ---------------------------- | ----------------------------------------------- |
| `scripts/i18n_checker.py` | 检测硬编码字符串和缺失的翻译 | `python scripts/i18n_checker.py <project_path>` |
