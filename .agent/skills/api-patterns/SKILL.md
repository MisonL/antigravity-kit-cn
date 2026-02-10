---
name: api-patterns
description: API design principles and decision-making（API 设计原则与决策逻辑）。REST vs GraphQL vs tRPC selection（选择）、response formats（响应格式）、versioning（版本控制）、pagination（分页）。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns（API 模式）

> API design principles and decision-making for 2025（2025 年 API 设计原则与决策逻辑）。
> **Learn to THINK, not copy fixed patterns（学习如何思考，而非机械复制固定模式）。**

## 🎯 Selective Reading Rule（选择性阅读规则）

**Read ONLY files relevant to the request（仅阅读与当前请求相关的文件）！** Check the content map, find what you need（查阅内容地图，找到所需章节）。

---

## 📑 Content Map（内容地图）

| File（文件） | Description（描述） | When to Read（阅读时机） |
| ---- | ---- | -------- |
| `api-style.md` | REST vs GraphQL vs tRPC decision tree（决策树） | Choosing API type（选择 API 类型时） |
| `rest.md` | Resource naming, HTTP methods, status codes（资源命名/HTTP 方法/状态码） | Designing REST API（设计 REST API 时） |
| `response.md` | Envelope pattern, error format, pagination（信封模式/错误格式/分页） | Response structure（确定响应结构时） |
| `graphql.md` | Schema design, when to use, security（模式设计/使用场景/安全性） | Considering GraphQL（考虑 GraphQL 时） |
| `trpc.md` | TypeScript monorepo, type safety（TS 单仓/类型安全） | TS fullstack projects（TS 全栈项目） |
| `versioning.md` | URI/Header/Query versioning（URI/请求头/查询参数版本控制） | API evolution planning（规划 API 演进） |
| `auth.md` | JWT, OAuth, Passkey, API Keys（认证方案） | Auth pattern selection（选择认证模式） |
| `rate-limiting.md` | Token bucket, sliding window（令牌桶/滑动窗口） | API protection（API 保护机制） |
| `documentation.md` | OpenAPI/Swagger best practices（文档规范） | Documentation（编写 API 文档） |
| `security-testing.md` | OWASP API Top 10, auth/authz testing（认证/授权测试） | Security audits（安全审计） |

---

## 🔗 Related Skills（相关技能）

| Need（需求） | Skill（技能） |
| ---- | ------------ |
| API implementation（API 落地实现） | `@[skills/backend-development]` |
| Data structure（数据库结构设计） | `@[skills/database-design]` |
| Security details（安全加固细节） | `@[skills/security-hardening]` |

---

## ✅ Decision Checklist（决策检查清单）

Before designing an API（设计 API 之前）：

- [ ] **Asked user about API consumers?（是否询问 API 消费者？）**
- [ ] **Chosen API style for THIS context?（是否为当前上下文选择 API 风格？）** (REST/GraphQL/tRPC)
- [ ] **Defined consistent response format?（是否定义统一响应格式？）**
- [ ] **Planned versioning strategy?（是否规划版本控制策略？）**
- [ ] **Considered authentication needs?（是否考虑认证需求？）**
- [ ] **Planned rate limiting?（是否规划频率限制？）**
- [ ] **Documentation approach defined?（是否定义文档方案？）**

---

## ❌ Anti-Patterns（反模式）

**DON'T（不要）：**

- Default to REST for everything（任何场景都默认 REST）。
- Use verbs in REST endpoints (`/getUsers`)（REST 端点使用动词）。
- Return inconsistent response formats（响应格式不一致）。
- Expose internal errors to clients（暴露内部错误）。
- Skip rate limiting（忽略频率限制）。

**DO（推荐做法）：**

- Choose API style based on context（根据上下文选择 API 风格）。
- Ask about client requirements（询问客户端需求）。
- Document thoroughly（编写详尽文档）。
- Use appropriate status codes（使用适当的 HTTP 状态码）。

---

## Script（运行脚本）

| Script（脚本） | Purpose（用途） | Command（命令） |
| ---- | ---- | ---- |
| `scripts/api_validator.py` | API endpoint validation（API 端点校验） | `python scripts/api_validator.py <project_path>`（项目路径） |

---
