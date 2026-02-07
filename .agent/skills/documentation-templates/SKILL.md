---
name: documentation-templates
description: Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.
allowed-tools: Read, Glob, Grep
---

# 文档模板

> 常见文档类型的模板和结构指南。

---

## 1. README 结构

### 基本部分 (优先级顺序)

| 部分                         | 用途             |
| ---------------------------- | ---------------- |
| **标题 + 一句话描述**        | 这是什么？       |
| **快速开始 (Quick Start)**   | 在 <5 分钟内运行 |
| **功能 (Features)**          | 我能做什么？     |
| **配置 (Configuration)**     | 如何自定义       |
| **API 参考 (API Reference)** | 链接到详细文档   |
| **贡献 (Contributing)**      | 如何提供帮助     |
| **许可证 (License)**         | 法律信息         |

### README 模板

```markdown
# 项目名称

简短的一句话描述。

## 快速开始

[运行的最少步骤]

## 功能

- Feature 1
- Feature 2

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

### 单端点模板

```markdown
## GET /users/:id

通过 ID 获取用户。

**参数:**
| 名称 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 用户 ID |

**响应:**

- 200: 用户对象 (User object)
- 404: 用户未找到

**示例:**
[请求和响应示例]
```

---

## 3. 代码注释指南

### JSDoc/TSDoc 模板

```typescript
/**
 * 函数功能的简短描述.
 *
 * @param paramName - 参数描述
 * @returns 返回值描述
 * @throws ErrorType - 当此错误发生时
 *
 * @example
 * const result = functionName(input);
 */
```

### 何时注释

| ✅ 注释           | ❌ 不注释           |
| ----------------- | ------------------- |
| 为什么 - 业务逻辑 | 是什么 - 显而易见的 |
| 复杂算法          | 每一行              |
| 非显而易见的行为  | 自解释的代码        |
| API 契约          | 实现细节            |

---

## 4. 更新日志模板 (保持更新日志)

```markdown
# 更新日志 (Changelog)

## [Unreleased] (未发布)

### 新增 (Added)

- 新功能

## [1.0.0] - 2025-01-01

### 新增 (Added)

- 初始发布

### 变更 (Changed)

- 更新依赖

### 修复 (Fixed)

- Bug 修复
```

---

## 5. 架构决策记录 (ADR)

```markdown
# ADR-001: [标题]

## 状态 (Status)

Accepted (已接受) / Deprecated (已废弃) / Superseded (已替代)

## 背景 (Context)

我们为什么要做这个决定？

## 决定 (Decision)

我们决定了什么？

## 后果 (Consequences)

权衡是什么？
```

---

## 6. AI 友好型文档 (2025)

### llms.txt 模板

用于 AI 爬虫和智能体:

```markdown
# 项目名称

> 一句话目标。

## 核心文件

- [src/index.ts]: 主入口
- [src/api/]: API 路由
- [docs/]: 文档

## 关键概念

- Concept 1: 简要解释
- Concept 2: 简要解释
```

### MCP 就绪文档

用于 RAG 索引：

- 清晰的 H1-H3 层级
- 数据结构的 JSON/YAML 示例
- 流程的 Mermaid 图表
- 自包含的章节

---

## 7. 结构原则

| 原则                   | 为什么               |
| ---------------------- | -------------------- |
| **可扫描 (Scannable)** | 标题, 列表, 表格     |
| **示例优先**           | 展示，而不仅仅是讲述 |
| **渐进式细节**         | 简单 → 复杂          |
| **最新**               | 过时 = 误导          |

> **记住：** 模板是起点。根据你的项目需求进行调整。
