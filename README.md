# 灵轨（Ling）

[![npm version](https://img.shields.io/npm/v/%40mison%2Fling?logo=npm)](https://www.npmjs.com/package/@mison/ling)
[![npm downloads](https://img.shields.io/npm/dm/%40mison%2Fling?logo=npm)](https://www.npmjs.com/package/@mison/ling)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 面向 Gemini CLI、Antigravity 与 Codex 的中文 AI Agent 模板工具包，提供 Skills、Agents、Workflows 与 CLI 的一键安装、更新和治理。

## 致谢

本项目吸收并整合了社区项目的经验与资产，感谢：

- [vudovn/antigravity-kit](https://github.com/vudovn/antigravity-kit)
- [2217173240/Coding-Agent-prompt-best-practice](https://github.com/2217173240/Coding-Agent-prompt-best-practice)

## 快速安装

```bash
npm install -g @mison/ling
```

或使用 Bun：

```bash
bun install -g @mison/ling
```

然后在你的目标项目中初始化：

```bash
cd /path/to/your-project
ling init --target gemini   # 安装 Gemini 结构（.agent）
ling init --target codex    # 安装 Codex 结构（.agents + 托管规则注入）
# 或者直接 ling init，在交互中选择目标
```

说明：
- npm 安装的主命令入口为 `ling`。

可选：不做全局安装，直接在仓库目录执行：

```bash
cd /path/to/Ling
node bin/ling.js init --target codex --path /path/to/your-project
```

如需源码开发安装：

```bash
git clone https://github.com/MisonL/Ling.git
cd Ling
npm install -g .
```

这会把所选目标结构安装到你的项目中（`gemini -> .agent`，`codex -> .agents`），并把 Codex 托管内容注入工作区 `AGENTS.md` 与 `ling.rules`（说明性托管区块，不是 Codex 官方 `.rules` 审批策略文件）。

### 全局安装（跨项目复用 Skills）

为区分“项目安装”和“全局安装”，提供专用命令面：

- 项目安装：`ling init` / `ling update`（功能最完整）
- 全局安装：`ling global sync`（仅同步 Skills，跨项目复用）
- 默认行为：`ling global sync` 未指定 `--target/--targets` 时，同步 `codex + gemini`
- 真实落盘：
  - `codex` -> `~/.codex/skills/`
  - `gemini` -> 同时写入 `~/.gemini/skills/` 与 `~/.gemini/antigravity/skills/`

示例：

```bash
ling global sync
ling global sync --target codex
ling global sync --target gemini
ling global status
```

全局安装只同步 Skills，不写入 Rules/Agents/Workflows，避免全局副作用。
覆盖同名 Skill 前会自动备份；手动回滚方式见 `docs/TECH.md`。

规划与边界细节见：`docs/PLAN.md`（规划）与 `docs/TECH.md`（技术）。

版本与发布约定：
- npm 包版本遵循 SemVer（`package.json`）
- git tag 与 CLI `--version` 显示使用 `ling-<SemVer>`（例如 `ling-1.0.0`）

### Spec Profile（可选进阶能力）

- 默认关闭，不随 `ling init / update / global sync` 自动安装
- 当前已落地全局层命令：
  - `ling spec status`
  - `ling spec enable`
  - `ling spec disable`
- 默认目标：`ling spec enable` 未指定目标时，会启用 `codex + gemini`
- 当前全局层会安装：
  - Skills：`harness-engineering`、`cybernetic-systems-engineering`
  - Spec 运行模板：写入 `~/.ling/spec/templates/`
  - Spec 参考资料：写入 `~/.ling/spec/references/`
- 目标平台落盘：
  - `codex` -> `~/.codex/skills/`
  - `gemini` -> 同时写入 `~/.gemini/skills/` 与 `~/.gemini/antigravity/skills/`

示例：

```bash
ling spec status
ling spec enable --target codex
ling spec disable --target codex
```

说明：

- `spec enable` 会在覆盖同名 Skill 前自动备份到 `~/.ling/backups/spec/<timestamp>/...`
- `spec disable` 会优先恢复启用前快照；若启用前不存在同名资源，则删除由 Spec 安装的资源
- 项目级 `spec init/remove/doctor` 仍处于后续阶段，本版本尚未开放

### Codex 规则边界说明

- `ling.rules`：本项目生成并注入的托管说明文件，用于记录受管资源与运维约束。
- `.rules`（如 `~/.codex/rules/default.rules`）：Codex 官方的命令审批/执行策略文件（Starlark 规则，支持 `prefix_rule()`）。
- 默认行为：本项目不会自动写入你的全局 `~/.codex/rules`，避免引入不可预期的全局副作用。
- 如需启用官方 `.rules` 审批策略，请参考 `docs/TECH.md` 的「Codex 官方 `.rules`（手动配置）」小节。

### 跨平台与文本编码约束

- 编码与换行：分发到用户项目与全局目录的模板资源使用 UTF-8 与 LF。
- 终端可读性：模板文本与脚本输出避免使用 Emoji 或装饰性 Unicode 字符，统一采用纯 ASCII 标记，提升 Windows/WSL/Linux/macOS 的显示一致性。

### 注意：关于 `.gitignore` 的重要说明

如果你正在使用 **Cursor** 或 **Windsurf** 等 AI 编辑器，将 `.agent/`、`.agents/` 添加到 `.gitignore` 可能会阻止 IDE 索引工作流，导致斜杠命令（如 `/plan`、`/debug`）无法出现在对话建议中。

**推荐方案：**
1. 确保 `.agent/`、`.agents/` **不要** 出现在项目的 `.gitignore` 中。
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
AI：正在应用 @security-auditor + @backend-specialist...

你："修复深色模式按钮"
AI：正在使用 @frontend-specialist...

你："登录返回 500 错误"
AI：正在使用 @debugger 进行系统化分析...
```

**工作原理：**

- 静默分析请求
- 自动检测领域（前端、后端、安全等）
- 选择最佳专家
- 告知你正在应用哪方面的专业知识
- 无需了解系统架构即可获得专家级响应

**优势：**

- 零学习曲线：描述需求即可
- 始终获得专家响应
- 透明：显示正在使用的智能体
- 仍可显式提及智能体进行覆盖

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

CLI（命令行界面）工具：

| 命令 | 描述 |
| --- | --- |
| `ling init` | 安装指定目标：gemini/codex |
| `ling update` | 更新当前项目已安装目标 |
| `ling update-all` | 批量更新所有已登记工作区 |
| `ling doctor` | 诊断安装完整性（可 `--fix` 自愈） |
| `ling global sync` | 全局同步 Skills（默认同步 codex + gemini；其中 gemini 同步到 gemini-cli 与 antigravity） |
| `ling global status` | 查看全局 Skills 安装状态 |
| `ling exclude` | 管理全局索引排除清单 |
| `ling status` | 检查安装状态 |

### 常用选项

```bash
ling init --target gemini --path ./myapp        # 安装 Gemini 到指定目录
ling init --target codex --path ./myapp         # 安装 Codex 到指定目录
ling init --targets gemini,codex --path ./myapp # 一次安装多个目标
ling init --non-interactive --target codex      # 非交互模式必须显式指定目标
ling init --target codex --no-index --path ./tmp-workspace # 安装但不写入全局索引
ling init --branch dev --force                  # 覆盖安装并指定分支
ling init --quiet --dry-run                     # 预览操作而不执行
ling update --target codex --path ./myapp       # 更新指定目标（默认会刷新索引）
ling update --target codex --no-index --path ./myapp # 更新但不刷新索引
ling doctor --target codex --fix --path ./myapp # 检查并自动修复
ling update-all --targets codex                 # 批量更新所有登记工作区里的 codex 目标
ling update-all --prune-missing                 # 清理索引中已失效的路径
ling exclude list                               # 查看排除清单
ling exclude add --path /path/to/dir            # 新增排除路径
ling exclude remove --path /path/to/dir         # 删除排除路径
```

### 状态命令约定

- `ling status --quiet`：输出 `installed` / `broken` / `missing`
- `ling global status --quiet`：输出 `installed` / `broken` / `missing`
- 退出码：`0=installed`，`1=broken`，`2=missing`
- `status` 面向自动化健康判断；如需问题明细，使用 `ling doctor`

### 批量更新机制

- 执行 `ling init` / `ling update` 时，会把工作区路径登记到全局索引文件：
  - macOS / Linux / WSL: `~/.ling/workspaces.json`
  - Windows PowerShell / CMD: `%USERPROFILE%\.ling\workspaces.json`
- 默认会自动排除灵轨工具包源码目录和系统临时目录（如 macOS `/var/folders/...`、`/tmp`、`/private/tmp`，Linux `/tmp`，Windows `%TEMP%`）。
- 可通过 `--no-index` 让 `init/update` 跳过索引登记（适合临时验证目录）。
- `ling update` 只依赖当前目录（或 `--path` 指定目录）的已安装目标，不依赖全局索引。
- 执行 `ling update-all` 时，会遍历索引并批量更新每个工作区（可通过 `--targets` 限定目标）。
- 可用 `--prune-missing` 自动移除索引里已失效的工作区路径。
- 对于历史项目（尚未登记，或曾经 `--no-index` 跳过登记），可在该项目执行一次不带 `--no-index` 的 `ling update`（或 `ling init --force`）后纳入索引。
- 可通过 `ling exclude add/remove/list` 维护自定义排除路径（支持排除整棵目录树）。
- 也可通过环境变量 `LING_INDEX_PATH` 指定自定义索引路径。

### 开发维护命令

```bash
bun run clean           # 清理本地生成产物（如 web/.next、web/node_modules）
bun run clean:dry-run   # 预览将被清理的路径
bun run test            # 只执行 tests/ 目录下测试
bun run health-check    # 一键执行全链路健康复检
```

如果你在 `web/` 子项目内开发，可按需执行：

```bash
bun install --cwd web
bun run lint --cwd web
```

> 说明：若你通过 `bun install -g` 安装 CLI，Bun 默认会阻止本包 `postinstall`。上游同名包冲突提示会在首次执行 `ling init/update/update-all/global sync` 时给出。

## 卸载

### 卸载本机全局 CLI

```bash
npm uninstall -g @mison/ling
```

如果你之前安装过旧包：`@mison/ag-kit-cn`（已停止维护），可一并清理：

```bash
npm uninstall -g @mison/ag-kit-cn
```

如果你还安装过上游英文版，可一并清理：

```bash
npm uninstall -g antigravity-kit @vudovn/ag-kit
```

### 卸载某个项目内的灵轨

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

### 清理批量更新索引（可选）

```bash
ling exclude add --path /path/to/your-project
```

说明：全局卸载只会移除 `ling` 命令，不会删除你本地 clone 的源码目录。

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
