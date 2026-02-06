---
name: architecture
description: 架构决策框架、权衡分析与 ADR 文档
allowed-tools: Read, Glob, Grep
---

# 软件架构 (Architecture)

## 核心理念

架构就是**权衡 (Trade-offs)**。没有完美的架构，只有最适合当前场景的架构。

## 决策框架

在做架构决策时，考虑以下维度：

1.  **可维护性 (Maintainability)**: 代码是否容易理解和修改？
2.  **可扩展性 (Scalability)**: 能否支撑 10 倍用户量？
3.  **性能 (Performance)**: 响应时间是否达标？
4.  **成本 (Cost)**: 开发成本和运行成本。
5.  **上市时间 (Time to Market)**: 能否快速发布？

## 常见模式

- **单体 (Monolith)**: 适合初期，开发部署简单。
- **微服务 (Microservices)**: 适合团队规模大、业务复杂的场景。
- **Serverless**: 适合流量波动大、运维人力少的场景。

## ADR (架构决策记录)

对于重要决策，必须记录 ADR：

```markdown
# ADR-001:这也是标题

## 状态

已采纳

## 背景

我们需要选择一个数据库。

## 决策

选择 PostgreSQL。

## 后果

- 优点: 关系型数据支持好，生态成熟。
- 缺点: 对于非结构化数据不如 MongoDB 灵活。
```
