# Antigravity Kit CN

> [!NOTE]
> **本仓库说明**：本仓库跟踪上游原仓库 [vudovn/antigravity-kit](https://github.com/vudovn/antigravity-kit) 的变更。主要进行全量汉化处理，并对 `GEMINI.md` 及相关指令进行了逻辑调整，以确立系统的中文原生地位。

> 包含技能 (Skills)、智能体 (Agents) 和工作流 (Workflows) 的 AI Agent 模版

<div  align="center">
    <a href="https://unikorn.vn/p/antigravity-kit?ref=unikorn" target="_blank"><img src="https://unikorn.vn/api/widgets/badge/antigravity-kit?theme=dark" alt="Antigravity Kit - Nổi bật trên Unikorn.vn" style="width: 210px; height: 54px;" width="210" height="54" /></a>
    <a href="https://unikorn.vn/p/antigravity-kit?ref=unikorn" target="_blank"><img src="https://unikorn.vn/api/widgets/badge/antigravity-kit/rank?theme=dark&type=daily" alt="Antigravity Kit - Hàng ngày" style="width: 250px; height: 64px;" width="250" height="64" /></a>
    <a href="https://launch.j2team.dev/products/antigravity-kit" target="_blank"><img src="https://launch.j2team.dev/badge/antigravity-kit/dark" alt="Antigravity Kit on J2TEAM Launch" width="250" height="54" /></a>
</div>

## 快速安装 (Quick Install)

```bash
git clone https://github.com/MisonL/antigravity-kit-cn.git
cd antigravity-kit-cn
npm install -g .
```

然后在你的目标项目中初始化：

```bash
cd /path/to/your-project
ag-kit init
```

可选：不做全局安装，直接在仓库目录执行：

```bash
cd /path/to/antigravity-kit-cn
node bin/ag-kit.js init --path /path/to/your-project
```

这将把包含所有模板的 `.agent` 文件夹安装到你的项目中。

## 卸载 (Uninstall)

### 卸载本机全局 CLI

```bash
npm uninstall -g antigravity-kit-cn
```

如果你同时安装过别名或上游英文版，可一并清理：

```bash
npm uninstall -g antigravity-kit @vudovn/ag-kit
```

### 卸载某个项目内的 Antigravity Kit

macOS / Linux / WSL:

```bash
cd /path/to/your-project
rm -rf .agent
```

Windows PowerShell:

```powershell
Set-Location C:\path\to\your-project
Remove-Item .agent -Recurse -Force
```

Windows CMD:

```cmd
cd /d C:\path\to\your-project
rmdir /s /q .agent
```

### 清理批量更新索引（可选）

```bash
ag-kit exclude add --path /path/to/your-project
```

说明：全局卸载只会移除 `ag-kit` 命令，不会删除你本地 clone 的源码目录。

### ⚠️ 关于 `.gitignore` 的重要说明

如果您正在使用 **Cursor** 或 **Windsurf** 等 AI 编辑器，将 `.agent/` 文件夹添加到 `.gitignore` 可能会阻止 IDE 索引工作流。这会导致斜杠命令（如 `/plan`, `/debug`）无法在对话建议下拉菜单中显示。

从当前版本开始，执行 `ag-kit init` / `ag-kit update` 时会自动扫描项目根目录 `.gitignore`，并移除会忽略 `.agent` 的规则，同时在终端提示具体处理结果。
另外会进行上游英文版冲突检测：
- 在 `npm install -g .` 阶段通过 `postinstall` 检查全局是否存在 `@vudovn/ag-kit`
- 在 `ag-kit init` / `ag-kit update` / `ag-kit update-all` 执行前再次检查

在 `npm install -g .` 阶段检测到冲突时，会交互确认是否自动卸载上游包：
- 选择卸载：自动执行 `npm uninstall -g @vudovn/ag-kit`
- 选择不卸载：明确提示“`ag-kit` 命令由最后安装的版本生效”，然后继续安装

**推荐方案：**
为了在保持 `.agent/` 文件夹本地化（不被 Git 追踪）的同时维持 AI 功能：

1. 确保 `.agent/` **不要** 出现在项目的 `.gitignore` 中。
2. 作为一个替代方案，请将其添加到您的本地排除文件：`.git/info/exclude`

## 包含内容 (What's Included)

| 组件 (Component) | 数量 | 描述                                               |
| ---------------- | ---- | -------------------------------------------------- |
| **Agents**       | 20   | 专家级 AI 人格 (前端、后端、安全、产品经理、QA 等) |
| **Skills**       | 37   | 特定领域的知识模块                                 |
| **Workflows**    | 11   | 斜杠命令流程                                       |

## 使用方法 (Usage)

### 使用智能体 (Using Agents)

**无需显式提及 Agent！** 系统会自动检测并应用正确的专家：

```
You: "添加 JWT 认证"
AI: 🤖 正在应用 @security-auditor + @backend-specialist...

You: "修复深色模式按钮"
AI: 🤖 正在使用 @frontend-specialist...

You: "登录返回 500 错误"
AI: 🤖 正在使用 @debugger 进行系统化分析...
```

**工作原理：**

- 静默分析你的请求
- 自动检测领域 (前端、后端、安全等)
- 选择最佳专家
- 告知你正在应用哪方面的专业知识
- 无需了解系统架构即可获得专家级响应

**优势：**

- ✅ 零学习曲线 - 描述需求即可
- ✅ 始终获得专家响应
- ✅ 透明 - 显示正在使用的 Agent
- ✅ 仍然可以通过显式提及 Agent 来覆盖

### 使用工作流 (Using Workflows)

使用斜杠命令调用工作流：

| 命令             | 描述             |
| ---------------- | ---------------- |
| `/brainstorm`    | 在实施前探索方案 |
| `/create`        | 创建新功能或应用 |
| `/debug`         | 系统化调试       |
| `/deploy`        | 部署应用         |
| `/enhance`       | 改进现有代码     |
| `/orchestrate`   | 多智能体协同     |
| `/plan`          | 创建任务拆解     |
| `/preview`       | 本地预览变更     |
| `/status`        | 检查项目状态     |
| `/test`          | 生成并运行测试   |
| `/ui-ux-pro-max` | 50 种风格的设计  |

示例：

```
/brainstorm 认证系统
/create 带 Hero 部分的着陆页
/debug 为什么登录失败
```

### 使用技能 (Using Skills)

技能基于任务上下文自动加载。AI 会阅读技能描述并应用相关知识。

## CLI 工具

| 命令            | 描述                             |
| --------------- | -------------------------------- |
| `ag-kit init`   | 安装 `.agent` 文件夹到你的项目中 |
| `ag-kit update` | 更新到最新版本                   |
| `ag-kit update-all` | 批量更新所有已登记工作区      |
| `ag-kit exclude` | 管理全局索引排除清单            |
| `ag-kit status` | 检查安装状态                     |

### 选项

```bash
ag-kit init --force        # 覆盖现有的 .agent 文件夹
ag-kit init --path ./myapp # 安装到指定目录
ag-kit init --branch dev   # 使用特定分支
ag-kit init --quiet        # 抑制输出 (用于 CI/CD)
ag-kit init --dry-run      # 预览操作而不执行
ag-kit update-all          # 批量更新所有已登记工作区
ag-kit update-all --prune-missing # 清理索引中已失效的路径
ag-kit exclude list        # 查看排除清单
ag-kit exclude add --path /path/to/dir    # 新增排除路径
ag-kit exclude remove --path /path/to/dir # 删除排除路径
```

### 批量更新机制

- 执行 `ag-kit init` / `ag-kit update` 时，CLI 会把工作区路径登记到全局索引文件：
  - macOS / Linux / WSL: `~/.ag-kit/workspaces.json`
  - Windows PowerShell / CMD: `%USERPROFILE%\.ag-kit\workspaces.json`
- 默认会自动排除 antigravity-kit 源码目录，避免把工具包仓库本身登记进批量更新索引。
- 执行 `ag-kit update-all` 时，会遍历该索引并批量更新每个工作区。
- 可用 `--prune-missing` 自动移除索引里已不存在的工作区路径。
- 对于历史项目（尚未登记），可在该项目执行一次 `ag-kit update`（或 `ag-kit init --force`）后纳入索引。
- 可通过 `ag-kit exclude add/remove/list` 维护自定义排除路径（支持排除整棵目录树）。
- 也可通过环境变量 `AG_KIT_INDEX_PATH` 指定自定义索引路径（跨平台通用）。

## 文档 (Documentation)

- **[Web App 示例](https://antigravity-kit.vercel.app//docs/guide/examples/brainstorm)** - 创建 Web 应用的分步指南
- **[在线文档](https://antigravity-kit.vercel.app//docs)** - 在线浏览所有文档

## 请我喝咖啡 (Buy me coffee)

<p align="center">
  <a href="https://buymeacoffee.com/vudovn">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
  </a>
</p>

<p align="center"> - or - </p>

<p align="center">
  <img src="https://img.vietqr.io/image/mbbank-0779440918-compact.jpg" alt="Buy me coffee" width="200" />
</p>

## 许可证 (License)

MIT © Vudovn
