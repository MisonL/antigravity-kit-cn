# PLAN-agents-v3-plan4（Sync-First 极简产品化）

## 0. 文档信息
- 计划名称：Agents v3 Plan4（Sync-First 极简产品化）
- 计划状态：Draft
- 计划日期：2026-03-06
- 覆盖版本：`3.0.0-beta.0`（分支 `preview/agents-v3`）
- 关键约束：以 `.agents` 为唯一源目录；兼容 `.agent/.gemini/.codex` 旧结构；仅处理本项目托管内容
- 设计哲学（Jobs 风格）：默认路径只有一条；复杂度必须被隐藏；任何写入必须可回退；输出与概念尽量少

## 1. 与原 PLAN-agents-v3-full 的差异（需求侧变化）
原计划更偏“工程落地清单”，当前老板的需求更偏“产品体验收敛”。差异合并如下：
1. 从“多个命令”收敛为“一个主入口”：对外只推荐 `ag-kit sync`。
2. 从“参数显性”变为“渐进披露”：帮助与文档默认只展示最小、安全、常用选项，其余通过 `--advanced` 进入。
3. 从“本地备份目录为主”收敛到“全局可追溯回滚”：统一备份/回滚快照目录（并兼容旧版 `.agents-backup`）。
4. 从“迁移更激进”改为“安全边界更强”：仅 legacy `.agent` 且无托管证据的迁移，在非交互环境必须显式确认（`--accept-legacy-agent`）。
5. 从“反复传参”变为“可控默认”：提供用户级默认配置（`~/.ag-kit/config.json` 或 `AG_KIT_CONFIG_PATH`），且永远以 CLI 显式参数优先。

## 2. 产品目标（只保留 3 个动作）
1. 安装/升级/自愈：`ag-kit sync`
2. 校验（CI/自动化）：`ag-kit verify --json`
3. 安全回退：`ag-kit rollback --dry-run`（确认后再 `ag-kit rollback`）

其余命令仍保留用于故障处理与维护，但不作为主路径暴露。

## 3. 用户旅程（默认无脑）
1. 新项目（首次）：安装 CLI 后在项目根目录执行 `ag-kit sync`。
2. 老项目（日常）：在项目根目录执行 `ag-kit sync`。
3. CI：执行 `ag-kit verify --json --path <dir>`，用结构化输出做门禁。
4. 出问题：先 `ag-kit rollback --dry-run` 评估，再决定回退或进入高级诊断（`doctor --fix`）。

## 4. CLI 体验规范（少即是多）
### 4.1 命令分层
- 推荐层（默认 help 可见）：`sync`、`verify`、`rollback`
- 高级层（只在 `--advanced` 或文档“高级”区出现）：`init/update/update-all/doctor/status/exclude`

### 4.2 帮助分层
1. `ag-kit help` 只显示推荐层与如何进入高级。
2. `ag-kit help <cmd>` 默认只显示最小、安全选项（例如 `--path/--quiet/--dry-run`）。
3. `ag-kit help <cmd> --advanced` 才展示迁移、投影、索引、分支等高级开关。

### 4.3 安全与确定性
1. 任何会写入工作区的操作，都必须在写入前创建 rollback 快照。
2. 非交互环境不做“猜测性迁移”：legacy `.agent` 迁移必须显式 `--accept-legacy-agent`。
3. 只覆盖托管资源：依赖 manifest/命名空间/投影标记识别；非托管文件一律保留并提示。

## 5. 目录体系（事实源与投影）
1. Canonical：`<workspace>/.agents/**`（唯一主目录，含 `manifest.json`）。
2. Projections：
   - `<workspace>/.agent/**`：Antigravity 兼容投影（可禁用）。
   - `<workspace>/.gemini/**`：Gemini CLI 兼容投影（合并 settings + namespaced agents）。
   - 根 `AGENTS.md` / `antigravity.rules`：只注入托管区块，不破坏用户内容。

## 6. 迁移与冲突策略（默认不打扰，必要时可选）
1. 交互终端：遇到未托管 `.agent` / `.gemini/agents` 冲突时询问策略（备份替换/保留/改名/跳过等）。
2. 非交互：使用确定性默认策略（`.agent` 备份替换；`.gemini/agents` 追加），但 legacy `.agent` 迁移仍需显式确认。
3. 备份收敛：统一落到 `~/.ag-kit/backups/<workspace-key>/<timestamp>/`，并兼容读取旧 `.agents-backup/<timestamp>/`。

## 7. 文档与文案（让用户看不到复杂度）
1. README 与文档站首页只教 1 条命令：`ag-kit sync`。
2. `verify/rollback` 作为“安全与自动化”第二层入口可见。
3. 其余内容统一放在 `docs/operations.md` 与“高级（少用）”章节，避免新手被淹没。

## 8. 质量门禁与跨平台兼容
1. Node.js `>=18`（跨平台基线）。
2. 验证命令：
   - `bun run test`
   - `bun run health-check`
   - `cd web && bun install && bun run lint`（仅在修改 web 时）
3. 关键风险点：Windows 路径分隔符、CRLF、权限与可执行位、`~` 展开、临时目录别名（如 macOS `/private/var`）。

## 9. 非目标（保持克制）
1. 不新增“为了好看而存在”的命令；不为配置再引入新的交互流程。
2. 不删除兼容命令与参数（除非进入明确的 deprecate 周期），避免破坏现有脚本。
3. 不改写用户非托管内容（包括 `.codex` 与用户自建 `.agent/.gemini` 文件）。

