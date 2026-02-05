---
name: mcp-builder
description: MCP (模型上下文协议) 服务器构建原则、工具设计与资源模式
---

# MCP 构建器 (MCP Builder)

## 核心概念

MCP (Model Context Protocol) 是连接 AI 模型与本地数据的标准协议。

1.  **Resources (资源)**: 类比 GET 请求。AI 可以读取的数据（文件、日志、数据库记录）。
2.  **Tools (工具)**: 类比 POST 请求。AI 可以执行的操作（执行命令、写入文件）。
3.  **Prompts (提示词)**: 预定义的交互模板。

## 设计原则

1.  **原子性 (Atomicity)**
    - 个工具只做一件事。
    - ❌ `tools/manage_project` (太宽泛)
    - ✅ `tools/create_file`, `tools/list_files`

2.  **无状态 (Stateless)**
    - Server 不应该保存会话状态。每次请求都是独立的。

3.  **安全性 (Security)**
    - 所有的输入必须校验。
    - 限制文件访问路径（Sandbox）。

## 开发流程

推荐使用 TypeScript SDK:

```bash
npx @modelcontextprotocol/create-server my-server
```

核心代码示例:

```typescript
server.tool(
    "calculate_sum",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => {
        return { content: [{ type: "text", text: String(a + b) }] };
    },
);
```
