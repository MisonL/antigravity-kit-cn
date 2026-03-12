# Ag-Kit 技术说明（TECH）

## 快速验证（维护者）
```bash
bun install
bun run test
bun run ci:verify
bun run health-check
cd web && bun install && bun run lint
```

## 核心目录与职责
- `.agents/`：仓库模板源（Canonical）
- `bin/ag-kit.js`：CLI 入口与命令分发
- `bin/adapters/`：目标差异（`gemini` / `codex`）
- `bin/core/`：构建/转换（将 Workflows 投影为 Codex Skills 等）
- `bin/utils/`：原子写入、manifest、托管区块等通用能力

## 路径映射（最重要）
### 项目级（功能最完整）
- `gemini`：项目根目录 `.agent/`
- `codex`：项目根目录 `.agents/`（受管）+ `.agents-backup/`（漂移覆盖备份）

### 全局级（仅同步 Skills）
- `codex`：`$HOME/.agents/skills/`
- `gemini`：`$HOME/.gemini/antigravity/skills/`

> 说明：仓库内 Skills 源路径为 `.agents/skills/`，全局同步会将其写入上述全局目录。

## 端到端链路（简述）
### 项目安装 / 更新
- `init`：选择目标 -> 适配器 `install()` -> 落盘目标目录（Gemini: `.agent/`；Codex: `.agents/`）->（Codex）注入托管区块到工作区 `AGENTS.md` 与 `antigravity.rules`
- `update`：自动检测已安装目标（或通过 `--target/--targets` 指定）-> 适配器 `update()` ->（Codex）漂移检测与备份 -> 原子替换
- `doctor`：检查完整性；`--fix` 尝试修复（Codex 支持迁移 `.codex/` 与重写托管区块）

### Codex 构建（Workflow -> Skill）
- 输入：`.agents/skills/` 与 `.agents/workflows/`
- 规则：每个 Workflow `<name>.md` 会转换为一个 Skill：`workflow-<name>/SKILL.md`
- 输出（受管目录 `.agents/` 内）：`skills/`、`codex.json`、`AGENTS.md`、`antigravity.rules`、`manifest.json`

## 全局同步：`ag-kit global sync/status`
### 默认目标
- 未指定 `--target/--targets`：默认同步 `codex + gemini`
- 可用 `--target codex` 或 `--targets codex,gemini` 限定目标

### 来源与覆盖策略
- 来源：默认使用本包内置 `.agents/`；也可用 `--branch <name>` 从远端分支拉取模板源
- 覆盖单位：每个 Skill 目录
- 覆盖策略：只覆盖同名 Skill，不清理其他 Skill
- 原子替换：按 Skill 目录原子替换，避免半写状态
- 覆盖前备份：覆盖同名 Skill 前备份到 `$HOME/.ag-kit/backups/global/<timestamp>/<target>/<skill>/...`

### 测试隔离
- `AG_KIT_GLOBAL_ROOT`：替代 `$HOME`（用于测试与 CI，避免污染真实用户目录）

## 状态契约（自动化）
- `ag-kit status --quiet` / `ag-kit global status --quiet` 只输出三态：
  - `installed`：检测到目标且完整性正常
  - `broken`：检测到目标但存在残缺、漂移或结构异常
  - `missing`：未检测到任何已安装目标
- 退出码固定为：
  - `0` = `installed`
  - `1` = `broken`
  - `2` = `missing`
- 若需要问题明细，使用 `ag-kit doctor`；`status` 负责健康状态，`doctor` 负责诊断细节。

## 手动回滚（全局 Skills）
1. 找到备份目录：`$HOME/.ag-kit/backups/global/<timestamp>/...`
2. 按 Skill 回滚（推荐一次只处理一个 Skill 目录）：
   - Codex 目标：恢复到 `$HOME/.agents/skills/<skill>/`
   - Gemini 目标：恢复到 `$HOME/.gemini/antigravity/skills/<skill>/`

macOS / Linux 示例（把某个 Skill 回滚为备份版本）：
```bash
ts="2026-03-12T12-00-00-000Z"
skill="clean-code"
rm -rf "$HOME/.agents/skills/$skill"
cp -a "$HOME/.ag-kit/backups/global/$ts/codex/$skill" "$HOME/.agents/skills/$skill"
```

Windows PowerShell 示例：
```powershell
$ts = "2026-03-12T12-00-00-000Z"
$skill = "clean-code"
Remove-Item "$HOME\\.agents\\skills\\$skill" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "$HOME\\.ag-kit\\backups\\global\\$ts\\codex\\$skill" "$HOME\\.agents\\skills\\$skill" -Recurse -Force
```

## 环境变量
- `AG_KIT_INDEX_PATH`：工作区索引文件路径（默认 `~/.ag-kit/workspaces.json`）
- `AG_KIT_GLOBAL_ROOT`：全局目录根（替代 `$HOME`）
- `AG_KIT_SKIP_UPSTREAM_CHECK`：跳过上游同名包安装提示（测试用）

## 安装提示机制
- npm 全局安装：`postinstall` 会尽力检测并提示上游英文版 `@vudovn/ag-kit` 冲突。
- Bun 全局安装：Bun 默认会阻止本包 `postinstall`；因此冲突提示以内置 CLI 运行期检查为准，会在 `init` / `update` / `update-all` / `global sync` 时提示。
- 冲突提示只负责提醒，不会自动修改当前安装状态；如需清理可执行 `npm uninstall -g @vudovn/ag-kit`。

## 常见故障
- 更新中断：原子替换保证不会出现半写状态；重新运行 `update`/`global sync` 即可。
- Windows `EPERM/EBUSY`：通常是目录被占用；关闭占用 `.agents/` 或目标 Skill 目录的进程后重试。
- 漂移覆盖：Codex 若检测到用户修改受管文件，会在覆盖前写入 `.agents-backup/<timestamp>/`。

## Codex 官方 `.rules`（手动配置）
Ag-Kit 不会自动写入全局 `~/.codex/rules/default.rules`，避免引入不可预期的全局副作用。若你需要启用 Codex 官方命令审批策略（如 `prefix_rule()`），可按需手动创建：

```python
# default.rules
load("builtin://rules/rules.star", "prefix_rule")

rules = [
    prefix_rule(["ls"], action="allow"),
    prefix_rule(["cat"], action="allow"),
    prefix_rule(["rg"], action="allow"),
    prefix_rule(["git", "status"], action="allow"),
]
```
