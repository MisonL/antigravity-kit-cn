# 移动端决策树（Mobile Decision Trees）

> 框架选择、状态管理、存储策略与上下文决策。
> **这些是“思考指引”，不是可复制粘贴的答案。**

---

## 1. 框架选择（Framework Selection）

### 总决策树（Master Decision Tree）

```
你在做什么类型的产品？
        │
        ├── 需要 OTA 更新且不走应用商店审核？
        │   │
        │   ├── 是 → React Native + Expo
        │   │         ├── Expo Go 供开发调试
        │   │         ├── EAS Update 生产 OTA
        │   │         └── 适合：快速迭代、Web 团队
        │   │
        │   └── 否 → 继续 ▼
        │
        ├── 需要跨平台像素级一致 UI？
        │   │
        │   ├── 是 → Flutter
        │   │         ├── 自定义渲染引擎
        │   │         ├── iOS + Android 同一 UI
        │   │         └── 适合：强品牌视觉型 App
        │   │
        │   └── 否 → 继续 ▼
        │
        ├── 强原生能力（ARKit/HealthKit/特定传感器）？
        │   │
        │   ├── 仅 iOS → SwiftUI / UIKit
        │   │              └── 原生能力最大化
        │   │
        │   ├── 仅 Android → Kotlin + Jetpack Compose
        │   │                  └── 原生能力最大化
        │   │
        │   └── 两端都要 → 考虑原生 + 共享逻辑
        │              └── Kotlin Multiplatform 共享逻辑
        │
        ├── 已有 Web 团队 + TypeScript 代码库？
        │   │
        │   └── 是 → React Native
        │             ├── React 开发者上手快
        │             ├── 可与 Web 共享部分代码
        │             └── 生态成熟
        │
        └── 企业已有 Flutter 团队？
            │
            └── 是 → Flutter
                      └── 复用既有经验
```

### 框架对比（Framework Comparison）

| 维度（Factor） | React Native | Flutter | Native（Swift/Kotlin） |
|---------------|-------------|---------|-------------------------|
| **OTA Updates** | ✅ Expo | ❌ No | ❌ No |
| **学习曲线** | 低（React 开发者友好） | 中 | 高 |
| **性能** | 好 | 很好 | 最佳 |
| **UI 一致性** | 平台原生风格 | 跨平台一致 | 平台原生风格 |
| **包体积** | 中 | 更大 | 最小 |
| **原生访问** | Bridge | Channel | 直接 |
| **热更新/热重载** | ✅ | ✅ | ✅（Xcode 15+） |

### 何时选择原生（When to Choose Native）

```
选择原生当：
├── 必须极致性能（游戏、3D）
├── 深度系统集成
├── 平台特性是核心卖点
├── 团队已有原生能力
├── 应用商店体验是核心
└── 长期维护优先

避免原生当：
├── 预算/时间紧
├── 需要快速迭代
├── 两端 UI 强一致
├── 团队偏 Web 技术栈
└── 跨平台优先
```

---

## 2. 状态管理选择（State Management Selection）

### React Native 状态决策

```
你的状态复杂度如何？
        │
        ├── 简单 App，屏幕少，共享状态少
        │   │
        │   └── Zustand（或 useState/Context）
        │       ├── 样板少
        │       ├── 易理解
        │       └── 可扩展到中等规模
        │
        ├── 主要是服务器数据（API 驱动）
        │   │
        │   └── TanStack Query（React Query）+ Zustand
        │       ├── Query 负责 server state
        │       ├── Zustand 负责 UI state
        │       └── 缓存/重拉做得好
        │
        ├── 功能复杂、模块多
        │   │
        │   └── Redux Toolkit + RTK Query
        │       ├── 可预测、易调试
        │       ├── RTK Query 管 API
        │       └── 适合大团队协作
        │
        └── 需要原子级细粒度状态
            │
            └── Jotai
                ├── 原子状态（类似 Recoil）
                ├── 降低重渲染
                └── 适合衍生状态
```

### Flutter 状态决策

```
你的状态复杂度如何？
        │
        ├── 简单 App，或处于学习 Flutter
        │   │
        │   └── Provider（或 setState）
        │       ├── 官方方案，简单
        │       ├── Flutter 内置习惯
        │       └── 适合小型项目
        │
        ├── 现代、类型安全、可测试
        │   │
        │   └── Riverpod 2.0
        │       ├── 编译期安全
        │       ├── 支持代码生成
        │       ├── 适合中大型项目
        │       └── 新项目推荐
        │
        ├── 企业级，需要严谨模式
        │   │
        │   └── BLoC
        │       ├── Event → State 模式
        │       ├── 很易测试
        │       ├── 样板较多
        │       └── 适合大团队
        │
        └── 快速原型
            │
            └── GetX（谨慎使用）
                ├── 上手快
                ├── 约束较少
                └── 大型项目易混乱
```

### 状态管理反模式（State Management Anti-Patterns）

```
❌ 不要：
├── 所有状态都放全局
├── 一个项目混用多套方案
├── 把 server state 放在 local state
├── 不做状态归一化
├── 过度使用 Context（重渲染严重）
└── 把导航状态塞进业务状态

✅ 应该：
├── Server state → Query 类库
├── UI state → 先局部、再上提
├── 只在需要时上提状态
├── 项目只选一套方案
└── 状态贴近使用位置
```

---

## 3. 导航模式选择（Navigation Pattern Selection）

```
顶层入口有几个？
        │
        ├── 2 个入口
        │   └── 可能用 Top tabs 或简单 Stack
        │
        ├── 3-5 个入口（同等重要）
        │   └── ✅ Tab Bar / Bottom Navigation
        │       ├── 最常见模式
        │       └── 可发现性强
        │
        ├── 5+ 个入口
        │   │
        │   ├── 都重要 → Drawer Navigation
        │   │             └── 入口多但隐藏
        │   │
        │   └── 有些不重要 → Tab + Drawer 混合
        │
        └── 单一线性流程？
            └── 仅 Stack Navigation
                └── Onboarding、Checkout 等
```

### 按 App 类型选择导航（Navigation by App Type）

| App 类型 | 模式 | 原因 |
|----------|------|------|
| 社交（Instagram） | Tab bar | 高频切换 |
| 电商 | Tab bar + stack | 分类为 Tab |
| 邮箱（Gmail） | Drawer + list-detail | 文件夹多 |
| 设置 | Stack only | 深层级 |
| 引导流程 | Stack wizard | 线性流程 |
| IM/聊天 | Tab（会话）+ stack | 线程内深入 |

---

## 4. 存储策略选择（Storage Strategy Selection）

```
数据类型是什么？
        │
        ├── 敏感数据（token、密码、密钥）
        │   │
        │   └── ✅ 安全存储（Secure Storage）
        │       ├── iOS：Keychain
        │       ├── Android：EncryptedSharedPreferences
        │       └── RN：expo-secure-store / react-native-keychain
        │
        ├── 用户偏好（设置、主题）
        │   │
        │   └── ✅ Key-Value 存储
        │       ├── iOS：UserDefaults
        │       ├── Android：SharedPreferences
        │       └── RN：AsyncStorage / MMKV
        │
        ├── 结构化数据（实体/关系）
        │   │
        │   └── ✅ 数据库
        │       ├── SQLite（expo-sqlite, sqflite）
        │       ├── Realm（NoSQL, reactive）
        │       └── WatermelonDB（大数据集）
        │
        ├── 大文件（图片、文档）
        │   │
        │   └── ✅ 文件系统
        │       ├── iOS：Documents / Caches
        │       ├── Android：Internal/External storage
        │       └── RN：react-native-fs / expo-file-system
        │
        └── API 缓存数据
            │
            └── ✅ Query 库缓存
                ├── TanStack Query（RN）
                ├── Riverpod async（Flutter）
                └── 自动失效管理
```

### 存储对比（Storage Comparison）

| 存储（Storage） | 速度（Speed） | 安全（Security） | 容量（Capacity） | 场景（Use Case） |
|----------------|--------------|------------------|------------------|-----------------|
| Secure Storage | 中 | 🔒 高 | 小 | token、密钥 |
| Key-Value | 快 | 低 | 中 | 设置偏好 |
| SQLite | 快 | 低 | 大 | 结构化数据 |
| File System | 中 | 低 | 很大 | 媒体、文档 |
| Query Cache | 快 | 低 | 中 | API 响应 |

---

## 5. 离线策略选择（Offline Strategy Selection）

```
离线有多关键？
        │
        ├── 可有可无（尽量能用）
        │   │
        │   └── 缓存上次数据 + 标记过期
        │       ├── 实现简单
        │       ├── TanStack Query + staleTime
        │       └── 展示“最后更新时间”
        │
        ├── 关键（核心功能必须离线）
        │   │
        │   └── Offline-first 架构
        │       ├── 本地数据库是事实源（source of truth）
        │       ├── 联网时同步服务器
        │       ├── 冲突解决策略
        │       └── 操作入队，稍后同步
        │
        └── 实时关键（协作、聊天）
            │
            └── WebSocket + 本地队列
                ├── Optimistic updates
                ├── 最终一致性
                └── 冲突处理更复杂
```

### 离线实现模式（Offline Implementation Patterns）

```
1. CACHE-FIRST（简单）
   Request → 查缓存 → 过期则拉取 → 更新缓存

2. STALE-WHILE-REVALIDATE
   Request → 返回缓存 → 后台更新 → 更新 UI

3. OFFLINE-FIRST（复杂）
   Action → 写本地 DB → 入队同步 → 联网后同步

4. SYNC ENGINE
   Use: Firebase, Realm Sync, Supabase realtime
   自动处理冲突
```

---

## 6. 认证模式选择（Authentication Pattern Selection）

```
需要哪种认证？
        │
        ├── 简单邮箱/密码
        │   │
        │   └── Token-based（JWT）
        │       ├── Refresh token 安全存储
        │       ├── Access token 放内存
        │       └── 静默刷新
        │
        ├── 社交登录（Google/Apple 等）
        │   │
        │   └── OAuth 2.0 + PKCE
        │       ├── 使用平台 SDK
        │       ├── Deep link 回调
        │       └── iOS 必须支持 Apple Sign-In
        │
        ├── 企业级 SSO
        │   │
        │   └── OIDC / SAML
        │       ├── WebView 或系统浏览器
        │       └── 正确处理重定向
        │
        └── 生物识别（FaceID / 指纹）
            │
            └── 本地验证 + 安全 token
                ├── 通过生物识别解锁 token
                ├── 不能替代服务端认证
                └── 兜底 PIN/密码
```

### Token 存储（Auth Token Storage）

```
❌ 绝不存 token 于：
├── AsyncStorage（明文）
├── Redux/state（不可控持久化）
├── Local storage 等价物
└── Logs 或 debug 输出

✅ 必须存 token 于：
├── iOS：Keychain
├── Android：EncryptedSharedPreferences
├── Expo：SecureStore
├── 可用时开启生物识别保护
```

---

## 7. 项目类型模板（Project Type Templates）

### 电商 App（E-Commerce App）

```
推荐栈：
├── Framework：React Native + Expo（便于 OTA）
├── Navigation：Tab bar（Home, Search, Cart, Account）
├── State：TanStack Query（商品）+ Zustand（购物车）
├── Storage：SecureStore（auth）+ SQLite（购物车缓存）
├── Offline：缓存商品 + 购物车操作入队
└── Auth：邮箱/密码 + 社交登录 + Apple Pay

关键决策：
├── 商品图：懒加载 + 强缓存
├── 购物车：跨设备同步
├── 结算：安全且步骤最少
└── 深链：商品分享、营销落地
```

### 社交/内容 App（Social/Content App）

```
推荐栈：
├── Framework：React Native 或 Flutter
├── Navigation：Tab bar（Feed, Search, Create, Notifications, Profile）
├── State：TanStack Query（feed）+ Zustand（UI）
├── Storage：SQLite（feed 缓存、草稿）
├── Offline：缓存 feed + 发布队列
└── Auth：社交登录为主，iOS 要求 Apple

关键决策：
├── Feed：无限滚动 + 列表项 memo
├── Media：上传队列 + 后台上传
├── Push：深链到内容
└── Real-time：WebSocket 通知
```

### 生产力/SaaS App（Productivity/SaaS App）

```
推荐栈：
├── Framework：Flutter（一致 UI）或 RN
├── Navigation：Drawer 或 Tab bar
├── State：Riverpod/BLoC 或 Redux Toolkit
├── Storage：SQLite（离线）+ SecureStore（auth）
├── Offline：完整离线编辑 + 同步
└── Auth：企业 SSO/OIDC

关键决策：
├── 数据同步：冲突解决策略
├── 协作：实时还是最终一致？
├── 文件：大文件处理
└── 企业：MDM、合规性
```

---

## 8. 决策检查清单（Decision Checklist）

### 开始任意项目之前（Before Starting ANY Project）

- [ ] 目标平台已明确（iOS/Android/双端）。
- [ ] 框架已按标准选定。
- [ ] 状态管理方案已确定。
- [ ] 导航模式已选择。
- [ ] 各数据类型的存储策略明确。
- [ ] 离线需求已定义。
- [ ] 认证流程已设计。
- [ ] Deep linking 已从一开始规划。

### 向用户确认的问题（Questions to Ask User）

```
当需求不清晰时，必须询问：

1. “是否需要 OTA 更新且不走商店审核？”
   → 影响框架选择（Expo = Yes）

2. “iOS 与 Android 是否需要完全一致 UI？”
   → 影响框架选择（Flutter = Yes）

3. “离线需求到什么程度？”
   → 影响架构复杂度

4. “是否已有后端/认证体系？”
   → 影响 auth 与 API 方案

5. “目标设备是手机还是平板？”
   → 影响导航与布局

6. “面向企业还是消费者？”
   → 影响 SSO/安全/合规
```

---

## 9. 反模式决策（Anti-Pattern Decisions）

### ❌ 决策反模式

| 反模式（Anti-Pattern） | 为什么不好（Why It's Bad） | 更好做法（Better Approach） |
|------------------------|----------------------------|-----------------------------|
| **小项目用 Redux** | 过度复杂 | Zustand 或 Context |
| **MVP 就用原生** | 开发慢 | 先跨平台 MVP |
| **3 个入口用 Drawer** | 导航隐藏 | Tab bar |
| **AsyncStorage 存 token** | 不安全 | SecureStore |
| **不考虑离线** | 地铁/弱网直接坏 | 从一开始规划 |
| **所有项目用同一栈** | 不匹配上下文 | 每次评估 |

---

## 10. 速查（Quick Reference）

### 框架速选（Framework Quick Pick）

```
需要 OTA？          → React Native + Expo
UI 必须一致？       → Flutter
极致性能？          → Native
Web 团队？          → React Native
快速原型？          → Expo
```

### 状态速选（State Quick Pick）

```
简单 App？          → Zustand / Provider
Server-heavy？      → TanStack Query / Riverpod
企业级？            → Redux / BLoC
原子状态？          → Jotai
```

### 存储速选（Storage Quick Pick）

```
Secrets？           → SecureStore / Keychain
Settings？          → AsyncStorage / UserDefaults
Structured data？   → SQLite
API cache？         → Query library
```

---

> **记住（Remember）**：这些决策树是“思考路线图”，不是死规则。每个项目都有独特约束；当需求含糊时必须补问澄清，再基于实际需求做选择。
