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

### ⚠️ 关于 `.gitignore` 的重要说明

如果您正在使用 **Cursor** 或 **Windsurf** 等 AI 编辑器，将 `.agent/` 文件夹添加到 `.gitignore` 可能会阻止 IDE 索引工作流。这会导致斜杠命令（如 `/plan`, `/debug`）无法在对话建议下拉菜单中显示。

从当前版本开始，执行 `ag-kit init` / `ag-kit update` 时会自动扫描项目根目录 `.gitignore`，并移除会忽略 `.agent` 的规则，同时在终端提示具体处理结果。

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
| `ag-kit status` | 检查安装状态                     |

### 选项

```bash
ag-kit init --force        # 覆盖现有的 .agent 文件夹
ag-kit init --path ./myapp # 安装到指定目录
ag-kit init --branch dev   # 使用特定分支
ag-kit init --quiet        # 抑制输出 (用于 CI/CD)
ag-kit init --dry-run      # 预览操作而不执行
```

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
