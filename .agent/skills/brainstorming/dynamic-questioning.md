# 动态提问生成

> **原则：** 提问的目的不是为了收集数据，而是为了**揭示架构层面的后果**。
>
> 每一个提问都必须关联到一个具体的实现决策，且该决策会影响成本、复杂度或时间线。

---

## 🧠 核心原则

### 1. 提问揭示后果

一个好的问题不是问“您想要什么颜色？”，而是：

```markdown
❌ BAD: "What authentication method?"
✅ GOOD: "Should users sign up with email/password or social login?

   Impact:
   - Email/Pass → Need password reset, hashing, 2FA infrastructure
   - Social → OAuth providers, user profile mapping, less control

   Trade-off: Security vs. Development time vs. User friction"
```

### 2. 背景先行

首先要理解这个请求属于哪种**背景**：

| 背景 | 提问焦点 |
| ---- | -------- |
| **Greenfield（新项目）** | 基础设施决策：技术栈、托管方式、规模规划 |
| **Feature Addition（功能新增）** | 集成点、现有模式、破坏性变更的可能性 |
| **Refactor（重构）** | 为何重构？性能？可维护性？现有什么问题？ |
| **Debug（调试）** | 现象 → 根本原因 → 复现路径 |

### 3. 最小可行提问

**原则：** 每个问题都必须能消除实现路径上的一个分叉。

```
Before Question:
├── Path A: Do X (5 min)
├── Path B: Do Y (15 min)
└── Path C: Do Z (1 hour)

After Question:
└── Path Confirmed: Do X (5 min)
```

如果一个提问不能减少实现路径的选择范围 → **请删掉它**。

### 4. 生成数据而非假设

```markdown
❌ ASSUMPTION: "User probably wants Stripe for payments"
✅ QUESTION: "Which payment provider fits your needs?

   Stripe → Best documentation, 2.9% + $0.30, US-centric
   LemonSqueezy → Merchant of Record, 5% + $0.50, global taxes
   Paddle → Complex pricing, handles EU VAT, enterprise focus"
```

---

## 📋 提问生成算法

```
INPUT: User request + Context (greenfield/feature/refactor/debug)
│
├── STEP 1: Parse Request
│   ├── Extract domain (ecommerce, auth, realtime, cms, etc.)
│   ├── Extract features (explicit and implied)
│   └── Extract scale indicators (users, data volume, frequency)
│
├── STEP 2: Identify Decision Points
│   ├── What MUST be decided before coding? (blocking)
│   ├── What COULD be decided later? (deferable)
│   └── What has ARCHITECTURAL impact? (high-leverage)
│
├── STEP 3: Generate Questions (Priority Order)
│   ├── P0: Blocking decisions (cannot proceed without answer)
│   ├── P1: High-leverage (affects >30% of implementation)
│   ├── P2: Medium-leverage (affects specific features)
│   └── P3: Nice-to-have (edge cases, optimization)
│
└── STEP 4: Format Each Question
    ├── What: Clear question
    ├── Why: Impact on implementation
    ├── Options: Trade-offs (not just A vs B)
    └── Default: What happens if user doesn't answer
```

---

## 🎯 特定领域问题库

### 电子商务

| 提问 | 为什么这很重要 | 权衡方案 |
| ---- | -------------- | -------- |
| **是单商户还是多商户？** | 多商户 → 需要分佣逻辑、卖家工作台、分账支付 | +收入, -开发复杂度 |
| **是否需要库存跟踪？** | 需要库存表、预留逻辑、低库存警报 | +准确度, -开发时间 |
| **是数字产品还是实物产品？** | 数字 → 涉及下载链接, 无物流 | 实物 → 涉及物流 API（接口）, 快递跟踪 |
| **订阅制还是单次购买？** | 订阅 → 涉及循环计费、催收、按比例退款逻辑 | +长期收入, -开发复杂度 |

### 身份验证

| 提问 | 为什么这很重要 | 权衡方案 |
| ---- | -------------- | -------- |
| **是否需要社交登录？** | 引入 OAuth（授权协议）提供商 vs 编写密码重置等基础设施 | +UX（用户体验）, -自主控制权 |
| **是否需要基于角色的权限（RBAC）？** | 需要 RBAC 表、策略执行逻辑、管理员 UI | +安全性, -开发时间 |
| **是否需要双因素认证（2FA）？** | 涉及 TOTP/SMS（一次性口令/短信）基础设施、备份验证码、恢复流程 | +安全性, -用户注册损耗 |
| **是否需要邮件验证？** | 涉及验证令牌、邮件服务、重发逻辑 | +安全性, -注册流失率 |

### 实时通讯

| 提问 | 为什么这很重要 | 权衡方案 |
| ---- | -------------- | -------- |
| **采用 WebSocket 还是 Polling（轮询）？** | WebSocket → 涉及服务器扩展、连接管理 | Polling → 更简单，但延迟高 |
| **预期并发用户数？** | <100 → 单机即可, >1000 → 需要 Redis（内存数据库）发布/订阅, >10k → 需要专用基础架构 | +可扩展性, -开发复杂度 |
| **消息是否需要持久化？** | 涉及历史消息表、存储成本、分页查询 | +用户体验, -存储成本 |
| **是瞬时消息还是持久消息？** | 瞬时 → 仅存储于内存, 持久 → 发送前先入库 | +可靠性, -延迟增加 |

### 内容管理

| 提问 | 为什么这很重要 | 权衡方案 |
| ---- | -------------- | -------- |
| **采用富文本还是 Markdown？** | 富文本 → 涉及内容清洗、XSS 风险 | Markdown → 简单，无所见即所得（WYSIWYG） |
| **是否需要 草稿/发布 工作流？** | 涉及状态字段、定时任务、版本控制 | +内容管控, -开发复杂度 |
| **如何处理媒体文件？** | 涉及上传端点、存储、内容优化（裁剪/压缩） | +功能丰富, -开发时间 |
| **是否需要 Multi-language（多语言）？** | 涉及 i18n（国际化）表、翻译 UI、回退逻辑 | +触达范围, -开发复杂度 |

---

## 📐 动态提问模板

```markdown
Based on your request for [DOMAIN] [FEATURE]:

## 🔴 CRITICAL (Blocking Decisions)

### 1. **[DECISION POINT]**

**Question:** [Clear, specific question]

**Why This Matters:**
- [Explain architectural consequence]
- [Affects: cost / complexity / timeline / scale]

**Options:**
| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| A | [Advantage] | [Disadvantage] | [Use case] |
| B | [Advantage] | [Disadvantage] | [Use case] |

**If Not Specified:** [Default choice + rationale]

---

## 🟡 HIGH-LEVERAGE (Affects Implementation)

### 2. **[DECISION POINT]**
[Same format]

---

## 🟢 NICE-TO-HAVE (Edge Cases)

### 3. **[DECISION POINT]**
[Same format]
```

---

## 🔄 迭代式提问

### 第一阶段（3-5 个问题）

专注于 **阻塞性决策**。在获得答案前不要继续。

### 第二阶段（初步实现后）

随着模式的显现，询问：

- “这个功能隐含了 [X] 的需求。我们现在处理 [边缘情况] 还是先延后？”
- “我们目前使用了 [模式 A]。[功能 B] 是否也应遵循同样的模式？”

### 第三阶段（优化阶段）

当功能可以正常运行后：

- “[X] 处存在性能瓶颈。现在优化还是目前可以接受？”
- “[Y] 处是否需要为了可维护性进行重构，或者直接发布？”

---

## 🎭 示例：全流程提问生成

```
USER REQUEST: "Build an Instagram clone"

STEP 1: Parse
├── Domain: Social Media
├── Features: Photo sharing, engagement (likes/comments), user profiles
├── Implied: Feed, following, authentication
└── Scale: Potentially high (social apps go viral)

STEP 2: Decision Points
├── Blocking: Storage strategy, authentication method, feed type
├── High-leverage: Real-time notifications, data model complexity
└── Deferable: Analytics, advanced search, reels/video

STEP 3: Generate Questions (Priority)

P0 (Blocking):
1. Storage Strategy → Affects architecture, cost, speed
2. Feed Algorithm → Affects database queries, complexity
3. Auth Method → Affects dev time, UX, security

P1 (High-leverage):
4. Real-time Notifications → WebSocket vs polling
5. Media Processing → Client-side vs server-side optimization

P2 (Deferable):
6. Story/Reels → Major feature creep, defer to v2
7. DM/Chat → Separate subsystem, defer to v2

STEP 4: Format Output
```

---

## 📊 生成的输出示例

```
Based on your Instagram clone request:

## 🔴 CRITICAL DECISIONS (Cannot Proceed Without Answers)

### 1. **Photo Storage Strategy**

**Question:** Where will user photos be stored and served?

**Why This Matters:**
- Affects: Monthly hosting costs, page load speed, CDN complexity
- High-volume social apps: 1000 users × 10 photos × 2MB = 20GB storage

**Options:**
| Option | Cost | Speed | Complexity | Best For |
|--------|------|-------|------------|----------|
| **Cloudinary** | $89/mo (25GB) | Fast (CDN) | Low | MVP, rapid launch |
| **AWS S3 + CloudFront** | $0.023/GB | Fast (CDN) | Medium | Production, cost-optimized |
| **Supabase Storage** | Free tier 1GB | Medium | Low | Small scale, simple |
| **Local Storage** | Server cost | Slow | Low | Development only |

**If Not Specified:** Cloudinary (balanced for MVP)

---

### 2. **Feed Algorithm Choice**

**Question:** How should the main feed work?

**Why This Matters:**
- Affects: Database query complexity, caching strategy, development time
- Algorithmic feeds require ML infrastructure, ranking signals

**Options:**
| Option | Complexity | Database Impact | Best For |
|--------|------------|-----------------|----------|
| **Chronological** | Low | Simple query | Early stage, transparency |
| **Follow-Only** | Medium | JOIN with pagination | Most social apps |
| **Algorithmic** | High | Pre-computed feed tables | Instagram competitor |

**If Not Specified:** Follow-Only (balanced for social app)

---

### 3. **Authentication Approach**

**Question:** How do users sign up and login?

**Why This Matters:**
- Affects: Development time (2-5 hours), security posture, UX friction

**Options:**
| Option | Dev Time | Security | UX | Best For |
|--------|----------|----------|-----|----------|
| **Email/Password** | 4-5 hrs | High (if 2FA) | Medium | Full control needed |
| **Social Only** | 1-2 hrs | Provider-dependent | Smooth | B2C, rapid launch |
| **Magic Link** | 2-3 hrs | Medium | Very smooth | Security-focused |
| **Clerk/Auth0** | 1 hr | High | Smooth | Fastest to market |

**If Not Specified:** Clerk (fastest for MVP)

---

## 🟡 HIGH-LEVERAGE (Affects Architecture)

### 4. **Real-time Notifications**

**Question:** Do users need instant notifications for likes/comments?

**Why This Matters:**
- WebSocket adds infrastructure complexity (Redis pub/sub for scaling)
- Polling is simpler but higher latency

**Options:**
| Option | Complexity | Scale Cost | Best For |
|--------|------------|------------|----------|
| **WebSocket + Redis** | High | $10+/mo | >1000 concurrent users |
| **Polling (30s)** | Low | DB queries | <1000 users |
| **No Real-time** | None | None | MVP, validate first |

**If Not Specified:** Polling for MVP (defer WebSocket until validated)

---

## 🟢 NICE-TO-HAVE (Defer to v2)

### 5. **Video/Reels Support**
- Major complexity (video processing, streaming infrastructure)
- Recommendation: Launch with photos only, add video after validation

### 6. **Direct Messaging**
- Separate subsystem (chat infrastructure different from feed)
- Recommendation: Use Pusher/Stream for real-time or defer entirely

---

## 📋 Summary

| Decision | Recommendation | If Changed |
|----------|----------------|------------|
| Storage | Cloudinary | +3 hrs setup |
| Feed | Follow-only | +2 hrs query optimization |
| Auth | Clerk | -3 hrs dev time |
| Real-time | Polling | +5 hrs WebSocket setup |
| Video | Defer to v2 | N/A |
| DM | Defer to v2 | N/A |

**Total Estimated MVP Time:** 15-20 hours with recommendations above
```

---

## 🎯 原则复盘

1. **每一个提问 = 一个架构决策** → 提问不是为了填表格。
2. **展示权衡方案** → 让用户理解决策的后果。
3. **阻塞性决策优先** → 保证项目能够立即启动。
4. **提供默认值** → 即使用户暂无想法，我们也能依据最佳实践推进。
5. **领域感知** → 电商类提问 ≠ 认证类提问 ≠ 实时通讯类提问。
6. **迭代式演进** → 随着实现过程中模式的显现，再追加更细致的提问。
7. **与调试关联**: 当问题聚焦故障排查时，可把动态提问作为 `/debug` 的前置澄清步骤。
