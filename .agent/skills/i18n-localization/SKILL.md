---
name: i18n-localization
description: 国际化与本地化模式。包含硬编码字符串检测、翻译管理、语言文件与 RTL 支持。
allowed-tools: Read, Glob, Grep
---

# i18n 与本地化

> 国际化（i18n）与本地化（L10n）最佳实践。

---

## 1. 核心概念

| 术语 | 含义 |
| --- | --- |
| **i18n** | Internationalization（国际化）—— 使应用具备可翻译性 |
| **L10n** | Localization（本地化）—— 实际的翻译实施过程 |
| **Locale** | 语言 + 地区（例如：en-US, tr-TR） |
| **RTL** | Right-to-left（从右向左语言，如阿拉伯语、希伯来语） |

---

## 2. 何时使用 i18n

| 项目类型 | 是否需要 i18n？ |
| --- | --- |
| 公共 Web 应用 | ✅ 是 |
| SaaS 产品 | ✅ 是 |
| 内部工具 | ⚠️ 视情况而定 |
| 单一地区应用 | ⚠️ 考虑未来扩展 |
| 个人项目 | ❌ 可选 |

---

## 3. 实现模式

### React（react-i18next）

```tsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Next.js（next-intl）

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

### Python（gettext）

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
└── ar/          # RTL
    └── ...
```

---

## 5. 最佳实践

### 推荐 ✅

- 使用翻译键值，而非原始文本
- 按功能模块对翻译进行命名空间划分
- 支持复数形式
- 根据不同地区处理日期/数字格式
- 从项目开始就规划 RTL 支持
- 对复杂字符串使用 ICU 消息格式

### 避免 ❌

- 在组件中硬编码字符串
- 将多个翻译片段手动拼接
- 假设文本长度一致（德语通常比英语长 30%）
- 忘记考虑 RTL 布局
- 在同一个文件中混用不同语言

---

## 6. 常见问题

| 问题 | 解决方案 |
| --- | --- |
| 缺少翻译 | 回退到默认语言 |
| 硬编码字符串 | 使用 Linter/检查脚本 |
| 日期格式 | 使用 Intl.DateTimeFormat |
| 数字格式 | 使用 Intl.NumberFormat |
| 复数逻辑 | 使用 ICU 消息格式 |

---

## 7. RTL 支持

```css
/* CSS Logical Properties */
.container {
  margin-inline-start: 1rem;  /* Not margin-left */
  padding-inline-end: 1rem;   /* Not padding-right */
}

[dir="rtl"] .icon {
  transform: scaleX(-1);
}
```

---

## 8. 检查清单

在正式发布前：

- [ ] 所有面向用户的字符串都使用了翻译键值
- [ ] 所有支持的语言都有对应的本地化文件
- [ ] 日期/数字格式化使用了 Intl API
- [ ] RTL 布局已测试（如适用）
- [ ] 已配置默认回退语言
- [ ] 组件中没有硬编码字符串

---

## 脚本

| 脚本 | 用途 | 执行命令 |
| --- | --- | --- |
| `scripts/i18n_checker.py` | 检测硬编码字符串与缺失翻译 | `python scripts/i18n_checker.py <project_path>` |
