# 移动端排版参考指南 (Mobile Typography Reference)

> 探讨字体比例 (Type scale)、系统字体、动态类型 (Dynamic Type)、无障碍性 (Accessibility) 以及深色模式排版。
> **排版失败是导致移动端应用不可读的首要原因。**

---

## 1. 移动端排版基础 (Mobile Typography Fundamentals)

### 为什么移动端排版与众不同

```
桌面端 (DESKTOP):                    移动端 (MOBILE):
├── 20-30" 视距                     ├── 12-15" 视距
├── 大视口                           ├── 视口窄小
├── 悬停查看详情                     ├── 点击/滚动查看详情
└── 长时间阅读习惯                   └── 快速扫描习惯
```

### 移动端排版规则

| 规则              | 桌面端     | 移动端           |
| ----------------- | ---------- | ---------------- |
| **最小正文字号**  | 14px       | 16px (14pt/14sp) |
| **最大行宽**      | 75 字符    | 40-60 字符       |
| **行高**          | 1.4-1.5    | 1.4-1.6 (更宽松) |
| **对比度 (WCAG)** | AA (4.5:1) | 建议 AAA (7:1)   |

---

## 2. 系统字体 (System Fonts)

### iOS: SF Pro 系列

- **SF Pro Display**: 大字号 (≥ 20pt)。
- **SF Pro Text**: 正文 (< 20pt)。
- **特点**: 自动调整字间距 (Tracking)，支持动态字号缩放。

### Android: Roboto 系列

- **Roboto**: 默认无衬线。
- **Roboto Serif**: 衬线选项。
- **特点**: 针对屏幕优化，适应各种尺寸。

---

## 3. 字号比例 (Type Scale)

### iOS 字号比例 (内置)

| 样式        | 字号 | 字重     | 行高 |
| ----------- | ---- | -------- | ---- |
| Large Title | 34pt | Bold     | 41pt |
| Title 1     | 28pt | Bold     | 34pt |
| Headline    | 17pt | Semibold | 22pt |
| Body        | 17pt | Regular  | 22pt |
| Caption 1   | 12pt | Regular  | 16pt |

### Android 字号比例 (Material 3)

| 角色           | 字号 | 字重 | 行高 |
| -------------- | ---- | ---- | ---- |
| Display Large  | 57sp | 400  | 64sp |
| Headline Large | 32sp | 400  | 40sp |
| Title Large    | 22sp | 400  | 28sp |
| Body Large     | 16sp | 400  | 24sp |
| Label Large    | 14sp | 500  | 20sp |

---

## 4. 动态类型与文本缩放 (Dynamic Type / Text Scaling)

### iOS 动态类型 (强制)

```swift
// ✅ 正确：支持动态类型
Text("Hello").font(.body) // 随系统设置缩放
```

### Android 文本缩放 (强制)

**务必使用 `sp` 而非 `dp` 作为单位：**

- **sp (Scale-independent pixels)**: 随用户偏好缩放。
- 用户可缩放至 200%，务必在此极端下测试。

---

## 5. 排版无障碍性 (Typography Accessibility)

### 最小字号建议

| 元素           | 最小值     | 推荐值     |
| -------------- | ---------- | ---------- |
| 正文           | 14px/pt/sp | 16px/pt/sp |
| 说明 (Caption) | 11px/pt/sp | 12px/pt/sp |
| **禁止更小**   | 11px       | -          |

### 对比度要求 (WCAG)

- **普通文本**: 最小 4.5:1 (AA), 建议 7:1 (AAA)。
- **大号文本**: 最小 3:1 (AA), 建议 4.5:1 (AAA)。

---

## 6. 深色模式排版 (Dark Mode Typography)

### 颜色调整

- **规则**: 在深色背景上严禁使用纯白 (#FFFFFF)，这会导致严重的视觉疲劳。
- **偏移白色**: 使用 (#E0E0E0 到 #F0F0F0) 减轻眼睛压力。

### 深色模式下的视觉字重

- 在深色模式下，由于光晕效应，文本看起来会比浅色模式更细。
- **对策**: 考虑增加字间距 (Letter-spacing)，或者将正文由 Regular 提升为 Medium。

---

## 7. 排版反模式 (Typography Anti-Patterns)

- ❌ **固定字号**: 忽略无障碍设置。
- ❌ **低对比度**: 在阳光下不可读。
- ❌ **超长行宽**: 导致阅读疲劳。
- ❌ **AI 常见错误**: 使用固定 `px` 而非 `pt/sp`；不测试 200% 缩放下的布局。

---

## 8. 字体加载与性能 (Font Loading)

- **字体瘦身**: 仅包含所需字符集 (Subset)。
- **回退机制**: 加载自定义字体前优先显示系统字体 (`font-display: swap`)。

---

## 9. 排版检查清单 (Typography Checklist)

- [ ] 正文字号是否 ≥ 16px/pt/sp？
- [ ] 行高是否 ≥ 1.4？
- [ ] 是否在 iOS 动态类型/Android 200% 下进行了测试？
- [ ] 暗色模式对比度是否达标？

---

> **记住：** 如果用户无法阅读你的文字，你的应用就是损坏的。排版不是装饰，它是主要的交互界面。
