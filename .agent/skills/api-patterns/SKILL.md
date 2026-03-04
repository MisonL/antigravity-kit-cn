---
name: api-patterns
description: API design principles and decision-making（API 设计原则与决策逻辑）。REST vs GraphQL vs tRPC selection（选择）、response formats（响应格式）、versioning（版本控制）、pagination（分页）。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns（API 模式）

> API design principles and decision-making for 2025（2025 年 API 设计原则与决策逻辑）。
> **Learn to THINK, not copy fixed patterns（学习如何思考，而非机械复制固定模式）。**

## 🎯 选择性阅读规则（Selective Reading Rule）

**仅阅读与当前请求相关的文件（Read ONLY files relevant to the request）！** 查阅内容地图并定位所需章节（Check the content map, find what you need）。

---

## 📑 内容地图（Content Map）

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

## 🔗 相关技能（Related Skills）

| Need（需求） | Skill（技能） |
| ---- | ------------ |
| API implementation（API 落地实现） | `@[skills/nodejs-best-practices]` |
| Data structure（数据库结构设计） | `@[skills/database-design]` |
| Security details（安全加固细节） | `@[skills/vulnerability-scanner]` |

---

## ✅ 决策检查清单（Decision Checklist）

设计 API 之前（Before designing an API）：

- [ ] **Asked user about API consumers?（是否询问 API 消费者？）**
- [ ] **Chosen API style for THIS context?（是否为当前上下文选择 API 风格？）** (REST/GraphQL/tRPC)
- [ ] **Defined consistent response format?（是否定义统一响应格式？）**
- [ ] **Planned versioning strategy?（是否规划版本控制策略？）**
- [ ] **Considered authentication needs?（是否考虑认证需求？）**
- [ ] **Planned rate limiting?（是否规划频率限制？）**
- [ ] **Documentation approach defined?（是否定义文档方案？）**

---

## ❌ 反模式（Anti-Patterns）

**不要（DON'T）：**

- 任何场景都默认 REST（Default to REST for everything）。
- REST 端点使用动词，如 `/getUsers`（Use verbs in REST endpoints）。
- 响应格式不一致（Return inconsistent response formats）。
- 向客户端暴露内部错误（Expose internal errors to clients）。
- 忽略频率限制（Skip rate limiting）。

**推荐做法（DO）：**

- 根据上下文选择 API 风格（Choose API style based on context）。
- 先询问客户端需求（Ask about client requirements）。
- 编写详尽文档（Document thoroughly）。
- 使用合适的 HTTP 状态码（Use appropriate status codes）。

---

## 运行脚本（Script）

| Script（脚本） | Purpose（用途） | Command（命令） |
| ---- | ---- | ---- |
| `scripts/api_validator.py` | API endpoint validation（API 端点校验） | `python scripts/api_validator.py <project_path>`（项目路径） |

---
