---
name: mcp-builder
description: MCP (Model Context Protocol) server building principles. Tool design, resource patterns, best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# MCP 构建器 (MCP Builder)

> 构建 MCP 服务器的原则与最佳实践。

---

## 1. MCP 概览 (MCP Overview)

### 什么是 MCP？

模型上下文协议 (Model Context Protocol) —— 连接 AI 系统与外部工具、数据源的统一标准。

### 核心概念 (Core Concepts)

| 概念                 | 用途                             |
| -------------------- | -------------------------------- |
| **Tools (工具)**     | AI 可以调用的函数/能力           |
| **Resources (资源)** | AI 可以读取的数据 (如文件、文档) |
| **Prompts (提示词)** | 预定义的提示词模板               |

---

## 2. 服务器架构 (Server Architecture)

### 项目结构示例

```
my-mcp-server/
├── src/
│   └── index.ts      # 主入口文件
├── package.json
└── tsconfig.json
```

### 传输类型 (Transport Types)

| 类型          | 适用场景               |
| ------------- | ---------------------- |
| **Stdio**     | 本地运行、基于命令行   |
| **SSE**       | 基于 Web、支持流式传输 |
| **WebSocket** | 实时、双向通信         |

---

## 3. 工具设计原则 (Tool Design Principles)

### 好的工具设计

| 原则       | 描述                                       |
| ---------- | ------------------------------------------ |
| 清晰命名   | 面向动作 (如 `get_weather`, `create_user`) |
| 单一职责   | 一个工具只做好一件事                       |
| 验证输入   | 带有类型和描述的完整 Schema                |
| 结构化输出 | 可预测的、易于解析的响应格式               |

### 输入 Schema 设计

| 字段               | 必填?          |
| ------------------ | -------------- |
| 类型 (Type)        | 是 - object    |
| 属性 (Properties)  | 定义每个参数   |
| 必填 (Required)    | 列出必填参数   |
| 描述 (Description) | 人类可读的描述 |

---

## 4. 资源模式 (Resource Patterns)

### 资源类型

| 类型            | 用途                        |
| --------------- | --------------------------- |
| 静态 (Static)   | 固定数据 (如配置、静态文档) |
| 动态 (Dynamic)  | 根据请求即时生成的数据      |
| 模板 (Template) | 带有参数的 URI 路径         |

### URI 模式

| 模式                   | 示例                |
| ---------------------- | ------------------- |
| 固定 (Fixed)           | `docs://readme`     |
| 参数化 (Parameterized) | `users://{userId}`  |
| 集合 (Collection)      | `files://project/*` |

---

## 5. 错误处理 (Error Handling)

### 错误类型

| 情景       | 响应方式                           |
| ---------- | ---------------------------------- |
| 参数无效   | 返回详细的验证错误信息             |
| 未找到     | 返回明确的 "Not Found" 状态        |
| 服务器错误 | 返回通用错误，但在后台记录详细日志 |

### 最佳实践

- 返回结构化的错误
- 不暴露内部细节
- 记录日志以便调试
- 提供可操作的错误信息

---

## 6. 多模态处理 (Multimodal Handling)

### 支持的类型

| 类型          | 编码方式           |
| ------------- | ------------------ |
| 文本 (Text)   | 纯文本             |
| 图像 (Images) | Base64 + MIME 类型 |
| 文件 (Files)  | Base64 + MIME 类型 |

---

## 7. 安全原则 (Security Principles)

### 输入验证

- 严格验证所有工具的输入参数
- 脱敏处理用户提供的数据
- 限制资源访问权限

### API 密钥

- 使用环境变量
- 严禁将 Secret 写入日志
- 验证权限

---

## 8. 配置 (Configuration)

### Claude Desktop 配置

| 字段    | 用途               |
| ------- | ------------------ |
| command | 要运行的可执行文件 |
| args    | 命令参数           |
| env     | 环境变量           |

---

## 9. 测试 (Testing)

### 测试分类

| 类型                   | 焦点                |
| ---------------------- | ------------------- |
| 单元测试 (Unit)        | 工具的核心逻辑      |
| 集成测试 (Integration) | 完整的服务器链路    |
| 契约测试 (Contract)    | Schema 的合法性验证 |

---

## 10. 最佳实践检查清单 (Best Practices Checklist)

- [ ] 清晰且面向动作的工具命名
- [ ] 带有描述的完整输入 Schema
- [ ] 结构化的 JSON 输出
- [ ] 涵盖各种情况的错误处理
- [ ] 输入验证
- [ ] 基于环境变量的配置
- [ ] 用于调试的日志记录

---

> **记住：** MCP 工具应该保持简单、专注且文档齐全。AI 极度依赖描述来判断何时以及如何使用它们。
