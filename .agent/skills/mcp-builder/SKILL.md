---
name: mcp-builder
description: MCP（Model Context Protocol）服务构建原则。覆盖工具设计、资源模式与最佳实践。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# MCP 构建器 (MCP Builder)

> MCP 服务器构建原则。

---

## 1. MCP 概览 (MCP Overview)

### 什么是 MCP？(What is MCP?)

Model Context Protocol：用于连接 AI 系统与外部工具、数据源的标准协议。

### 核心概念 (Core Concepts)

| Concept | Purpose |
|---------|---------|
| **Tools** | AI 可调用的函数能力 |
| **Resources** | AI 可读取的数据资源 |
| **Prompts** | 预定义提示词模板 |

---

## 2. 服务架构 (Server Architecture)

### 项目结构 (Project Structure)

```
my-mcp-server/
├── src/
│   └── index.ts      # Main entry
├── package.json
└── tsconfig.json
```

### 传输类型 (Transport Types)

| Type | Use |
|------|-----|
| **Stdio** | 本地、CLI 场景 |
| **SSE** | Web 场景、流式输出 |
| **WebSocket** | 实时、双向通信 |

---

## 3. 工具设计原则 (Tool Design Principles)

### 优秀工具设计 (Good Tool Design)

| Principle | Description |
|-----------|-------------|
| 名称清晰 | 动作导向（如 `get_weather`、`create_user`） |
| 单一职责 | 一次只做好一件事 |
| 输入可校验 | 使用含类型与描述的 schema |
| 输出结构化 | 响应格式可预测、可消费 |

### 输入 Schema 设计 (Input Schema Design)

| Field | Required? |
|-------|-----------|
| Type | 是，通常为 object |
| Properties | 定义每个参数 |
| Required | 列出必填参数 |
| Description | 人类可读说明 |

---

## 4. 资源模式 (Resource Patterns)

### 资源类型 (Resource Types)

| Type | Use |
|------|-----|
| Static | 固定数据（配置、文档） |
| Dynamic | 按请求动态生成 |
| Template | 含参数的 URI 模板 |

### URI 模式 (URI Patterns)

| Pattern | Example |
|---------|---------|
| Fixed | `docs://readme` |
| Parameterized | `users://{userId}` |
| Collection | `files://project/*` |

---

## 5. 错误处理 (Error Handling)

### 错误类型 (Error Types)

| Situation | Response |
|-----------|----------|
| 参数无效 | 返回明确校验错误信息 |
| 资源不存在 | 返回清晰 “not found” 信息 |
| 服务器错误 | 返回通用错误，对内记录详细日志 |

### 最佳实践 (Best Practices)

- 返回结构化错误对象
- 不暴露内部实现细节
- 记录可追踪日志用于调试
- 提供可执行的错误提示

---

## 6. 多模态处理 (Multimodal Handling)

### 支持类型 (Supported Types)

| Type | Encoding |
|------|----------|
| Text | 纯文本 (Plain text) |
| Images | Base64 + MIME type |
| Files | Base64 + MIME type |

---

## 7. 安全原则 (Security Principles)

### 输入校验 (Input Validation)

- 校验所有工具输入
- 清洗用户提供的数据
- 限制资源访问范围

### API 密钥管理 (API Keys)

- 使用环境变量存储
- 禁止日志输出密钥
- 校验调用权限

---

## 8. 配置 (Configuration)

### Claude Desktop 配置 (Claude Desktop Config)

| Field | Purpose |
|-------|---------|
| command | 要执行的命令 |
| args | 命令参数 |
| env | 环境变量 |

---

## 9. 测试 (Testing)

### 测试类别 (Test Categories)

| Type | Focus |
|------|-------|
| Unit | 工具逻辑正确性 |
| Integration | 服务整体协作 |
| Contract | Schema 契约校验 |

---

## 10. 最佳实践检查清单 (Best Practices Checklist)

- [ ] 工具名称清晰且动作导向
- [ ] 输入 schema 完整且含说明
- [ ] 输出为结构化 JSON
- [ ] 覆盖各类错误处理场景
- [ ] 输入校验到位
- [ ] 使用环境变量进行配置
- [ ] 日志可用于排障与调试

---

> **牢记：** MCP 工具应保持简单、聚焦且文档完善。AI 依赖描述来正确调用它们。
