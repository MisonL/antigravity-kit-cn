---
name: api-patterns
description: API 设计原则与决策。REST vs GraphQL vs tRPC 选择、响应格式、版本控制、分页。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns - API 设计模式

> 2025 年的 API 设计原则与决策。
> **学会思考，而不是复制固定的模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的文件！** 检查内容映射，找到你需要的内容。

---

## 📑 内容映射 (Content Map)

| 文件 (File)           | 描述 (Description)                | 何时阅读 (When to Read) |
| --------------------- | --------------------------------- | ----------------------- |
| `api-style.md`        | REST vs GraphQL vs tRPC 决策树    | 选择 API 类型时         |
| `rest.md`             | 资源命名、HTTP 方法、状态码       | 设计 REST API 时        |
| `response.md`         | 信封模式、错误格式、分页          | 设计响应结构时          |
| `graphql.md`          | Schema 设计、使用场景、安全性     | 考虑使用 GraphQL 时     |
| `trpc.md`             | TypeScript Monorepo、类型安全     | TS 全栈项目             |
| `versioning.md`       | URI/Header/Query 版本控制         | API 演进规划            |
| `auth.md`             | JWT, OAuth, Passkey, API Keys     | 选择认证模式            |
| `rate-limiting.md`    | 令牌桶、滑动窗口                  | API 防护                |
| `documentation.md`    | OpenAPI/Swagger 最佳实践          | 编写文档                |
| `security-testing.md` | OWASP API Top 10, auth/authz 测试 | 安全审计                |

---

## 🔗 相关 Skill

| 需求     | Skill                           |
| -------- | ------------------------------- |
| API 实现 | `@[skills/backend-development]` |
| 数据结构 | `@[skills/database-design]`     |
| 安全细节 | `@[skills/security-hardening]`  |

---

## ✅ 决策检查清单

在设计 API 之前：

- [ ] **询问过用户关于 API 消费者的信息？**
- [ ] **为当前上下文选择了合适的 API 风格？** (REST/GraphQL/tRPC)
- [ ] **定义了统一的响应格式？**
- [ ] **规划了版本控制策略？**
- [ ] **考虑了认证需求？**
- [ ] **规划了速率限制？**
- [ ] **定义了文档编写方式？**

---

## ❌ 反模式 (Anti-Patterns)

**不要 (DON'T):**

- 对所有事物都默认使用 REST
- 在 REST 端点中使用动词 (如 /getUsers)
- 返回不一致的响应格式
- 向客户端暴露内部错误
- 跳过速率限制

**要 (DO):**

- 根据上下文选择 API 风格
- 询问客户端需求
- 彻底地编写文档
- 使用合适的状态码

---

## 脚本 (Script)

| Script                     | Purpose      | Command                                          |
| -------------------------- | ------------ | ------------------------------------------------ |
| `scripts/api_validator.py` | API 端点校验 | `python scripts/api_validator.py <project_path>` |
