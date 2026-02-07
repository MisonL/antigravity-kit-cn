---
description: 规划并实现 UI
---

---
description: AI 驱动的设计智能系统，包含 50+ 风格、95+ 配色、自动化设计系统生成
---

# ui-ux-pro-max

面向 Web 与移动应用的综合设计工作流。包含 50+ 风格、97 套配色、57 组字体搭配、99 条 UX 指南、25 种图表类型，覆盖 9 类技术栈。支持可检索数据库与基于优先级的推荐。

## 前置条件 (Prerequisites)

先检查 Python 是否已安装：

```bash
python3 --version || python --version
```

若未安装 Python，请按用户操作系统安装：

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

## 工作流使用方式 (How to Use This Workflow)

当用户提出 UI/UX 请求（design/build/create/implement/review/fix/improve）时，按以下流程执行：

### Step 1：分析用户需求 (Analyze User Requirements)

从请求中提取关键信息：
- **产品类型 (Product type)**：SaaS、电商、作品集、Dashboard、Landing Page 等
- **风格关键词 (Style keywords)**：minimal、playful、professional、elegant、dark mode 等
- **行业 (Industry)**：healthcare、fintech、gaming、education 等
- **技术栈 (Stack)**：React、Vue、Next.js；若未指定，默认 `html-tailwind`

### Step 2：生成设计系统（必做）(Generate Design System)

**必须先执行 `--design-system`**，拿到完整推荐与理由：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

该命令会：
1. 并行搜索 5 个域（product、style、color、landing、typography）
2. 应用 `ui-reasoning.csv` 的推理规则选出最优结果
3. 返回完整设计系统：pattern、style、colors、typography、effects
4. 同时给出需要避免的 anti-patterns

**示例：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b：持久化设计系统（Master + Overrides）

若希望跨会话分层复用设计系统，增加 `--persist`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

会生成：
- `design-system/MASTER.md` — 全局设计规则唯一事实源
- `design-system/pages/` — 页面级覆盖规则目录

**带页面级覆盖时：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

还会生成：
- `design-system/pages/dashboard.md` — 相对于 Master 的页面偏差规则

**分层读取规则：**
1. 构建某页面（如 Checkout）时，先查 `design-system/pages/checkout.md`
2. 页面文件存在时，页面规则 **覆盖** Master
3. 页面文件不存在时，仅使用 `design-system/MASTER.md`

### Step 3：按需补充细分搜索 (Supplement with Detailed Searches)

拿到设计系统后，如需更多细节，可做域搜索：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**何时使用细分搜索：**

| Need | Domain | Example |
|------|--------|---------|
| 更多风格选项 | `style` | `--domain style "glassmorphism dark"` |
| 图表建议 | `chart` | `--domain chart "real-time dashboard"` |
| UX 最佳实践 | `ux` | `--domain ux "animation accessibility"` |
| 备选字体组合 | `typography` | `--domain typography "elegant luxury"` |
| Landing 结构 | `landing` | `--domain landing "hero social-proof"` |

### Step 4：技术栈指南（默认 `html-tailwind`）

获取实现层最佳实践。若用户未指定技术栈，**默认 `html-tailwind`**。

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

可选栈：`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## 搜索参考 (Search Reference)

### 可用 Domain

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | 产品类型推荐 | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UI 风格、颜色、特效 | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | 字体搭配、Google Fonts | elegant, playful, professional, modern |
| `color` | 按产品类型推荐配色 | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | 页面结构与 CTA 策略 | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | 图表类型与库建议 | trend, comparison, timeline, funnel, pie |
| `ux` | 最佳实践与反模式 | animation, accessibility, z-index, loading |
| `react` | React/Next.js 性能 | waterfall, bundle, suspense, memo, rerender, cache |
| `web` | Web 接口规范 | aria, focus, keyboard, semantic, virtualize |
| `prompt` | AI 提示词、CSS 关键词 | (style name) |

### 可用 Stack

| Stack | Focus |
|-------|-------|
| `html-tailwind` | Tailwind utilities、响应式、a11y（默认） |
| `react` | 状态、hooks、性能、模式 |
| `nextjs` | SSR、路由、图片、API routes |
| `vue` | Composition API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | 组件、导航、列表优化 |
| `flutter` | Widgets、State、Layout、Theming |
| `shadcn` | shadcn/ui 组件、主题、表单、模式 |
| `jetpack-compose` | Composables、Modifiers、State Hoisting、Recomposition |

---

## 示例工作流 (Example Workflow)

**用户请求：** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

### Step 1：分析需求
- 产品类型：Beauty/Spa 服务
- 风格关键词：elegant、professional、soft
- 行业：Beauty/Wellness
- 技术栈：html-tailwind（默认）

### Step 2：生成设计系统（必做）

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa"
```

**输出：** 完整设计系统（pattern、style、colors、typography、effects、anti-patterns）。

### Step 3：按需补充细分搜索

```bash
# 查询动画与可访问性 UX 指南
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# 查询备选字体方案
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography
```

### Step 4：技术栈指南

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind
```

**随后：** 综合设计系统与补充搜索结果，进入 UI 实现。

---

## 输出格式 (Output Formats)

`--design-system` 支持两种输出：

```bash
# ASCII box（默认）- 适合终端展示
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown - 适合文档沉淀
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

---

## 提升结果质量的建议 (Tips)

1. **关键词越具体越好**："healthcare SaaS dashboard" > "app"
2. **多次检索**：不同关键词会触发不同洞见
3. **组合多个 Domain**：Style + Typography + Color 才是完整系统
4. **始终检索 UX**：如 "animation"、"z-index"、"accessibility"
5. **使用 stack 参数**：得到实现层最佳实践
6. **迭代检索**：首轮不匹配就换关键词重查

---

## 专业 UI 通用规则 (Common Rules for Professional UI)

以下是最容易被忽略、却最影响“专业感”的问题：

### Icons 与视觉元素

| Rule | Do | Don't |
|------|----|-------|
| **禁止 emoji 图标** | 使用 SVG 图标（Heroicons、Lucide、Simple Icons） | 用 🎨 🚀 ⚙️ 当 UI 图标 |
| **稳定 hover 状态** | 用颜色/透明度过渡 | 用 scale 导致布局抖动 |
| **品牌 Logo 正确性** | 从 Simple Icons 查官方 SVG | 猜 logo 或乱用路径 |
| **图标尺寸一致** | 固定 viewBox（24x24）+ `w-6 h-6` | 图标尺寸随意混用 |

### 交互与光标

| Rule | Do | Don't |
|------|----|-------|
| **Cursor pointer** | 所有可点卡片加 `cursor-pointer` | 交互元素保留默认光标 |
| **Hover 反馈** | 提供颜色/阴影/边框反馈 | 无交互提示 |
| **过渡平滑** | `transition-colors duration-200` | 变化突兀或过慢（>500ms） |

### 明暗模式对比度

| Rule | Do | Don't |
|------|----|-------|
| **浅色玻璃卡片** | `bg-white/80` 或更高 | `bg-white/10`（太透明） |
| **浅色文本对比** | 文本用 `#0F172A`（slate-900） | 正文用 `#94A3B8`（slate-400） |
| **浅色次级文本** | 最低 `#475569`（slate-600） | 使用 gray-400 或更浅 |
| **边框可见性** | 浅色模式用 `border-gray-200` | 用 `border-white/10`（看不见） |

### 布局与间距

| Rule | Do | Don't |
|------|----|-------|
| **悬浮导航** | 预留 `top-4 left-4 right-4` 间距 | 紧贴 `top-0 left-0 right-0` |
| **内容区留白** | 计算固定导航高度 | 内容被固定元素遮挡 |
| **容器宽度一致** | 统一 `max-w-6xl` 或 `max-w-7xl` | 容器宽度混用 |

---

## 交付前检查清单 (Pre-Delivery Checklist)

交付 UI 代码前，逐项确认：

### 视觉质量
- [ ] 未使用 emoji 作为图标（改用 SVG）
- [ ] 图标来源统一（Heroicons/Lucide）
- [ ] 品牌 logo 已核对（Simple Icons）
- [ ] hover 状态不会引发布局位移
- [ ] 主题色直接使用（如 `bg-primary`），不用多余 `var()` 包装

### 交互
- [ ] 所有可点击元素都含 `cursor-pointer`
- [ ] hover 状态具备明确视觉反馈
- [ ] 过渡时长平滑（150-300ms）
- [ ] 键盘导航下焦点可见

### 明暗模式
- [ ] 浅色模式文本对比度足够（至少 4.5:1）
- [ ] 浅色模式下玻璃/透明元素清晰可见
- [ ] 两种模式下边框都可见
- [ ] 交付前已测试 Light + Dark

### 布局
- [ ] 悬浮元素与边缘间距合理
- [ ] 无内容被 fixed navbar 遮挡
- [ ] 响应式断点已验证：375/768/1024/1440
- [ ] 移动端无横向滚动

### 可访问性 (Accessibility)
- [ ] 所有图片含 alt 文本
- [ ] 表单输入有 label
- [ ] 颜色不是唯一信息表达方式
- [ ] 已遵循 `prefers-reduced-motion`
