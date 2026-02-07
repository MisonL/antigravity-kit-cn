---
name: documentation-templates
description: Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.
allowed-tools: Read, Glob, Grep
---

# 文档模板 (Documentation Templates)

> 常见文档类型的模板和结构指南。

---

## 1. README 结构 (README Structure)

### 基本部分 (优先级顺序) - Essential Sections (Priority Order)

| 部分                                      | 用途             |
| ----------------------------------------- | ---------------- |
| **Title + One-liner (标题 + 一句话描述)** | 这是什么？       |
| **Quick Start (快速开始)**                | 在 <5 分钟内运行 |
| **Features (功能)**                       | 我能做什么？     |
| **Configuration (配置)**                  | 如何自定义       |
| **API Reference (API 参考)**              | 链接到详细文档   |
| **Contributing (贡献)**                   | 如何提供帮助     |
| **License (许可证)**                      | 法律信息         |

### README 模板

```markdown
# Project Name (项目名称)

Brief one-line description (简短的一句话描述).

## Quick Start (快速开始)

[Minimum steps to run (运行的最少步骤)]

## Features (功能)

- Feature 1
- Feature 2

## Configuration (配置)

| Variable (变量) | Description (描述)       | Default (默认值) |
| --------------- | ------------------------ | ---------------- |
| PORT            | Server port (服务器端口) | 3000             |

## Documentation (文档)

- [API Reference (API 参考)](./docs/api.md)
- [Architecture (架构)](./docs/architecture.md)

## License (许可证)

MIT
```

---

## 2. API 文档结构 (API Documentation Structure)

### 单端点模板 (Per-Endpoint Template)

```markdown
## GET /users/:id

Get a user by ID (通过 ID 获取用户).

**Parameters (参数):**
| Name (名称) | Type (类型) | Required (必填) | Description (描述) |
|------|------|----------|-------------|
| id | string | Yes | User ID |

**Response (响应):**

- 200: User object (用户对象)
- 404: User not found (用户未找到)

**Example (示例):**
[Request and response example (请求和响应示例)]
```

---

## 3. 代码注释指南 (Code Comment Guidelines)

### JSDoc/TSDoc 模板

```typescript
/**
 * Brief description of what the function does (函数功能的简短描述).
 *
 * @param paramName - Description of parameter (参数描述)
 * @returns Description of return value (返回值描述)
 * @throws ErrorType - When this error occurs (当此错误发生时)
 *
 * @example
 * const result = functionName(input);
 */
```

### 何时注释 (When to Comment)

| ✅ Comment (注释)                        | ❌ Don't Comment (不注释)            |
| ---------------------------------------- | ------------------------------------ |
| Why (business logic) (为什么 - 业务逻辑) | What (obvious) (是什么 - 显而易见的) |
| Complex algorithms (复杂算法)            | Every line (每一行)                  |
| Non-obvious behavior (非显而易见的行为)  | Self-explanatory code (自解释的代码) |
| API contracts (API 契约)                 | Implementation details (实现细节)    |

---

## 4. 更新日志模板 (保持更新日志) - Changelog Template (Keep a Changelog)

```markdown
# Changelog (更新日志)

## [Unreleased] (未发布)

### Added (新增)

- New feature (新功能)

## [1.0.0] - 2025-01-01

### Added (新增)

- Initial release (初始发布)

### Changed (变更)

- Updated dependency (更新依赖)

### Fixed (修复)

- Bug fix (Bug 修复)
```

---

## 5. 架构决策记录 (ADR) - Architecture Decision Record (ADR)

```markdown
# ADR-001: [Title]

## Status (状态)

Accepted (已接受) / Deprecated (已废弃) / Superseded (已替代)

## Context (背景)

Why are we making this decision? (我们为什么要做这个决定？)

## Decision (决定)

What did we decide? (我们决定了什么？)

## Consequences (后果)

What are the trade-offs? (权衡是什么？)
```

---

## 6. AI 友好型文档 (2025) - AI-Friendly Documentation (2025)

### llms.txt 模板 (llms.txt Template)

For AI crawlers and agents (用于 AI 爬虫和智能体):

```markdown
# Project Name (项目名称)

> One-line objective (一句话目标).

## Core Files (核心文件)

- [src/index.ts]: Main entry (主入口)
- [src/api/]: API routes (API 路由)
- [docs/]: Documentation "文档"

## Key Concepts (关键概念)

- Concept 1: Brief explanation (简要解释)
- Concept 2: Brief explanation (简要解释)
```

### MCP 就绪文档 (MCP-Ready Documentation)

用于 RAG 索引：

- 清晰的 H1-H3 层级 (Clear H1-H3 hierarchy)
- 数据结构的 JSON/YAML 示例 (JSON/YAML examples for data structures)
- 流程的 Mermaid 图表 (Mermaid diagrams for flows)
- 自包含的章节 (Self-contained sections)

---

## 7. 结构原则 (Structure Principles)

| 原则                                | 为什么                                      |
| ----------------------------------- | ------------------------------------------- |
| **Scannable (可扫描)**              | Headers (标题), lists (列表), tables (表格) |
| **Examples first (示例优先)**       | 展示，而不仅仅是讲述                        |
| **Progressive detail (渐进式细节)** | 简单 → 复杂                                 |
| **Up to date (最新)**               | 过时 = 误导                                 |

---

> **记住：** 模板是起点。根据你的项目需求进行调整。
