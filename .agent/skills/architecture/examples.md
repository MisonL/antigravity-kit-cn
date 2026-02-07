# 架构示例 (Architecture Examples)

> 按项目类型给出真实世界的架构决策示例。

---

## 示例 1：MVP 电商（单人开发）(Example 1)

```yaml
Requirements:
  - <1000 users initially
  - 单人开发
  - 快速上线（8 周）
  - 预算敏感

Architecture Decisions:
  App Structure: Monolith（单人更易维护）
  Framework: Next.js（全栈、开发快）
  Data Layer: Prisma 直连（避免过度抽象）
  Authentication: JWT（比 OAuth 更轻量）
  Payment: Stripe（托管支付方案）
  Database: PostgreSQL（订单场景需要 ACID）

Trade-offs Accepted:
  - Monolith → 不能独立扩缩（团队规模不支持服务拆分）
  - No Repository → 可测性稍弱（简单 CRUD 阶段可接受）
  - JWT → 初期无社交登录（后续可补）

Future Migration Path:
  - 用户 > 10K → 拆分支付服务
  - 团队 > 3 → 引入 Repository 模式
  - 需要社交登录 → 增加 OAuth
```

---

## 示例 2：SaaS 产品（5-10 人团队）(Example 2)

```yaml
Requirements:
  - 1K-100K users
  - 5-10 名开发者
  - 长周期（12 个月以上）
  - 多业务域（计费、用户、核心功能）

Architecture Decisions:
  App Structure: Modular Monolith（适配团队规模）
  Framework: NestJS（天然模块化）
  Data Layer: Repository pattern（利于测试与替换）
  Domain Model: Partial DDD（核心实体领域化）
  Authentication: OAuth + JWT
  Caching: Redis
  Database: PostgreSQL

Trade-offs Accepted:
  - Modular Monolith → 模块间仍有耦合（微服务时机未到）
  - Partial DDD → 不做完整聚合（缺少强领域专家）
  - RabbitMQ later → 初期先同步调用（需求验证后再引入）

Migration Path:
  - 团队 > 10 → 评估微服务化
  - 域冲突加剧 → 拆分有界上下文
  - 读性能瓶颈明显 → 引入 CQRS
```

---

## 示例 3：企业级（100K+ 用户）(Example 3)

```yaml
Requirements:
  - 100K+ users
  - 10+ 开发者
  - 多业务域并行
  - 不同模块扩缩需求不同
  - 7×24 可用性要求

Architecture Decisions:
  App Structure: Microservices（独立扩缩）
  API Gateway: Kong/AWS API GW
  Domain Model: Full DDD
  Consistency: Event-driven（接受最终一致性）
  Message Bus: Kafka
  Authentication: OAuth + SAML（企业 SSO）
  Database: Polyglot（按场景选数据库）
  CQRS: Selected services

Operational Requirements:
  - Service mesh（Istio/Linkerd）
  - 分布式追踪（Jaeger/Tempo）
  - 集中日志（ELK/Loki）
  - 熔断器（Resilience4j）
  - Kubernetes/Helm
```
