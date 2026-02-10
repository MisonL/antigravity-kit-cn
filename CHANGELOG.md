# 更新日志

本文件记录 Antigravity Kit 的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/2.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

## [2.0.2] - 2026-02-04

- **新技能**:
    - `rust-pro` - 掌握 Rust 1.75+
- **Agent 工作流**:
    - 更新 `orchestrate.md`，修复土耳其语输出问题

## [2.0.1] - 2026-01-26

### 新增

- **Agent Flow（智能体流程）文档**: 新的完整工作流文档
    - 添加 `.agent/AGENT_FLOW.md` - 完整的智能体流程架构指南
    - 记录 Agent Routing Checklist（智能体路由检查清单，代码/设计前的强制步骤）
    - 记录 Socratic Gate Protocol（苏格拉底门禁协议，用于需求澄清）
    - 添加跨 Skill（技能）引用模式文档
- **新技能**:
    - `react-best-practices` - 整合 Next.js 与 React 专业知识
    - `web-design-guidelines` - 专业 Web 设计标准与模式

### 变更

- **技能整合**: 将 `nextjs-best-practices` 与 `react-patterns` 合并为统一的 `react-best-practices` Skill（技能）
- **架构更新**:
    - 增强 `.agent/ARCHITECTURE.md` 的流程图
    - 更新 `.agent/rules/GEMINI.md`，加入 Agent Routing Checklist（智能体路由检查清单）
- **Agent 更新**:
    - 更新 `frontend-specialist.md`，加入新技能引用
    - 更新 `qa-automation-engineer.md`，加入增强的测试工作流
- **前端设计技能**: 增强 `frontend-design/SKILL.md`，增加对 `web-design-guidelines` 的交叉引用

### 移除

- 废弃 `nextjs-best-practices` Skill（并入 `react-best-practices`）
- 废弃 `react-patterns` Skill（并入 `react-best-practices`）

### 修复

- **Agent Flow（智能体流程）准确性**: 修正 AGENT_FLOW.md 中误导性术语
    - 将 "Parallel Execution" 改为 "Sequential Multi-Domain Execution"（顺序多领域执行）
    - 将 "Integration Layer" 改为 "Code Coherence"（代码一致性）并补充准确说明
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
