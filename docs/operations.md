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
├── .agents-backup/       # 覆盖前自动备份
├── AGENTS.md             # 根入口（保留用户内容 + 托管区块）
└── antigravity.rules     # 根托管说明（保留用户内容 + 托管区块）
```

### Legacy 目录策略
- `.codex`：仅在识别为本工具托管 legacy 时迁移/清理。
- 非托管 `.codex`：保留不删除。

## 2. 核心运维动作

### 2.1 初始化/升级
```bash
ag-kit init
ag-kit update
```

- `--target gemini|codex` 仍兼容，但内部归一为 full。
- 非交互默认 full；遇到 `.agent` / `.gemini/agents` 冲突时，交互询问处理策略。
- 首轮执行 `init/update/update-all/doctor --fix` 时，会对索引中的受管 legacy 工作区执行一次自动迁移并记录状态。

### 2.2 批量更新
```bash
ag-kit update-all --targets full
```

- 工作区索引：`~/.ag-kit/workspaces.json`（或 `AG_KIT_INDEX_PATH` 自定义）。
- 自动迁移状态：`~/.ag-kit/migrations/v3.json`（或 `AG_KIT_MIGRATION_STATE_PATH` 自定义）。
- `ag-kit status` 只读显示 `Auto-Migration(v3): done|pending`。
- 可配合 `--prune-missing` 清理失效路径。

### 2.3 诊断与修复
```bash
ag-kit doctor
ag-kit doctor --fix
```

- 检查 `.agents` 与 manifest 完整性。
- 自动重放托管区块与兼容投影。

## 3. 备份与漂移

- 更新前若检测到用户修改冲突，会备份到 `.agents-backup/<timestamp>/`。
- `manifest.json` 无法解析时，走全量快照备份后再更新。

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
