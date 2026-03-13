# 灵轨技术说明（TECH）

## 快速验证（维护者）
```bash
npm install
npm test
npm run ci:verify
npm run health-check
cd web && npm install && npm run lint
```

## 核心目录与职责
- `.agents/`：仓库模板源（Canonical）
- `bin/ling.js`：CLI 入口与命令分发
- `bin/adapters/`：目标差异（`gemini` / `codex`）
- `bin/core/`：构建/转换（将 Workflows 投影为 Codex Skills 等）
- `bin/utils/`：原子写入、manifest、托管区块等通用能力

## 路径映射（最重要）
### 项目级（功能最完整）
- `gemini`：项目根目录 `.agent/`
- `codex`：项目根目录 `.agents/`（受管）+ `.agents-backup/`（漂移覆盖备份）
- 项目级预备份（覆盖前快照）：
  - Gemini：`<project>/.agent-backup/<timestamp>/preflight/.agent/`
  - Codex：`<project>/.agents-backup/<timestamp>/preflight/.agents/` 或 `<project>/.agents-backup/<timestamp>/preflight/.codex/`

### 全局级（仅同步 Skills）
- `codex`：`$HOME/.codex/skills/`
- `gemini-cli`：`$HOME/.gemini/skills/`
- `antigravity`：`$HOME/.gemini/antigravity/skills/`

> 说明：仓库内 Skills 源路径为 `.agents/skills/`，全局同步会将其投影到真实工具读取的全局目录；仓库 Canonical 仍是 `.agents/`。

## 端到端链路（简述）
### 项目安装 / 更新
- `init`：选择目标 -> 适配器 `install()` -> 落盘目标目录（Gemini: `.agent/`；Codex: `.agents/`）->（Codex）注入托管区块到工作区 `AGENTS.md` 与 `ling.rules`
- `update`：自动检测已安装目标（或通过 `--target/--targets` 指定）->（冲突时交互确认或默认预备份）-> 适配器 `update()` ->（Codex）漂移检测与备份 -> 原子替换
- `doctor`：检查完整性；`--fix` 尝试修复（Codex 支持迁移 `.codex/` 与重写托管区块）

### 已有资产冲突处理（项目级）
- 触发条件：
  - `gemini`：`.agent/` 已存在且与内置模板不一致
  - `codex`：`.agents/` 或 `.codex/` 已存在且存在漂移、缺失 `manifest.json` 或包含未知文件
- 交互终端会逐项询问处理方式：保留 / 备份后移除 / 直接移除，并支持按资产类别复用选择
- 非交互环境不会进入询问：需要覆盖时默认执行“备份后覆盖”；`init` 若检测到已有资产且未显式 `--force` 则报错

### Codex 构建（Workflow -> Skill）
- 输入：`.agents/skills/` 与 `.agents/workflows/`
- 规则：每个 Workflow `<name>.md` 会转换为一个 Skill：`workflow-<name>/SKILL.md`
- 输出（受管目录 `.agents/` 内）：`skills/`、`codex.json`、`AGENTS.md`、`ling.rules`、`manifest.json`

## 全局同步：`ling global sync/status`
### 默认目标
- 未指定 `--target/--targets`：默认同步 `codex + gemini`
- `--target gemini` / `--targets codex,gemini` 中的 `gemini` 会同时写入 gemini-cli 与 antigravity 两个消费端目录

### 来源与覆盖策略
- 来源：默认使用本包内置 `.agents/`；也可用 `--branch <name>` 从远端分支拉取模板源
- 覆盖单位：每个 Skill 目录
- 覆盖策略：只覆盖同名 Skill，不清理其他 Skill
- 原子替换：按 Skill 目录原子替换，避免半写状态
- 覆盖前备份：覆盖同名 Skill 前备份到 `$HOME/.ling/backups/global/<timestamp>/<consumer>/<skill>/...`
  - `consumer` 可能是 `codex`、`gemini-cli`、`antigravity`

### 测试隔离
- `LING_GLOBAL_ROOT`：替代 `$HOME`（用于测试与 CI，避免污染真实用户目录）

## Spec Profile：`ling spec enable/disable/status`
### 当前范围
- 当前只实现全局层：
  - `ling spec enable [--target codex|gemini] [--dry-run] [--quiet]`
  - `ling spec disable [--target codex|gemini] [--dry-run] [--quiet]`
  - `ling spec status [--quiet]`
- 默认目标：未指定 `--target/--targets` 时启用 `codex + gemini`
- 当前 Spec 源目录：`.spec/`

### 落盘与状态
- Spec 状态文件：`$HOME/.ling/spec/state.json`
- Spec templates：`$HOME/.ling/spec/templates/`
- Spec references：`$HOME/.ling/spec/references/`
- Spec 备份目录：`$HOME/.ling/backups/spec/<timestamp>/before/...`

### 当前安装内容
- 全局 Skills：
  - `harness-engineering`
  - `cybernetic-systems-engineering`
- Templates：
  - `issues.template.csv`
  - `driver-prompt.md`
  - `review-report.md`
  - `phase-acceptance.md`
  - `handoff.md`
- References：
  - `harness-engineering-digest.md`
  - `gda-framework.md`
  - 相关 quickstart / README

### 状态契约
- `ling spec status --quiet` 输出：
  - `installed`
  - `broken`
  - `missing`
- 退出码沿用统一约定：
  - `0` = `installed`
  - `1` = `broken`
  - `2` = `missing`

### 回退语义
- `spec enable`：
  - 若目标位置已存在同名 Skill，会先备份再覆盖
  - 若 `templates/` 或 `references/` 已存在，也会先备份
- `spec disable`：
  - 若存在备份，恢复启用前快照
  - 若启用前不存在资源，则删除由 Spec 安装的目录
- 当前尚未实现项目级 `spec init / remove / doctor`

## 状态契约（自动化）
- `ling status --quiet` / `ling global status --quiet` 只输出三态：
  - `installed`：检测到目标且完整性正常
  - `broken`：检测到目标但存在残缺、漂移或结构异常
  - `missing`：未检测到任何已安装目标
- 退出码固定为：
  - `0` = `installed`
  - `1` = `broken`
  - `2` = `missing`
- 若需要问题明细，使用 `ling doctor`；`status` 负责健康状态，`doctor` 负责诊断细节。

## 手动回滚（全局 Skills）
1. 找到备份目录：`$HOME/.ling/backups/global/<timestamp>/...`
2. 按 Skill 回滚（推荐一次只处理一个 Skill 目录）：
   - Codex 目标：恢复到 `$HOME/.codex/skills/<skill>/`
   - Gemini CLI：恢复到 `$HOME/.gemini/skills/<skill>/`
   - Antigravity：恢复到 `$HOME/.gemini/antigravity/skills/<skill>/`

macOS / Linux 示例（把某个 Skill 回滚为备份版本）：
```bash
ts="2026-03-12T12-00-00-000Z"
skill="clean-code"
rm -rf "$HOME/.codex/skills/$skill"
cp -a "$HOME/.ling/backups/global/$ts/codex/$skill" "$HOME/.codex/skills/$skill"
```

Windows PowerShell 示例：
```powershell
$ts = "2026-03-12T12-00-00-000Z"
$skill = "clean-code"
Remove-Item "$HOME\\.codex\\skills\\$skill" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "$HOME\\.ling\\backups\\global\\$ts\\codex\\$skill" "$HOME\\.codex\\skills\\$skill" -Recurse -Force
```

Gemini CLI 回滚示例：
```bash
ts="2026-03-12T12-00-00-000Z"
skill="clean-code"
rm -rf "$HOME/.gemini/skills/$skill"
cp -a "$HOME/.ling/backups/global/$ts/gemini-cli/$skill" "$HOME/.gemini/skills/$skill"
```

Antigravity 回滚示例：
```bash
ts="2026-03-12T12-00-00-000Z"
skill="clean-code"
rm -rf "$HOME/.gemini/antigravity/skills/$skill"
cp -a "$HOME/.ling/backups/global/$ts/antigravity/$skill" "$HOME/.gemini/antigravity/skills/$skill"
```

## 环境变量
- `LING_INDEX_PATH`：工作区索引文件路径（默认 `~/.ling/workspaces.json`）
- `LING_GLOBAL_ROOT`：全局目录根（替代 `$HOME`）
- `LING_SKIP_UPSTREAM_CHECK`：跳过上游同名包安装提示（测试用）

## 安装提示机制
- npm 全局安装：`postinstall` 会尽力检测并提示上游英文版 `@vudovn/ag-kit` 冲突。
- 冲突提示只负责提醒，不会自动修改当前安装状态；如需清理可执行 `npm uninstall -g @vudovn/ag-kit`。

## 常见故障
- 更新中断：原子替换保证不会出现半写状态；重新运行 `update`/`global sync` 即可。
- Windows `EPERM/EBUSY`：通常是目录被占用；关闭占用 `.agents/` 或目标 Skill 目录的进程后重试。
- 漂移覆盖：Codex 若检测到用户修改受管文件，会在覆盖前写入 `.agents-backup/<timestamp>/`。

## 跨平台与文本编码约束
- 编码与换行：仓库内分发的文本与模板资源使用 UTF-8 与 LF（避免 CRLF 引发的解析与 diff 噪声）。
- 终端可读性：模板文本与脚本输出避免使用 Emoji 或装饰性 Unicode 字符，统一采用纯 ASCII 标记（例如 `[OK]`、`[FAIL]`），以提升 Windows/WSL/Linux/macOS 终端与编辑器的显示一致性。
- Web 文档站快捷键提示：搜索弹窗在 macOS 显示 `Cmd + K`，在其他平台显示 `Ctrl + K`。
- 安全基线检查：安全扫描脚本会检查 Web 站点的基础安全响应头配置；当前实现位于 `web/next.config.ts`。

## Codex 官方 `.rules`（手动配置）
灵轨不会自动写入全局 `~/.codex/rules/default.rules`，避免引入不可预期的全局副作用。若你需要启用 Codex 官方命令审批策略（如 `prefix_rule()`），可按需手动创建：

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
