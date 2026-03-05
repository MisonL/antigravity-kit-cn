# 更新日志

本文件记录 Antigravity Kit 的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/2.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

### 新增

- 增加 `--accept-legacy-agent`：允许将仅存在 legacy `.agent` 的旧项目迁移到 v3 `.agents` 体系（`update/update-all/doctor --fix` 均可用，会创建 rollback 快照）。
- 增加 `ag-kit sync`：一键同步（未安装则 init，已安装则 update；必要时自愈）。
- 增加用户级默认配置：支持 `~/.ag-kit/config.json`（或 `AG_KIT_CONFIG_PATH`）设置常用默认参数，CLI 显式参数优先。

### 变更

- `--no-index` 模式下不再触发自动迁移（避免产生全局索引/迁移状态副作用）。
- `verify` 以托管证据判断 `.agent` 投影是否启用，并对非托管 `.agent` 给出告警。
- 简化更新备份策略：统一依赖 rollback 快照，不再生成额外的覆盖冲突备份目录。
- 备份路径收敛：单次操作产生的 rollback 快照与冲突备份统一落在同一 `<timestamp>` 目录。
- `doctor --fix` 执行修复前会创建 rollback 快照（仅在需要修复时写入）。
- `health-check` 默认切换为 Node 脚本实现（跨平台），并在检查链路中隔离 `AG_KIT_BACKUP_ROOT` 到临时目录。
- CLI 帮助输出分层：默认展示最常用路径，`ag-kit help <command> --advanced` 才显示高级参数与说明。

## [3.0.0-beta.0] - 2026-03-04

### 新增

- 统一 full 目录体系：`ag-kit init/update` 默认安装 `.agents`（Canonical），并自动生成 `.agent` / `.gemini` 兼容投影。
- Context7 MCP 双通道：默认同步 `context7`（官方）与 `context7_backup`（备用）配置。
- 冲突交互：检测到已有 `.agent` 或 `.gemini/agents` 时，支持交互式处理策略选择。

### 变更

- `--target gemini|codex` 保持兼容，但内部归一为 full 安装流程。
- `doctor/status/update-all` 统一按 full 模式工作，索引目标收敛为 `full`。
- `.codex` 迁移策略更新：仅清理可识别为本工具托管的 legacy 目录；非托管目录保留。

### 修复

- 修复升级场景对非托管 `.codex` 目录的误删除风险。
- 修复 `.gemini/settings.json` 合并行为，保留用户非托管字段。


## [2.0.2] - 2026-02-04

- **新技能**:
    - `rust-pro` - 掌握 Rust 1.75+
- **Agent 工作流**:
    - 更新 `orchestrate.md`，修复土耳其语输出问题


## [2.0.1] - 2026-01-26

### 新增

- **Agent Flow 文档**: 新的完整工作流文档
    - 添加 `.agent/AGENT_FLOW.md` - 完整的智能体流程架构指南
    - 记录 Agent Routing Checklist（智能体路由检查清单，代码/设计前的强制步骤）
    - 记录 Socratic Gate Protocol（苏格拉底门禁协议，用于需求澄清）
    - 添加 Cross-Skill References（跨技能引用）模式文档
- **新技能**:
    - `react-best-practices` - 整合 Next.js 与 React 专业知识
    - `web-design-guidelines` - 专业 Web 设计标准与模式

### 变更

- **技能整合**: 将 `nextjs-best-practices` 与 `react-patterns` 合并为统一的 `react-best-practices` 技能
- **架构更新**:
    - 增强 `.agent/ARCHITECTURE.md` 的流程图
    - 更新 `.agent/rules/GEMINI.md`，加入 Agent Routing Checklist（智能体路由检查清单）
- **Agent 更新**:
    - 更新 `frontend-specialist.md`，加入新技能引用
    - 更新 `qa-automation-engineer.md`，加入增强的测试工作流
- **前端设计技能**: 增强 `frontend-design/SKILL.md`，增加对 `web-design-guidelines` 的交叉引用

### 移除

- 废弃 `nextjs-best-practices` 技能（并入 `react-best-practices`）
- 废弃 `react-patterns` 技能（并入 `react-best-practices`）

### 修复

- **Agent Flow 准确性**: 修正 AGENT_FLOW.md 中误导性术语
    - 将 "Parallel Execution" 改为 "Sequential Multi-Domain Execution"
    - 将 "Integration Layer" 改为 "Code Coherence" 并补充准确说明
    - 添加 AI 顺序处理与模拟多智能体行为的现实说明
    - 澄清脚本需要用户批准（不会自动执行）

## [2.0.0] - Unreleased

### 初始发布

- Antigravity Kit 初始发布
- 20 个专业 AI 智能体
- 37 个特定领域技能
- 11 个工作流斜杠命令
- 用于便捷安装与更新的 CLI（命令行界面）工具
- 全面的文档与架构指南

[Unreleased]: https://github.com/vudovn/antigravity-kit/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/vudovn/antigravity-kit/releases/tag/v2.0.0
