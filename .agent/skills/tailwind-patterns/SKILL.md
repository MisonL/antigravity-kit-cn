---
name: tailwind-patterns
description: Tailwind CSS v4 最佳实践、设计系统配置
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tailwind CSS 模式 (v4 - 2025)

> 采用 CSS 原生配置的现代原子类 (Utility-first) CSS。

---

## 1. Tailwind v4 架构 (Architecture)

### 与 v3 的区别

| v3 (旧版)            | v4 (当前版)               |
| -------------------- | ------------------------- |
| `tailwind.config.js` | 基于 CSS 的 `@theme` 指令 |
| PostCSS 插件         | Oxide 引擎 (快 10 倍)     |
| JIT 模式             | 原生支持，始终开启        |
| 插件系统             | CSS 原生特性              |
| `@apply` 指令        | 仍可工作，但不推荐使用    |

### v4 核心概念

| 概念                          | 描述                                      |
| ----------------------------- | ----------------------------------------- |
| **CSS 优先 (CSS-first)**      | 在 CSS 中配置，而非 JavaScript            |
| **Oxide 引擎**                | 基于 Rust 的编译器，速度大幅提升          |
| **原生嵌套 (Native Nesting)** | 无需 PostCSS 即可实现 CSS 嵌套            |
| **CSS 变量 (Variables)**      | 所有 Token (设计令牌) 均暴露为 `--*` 变量 |

---

## 2. 基于 CSS 的配置

### 主题定义 (Theme Definition)

```css
@theme {
    /* 颜色 - 使用语义化名称 */
    --color-primary: oklch(0.7 0.15 250);
    --color-surface: oklch(0.98 0 0);
    --color-surface-dark: oklch(0.15 0 0);

    /* 间距缩放 (Spacing scale) */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;

    /* 字体排版 (Typography) */
    --font-sans: "Inter", system-ui, sans-serif;
    --font-mono: "JetBrains Mono", monospace;
}
```

### 何时扩展 (Extend) 与 覆盖 (Override)

| 行动                             | 使用场景                            |
| -------------------------------- | ----------------------------------- |
| **扩展 (Extend)**                | 在默认值基础上添加新值              |
| **覆盖 (Override)**              | 完全替换默认的缩放标准              |
| **语义化令牌 (Semantic tokens)** | 项目专属命名（如 primary, surface） |

---

## 3. 容器查询 (v4 原生支持)

### 断点 (Breakpoint) vs 容器 (Container)

| 类型                                | 响应对象             |
| ----------------------------------- | -------------------- |
| **断点 (Breakpoint)** (`md:`)       | 视口 (Viewport) 宽度 |
| **容器 (Container)** (`@container`) | 父元素宽度           |

### 容器查询用法 (Container Query Usage)

| 模式     | 类名                                  |
| -------- | ------------------------------------- |
| 定义容器 | 在父元素上使用 `@container`           |
| 容器断点 | 在子元素上使用 `@sm:`, `@md:`, `@lg:` |
| 命名容器 | 使用 `@container/card` 以提高特异性   |

### 何时使用

| 场景         | 推荐方案                        |
| ------------ | ------------------------------- |
| 页面级布局   | 视口断点 (Viewport breakpoints) |
| 组件级响应式 | 容器查询 (Container queries)    |
| 可复用组件   | 容器查询（与上下文无关）        |

---

## 4. 响应式设计 (Responsive Design)

### 断点系统 (Breakpoint System)

| 前缀   | 最小宽度 | 目标设备                     |
| ------ | -------- | ---------------------------- |
| (无)   | 0px      | 移动优先 (Mobile-first) 基础 |
| `sm:`  | 640px    | 大屏手机 / 小型平板          |
| `md:`  | 768px    | 平板电脑                     |
| `lg:`  | 1024px   | 笔记本电脑                   |
| `xl:`  | 1280px   | 桌面电脑                     |
| `2xl:` | 1536px   | 大型显示器                   |

### 移动优先原则

1. 先编写移动端样式（不带前缀）
2. 使用前缀添加大屏场景下的覆盖样式
3. 示例：`w-full md:w-1/2 lg:w-1/3`

---

## 5. 深色模式 (Dark Mode)

### 配置策略

| 方法       | 行为                | 使用场景         |
| ---------- | ------------------- | ---------------- |
| `class`    | 通过 `.dark` 类切换 | 手动主题切换器   |
| `media`    | 遵循系统偏好        | 无需用户干预     |
| `selector` | 自定义选择器 (v4)   | 复杂的主题化需求 |

### 深色模式模式 (Dark Mode Pattern)

| 元素 | 浅色              | 深色                   |
| ---- | ----------------- | ---------------------- |
| 背景 | `bg-white`        | `dark:bg-zinc-900`     |
| 文本 | `text-zinc-900`   | `dark:text-zinc-100`   |
| 边框 | `border-zinc-200` | `dark:border-zinc-700` |

---

## 6. 现代布局模式 (Modern Layout Patterns)

### Flexbox 模式

| 模式         | 类名                                |
| ------------ | ----------------------------------- |
| 居中（双轴） | `flex items-center justify-center`  |
| 垂直堆叠     | `flex flex-col gap-4`               |
| 水平行       | `flex gap-4`                        |
| 两端对齐     | `flex justify-between items-center` |
| 自动换行网格 | `flex flex-wrap gap-4`              |

### 网格 (Grid) 模式

| 模式               | 类名                                                  |
| ------------------ | ----------------------------------------------------- |
| 响应式自动填充     | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |
| 非对称网格 (Bento) | `grid grid-cols-3 grid-rows-2` 配合单元格合并         |
| 侧边栏布局         | `grid grid-cols-[auto_1fr]`                           |

> **注意：** 相比对称的 3 列网格，优先采用非对称或 Bento (便当盒) 式布局。

---

## 7. 现代色彩系统 (Modern Color System)

### OKLCH vs RGB/HSL

| 格式      | 优势                 |
| --------- | -------------------- |
| **OKLCH** | 感知均匀，更适合设计 |
| **HSL**   | 直观的色相/饱和度    |
| **RGB**   | 传统兼容性           |

### 色彩令牌架构 (Color Token Architecture)

| 层级                   | 示例              | 用途           |
| ---------------------- | ----------------- | -------------- |
| **原始层 (Primitive)** | `--blue-500`      | 原始色值       |
| **语义层 (Semantic)**  | `--color-primary` | 基于用途的命名 |
| **组件层 (Component)** | `--button-bg`     | 组件专属色     |

---

## 8. 字体排版系统 (Typography System)

### 字体族模式 (Font Stack Pattern)

| 类型           | 推荐值                                     |
| -------------- | ------------------------------------------ |
| 无衬线 (Sans)  | `'Inter', 'SF Pro', system-ui, sans-serif` |
| 等宽 (Mono)    | `'JetBrains Mono', 'Fira Code', monospace` |
| 展示 (Display) | `'Outfit', 'Poppins', sans-serif`          |

### 字号缩放 (Type Scale)

| 类名        | 大小     | 用途            |
| ----------- | -------- | --------------- |
| `text-xs`   | 0.75rem  | 标签、说明文字  |
| `text-sm`   | 0.875rem | 次要文本        |
| `text-base` | 1rem     | 正文            |
| `text-lg`   | 1.125rem | 导语内容        |
| `text-xl`+  | 1.25rem+ | 标题 (Headings) |

---

## 9. 动画与过渡 (Animation & Transitions)

### 内置动画

| 类名             | 效果           |
| ---------------- | -------------- |
| `animate-spin`   | 持续旋转       |
| `animate-ping`   | 注意力脉冲     |
| `animate-pulse`  | 微弱透明度脉冲 |
| `animate-bounce` | 弹跳效果       |

### 过渡模式 (Transition Patterns)

| 模式     | 类名                                   |
| -------- | -------------------------------------- |
| 所有属性 | `transition-all duration-200`          |
| 特定属性 | `transition-colors duration-150`       |
| 缓动函数 | `ease-out` 或 `ease-in-out`            |
| 悬停效果 | `hover:scale-105 transition-transform` |

---

## 10. 组件提炼 (Component Extraction)

### 何时提炼

| 信号                        | 采取行动       |
| --------------------------- | -------------- |
| 同样的类名组合出现 3 次以上 | 提炼组件       |
| 复杂的状态变体              | 提炼组件       |
| 设计系统基础元素            | 提炼并记录文档 |

### 提炼方法

| 方法                         | 使用场景             |
| ---------------------------- | -------------------- |
| **React/Vue 组件**           | 动态、需要 JS 逻辑   |
| **CSS 中的 @apply**          | 静态、不需要 JS 逻辑 |
| **设计令牌 (Design tokens)** | 需要复用的数值       |

---

## 11. 反模式 (Anti-Patterns)

| ❌ 不要 (Don't)      | ✅ 要 (Do)                   |
| -------------------- | ---------------------------- |
| 随处使用任意值       | 使用设计系统缩放标准         |
| 使用 `!important`    | 正确修复优先级 (Specificity) |
| 行内 `style=`        | 使用原子类 (Utilities)       |
| 重复冗长的类名列表   | 提炼组件                     |
| 在 v4 中混用 v3 配置 | 完全迁移至 CSS 优先模式      |
| 重度使用 `@apply`    | 优先使用组件化方案           |

---

## 12. 性能原则 (Performance Principles)

| 原则               | 实现方式                   |
| ------------------ | -------------------------- |
| **清理未使用代码** | v4 中自动完成              |
| **避免动态拼接**   | 不要使用模板字符串拼接类名 |
| **使用 Oxide**     | v4 默认引擎，快 10 倍      |
| **缓存构建**       | CI/CD 流程中的缓存优化     |

---

> **记住：** Tailwind v4 是 **CSS 优先** 的。拥抱 CSS 变量、容器查询和原生特性。配置文件现在是可选的。
