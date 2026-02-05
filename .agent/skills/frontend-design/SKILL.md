---
name: frontend-design
description: 网页 UI 设计思维、布局、排版与配色原则
---

# 前端设计 (Frontend Design)

此技能用于指导 CSS/UI 开发。

## 布局原则 (Layout)

1.  **移动优先 (Mobile First)**
    - 先写手机版样式（默认），再用 `md:` `lg:` 覆盖桌面版。
    - 理由：从小屏幕扩展到大屏幕比从大屏幕压缩更容易。

2.  **网格系统 (Grid System)**
    - 使用 12 列网格或 CSS Grid。
    - 保持一致的间距 (Spacing Scale: 4px, 8px, 16px, 24px...)。

## 颜色 (Color)

- **60-30-10 原则**:
    - 60% 主色 (通常是背景，白色/浅灰)
    - 30% 次要色 (通常是品牌色)
    - 10% 强调色 (按钮、CTA)
- **无障碍**: 确保文字与背景对比度足够 (WCAG AA)。

## 排版 (Typography)

- **字体层级**: H1 > H2 > H3 > Body > Caption。
- **行高 (Line Height)**:
    - 标题行高较小 (1.1 - 1.2)
    - 正文行高较大 (1.5 - 1.6) 以提升可读性。

## 微交互 (Micro-interactions)

- 按钮 Hover 状态。
- 加载骨架屏 (Skeleton)。
- 模态框弹出动画。
- 即时反馈 (点击后立即变色，不要等 API 返回)。
