---
name: mobile-design
description: Mobile-first design thinking and decision-making for iOS and Android apps. Touch interaction, performance patterns, platform conventions. Teaches principles, not fixed values. Use when building React Native, Flutter, or native mobile apps.
allowed-tools: Read, Glob, Grep, Bash
---

# 移动端设计系统 (Mobile Design System)

> **哲学 (Philosophy):** 触控优先。关注电池。尊重平台。具备离线能力。
> **核心原则 (Core Principle):** 移动端不是小型桌面端。思考移动端约束，询问平台选择。

---

## 🔧 运行时脚本 (Runtime Scripts)

**执行这些脚本进行验证 (不要阅读，直接运行)：**

| 脚本                      | 用途                                           | 用法                                            |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `scripts/mobile_audit.py` | Mobile UX & Touch Audit (移动端 UX 与触控审计) | `python scripts/mobile_audit.py <project_path>` |

---

## 🔴 强制：工作前先阅读参考文件！(MANDATORY: Read Reference Files Before Working!)

**⛔ 在阅读相关文件之前，不要开始开发：**

### 通用 (始终阅读) - Universal (Always Read)

| 文件                                                       | 内容                                                                                | 状态                  |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------- |
| **[mobile-design-thinking.md](mobile-design-thinking.md)** | **⚠️ 反背诵：强制思考，防止 AI 默认行为**                                           | **⬜ CRITICAL FIRST** |
| **[touch-psychology.md](touch-psychology.md)**             | **Fitts' Law (菲茨定律), gestures (手势), haptics (触觉反馈), thumb zone (拇指区)** | **⬜ CRITICAL**       |
| **[mobile-performance.md](mobile-performance.md)**         | **RN/Flutter 性能, 60fps, 内存**                                                    | **⬜ CRITICAL**       |
| **[mobile-backend.md](mobile-backend.md)**                 | **推送通知, 离线同步, 移动端 API**                                                  | **⬜ CRITICAL**       |
| **[mobile-testing.md](mobile-testing.md)**                 | **测试金字塔, E2E, 平台特定**                                                       | **⬜ CRITICAL**       |
| **[mobile-debugging.md](mobile-debugging.md)**             | **Native vs JS调试, Flipper, Logcat**                                               | **⬜ CRITICAL**       |
| [mobile-navigation.md](mobile-navigation.md)               | Tab/Stack/Drawer, deep linking (深度链接)                                           | ⬜ Read               |
| [mobile-typography.md](mobile-typography.md)               | System fonts (系统字体), Dynamic Type (动态字体), a11y (无障碍)                     | ⬜ Read               |
| [mobile-color-system.md](mobile-color-system.md)           | OLED, dark mode (暗色模式), battery-aware (电池感知)                                | ⬜ Read               |
| [decision-trees.md](decision-trees.md)                     | Framework/state/storage selection (框架/状态/存储选择)                              | ⬜ Read               |

> 🧠 **mobile-design-thinking.md is PRIORITY! (mobile-design-thinking.md 是优先级！)** 此文件确保 AI 进行思考，而不是使用死记硬背的模式。

### 平台特定 (根据目标阅读) - Platform-Specific (Read Based on Target)

| 平台               | 文件                                       | 内容                                                 | 何时阅读               |
| ------------------ | ------------------------------------------ | ---------------------------------------------------- | ---------------------- |
| **iOS**            | [platform-ios.md](platform-ios.md)         | Human Interface Guidelines, SF Pro, SwiftUI patterns | 为 iPhone/iPad 构建时  |
| **Android**        | [platform-android.md](platform-android.md) | Material Design 3, Roboto, Compose patterns          | 为 Android 构建时      |
| **Cross-Platform** | Both above (以上两者)                      | Platform divergence points (平台差异点)              | React Native / Flutter |

> 🔴 **如果为 iOS 构建 → 先读 platform-ios.md！**
> 🔴 **如果为 Android 构建 → 先读 platform-android.md！**
> 🔴 **如果跨平台 → 阅读两者并应用条件平台逻辑！**

---

## ⚠️ 关键：假设前先询问 (强制) - CRITICAL: ASK BEFORE ASSUMING (MANDATORY)

> **STOP! 如果用户的请求是开放式的，不要默认为你的喜好。**

### 如果未指定，你必须询问 (You MUST Ask If Not Specified):

| 方面                          | 询问                                                                     | 为什么             |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------ |
| **Platform (平台)**           | "iOS, Android, or both? (iOS, Android, 还是两者？)"                      | 影响每一个设计决策 |
| **Framework (框架)**          | "React Native, Flutter, or native? (React Native, Flutter, 还是原生？)"  | 决定模式和工具     |
| **Navigation (导航)**         | "Tab bar, drawer, or stack-based? (标签栏, 抽屉, 还是基于堆栈？)"        | 核心 UX 决策       |
| **State (状态)**              | "What state management? (Zustand/Redux/Riverpod/BLoC?) (什么状态管理？)" | 架构基础           |
| **Offline (离线)**            | "Does this need to work offline? (这需要离线工作吗？)"                   | 影响数据策略       |
| **Target devices (目标设备)** | "Phone only, or tablet support? (仅手机，还是支持平板？)"                | 布局复杂性         |

### ⛔ AI 移动端反模式 (禁止列表) - AI MOBILE ANTI-PATTERNS (YASAK LİSTESİ)

> 🚫 **这是一些必须避免的 AI 默认倾向！**

#### 性能之罪 (Performance Sins)

| ❌ NEVER DO (绝不)                                       | 为什么错                                                                              | ✅ ALWAYS DO (总是)                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **ScrollView for long lists (长列表用 ScrollView)**      | Renders ALL items, memory explodes (渲染所有项，内存爆炸)                             | Use `FlatList` / `FlashList` / `ListView.builder`                    |
| **Inline renderItem function (内联 renderItem 函数)**    | New function every render, all items re-render (每次渲染都创建新函数，所有项重新渲染) | `useCallback` + `React.memo`                                         |
| **Missing keyExtractor (缺失 keyExtractor)**             | Index-based keys cause bugs on reorder (基于索引的键导致重新排序时的 Bug)             | Unique, stable ID from data (来自数据的唯一、稳定 ID)                |
| **Skip getItemLayout (跳过 getItemLayout)**              | Async layout = janky scroll (异步布局 = 滚动卡顿)                                     | 当项有固定高度时提供                                                 |
| **setState() everywhere (到处都是 setState())**          | Unnecessary widget rebuilds (不必要的 Widget 重建)                                    | Targeted state (针对性状态), `const` constructors (`const` 构造函数) |
| **Native driver: false**                                 | Animations blocked by JS thread (动画被 JS 线程阻塞)                                  | `useNativeDriver: true` always (总是)                                |
| **console.log in production (生产环境中的 console.log)** | Blocks JS thread severely (严重阻塞 JS 线程)                                          | Remove before release build (发布构建前移除)                         |
| **Skip React.memo/const (跳过 React.memo/const)**        | Every item re-renders on any change (任何更改都会导致所有项重新渲染)                  | Memoize list items ALWAYS (总是记忆列表项)                           |

#### 触控/UX 之罪 (Touch/UX Sins)

| ❌ NEVER DO (绝不)                                 | 为什么错                                                           | ✅ ALWAYS DO (总是)                                      |
| -------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| **Touch target < 44px (触控目标 < 44px)**          | Impossible to tap accurately, frustrating (无法准确点击，令人沮丧) | Minimum 44pt (iOS) / 48dp (Android)                      |
| **Spacing < 8px between targets (目标间距 < 8px)** | Accidental taps on neighbors (误触邻居)                            | Minimum 8-12px gap (最小 8-12px 间隙)                    |
| **Gesture-only interactions (仅手势交互)**         | Motor impaired users excluded (运动障碍用户被排除)                 | Always provide button alternative (总是提供按钮替代方案) |
| **No loading state (无加载状态)**                  | User thinks app crashed (用户认为应用崩溃)                         | ALWAYS show loading feedback (总是显示加载反馈)          |
| **No error state (无错误状态)**                    | User stuck, no recovery path (用户卡住，无恢复路径)                | Show error with retry option (显示带有重试选项的错误)    |
| **No offline handling (无离线处理)**               | Crash/block when network lost (网络丢失时崩溃/阻塞)                | Graceful degradation, cached data (优雅降级，缓存数据)   |
| **Ignore platform conventions (忽略平台惯例)**     | Users confused, muscle memory broken (用户困惑，肌肉记忆破坏)      | iOS 感觉像 iOS, Android 感觉像 Android                   |

#### 安全之罪 (Security Sins)

| ❌ NEVER DO (绝不)                                | 为什么错                                                                  | ✅ ALWAYS DO (总是)                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Token in AsyncStorage (AsyncStorage 中的令牌)** | Easily accessible, stolen on rooted device (易于访问，在 Root 设备上被盗) | `SecureStore` / `Keychain` / `EncryptedSharedPreferences`  |
| **Hardcode API keys (硬编码 API 密钥)**           | Reverse engineered from APK/IPA (从 APK/IPA 逆向工程)                     | Environment variables, secure storage (环境变量，安全存储) |
| **Skip SSL pinning (跳过 SSL 钉扎)**              | MITM attacks possible (可能发生中间人攻击)                                | Pin certificates in production (生产环境中钉扎证书)        |
| **Log sensitive data (记录敏感数据)**             | Logs can be extracted (日志可被提取)                                      | Never log tokens, passwords, PII (从不记录令牌、密码、PII) |

#### 架构之罪 (Architecture Sins)

| ❌ NEVER DO (绝不)                                    | 为什么错                                                      | ✅ ALWAYS DO (总是)                                              |
| ----------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Business logic in UI (UI 中的业务逻辑)**            | Untestable, unmaintainable (不可测试，不可维护)               | Service layer separation (服务层分离)                            |
| **Global state for everything (一切皆全局状态)**      | Unnecessary re-renders, complexity (不必要的重新渲染，复杂性) | Local state default, lift when needed (默认局部状态，需要时提升) |
| **Deep linking as afterthought (事后才考虑深度链接)** | Notifications, shares broken (通知，分享损坏)                 | Plan deep links from day one (从第一天开始规划深度链接)          |
| **Skip dispose/cleanup (跳过处置/清理)**              | Memory leaks, zombie listeners (内存泄漏，僵尸监听器)         | Clean up subscriptions, timers (清理订阅，定时器)                |

---

## 📱 平台决策矩阵 (Platform Decision Matrix)

### 何时统一与分歧 (When to Unify vs Diverge)

```
                    UNIFY (统一) (same on both/两者相同)          DIVERGE (分歧) (platform-specific/平台特定)
                    ───────────────────                     ──────────────────────────
Business Logic      ✅ Always (总是)                          -
Data Layer          ✅ Always (总是)                          -
Core Features       ✅ Always (总是)                          -

Navigation          -                                       ✅ iOS: edge swipe (边缘滑动), Android: back button (返回按钮)
Gestures            -                                       ✅ Platform-native feel (平台原生感觉)
Icons               -                                       ✅ SF Symbols vs Material Icons
Date Pickers        -                                       ✅ Native pickers feel right (原生选择器感觉正确)
Modals/Sheets       -                                       ✅ iOS: bottom sheet vs Android: dialog
Typography          -                                       ✅ SF Pro vs Roboto (or custom/或自定义)
Error Dialogs       -                                       ✅ Platform conventions for alerts (警报的平台惯例)
```

### 快速参考：平台默认值 (Quick Reference: Platform Defaults)

| 元素                                | iOS                                | Android                                        |
| ----------------------------------- | ---------------------------------- | ---------------------------------------------- |
| **Primary Font (主要字体)**         | SF Pro / SF Compact                | Roboto                                         |
| **Min Touch Target (最小触控目标)** | 44pt × 44pt                        | 48dp × 48dp                                    |
| **Back Navigation (返回导航)**      | Edge swipe left (左边缘滑动)       | System back button/gesture (系统返回按钮/手势) |
| **Bottom Tab Icons (底部标签图标)** | SF Symbols                         | Material Symbols                               |
| **Action Sheet (动作表)**           | UIActionSheet from bottom (从底部) | Bottom Sheet / Dialog                          |
| **Progress (进度)**                 | Spinner (旋转器)                   | Linear progress (线性进度) (Material)          |
| **Pull to Refresh (下拉刷新)**      | Native UIRefreshControl            | SwipeRefreshLayout                             |

---

## 🧠 移动端 UX 心理学 (快速参考) - Mobile UX Psychology (Quick Reference)

### 触控的菲茨定律 (Fitts' Law for Touch)

```
Desktop: Cursor is precise (光标精确) (1px)
Mobile:  Finger is imprecise (手指不精确) (~7mm contact area/接触面积)

→ Touch targets MUST be 44-48px minimum (触控目标必须最小 44-48px)
→ Important actions in THUMB ZONE (重要动作在拇指区) (bottom of screen/屏幕底部)
→ Destructive actions AWAY from easy reach (破坏性动作远离易触达区域)
```

### 拇指区 (单手使用) - Thumb Zone (One-Handed Usage)

```
┌─────────────────────────────┐
│      HARD TO REACH          │ ← Navigation, menu, back (难触达：导航，菜单，返回)
│        (stretch)            │   (伸展)
├─────────────────────────────┤
│      OK TO REACH            │ ← Secondary actions (可触达：次要动作)
│       (natural)             │   (自然)
├─────────────────────────────┤
│      EASY TO REACH          │ ← PRIMARY CTAs, tab bar (易触达：主要 CTA，标签栏)
│    (thumb's natural arc)    │ ← Main content interaction (主内容交互)
│      (拇指自然弧度)          │
└─────────────────────────────┘
        [  HOME  ]
```

### 移动端特定认知负荷 (Mobile-Specific Cognitive Load)

| 桌面端                          | 移动端差异                                          |
| ------------------------------- | --------------------------------------------------- |
| Multiple windows (多窗口)       | ONE task at a time (一次一个任务)                   |
| Keyboard shortcuts (键盘快捷键) | Touch gestures (触控手势)                           |
| Hover states (悬停状态)         | NO hover (无悬停) (tap or nothing/点击或无)         |
| Large viewport (大视口)         | Limited space, scroll vertical (有限空间，垂直滚动) |
| Stable attention (稳定注意力)   | Interrupted constantly (不断被打断)                 |

有关深潜：[touch-psychology.md](touch-psychology.md)

---

## ⚡ 性能原则 (快速参考) - Performance Principles (Quick Reference)

### React Native 关键规则

```typescript
// ✅ CORRECT: Memoized renderItem + React.memo wrapper (正确的：记忆化 renderItem + React.memo 包装器)
const ListItem = React.memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

const renderItem = useCallback(
  ({ item }: { item: Item }) => <ListItem item={item} />,
  []
);

// ✅ CORRECT: FlatList with all optimizations (正确的：具有所有优化的 FlatList)
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}  // Stable ID, NOT index (稳定 ID，不是索引)
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Flutter 关键规则

```dart
// ✅ CORRECT: const constructors prevent rebuilds (正确的：const 构造函数防止重建)
class MyWidget extends StatelessWidget {
  const MyWidget({super.key}); // CONST!

  @override
  Widget build(BuildContext context) {
    return const Column( // CONST!
      children: [
        Text('Static content'),
        MyConstantWidget(),
      ],
    );
  }
}

// ✅ CORRECT: Targeted state with ValueListenableBuilder (正确的：使用 ValueListenableBuilder 的针对性状态)
ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) => Text('$value'),
  child: const ExpensiveWidget(), // Won't rebuild! (不会重建！)
)
```

### 动画性能 (Animation Performance)

```
GPU-accelerated (FAST/快):     CPU-bound (SLOW/慢):
├── transform               ├── width, height
├── opacity                 ├── top, left, right, bottom
└── (use these ONLY/仅使用这些) ├── margin, padding
                            └── (AVOID animating these/避免动画化这些)
```

有关完整指南：[mobile-performance.md](mobile-performance.md)

---

## 📝 检查点 (任何移动端工作前强制) - CHECKPOINT (MANDATORY Before Any Mobile Work)

> **在编写任何移动端代码之前，你必须完成此检查点：**

```
🧠 CHECKPOINT:

Platform:   [ iOS / Android / Both ]
Framework:  [ React Native / Flutter / SwiftUI / Kotlin ]
Files Read: [ List the skill files you've read ]

3 Principles I Will Apply (我将应用的 3 个原则):
1. _______________
2. _______________
3. _______________

Anti-Patterns I Will Avoid (我将避免的反模式):
1. _______________
2. _______________
```

**示例:**

```
🧠 CHECKPOINT:

Platform:   iOS + Android (Cross-platform)
Framework:  React Native + Expo
Files Read: touch-psychology.md, mobile-performance.md, platform-ios.md, platform-android.md

3 Principles I Will Apply (我将应用的 3 个原则):
1. FlatList with React.memo + useCallback for all lists
2. 48px touch targets, thumb zone for primary CTAs
3. Platform-specific navigation (edge swipe iOS, back button Android)

Anti-Patterns I Will Avoid (我将避免的反模式):
1. ScrollView for lists → FlatList
2. Inline renderItem → Memoized
3. AsyncStorage for tokens → SecureStore
```

> 🔴 **无法填写检查点？ → 返回并阅读技能文件。**

---

## 🔧 框架决策树 (Framework Decision Tree)

```
WHAT ARE YOU BUILDING? (你在构建什么？)
        │
        ├── Need OTA updates + rapid iteration + web team (需要 OTA 更新 + 快速迭代 + Web 团队)
        │   └── ✅ React Native + Expo
        │
        ├── Need pixel-perfect custom UI + performance critical (需要像素级完美自定义 UI + 性能关键)
        │   └── ✅ Flutter
        │
        ├── Deep native features + single platform focus (深度原生功能 + 单一平台聚焦)
        │   ├── iOS only → SwiftUI
        │   └── Android only → Kotlin + Jetpack Compose
        │
        ├── Existing RN codebase + new features (现有 RN 代码库 + 新功能)
        │   └── ✅ React Native (bare workflow)
        │
        └── Enterprise + existing Flutter codebase (企业级 + 现有 Flutter 代码库)
            └── ✅ Flutter
```

有关完整决策树：[decision-trees.md](decision-trees.md)

---

## 📋 开发前检查清单 (Pre-Development Checklist)

### 开始任何移动端项目之前

- [ ] **Platform confirmed? (平台已确认？)** (iOS / Android / Both)
- [ ] **Framework chosen? (框架已选择？)** (RN / Flutter / Native)
- [ ] **Navigation pattern decided? (导航模式已决定？)** (Tabs / Stack / Drawer)
- [ ] **State management selected? (状态管理已选择？)** (Zustand / Redux / Riverpod / BLoC)
- [ ] **Offline requirements known? (离线需求已知？)**
- [ ] **Deep linking planned from day one? (深度链接从第一天开始规划？)**
- [ ] **Target devices defined? (目标设备已定义？)** (Phone / Tablet / Both)

### 每个屏幕之前

- [ ] **Touch targets ≥ 44-48px? (触控目标 ≥ 44-48px？)**
- [ ] **Primary CTA in thumb zone? (主要 CTA 在拇指区？)**
- [ ] **Loading state exists? (存在加载状态？)**
- [ ] **Error state with retry exists? (存在带有重试的错误状态？)**
- [ ] **Offline handling considered? (已考虑离线处理？)**
- [ ] **Platform conventions followed? (遵循平台惯例？)**

### 发布之前

- [ ] **console.log removed? (console.log 已移除？)**
- [ ] **SecureStore for sensitive data? (敏感数据使用 SecureStore？)**
- [ ] **SSL pinning enabled? (SSL 钉扎已启用？)**
- [ ] **Lists optimized (memo, keyExtractor)? (列表已优化？)**
- [ ] **Memory cleanup on unmount? (卸载时清理内存？)**
- [ ] **Tested on low-end devices? (已在低端设备上测试？)**
- [ ] **Accessibility labels on all interactive elements? (所有交互元素上的无障碍标签？)**

---

## 📚 参考文件 (Reference Files)

有关特定领域的更深入指导：

| 文件                                                   | 何时使用                                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [mobile-design-thinking.md](mobile-design-thinking.md) | **FIRST! Anti-memorization, forces context-based thinking (第一！反背诵，强制基于上下文的思考)** |
| [touch-psychology.md](touch-psychology.md)             | Understanding touch interaction, Fitts' Law, gesture design (理解触控交互，菲茨定律，手势设计)   |
| [mobile-performance.md](mobile-performance.md)         | Optimizing RN/Flutter, 60fps, memory/battery (优化 RN/Flutter，60fps，内存/电池)                 |
| [platform-ios.md](platform-ios.md)                     | iOS-specific design, HIG compliance (iOS 特定设计，HIG 合规)                                     |
| [platform-android.md](platform-android.md)             | Android-specific design, Material Design 3 (Android 特定设计，Material Design 3)                 |
| [mobile-navigation.md](mobile-navigation.md)           | Navigation patterns, deep linking (导航模式，深度链接)                                           |
| [mobile-typography.md](mobile-typography.md)           | Type scale, system fonts, accessibility (字体比例，系统字体，无障碍)                             |
| [mobile-color-system.md](mobile-color-system.md)       | OLED optimization, dark mode, battery (OLED 优化，暗色模式，电池)                                |
| [decision-trees.md](decision-trees.md)                 | Framework, state, storage decisions (框架，状态，存储决策)                                       |

---

> **记住：** 移动用户是不耐烦的、被干扰的，并且在小屏幕上使用不精确的手指。**Design for the WORST conditions (为最坏的情况设计):** bad network (网络差), one hand (单手), bright sun (强烈的阳光), low battery (低电量). If it works there, it works everywhere (如果它在那里行得通，它在任何地方都行得通).
