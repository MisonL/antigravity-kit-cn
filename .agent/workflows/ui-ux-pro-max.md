---
description: AI 驱动的设计智能工作流，支持多风格检索、设计系统生成与落地实现
---

# ui-ux-pro-max

面向 Web 与移动端的设计/实现流程。核心是通过搜索脚本产出“可执行设计系统”，再按技术栈落地页面。

## 触发方式

`/ui-ux-pro-max [需求描述]`

适用意图：
- 设计新页面
- 重做视觉风格
- 改善交互体验
- 修复 UI 专业性问题

## 前置检查

先检查 Python 环境：

```bash
python3 --version || python --version
```

若未安装 Python，则按系统安装：

macOS:
```bash
brew install python3
```

Ubuntu / Debian:
```bash
sudo apt update && sudo apt install python3
```

Windows:
```powershell
winget install Python.Python.3.12
```

## 标准流程（必须按顺序）

### Step 1：解析需求

提取以下信息：
- 产品类型：SaaS / 电商 / 作品集 / Dashboard / Landing 等
- 风格关键词：极简、专业、俏皮、未来感等
- 行业：医疗、金融、教育、游戏等
- 技术栈：React / Vue / Next.js；若未指定默认 `html-tailwind`

### Step 2：生成设计系统（强制）

必须先执行 `--design-system`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

此步骤会：
1. 并行检索多领域信息（产品/风格/色彩/排版等）。
2. 应用推理规则选择最佳组合。
3. 输出完整设计系统（样式、色板、字体、特效、反模式）。

### Step 2b：持久化设计系统（推荐）

跨会话复用时，增加 `--persist`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

会生成：
- `design-system/MASTER.md`：全局设计真相源
- `design-system/pages/`：页面级覆盖规则

若要写入页面覆盖：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

分层读取规则：
1. 先查 `design-system/pages/<page>.md`
2. 页面规则覆盖 MASTER
3. 页面文件不存在则只使用 `MASTER.md`

### Step 3：按需补充领域检索

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> -n <max_results>
```

常见 domain：
- `style`：更多风格方案
- `typography`：字体组合
- `color`：色板策略
- `landing`：首屏与转化结构
- `chart`：图表推荐
- `ux`：可用性与无障碍规则

### Step 4：按技术栈检索实现建议

若用户未指定栈，默认 `html-tailwind`：

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

可选栈：
- `html-tailwind`
- `react`
- `nextjs`
- `vue`
- `svelte`
- `swiftui`
- `react-native`
- `flutter`
- `shadcn`
- `jetpack-compose`

## 输出格式

`--design-system` 支持两种输出：

```bash
# 终端友好（默认）
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# 文档友好
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

## 专业 UI 基线规则（交付前检查）

- 不使用 emoji 作为 UI 图标，统一 SVG 图标集。
- 所有可点击区域必须有 `cursor-pointer` 与明确 hover 反馈。
- 禁止 hover 导致布局抖动。
- 浅色模式文本对比度必须达标，避免“浅灰字+浅背景”。
- 固定导航不得遮挡正文，需预留顶部空间。
- 至少验证 375/768/1024/1440 四档断点。
- 无障碍必检：`alt`、表单 `label`、键盘焦点可见、`prefers-reduced-motion`。

## 上游脚本流程补充（reference 对齐）

该工作流以检索脚本为主线，以下命令必须保留并可执行：

- `python3 --version || python --version`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> -n <max_results>`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system`
- `python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown`

执行顺序硬规则：
- 先生成 design-system；
- 再做 domain/stack 补充检索；
- 最后再进入页面实现。
