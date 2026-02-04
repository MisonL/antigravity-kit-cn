---
description: 常见架构模式的实际应用示例
---

# 架构示例 (Architecture Examples)

## 1. 模块化单体 (Modular Monolith) - 推荐默认架构

适合：大多数初创项目，中小团队。

```
src/
├── modules/
│   ├── auth/           # Auth Context
│   │   ├── api/        # Public Interface
│   │   ├── core/       # Domain Logic
│   │   └── data/       # Database Access
│   ├── inventory/      # Inventory Context
│   └── billing/        # Billing Context
├── shared/             # Shared Kernel (Logging, Utils)
└── main.ts             # Composition Root
```

- **规则**: 模块之间只能通过 `api` 目录引用，不能直接 import 内部代码。数据库表也是隔离的。

## 2. 事件驱动架构 (Event-Driven Architecture)

适合：高解耦，异步处理，高并发。

- **订单服务**: 创建订单 -> 发送 `OrderCreated` 事件。
- **库存服务**: 监听 `OrderCreated` -> 扣减库存。
- **邮件服务**: 监听 `OrderCreated` -> 发送确认邮件。

优点：添加新功能（如发送短信）不需要修改订单服务。
缺点：排查问题困难，最终一致性挑战。

## 3. 六边形架构 (Hexagonal / Ports and Adapters)

适合：核心业务逻辑复杂，需要独立于技术框架。

```
src/
├── domain/             # 纯业务逻辑 (无依赖)
│   ├── model/
│   └── service/
├── application/        # 用例 (Use Cases)
│   ├── ports/          # 接口定义 (In / Out)
│   └── service/
├── infrastructure/     # 适配器 (Adapters)
│   ├── web/            # 接收 HTTP 请求
│   └── persistence/    # 数据库实现
```

- **核心原则**: 依赖倒置。业务逻辑不依赖数据库，数据库依赖业务定义的接口。
