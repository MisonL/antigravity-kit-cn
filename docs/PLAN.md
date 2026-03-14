# 灵轨规划（PLAN）

## 一句话
灵轨只做一件事：把仓库内统一的 `.agents/` 模板，优雅地投影到不同平台（Gemini/Antigravity 与 Codex），并提供安全、可回滚的更新机制。

## 设计原则
- 命令面少而强：用 `sync` 统一“首次安装 + 更新”，避免双心智。
- 默认安全：不做全局清理、不自动写入高风险全局规则。
- 模板源单一：仓库 Canonical 为 `.agents/`；旧 `.agent/` 只作为输入兼容，不作为主路径。

## 能力边界（项目 vs 全局）
### 项目安装（功能最完整）
- 命令：`ling init` / `ling update` / `ling status` / `ling doctor`
- 目标输出：
  - `gemini` -> 项目内 `.agent/`
  - `antigravity` -> 项目内 `.agent/`（与 Gemini 复用工作区目录，但命令与注册独立）
  - `codex` -> 项目内 `.agents/`（受管目录）+ 注入工作区 `AGENTS.md` / `ling.rules` 托管区块

### 全局安装（跨项目复用 Skills）
- 命令：`ling global sync` / `ling global status`
- 默认行为：`ling global sync` 未指定 `--target/--targets` 时，同步 `codex + gemini + antigravity`
- 目标路径：
  - `codex` -> `$HOME/.codex/skills/`
  - `gemini` -> `$HOME/.gemini/skills/`
  - `antigravity` -> `$HOME/.gemini/antigravity/skills/`
- 安全边界：全局只同步 Skills，不写入全局 Rules/Agents/Workflows。

## 覆盖与回滚（全局同步）
- 覆盖单位：每个 Skill 目录。
- 覆盖策略：只覆盖同名 Skill；不清理用户已有的其他 Skill。
- 覆盖前备份：每次覆盖同名 Skill 前备份到 `$HOME/.ling/backups/global/<timestamp>/...`。

## Spec（核心进阶层）
### 当前阶段已落地
- 默认关闭，必须显式启用
- 全局层（机器级）命令：`ling spec enable` / `ling spec disable` / `ling spec status`
  - 目标资源：
    - Skills：`harness-engineering`、`cybernetic-systems-engineering`
    - Templates：`$HOME/.ling/spec/templates/`
    - References：`$HOME/.ling/spec/references/`
    - Profiles：`$HOME/.ling/spec/profiles/`
  - 回退原则：启用前先备份同名资源；停用时优先恢复原资源
- 项目层（工作区级）命令：`ling spec init` / `ling spec doctor`
  - 默认作用于当前目录；`--spec-workspace` 才会使用 `$HOME/.ling/spec-workspace`
  - 完整模式：写入 `.ling/spec/`、`issues.csv`、`docs/reviews/`、`docs/handoff/`
  - 轻量模式：`--csv-only` 只写入 `issues.csv` 与 `docs/*`，项目内不落地 `.ling/spec/`
  - 可选：通过 `--target/--targets` 同时安装 `.agent/.agents`

## 兼容策略
- Gemini/Antigravity：项目级继续输出 `.agent/`，保持与官方工作区机制一致；命令、状态、索引按独立目标处理。
- Codex：受管目录为 `.agents/`，并使用 `manifest.json` 做完整性与漂移检测；识别并迁移遗留 `.codex/`。
- 全局同步遵循真实消费端目录，而不是仓库模板源目录；仓库内仍以 `.agents/` 作为唯一 Canonical。

## 成功标准
- `ling global sync` 一条命令即可完成全局 Skills 安装/更新（默认 codex + gemini + antigravity）。
- 覆盖可回滚：每次覆盖同名 Skill 都有可用备份。
- 跨平台 CI（Linux/macOS/Windows）验证主链路通过。
