---
name: api-patterns
description: API 设计原则与决策。REST vs GraphQL vs tRPC 选择、响应格式、版本控制、分页。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API 模式与设计 (API Patterns)

> 2025 年 API 设计原则与决策。
> **学会思考背景，而不仅仅是复制固定模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

---

## 📑 内容地图 (Content Map)

| 文件                  | 描述                                | 何时阅读            |
| --------------------- | ----------------------------------- | ------------------- |
| `api-style.md`        | REST vs GraphQL vs tRPC 决策树      | 选择 API 类型时     |
| `rest.md`             | 资源命名、HTTP 方法、状态码         | 设计 REST API 时    |
| `response.md`         | 信封模式 (Envelope)、错误格式、分页 | 设计响应结构时      |
| `graphql.md`          | Schema 设计、适用场景、安全         | 考虑使用 GraphQL 时 |
| `trpc.md`             | TypeScript monorepo、类型安全       | TS 全栈项目开发时   |
| `versioning.md`       | URI/Header/Query 版本控制           | 规划 API 演进时     |
| `auth.md`             | JWT, OAuth, Passkey, API Keys       | 选择认证模式时      |
| `rate-limiting.md`    | 令牌桶 (Token bucket)、滑动窗口     | 实施 API 保护时     |
| `documentation.md`    | OpenAPI/Swagger 最佳实践            | 编写文档时          |
| `security-testing.md` | OWASP API Top 10、认证/授权测试     | 进行安全审计时      |

---

## 🔗 相关技能

| 需求     | 技能                            |
| -------- | ------------------------------- |
| API 实现 | `@[skills/backend-development]` |
| 数据结构 | `@[skills/database-design]`     |
| 安全细节 | `@[skills/security-hardening]`  |

---

## ✅ 决策检查清单

在设计 API 之前：

- [ ] **询问过用户关于 API 消费者的信息了吗？**
- [ ] **为当前上下文选择了合适的 API 风格吗？** (REST/GraphQL/tRPC)
- [ ] **定义了统一的响应格式吗？**
- [ ] **规划了版本控制策略吗？**
- [ ] **考虑了认证需求吗？**
- [ ] **规划了速率限制 (Rate limiting) 吗？**
- [ ] **定义了文档编写方式吗？**

---

## ❌ 反模式 (Anti-Patterns)

**不要 (DON'T)：**

- 默认对所有内容使用 REST
- 在 REST 端点中使用动词 (如 `/getUsers`)
- 返回不一致的响应格式
- 向客户端暴露内部错误
- 跳过速率限制

**要 (DO)：**

- 根据上下文选择 API 风格
- 询问客户端需求
- 彻底记录文档
- 使用适当的状态码

---

## 脚本 (Script)

| 脚本                       | 目的         | 命令                                             |
| -------------------------- | ------------ | ------------------------------------------------ |
| `scripts/api_validator.py` | API 端点验证 | `python scripts/api_validator.py <project_path>` |
