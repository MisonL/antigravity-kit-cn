# 架构示例

> 按项目类型给出现实世界的架构决策示例。

---

## 示例 1：MVP（最小可行产品）电商（单人开发）

```yaml
需求:
  - 初期 <1000 用户
  - 单人开发
  - 快速上线（8 周）
  - 预算敏感

架构决策:
  应用结构: Monolith（单体，更适合单人）
  框架: Next.js（全栈、开发快）
  数据层: Prisma 直连（避免过度抽象）
  认证: JWT（JSON Web Token，比 OAuth（授权协议）更轻量）
  支付: Stripe（托管支付方案）
  数据库: PostgreSQL（订单场景需要 ACID）

接受的权衡:
  - Monolith → 无法独立扩缩（团队规模暂不支持）
  - 不使用 Repository（仓储模式） → 可测性较弱（简单 CRUD 阶段可接受）
  - JWT → 初期无社交登录（后续可补）

后续迁移路径:
  - 用户 > 10K → 拆分支付服务
  - 团队 > 3 → 引入 Repository pattern（仓储模式）
  - 需要社交登录 → 增加 OAuth（授权协议）
```

---

## 示例 2：SaaS（软件即服务）产品（5-10 人团队）

```yaml
需求:
  - 1K-100K 用户
  - 5-10 名开发者
  - 长期（12 个月以上）
  - 多业务域（计费、用户、核心）

架构决策:
  应用结构: Modular Monolith（模块化单体，适合团队规模）
  框架: NestJS（天然模块化）
  数据层: Repository pattern（仓储模式，利于测试与替换）
  领域模型: Partial DDD（部分领域驱动）
  认证: OAuth（授权协议） + JWT（JSON Web Token）
  缓存: Redis
  数据库: PostgreSQL

接受的权衡:
  - Modular Monolith → 模块间仍有耦合（微服务时机未到）
  - Partial DDD → 不做完整聚合（缺少强领域专家）
  - RabbitMQ（消息队列）后置 → 初期先同步调用（需求验证后再引入）

迁移路径:
  - 团队 > 10 → 考虑微服务
  - 域冲突加剧 → 拆分有界上下文
  - 读性能问题 → 引入 CQRS（命令查询职责分离）
```

---

## 示例 3：企业级（100K+ 用户）

```yaml
需求:
  - 100K+ 用户
  - 10+ 开发者
  - 多业务域
  - 不同扩缩需求
  - 7×24 可用性

架构决策:
  应用结构: Microservices（微服务，独立扩缩）
  API 网关: Kong/AWS API GW（网关）
  领域模型: Full DDD（完整领域驱动）
  一致性: Event-driven（事件驱动，接受最终一致性）
  消息总线: Kafka
  认证: OAuth（授权协议） + SAML（企业 SSO）
  数据库: Polyglot（按场景选数据库）
  CQRS（命令查询职责分离）: 选定服务

运行要求:
  - Service mesh（Istio/Linkerd）
  - Distributed tracing（分布式追踪，Jaeger/Tempo）
  - Centralized logging（集中日志，ELK/Loki）
  - Circuit breakers（熔断器，Resilience4j）
  - Kubernetes/Helm
```
