---
name: i18n-localization
description: 国际化 (i18n) 与本地化 (L10n) 模式。检测硬编码字符串、管理翻译、语言区域文件、RTL 支持。
allowed-tools: Read, Glob, Grep
---

# 国际化与本地化 (i18n & Localization)

> 国际化 (i18n) 与本地化 (L10n) 最佳实践。

---

## 1. 核心概念

| 术语       | 含义                                                 |
| ---------- | ---------------------------------------------------- |
| **i18n**   | 国际化 (Internationalization) - 使应用可翻译         |
| **L10n**   | 本地化 (Localization) - 实际执行的翻译工作           |
| **Locale** | 语言区域 - 语言 + 地区 (如 en-US, zh-CN)             |
| **RTL**    | 从右向左 (Right-to-left) 语言 (如阿拉伯语、希伯来语) |

---

## 2. 何时需要 i18n

| 项目类型      | 是否需要 i18n？       |
| ------------- | --------------------- |
| 公共 Web 应用 | ✅ 是                 |
| SaaS 产品     | ✅ 是                 |
| 内部工具      | ⚠️ 视情况而定         |
| 单一地区应用  | ⚠️ 考虑未来可能的扩展 |
| 个人项目      | ❌ 可选               |

---

## 3. 实现模式

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

## 4. 文件结构示例

```
locales/
├── zh/          # 中文
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── en/          # 英文
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── ar/          # 阿拉伯语 (RTL)
    └── ...
```

---

## 5. 最佳实践

### 要做 ✅

- 使用翻译 Key，而不是原始文本。
- 按功能模块使用命名空间 (Namespace) 组织翻译。
- 支持复数形式处理。
- 根据各地区处理日期、数字格式。
- 从一开始就考虑对 RTL (从右向左) 布局的支持。
- 对复杂的字符串使用 ICU 消息格式。

### 不要 ❌

- 在组件中硬编码字符串。
- 拼接翻译后的字符串片段。
- 假设文本长度 (例如德文通常比英文长 30%)。
- 忘记考虑相应的 RTL 布局调整。
- 在同一个文件中混合多种语言。

---

## 6. 常见问题

| 问题         | 解决方案                       |
| ------------ | ------------------------------ |
| 缺失翻译     | 提供默认的回退语言 (Fallback)  |
| 硬编码字符串 | 使用 Linter 或检查脚本进行检测 |
| 日期格式     | 使用 `Intl.DateTimeFormat`     |
| 数字格式     | 使用 `Intl.NumberFormat`       |
| 复数形式     | 使用 ICU 消息格式              |

---

## 7. 从右向左 (RTL) 支持

```css
/* 使用 CSS 逻辑属性 */
.container {
    margin-inline-start: 1rem; /* 而非 margin-left */
    padding-inline-end: 1rem; /* 而非 padding-right */
}

[dir="rtl"] .icon {
    transform: scaleX(-1); /* 翻转特定图标 */
}
```

---

## 8. 检查清单 (Checklist)

上线前核对：

- [ ] 所有面向用户的字符串都使用了翻译 Key。
- [ ] 所有支持的语言都有对应的 Locale 文件。
- [ ] 日期/数字格式化使用了 `Intl` API。
- [ ] 已测试 RTL 布局 (如果适用)。
- [ ] 已配置好回退语言 (Fallback language)。
- [ ] 组件中不存在硬编码的字符串。

---

## 脚本 (Script)

| 脚本                      | 目的                         | 命令                                        |
| ------------------------- | ---------------------------- | ------------------------------------------- |
| `scripts/i18n_checker.py` | 检测硬编码字符串和缺失的翻译 | `python scripts/i18n_checker.py <项目路径>` |
