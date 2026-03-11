---
name: nodejs-best-practices
description: Node.js 开发原则与决策方法。覆盖框架选型、异步模式、安全与架构设计。强调思考，而非照抄。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Node.js 最佳实践

> 面向 2025 的 Node.js 开发原则与决策方法。  
> **学习如何思考，不要只记代码套路。**

---

## ⚠️ 本技能使用方式

本技能教授的是**决策原则**，不是固定代码模板。

- 需求不明确时，先向用户确认偏好
- 根据上下文（Context）选择框架与模式
- 不要每次都默认同一套方案

---

## 1. 框架选型（2025）

### 决策树

```
你要构建什么？
│
├── Edge/Serverless（边缘/无服务器，Cloudflare、Vercel）
│   └── Hono（零依赖、冷启动极快）
│
├── 高性能 API
│   └── Fastify（通常比 Express 快 2-3 倍）
│
├── 企业协作/团队熟悉度优先
│   └── NestJS（结构化、DI、装饰器）
│
├── 传统/稳定/生态最大化
│   └── Express（成熟、middleware 最多）
│
└── 前后端一体
    └── Next.js API Routes 或 tRPC
```

### 对比原则

| 维度 | Hono | Fastify | Express |
|------|------|---------|---------|
| **适用场景** | Edge、serverless | 性能优先 | 传统、学习 |
| **冷启动** | 最快 | 快 | 中等 |
| **生态** | 成长中 | 较好 | 最大 |
| **TypeScript** | 原生支持 | 优秀 | 良好 |
| **学习曲线** | 低 | 中 | 低 |

### 选型前必须询问：
1. 部署目标是什么？
2. 冷启动时间是否关键？
3. 团队是否有既有经验？
4. 是否存在需要维护的遗留代码？

---

## 2. 运行时考量（2025）

### 原生 TypeScript

```
Node.js 22+: --experimental-strip-types
├── 可直接运行 .ts 文件
├── 简单项目可免构建步骤
└── 适用：脚本、简单 API
```

### 模块系统决策

```
ESM（import/export）
├── 现代标准
├── 更好的 tree-shaking
├── 异步模块加载
└── 适用：新项目

CommonJS（require）
├── 遗留兼容性更好
├── 对部分 npm 包支持更成熟
└── 适用：既有代码库、特定边界场景
```

### Runtime 选择

| Runtime | 适用场景 |
|---------|----------|
| **Node.js** | 通用场景、生态最大 |
| **Bun** | 性能优先、内置 bundler |
| **Deno** | 安全优先、内置 TypeScript |

---

## 3. 架构原则

### 分层结构概念

```
请求流（Request Flow）:
│
├── Controller/Route 层
│   ├── 处理 HTTP 细节
│   ├── 在边界做输入校验
│   └── 调用 service 层
│
├── Service 层
│   ├── 承载业务逻辑
│   ├── 与框架解耦
│   └── 调用 repository 层
│
└── Repository 层
    ├── 仅处理数据访问
    ├── 数据库查询
    └── ORM 交互
```

### 为什么重要
- **可测性（Testability）：** 可独立 mock 每一层
- **灵活性（Flexibility）：** 更换数据库不影响业务层
- **清晰性（Clarity）：** 每层职责单一

### 何时简化
- 小型脚本 → 单文件可接受
- 原型验证 → 可降低结构复杂度
- 始终追问：“这个项目会继续增长吗？”

---

## 4. 错误处理原则

### 集中式错误处理

```
Pattern:
├── 定义自定义错误类
├── 各层都可 throw
├── 在顶层统一 catch（middleware）
└── 输出一致的响应格式
```

### 错误响应哲学

```
Client gets:
├── 合理的 HTTP 状态码
├── 可程序化处理的错误码
├── 对用户友好的提示
└── 不暴露内部细节（安全要求）

Logs get:
├── 完整堆栈信息
├── 请求上下文
├── 用户 ID（如适用）
└── 时间戳
```

### 状态码选择

| 场景 | 状态码 | 说明 |
|------|--------|------|
| Bad input | 400 | 客户端输入无效 |
| No auth | 401 | 缺少或无效凭据 |
| No permission | 403 | 已认证但无权限 |
| Not found | 404 | 资源不存在 |
| Conflict | 409 | 重复或状态冲突 |
| Validation | 422 | schema 合法但业务规则失败 |
| Server error | 500 | 服务端责任，完整记录日志 |

---

## 5. 异步模式原则

### 各模式使用时机

| 模式 | 适用场景 |
|------|----------|
| `async/await` | 串行异步操作 |
| `Promise.all` | 可并行且互不依赖 |
| `Promise.allSettled` | 并行且允许部分失败 |
| `Promise.race` | 超时控制或“先返回者胜出” |

### Event Loop 认知

```
I/O-bound（异步有帮助）:
├── 数据库查询
├── HTTP 请求
├── 文件系统
└── 网络操作

CPU-bound（异步无帮助）:
├── 加密计算
├── 图像处理
├── 复杂计算
└── → 使用 worker threads 或外部任务卸载
```

### 避免阻塞 Event Loop

- 生产环境避免使用同步方法（如 `fs.readFileSync`）
- CPU 密集任务必须卸载
- 大数据处理优先使用 streaming

---

## 6. 校验原则

### 在边界做校验

```
校验位置：
├── API 入口（request body/params）
├── 数据库操作之前
├── 外部数据（API 响应、文件上传）
└── 环境变量（启动时）
```

### 校验库选型

| 库 | 适用场景 |
|----|----------|
| **Zod** | TypeScript 优先、类型推断友好 |
| **Valibot** | 包体积更小（tree-shakeable） |
| **ArkType** | 性能敏感场景 |
| **Yup** | 既有 React Form 生态 |

### 校验哲学

- Fail fast：尽早校验、尽早失败
- Be specific：错误信息必须明确
- Don't trust：即使“内部数据”也不能默认可信

---

## 7. 安全原则

### 安全检查清单（不是代码模板）

- [ ] **Input validation（输入校验）**：所有输入已校验
- [ ] **Parameterized queries（参数化查询）**：SQL 禁止字符串拼接
- [ ] **Password hashing（密码哈希）**：使用 bcrypt 或 argon2
- [ ] **JWT verification（JWT 校验）**：必须校验签名与过期时间
- [ ] **Rate limiting（限流）**：具备防滥用机制
- [ ] **Security headers（安全响应头）**：使用 Helmet.js 或同等方案
- [ ] **HTTPS**：生产环境全链路启用
- [ ] **CORS**：配置正确
- [ ] **Secrets（密钥）**：仅使用环境变量管理
- [ ] **Dependencies（依赖）**：定期审计

### 安全思维

```
Trust nothing（默认不信任）:
├── Query params（查询参数）→ 校验
├── Request body（请求体）→ 校验
├── Headers（请求头）→ 校验
├── Cookies → 校验
├── File uploads（文件上传）→ 扫描
└── External APIs（外部 API）→ 校验响应
```

---

## 8. 测试原则

### 测试策略选择

| 类型 | 目的 | 工具 |
|------|------|------|
| **Unit（单元测试）** | 业务逻辑 | node:test, Vitest |
| **Integration（集成测试）** | API 端点 | Supertest |
| **E2E（端到端）** | 完整流程 | Playwright |

### 测试优先级

1. **关键路径**：鉴权、支付、核心业务
2. **边界场景**：空输入、边界值
3. **错误处理**：失败时系统如何表现
4. **不值得测**：框架内部代码、过于简单的 getter

### 内置测试运行器（Node.js 22+）

```
node --test src/**/*.test.ts
├── 无需额外依赖
├── 覆盖率报告可用
└── 支持 watch mode（监听模式）
```

---

## 10. 需要避免的反模式

### ❌ 不要这样做：
- 新 Edge 项目默认用 Express（优先考虑 Hono）
- 在生产代码中使用同步方法
- 在 controller 中堆业务逻辑
- 跳过输入校验
- 硬编码 secrets
- 不校验就信任外部数据
- 用 CPU 重任务阻塞 event loop（事件循环）

### ✅ 推荐做法：
- 基于上下文选择框架
- 需求不清晰先询问用户偏好
- 可增长项目采用分层架构
- 对所有输入做校验
- secrets 使用环境变量管理
- 优化前先做 profile（性能分析）

---

## 11. 决策检查清单

开始实现前：

- [ ] **是否询问了用户的技术栈偏好？**
- [ ] **是否为当前上下文选了合适框架？**（而非默认）
- [ ] **是否考虑了部署目标？**
- [ ] **是否规划了错误处理策略？**
- [ ] **是否识别了校验边界点？**
- [ ] **是否评估了安全要求？**

---

> **牢记：** Node.js 最佳实践的核心是“决策能力”，不是“背模板”。每个项目都应基于其真实需求重新判断。
