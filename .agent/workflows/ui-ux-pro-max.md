---
description: 规划并实现 UI
---

---
description: AI 驱动的设计智能系统，包含 50+ 风格、95+ 配色，以及自动化设计系统生成
---

# ui-ux-pro-max

面向 Web 与移动应用的综合设计指南。包含 50+ 风格、97 套配色、57 组字体搭配、99 条 UX 指南，以及跨 9 类技术栈的 25 种图表类型。提供可检索数据库与基于优先级的推荐。

## 前置条件

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

## 工作流使用方式

当用户提出 UI/UX 请求（design, build, create, implement, review, fix, improve）时，按以下流程执行：

### Step 1：分析用户需求

从请求中提取关键信息：
- **产品类型**：SaaS（软件即服务）, e-commerce（电商）, portfolio（作品集）, dashboard（仪表盘）, landing page（落地页）等
- **风格关键词**：minimal（极简）, playful（活泼）, professional（专业）, elegant（优雅）, dark mode（深色模式）等
- **行业**：healthcare（医疗）, fintech（金融科技）, gaming（游戏）, education（教育）等
- **技术栈**：React、Vue、Next.js；若未指定，默认 `html-tailwind`

### Step 2：生成设计系统（必做）

**必须先执行 `--design-system`**，拿到完整推荐与理由：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

该命令会：
1. 并行搜索 5 个域（product、style、color、landing、typography）
2. 应用 `ui-reasoning.csv` 的推理规则选出最优结果
3. 返回完整设计系统：pattern、style、colors、typography、effects
4. 同时给出需要避免的 anti-patterns（反模式）

**示例：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "美容 水疗 健康 服务" --design-system -p "Serenity Spa"
```

### Step 2b：持久化设计系统（Master + Overrides Pattern）

若希望跨会话分层复用设计系统，增加 `--persist`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

会生成：
- `design-system/MASTER.md` — 全局规则唯一事实源
- `design-system/pages/` — 页面级覆盖规则目录

**带页面级覆盖时：**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

还会生成：
- `design-system/pages/dashboard.md` — 相对于 Master 的页面偏差规则

**分层读取规则：**
1. 构建某页面（如 "Checkout"）时，先查 `design-system/pages/checkout.md`
2. 页面文件存在时，页面规则 **覆盖** Master
3. 页面文件不存在时，仅使用 `design-system/MASTER.md`

### Step 3：按需补充细分搜索

拿到设计系统后，如需更多细节，可做域搜索：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**何时使用细分搜索：**

| 需求 | Domain | 示例 |
| --- | --- | --- |
| 更多风格选项 | `style` | `--domain style "玻璃拟态 深色"` |
| 图表建议 | `chart` | `--domain chart "实时 仪表盘"` |
| UX 最佳实践 | `ux` | `--domain ux "动画 可访问性"` |
| 备选字体组合 | `typography` | `--domain typography "优雅 奢华"` |
| Landing 结构 | `landing` | `--domain landing "首屏 社会证明"` |

### Step 4：技术栈指南（默认 `html-tailwind`）

获取实现层最佳实践。若用户未指定技术栈，**默认 `html-tailwind`**。

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

可选栈：`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`
, `jetpack-compose`
---

## 搜索参考

### 可用 Domain

| Domain | 用途 | 示例关键词 |
| --- | --- | --- |
| `product` | 产品类型推荐 | SaaS, e-commerce（电商）, portfolio（作品集）, healthcare（医疗）, beauty（美业）, service（服务） |
| `style` | UI 风格、颜色、特效 | glassmorphism（玻璃拟态）, minimalism（极简）, dark mode（深色模式）, brutalism（粗野主义） |
| `typography` | 字体搭配、Google Fonts | elegant（优雅）, playful（活泼）, professional（专业）, modern（现代） |
| `color` | 按产品类型推荐配色 | saas（软件即服务）, ecommerce（电商）, healthcare（医疗）, beauty（美业）, fintech（金融科技）, service（服务） |
| `landing` | 页面结构与 CTA 策略 | hero（首屏）, hero-centric（首屏主导）, testimonial（用户评价）, pricing（定价）, social-proof（社会证明） |
| `chart` | 图表类型与库建议 | trend（趋势）, comparison（对比）, timeline（时间线）, funnel（漏斗）, pie（饼图） |
| `ux` | 最佳实践与反模式 | animation（动画）, accessibility（可访问性）, z-index, loading（加载） |
| `react` | React/Next.js 性能 | waterfall（瀑布）, bundle（打包）, suspense, memo, rerender（重渲染）, cache（缓存） |
| `web` | Web 交互规范 | aria, focus（焦点）, keyboard（键盘）, semantic（语义化）, virtualize（虚拟化） |
| `prompt` | AI 提示词、CSS 关键词 | （风格名称） |

### 可用 Stack

| Stack | 关注点 |
| --- | --- |
| `html-tailwind` | Tailwind utilities（工具类）、响应式、a11y（可访问性）（默认） |
| `react` | 状态、hooks、性能、模式 |
| `nextjs` | SSR、路由、图片、API routes（接口路由） |
| `vue` | Composition API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | 组件、导航、列表 |
| `flutter` | Widgets、State、Layout、Theming |
| `shadcn` | shadcn/ui 组件、主题、表单、模式 |
| `jetpack-compose` | Composables、Modifiers、State Hoisting、Recomposition |

---

## 示例工作流

**用户请求：** “为专业皮肤护理服务制作落地页”

### Step 1：分析需求
- 产品类型：Beauty/Spa（美容/水疗）服务
- 风格关键词：elegant（优雅）、professional（专业）、soft（柔和）
- 行业：Beauty/Wellness（美容/健康）
- 技术栈：html-tailwind（默认）

### Step 2：生成设计系统（必做）

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "美容 水疗 健康 服务 优雅" --design-system -p "Serenity Spa"
```

**输出：** 完整设计系统（pattern、style、colors、typography、effects、anti-patterns）。

### Step 3：按需补充细分搜索

```bash
# 查询动画与可访问性 UX 指南
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "动画 可访问性" --domain ux

# 查询备选字体方案
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "优雅 奢华 serif" --domain typography
```

### Step 4：技术栈指南

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "布局 响应式 表单" --stack html-tailwind
```

**随后：** 综合设计系统与补充搜索结果，进入 UI 实现。

---

## 输出格式

`--design-system` 支持两种输出格式：

```bash
# ASCII box（默认）- 适合终端展示
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "金融 科技 加密" --design-system

# Markdown - 适合文档场景
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "金融 科技 加密" --design-system -f markdown
```

---

## 更好结果的提示

1. **关键词越具体越好** —— “healthcare SaaS dashboard（医疗 SaaS 仪表盘）”优于 “app（应用）”
2. **多次搜索** —— 不同关键词会揭示不同洞察
3. **组合域** —— Style（风格） + Typography（字体） + Color（颜色） = 完整设计系统
4. **始终检查 UX** —— 搜索 “animation（动画）”、“z-index”、“accessibility（可访问性）” 以避免常见问题
5. **使用 stack 标记** —— 获取实现层最佳实践
6. **迭代** —— 如果第一次搜索不匹配，换关键词继续

---

## 专业 UI 的常见规则

以下问题常被忽视，会使 UI 看起来不专业：

### 图标与视觉元素

| 规则 | 推荐 | 避免 |
| --- | --- | --- |
| **禁用 emoji 图标** | 使用 SVG 图标（Heroicons、Lucide、Simple Icons） | 使用 🎨 🚀 ⚙️ 等 emoji 作为 UI 图标 |
| **稳定 hover 状态** | hover 时使用颜色/透明度过渡 | 使用会改变布局的缩放变换 |
| **品牌 Logo 正确** | 从 Simple Icons 查找官方 SVG | 猜测或使用错误的 Logo 路径 |
| **图标尺寸一致** | 使用固定 viewBox（24x24）且 w-6 h-6 | 混用不同图标尺寸 |

### 交互与光标

| 规则 | 推荐 | 避免 |
| --- | --- | --- |
| **指针光标** | 所有可点击/可悬停卡片使用 `cursor-pointer` | 交互元素仍使用默认光标 |
| **Hover 反馈** | 提供颜色/阴影/边框等视觉反馈 | 元素可交互但无任何提示 |
| **平滑过渡** | 使用 `transition-colors duration-200` | 状态切换过快或过慢（>500ms） |

### 亮/暗模式对比度

| 规则 | 推荐 | 避免 |
| --- | --- | --- |
| **玻璃卡片浅色模式** | 使用 `bg-white/80` 或更高透明度 | 使用 `bg-white/10`（过透明） |
| **浅色模式文本对比** | 文本使用 `#0F172A`（slate-900） | 使用 `#94A3B8`（slate-400）作为正文 |
| **浅色模式弱文本** | 至少使用 `#475569`（slate-600） | 使用 gray-400 或更浅色值 |
| **边框可见性** | 浅色模式使用 `border-gray-200` | 使用 `border-white/10`（不可见） |

### 布局与间距

| 规则 | 推荐 | 避免 |
| --- | --- | --- |
| **悬浮导航** | 加入 `top-4 left-4 right-4` 间距 | 导航贴边 `top-0 left-0 right-0` |
| **内容内边距** | 考虑固定导航的高度 | 内容被固定元素遮挡 |
| **一致最大宽度** | 统一使用 `max-w-6xl` 或 `max-w-7xl` | 混用不同容器宽度 |

---

## 交付前检查清单

在交付 UI 代码前，逐项确认：

### 视觉质量
- [ ] 不使用 emoji 作为图标（改用 SVG）
- [ ] 所有图标来自同一图标集（Heroicons/Lucide）
- [ ] 品牌 Logo 正确（已从 Simple Icons 核对）
- [ ] Hover 状态不引发布局抖动
- [ ] 直接使用主题色（bg-primary），不要使用 var() 包裹

### 交互
- [ ] 所有可点击元素都有 `cursor-pointer`
- [ ] Hover 状态具备清晰视觉反馈
- [ ] 过渡动画平滑（150-300ms）
- [ ] 键盘导航时焦点可见

### 亮/暗模式
- [ ] 浅色模式文本对比度足够（至少 4.5:1）
- [ ] 浅色模式下玻璃/透明元素可见
- [ ] 两种模式下边框都清晰可见
- [ ] 交付前测试两种模式

### 布局
- [ ] 悬浮元素与边缘有合适间距
- [ ] 无内容被固定导航遮挡
- [ ] 375px、768px、1024px、1440px 响应正常
- [ ] 移动端无水平滚动

### 可访问性
- [ ] 所有图片都有 alt 文本
- [ ] 表单输入有 labels
- [ ] 颜色不是唯一的提示方式
- [ ] 遵循 `prefers-reduced-motion`
