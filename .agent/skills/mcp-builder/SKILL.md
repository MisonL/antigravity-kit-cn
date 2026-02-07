---
name: mcp-builder
description: MCP (Model Context Protocol) 服务器构建原则。包含工具设计、资源模式及最佳实践。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# MCP 构建器 (MCP Builder)

> 构建 MCP 服务器的核心原则。

---

## 1. MCP 概览 (MCP Overview)

### 什么是 MCP？

**模型上下文协议 (Model Context Protocol)** —— 一种用于将 AI 系统与外部工具 (Tools) 和数据源 (Resources) 进行连接的标准协议。

### 核心概念 (Core Concepts)

| 概念                 | 用途                          |
| -------------------- | ----------------------------- |
| **工具 (Tools)**     | AI 可以调用的函数 (Functions) |
| **资源 (Resources)** | AI 可以读取的数据 (Data)      |
| **提示词 (Prompts)** | 预定义的提示词模板            |

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

| 类型          | 使用场景                                  |
| ------------- | ----------------------------------------- |
| **Stdio**     | 本地、基于命令行 (CLI) 的工具             |
| **SSE**       | 基于 Web、涉及流式传输 (Streaming) 的场景 |
| **WebSocket** | 实时、双向通信                            |

---

## 3. 工具设计原则 (Tool Design Principles)

### 优秀的工具设计

| 原则       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 命名清晰   | 动作导向 (Action-oriented) (如 `get_weather`, `create_user`) |
| 单一职责   | 一个工具只做好一件事                                         |
| 验证输入   | 包含类型与描述的模式 (Schema)                                |
| 结构化输出 | 可预测的响应格式                                             |

### 输入模式设计 (Input Schema Design)

| 字段               | 是否必填？             |
| ------------------ | ---------------------- |
| 类型 (Type)        | 是 —— 通常为 `object`  |
| 属性 (Properties)  | 定义每一个参数及其细节 |
| 必填项 (Required)  | 列出所有强制要求的参数 |
| 描述 (Description) | 对人类友好的说明文字   |

---

## 4. 资源模式 (Resource Patterns)

### 资源类型

| 类型            | 使用场景                             |
| --------------- | ------------------------------------ |
| 静态 (Static)   | 固定数据（配置、文档）               |
| 动态 (Dynamic)  | 根据请求实时生成的数据               |
| 模板 (Template) | 带有参数的 URI (URI with parameters) |

### URI 模式 (URI Patterns)

| 模式              | 示例                |
| ----------------- | ------------------- |
| 固定 (Fixed)      | `docs://readme`     |
| 参数化            | `users://{userId}`  |
| 集合 (Collection) | `files://project/*` |

---

## 5. 错误处理 (Error Handling)

### 错误类型

| 场景               | 响应方案                            |
| ------------------ | ----------------------------------- |
| 参数无效           | 提供校验错误信息 (Validation error) |
| 未找到 (Not found) | 明确告知“未找到该资源”              |
| 服务器错误         | 提供通用的报错，后台记录详细内容    |

### 最佳实践

- 返回结构化的错误信息。
- 不要泄露内部实现细节。
- 为调试 (Debugging) 记录详尽的日志。
- 提供具有可操作性的提示消息。

---

## 6. 多模态处理 (Multimodal Handling)

### 支持的类型

| 类型 | 编码方式            |
| ---- | ------------------- |
| 文本 | 纯文本 (Plain text) |
| 图像 | Base64 + MIME 类型  |
| 文件 | Base64 + MIME 类型  |

---

## 7. 安全原则 (Security Principles)

### 输入验证

- 校验所有的工具输入。
- 净化 (Sanitize) 所有的用户提供数据。
- 限制资源的访问权限。

### API 密钥 (API Keys)

- 使用环境变量 (Environment Variables) 存储。
- 环境日志中严禁记录密钥 (Secrets)。
- 严格验证操作权限。

---

## 8. 配置参考 (Configuration)

### Claude Desktop 配置示例

| 字段    | 用途                   |
| ------- | ---------------------- |
| command | 要运行的可执行程序     |
| args    | 命令行参数 (Arguments) |
| env     | 环境变量               |

---

## 9. 测试分类 (Testing)

| 类型                | 关注点                       |
| ------------------- | ---------------------------- |
| 单元测试 (Unit)     | 工具逻辑                     |
| 集成测试            | 完整的服务器功能             |
| 契约测试 (Contract) | 模式校验 (Schema validation) |

---

## 10. 最佳实践检查清单 (Best Practices Checklist)

- [ ] 工具命名是否清晰且以动词导向？
- [ ] 输入模式 (Schema) 是否包含完善的描述？
- [ ] 输出是否为结构化的 JSON？
- [ ] 是否覆盖了所有情况的错误处理？
- [ ] 是否包含输入验证逻辑？
- [ ] 是否使用了基于环境的配置？
- [ ] 是否为调试记录了日志？

---

> **谨记：** MCP 工具应保持简单、专注且文档详尽。AI 严重依赖描述文字来正确使用这些工具。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/mcp-builder/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/mcp-builder/SKILL.md`。
- **注意**：文档层不改技能流程；仅补充目录映射事实。
