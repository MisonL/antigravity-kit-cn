---
name: api-patterns
description: API 设计原则与决策逻辑。包含 REST vs GraphQL vs tRPC 选择、响应格式、版本控制与分页（pagination）。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API 模式（API Patterns）

> 针对 2025 年的 API 设计原则与决策逻辑。
> **学习如何思考（THINK），而非机械复制固定模式。**

## 🎯 选择性阅读规则（Selective Reading Rule）

**仅阅读与当前请求相关的文件！** 请查阅内容地图，找到你所需的章节。

---

## 📑 内容地图（Content Map）

| 文件 | 描述 | 阅读时机 |
| ---- | ---- | -------- |
| `api-style.md` | REST vs GraphQL vs tRPC 决策树 | 选择 API 类型时 |
| `rest.md` | 资源命名、HTTP（超文本传输协议）方法、状态码 | 设计 REST API 时 |
| `response.md` | 信封模式（Envelope pattern）、错误格式、分页（pagination） | 确定响应结构时 |
| `graphql.md` | Schema（模式）设计、使用场景、安全性 | 考虑使用 GraphQL 时 |
| `trpc.md` | TypeScript（TS） monorepo（单仓）架构、类型安全（type safety） | 处理 TS 全栈项目时 |
| `versioning.md` | URI（路径）/Header（请求头）/Query（查询参数）版本控制方案 | 规划 API 演进时 |
| `auth.md` | JWT（JSON Web Token）、OAuth（授权协议）、Passkey（通行密钥）、API Keys（API 密钥） | 选择认证模式时 |
| `rate-limiting.md` | Token bucket（令牌桶）、Sliding window（滑动窗口）算法 | 设计 API 保护机制时 |
| `documentation.md` | OpenAPI/Swagger（API 文档规范）最佳实践 | 编写 API 文档时 |
| `security-testing.md` | OWASP API Top 10（十大风险）、认证（authn）/授权（authz）测试 | 进行安全审计时 |

---

## 🔗 相关技能（Related Skills）

| 需求 | 技能（Skill） |
| ---- | ------------ |
| API 落地实现 | `@[skills/backend-development]` |
| 数据库结构设计 | `@[skills/database-design]` |
| 安全加固细节 | `@[skills/security-hardening]` |

---

## ✅ 决策检查清单（Decision Checklist）

在设计 API 之前：

- [ ] **是否已询问 API 的消费者是谁？**
- [ ] **是否已为当前上下文选择了合适的 API 风格？**（REST/GraphQL/tRPC）
- [ ] **是否定义了统一的响应格式？**
- [ ] **是否规划了版本控制策略？**
- [ ] **是否考虑了认证（Authentication）需求？**
- [ ] **是否规划了频率限制（Rate limiting）？**
- [ ] **是否定义了文档编写方案？**

---

## ❌ 反模式（Anti-Patterns）

**不要（Don't）：**

- 任何场景都默认使用 REST。
- 在 REST 端点中使用动词（例如 `/getUsers`）。
- 返回格式不统一的响应。
- 向客户端暴露内部代码错误。
- 忽略频率限制。

**推荐做法（Do）：**

- 根据上下文选择 API 风格。
- 询问客户端的具体需求。
- 编写详尽的文档。
- 使用适当的 HTTP 状态码。

---

## 运行脚本（Script）

| 脚本 | 用途 | 命令 |
| ---- | ---- | ---- |
| `scripts/api_validator.py` | API 端点校验 | `python scripts/api_validator.py <项目路径>` |

---
