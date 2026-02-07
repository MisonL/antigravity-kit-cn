---
name: tailwind-patterns
description: Tailwind CSS v4 最佳实践、设计系统配置
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tailwind CSS 实践模式 (v4 - 2025)

> 现代化的 Utility-first CSS，拥抱 CSS 原生配置。

---

## 1. Tailwind v4 架构 (Architecture)

### v3 与 v4 的核心区别

| v3 (旧版)            | v4 (当前版)                      |
| -------------------- | -------------------------------- |
| `tailwind.config.js` | 基于 CSS 的 `@theme` 指令        |
| PostCSS 插件体系     | Oxide 引擎 (Rust 驱动，快 10 倍) |
| JIT 模式             | 原生且始终开启                   |
| 复杂的插件系统       | 原生 CSS 特性支持                |
| `@apply` 指令        | 依然可用，但不鼓励过度使用       |

### v4 核心概念

| 概念           | 描述                                       |
| -------------- | ------------------------------------------ |
| **CSS-first**  | 在 CSS 中完成配置，而非 JavaScript         |
| **Oxide 引擎** | 基于 Rust 的编译器，性能飞跃               |
| **原生嵌套**   | 支持无需 PostCSS 的 CSS 原生嵌套 (Nesting) |
| **CSS 变量**   | 所有 Token 均作为 `--*` 变量暴露           |

---

## 2. 基于 CSS 的配置 (CSS-Based Config)

### 主题定义 (Theme Definition)

```css
@theme {
    /* 颜色 - 建议使用语义化命名 */
    --color-primary: oklch(0.7 0.15 250);
    --color-surface: oklch(0.98 0 0);
    --color-surface-dark: oklch(0.15 0 0);

    /* 间距缩放 (Spacing scale) */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;

    /* 字体排版 */
    --font-sans: "Inter", system-ui, sans-serif;
    --font-mono: "JetBrains Mono", monospace;
}
```

### 扩展 (Extend) vs 覆盖 (Override)

| 动作             | 适用场景                             |
| ---------------- | ------------------------------------ |
| **Extend**       | 在默认值基础上增加新数值             |
| **Override**     | 完全替换默认的缩放标准               |
| **语义化 Token** | 项目特定的命名 (如 primary, surface) |

---

## 3. 容器查询 (Container Queries) (v4 原生支持)

### 断点 (Breakpoint) vs 容器 (Container)

| 类型                    | 响应对象             |
| ----------------------- | -------------------- |
| **断点** (`md:`)        | 视口 (Viewport) 宽度 |
| **容器** (`@container`) | 父级元素的宽度       |

### 容器查询用法

| 模式       | 类名示例                          |
| ---------- | --------------------------------- |
| 定义容器   | 在父级添加 `@container`           |
| 容器断点   | 在子级添加 `@sm:`, `@md:`, `@lg:` |
| 命名的容器 | `@container/card` 用于精确控制    |

---

## 4. 响应式系统 (Responsive Design)

### 断点标准

| 前缀  | 最小宽度 | 目标设备            |
| ----- | -------- | ------------------- |
| (无)  | 0px      | 移动端优先基准      |
| `sm:` | 640px    | 大屏手机 / 小型平板 |
| `md:` | 768px    | 平板电脑            |
| `lg:` | 1024px   | 笔记本电脑          |
| `xl:` | 1280px   | 桌面显示器          |

### 移动端优先原则 (Mobile-First)

1. 先编写移动端样式 (不带前缀)。
2. 使用前缀为大屏设备添加覆盖样式。
3. 示例：`w-full md:w-1/2 lg:w-1/3`。

---

## 5. 暗色模式 (Dark Mode)

### 切换策略

| 方法    | 行为                  | 适用场景         |
| ------- | --------------------- | ---------------- |
| `class` | 通过 `.dark` 类名切换 | 手动主题切换器   |
| `media` | 遵循系统首选项        | 无需用户手动控制 |

### 暗色模式常用类名

| 元素 | 亮色 (Light)      | 暗色 (Dark)            |
| ---- | ----------------- | ---------------------- |
| 背景 | `bg-white`        | `dark:bg-zinc-900`     |
| 文字 | `text-zinc-900`   | `dark:text-zinc-100`   |
| 边框 | `border-zinc-200` | `dark:border-zinc-700` |

---

## 6. 现代布局模式

### Flexbox 模式

- 垂直堆叠：`flex flex-col gap-4`
- 水平两端对齐：`flex justify-between items-center`

### Grid 模式

- 自适应响应式网格：`grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]`
- 非对称式 (Bento/便当) 布局：`grid grid-cols-3 grid-rows-2`

> **提示：** 在设计上，优先考虑非对称的 Bento 布局，而非呆板的等分三栏网格。

---

## 7. 现代色彩系统

### OKLCH vs RGB/HSL

- **OKLCH 优势**：知觉均匀度高，在不同亮度下色彩跨度更自然，是 2025 年的设计首选。

### 色彩 Token 架构

- **Primitive (原始层)**：`--blue-500` (具体的色值)
- **Semantic (语义层)**：`--color-primary` (基于用途的命名)

---

## 8. 字体系统 (Typography)

### 推荐字体栈

- **无衬线 (Sans)**：Inter, SF Pro, system-ui
- **等宽 (Mono)**：JetBrains Mono, Fira Code

---

## 9. 动画与过渡 (Animation & Transitions)

### 内置动画

- `animate-spin`：持续旋转
- `animate-pulse`：柔和的透明度脉冲

### 过渡模式

- `hover:scale-105 transition-transform duration-200`：缩放效果

---

## 10. 组件抽离 (Component Extraction)

### 何时执行抽离？

1. 同样的类名组合重复出现了 3 次以上。
2. 存在复杂的交互状态变体。
3. 确定为设计系统中的通用元素。

---

## 11. 应避免的反模式 (Anti-Patterns)

| ❌ 禁止 (Don't)             | ✅ 推荐 (Do)                           |
| --------------------------- | -------------------------------------- |
| 随处使用任意值 (`-[...]`)   | 遵循设计系统的缩放标准                 |
| 滥用 `!important`           | 通过提高选择器优先级解决冲突           |
| 直接在内联 `style` 中写样式 | 优先使用 Utility 类名                  |
| 过度依赖 `@apply` 指令      | 优先采用组件化 (React/Vue/Common) 方案 |

---

## 12. 性能准则

- **自动裁剪**：v4 默认自动删除未使用的 CSS。
- **避免动态生成类名**：严禁使用模板字符串动态生成 Tailwind 类名。
- **利用 Oxide 性能**：确保使用最新的 Rust 驱动引擎。

---

> **谨记：** Tailwind v4 是 CSS-first 的。拥抱 CSS 变量、容器查询和原生特性。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/tailwind-patterns/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/tailwind-patterns/SKILL.md`。
- **注意**：文档层不应替代 CSS 编译规格；仅在此定义 Tailwind v4 布局模式。
