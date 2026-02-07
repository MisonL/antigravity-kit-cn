---
name: mobile-design
description: 面向 iOS 与 Android 的移动优先设计思维与决策方法。覆盖触控交互、性能模式与平台规范。强调原则，不给固定模板。适用于 React Native、Flutter 或原生移动应用开发。
allowed-tools: Read, Glob, Grep, Bash
---

# 移动端设计系统

> **理念（Philosophy）：** 触控优先、关注电量、尊重平台、支持离线。  
> **核心原则（Core Principle）：** 移动端不是缩小版桌面端。请按移动约束思考，并先确认平台选择。

---

## 🔧 运行时脚本

**执行以下脚本进行验证（不要阅读脚本内容，直接运行）：**

| 脚本 | 用途 | 用法 |
|------|------|------|
| `scripts/mobile_audit.py` | 移动端 UX 与触控审计 | `python scripts/mobile_audit.py <project_path>` |

---

## 🔴 强制：开始工作前先阅读参考文件

**⛔ 在读完相关文件前，不要开始开发。**

### 通用文件（始终必读）

| 文件 | 内容 | 状态 |
|------|------|------|
| **[mobile-design-thinking.md](mobile-design-thinking.md)** | **⚠️ 反记忆化：强制思考，避免 AI 默认套路** | **⬜ CRITICAL FIRST（最高优先）** |
| **[touch-psychology.md](touch-psychology.md)** | **Fitts' Law（费茨定律）、手势、触觉反馈、拇指区** | **⬜ CRITICAL（关键）** |
| **[mobile-performance.md](mobile-performance.md)** | **RN/Flutter 性能、60fps、内存** | **⬜ CRITICAL（关键）** |
| **[mobile-backend.md](mobile-backend.md)** | **推送通知、离线同步、移动端 API** | **⬜ CRITICAL（关键）** |
| **[mobile-testing.md](mobile-testing.md)** | **测试金字塔、E2E、平台差异** | **⬜ CRITICAL（关键）** |
| **[mobile-debugging.md](mobile-debugging.md)** | **原生 vs JS 调试、Flipper、Logcat** | **⬜ CRITICAL（关键）** |
| [mobile-navigation.md](mobile-navigation.md) | Tab/Stack/Drawer、深链路 | ⬜ Read（阅读） |
| [mobile-typography.md](mobile-typography.md) | 系统字体、Dynamic Type、a11y | ⬜ Read（阅读） |
| [mobile-color-system.md](mobile-color-system.md) | OLED、深色模式、电量意识 | ⬜ Read（阅读） |
| [decision-trees.md](decision-trees.md) | 框架/状态/存储选型 | ⬜ Read（阅读） |

> 🧠 **mobile-design-thinking.md 是最高优先级。** 该文件保证 AI 基于上下文思考，而不是套记忆模板。

### 平台专项文件（按目标平台阅读）

| 平台 | 文件 | 内容 | 阅读时机 |
|------|------|------|---------|
| **iOS** | [platform-ios.md](platform-ios.md) | Human Interface Guidelines（人机界面指南）、SF Pro、SwiftUI 模式 | iPhone/iPad 项目 |
| **Android** | [platform-android.md](platform-android.md) | Material Design 3、Roboto、Compose 模式 | Android 项目 |
| **跨平台** | 上述两份 | 平台差异点 | React Native / Flutter |

> 🔴 **做 iOS → 先读 platform-ios.md**  
> 🔴 **做 Android → 先读 platform-android.md**  
> 🔴 **做跨平台 → 两份都读，并应用条件化平台逻辑**

---

## ⚠️ 强制：先问再假设

> **停止！如果用户需求是开放式的，不要默认你常用的方案。**

### 未明确时必须询问：

| 维度 | 提问 | 原因 |
|------|------|------|
| **平台（Platform）** | "iOS、Android，还是双端？" | 影响所有设计决策 |
| **框架（Framework）** | "React Native、Flutter，还是原生？" | 决定实现模式与工具链 |
| **导航（Navigation）** | "Tab、Drawer，还是 Stack 导航？" | 核心 UX 架构决策 |
| **状态（State）** | "状态管理用什么？（Zustand/Redux/Riverpod/BLoC）" | 架构基础 |
| **离线（Offline）** | "是否需要离线可用？" | 决定数据策略 |
| **目标设备（Target Devices）** | "仅手机，还是也要支持平板？" | 影响布局复杂度 |

### ⛔ 移动端 AI 反模式清单

> 🚫 **以下是 AI 常见默认错误，必须避免。**

#### 性能类禁忌

| ❌ 禁止 | 错误原因 | ✅ 必做 |
|--------|----------|--------|
| **长列表用 ScrollView** | 一次渲染所有项，内存暴涨 | 用 `FlatList` / `FlashList` / `ListView.builder` |
| **renderItem 内联函数** | 每次渲染创建新函数，列表全量重渲染 | `useCallback` + `React.memo` |
| **缺少 keyExtractor** | 用索引做 key，重排时易错 | 使用稳定唯一 ID |
| **不写 getItemLayout** | 异步测量导致滚动抖动 | 固定高度项必须提供 |
| **到处 setState()** | 引发不必要重建 | 精准状态管理 + `const` 构造 |
| **原生驱动（Native driver）: false** | 动画受 JS 线程阻塞 | 一律 `useNativeDriver: true` |
| **生产环境保留 console.log** | 严重阻塞 JS 线程 | 发布前清理日志 |
| **不做 React.memo/const** | 任意变化触发全量重渲染 | 列表项默认做 memo |

#### 触控/UX 禁忌

| ❌ 禁止 | 错误原因 | ✅ 必做 |
|--------|----------|--------|
| **点击区 < 44px** | 难以准确点击，挫败感高 | 最小 44pt（iOS）/48dp（Android） |
| **目标间距 < 8px** | 易误触相邻元素 | 保持 8-12px 间距 |
| **仅提供手势交互** | 运动能力受限用户无法操作 | 始终提供按钮备选 |
| **无加载态** | 用户误以为应用卡死 | 必须给出加载反馈 |
| **无错误态** | 用户无恢复路径 | 显示错误并提供重试 |
| **无离线处理** | 断网即崩溃/卡死 | 优雅降级 + 本地缓存 |
| **忽视平台习惯** | 用户肌肉记忆被破坏 | iOS 像 iOS，Android 像 Android |

#### 安全类禁忌

| ❌ 禁止 | 错误原因 | ✅ 必做 |
|--------|----------|--------|
| **Token（令牌）放 AsyncStorage** | root 后易被窃取 | `SecureStore` / `Keychain` / `EncryptedSharedPreferences` |
| **硬编码 API Key** | APK/IPA 可逆向提取 | 用环境变量 + 安全存储 |
| **跳过 SSL Pinning（证书绑定）** | 易受 MITM 攻击 | 生产环境启用证书绑定 |
| **日志输出敏感数据** | 日志可被导出分析 | 禁止记录 token/password/PII（个人敏感信息） |

#### 架构类禁忌

| ❌ 禁止 | 错误原因 | ✅ 必做 |
|--------|----------|--------|
| **业务逻辑写在 UI 层** | 难测试、难维护 | 分离 service（服务）层 |
| **所有状态都放全局** | 重渲染增多、复杂度暴涨 | 默认局部状态，必要时再提升 |
| **把深链（deep linking）当补丁** | 通知分享场景会断裂 | 从第一天规划深链（deep links） |
| **不做 dispose/cleanup（清理）** | 内存泄漏、僵尸监听 | 清理订阅与计时器 |

---

## 📱 平台决策矩阵

### 何时统一，何时分化

```
                    统一（两端一致）              分化（平台特有）
                    ─────────────────             ─────────────────
业务逻辑            ✅ 始终统一                   -
数据层              ✅ 始终统一                   -
核心功能            ✅ 始终统一                   -

导航                -                             ✅ iOS：边缘滑返，Android：返回键
手势                -                             ✅ 平台原生手感
图标                -                             ✅ SF Symbols vs Material Icons
日期选择            -                             ✅ 原生选择器更贴合
弹窗/底部面板         -                             ✅ iOS：底部面板；Android：对话框
字体                -                             ✅ SF Pro vs Roboto（或自定义）
错误弹窗            -                             ✅ 遵循平台提示规范
```

### 快速参考：平台默认值

| 元素 | iOS | Android |
|------|-----|---------|
| **主字体（Primary Font）** | SF Pro / SF Compact | Roboto |
| **最小触控目标（Min Touch Target）** | 44pt × 44pt | 48dp × 48dp |
| **返回导航（Back Navigation）** | 左缘滑返 | 系统返回手势/按键 |
| **底部 Tab 图标（Bottom Tab Icons）** | SF Symbols | Material Symbols |
| **操作表（Action Sheet）** | 自底部 UIActionSheet | Bottom Sheet / Dialog |
| **进度表现（Progress）** | Spinner | 线性进度（Material） |
| **下拉刷新（Pull to Refresh）** | UIRefreshControl | SwipeRefreshLayout |

---

## 🧠 移动端 UX 心理学（速查）

### 触控版 Fitts' Law（费茨定律）

```
桌面端：鼠标准确（1px）
移动端：手指不精确（约 7mm 接触面）

→ 触控目标最小 44-48px
→ 重要操作放在拇指区（屏幕下部）
→ 破坏性操作远离易触区域
```

### 拇指舒适区（单手使用）

拇指舒适区（Thumb Zone）划分如下：

```
┌─────────────────────────────┐
│        难以触达             │ ← 导航、菜单、返回
│        （伸展）             │
├─────────────────────────────┤
│        可触达               │ ← 次要操作
│       （自然）              │
├─────────────────────────────┤
│        易触达               │ ← 主要 CTA、底部 Tab
│   （拇指自然弧线）           │ ← 主内容交互
└─────────────────────────────┘
        [  HOME  ]
```

### 移动端认知负荷差异

| 桌面端 | 移动端差异 |
|--------|------------|
| 多窗口并行 | 通常一次只处理一个任务 |
| 键盘快捷键 | 触控与手势 |
| 悬停（Hover）状态 | 无悬停（点即触发） |
| 大视口 | 空间受限、以纵向滚动为主 |
| 注意力稳定 | 高频被打断 |

深入阅读： [touch-psychology.md](touch-psychology.md)

---

## ⚡ 性能原则（速查）

### React Native 关键规则

```typescript
// ✅ 正确：使用 memoized renderItem + React.memo 包装
const ListItem = React.memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

const renderItem = useCallback(
  ({ item }: { item: Item }) => <ListItem item={item} />,
  []
);

// ✅ 正确：使用完整优化的 FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}  // 稳定 ID，避免使用索引
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
// ✅ 正确：const 构造函数避免重建
class MyWidget extends StatelessWidget {
  const MyWidget({super.key}); // CONST!

  @override
  Widget build(BuildContext context) {
    return const Column( // CONST！
      children: [
        Text('静态内容'),
        MyConstantWidget(),
      ],
    );
  }
}

// ✅ 正确：用 ValueListenableBuilder 做局部状态
ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) => Text('$value'),
  child: const ExpensiveWidget(), // 不会重建！
)
```

### 动画性能

```
GPU 加速（快）：               CPU 受限（慢）：
├── transform              ├── width, height
├── opacity                ├── top, left, right, bottom
└──（只使用这些）             ├── margin, padding
                           └──（避免对这些做动画）
```

完整指南： [mobile-performance.md](mobile-performance.md)

---

## 📝 检查点（开始移动端工作前强制执行）

> **在写任何移动端代码前，必须填写此检查点：**

```
🧠 CHECKPOINT（检查点）:

平台：    [ iOS / Android / 双端 ]
框架：    [ React Native / Flutter / SwiftUI / Kotlin ]
已读文件：[ 列出已阅读的技能文件 ]

我将应用的 3 条原则：
1. _______________
2. _______________
3. _______________

我将避免的反模式：
1. _______________
2. _______________
```

**示例：**
```
🧠 CHECKPOINT（检查点）:

平台：    iOS + Android（跨平台）
框架：    React Native + Expo
已读文件：touch-psychology.md, mobile-performance.md, platform-ios.md, platform-android.md

我将应用的 3 条原则：
1. 所有列表使用 FlatList + React.memo + useCallback
2. 触控目标 48px，主要 CTA 放在拇指区
3. 平台特有导航（iOS 边缘滑返，Android 返回键）

我将避免的反模式：
1. 列表用 ScrollView → 改用 FlatList
2. renderItem 内联 → 改为 memoized
3. token 用 AsyncStorage → 改用 SecureStore
```

> 🔴 **如果填不出检查点内容：回去先读技能文件。**

---

## 🔧 框架决策树

```
你在构建什么？
        │
        ├── 需要 OTA 更新 + 快速迭代 + Web 团队
        │   └── ✅ React Native + Expo
        │
        ├── 需要像素级自定义 UI + 性能关键
        │   └── ✅ Flutter
        │
        ├── 深度原生能力 + 单平台聚焦
        │   ├── 仅 iOS → SwiftUI
        │   └── 仅 Android → Kotlin + Jetpack Compose
        │
        ├── 已有 RN 代码库 + 新功能扩展
        │   └── ✅ React Native（bare workflow，裸工作流）
        │
        └── 企业级需求 + 已有 Flutter 代码库
            └── ✅ Flutter
```

完整决策树： [decision-trees.md](decision-trees.md)

---

## 📋 开发前检查清单

### 开始任何移动端项目前

- [ ] **平台已确认？**（iOS / Android / 双端）
- [ ] **框架已确定？**（RN / Flutter / 原生）
- [ ] **导航模式已确定？**（Tab / Stack / Drawer）
- [ ] **状态管理已选型？**（Zustand / Redux / Riverpod / BLoC）
- [ ] **离线需求是否明确？**
- [ ] **深链（Deep linking）是否从第一天规划？**
- [ ] **目标设备范围明确？**（手机 / 平板 / 双端）

### 每做一个屏幕前

- [ ] **触控目标 ≥ 44-48px？**
- [ ] **主要 CTA（关键按钮）在拇指舒适区？**
- [ ] **是否有加载态？**
- [ ] **是否有带重试的错误态？**
- [ ] **是否考虑离线处理？**
- [ ] **是否遵循平台交互习惯？**

### 发布前

- [ ] **已移除 console.log？**
- [ ] **敏感数据使用 SecureStore？**
- [ ] **已启用 SSL pinning（证书绑定）？**
- [ ] **列表已优化（memo、keyExtractor）？**
- [ ] **卸载（unmount）时已做内存清理？**
- [ ] **已在低端设备实测？**
- [ ] **所有交互元素有无障碍标签？**

---

## 📚 参考文件

针对具体领域深入阅读：

| 文件 | 阅读时机 |
|------|----------|
| [mobile-design-thinking.md](mobile-design-thinking.md) | **第一优先：反记忆化，强制上下文思考** |
| [touch-psychology.md](touch-psychology.md) | 触控交互、Fitts' Law（费茨定律）、手势设计 |
| [mobile-performance.md](mobile-performance.md) | RN/Flutter 优化、60fps、内存/电量 |
| [platform-ios.md](platform-ios.md) | iOS 专项设计与 HIG（Human Interface Guidelines）对齐 |
| [platform-android.md](platform-android.md) | Android 专项设计与 Material 3 对齐 |
| [mobile-navigation.md](mobile-navigation.md) | 导航模式与深链路 |
| [mobile-typography.md](mobile-typography.md) | 字体系统、可访问性、字阶 |
| [mobile-color-system.md](mobile-color-system.md) | OLED 优化、深色模式、电量策略 |
| [decision-trees.md](decision-trees.md) | 框架、状态与存储决策 |

---

> **牢记：** 移动端用户往往不耐心、易被打断，且在小屏上用不精确的手指操作。请按最差条件设计：弱网、单手、强光、低电量。能在这些条件下稳定可用，才算真正可用。
