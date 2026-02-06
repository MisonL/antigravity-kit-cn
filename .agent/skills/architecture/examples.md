# 架构示例 (Architecture Examples)

> 基于项目类型的真实架构决策。

---

## 示例 1: MVP 电商 (独立开发者)

```yaml
需求:
    - 初始用户少于 1000 人
    - 独立开发者
    - 快速上线 (8 周内)
    - 预算有限

架构决策:
    应用结构: 单体架构 (对个人开发者更简单)
    框架: Next.js (全栈，开发速度快)
    数据层: 直连 Prisma (不过度抽象)
    身份认证: JWT (比 OAuth 更简单)
    支付: Stripe (托管方案)
    数据库: PostgreSQL (ACID 特性保障订单安全)

接受的权衡 (Trade-offs):
    - 单体架构 → 无法独立扩展 (团队规模尚不需要分布式)
    - 无 Repository 模式 → 测试性较低 (简单的 CRUD 端点不需要)
    - JWT → 初始阶段不支持社交登录 (以后可以添加)

未来演进路径:
    - 用户 > 10K → 提取支付服务
    - 团队 > 3人 → 增加 Repository 模式
    - 需要社交登录 → 增加 OAuth
```

---

## 示例 2: SaaS 产品 (5-10 人团队)

```yaml
需求:
    - 1K-100K 用户
    - 5-10 名开发者
    - 长期项目 (12个月以上)
    - 多个领域 (计费、用户、核心业务)

架构决策:
    应用结构: 模块化单体 (适合该团队规模)
    框架: NestJS (天然支持模块化设计)
    数据层: Repository 模式 (易于测试、具有灵活性)
    领域模型: 部分领域驱动设计 (DDD) (丰富实体类)
    身份认证: OAuth + JWT
    缓存: Redis
    数据库: PostgreSQL

接受的权衡 (Trade-offs):
    - 模块化单体 → 存在一定的模块耦合 (微服务化成本过高)
    - 部分 DDD → 未实现完整的聚合根 (因为缺乏领域专家)
    - 异步消息队列 → 初始阶段采用同步 (在证明必要后再添加消息队列)

演进路径:
    - 团队 > 10人 → 考虑微服务
    - 领域逻辑冲突 → 提取限界上下文 (Bounded Contexts)
    - 读取性能瓶颈 → 增加 CQRS
```

---

## 示例 3: 企业级应用 (100K+ 用户)

```yaml
需求:
    - 100K+ 用户
    - 10 名以上开发者
    - 多个业务领域
    - 不同的扩展性需求
    - 24/7 高可用

架构决策:
    应用结构: 微服务架构 (服务可独立扩展)
    API 网关: Kong / AWS API 网关
    领域模型: 完整 DDD
    一致性: 事件驱动 (最终一致性)
    消息中心: Kafka
    身份认证: OAuth + SAML (企业级 SSO)
    数据库: Polyglot (多语言存储，为不同需求选合适工具)
    CQRS: 选择性在特定服务使用

运维需求 (Operational Requirements):
    - 服务网格 (Service mesh - Istio/Linkerd)
    - 分布式追踪 (Jaeger/Tempo)
    - 集中化日志 (ELK/Loki)
    - 断路器 (Circuit breakers - Resilience4j)
    - Kubernetes / Helm 部署
```

---

## 六边形架构 (Hexagonal Architecture / 整洁架构)

```
src/
├── domain/             # 纯业务逻辑 (无外部依赖)
│   ├── model/
│   └── service/
├── application/        # 用例 (Use Cases)
│   ├── ports/          # 接口定义 (输入/输出)
│   └── service/
├── infrastructure/     # 适配器 (Adapters)
│   ├── web/            # 接收 HTTP 请求
│   └── persistence/    # 数据库持久化实现
```

- **核心原则**: 依赖倒置。业务逻辑不依赖数据库，数据库依赖业务定义的接口。
