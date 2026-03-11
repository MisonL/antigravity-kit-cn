# 全局与项目安装规划

## 目标
- 明确区分“全局安装”和“项目安装”的能力边界与使用方式。
- 保持命令面简洁、优雅，避免参数膨胀。
- 全局仅同步 Skills，确保安全、可控、可回滚。

## 非目标
- 不在全局写入 Rules、Agents、Workflows。
- 不自动修改任何平台的审批策略文件（如 Codex 的 `~/.codex/rules/*`）。
- 不提供全局删除（`--prune`）默认行为。

## 术语
- 项目安装：在当前项目目录落盘（`.agent/`、`.agents/` 等），功能最完整。
- 全局安装：写入用户目录（跨项目生效），仅同步 Skills。

## 命令设计（定稿）

### 项目安装（功能最完整）
- `ag-kit init` / `ag-kit update` / `ag-kit status`
- 目标路径：
  - `gemini` -> `.agent/`
  - `codex` -> `.agents/` + 托管区块注入 `AGENTS.md` / `antigravity.rules`

### 全局安装（跨项目复用 Skills）
- `ag-kit global sync [--target codex|gemini] [--branch <name>] [--dry-run] [--quiet]`
- `ag-kit global status`
- 目标路径：
  - `codex` -> `$HOME/.agents/skills/`
  - `gemini` -> `$HOME/.gemini/antigravity/skills/`
- 仅同步 Skills，其他能力保持项目级。

> 说明：使用 `sync` 统一“首次安装 + 更新”，避免 `init/update` 双心智。全局命令不提供 `--path`。

## 路径映射与来源

### Codex
- 来源：`.agents/`（构建生成 `.agents/skills`）
- 目标：`$HOME/.agents/skills/<skill>/`
- 备注：Workflow 转换为 `workflow-<name>` Skill。

### Antigravity（gemini）
- 来源：`.agents/skills/`
- 目标：`$HOME/.gemini/antigravity/skills/<skill>/`

### 测试覆盖
- `AG_KIT_GLOBAL_ROOT` 覆盖 `$HOME`，用于测试隔离。

## 覆盖与备份策略
- 覆盖单位：每个 Skill 目录原子替换。
- 默认不删除：不清理用户已有的其他技能目录。
- 覆盖备份：覆盖同名 Skill 前备份到 `~/.ag-kit/backups/global/<timestamp>/...`。

## 兼容性边界
- 全局 Rules：高风险，全局生效，默认不写。
- 全局 Agents/Workflows：各平台入口不一致，默认不写。
- 结论：全局仅同步 Skills 是最稳定、最安全的选择。

## 测试计划
1. 全局路径解析：验证 `AG_KIT_GLOBAL_ROOT` 覆盖正确。
2. Codex 全局同步：能看到 `workflow-plan/SKILL.md`。
3. Antigravity 全局同步：能看到 `clean-code/SKILL.md`。
4. 覆盖备份：覆盖同名 Skill 时产生备份。
5. `--dry-run`：只输出预览，不写入磁盘。

## 文档更新计划
- README：新增“项目安装 vs 全局安装”的使用说明。
- 运维手册：新增全局目录说明与风险边界。
- 官方整理/术语文档：补充“全局只同步 Skills”的约定。

## 风险与应对
- 风险：用户全局已有同名 Skill。
  - 应对：覆盖前备份，保留用户可回滚路径。
- 风险：用户误把全局当项目级功能。
  - 应对：文档强调“全局仅 Skills”，并在 `status` 输出中区分“global/project”。

## 已确认决策
- 仅提供 `ag-kit global sync/status`，不提供 `ag-kit init --global` 别名。
- 不提供 `--prune`（默认关闭）。
