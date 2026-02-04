# 更新日志 (Changelog)

所有针对 Antigravity Kit 的重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/2.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

## [2.0.1] - 2026-01-26

### 新增 (Added)

- **Agent Flow 文档**: 新的全面工作流文档
    - 添加 `.agent/AGENT_FLOW.md` - 完整的 Agent 流程架构指南
    - 记录 Agent 路由检查清单 (代码/设计工作前的强制步骤)
    - 记录苏格拉底之门协议 (用于需求澄清)
    - 添加跨技能引用模式文档
- **新技能**:
    - `react-best-practices` - 整合 Next.js 和 React 专业知识
    - `web-design-guidelines` - 专业 Web 设计标准和模式

### 变更 (Changed)

- **技能整合**: 将 `nextjs-best-practices` 和 `react-patterns` 合并为统一的 `react-best-practices` 技能
- **架构更新**:
    - 增强 `.agent/ARCHITECTURE.md` 图表
    - 更新 `.agent/rules/GEMINI.md` 包含 Agent 路由检查清单
- **Agent 更新**:
    - 更新 `frontend-specialist.md` 包含新技能引用
    - 更新 `qa-automation-engineer.md` 包含增强的测试工作流
- **前端设计技能**: 增强 `frontend-design/SKILL.md`，增加对 `web-design-guidelines` 的交叉引用

### 移除 (Removed)

- 废弃 `nextjs-best-practices` 技能 (合并入 `react-best-practices`)
- 废弃 `react-patterns` 技能 (合并入 `react-best-practices`)

### 修复 (Fixed)

- **Agent Flow 准确性**: 修正 AGENT_FLOW.md 中误导性的术语
    - 将 "Parallel Execution" 改为 "Sequential Multi-Domain Execution" (顺序多领域执行)
    - 将 "Integration Layer" 改为 "Code Coherence" (代码一致性) 并附带准确描述
    - 添加关于 AI 顺序处理与模拟多 Agent 行为的现实说明
    - 澄清脚本需要用户批准 (不会自动执行)

## [2.0.0] - Unreleased

### 初始发布 (Initial Release)

- Antigravity Kit 初始发布
- 20 个专业 AI 智能体 (Agents)
- 37 个特定领域技能 (Skills)
- 11 个工作流斜杠命令 (Workflows)
- 用于轻松安装和更新的 CLI 工具
- 全面的文档和架构指南

[Unreleased]: https://github.com/vudovn/antigravity-kit/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/vudovn/antigravity-kit/releases/tag/v2.0.0
