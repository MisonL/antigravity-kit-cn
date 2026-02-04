---
description: 框架选择、状态管理、存储策略与基于上下文的决策
---

# 移动端决策树 (Mobile Decision Trees)

> 框架选择、状态管理、存储策略和基于上下文的决策。
> **这些是思维指南，不是复制粘贴的答案。**

---

## 1. 框架选择 (Framework Selection)

### 主决策树

```
你要构建什么？
        │
        ├── 需要无需商店审核的 OTA 热更新吗？
        │   │
        │   ├── 是 (Yes) → React Native + Expo
        │   │         ├── Expo Go 用于开发
        │   │         ├── EAS Update 用于生产环境 OTA
        │   │         └── 最适合：快速迭代，Web 团队
        │   │
        │   └── 否 (No) → 继续 ▼
        │
        ├── 需要跨平台像素级完美的自定义 UI 吗？
        │   │
        │   ├── 是 (Yes) → Flutter
        │   │         ├── 自定义渲染引擎 (SKIA)
        │   │         ├── iOS + Android 只有一套 UI
        │   │         └── 最适合：品牌化强，视觉类应用
        │   │
        │   └── 否 (No) → 继续 ▼
        │
        ├── 有重度原生功能需求 (ARKit, HealthKit, 特定传感器)？
        │   │
        │   ├── 仅 iOS → SwiftUI / UIKit
        │   │              └── 最大化原生能力
        │   │
        │   ├── 仅 Android → Kotlin + Jetpack Compose
        │   │                  └── 最大化原生能力
        │   │
        │   └── 两者都有 → 考虑原生开发或混合开发
        │              └── Kotlin Multiplatform (KMP) 用于共享逻辑
        │
        ├── 现有 Web 团队 + TypeScript 代码库？
        │   │
        │   └── 是 (Yes) → React Native
        │             ├── React 开发者的熟悉范式
        │             ├── 与 Web 共享代码 (有限度)
        │             └── 庞大的生态系统
        │
        └── 企业级且有现成 Flutter 团队？
            │
            └── 是 (Yes) → Flutter
                      └── 利用现有专长
```

### 框架对比

| 因素          | React Native       | Flutter         | Native (Swift/Kotlin) |
| :------------ | :----------------- | :-------------- | :-------------------- |
| **OTA 更新**  | ✅ Expo / CodePush | ❌ 无           | ❌ 无                 |
| **学习曲线**  | 低 (React 开发者)  | 中              | 较高                  |
| **性能**      | 好 (New Arch)      | 优秀            | 最佳                  |
| **UI 一致性** | 平台原生组件       | 完全一致 (自绘) | 平台原生组件          |
| **包体积**    | 中等               | 较大            | 最小                  |
| **原生访问**  | 通过 Bridge/JSI    | 通过 Channels   | 直接                  |
| **热重载**    | ✅ Fast Refresh    | ✅ Hot Reload   | ✅ (Xcode 15+)        |

---

## 2. 状态管理选择

### React Native 状态决策

```
你的状态复杂度如何？
        │
        ├── 简单应用，少量页面，极少共享状态
        │   │
        │   └── Zustand (或仅用 useState/Context)
        │       ├── 极少样板代码
        │       ├── 易于理解
        │       └── 扩展性尚可
        │
        ├── 主要是服务器数据 (API 驱动)
        │   │
        │   └── TanStack Query (React Query) + Zustand
        │       ├── Query 管理服务器状态 (缓存/自动刷新)
        │       ├── Zustand 管理 UI 状态
        │       └── 最佳实践
        │
        ├── 复杂应用，功能繁多，多人协作
        │   │
        │   └── Redux Toolkit + RTK Query
        │       ├── 可预测，易调试
        │       ├── RTK Query 处理 API
        │       └── 适合大型团队
        │
        └── 需要原子化、细粒度的状态
            │
            └── Jotai
                ├── 原子化 (类似 Recoil)
                ├── 最小化重渲染
                └── 适合派生状态
```

---

## 3. 导航模式选择

```
有多少一级目的地？
        │
        ├── 2 个目的地
        │   └── 考虑: 顶部标签页 (Top Tabs) 或 简单栈 (Stack)
        │
        ├── 3-5 个目的地 (同等重要)
        │   └── ✅ 底部标签栏 (Tab Bar / Bottom Navigation)
        │       ├── 最常见模式
        │       ├── 易于发现
        │
        ├── 5 个以上目的地
        │   │
        │   ├── 都很重要 → 抽屉导航 (Drawer Navigation)
        │   │                   └── 隐藏但容纳多选项
        │   │
        │   └── 部分不重要 → 标签栏 + 抽屉 混合
        │
        └── 单一线性流程？
            └── 仅栈导航 (Stack Navigation)
                └── 引导页, 结账流程等
```

---

## 4. 存储策略选择

```
什么类型的数据？
        │
        ├── 敏感数据 (Token, 密码, 密钥)
        │   │
        │   └── ✅ 安全存储 (Secure Storage)
        │       ├── iOS: Keychain
        │       ├── Android: EncryptedSharedPreferences
        │       └── RN: expo-secure-store / react-native-keychain
        │
        ├── 用户偏好 (设置, 主题)
        │   │
        │   └── ✅ 键值存储 (Key-Value)
        │       ├── iOS: UserDefaults
        │       ├── Android: SharedPreferences
        │       └── RN: AsyncStorage / MMKV (推荐 MMKV)
        │
        ├── 结构化数据 (实体, 关系)
        │   │
        │   └── ✅ 数据库
        │       ├── SQLite (expo-sqlite, sqflite)
        │       ├── Realm (NoSQL, 响应式)
        │       └── WatermelonDB (海量数据)
        │
        ├── 大文件 (图片, 文档)
        │   │
        │   └── ✅ 文件系统
        │       ├── iOS: Documents / Caches 目录
        │       ├── Android: Internal/External 存储
        │       └── RN: react-native-fs / expo-file-system
        │
        └── 缓存的 API 数据
            │
            └── ✅ Query 库缓存
                ├── TanStack Query (RN)
                └── 自动失效管理
```

---

## 5. 离线策略选择

```
离线有多重要？
        │
        ├── 锦上添花 (能用就行)
        │   │
        │   └── 缓存上次数据 + 显示"已过期"
        │       ├── 简单实现
        │       ├── TanStack Query 配置 staleTime
        │       └── 显示"上次更新于..."
        │
        ├── 核心 (离线必须能用核心功能)
        │   │
        │   └── 离线优先架构 (Offline-first)
        │       ├── 本地数据库作为单一事实来源
        │       ├── 联网时同步到服务器
        │       ├── 冲突解决策略
        │       └── 操作队列 (Queue)
        │
        └── 实时关键 (协作, 聊天)
            │
            └── WebSocket + 本地队列
                ├── 乐观更新 (Optimistic updates)
                ├── 最终一致性
                └── 复杂的冲突处理
```

---

## 6. 认证模式选择

### Token 存储警告

```
❌ 绝不要 将 Token 存储在:
├── AsyncStorage (明文)
├── Redux/State (无法持久化或不安全)
├── 普通 Local Storage
└── 日志或调试输出中

✅ 始终 将 Token 存储在:
├── iOS: Keychain
├── Android: EncryptedSharedPreferences
├── Expo: SecureStore
├── 如果可用，加生物识别保护
```

---

## 7. 项目类型模板

### 电商应用 (E-Commerce)

```
推荐技术栈:
├── 框架: React Native + Expo (方便改价/活动 OTA)
├── 导航: Tab bar (首页, 搜索, 购物车, 账户)
├── 状态: TanStack Query (商品) + Zustand (购物车)
├── 存储: SecureStore (Auth) + SQLite (购物车缓存)
├── 离线: 缓存商品浏览，离线加购进入队列
└── 关键: 图片极致优化，支付流程安全
```

### 社交/内容应用

```
推荐技术栈:
├── 框架: React Native 或 Flutter
├── 导航: Tab bar (信息流, 搜索, 发布, 通知, 个人)
├── 状态: TanStack Query (信息流) + Zustand (UI)
├── 存储: SQLite (信息流缓存, 草稿箱)
├── 离线: 缓存浏览，发布进入后台队列
└── 关键: 无限滚动性能，媒体上传体验
```

---

## 8. 决策检查清单

### 开始任何项目之前

- [ ] **目标平台已定义？** (iOS/Android/Both)
- [ ] **基于标准选择了框架？**
- [ ] **状态管理方案已定？**
- [ ] **导航模式已选？**
- [ ] **各类数据的存储策略已定？**
- [ ] **离线需求已定义？**
- [ ] **认证流程已设计？**

---

> **记住:** 这些决策树是**思考**的向导，而不是盲从的规则。每个项目都有独特的约束。需求模糊时多问澄清问题，根据实际需求而不是默认设置来选择。
