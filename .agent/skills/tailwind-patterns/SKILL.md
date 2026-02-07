---
name: tailwind-patterns
description: Tailwind CSS v4 原则。CSS-first 配置、容器查询、现代化模式与 Design Token（设计令牌）架构。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Tailwind CSS 模式（v4，2025）

> 采用 CSS 原生配置的现代 Utility-first CSS（工具优先）。

---

## 1. Tailwind v4 架构

### 相比 v3 的变化

| v3（Legacy） | v4（Current） |
|-------------|---------------|
| `tailwind.config.js` | 基于 CSS 的 `@theme` 指令 |
| PostCSS plugin | Oxide 引擎（约 10x 更快） |
| JIT mode | 原生内建、始终开启 |
| Plugin system | CSS 原生能力增强 |
| `@apply` directive | 仍可用，但不推荐重度依赖 |

### v4 核心概念

| 概念 | 说明 |
|------|------|
| **CSS-first（CSS 优先）** | 配置写在 CSS 中，而不是 JavaScript |
| **Oxide Engine** | Rust 编译引擎，速度更快 |
| **Native Nesting** | 不依赖 PostCSS 的 CSS 嵌套 |
| **CSS Variables** | 设计 token 通过 `--*` 变量暴露 |

---

## 2. 基于 CSS 的配置

### 主题定义

```
@theme {
  /* Colors - use semantic names */
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
  --color-surface-dark: oklch(0.15 0 0);
  
  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### 何时扩展与覆盖

| 动作 | 适用场景 |
|------|----------|
| **Extend** | 在保留默认值的同时新增 |
| **Override** | 需要整体替换默认刻度体系 |
| **Semantic tokens** | 采用项目语义命名（primary、surface） |

---

## 3. 容器查询（v4 原生）

### Breakpoint 与 Container 的区别

| 类型 | 响应对象 |
|------|----------|
| **Breakpoint（断点）** (`md:`) | 视口宽度（viewport） |
| **Container（容器）** (`@container`) | 父容器宽度 |

### 容器查询用法

| 模式 | 类名 |
|------|------|
| 定义容器 | 在父元素上添加 `@container` |
| 容器断点 | 在子元素上使用 `@sm:`、`@md:`、`@lg:` |
| 命名容器 | `@container/card` 提升语义与精确性 |

### 何时使用

| 场景 | 选择 |
|------|------|
| 页面级布局 | 视口断点 |
| 组件级响应式 | 容器查询 |
| 可复用组件 | 容器查询（与上下文解耦） |

---

## 4. 响应式设计

### 断点系统

| 前缀 | 最小宽度 | 目标 |
|------|----------|------|
| (none) | 0px | Mobile-first 基础样式 |
| `sm:` | 640px | 大手机/小平板 |
| `md:` | 768px | 平板 |
| `lg:` | 1024px | 笔记本 |
| `xl:` | 1280px | 桌面端 |
| `2xl:` | 1536px | 大屏桌面 |

### Mobile-first 原则

1. 先写移动端基础样式（无前缀）
2. 再用前缀添加大屏覆盖规则
3. 示例：`w-full md:w-1/2 lg:w-1/3`

---

## 5. 深色模式

### 配置策略

| 方法 | 行为 | 适用场景 |
|------|------|----------|
| `class` | 通过 `.dark` 类切换 | 需要手动主题切换 |
| `media` | 跟随系统主题 | 不提供用户开关 |
| `selector` | 自定义选择器（v4） | 复杂多主题体系 |

### 深色模式示例

| 元素 | 浅色 | 深色 |
|------|------|------|
| Background | `bg-white` | `dark:bg-zinc-900` |
| Text | `text-zinc-900` | `dark:text-zinc-100` |
| Borders | `border-zinc-200` | `dark:border-zinc-700` |

---

## 6. 现代布局模式

### Flexbox 模式

| 模式 | 类名 |
|------|------|
| 双轴居中 | `flex items-center justify-center` |
| 纵向堆叠 | `flex flex-col gap-4` |
| 横向排列 | `flex gap-4` |
| 两端对齐 | `flex justify-between items-center` |
| 自动换行网格 | `flex flex-wrap gap-4` |

### Grid 模式

| 模式 | 类名 |
|------|------|
| Auto-fit 响应式网格 | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |
| 非对称（Bento） | `grid grid-cols-3 grid-rows-2` + spans |
| 侧栏布局 | `grid grid-cols-[auto_1fr]` |

> **说明：** 优先使用非对称/Bento（便当格）布局，避免千篇一律的对称三列网格。

---

## 7. 现代颜色系统

### OKLCH 与 RGB/HSL

| 格式 | 优势 |
|------|------|
| **OKLCH** | 感知均匀，更利于设计一致性 |
| **HSL** | 色相/饱和度语义直观 |
| **RGB** | 兼容性传统且广泛 |

### 颜色 Token 架构

| 层级 | 示例 | 作用 |
|------|------|------|
| **Primitive** | `--blue-500` | 原始色值层 |
| **Semantic** | `--color-primary` | 语义命名层 |
| **Component** | `--button-bg` | 组件局部层 |

---

## 8. 排版系统

### 字体栈模式

| 类型 | 推荐 |
|------|------|
| Sans | `'Inter', 'SF Pro', system-ui, sans-serif` |
| Mono | `'JetBrains Mono', 'Fira Code', monospace` |
| Display | `'Outfit', 'Poppins', sans-serif` |

### 字号刻度

| 类名 | 大小 | 用途 |
|------|------|------|
| `text-xs` | 0.75rem | 标签、说明文字 |
| `text-sm` | 0.875rem | 次级文本 |
| `text-base` | 1rem | 正文 |
| `text-lg` | 1.125rem | 引导性文本 |
| `text-xl`+ | 1.25rem+ | 标题 |

---

## 9. 动画与过渡

### 内置动画

| 类名 | 效果 |
|------|------|
| `animate-spin` | 持续旋转 |
| `animate-ping` | 注意力脉冲效果 |
| `animate-pulse` | 轻微透明度脉冲 |
| `animate-bounce` | 弹跳效果 |

### 过渡模式

| 模式 | 类名 |
|------|------|
| 所有属性 | `transition-all duration-200` |
| 指定属性 | `transition-colors duration-150` |
| 缓动函数 | `ease-out` 或 `ease-in-out` |
| Hover 动效 | `hover:scale-105 transition-transform` |

---

## 10. 组件抽取

### 何时抽取

| 信号 | 动作 |
|------|------|
| 同一类组合出现 3 次以上 | 抽为组件 |
| 状态变体复杂 | 抽为组件 |
| 设计系统核心元素 | 抽取并补文档 |

### 抽取方式

| 方法 | 适用场景 |
|------|----------|
| **React/Vue component** | 需要动态逻辑或 JS 行为 |
| **@apply in CSS** | 静态样式、无需 JS |
| **Design tokens（设计令牌）** | 复用基础值（颜色/间距/字号） |

---

## 11. 反模式

| ❌ 不要这样做 | ✅ 推荐做法 |
|-------------|------------|
| 到处用任意值（arbitrary values） | 使用设计系统刻度 |
| 滥用 `!important` | 正确处理样式优先级 |
| 内联 `style=` | 优先使用 utilities |
| 重复超长 class 列表 | 抽取组件 |
| v3/v4 配置混用 | 完整迁移到 CSS-first |
| 重度使用 `@apply` | 优先组件化抽象 |

---

## 12. 性能原则

| 原则 | 实现方式 |
|------|----------|
| **清理未使用样式** | v4 默认自动处理 |
| **避免动态 class 拼接** | 不要用模板字符串生成类名 |
| **使用 Oxide** | v4 默认启用，速度更快 |
| **构建缓存** | 在 CI/CD 中启用缓存 |

---

> **牢记：** Tailwind v4 是 CSS-first。应充分使用 CSS Variables、Container Queries 与原生能力。配置文件已是可选项。
