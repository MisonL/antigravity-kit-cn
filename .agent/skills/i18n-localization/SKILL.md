---
name: i18n-localization
description: 国际化 (i18n) 与本地化 (L10n) 模式。检测硬编码字符串、管理翻译、语言区域文件、RTL 支持。
allowed-tools: Read, Glob, Grep
---

# i18n & Localization - 国际化与本地化

> 国际化 (i18n) 和本地化 (L10n) 的最佳实践。

---

## 1. 核心概念 (Core Concepts)

| 术语       | 含义                                         |
| ---------- | -------------------------------------------- |
| **i18n**   | 国际化 (Internationalization) - 使应用可翻译 |
| **L10n**   | 本地化 (Localization) - 实际的翻译           |
| **Locale** | 语言 + 地区 (en-US, zh-CN)                   |
| **RTL**    | 从右到左书写的语言 (阿拉伯语, 希伯来语)      |

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

## 3. 实现模式 (Implementation Patterns)

### React (react-i18next)

```tsx
import { useTranslation } from "react-i18next";

function Welcome() {
    const { t } = useTranslation();
    return <h1>{t("welcome.title")}</h1>;
}
```

### Next.js (next-intl)

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("Home");
    return <h1>{t("title")}</h1>;
}
```

### Python (gettext)

```python
from gettext import gettext as _

print(_("Welcome to our app"))
```

---

## 4. 文件结构 (File Structure)

```
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── zh/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── ar/          # RTL
    └── ...
```

---

## 5. 最佳实践 (Best Practices)

### 要做 (DO) ✅

- 使用翻译 key，而不是原始文本
- 按功能对翻译进行命名空间划分
- 支持复数形式
- 根据区域设置处理日期/数字格式
- 从一开始就规划 RTL
- 对复杂字符串使用 ICU 消息格式

### 不要 (DON'T) ❌

- 在组件中硬编码字符串
- 拼接翻译后的字符串
- 假设文本长度 (德语通常长 30%)
- 忘记 RTL 布局
- 在同一个文件中混合语言

---

## 6. 常见问题 (Common Issues)

| 问题         | 解决方案                 |
| ------------ | ------------------------ |
| 缺失翻译     | 回退到默认语言           |
| 硬编码字符串 | 使用 linter/checker 脚本 |
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

## 8. 检查清单 (Checklist)

发布前：

- [ ] 所有面向用户的字符串都使用了翻译 key
- [ ] 所有支持的语言都有 Locale 文件
- [ ] 日期/数字格式化使用了 Intl API
- [ ] 测试了 RTL 布局 (如果适用)
- [ ] 配置了回退语言
- [ ] 组件中无硬编码字符串

---

## 脚本 (Script)

| Script                    | Purpose                      | Command                                         |
| ------------------------- | ---------------------------- | ----------------------------------------------- |
| `scripts/i18n_checker.py` | 检测硬编码字符串和缺失的翻译 | `python scripts/i18n_checker.py <project_path>` |
