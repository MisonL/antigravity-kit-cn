---
name: mcp-builder
description: MCP (模型上下文协议) 服务器构建原则、工具设计与资源模式
allowed-tools: Read, Write, Edit, Glob, Grep
---

# MCP Builder - MCP 构建

> 构建 MCP 服务器的原则。

---

## 1. MCP 概述 (MCP Overview)

### 什么是 MCP?

Model Context Protocol (模型上下文协议) - 连接 AI 系统与外部工具和数据源的标准。

### 核心概念

| 概念          | 目的              |
| ------------- | ----------------- |
| **Tools**     | AI 可以调用的函数 |
| **Resources** | AI 可以读取的数据 |
| **Prompts**   | 预定义的提示模板  |

---

## 2. 服务器架构 (Server Architecture)

### 项目结构

```
my-mcp-server/
├── src/
│   └── index.ts      # 主入口
├── package.json
└── tsconfig.json
```

### 传输类型 (Transport Types)

| 类型          | 用途           |
| ------------- | -------------- |
| **Stdio**     | 本地，基于 CLI |
| **SSE**       | 基于 Web，流式 |
| **WebSocket** | 实时，双向     |

---

## 3. 工具设计原则 (Tool Design Principles)

### 好的工具设计

| 原则           | 描述                                |
| -------------- | ----------------------------------- |
| 清晰的名称     | 面向动作 (get_weather, create_user) |
| 单一目的       | 做好一件事                          |
| 经过验证的输入 | 带有类型和描述的 Schema             |
| 结构化输出     | 可预测的响应格式                    |

### 输入 Schema 设计

| 字段        | 必填?          |
| ----------- | -------------- |
| Type        | 是 - object    |
| Properties  | 定义每个参数   |
| Required    | 列出必填参数   |
| Description | 人类可读的描述 |

---

## 4. 资源模式 (Resource Patterns)

### 资源类型

| 类型     | 用途                  |
| -------- | --------------------- |
| Static   | 固定数据 (配置, 文档) |
| Dynamic  | 请求生成              |
| Template | 带参数的 URI          |

### URI 模式

| 模式          | 示例                |
| ------------- | ------------------- |
| Fixed         | `docs://readme`     |
| Parameterized | `users://{userId}`  |
| Collection    | `files://project/*` |

---

## 5. 错误处理 (Error Handling)

### 错误类型

| 这类情况   | 响应               |
| ---------- | ------------------ |
| 参数无效   | 验证错误消息       |
| 未找到     | 清晰的 "not found" |
| 服务器错误 | 通用错误，记录细节 |

### 最佳实践

- 返回结构化错误
- 不要暴露内部细节
- 记录日志以供调试
- 提供可操作的消息

---

## 6. 多模态处理 (Multimodal Handling)

### 支持的类型

| 类型   | 编码               |
| ------ | ------------------ |
| Text   | 纯文本             |
| Images | Base64 + MIME type |
| Files  | Base64 + MIME type |

---

## 7. 安全原则 (Security Principles)

### 输入验证

- 验证所有工具输入
- 清理用户提供的数据
- 限制资源访问

### API 密钥

- 使用环境变量
- 不要记录密钥日志
- 验证权限

---

## 8. 配置 (Configuration)

### Claude Desktop 配置

| 字段    | 目的               |
| ------- | ------------------ |
| command | 要运行的可执行文件 |
| args    | 命令参数           |
| env     | 环境变量           |

---

## 9. 测试 (Testing)

### 测试类别

| 类型        | 焦点        |
| ----------- | ----------- |
| Unit        | 工具逻辑    |
| Integration | 完整服务器  |
| Contract    | Schema 验证 |

---

## 10. 最佳实践检查清单 (Best Practices Checklist)

- [ ] 清晰、面向动作的工具名称
- [ ] 带有描述的完整输入 Schema
- [ ] 结构化的 JSON 输出
- [ ] 涵盖所有情况的错误处理
- [ ] 输入验证
- [ ] 基于环境的配置
- [ ] 用于调试的日志记录

---

> **记住：** MCP 工具应该简单、专注且文档齐全。AI 依赖描述来正确使用它们。
