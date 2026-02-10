# 移动端决策树

> 框架选择、状态管理、存储策略与上下文决策。  
> **这些是“思考指引”，不是可复制粘贴的答案。**

---

## 1. 框架选择

### 总决策树

```
你在构建什么？
        │
        ├── 需要 OTA 更新且不走应用商店审核？
        │   │
        │   ├── 是 → React Native + Expo
        │   │         ├── Expo Go 用于开发
        │   │         ├── EAS Update 用于生产 OTA
        │   │         └── 适合：快速迭代、Web 团队
        │   │
        │   └── 否 → 继续 ▼
        │
        ├── 需要跨平台像素级一致 UI？
        │   │
        │   ├── 是 → Flutter
        │   │         ├── 自定义渲染引擎
        │   │         ├── iOS + Android 同一 UI
        │   │         └── 适合：强品牌视觉型应用
        │   │
        │   └── 否 → 继续 ▼
        │
        ├── 强原生能力（ARKit、HealthKit、特定传感器）？
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
        │             ├── 与 Web 共享部分代码（有限）
        │             └── 生态成熟
        │
        └── 企业已有 Flutter 团队？
            │
            └── 是 → Flutter
                      └── 复用既有经验
```

### 框架对比

| 维度 | React Native | Flutter | Native（Swift/Kotlin） |
| --- | --- | --- | --- |
| **OTA Updates** | ✅ Expo | ❌ No | ❌ No |
| **学习曲线** | 低（React 开发者） | 中 | 更高 |
| **性能** | 好 | 极好 | 最佳 |
| **UI 一致性** | 平台原生 | 完全一致 | 平台原生 |
| **包体积** | 中 | 更大 | 最小 |
| **原生访问** | 通过桥接 | 通过通道 | 直接 |
| **热重载** | ✅ | ✅ | ✅（Xcode 15+） |

### 何时选择原生

```
选择原生当：
├── 必须极致性能（游戏、3D）
├── 深度系统集成
├── 平台特性是核心
├── 团队已有原生能力
├── 应用商店体验是核心
└── 长期维护优先

避免原生当：
├── 预算/时间有限
├── 需要快速迭代
├── 两端 UI 强一致
├── 团队偏 Web 技术栈
└── 跨平台优先
```

---

## 2. 状态管理选择

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
        │       └── 缓存/重拉优秀
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

### 状态管理反模式

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

## 3. 导航模式选择

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
        │   └── 次要入口 → Tab bar + drawer 混合
        │
        └── 单一线性流程？
            └── 仅 Stack Navigation
                └── 引导、结账等
```

### 按应用类型选择导航

| 应用类型 | 模式 | 原因 |
| --- | --- | --- |
| 社交（Instagram） | Tab bar | 频繁切换 |
| 电商 | Tab bar + stack | 类别作为 tab |
| 邮件（Gmail） | Drawer + 列表详情 | 文件夹多 |
| 设置 | 仅 Stack | 深层钻取 |
| 新手引导 | Stack 向导 | 线性流程 |
| 消息 | Tab（聊天）+ stack | 线程 |

---

## 4. 存储策略选择

```
是什么类型的数据？
        │
        ├── 敏感数据（token、密码、密钥）
        │   │
        │   └── ✅ 安全存储
        │       ├── iOS: Keychain
        │       ├── Android: EncryptedSharedPreferences
        │       └── RN: expo-secure-store / react-native-keychain
        │
        ├── 用户偏好（设置、主题）
        │   │
        │   └── ✅ 键值存储
        │       ├── iOS: UserDefaults
        │       ├── Android: SharedPreferences
        │       └── RN: AsyncStorage / MMKV
        │
        ├── 结构化数据（实体、关系）
        │   │
        │   └── ✅ 数据库
        │       ├── SQLite（expo-sqlite, sqflite）
        │       ├── Realm（NoSQL, reactive）
        │       └── WatermelonDB（大数据集）
        │
        ├── 大文件（图片、文档）
        │   │
        │   └── ✅ 文件系统
        │       ├── iOS: Documents / Caches 目录
        │       ├── Android: Internal/External 存储
        │       └── RN: react-native-fs / expo-file-system
        │
        └── 缓存的 API 数据
            │
            └── ✅ Query 库缓存
                ├── TanStack Query（RN）
                ├── Riverpod async（Flutter）
                └── 自动失效
```

### 存储对比

| 存储 | 速度 | 安全 | 容量 | 适用场景 |
| --- | --- | --- | --- | --- |
| Secure Storage | 中 | 🔒 高 | 小 | Token、密钥 |
| Key-Value | 快 | 低 | 中 | 设置 |
| SQLite | 快 | 低 | 大 | 结构化数据 |
| File System | 中 | 低 | 很大 | 媒体、文档 |
| Query Cache | 快 | 低 | 中 | API 响应 |

---

## 5. 离线策略选择

```
离线有多关键？
        │
        ├── 可有可无（尽量可用）
        │   │
        │   └── 缓存最近数据 + 显示过期
        │       ├── 实现简单
        │       ├── TanStack Query + staleTime
        │       └── 显示“最后更新”时间戳
        │
        ├── 必须离线（核心功能离线）
        │   │
        │   └── Offline-first 架构
        │       ├── 本地数据库为真源
        │       ├── 在线时与服务器同步
        │       ├── 冲突解决策略
        │       └── 操作队列后续同步
        │
        └── 实时关键（协作、聊天）
            │
            └── WebSocket + 本地队列
                ├── 乐观更新
                ├── 最终一致
                └── 复杂冲突处理
```

### 离线实现模式

```
1. CACHE-FIRST（简单）
   请求 → 查缓存 → 若过期再拉取 → 更新缓存

2. STALE-WHILE-REVALIDATE
   请求 → 先返缓存 → 后台更新 → 更新 UI

3. OFFLINE-FIRST（复杂）
   动作 → 写本地 DB → 排队同步 → 上线后同步

4. SYNC ENGINE
   使用：Firebase、Realm Sync、Supabase realtime
   自动处理冲突
```

---

## 6. 认证模式选择

```
需要哪种认证？
        │
        ├── 简单邮箱/密码
        │   │
        │   └── 基于 Token（JWT）
        │       ├── 安全存储 refresh token
        │       ├── access token 放内存
        │       └── 静默刷新流程
        │
        ├── 社交登录（Google、Apple 等）
        │   │
        │   └── OAuth 2.0 + PKCE
        │       ├── 使用平台 SDK
        │       ├── 深链回调
        │       └── iOS 必须支持 Apple Sign-In
        │
        ├── 企业/SSO
        │   │
        │   └── OIDC / SAML
        │       ├── Web view 或系统浏览器
        │       └── 正确处理重定向
        │
        └── 生物识别（FaceID、指纹）
            │
            └── 本地认证 + 安全 Token
                ├── 生物识别解锁已存 Token
                ├── 不能替代服务端认证
                └── 回退到 PIN/密码
```

### 认证 Token 存储

```
❌ 不要存 Token 于：
├── AsyncStorage（明文）
├── Redux/state（持久化不可靠）
├── Local storage 等价物
└── 日志或调试输出

✅ 应该存 Token 于：
├── iOS: Keychain
├── Android: EncryptedSharedPreferences
├── Expo: SecureStore
├── 可用时启用生物识别保护
```

---

## 7. 项目类型模板

### 电商应用

```
推荐技术栈：
├── Framework: React Native + Expo（便于价格 OTA）
├── Navigation: Tab bar（Home, Search, Cart, Account）
├── State: TanStack Query（商品）+ Zustand（购物车）
├── Storage: SecureStore（认证）+ SQLite（购物车缓存）
├── Offline: 缓存商品，队列化购物车操作
└── Auth: 邮箱/密码 + 社交 + Apple Pay

关键决策：
├── 商品图：懒加载，强缓存
├── 购物车：跨设备同步
├── 结账：安全、最少步骤
└── 深链：商品分享、营销
```

### 社交/内容应用

```
推荐技术栈：
├── Framework: React Native 或 Flutter
├── Navigation: Tab bar（Feed, Search, Create, Notifications, Profile）
├── State: TanStack Query（feed）+ Zustand（UI）
├── Storage: SQLite（feed 缓存、草稿）
├── Offline: 缓存 feed，队列化发帖
└── Auth: 社交登录优先，iOS 必须 Apple

关键决策：
├── Feed：无限滚动，列表项 memo
├── 媒体：上传队列、后台上传
├── 推送：深链到内容
└── 实时：WebSocket 用于通知
```

### 生产力/SaaS 应用

```
推荐技术栈：
├── Framework: Flutter（UI 一致）或 RN
├── Navigation: Drawer 或 Tab bar
├── State: Riverpod/BLoC 或 Redux Toolkit
├── Storage: SQLite（离线）+ SecureStore（认证）
├── Offline: 完整离线编辑、同步
└── Auth: 企业 SSO/OIDC

关键决策：
├── 数据同步：冲突解决策略
├── 协作：实时还是最终一致？
├── 文件：大文件处理
└── 企业：MDM、合规
```

---

## 8. 决策检查清单

### 开始任何项目之前

- [ ] 目标平台已定义（iOS/Android/双端）？
- [ ] 已根据标准选择框架？
- [ ] 状态管理方案已确定？
- [ ] 导航模式已选择？
- [ ] 各类数据的存储策略已明确？
- [ ] 离线需求已明确？
- [ ] 认证流程已设计？
- [ ] 深链从一开始就规划？

### 提问用户的问题

```
如果需求模糊，必须询问：

1. “是否需要 OTA 更新而不走应用商店审核？”
   → 影响框架选择（Expo = yes）

2. “iOS 和 Android 是否需要完全一致的 UI？”
   → 影响框架（Flutter = identical）

3. “离线需求是什么？”
   → 影响架构复杂度

4. “是否已有后端/认证系统？”
   → 影响认证与 API 方案

5. “设备类型？仅手机还是平板？”
   → 影响导航与布局

6. “企业还是消费级？”
   → 影响认证（SSO）、安全与合规
```

---

## 9. 反模式决策

### ❌ 决策反模式

| 反模式 | 为什么不好 | 更好的方案 |
| --- | --- | --- |
| **简单应用用 Redux** | 过度设计 | Zustand 或 context |
| **MVP 用原生** | 开发慢 | 跨平台 MVP |
| **3 个入口用 Drawer** | 导航隐藏 | Tab bar |
| **Token 用 AsyncStorage** | 不安全 | SecureStore |
| **不考虑离线** | 地铁断网就坏 | 从一开始规划 |
| **所有项目用同一栈** | 不匹配场景 | 逐项目评估 |

---

## 10. 快速参考

### 框架快选

```
需要 OTA？           → React Native + Expo
需要一致 UI？         → Flutter
要极致性能？          → Native
Web 团队？           → React Native
快速原型？           → Expo
```

### 状态快选

```
简单应用？          → Zustand / Provider
服务端为主？        → TanStack Query / Riverpod
企业级？            → Redux / BLoC
原子状态？          → Jotai
```

### 存储快选

```
密钥/Token？        → SecureStore / Keychain
设置？              → AsyncStorage / UserDefaults
结构化数据？        → SQLite
API 缓存？          → Query library
```

---

> **记住：** 这些树是思考指南，不是硬性规则。每个项目约束不同，需求模糊时先提问，再按真实需求做选择。
