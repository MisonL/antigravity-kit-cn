# 更新日志

本文件记录 Antigravity Kit 的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/2.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

## [3.0.0] - 2026-03-13

### 重大变更

- **仓库模板源统一**：仓库内统一收敛到 `.agents/` 作为唯一 Canonical 模板源；旧 `.agent/` 仅保留输入兼容，不再作为主路径。
- **项目级 Codex 体系稳定化**：Codex 项目安装/更新统一落到 `.agents/`，并继续支持从遗留 `.codex/` 自动迁移。
- **全局安装模型重构**：`ag-kit global sync/status` 成为统一的全局 Skills 安装/更新入口。

### 新增

- **全局 Skills 同步**：
  - `codex` 同步到 `~/.codex/skills/`
  - `gemini` 同时同步到 `~/.gemini/skills/` 与 `~/.gemini/antigravity/skills/`
- **状态契约收紧**：`ag-kit status --quiet` 与 `ag-kit global status --quiet` 统一输出 `installed / broken / missing`，并使用固定退出码 `0 / 1 / 2`。
- **跨平台验证增强**：新增 `ci:verify`、Node 版 `health-check` 与 GitHub Actions 跨平台工作流。

### 修复

- **旧索引兼容**：`update-all` 现在能自动归一化历史索引中的 `targets.full`，不再要求手工清理索引。
- **全局路径对齐真实工具**：修正之前全局路径和真实消费端不一致的问题，确保文档、测试、CI 与实际工具行为一致。


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
