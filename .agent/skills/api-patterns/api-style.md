# API 风格选择 (API Style Selection)

> REST vs GraphQL vs tRPC - 何时选择哪一个？

## 决策树

```
API 消费者是谁？
│
├── 公共 API / 多个平台 (Web, Mobile, 3rd party)
│   └── REST + OpenAPI (兼容性最广)
│
├── 复杂数据需求 / 多个前端
│   └── GraphQL (灵活查询)
│
├── TypeScript 前端 + 后端 (Monorepo)
│   └── tRPC (端到端类型安全)
│
├── 实时 / 事件驱动
│   └── WebSocket + AsyncAPI
│
└── 内部微服务
    └── gRPC (高性能) 或 REST (简单)
```

## 对比

| 因素              | REST           | GraphQL     | tRPC                |
| :---------------- | :------------- | :---------- | :------------------ |
| **最佳适用**      | 公共 API       | 复杂应用    | TS Monorepos        |
| **学习曲线**      | 低             | 中          | 低 (如果是 TS 用户) |
| **过度/不足获取** | 常见           | 已解决      | 已解决              |
| **类型安全**      | 手动 (OpenAPI) | 基于 Schema | 自动                |
| **缓存**          | HTTP 原生支持  | 复杂        | 基于客户端          |

## 选择问题

1.  谁是 API 消费者？
2.  前端是 TypeScript 吗？
3.  数据关系有多复杂？
4.  缓存是否至关重要？
5.  是公共 API 还是内部 API？
