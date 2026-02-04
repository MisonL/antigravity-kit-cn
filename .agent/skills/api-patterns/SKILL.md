---
description: API 设计原则与最佳实践 (REST, GraphQL, tRPC)
---

# API 设计模式 (API Patterns)

## 核心原则

1.  **资源导向 (Resource-Oriented)**
    - 使用名词表示资源 (如 `/users`, `/orders`)。
    - 使用 HTTP 动词表示操作 (GET, POST, PUT, DELETE)。

2.  **版本控制 (Versioning)**
    - 始终在 URL 或 Header 中包含版本号。
    - 例: `/api/v1/users`

3.  **分页与过滤 (Pagination & Filtering)**
    - 对于列表接口，必须支持分页。
    - 使用 `limit` 和 `offset` (或 `cursor`)。
    - 例: `/users?role=admin&limit=20`

4.  **一致的响应格式 (Consistent Response)**
    ```json
    {
      "data": { ... },
      "meta": { "page": 1, "total": 100 },
      "error": null
    }
    ```

## 常见对比

| 特性         | REST        | GraphQL      | tRPC            |
| :----------- | :---------- | :----------- | :-------------- |
| **灵活性**   | 中          | 高           | 低 (仅限 TS)    |
| **缓存**     | 容易 (HTTP) | 困难         | 困难            |
| **类型安全** | 需 OpenAPI  | 内置 Schema  | 100% 自动推导   |
| **适用场景** | 公共 API    | 复杂数据查询 | 全栈 TypeScript |

## HTTP 状态码指南

- `200 OK`: 成功
- `201 Created`: 创建成功
- `400 Bad Request`: 客户端参数错误
- `401 Unauthorized`: 未登录
- `403 Forbidden`: 已登录但无权限
- `404 Not Found`: 资源不存在
- `429 Too Many Requests`:请求过快
- `500 Internal Server Error`: 服务器炸了
