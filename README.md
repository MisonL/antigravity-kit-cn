# Antigravity Kit CN

[![npm version](https://img.shields.io/npm/v/%40mison%2Fag-kit-cn?logo=npm)](https://www.npmjs.com/package/@mison/ag-kit-cn)
[![npm downloads](https://img.shields.io/npm/dm/%40mison%2Fag-kit-cn?logo=npm)](https://www.npmjs.com/package/@mison/ag-kit-cn)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 面向 Antigravity 与 Codex 的中文 AI Agent 模板工具包，提供 Skills、Agents、Workflows 与 ag-kit CLI 的一键安装、更新和治理。
>
> [!NOTE]
> 本仓库基于上游 vudovn/antigravity-kit 同步更新并进行中文化，同时提供 Codex（代码智能体环境）适配。

## 快速安装

```bash
npm install -g @mison/ag-kit-cn
```

运行环境要求：Node.js `>=18`（建议使用当前 LTS）。

然后在你的目标项目中执行一次同步（推荐）：

```bash
cd /path/to/your-project
ag-kit sync
```

可选：不做全局安装，直接在仓库目录执行：

```bash
cd /path/to/antigravity-kit-cn
node bin/ag-kit.js sync --path /path/to/your-project
```

如需源码开发安装：

```bash
git clone https://github.com/MisonL/antigravity-kit-cn.git
cd antigravity-kit-cn
npm install -g .
```

安装会统一写入 `.agents`，并自动生成兼容投影（`.agent`、`.gemini`），同时把托管内容注入工作区 `AGENTS.md` 与 `antigravity.rules`（说明性托管区块，不是 Codex 官方 `.rules` 审批策略文件）。

### Codex 规则边界说明

- `antigravity.rules`：本项目生成并注入的托管说明文件，用于记录受管资源与运维约束。
- `.rules`（如 `~/.codex/rules/default.rules`）：Codex 官方的命令审批/执行策略文件（Starlark 规则，支持 `prefix_rule()`）。
- 默认行为：本项目不会自动写入你的全局 `~/.codex/rules`，避免引入不可预期的全局副作用。
- 如需启用官方 `.rules` 审批策略，请参考 `docs/codex-rules-template.md`。

### ⚠️ 关于 `.gitignore` 的重要说明

如果你正在使用 **Cursor** 或 **Windsurf** 等 AI 编辑器，将 `.agent/`、`.agents/`、`.gemini/` 添加到 `.gitignore` 可能会阻止 IDE 索引工作流，导致斜杠命令（如 `/plan`、`/debug`）无法出现在对话建议中。

**推荐方案：**
1. 确保 `.agent/`、`.agents/`、`.gemini/` **不要** 出现在项目的 `.gitignore` 中。
2. 作为替代方案，将其加入本地排除文件：`.git/info/exclude`。

## 包含内容

| 组件 | 数量 | 描述 |
| --- | --- | --- |
| Agents（智能体） | 20 | 专家级 AI 人设（前端、后端、安全、产品、QA 等） |
| Skills（技能） | 37 | 特定领域的知识模块 |
| Workflows（工作流） | 12 | 斜杠命令流程 |

## 使用方法

### 使用智能体

**无需显式提及智能体！** 系统会自动检测并应用合适专家：

```
你："添加 JWT 认证"
AI：🤖 正在应用 @security-auditor + @backend-specialist...

你："修复深色模式按钮"
AI：🤖 正在使用 @frontend-specialist...

你："登录返回 500 错误"
AI：🤖 正在使用 @debugger 进行系统化分析...
```

**工作原理：**

- 静默分析请求
- 自动检测领域（前端、后端、安全等）
- 选择最佳专家
- 告知你正在应用哪方面的专业知识
- 无需了解系统架构即可获得专家级响应

**优势：**

- ✅ 零学习曲线：描述需求即可
- ✅ 始终获得专家响应
- ✅ 透明：显示正在使用的智能体
- ✅ 仍可显式提及智能体进行覆盖

### 使用工作流

使用斜杠命令调用工作流：

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

示例：

```
/brainstorm 认证系统
/create 带 Hero 部分的着陆页
/debug 为什么登录失败
```

### 使用技能

技能会根据任务上下文自动加载。AI 会阅读技能描述并应用相关知识。

## CLI 工具

把它当成一个按钮：绝大多数情况只需要 `ag-kit sync`。

| 命令 | 描述 |
| --- | --- |
| `ag-kit sync` | 同步当前项目到最新状态（未安装则 init，已安装则 update，必要时自愈） |
| `ag-kit verify --json` | 结构化校验输出（CI 友好） |
| `ag-kit rollback --dry-run` | 回退预演（确认后再执行 rollback） |

### 上手（精简）

```bash
ag-kit sync

ag-kit verify --json --path ./myapp

ag-kit rollback --dry-run
```

更多参数与解释请直接看帮助：

```bash
ag-kit help
ag-kit help sync
ag-kit help --advanced
```

### 高级（少用）

只有当你明确知道自己需要时，再使用这些命令/参数（不建议抄一堆参数当“习惯用法”）：

```bash
# 显式拆分流程
ag-kit init
ag-kit update
ag-kit doctor --fix

# 强制覆盖安装（危险）
ag-kit init --force --path ./myapp

# 预演/静默（调试开关）
ag-kit update --dry-run --path ./myapp
ag-kit update --quiet --path ./myapp

# 索引/批量升级
ag-kit update-all --prune-missing --non-interactive
ag-kit update-all --targets full
ag-kit sync --no-index

# legacy 迁移（仅当项目只剩旧版 .agent 且无托管证据时）
ag-kit update --accept-legacy-agent
ag-kit update-all --accept-legacy-agent
ag-kit doctor --fix --accept-legacy-agent

# 兼容参数（仍会归一为 full）
ag-kit init --target codex
ag-kit init --target gemini

# 索引排除
ag-kit exclude list
ag-kit exclude add --path /path/to/dir
ag-kit exclude remove --path /path/to/dir

# 状态（只读）
ag-kit status --path ./myapp
```

升级与迁移说明：
- 旧项目升级到 `3.0.0-beta.0`：`docs/migration-v3-beta.md`
- 运维/批量升级/索引机制：`docs/operations.md`

### 开发维护命令

```bash
npm run clean           # 清理本地生成产物（如 web/.next、web/node_modules）
npm run clean:dry-run   # 预览将被清理的路径
npm test                # 只执行 tests/ 目录下测试
npm run health-check    # 一键执行全链路健康复检
npm run verify:3platform -- --path /path/to/workspace  # 三平台可用性与配置一致性检查
```

如果你在 `web/` 子项目内开发，可按需执行：

```bash
npm install --prefix web
npm run lint --prefix web
```

### CI 与分支门禁

- 仓库内置 GitHub Actions 工作流：`.github/workflows/ci.yml`。
- PR 到 `main` / `preview/agents-v3` 会执行两个检查：
  - `CI / test`
  - `CI / health-check`
- 建议在仓库 Branch Protection 中将以上两项设为 Required status checks，避免未验证改动直接合并。

## 卸载

### 卸载本机全局 CLI

```bash
npm uninstall -g @mison/ag-kit-cn
```

如果你同时安装过别名或上游英文版，可一并清理：

```bash
npm uninstall -g antigravity-kit-cn antigravity-kit @vudovn/ag-kit
```

### 卸载某个项目内的 Antigravity Kit

macOS / Linux / WSL:

```bash
cd /path/to/your-project
rm -rf .agent .agents .agents-backup .gemini antigravity.rules
# 如需清理 v3 新版全局回退快照：
# rm -rf ~/.ag-kit/backups
# 若确认 .codex 是本工具托管 legacy（含 manifest.json 且 target=codex/full），可再删除：
# rm -rf .codex
```

Windows PowerShell:

```powershell
Set-Location C:\path\to\your-project
Remove-Item .agent,.agents,.agents-backup,.gemini,antigravity.rules -Recurse -Force -ErrorAction SilentlyContinue
# 如需清理 v3 新版全局回退快照：
# Remove-Item "$env:USERPROFILE\.ag-kit\backups" -Recurse -Force -ErrorAction SilentlyContinue
# 若确认 .codex 为本工具托管 legacy，再手动删除 .codex
```

Windows CMD:

```cmd
cd /d C:\path\to\your-project
rmdir /s /q .agent
rmdir /s /q .agents
rmdir /s /q .agents-backup
rmdir /s /q .gemini
del /f /q antigravity.rules
REM 若确认 .codex 为本工具托管 legacy，再手动删除 .codex
REM 如需清理 v3 新版全局回退快照:
REM rmdir /s /q %USERPROFILE%\.ag-kit\backups
```

### 清理批量更新索引（可选）

```bash
ag-kit exclude add --path /path/to/your-project
```

说明：全局卸载只会移除 `ag-kit` 命令，不会删除你本地 clone 的源码目录。

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

## 许可证

MIT © Vudovn, Mison
