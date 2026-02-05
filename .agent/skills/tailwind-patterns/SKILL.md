---
name: tailwind-patterns
description: Tailwind CSS v4 最佳实践、设计系统配置
---

# Tailwind CSS 模式

## 核心思维

**Utility-First**: 在 HTML 中直接写样式。

优点：

- 不用想类名 (Class naming is hard)。
- 文件体积小（CSS 停止增长）。
- 更安全（修改样式不会意外破坏其他地方）。

## 最佳实践

1.  **排序**: 使用 `prettier-plugin-tailwindcss` 自动排序类名。
2.  **提取组件**: 当发现大量重复的类名组合时（如按钮），提取为 React 组件，而不是 `@apply`。
3.  **设计 Token**:
    - 在 `tailwind.config.js` 或 CSS 变量中定义颜色、间距。
    - 不要使用任意值 `w-[123px]`，除非完全必要。

## 常用组合

- **居中**: `flex justify-center items-center`
- **全屏覆盖**: `fixed inset-0 bg-black/50 z-50`
- **响应式**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- **暗色模式**: `bg-white dark:bg-slate-900 text-slate-900 dark:text-white`
