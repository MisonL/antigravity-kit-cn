# API 风格选择（2025）

> REST vs GraphQL vs tRPC —— 在什么情况下选择哪种？

## 决策树

```
谁是 API 消费者？
│
├── 公共 API / 多平台支持
│   └── REST + OpenAPI（接口规范，最广泛的兼容性）
│
├── 数据需求复杂 / 多个前端
│   └── GraphQL（灵活的查询）
│
├── TypeScript（TS）前端 + 后端（monorepo，单仓）
│   └── tRPC（端到端类型安全）
│
├── 实时性 / 事件驱动
│   └── WebSocket + AsyncAPI（异步 API 规范）
│
└── 内部微服务
    └── gRPC（追求性能）或 REST（追求简单）
```

## 对比（Comparison）

| 因素 | REST | GraphQL | tRPC |
| :--- | :--- | :------ | :--- |
| **最佳适用** | 公共 API | 复杂应用 | TS monorepos（TypeScript 单仓） |
| **学习曲线** | 低 | 中 | 低（如果是 TS 用户） |
| **过度/不足获取** | 常见（over/under fetching） | 已解决 | 已解决 |
| **类型安全** | 手动（OpenAPI） | 基于 Schema（模式） | 自动 |
| **缓存** | HTTP 原生支持 | 复杂 | 基于客户端 |

## 选择问题

1. 谁是 API 消费者？
2. 前端是 TypeScript（TS）吗？
3. 数据关系有多复杂？
4. 缓存是否至关重要？
5. 是公共 API 还是内部 API？
