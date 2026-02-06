---
name: documentation-templates
description: 文档模板和结构指南。README、API 文档、代码注释和 AI 友好文档。
allowed-tools: Read, Glob, Grep
---

# Documentation Templates - 文档模板

> 常见文档类型的模板和结构指南。

---

## 1. README 结构

### 核心章节 (优先级顺序)

| 章节                  | 目的                |
| --------------------- | ------------------- |
| **Title + One-liner** | 这是什么？          |
| **Quick Start**       | 在 5 分钟内运行起来 |
| **Features**          | 我能做什么？        |
| **Configuration**     | 如何自定义          |
| **API Reference**     | 详细文档的链接      |
| **Contributing**      | 如何协助            |
| **License**           | 法律信息            |

### README 模板

```markdown
# Project Name

简短的一句话描述。

## 快速开始

[运行的最少步骤]

## 功能特点

- 功能 1
- 功能 2

## 配置

| 变量 | 描述       | 默认值 |
| ---- | ---------- | ------ |
| PORT | 服务器端口 | 3000   |

## 文档

- [API 参考](./docs/api.md)
- [架构](./docs/architecture.md)

## 许可证

MIT
```

---

## 2. API 文档结构

### 单端点模板 (Per-Endpoint Template)

```markdown
## GET /users/:id

根据 ID 获取用户。

**参数:**
| 名称 | 类型 | 必填 | 描述 |
|------|------|----------|-------------|
| id | string | 是 | 用户 ID |

**响应:**

- 200: 用户对象
- 404: 用户未找到

**示例:**
[请求和响应示例]
```

---

## 3. 代码注释指南 (Code Comment Guidelines)

### JSDoc/TSDoc 模板

```typescript
/**
 * 函数功能的简要描述。
 *
 * @param paramName - 参数描述
 * @returns 返回值描述
 * @throws ErrorType - 何时发生此错误
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
| 非直观的行为      | 自解释的代码      |
| API 契约          | 实现细节          |

---

## 4. 变更日志模板 (Changelog Template)

遵循 Keep a Changelog 规范。

```markdown
# Changelog

## [Unreleased]

### Added

- 新功能

## [1.0.0] - 2025-01-01

### Added

- 初始发布

### Changed

- 更新依赖

### Fixed

- Bug 修复
```

---

## 5. 架构决策记录 (ADR) 模板

```markdown
# ADR-001: [标题]

## 状态 (Status)

Accepted (已接受) / Deprecated (已废弃) / Superseded (已替代)

## 上下文 (Context)

我们为什么要做出这个决定？

## 决策 (Decision)

我们决定了什么？

## 后果 (Consequences)

有哪些权衡？
```

---

## 6. AI 友好文档 (2025)

### llms.txt 模板

供 AI 爬虫和 Agent 使用：

```markdown
# Project Name

> 一句话目标。

## Core Files

- [src/index.ts]: 主入口
- [src/api/]: API 路由
- [docs/]: 文档

## Key Concepts

- 概念 1: 简要解释
- 概念 2: 简要解释
```

### MCP-Ready 文档

用于 RAG 索引：

- 清晰的 H1-H3 层级
- 数据结构的 JSON/YAML 示例
- 流程的 Mermaid 图表
- 自包含的章节

---

## 7. 结构原则 (Structure Principles)

| 原则                                | 原因                 |
| ----------------------------------- | -------------------- |
| **可扫描 (Scannable)**              | 标题、列表、表格     |
| **示例优先 (Examples first)**       | 展示它，而不仅仅是说 |
| **渐进式细节 (Progressive detail)** | 简单 → 复杂          |
| **保持更新 (Up to date)**           | 过时 = 误导          |

---

> **记住：** 模板只是起点。根据你的项目需求进行调整。
