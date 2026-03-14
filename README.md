# 灵轨（Ling）

[![npm version](https://img.shields.io/npm/v/%40mison%2Fling?logo=npm)](https://www.npmjs.com/package/@mison/ling)
[![npm downloads](https://img.shields.io/npm/dm/%40mison%2Fling?logo=npm)](https://www.npmjs.com/package/@mison/ling)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 面向 Gemini CLI、Antigravity 与 Codex 的中文 AI Agent 模板工具包，提供 Skills、Agents、Workflows 与 CLI 的一键安装、更新和治理。

## 快速安装

```bash
npm install -g @mison/ling
```

`ling` 解决三件事：

- 项目内安装 Gemini / Antigravity / Codex 资产
- 全局同步可复用 Skills
- 为项目启用 Spec 工作流

最常见的项目初始化：

```bash
cd /path/to/your-project
ling init --target gemini
ling init --target antigravity
ling init --target codex
```

如果要同时安装多个目标：

```bash
ling init --targets gemini,antigravity,codex
```

如果你要先做全局 Skills 安装：

```bash
ling global sync
ling global sync --target codex
ling global sync --target gemini
ling global sync --target antigravity
```

## 先选模式

| 你要做什么 | 命令 | 结果 |
| --- | --- | --- |
| 给当前项目安装完整资产 | `ling init` | 项目内生成 `.agent/` / `.agents/`；共享 `.agent/` 时会维护 `.ling/install-state.json` |
| 给电脑全局同步可复用 Skills | `ling global sync` | 写入 `~/.agents/skills/`、`~/.gemini/skills/` 等 |
| 给项目启用 Spec 工作流 | `ling spec init` | 项目内生成 `issues.csv` 等 Spec 资产 |

一句话区分：

- `init` 面向项目
- `global sync` 面向整台电脑
- `spec init` 面向项目里的任务驱动流程

## 项目安装

项目安装是默认用法，也是能力最完整的模式。

- `gemini` 写入项目内 `.agent/`
- `antigravity` 写入项目内 `.agent/`（与 Gemini 复用目录，命令与状态独立）
- `codex` 写入项目内 `.agents/`
- Ling 会在项目内写入 `.ling/install-state.json`，用于记录共享 `.agent/` 上到底注册了 `gemini`、`antigravity` 还是两者
- Codex 额外注入工作区 `AGENTS.md` 和 `ling.rules`

```bash
cd /path/to/your-project
ling init --target gemini
ling init --target antigravity
ling init --target codex
ling update
ling doctor
```

非交互环境下，`init` 必须显式传 `--target` 或 `--targets`。

## 全局 Skills

全局模式只做一件事：把 Skills 同步到真实消费端目录，方便跨项目复用。

```bash
ling global sync
ling global sync --target codex
ling global sync --target gemini
ling global sync --target antigravity
ling global status
```

- `codex` -> `~/.agents/skills/`
- `gemini` -> `~/.gemini/skills/`
- `antigravity` -> `~/.gemini/antigravity/skills/`

全局模式不会写入项目 Rules、Agents、Workflows，也不会改你的全局 `~/.codex/rules`。

## Spec

Spec 是核心进阶功能，但理解它只需要记住两句：

- `ling spec enable` 给这台电脑安装全局 Spec 工具箱
- `ling spec init` 给当前项目创建真正要用的 `issues.csv`

也就是说：

- 全局 Spec 负责模板、参考资料、约束
- 项目里的 `issues.csv` 永远放在项目根目录

最常用的两种方式：

```bash
# 完整模式：项目自带 Spec 资产
cd /path/to/your-project
ling spec init

# 轻量模式：只在项目里放 issues.csv，其他能力走全局后备
cd /path/to/your-project
ling spec enable
ling spec init --csv-only
```

你会得到：

- 完整模式：`<project>/.ling/spec/`、`<project>/issues.csv`、`<project>/docs/reviews/`、`<project>/docs/handoff/`
- `--csv-only`：`<project>/issues.csv`、`<project>/docs/reviews/`、`<project>/docs/handoff/`
- 全局 Spec 资源：`~/.ling/spec/templates/`、`~/.ling/spec/references/`、`~/.ling/spec/profiles/`

如果你只想要一个本机演练空间，而不是某个真实项目：

```bash
ling spec init --spec-workspace
```

`spec doctor` 用于检查当前项目的 Spec 状态。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `ling init` | 在项目内安装目标资产 |
| `ling update` | 更新当前项目已安装目标 |
| `ling doctor` | 诊断当前项目安装状态 |
| `ling status` | 输出项目安装状态 |
| `ling global sync` | 全局同步 Skills |
| `ling global status` | 查看全局 Skills 状态 |
| `ling spec enable` | 启用全局 Spec 工具箱 |
| `ling spec init` | 在当前项目初始化 Spec |
| `ling spec doctor` | 检查当前项目 Spec 状态 |
| `ling update-all` | 批量更新已登记项目 |

常用示例：

```bash
ling init --targets gemini,antigravity,codex --path ./myapp
ling init --target antigravity --path ./myapp
ling init --target codex --force --path ./myapp
ling update --path ./myapp
ling doctor --target codex --fix --path ./myapp
ling spec enable
ling spec init --csv-only --path ./myapp
ling update-all --targets antigravity,codex
ling global sync --quiet --dry-run
```

## 文档

- [技术说明](docs/TECH.md)
- [设计规划](docs/PLAN.md)
- [贡献说明](CONTRIBUTING.md)
- [更新日志](CHANGELOG.md)

## 使用说明

- `ling` 的仓库模板源是 `.agents/`
- 文本与模板资源使用 UTF-8 与 LF
- 不会自动写入全局 `~/.codex/rules`
- 如果 AI 编辑器依赖索引，请不要把 `.agent/`、`.agents/` 放进项目 `.gitignore`

版本约定：

- npm 版本遵循 SemVer
- Git tag 和 `ling --version` 显示为 `ling-<SemVer>`

源码方式运行：

```bash
git clone https://github.com/MisonL/Ling.git
cd Ling
npm install
node bin/ling.js init --target codex --path /path/to/your-project
```

## 包含内容

| 组件 | 数量 | 描述 |
| --- | --- | --- |
| Agents（智能体） | 20 | 专家级 AI 人设（前端、后端、安全、产品、QA 等） |
| Skills（技能） | 49 | 特定领域的知识模块（以 `SKILL.md` 为准，含子技能目录） |
| Workflows（工作流） | 12 | 斜杠命令流程 |

## 工作流与命令

工作流通过斜杠命令触发：

| 命令 | 描述 |
| --- | --- |
| `/brainstorm` | 在实施前探索方案 |
| `/create` | 创建新功能或应用 |
| `/debug` | 系统化调试 |
| `/deploy` | 部署应用 |
| `/enhance` | 改进现有代码 |
| `/orchestrate` | 多智能体协同 |
| `/plan` | 创建任务拆解 |
| `/preview` | 本地预览变更 |
| `/restore-localize-compat` | 文档机制对齐与语义汉化流程（维护工作流） |
| `/status` | 检查项目状态 |
| `/test` | 生成并运行测试 |
| `/ui-ux-pro-max` | 50 种风格的设计 |

技能会按上下文自动加载，不需要手工管理大多数 Skill。

## 开发维护命令

```bash
npm run clean           # 清理本地生成产物（如 web/.next、web/node_modules）
npm run clean:dry-run   # 预览将被清理的路径
npm test                # 执行 tests/ 目录下测试
npm run health-check    # 一键执行全链路健康复检
```

如果你在 `web/` 子项目内开发，可按需执行：

```bash
cd web
npm install
npm run lint
```

## 卸载

```bash
npm uninstall -g @mison/ling
```

旧包和上游旧包如已安装，可一并清理：

```bash
npm uninstall -g @mison/ag-kit-cn
npm uninstall -g antigravity-kit @vudovn/ag-kit
```

macOS / Linux / WSL:

```bash
cd /path/to/your-project
rm -rf .agent .agents .agents-backup .codex
```

Windows PowerShell:

```powershell
Set-Location C:\path\to\your-project
Remove-Item .agent,.agents,.agents-backup,.codex -Recurse -Force -ErrorAction SilentlyContinue
```

Windows CMD:

```cmd
cd /d C:\path\to\your-project
rmdir /s /q .agent
rmdir /s /q .agents
rmdir /s /q .agents-backup
rmdir /s /q .codex
```

可选：把某个项目移出批量更新索引

```bash
ling exclude add --path /path/to/your-project
```

全局卸载只会移除 `ling` 命令，不会删除你本地 clone 的源码目录。

## 请我喝咖啡

> 本项目由 **Mison** 进行汉化处理与额外功能开发。

<table>
  <tr>
    <td align="center" width="50%">
      <strong>支持 Mison（本仓库维护者）</strong><br />
      <img src="image/README/mison-wechat-pay.jpg" alt="Mison 微信赞赏码" width="260" /><br />
      <sub>微信赞赏码</sub>
    </td>
    <td align="center" width="50%">
      <strong>感谢上游作者 vudovn 创建并维护 Antigravity-Kit</strong><br />
      <a href="https://buymeacoffee.com/vudovn">
        <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
      </a><br />
      <img src="https://img.vietqr.io/image/mbbank-0779440918-compact.jpg" alt="Upstream donation channel" width="200" />
    </td>
  </tr>
</table>

## 致谢

本项目吸收并整合了社区项目的经验与资产，感谢：

- [vudovn/antigravity-kit](https://github.com/vudovn/antigravity-kit)
- [2217173240/Coding-Agent-prompt-best-practice](https://github.com/2217173240/Coding-Agent-prompt-best-practice)

## 许可证

MIT © [vudovn](https://github.com/vudovn), [Mison](https://github.com/MisonL), [2217173240](https://github.com/2217173240)
