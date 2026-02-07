---
name: documentation-templates
description: Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.
allowed-tools: Read, Glob, Grep
---

# 文档模板 (Documentation Templates)

> 常见文档类型的模板和结构指南。

---

## 1. README 结构 (README Structure)

### 核心部分 (优先级顺序)

| 部分                  | 用途                |
| --------------------- | ------------------- |
| **标题 + 一句话描述** | 这是什么？          |
| **快速开始**          | 在 5 分钟内运行起来 |
| **功能特性**          | 我能做什么？        |
| **配置**              | 如何自定义          |
| **API 参考**          | 链接到详细文档      |
| **贡献**              | 如何提供帮助        |
| **许可证**            | 法律条款            |

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
| -------- | ----------- | ------- |
| PORT     | Server port | 3000    |

## Documentation

- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)

## License

MIT
```

---

## 2. API 文档结构 (API Documentation Structure)

### 单端点模板 (Per-Endpoint Template)

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

## 3. 代码注释指南 (Code Comment Guidelines)

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

### 何时注释

| ✅ 注释           | ❌ 不要注释       |
| ----------------- | ----------------- |
| 为什么 (业务逻辑) | 是什么 (显而易见) |
| 复杂算法          | 每一行            |
| 非显而易见的行为  | 自解释的代码      |
| API 契约          | 实现细节          |

---

## 4. 变更日志模板 (Keep a Changelog)

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

## 5. 架构决策记录 (ADR) (Architecture Decision Record)

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

## 6. AI 友好文档 (2025) (AI-Friendly Documentation)

### llms.txt 模板

针对 AI 爬虫和 Agents (智能体)：

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

### MCP 就绪文档 (MCP-Ready Documentation)

针对 RAG (检索增强生成) 索引：

- 清晰的 H1-H3 层级
- 用于数据结构的 JSON/YAML 示例
- 用于流程的 Mermaid 图表
- 自包含的章节

---

## 7. 结构原则 (Structure Principles)

| 原则         | 原因                     |
| ------------ | ------------------------ |
| **可扫描**   | 标题、列表、表格         |
| **示例优先** | 展示出来，而不仅仅是讲述 |
| **循序渐进** | 简单 → 复杂              |
| **保持更新** | 过时 = 误导              |

---

> **记住：** 模板只是起点。根据你的项目需求进行调整。
