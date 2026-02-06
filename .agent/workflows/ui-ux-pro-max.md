---
description: 规划并实现 UI
---

---
description: AI 驱动的设计智能工作流，包含 50+ 风格、95+ 配色方案，并支持自动化生成设计系统
---

# ui-ux-pro-max

面向 Web 与移动应用的综合设计指南。内置可检索知识库：50+ 风格、97 套配色、57 组字体搭配、99 条 UX 规范、25 种图表类型，覆盖 9 种技术栈，并提供基于优先级的推荐。

## 前置条件

先检查 Python 是否可用：

```bash
python3 --version || python --version
```

若 Python 未安装，请按用户操作系统执行安装：

**macOS：**
```bash
brew install python3
```

**Ubuntu/Debian：**
```bash
sudo apt update && sudo apt install python3
```

**Windows：**
```powershell
winget install Python.Python.3.12
```

---

## 工作流使用方式

当用户提出 UI/UX 相关诉求（design、build、create、implement、review、fix、improve）时，按以下流程执行：

### Step 1：分析用户需求

从用户请求中提取关键信息：
- **产品类型**：SaaS、电商、作品集、Dashboard、落地页等
- **风格关键词**：极简、活泼、专业、优雅、深色模式等
- **行业**：医疗、金融、游戏、教育等
- **技术栈**：React、Vue、Next.js；若用户未指定，默认使用 `html-tailwind`

### Step 2：生成设计系统（必须）

**始终先执行 `--design-system`**，获取包含推理依据的完整推荐：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

该命令会：
1. 并行检索 5 个领域（product、style、color、landing、typography）
2. 使用 `ui-reasoning.csv` 中的推理规则筛选最优匹配
3. 返回完整设计系统：pattern、style、colors、typography、effects
4. 同时返回应避免的反模式（anti-patterns）

**示例：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b：持久化设计系统（Master + Overrides 模式）

若需跨会话进行层级检索，增加 `--persist`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

会生成：
- `design-system/MASTER.md`：全局单一事实源（Source of Truth）
- `design-system/pages/`：页面级覆盖规则目录

**带页面覆盖的用法：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

还会额外生成：
- `design-system/pages/dashboard.md`：页面对 Master 的差异化规则

**层级检索规则：**
1. 构建某页面（如 Checkout）时，先查 `design-system/pages/checkout.md`
2. 若页面文件存在，页面规则**覆盖** Master
3. 若页面文件不存在，仅使用 `design-system/MASTER.md`

### Step 3：按需补充细粒度检索

拿到设计系统后，按需补充具体领域细节：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**适用场景：**

| 需求 | Domain | 示例 |
|------|--------|---------|
| 更多风格方案 | `style` | `--domain style "glassmorphism dark"` |
| 图表推荐 | `chart` | `--domain chart "real-time dashboard"` |
| UX 最佳实践 | `ux` | `--domain ux "animation accessibility"` |
| 备选字体 | `typography` | `--domain typography "elegant luxury"` |
| Landing 结构 | `landing` | `--domain landing "hero social-proof"` |

### Step 4：技术栈实现指南（默认：html-tailwind）

获取实现层最佳实践。若用户未指定技术栈，**默认 `html-tailwind`**。

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

可选栈：`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## 检索参考

### 可用 Domain

| Domain | 用途 | 示例关键词 |
|--------|---------|------------------|
| `product` | 产品类型推荐 | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UI 风格、配色、特效 | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | 字体搭配、Google Fonts | elegant, playful, professional, modern |
| `color` | 按产品类型推荐配色 | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | 页面结构、CTA 策略 | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | 图表类型、库推荐 | trend, comparison, timeline, funnel, pie |
| `ux` | 最佳实践、反模式 | animation, accessibility, z-index, loading |
| `react` | React/Next.js 性能 | waterfall, bundle, suspense, memo, rerender, cache |
| `web` | Web 界面规范 | aria, focus, keyboard, semantic, virtualize |
| `prompt` | AI prompts、CSS 关键词 | (style name) |

### 可用技术栈

| Stack | 侧重点 |
|-------|-------|
| `html-tailwind` | Tailwind 工具类、响应式、a11y（默认） |
| `react` | 状态管理、hooks、性能、模式 |
| `nextjs` | SSR、路由、图片、API routes |
| `vue` | Composition API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | Components、Navigation、Lists |
| `flutter` | Widgets、State、Layout、Theming |
| `shadcn` | shadcn/ui 组件、主题、表单、模式 |
| `jetpack-compose` | Composables、Modifiers、State Hoisting、Recomposition |

---

## 示例工作流

**用户请求：** “Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp”

### Step 1：分析需求
- 产品类型：Beauty/Spa service
- 风格关键词：elegant, professional, soft
- 行业：Beauty/Wellness
- 技术栈：html-tailwind（默认）

### Step 2：生成设计系统（必须）

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa"
```

**输出：** 完整设计系统，含 pattern、style、colors、typography、effects 及 anti-patterns。

### Step 3：按需补充细节检索

```bash
# 获取动画与无障碍 UX 规范
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# 若需要，获取更多字体方案
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography
```

### Step 4：技术栈实现指南

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind
```

**然后：** 综合设计系统与细节检索结果，落地实现页面。

---

## 输出格式

`--design-system` 支持两种输出格式：

```bash
# ASCII 盒子（默认）- 适合终端阅读
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown - 适合文档沉淀
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

---

## 提升效果的小技巧

1. **关键词要具体**：`healthcare SaaS dashboard` 优于 `app`
2. **多次检索**：不同关键词会得到不同洞察
3. **跨域组合**：Style + Typography + Color = 完整设计系统
4. **始终检查 UX**：检索 `animation`、`z-index`、`accessibility` 规避常见坑
5. **使用 stack 参数**：获取技术栈特定最佳实践
6. **迭代检索**：首轮不匹配就换关键词继续检索

---

## 专业 UI 常见规则

以下问题最常导致交付看起来“不专业”：

### 图标与视觉元素

| 规则 | Do | Don't |
|------|----|----- |
| **不使用 emoji 充当图标** | 使用 SVG 图标（Heroicons、Lucide、Simple Icons） | 用 🎨 🚀 ⚙️ 作为 UI 图标 |
| **稳定 hover 状态** | 用颜色/透明度过渡 | 用 scale 导致布局位移 |
| **品牌 Logo 正确** | 从 Simple Icons 获取官方 SVG | 猜测或使用错误 logo 路径 |
| **图标尺寸一致** | 固定 viewBox（24x24）并统一尺寸 | 随机混用不同尺寸 |

### 交互与光标

| 规则 | Do | Don't |
|------|----|----- |
| **使用 cursor pointer** | 所有可点击/可 hover 卡片加 `cursor-pointer` | 可交互元素保留默认光标 |
| **hover 反馈明确** | 提供颜色、阴影、边框等反馈 | 无法判断元素是否可交互 |
| **过渡时长合理** | `transition-colors duration-200` | 瞬变或过慢（>500ms） |

### 浅色/深色模式对比度

| 规则 | Do | Don't |
|------|----|----- |
| **浅色玻璃卡片可读** | 使用 `bg-white/80` 或更高不透明度 | 使用 `bg-white/10`（过透明） |
| **浅色文本对比达标** | 使用 `#0F172A`（slate-900） | 用 `#94A3B8`（slate-400）作正文 |
| **浅色次级文本可读** | 最低 `#475569`（slate-600） | 用 gray-400 或更浅 |
| **边框双模式可见** | 浅色模式用 `border-gray-200` | 用 `border-white/10`（几乎不可见） |

### 布局与间距

| 规则 | Do | Don't |
|------|----|----- |
| **浮动导航留边** | 使用 `top-4 left-4 right-4` | 紧贴 `top-0 left-0 right-0` |
| **正文避让固定头部** | 预留固定导航高度 | 让正文被固定元素遮挡 |
| **容器宽度一致** | 统一 `max-w-6xl` 或 `max-w-7xl` | 页面间混用不同宽度策略 |

---

## 交付前检查清单

在交付 UI 代码前，请逐项核对以下内容：

### 视觉质量
- [ ] 不用 emoji 做图标（使用 SVG）
- [ ] 图标来源统一（Heroicons/Lucide）
- [ ] 品牌 Logo 正确（已核验来源）
- [ ] hover 不引发布局抖动
- [ ] 直接使用主题类（如 `bg-primary`），避免无必要 var 包装

### 交互
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] hover 状态反馈清晰
- [ ] 过渡时长平滑（150-300ms）
- [ ] 键盘焦点态可见

### 浅色/深色模式
- [ ] 浅色模式文本对比度达标（至少 4.5:1）
- [ ] 透明/玻璃元素在浅色模式可读
- [ ] 边框在两种模式都可见
- [ ] 已实际验证浅色与深色模式

### 布局
- [ ] 浮动元素与屏幕边缘间距合理
- [ ] 固定导航不遮挡正文
- [ ] 已验证 375px、768px、1024px、1440px
- [ ] 移动端无横向滚动

### 无障碍
- [ ] 所有图片有 alt 文本
- [ ] 表单输入项有 label
- [ ] 不仅依赖颜色传达状态
- [ ] 遵循 `prefers-reduced-motion`
