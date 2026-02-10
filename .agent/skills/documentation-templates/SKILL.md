---
name: documentation-templates
description: 文档模板与结构指南（Documentation templates）。README、API 文档、代码注释与 AI 友好型文档。
allowed-tools: Read, Glob, Grep
---

# 文档模板

> 常见文档类型的模板与结构指南。

---

## 1. README 结构

### 核心章节（优先级顺序）

| 章节 | 用途 |
|---------|---------|
| **标题 + 单句描述** | 这是什么项目？ |
| **快速开始** | 5 分钟内能跑起来 |
| **功能特性** | 能做什么 |
| **配置指南** | 如何自定义 |
| **API 参考** | 指向详细文档 |
| **贡献指南** | 如何参与 |
| **开源协议** | 法律条款 |

### README 模板

```markdown
# Project Name

Brief one-line description.

## Quick Start

[Minimum steps to run]

## Features

- Feature 1
- Feature 2

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## Documentation

- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)

## License

MIT
```

---

## 2. API 文档结构

### 接口模板

```markdown
## GET /users/:id

Get a user by ID.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID |

**Response:**
- 200: User object
- 404: User not found

**Example:**
[Request and response example]
```

---

## 3. 代码注释指南

### JSDoc/TSDoc 模板

```typescript
/**
 * Brief description of what the function does.
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws ErrorType - When this error occurs
 * 
 * @example
 * const result = functionName(input);
 */
```

### 何时编写注释

| ✅ 应当注释 | ❌ 不应注释 |
|-----------|-----------------|
| 解释“为什么”（业务逻辑） | 解释“是什么”（显而易见的逻辑） |
| 复杂算法 | 每一行 |
| 非直观行为 | 自解释代码 |
| API 契约 | 实现细节 |

---

## 4. 变更日志模板（Keep a Changelog）

```markdown
# Changelog

## [Unreleased]
### Added
- New feature

## [1.0.0] - 2025-01-01
### Added
- Initial release
### Changed
- Updated dependency
### Fixed
- Bug fix
```

---

## 5. 架构决策记录（ADR）

```markdown
# ADR-001: [Title]

## Status
Accepted / Deprecated / Superseded

## Context
Why are we making this decision?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

---

## 6. AI 友好型文档（2025）

### llms.txt 模板

面向 AI 爬虫与代理（agents）：

```markdown
# Project Name
> One-line objective.

## Core Files
- [src/index.ts]: Main entry
- [src/api/]: API routes
- [docs/]: Documentation

## Key Concepts
- Concept 1: Brief explanation
- Concept 2: Brief explanation
```

### 适配 MCP 的文档规范

用于 RAG（检索增强生成）索引：
- 清晰的 H1-H3 标题层级
- 数据结构的 JSON/YAML 示例
- 用 Mermaid 图表描述流程
- 章节内容自包含

---

## 7. 结构原则

| 原则 | 目的 |
|-----------|-----|
| **可扫描** | 使用标题、列表、表格 |
| **示例优先** | 先展示，再解释 |
| **渐进展开** | 简单 → 复杂 |
| **保持更新** | 过期即误导 |

---

> **提醒：** 模板只是起点，请根据项目需求调整。
