---
name: i18n-localization
description: 国际化与本地化模式。包含硬编码字符串检测、翻译管理、语言文件及 RTL 支持。
allowed-tools: Read, Glob, Grep
---

# i18n 与本地化 (i18n & Localization)

> 国际化 (i18n) 与本地化 (L10n) 最佳实践。

---

## 1. 核心概念 (Core Concepts)

| 术语       | 含义                                                     |
| ---------- | -------------------------------------------------------- |
| **i18n**   | 国际化 (Internationalization) —— 使应用具备可翻译性      |
| **L10n**   | 本地化 (Localization) —— 实际的翻译实施过程              |
| **Locale** | 语言 + 地区代码 (例如：en-US, zh-CN)                     |
| **RTL**    | 从右向左阅读的语言 (Right-to-left，如阿拉伯语、希伯来语) |

---

## 2. 何时使用 i18n (When to Use i18n)

| 项目类型      | 是否需要 i18n？         |
| ------------- | ----------------------- |
| 公共 Web 应用 | ✅ 是                   |
| SaaS 产品     | ✅ 是                   |
| 内部工具      | ⚠️ 视情况而定           |
| 单一地区应用  | ⚠️ 考虑未来可能的扩展性 |
| 个人项目      | ❌ 可选                 |

---

## 3. 实现模式 (Implementation Patterns)

### React (使用 react-i18next)

```tsx
import { useTranslation } from "react-i18next";

function Welcome() {
    const { t } = useTranslation();
    return <h1>{t("welcome.title")}</h1>;
}
```

### Next.js (使用 next-intl)

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
    const t = useTranslations("Home");
    return <h1>{t("title")}</h1>;
}
```

### Python (使用 gettext)

```python
from gettext import gettext as _

print(_("Welcome to our app"))
```

---

## 4. 文件结构 (File Structure)

```
locales/
├── en/          # 英语
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── zh/          # 中文
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── ar/          # RTL 语言 (阿拉伯语)
    └── ...
```

---

## 5. 最佳实践 (Best Practices)

### 推荐做法 (DO) ✅

- 使用翻译键值 (Keys)，而非原始文本。
- 按功能模块对翻译进行命名空间 (Namespace) 划分。
- 支持复数形式 (Pluralization)。
- 根据不同地区处理日期/数字格式。
- 从项目开始就规划对 RTL 的支持。
- 针对复杂字符串使用 ICU 消息格式。

### 禁止行为 (DON'T) ❌

- 在组件中硬编码 (Hardcode) 字符串。
- 将多个翻译片段手动拼接。
- 假设所有语言的文本长度一致（例如德语通常比英语长 30%）。
- 忘记考虑 RTL 布局的特殊性。
- 在同一个文件中混用不同语言。

---

## 6. 常见问题 (Common Issues)

| 问题现象         | 解决方案                       |
| ---------------- | ------------------------------ |
| 缺少翻译内容     | 回退 (Fallback) 到默认语言     |
| 存在硬编码字符串 | 使用 Linter 或检查脚本进行检测 |
| 日期格式不统一   | 使用 Intl.DateTimeFormat API   |
| 数字格式不统一   | 使用 Intl.NumberFormat API     |
| 复数逻辑复杂     | 使用 ICU 消息格式              |

---

## 7. RTL 支持 (RTL Support)

```css
/* 使用 CSS 逻辑属性 (Logical Properties) */
.container {
    margin-inline-start: 1rem; /* 而非 margin-left */
    padding-inline-end: 1rem; /* 而非 padding-right */
}

/* 针对 RTL 翻转图标 */
[dir="rtl"] .icon {
    transform: scaleX(-1);
}
```

---

## 8. 检查清单 (Checklist)

在正式发布前：

- [ ] 所有面向用户的字符串是否都使用了翻译键值？
- [ ] 所有支持的语言是否都已创建对应的本地化文件？
- [ ] 日期/数字格式化是否使用了 Intl API？
- [ ] RTL 布局是否已通过测试（如适用）？
- [ ] 是否已配置默认回退语言？
- [ ] 组件中是否完全不存在硬编码字符串？

---

## 运行脚本 (Script)

| 脚本                      | 用途                         | 执行命令                                    |
| ------------------------- | ---------------------------- | ------------------------------------------- |
| `scripts/i18n_checker.py` | 检测硬编码字符串及缺失的翻译 | `python scripts/i18n_checker.py <project_path>` |

---

