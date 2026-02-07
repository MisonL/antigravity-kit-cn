---
description: 规划并实现 UI
---

---

## description: AI 驱动的设计智能引擎，内置 50+ 种风格、95+ 套配色方案，并支持自动生成设计系统。

# ui-ux-pro-max

针对 Web 和移动端应用的全面设计指南。集成了 50+ 种风格、97 套配色方案、57 组字体配对、99 条 UX 准则以及覆盖 9 种技术栈的 25 种图表类型。提供基于优先级的推荐逻辑及可搜索数据库。

## 前置要求 (Prerequisites)

检查是否已安装 Python：

```bash
python3 --version || python --version
```

如果未安装，请根据老板的操作系统进行安装：

**macOS:**

```bash
brew install python3
```

**Ubuntu/Debian:**

```bash
sudo apt update && sudo apt install python3
```

**Windows:**

```powershell
winget install Python.Python.3.12
```

---

## 如何使用此工作流 (How to Use This Workflow)

当收到 UI/UX 相关请求（设计、构建、创建、实现、审查、修复、改进）时，请遵循以下流程：

### 步骤 1：分析用户需求

从老板的请求中提取关键信息：

- **产品类型**：SaaS、电商、作品集、仪表盘、落地页等。
- **风格关键词**：极简 (minimal)、活泼 (playful)、专业 (professional)、优雅 (elegant)、深色模式等。
- **所属行业**：医疗、金融科技、游戏、教育等。
- **技术栈**：React、Vue、Next.js，如果未指定则默认使用 `html-tailwind`。

### 步骤 2：生成设计系统 (必须执行)

**始终以 `--design-system` 参数开始**，以获取包含理由说明的全面建议：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<产品类型> <行业> <关键词>" --design-system [-p "项目名称"]
```

此命令将执行：

1. 并行搜索 5 个维度（产品、风格、色彩、落地页、字体）。
2. 应用 `ui-reasoning.csv` 中的推理规则来选择最佳匹配。
3. 返回完整的设计系统：包含布局模式、风格、配色、字体和视觉效果。
4. 提供需要规避的反模式 (Anti-patterns)。

**示例：**

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "美容 水疗 健康服务" --design-system -p "Serenity Spa"
```

### 步骤 2b：持久化设计系统 (Master + Overrides 模式)

若要保存设计系统以便在不同会话中分层级检索，请添加 `--persist` 参数：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<查询语句>" --design-system --persist -p "项目名称"
```

这将创建：

- `design-system/MASTER.md` —— 包含所有设计规则的全局“单一真值源 (Source of Truth)”。
- `design-system/pages/` —— 用于存储特定页面覆盖规则的文件夹。

**针对特定页面的覆盖：**

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<查询语句>" --design-system --persist -p "项目名称" --page "dashboard"
```

此外还会创建：

- `design-system/pages/dashboard.md` —— 该页面相对于主配置的偏差/覆盖规则。

**分层检索机制：**

1. 构建具体页面（如“结账页”）时，首先检查 `design-system/pages/checkout.md`。
2. 若该文件存在，其规则将**覆盖** Master 文件中的规则。
3. 若不存在，则完整沿用 `design-system/MASTER.md`。

### 步骤 3：补充详细搜索（根据需要）

在获得基础设计系统后，可以通过维度搜索获取更多细节：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<关键词>" --domain <维度> [-n <最大结果数>]
```

**何时需要详细搜索：**

| 需求         | 维度 (Domain) | 搜索示例                             |
| ------------ | ------------- | ------------------------------------ |
| 更多风格选项 | `style`       | `--domain style "玻璃拟态 深色模式"` |
| 图表推荐     | `chart`       | `--domain chart "实时数据仪表盘"`    |
| UX 最佳实践  | `ux`          | `--domain ux "动画 无障碍性"`        |
| 备选字体     | `typography`  | `--domain typography "优雅 奢华"`    |
| 落地页结构   | `landing`     | `--domain landing "首屏 社交证明"`   |

### 步骤 4：技术栈指南 (默认：html-tailwind)

获取特定实现的最佳实践。如果未指定技术栈，**默认使用 `html-tailwind`**。

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<关键词>" --stack html-tailwind
```

可用技术栈：`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`。

---

## 搜索参考 (Search Reference)

### 可用维度 (Available Domains)

| 维度         | 用途                     | 示例关键词                                      |
| ------------ | ------------------------ | ----------------------------------------------- |
| `product`    | 产品类型建议             | SaaS, 电商, 作品集, 医疗, 美容, 服务            |
| `style`      | UI 风格、色彩、视觉效果  | 玻璃拟态, 极简主义, 深色模式, 粗野主义          |
| `typography` | 字体配对、Google 字体    | 优雅, 活泼, 专业, 现代                          |
| `color`      | 按产品类型划分的配色方案 | saas, ecommerce, healthcare, beauty, fintech    |
| `landing`    | 页面结构、CTA 策略       | 首屏 (hero), 以首屏为中心, 评价, 价格, 社交证明 |
| `chart`      | 图表类型、库推荐         | 趋势, 对比, 时间轴, 漏斗, 饼图                  |
| `ux`         | 最佳实践、反模式         | 动画, 无障碍性, z-index, 加载中                 |
| `react`      | React/Next.js 性能优化   | 瀑布流, 包大小, suspense, memo, 重渲染          |
| `web`        | Web 界面指南             | aria, 焦点, 键盘导航, 语义化, 虚拟列表          |
| `prompt`     | AI 提示词、CSS 关键词    | (风格名称)                                      |

### 可用技术栈 (Available Stacks)

| 技术栈            | 关注点                                 |
| ----------------- | -------------------------------------- |
| `html-tailwind`   | Tailwind 原子类、响应式、a11y (默认)   |
| `react`           | 状态管理、Hooks、性能、模式            |
| `nextjs`          | SSR、路由、图片优化、API 路由          |
| `vue`             | Composition API, Pinia, Vue Router     |
| `svelte`          | Runes, stores, SvelteKit               |
| `swiftui`         | 视图、状态、导航、动画                 |
| `react-native`    | 组件、导航、列表                       |
| `flutter`         | Widget、状态、布局、主题               |
| `shadcn`          | shadcn/ui 组件、主题、表单、模式       |
| `jetpack-compose` | Composables, Modifiers, 状态提升, 重组 |

---

## 示例工作流 (Example Workflow)

**需求描述：** “制作一个专业护肤服务的落地页”

### 步骤 1：分析需求

- 产品类型：美容/水疗服务
- 风格关键词：优雅、专业、柔和
- 行业：美容/健康
- 技术栈：html-tailwind (默认)

### 步骤 2：生成设计系统 (必须执行)

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "护肤 美容 水疗 优雅" --design-system -p "优雅护肤"
```

**产出：** 包含布局模式、风格、配色、字体、效果及需要规避的反模式的完整设计系统。

### 步骤 3：补充详细搜索（根据需要）

```bash
# 获取关于动画和无障碍性的 UX 准则
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "动画 无障碍性" --domain ux

# 如果需要，获取备选的字体方案
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "优雅 奢华 衬线体" --domain typography
```

### 步骤 4：技术栈指南

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "布局 响应式 表单" --stack html-tailwind
```

**后续：** 综合设计系统与详细搜索结果，开始落地实施设计方案。

---

## 输出格式 (Output Formats)

`--design-system` 标志支持两种输出格式：

```bash
# ASCII 盒子（默认） —— 最适合终端显示
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "金融科技 加密货币" --design-system

# Markdown 格式 —— 最适合作为文档保存
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "金融科技 加密货币" --design-system -f markdown
```

---

## 获取更佳结果的技巧

1. **关键词要具体** —— “医疗 SaaS 仪表盘”优于简单的“应用”。
2. **多次搜索** —— 不同的关键词会揭示不同的洞察。
3. **组合维度** —— 风格 + 字体 + 色彩 = 完整的设计系统。
4. **始终检查 UX** —— 搜索“动画”、“z-index”、“无障碍性”来规避常见问题。
5. **指定技术栈** —— 获取特定实现的最佳实践。
6. **迭代** —— 如果第一次搜索不理想，请换一批关键词。

---

## 专业 UI 的常用准则 (Common Rules)

以下是常被忽略的、会导致界面显得极其不专业的细节：

### 图标与视觉元素

| 准则                        | 推荐做到 (Do)                         | 禁止行为 (Don't)                      |
| --------------------------- | ------------------------------------- | ------------------------------------- |
| **严禁使用 Emoji 作为图标** | 使用 SVG 图标 (Heroicons, Lucide)     | 直接用 🎨 🚀 ⚙️ 等 Emoji 作为界面图标 |
| **稳定的悬停状态**          | 悬停时改变色彩或透明度                | 使用会导致布局抖动的缩放转换 (scale)  |
| **准确的品牌 Logo**         | 从 Simple Icons 获取官方 SVG          | 盲目猜测或使用错误的 Logo 路径        |
| **统一的图标尺寸**          | 使用固定 viewBox (24x24) 以及 w-6 h-6 | 随机混合不同的图标大小                |

### 交互与光标

| 准则         | 推荐做到 (Do)                                  | 禁止行为 (Don't)                |
| ------------ | ---------------------------------------------- | ------------------------------- |
| **指针光标** | 给所有可点击/可悬停的卡片添加 `cursor-pointer` | 在交互元素上保留默认光标        |
| **悬停反馈** | 提供视觉反馈（色彩、阴影、边框）               | 没有任何迹象表明元素是可交互的  |
| **平滑过渡** | 使用 `transition-colors duration-200`          | 状态瞬间切换或切换过慢 (>500ms) |

### 亮色/深色模式对比度

| 准则                 | 推荐做到 (Do)                       | 禁止行为 (Don't)                         |
| -------------------- | ----------------------------------- | ---------------------------------------- |
| **亮色下的玻璃卡片** | 使用 `bg-white/80` 或更高不透明度   | 使用 `bg-white/10`（由于太透明会看不见） |
| **亮色下的文本对比** | 使用 `#0F172A` (slate-900) 作为正文 | 使用 `#94A3B8` (slate-400) 作为正文      |
| **亮色下的辅助文本** | 至少使用 `#475569` (slate-600)      | 使用 gray-400 或更浅的色彩               |
| **边框可见度**       | 亮色模式下使用 `border-gray-200`    | 使用 `border-white/10`（几乎不可见）     |

### 布局与间距

| 准则               | 推荐做到 (Do)                       | 禁止行为 (Don't)                        |
| ------------------ | ----------------------------------- | --------------------------------------- |
| **悬浮导航栏**     | 添加 `top-4 left-4 right-4` 间距    | 将导航栏紧贴边缘 `top-0 left-0 right-0` |
| **内容填充**       | 考虑到固定导航栏的高度              | 让内容被固定定位的元素遮盖              |
| **统一的最大宽度** | 统一使用 `max-w-6xl` 或 `max-w-7xl` | 混合使用不同的容器宽度                  |

---

## 交付前检查清单 (Pre-Delivery Checklist)

在交付 UI 代码前，请验证以下事项：

### 视觉品质

- [ ] 未将 Emoji 用作图标（已替换为 SVG）。
- [ ] 所有图标来自统一的图标库（Heroicons/Lucide）。
- [ ] 品牌 Logo 准确无误（已从 Simple Icons 验证）。
- [ ] 悬停状态不会导致布局偏移。
- [ ] 直接使用主题颜色（如 bg-primary），而不是嵌套的变量。

### 交互体验

- [ ] 所有可点击元素均具备 `cursor-pointer`。
- [ ] 悬停状态提供清晰的视觉反馈。
- [ ] 过渡效果平滑（150-300ms）。
- [ ] 键盘导航时焦点状态清晰可见。

### 亮色/深色模式

- [ ] 亮色模式文本具备足够的对比度（最小 4.5:1）。
- [ ] 玻璃拟态/透明元素在亮色模式下清晰可见。
- [ ] 边框在两种模式下均清晰可见。
- [ ] 交付前已对两种模式进行过完整测试。

### 布局适配

- [ ] 悬浮元素距离边缘有合适的间距。
- [ ] 无内容被固定导航栏遮挡。
- [ ] 在 375px, 768px, 1024px, 1440px 下均适配良好。
- [ ] 移动端无水平滚动条。

### 无障碍性 (Accessibility)

- [ ] 所有图片均具备 alt 文本。
- [ ] 表单输入项均具备关联的 Label。
- [ ] 颜色并非传递信息的唯一手段。
- [ ] 尊重系统的“减少运动 (prefers-reduced-motion)”设置。
