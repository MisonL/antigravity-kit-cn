---
description: 规划并实现 UI。AI 驱动的设计智能引擎，内置 50+ 种风格、95+ 套配色方案，并支持自动生成设计系统。
---

# /ui-ux-pro-max - 全方位 UI/UX 设计与实施

$ARGUMENTS

---

## 预选要求 (Prerequisites)

检查是否已安装 Python：

```bash
python3 --version || python --version
```

如果未安装，请根据操作系统安装：

**macOS:**

```bash
brew install python3
```

**Ubuntu/Debian:**

```bash
sudo apt update && sudo apt install python3
```

**Windows:**

```bash
winget install Python.Python.3.12
```

---

## 如何使用此工作流 (How to Use This Workflow)

当用户请求 UI/UX 相关工作（设计、构建、创建、实施、评审、修复、改进）时，请遵循以下流程：

### 第一步：分析用户需求 (Step 1: Analyze User Requirements)

从用户请求中提取关键信息：

- **产品类型**: SaaS, 电子商务, 作品集, 仪表盘, 落地页等。
- **风格关键词**: 极简, 活泼, 专业, 优雅, 深色模式等。
- **行业**: 医疗保健, 金融科技, 游戏, 教育等。
- **技术栈**: React, Vue, Next.js, 默认使用 `html-tailwind`。

### 第二步：生成设计系统 (REQUIRED)

**务必从 `--design-system` 开始**，以获取带有理由的详尽建议：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

此命令将：

1. 并行搜索 5 个领域（产品、风格、颜色、落地页、排版）。
2. 应用 `ui-reasoning.csv` 中的推理规则来选择最佳匹配。
3. 返回完整的设计系统：模式、风格、颜色、排版、效果。
4. 包含应避免的反模式 (Anti-patterns)。

### 第二步 B：持久化设计系统 (Master + Overrides Pattern)

要保存设计系统以便在不同会话中分层检索，请添加 `--persist`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

这将创建：

- `design-system/MASTER.md` — 全局单一真理源 (Global Source of Truth)。
- `design-system/pages/` — 用于存储特定页面覆盖设置的文件夹。

**带有特定页面的覆盖：**

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

### 第三步：补充详细搜索 (根据需要)

获取设计系统后，使用领域搜索获取更多细节：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| 需求         | 领域 (Domain) | 示例                                    |
| ------------ | ------------- | --------------------------------------- |
| 更多风格选项 | `style`       | `--domain style "glassmorphism dark"`   |
| 图表建议     | `chart`       | `--domain chart "real-time dashboard"`  |
| UX 最佳实践  | `ux`          | `--domain ux "animation accessibility"` |
| 替代字体     | `typography`  | `--domain typography "elegant luxury"`  |
| 落地页结构   | `landing`     | `--domain landing "hero social-proof"`  |

### 第四步：技术栈指南 (默认：html-tailwind)

获取特定实现的最佳实践。如果用户未指定，**默认使用 `html-tailwind`**。

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

---

## 搜索参考 (Search Reference)

### 可用领域 (Available Domains)

| 领域         | 用途                   |
| ------------ | ---------------------- |
| `product`    | 产品类型建议           |
| `style`      | UI 风格、颜色、效果    |
| `typography` | 字体配对、Google Fonts |
| `color`      | 根据产品类型的调色板   |
| `landing`    | 页面结构、CTA 策略     |
| `chart`      | 图表类型、库建议       |
| `ux`         | 最佳实践、反模式       |
| `react`      | React/Next.js 性能优化 |
| `web`        | Web 界面指南 (WIG)     |

### 可用技术栈 (Available Stacks)

`html-tailwind` (默认), `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## 交付前检查清单 (Pre-Delivery Checklist)

### 视觉质量

- [ ] 不使用 Emoji 作为图标 (使用 SVG 代替)
- [ ] 所有图标来自一致的图标集 (Heroicons/Lucide)
- [ ] 品牌 LOGO 正确 (从 Simple Icons 验证)
- [ ] 悬停状态不会引起布局抖动

### 交互

- [ ] 所有可点击元素均有 `cursor-pointer`
- [ ] 悬停状态提供清晰的视觉反馈
- [ ] 渡动画平滑 (150-300ms)

### 响应式

- [ ] 在 375px, 768px, 1024px, 1440px 下均正常显示
- [ ] 移动端无水平滚动条
