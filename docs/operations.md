# Ag-Kit（命令行工具）运维手册

本文面向维护 Ag-Kit 及其托管资源的 DevOps 与高级用户，基线为 v3 统一目录体系。

## 1. 目录结构

```text
/my-project
├── .agents/              # Canonical（唯一主目录）
│   ├── manifest.json     # 完整性清单（v3）
│   ├── skills/ agents/ workflows/ rules/
│   ├── AGENTS.md         # 托管区块源
│   ├── antigravity.rules # 托管区块源
│   └── mcp_config.json   # MCP（含 Context7 主备）
├── .agent/               # Antigravity 兼容投影（自动生成）
├── .gemini/              # Gemini 兼容投影（自动生成/合并）
├── .agents-backup/       # 旧版本地备份目录（升级后会自动迁移）
├── AGENTS.md             # 根入口（保留用户内容 + 托管区块）
└── antigravity.rules     # 根托管说明（保留用户内容 + 托管区块）
```

### Legacy 目录策略
- `.codex`：仅在识别为本工具托管 legacy 时迁移/清理。
- 非托管 `.codex`：保留不删除。

## 2. 核心运维动作

### 2.1 初始化/升级
```bash
ag-kit sync
ag-kit init
ag-kit update
```

- `--target gemini|codex` 仍兼容，但内部归一为 full。
- 若项目仅存在 legacy `.agent`（无托管证据），可通过 `--accept-legacy-agent` 触发迁移到 v3 `.agents`（`update/update-all/doctor --fix` 均支持）。
- 非交互默认 full；遇到 `.agent` / `.gemini/agents` 冲突时，交互询问处理策略。
- 首轮执行 `sync/init/update/update-all/doctor --fix` 时，会对索引中的受管 legacy 工作区执行一次自动迁移并记录状态。
- 可选：使用 `~/.ag-kit/config.json`（或 `AG_KIT_CONFIG_PATH`）设置默认 `nonInteractive/disableAgentProjection` 等参数，减少反复传参。

### 2.2 批量更新
```bash
ag-kit update-all --targets full
```

- 工作区索引：`~/.ag-kit/workspaces.json`（或 `AG_KIT_INDEX_PATH` 自定义）。
- 自动迁移状态：`~/.ag-kit/migrations/v3.json`（或 `AG_KIT_MIGRATION_STATE_PATH` 自定义）。
- `ag-kit status` 只读显示 `Auto-Migration(v3): done|pending`。
- 可配合 `--prune-missing` 清理失效路径。
- 如需批量迁移仅 legacy `.agent` 的旧项目，可加 `--accept-legacy-agent`（会为每个工作区创建 rollback 快照）。
- 交互终端下，若某个工作区存在 `.agent` / `.gemini/agents` 冲突，会逐工作区询问策略（`.agent`：备份替换 / 直接替换 / 保留 / 改名失效 / 停用投影；`.gemini/agents`：追加 / 备份替换 / 跳过）。
- 非交互环境下，默认策略仍为：`.agent` 备份替换，`.gemini/agents` 追加。
- `.gemini/agents` 默认仅管理本项目命名空间 `ag-kit-*.md`：会追加/更新并清理已不再存在的 namespaced 旧文件（不影响用户自定义文件）。
- 如需在交互终端下避免逐工作区询问，可加 `--non-interactive` 强制按非交互默认策略执行。
- 可使用 `--disable-agent-projection` 停用 `.agent` 兼容投影（会移除托管 `.agent`，或将非托管 `.agent` 改名保留）。

### 2.3 诊断与修复
```bash
ag-kit doctor
ag-kit doctor --fix
```

- 检查 `.agents` 与 manifest 完整性。
- 自动重放托管区块与兼容投影。
- 若项目仅存在 legacy `.agent`，可使用 `ag-kit doctor --fix --accept-legacy-agent` 迁移到 v3 并完成自检。
- 如需在交互终端下避免提示，可加 `--non-interactive`；但 legacy `.agent` 迁移仍需显式 `--accept-legacy-agent`（非交互）或交互确认。

### 2.4 一键回退
```bash
ag-kit rollback
ag-kit rollback --backup <timestamp>
```

- 默认使用最近一次可用快照。
- 快照文件位于 `~/.ag-kit/backups/<workspace-key>/<timestamp>/rollback-manifest.json`（升级/安装前自动创建）。
- 兼容读取旧版 `.agents-backup/<timestamp>/rollback-manifest.json`。
- 建议先执行 `ag-kit rollback --dry-run` 预演，再执行正式回退。

### 2.5 三平台可用性检查
```bash
ag-kit verify --path /path/to/workspace
ag-kit verify --path /path/to/workspace --json
npm run verify:3platform -- --path /path/to/workspace
```

- 自动检查 Canonical/Projection 结构、`manifest`、Gemini MCP 主备、`status/doctor/rollback --dry-run`。
- 输出 Codex / Gemini CLI / Antigravity 的运行时提问词与“分平台预期口径”。
- 注意：Codex 往往仅回显 `AGENTS.md` 指令入口；Antigravity/Gemini 更常回显 GEMINI 规则来源，不要求三家展示完全同一组路径。

### 2.6 用户配置（可选）

配置文件路径：
- 默认：`~/.ag-kit/config.json`
- 覆盖：环境变量 `AG_KIT_CONFIG_PATH`

示例（把 CLI 常用默认固化下来，减少反复传参）：

```json
{
  "defaults": {
    "nonInteractive": true,
    "disableAgentProjection": true
  }
}
```

说明：CLI 参数优先于配置文件。

## 3. 备份与漂移

- 安装/更新前会创建一键回退快照到 `~/.ag-kit/backups/<workspace-key>/<timestamp>/`（含 `rollback-manifest.json` 与 `rollback/`）。
- 单次操作（install/update/doctor 修复）产生的 rollback 快照与冲突备份统一落在同一 `<timestamp>` 目录，便于追溯。
- 可通过 `AG_KIT_BACKUP_ROOT` 自定义备份根目录。
- `manifest.json` 无法解析时仍可通过 rollback 快照回退（建议先执行 `ag-kit rollback --dry-run` 预演）。

## 4. MCP（Context7 主备）

默认托管：
- `context7`: `@upstash/context7-mcp`
- `context7_backup`: `@iflow-mcp/context7-mcp@1.0.0`

说明：执行时优先 `context7`，官方不可用时尝试 `context7_backup`；配置示例仅使用规范字段（如 `env`），不使用 `values`。

## 5. 卸载注意

不要无条件删除 `.codex`、`.gemini`。推荐仅删除本工具托管目录：

```bash
rm -rf .agents .agent .agents-backup .gemini
```

如需删除 `.codex`，请先确认其为本工具托管 legacy。

## 6. CI 与分支保护

- 工作流文件：`.github/workflows/ci.yml`
- 门禁检查：
  - `CI / test`
  - `CI / health-check`

建议将上述两项设为 `main`（及需要保护的预发布分支）的 Required status checks。

可选：使用 GitHub CLI 一次性设置 `main` 保护（需仓库管理员权限）：

```bash
gh api -X PUT repos/MisonL/antigravity-kit-cn/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="CI / test" \
  -f required_status_checks.contexts[]="CI / health-check" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1
```
