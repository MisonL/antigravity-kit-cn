# Ag-Kit 规划（PLAN）

## 一句话
Ag-Kit 只做一件事：把仓库内统一的 `.agents/` 模板，优雅地投影到不同平台（Gemini/Antigravity 与 Codex），并提供安全、可回滚的更新机制。

## 设计原则
- 命令面少而强：用 `sync` 统一“首次安装 + 更新”，避免双心智。
- 默认安全：不做全局清理、不自动写入高风险全局规则。
- 模板源单一：仓库 Canonical 为 `.agents/`；旧 `.agent/` 只作为输入兼容，不作为主路径。

## 能力边界（项目 vs 全局）
### 项目安装（功能最完整）
- 命令：`ag-kit init` / `ag-kit update` / `ag-kit status` / `ag-kit doctor`
- 目标输出：
  - `gemini` -> 项目内 `.agent/`（兼容 Gemini/Antigravity 工作区规范）
  - `codex` -> 项目内 `.agents/`（受管目录）+ 注入工作区 `AGENTS.md` / `antigravity.rules` 托管区块

### 全局安装（跨项目复用 Skills）
- 命令：`ag-kit global sync` / `ag-kit global status`
- 默认行为：`ag-kit global sync` 未指定 `--target/--targets` 时，同步 `codex + gemini`
- 目标路径：
  - `codex` -> `$HOME/.codex/skills/`
  - `gemini` -> 同时写入 `$HOME/.gemini/skills/` 与 `$HOME/.gemini/antigravity/skills/`
- 安全边界：全局只同步 Skills，不写入全局 Rules/Agents/Workflows。

## 覆盖与回滚（全局同步）
- 覆盖单位：每个 Skill 目录。
- 覆盖策略：只覆盖同名 Skill；不清理用户已有的其他 Skill。
- 覆盖前备份：每次覆盖同名 Skill 前备份到 `$HOME/.ag-kit/backups/global/<timestamp>/...`。

## 兼容策略
- Gemini/Antigravity：输出 `.agent/`，保持与官方工作区机制一致。
- Codex：受管目录为 `.agents/`，并使用 `manifest.json` 做完整性与漂移检测；识别并迁移遗留 `.codex/`。
- 全局同步遵循真实消费端目录，而不是仓库模板源目录；仓库内仍以 `.agents/` 作为唯一 Canonical。

## 成功标准
- `ag-kit global sync` 一条命令即可完成全局 Skills 安装/更新（默认 codex + gemini，其中 gemini 同步到 gemini-cli 与 antigravity）。
- 覆盖可回滚：每次覆盖同名 Skill 都有可用备份。
- 跨平台 CI（Linux/macOS/Windows）验证主链路通过。
