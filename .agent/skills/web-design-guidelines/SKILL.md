---
name: web-design-guidelines
description: Web 界面指南 (WIG) 审查与无障碍检查
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web 设计指南 (Web Design Guidelines)

## 用户体验 (UX)

1.  **加载状态**: 在数据加载时显示 Skeleton 或 Spinner。
2.  **空状态**: 列表为空时，提供引导（"没有数据，点击这里创建"）。
3.  **错误处理**: 友好的错误提示，不仅仅是 "Error 500"。

## 无障碍 (Accessbility / a11y)

1.  **键盘导航**: 确保所有交互元素 (Botton, Link, Input) 都能用 Tab 键访问。
2.  **语义化 HTML**: 使用 `<main>`, `<nav>`, `<article>` 而不是全用 `<div>`。
3.  **颜色对比度**: 文本与背景对比度至少 4.5:1。
4.  **Alt 属性**: 所有图片必须有 Alt。

## 响应式 (Responsive)

- 确保在 Mobile (320px+), Tablet, Desktop 都能正常显示。
- 不要出现横向滚动条（除非是特定组件如 Carousel）。
- 触摸目标足够大。
