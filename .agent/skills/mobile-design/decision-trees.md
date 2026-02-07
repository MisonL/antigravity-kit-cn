# 移动端决策树参考指南 (Mobile Decision Trees)

> 框架选择、状态管理、存储策略以及基于上下文的决策方案。
> **这些是思维引导，而非简单的复制粘贴答案。**

---

## 1. 框架选择 (Framework Selection)

### 核心决策树

```
你正在构建什么？
        │
        ├── 需要绕过 App Store 审核进行 OTA 更新？
        │   │
        │   ├── 是 → React Native + Expo (最快迭代)
        │   └── 否 → 继续 ▼
        │
        ├── 需要跨平台一致的像素级自定义 UI？
        │   │
        │   ├── 是 → Flutter (自定义渲染引擎)
        │   └── 否 → 继续 ▼
        │
        └── 深度依赖底层原生特性 (ARKit, HealthKit)？
            │
            ├── 仅限 iOS → SwiftUI / UIKit
            ├── 仅限 Android → Kotlin + Jetpack Compose
            └── 两者都需要 → 考虑 KMP (Kotlin Multiplatform)
```

### 框架对比

| 因素          | React Native    | Flutter        | 原生 (Native) |
| ------------- | --------------- | -------------- | ------------- |
| **OTA 更新**  | ✅ 支持 (Expo)  | ❌ 不支持      | ❌ 不支持     |
| **学习曲线**  | 低 (Web 开发者) | 中             | 高            |
| **性能**      | 良好            | 卓越           | 最高          |
| **UI 一致性** | 平台原生感      | 跨平台完全一致 | 平台原生感    |

---

## 2. 状态管理选择 (State Management)

### React Native

- **简单应用**: Zustand 或 useState/Context。
- **后端驱动**: TanStack Query (React Query) + Zustand。
- **大厂/复杂项目**: Redux Toolkit + RTK Query。

### Flutter

- **初学者**: Provider。
- **现代/新项目**: Riverpod 2.0 (推荐)。
- **企业级**: BLoC (事件驱动)。

---

## 3. 存储策略选择 (Storage Strategy)

| 数据类型                  | 推荐存储                                             |
| ------------------------- | ---------------------------------------------------- |
| **敏感信息 (Token/密码)** | 🔒 安全存储 (iOS: Keychain, Android: EncryptedPrefs) |
| **用户偏好 (设置/主题)**  | 键值存储 (AsyncStorage / MMKV / SharedPreferences)   |
| **结构化数据**            | 数据库 (SQLite / Realm / WatermelonDB)               |
| **大型文件 (图片/文档)**  | 文件系统 (RN-FS / Expo-FileSystem)                   |

---

## 4. 离线策略选择 (Offline Strategy)

- **缓存优先 (Simple)**: 先看缓存，过期再取网络。
- **Stale-while-revalidate**: 先返回缓存内容提升感知速度，同时后台更新。
- **离线优先 (Complex)**: 本地数据库为唯一真理源，上线后自动同步队列。

---

## 5. 身份验证模式 (Authentication)

- **严禁**: 使用 AsyncStorage 存储明文 Token。
- **推荐**: 使用生物识别 (FaceID/指纹) 保护存储在 Keychain 中的加密 Token。

---

## 6. 决策检查清单 (Decision Checklist)

- [ ] 目标平台是否清晰？
- [ ] 框架选择是否基于上述树状逻辑？
- [ ] 每一个数据类型的存储策略是否符合安全规范？
- [ ] 离线需求是否已提前规划？

---

> **记住：** 这些决策树是用来辅助“思考”的，不是盲目遵循的规则。每一个项目都有其独特的约束条件。
