---
name: tailwind-patterns
description: Tailwind CSS v4 最佳实践、设计系统配置
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tailwind CSS Patterns

> 具有 CSS 原生配置的现代实用优先 CSS。

---

## 1. Tailwind v4 架构

### v3 相比的变化

| v3 (Legacy)          | v4 (Current)              |
| -------------------- | ------------------------- |
| `tailwind.config.js` | 基于 CSS 的 `@theme` 指令 |
| PostCSS 插件         | Oxide 引擎 (快 10 倍)     |
| JIT 模式             | 原生，始终开启            |
| 插件系统             | CSS 原生特性              |
| `@apply` 指令        | 仍然工作，但不鼓励        |

### v4 核心概念

| 概念                     | 描述                             |
| ------------------------ | -------------------------------- |
| **CSS 优先 (CSS-first)** | 在 CSS 中配置，而不是 JavaScript |
| **Oxide 引擎**           | 基于 Rust 的编译器，快得多       |
| **原生嵌套**             | 无需 PostCSS 的 CSS 嵌套         |
| **CSS 变量**             | 所有 Token 暴露为 `--*` 变量     |

---

## 2. 基于 CSS 的配置

### 主题定义

```css
@theme {
    /* 颜色 - 使用语义命名 */
    --color-primary: oklch(0.7 0.15 250);
    --color-surface: oklch(0.98 0 0);
    --color-surface-dark: oklch(0.15 0 0);

    /* 间距比例 */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;

    /* 排版 */
    --font-sans: "Inter", system-ui, sans-serif;
    --font-mono: "JetBrains Mono", monospace;
}
```

### 何时扩展 vs 覆盖

| 行动                | 何时使用                            |
| ------------------- | ----------------------------------- |
| **Extend**          | 在默认值旁边添加新值                |
| **Override**        | 完全替换默认比例                    |
| **Semantic tokens** | 特定于项目的命名 (primary, surface) |

---

## 3. 容器查询

### 断点 vs 容器

| 类型                         | 响应对象            |
| ---------------------------- | ------------------- |
| **Breakpoint** (`md:`)       | 视口宽度 (Viewport) |
| **Container** (`@container`) | 父元素宽度          |

### 容器查询用法

| 模式     | 类                              |
| -------- | ------------------------------- |
| 定义容器 | 父元素上 `@container`           |
| 容器断点 | 子元素上 `@sm:`, `@md:`, `@lg:` |
| 命名容器 | `@container/card` 用于特指      |

### 何时使用

| 场景         | 使用                  |
| ------------ | --------------------- |
| 页面级布局   | 视口断点              |
| 组件级响应式 | 容器查询              |
| 可复用组件   | 容器查询 (上下文无关) |

---

## 4. 响应式设计

### 断点系统

| 前缀   | 最小宽度 | 目标            |
| ------ | -------- | --------------- |
| (无)   | 0px      | 移动优先基础    |
| `sm:`  | 640px    | 大手机 / 小平板 |
| `md:`  | 768px    | 平板            |
| `lg:`  | 1024px   | 笔记本          |
| `xl:`  | 1280px   | 桌面            |
| `2xl:` | 1536px   | 大桌面          |

### 移动优先原则

1. 先写移动样式 (无前缀)
2. 用前缀添加更大屏幕的覆盖
3. 示例: `w-full md:w-1/2 lg:w-1/3`

---

## 5. 暗色模式

### 配置策略

| 方法       | 行为              | 何时使用       |
| ---------- | ----------------- | -------------- |
| `class`    | `.dark` 类切换    | 手动主题切换器 |
| `media`    | 跟随系统偏好      | 无用户控制     |
| `selector` | 自定义选择器 (v4) | 复杂主题       |

### 暗色模式模式

| 元素 | 亮色 (Light)      | 暗色 (Dark)            |
| ---- | ----------------- | ---------------------- |
| 背景 | `bg-white`        | `dark:bg-zinc-900`     |
| 文本 | `text-zinc-900`   | `dark:text-zinc-100`   |
| 边框 | `border-zinc-200` | `dark:border-zinc-700` |

---

## 6. 现代布局模式

### Flexbox 模式

| 模式        | 类                                  |
| ----------- | ----------------------------------- |
| 居中 (两轴) | `flex items-center justify-center`  |
| 垂直堆叠    | `flex flex-col gap-4`               |
| 水平排      | `flex gap-4`                        |
| 两端对齐    | `flex justify-between items-center` |
| 换行网格    | `flex flex-wrap gap-4`              |

### Grid 模式

| 模式           | 类                                                    |
| -------------- | ----------------------------------------------------- |
| 自动适应响应式 | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |
| 不对称 (Bento) | `grid grid-cols-3 grid-rows-2` using spans            |
| 侧边栏布局     | `grid grid-cols-[auto_1fr]`                           |

> **注意：** 优先使用不对称/Bento 布局，而不是对称的三列网格。

---

## 7. 现代颜色系统

### OKLCH vs RGB/HSL

| 格式      | 优势               |
| --------- | ------------------ |
| **OKLCH** | 感知均匀，设计更佳 |
| **HSL**   | 直观的色相/饱和度  |
| **RGB**   | 遗留兼容性         |

### 颜色 Token 架构

| 层            | 示例              | 目的           |
| ------------- | ----------------- | -------------- |
| **Primitive** | `--blue-500`      | 原始颜色值     |
| **Semantic**  | `--color-primary` | 基于目的的命名 |
| **Component** | `--button-bg`     | 特定于组件     |

---

## 8. 排版系统

### 字体栈模式

| 类型    | 推荐                                       |
| ------- | ------------------------------------------ |
| Sans    | `'Inter', 'SF Pro', system-ui, sans-serif` |
| Mono    | `'JetBrains Mono', 'Fira Code', monospace` |
| Display | `'Outfit', 'Poppins', sans-serif`          |

### 字体比例

| 类          | 大小     | 用途       |
| ----------- | -------- | ---------- |
| `text-xs`   | 0.75rem  | 标签, 说明 |
| `text-sm`   | 0.875rem | 次要文本   |
| `text-base` | 1rem     | 正文       |
| `text-lg`   | 1.125rem | 引导文本   |
| `text-xl`+  | 1.25rem+ | 标题       |

---

## 9. 动画与过渡

### 内置动画

| 类               | 效果               |
| ---------------- | ------------------ |
| `animate-spin`   | 持续旋转           |
| `animate-ping`   | 注意力脉冲         |
| `animate-pulse`  | 微妙的不透明度脉冲 |
| `animate-bounce` | 弹跳效果           |

### 过渡模式

| 模式     | 类                                     |
| -------- | -------------------------------------- |
| 所有属性 | `transition-all duration-200`          |
| 特定     | `transition-colors duration-150`       |
| 缓动     | `ease-out` 或 `ease-in-out`            |
| 悬停效果 | `hover:scale-105 transition-transform` |

---

## 10. 组件提取

### 何时提取

| 信号                  | 行动          |
| --------------------- | ------------- |
| 相同的类组合 3 次以上 | 提取组件      |
| 复杂的状态变体        | 提取组件      |
| 设计系统元素          | 提取 + 文档化 |

### 提取方法

| 方法                | 何时使用      |
| ------------------- | ------------- |
| **React/Vue 组件**  | 动态, 需要 JS |
| **CSS 中的 @apply** | 静态, 无需 JS |
| **设计 Tokens**     | 可复用值      |

---

## 11. 反模式

| 不要 (Don't)      | 要 (Do)             |
| ----------------- | ------------------- |
| 到处使用任意值    | 使用设计系统比例    |
| `!important`      | 正确修复特异性      |
| 内联 `style=`     | 使用 Utilities      |
| 重复的长类列表    | 提取组件            |
| 混合 v3 配置和 v4 | 完全迁移到 CSS 优先 |
| 大量使用 `@apply` | 优先使用组件        |

---

## 12. 性能原则

| 原则             | 实现              |
| ---------------- | ----------------- |
| **清除未使用的** | v4 中自动         |
| **避免动态性**   | 无模板字符串类    |
| **使用 Oxide**   | v4 默认, 快 10 倍 |
| **构建缓存**     | CI/CD 缓存        |

---

> **记住：** Tailwind v4 是 CSS 优先的。拥抱 CSS 变量、容器查询和原生特性。配置文件现在是可选的。
