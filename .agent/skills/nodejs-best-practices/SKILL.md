---
name: nodejs-best-practices
description: Node.js 开发原则、异步模式、事件循环与架构
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Node.js 最佳实践

## 核心原则

1.  **永远不要阻塞 Event Loop**
    - ❌ `fs.readFileSync` (在热路径中)
    - ❌ CPU 密集型计算 (如图像处理、加密)，应放入 Worker Thread。

2.  **错误处理**
    - 使用 `async/await` + `try/catch`。
    - **必须**监听 `unhandledRejection` 和 `uncaughtException`，并在发生时优雅退出（重启进程）。

3.  **配置管理**
    - 使用 `dotenv` 或 `config` 库。
    - 配置项应该有 Schema 校验 (如 env-schema / zod)。

## 架构分层

推荐三层架构：

1.  **Controller (Web Layer)**: 解析 HTTP 请求，校验参数，调用 Service。
2.  **Service (Business Logic)**: 核心业务逻辑，不依赖具体框架。
3.  **Data Access (DAL)**: 数据库操作，ORM 调用。

## 安全

- 使用 `helmet` 设置 HTTP 头。
- 使用 `cors` 限制跨域。
- 使用 `rate-limit` 防止暴力破解。
