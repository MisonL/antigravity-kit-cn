---
name: api-patterns
description: API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API 模式 (API Patterns)

> 2025 年的 API 设计原则与决策。
> **学会思考，而不是复制固定的模式。**

## 🎯 选择性阅读规则

**仅阅读与请求相关的目标文件！** 请先检查内容地图，找到你需要的内容。

---

## 📑 内容地图 (Content Map)

| 文件                  | 描述                                                                        | 何时阅读         |
| --------------------- | --------------------------------------------------------------------------- | ---------------- |
| `api-style.md`        | REST vs GraphQL vs tRPC 决策树                                              | 选择 API 类型时  |
| `rest.md`             | Resource naming (资源命名), HTTP methods (HTTP 方法), status codes (状态码) | 设计 REST API 时 |
| `response.md`         | Envelope pattern (信封模式), error format (错误格式), pagination (分页)     | 响应结构设计时   |
| `graphql.md`          | Schema design (Schema 设计), when to use (何时使用), security (安全)        | 考虑 GraphQL 时  |
| `trpc.md`             | TypeScript monorepo, type safety (类型安全)                                 | TS 全栈项目时    |
| `versioning.md`       | URI/Header/Query versioning (版本控制)                                      | API 演进规划时   |
| `auth.md`             | JWT, OAuth, Passkey, API Keys                                               | 选择认证模式时   |
| `rate-limiting.md`    | Token bucket (令牌桶), sliding window (滑动窗口)                            | API 保护时       |
| `documentation.md`    | OpenAPI/Swagger best practices (最佳实践)                                   | 编写文档时       |
| `security-testing.md` | OWASP API Top 10, auth/authz testing (认证/授权测试)                        | 安全审计时       |

---

## 🔗 相关 Skill (Related Skills)

| 需求     | Skill (技能)                    |
| -------- | ------------------------------- |
| API 实现 | `@[skills/backend-development]` |
| 数据结构 | `@[skills/database-design]`     |
| 安全细节 | `@[skills/security-hardening]`  |

---

## ✅ 决策检查清单 (Decision Checklist)

在设计 API 之前：

- [ ] **询问过用户关于 API 消费者的信息了吗？**
- [ ] **为此场景选择了合适的 API 风格了吗？** (REST/GraphQL/tRPC)
- [ ] **定义了一致的响应格式吗？**
- [ ] **规划了版本控制策略吗？**
- [ ] **考虑了认证需求吗？**
- [ ] **规划了速率限制吗？**
- [ ] **文档化方法已定义吗？**

---

## ❌ 反模式 (Anti-Patterns)

**DON'T (不要):**

- 对所有事物默认使用 REST
- 在 REST 端点中使用动词 (/getUsers)
- 返回不一致的响应格式
- 向客户端暴露内部错误
- 跳过速率限制

**DO (要):**

- 根据上下文选择 API 风格
- 询问客户端需求
- 彻底地文档化
- 使用合适的状态码

---

## 脚本 (Script)

| 脚本                       | 用途         | 命令                                             |
| -------------------------- | ------------ | ------------------------------------------------ |
| `scripts/api_validator.py` | API 端点验证 | `python scripts/api_validator.py <project_path>` |
