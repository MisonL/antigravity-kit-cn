---
name: mobile-design
description: 移动端优先的设计思维与决策逻辑。涉及 iOS 和 Android 应用的触控交互、性能模式及平台规范。传授原则，而非固定的数值。在构建 React Native, Flutter 或原生移动应用时使用。
allowed-tools: Read, Glob, Grep, Bash
---

# 移动端设计系统 (Mobile Design System)

> **设计哲学：** 触控优先 (Touch-first)；电池友好 (Battery-conscious)；尊重平台 (Platform-respectful)；离线可用 (Offline-capable)。
> **核心原则：** 移动端**不是**缩小的桌面端。思考 (THINK) 移动端约束，询问 (ASK) 平台选择。

---

## 🔧 运行脚本 (Runtime Scripts)

**执行以下脚本进行验证（无需阅读，直接运行）：**

| 脚本                      | 用途                 | 执行命令                                    |
| ------------------------- | -------------------- | ------------------------------------------- |
| `scripts/mobile_audit.py` | 移动端 UX 与触控审计 | `python scripts/mobile_audit.py <项目路径>` |

---

## 🔴 强制：工作前请先阅读参考文件！

**⛔ 在阅读相关文件之前，请勿开始开发：**

### 通用准则 (必读)

| 文件                                                       | 内容                                          | 状态              |
| ---------------------------------------------------------- | --------------------------------------------- | ----------------- |
| **[mobile-design-thinking.md](mobile-design-thinking.md)** | **⚠️ 反死记硬背：强制思考，避免 AI 默认偏好** | **⬜ 最高优先级** |
| **[touch-psychology.md](touch-psychology.md)**             | **菲茨定律、手势、触觉反馈、操作热区**        | **⬜ 关键**       |
| **[mobile-performance.md](mobile-performance.md)**         | **RN/Flutter 性能、60fps 优化、内存管理**     | **⬜ 关键**       |
| **[mobile-backend.md](mobile-backend.md)**                 | **推送通知、离线同步、移动端专用 API**        | **⬜ 关键**       |
| **[mobile-testing.md](mobile-testing.md)**                 | **测试金字塔、E2E 测试、平台特定测试**        | **⬜ 关键**       |
| **[mobile-debugging.md](mobile-debugging.md)**             | **原生 vs JS 调试、Flipper、Logcat**          | **⬜ 关键**       |
| [mobile-navigation.md](mobile-navigation.md)               | 标签/堆栈/侧边栏导航、深度链接 (Deep linking) | ⬜ 建议阅读       |
| [mobile-typography.md](mobile-typography.md)               | 系统字体、动态字号 (Dynamic Type)、无障碍     | ⬜ 建议阅读       |
| [mobile-color-system.md](mobile-color-system.md)           | OLED 优化、暗色模式、低电量意识               | ⬜ 建议阅读       |
| [decision-trees.md](decision-trees.md)                     | 框架/状态管理/持久化存储选择方案              | ⬜ 建议阅读       |

> 🧠 **mobile-design-thinking.md 是第一优先级！** 该文件确保 AI 能够主动思考而非机械套用模式。

### 平台特定指南 (根据目标平台阅读)

| 平台        | 文件                                       | 内容                                         | 阅读时机                       |
| ----------- | ------------------------------------------ | -------------------------------------------- | ------------------------------ |
| **iOS**     | [platform-ios.md](platform-ios.md)         | HIG 规范、SF Pro 字体、SwiftUI 模式          | 为 iPhone/iPad 构建时          |
| **Android** | [platform-android.md](platform-android.md) | Material Design 3、Roboto 字体、Compose 模式 | 为 Android 构建时              |
| **跨平台**  | 以上两者                                   | 平台间的差异点                               | 使用 React Native / Flutter 时 |

> 🔴 **如果为 iOS 构建 → 请先阅读 platform-ios.md！**
> 🔴 **如果为 Android 构建 → 请先阅读 platform-android.md！**
> 🔴 **如果是跨平台开发 → 请阅读两者并应用平台条件逻辑！**

---

## ⚠️ 关键：询问胜过假设 (MANDATORY)

> **停止！如果老板的请求是开放性的，请不要默认使用您的个人偏好。**

### 如果未指定，您必须询问以下项：

| 维度         | 询问内容                                                  | 为什么重要               |
| ------------ | --------------------------------------------------------- | ------------------------ |
| **平台**     | “是 iOS、Android 还是两者都需要？”                        | 影响后续的每一个设计决策 |
| **框架**     | “React Native, Flutter 还是原生开发？”                    | 决定了开发模式与工具链   |
| **导航**     | “使用标签栏 (Tabs)、侧边栏 (Drawer) 还是堆栈式 (Stack)？” | 核心 UX 决策             |
| **状态管理** | “选择哪种状态管理方案？(Zustand/Redux/Riverpod/BLoC?)”    | 架构的基石               |
| **离线支持** | “是否需要支持离线使用？”                                  | 影响数据暂存与同步策略   |
| **目标设备** | “仅支持手机，还是需要适配平板电脑？”                      | 布局的复杂度差异         |

### ⛔ 移动端 AI 反模式 (YASAK LİSTESİ)

> 🚫 **以下是 AI 常犯的默认倾向，务必避免！**

#### 1. 性能方面的“原罪” (Performance Sins)

| ❌ 严禁行为                    | 弊端                                 | ✅ 推荐做法                                        |
| ------------------------------ | ------------------------------------ | -------------------------------------------------- |
| **长列表使用 ScrollView**      | 渲染所有项，内存易爆炸               | 使用 `FlatList` / `FlashList` / `ListView.builder` |
| **行内 renderItem 函数**       | 每次渲染都会创建新函数，导致子项重绘 | 使用 `useCallback` + `React.memo`                  |
| **缺失 keyExtractor**          | 导致重排时产生动画 Bug 或性能损耗    | 提供来自数据源的唯一且稳定的 ID                    |
| **忽略 getItemLayout**         | 异步布局会导致列表滚动时出现跳动     | 在子项高度固定时，必须提供此项                     |
| **到处使用 setState()**        | 导致不必要的组件树重构               | 使用局部状态或针对性的状态分发 (如 const 构造函数) |
| **Native driver 设置为 false** | 动画将被 JS 线程阻塞，导致掉帧       | `useNativeDriver: true` 始终开启                   |
| **生产环境留有 console.log**   | 严重阻塞 JS 线程性能                 | 发布版本前务必清理所有日志输出                     |
| **漏用 React.memo/const**      | 任何变动都会导致所有子项重绘         | **始终**对列表子项进行记忆化处理                   |

#### 2. 触控与 UX 方面的“原罪” (Touch/UX Sins)

| ❌ 严禁行为                | 弊端                           | ✅ 推荐做法                             |
| -------------------------- | ------------------------------ | --------------------------------------- |
| **触控目标 < 44px**        | 极难点中，引起用户挫败感       | 最小 44pt (iOS) / 48dp (Android)        |
| **目标间距 < 8px**         | 极易发生误触                   | 保持最小 8-12px 的安全间距              |
| **纯手势交互**             | 对运动受限的用户极不友好       | **始终**提供对应的按钮作为备选方案      |
| **缺失加载状态 (Loading)** | 用户会认为 App 已崩溃          | **始终**提供加载反馈 (Spinner/Skeleton) |
| **缺失错误处理状态**       | 用户将陷入死胡同，无法恢复     | 展示错误信息并提供“重试”选项            |
| **无离线处理**             | 网络丢失时会直接白屏或死锁     | 优雅降级，展示缓存数据                  |
| **由于忽略平台规范**       | 破坏了用户的肌肉记忆，导致困惑 | iOS 就要像 iOS，Android 就要像 Android  |

#### 3. 安全方面的“原罪” (Security Sins)

| ❌ 严禁行为                 | 弊端                           | ✅ 推荐做法                                                    |
| --------------------------- | ------------------------------ | -------------------------------------------------------------- |
| **Token 存在 AsyncStorage** | 易被读取，在越狱设备上极不安全 | 使用 `SecureStore` / `Keychain` / `EncryptedSharedPreferences` |
| **硬编码 API 密钥**         | 容易通过反编译被窃取           | 使用环境变量并存储在安全区域                                   |
| **跳过 SSL 固定 (Pinning)** | 易受中间人 (MITM) 攻击         | 在生产环境中启用证书固定                                       |
| **记录敏感数据日志**        | 日志可能被恶意提取             | 严进在日志中记录 Token、密码或隐私信息 (PII)                   |

#### 4. 架构方面的“原罪” (Architecture Sins)

| ❌ 严禁行为              | 弊端                             | ✅ 推荐做法                           |
| ------------------------ | -------------------------------- | ------------------------------------- |
| **业务逻辑写在 UI 层**   | 无法测试，难以维护               | 实现服务层 (Service layer) 的逻辑分离 |
| **所有状态都提升到全局** | 导致不必要的全局重绘，增加复杂度 | 默认使用局部状态，仅在需要时才提升    |
| **忽略深度链接需求**     | 导致推送通知、分享链接失效       | 从第一天起就规划深度链接布局          |
| **缺失清理 (Dispose)**   | 导致内存泄漏或僵尸监听器         | 离场时务必清理订阅、计时器及监听器    |

---

## 📱 平台决策矩阵 (Platform Decision Matrix)

### 何时统一 vs 何时区分

| 维度            | 统一 (UNIFY) (保持一致) | 区分 (DIVERGE) (平台特定)                       |
| --------------- | ----------------------- | ----------------------------------------------- |
| 业务逻辑        | ✅ 始终统一             | -                                               |
| 数据层          | ✅ 始终统一             | -                                               |
| 核心功能        | ✅ 始终统一             | -                                               |
| **导航模式**    | -                       | ✅ iOS: 边缘滑入; Android: 分包返回键           |
| **触控手势**    | -                       | ✅ 遵循各原生平台的手势习惯                     |
| **图标体系**    | -                       | ✅ SF Symbols (iOS) vs Material Icons (Android) |
| **日期选择器**  | -                       | ✅ 必须使用各原生的 Picker 控件                 |
| **模态框/弹窗** | -                       | ✅ iOS: Bottom Sheet; Android: 对话框 (Dialog)  |
| **排版字型**    | -                       | ✅ SF Pro (iOS) vs Roboto (Android)             |
| **错误反馈**    | -                       | ✅ 遵循各平台的弹窗警告习惯                     |

### 速查表：平台默认规范

| 元素             | iOS                               | Android                              |
| ---------------- | --------------------------------- | ------------------------------------ |
| **主字体**       | SF Pro / SF Compact               | Roboto                               |
| **最小触控目标** | 44pt × 44pt                       | 48dp × 48dp                          |
| **返回导航**     | 边缘向右滑动                      | 系统返回键/手势                      |
| **底部标签图标** | 实心/描边样式 (SF Symbols)        | Material 填充样式                    |
| **操作说明**     | 靠底部展示的操作单 (Action Sheet) | 底部抽屉 (Bottom Sheet) / 居中对话框 |
| **进度指示**     | 旋转等待圈 (Spinner)              | 线性进度条 (Linear progress)         |
| **下拉刷新**     | 原生 UIRefreshControl 样式        | SwipeRefreshLayout 样式              |

---

## 🧠 移动端 UX 心理学 (速查)

### 适用于触控的菲茨定律 (Fitts' Law)

```
桌面端：光标极其精确 (1px)
移动端：手指天生不精确 (约 7mm 接触面积)

→ 触控目标必须保持在 44-48px 以上
→ 关键操作应放置在“大拇指热区 (THUMB ZONE)” (屏幕下半部分)
→ 危险/不可逆的操作应避开易触达区域
```

### 大拇指热区 (单手操作视角)

```
┌─────────────────────────────┐
│      难以触达 (HARD)        │ ← 放置导航、菜单、返回
│       (需要拉伸手指)        │
├─────────────────────────────┤
│      可以触达 (OK)          │ ← 放置次要操作
│       (较为自然)            │
├─────────────────────────────┤
│      核心热区 (EASY)        │ ← PRIMARY CTA, 底部标签栏
│    (拇指自然划过的弧形)     │ ← 主内容交互区域
└─────────────────────────────┘
          [ 主屏幕键 ]
```

### 移动端特有的认知负荷 (Cognitive Load)

| 桌面端           | 移动端的差异                          |
| ---------------- | ------------------------------------- |
| 多窗口并行       | **一次只关注一项**任务                |
| 键盘快捷键       | 触控手势交互                          |
| 悬停状态 (Hover) | **完全没有悬停** (要么点，要么没反应) |
| 宽阔视野         | 空间受限，以纵向滚动为主              |
| 专注度较高       | 随时会被外部消息中断                  |

深度解析参考：[touch-psychology.md](touch-psychology.md)

---

## ⚡ 性能原则 (速查)

### React Native 关键规则

```typescript
// ✅ 正确：记忆化 renderItem + React.memo 包装子项
const ListItem = React.memo(({ item }: { item: Item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

const renderItem = useCallback(
  ({ item }: { item: Item }) => <ListItem item={item} />,
  []
);

// ✅ 正确：包含了所有优化配置的 FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}  // 使用稳定 ID，不要使用 index
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}       // 这一条也非常关键
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Flutter 关键规则

```dart
// ✅ 正确：使用 const 构造函数防止不必要的重组
class MyWidget extends StatelessWidget {
  const MyWidget({super.key}); // 必须通过关键词 CONST 声明！

  @override
  Widget build(BuildContext context) {
    return const Column( // 使用 CONST!
      children: [
        Text('静态内容'),
        MyConstantWidget(),
      ],
    );
  }
}

// ✅ 正确：通过 ValueListenableBuilder 实现局部的状态更新
ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) => Text('$value'),
  child: const ExpensiveWidget(), // 此处的组件将不会被意外重绘！
)
```

### 动画性能

```
GPU 加速 (快 FAST):         CPU 驱动 (慢 SLOW):
├── transform               ├── width, height (宽度, 高度)
├── opacity (透明度)         ├── top, left, right, bottom (定位)
└── (请尽量仅操作这些属性)    ├── margin, padding (边距)
                             └── (严禁对这类属性做动画)
```

完整指南参考：[mobile-performance.md](mobile-performance.md)

---

## 📝 检查点 (MANDATORY Before Any Mobile Work)

> **在编写任何移动端代码之前，您必须完成此检查点回复：**

```
🧠 检查点 (CHECKPOINT):

目标平台：   [ iOS / Android / 两者 ]
技术框架：   [ React Native / Flutter / SwiftUI / Kotlin ]
已读文件：   [ 列出您已阅读的技能文件 ]

我将应用的 3 条原则：
1. _______________
2. _______________
3. _______________

我将避开的反模式：
1. _______________
2. _______________
```

**回复示例：**

```
🧠 检查点：

目标平台：   iOS + Android (跨平台)
技术框架：   React Native + Expo
已读文件：   touch-psychology.md, mobile-performance.md, platform-ios.md, platform-android.md

我将应用的 3 条原则：
1. 所有列表统一使用 FlatList 并搭配 React.memo + useCallback。
2. 触控目标不小于 48px，主 CTA 放在大拇指热区。
3. 遵循平台原生导航习惯 (iOS 侧滑返回，Android 物理返回键)。

我将避开的反模式：
1. 禁止用 ScrollView 渲染长列表。
2. 禁止行内定义 renderItem 函数。
3. 严禁用 AsyncStorage 存储 Token，改为使用 SecureStore。
```

> 🔴 **如果您无法填写此检查点 → 请返回并重新阅读技能文件。**

---

## 🔧 框架决策树 (Framework Decision Tree)

```
您想要构建什么？
        │
        ├── 需要 OTA 更新 + 快速迭代 + 回归 Web 团队习惯
        │   └── ✅ React Native + Expo
        │
        ├── 需要像素级的自定义 UI + 性能至上
        │   └── ✅ Flutter
        │
        ├── 深度的原生功能集成 + 专注单一平台
        │   ├── 仅 iOS → SwiftUI
        │   └── 仅 Android → Kotlin + Jetpack Compose
        │
        ├── 已有 RN 存量代码 + 新增功能
        │   └── ✅ React Native (Bare 模式)
        │
        └── 企业级项目 + 已有 Flutter 团队
            └── ✅ Flutter
```

详细决策树参考：[decision-trees.md](decision-trees.md)

---

## 📋 预开发检查清单 (Pre-Development Checklist)

### 在开始任何移动端项目之前

- [ ] **平台是否已确认？** (iOS / Android / Both)
- [ ] **框架是否已选定？** (RN / Flutter / Native)
- [ ] **导航模式是否已敲定？** (Tabs / Stack / Drawer)
- [ ] **状态管理方案是否已选定？** (Zustand / Redux / Riverpod / BLoC)
- [ ] **离线需求是否已明确？**
- [ ] **深度链接逻辑是否已提前规划？**
- [ ] **目标设备范围是否定义清晰？** (手机 / 平板 / 两者)

### 开发每一屏之前

- [ ] **触控目标是否 ≥ 44-48px？**
- [ ] **主 CTA 是否处于大拇指热区？**
- [ ] **是否包含了加载反馈状态？**
- [ ] **是否包含了带重试逻辑的错误状态？**
- [ ] **是否考虑了离线数据的展示逻辑？**
- [ ] **是否严格遵循了所选平台的规范？**

### 发布前夕

- [ ] **所有的 console.log 是否已清理干净？**
- [ ] **敏感数据是否已迁移至 SecureStore？**
- [ ] **SSL 固定逻辑是否已开启？**
- [ ] **列表组件是否已完成性能优化 (memo, keyExtractor)？**
- [ ] **卸载时是否包含了内存清理逻辑？**
- [ ] **是否在低端设备上进行了性能测试？**
- [ ] **所有交互元素是否都添加了无障碍标签 (Accessibility labels)？**

---

## 📚 参考文件索引

如需特定领域的深度指南，请查阅：

| 文件                                                   | 何时使用                                     |
| ------------------------------------------------------ | -------------------------------------------- |
| [mobile-design-thinking.md](mobile-design-thinking.md) | **第一位！反死记硬背，强制基于上下文思考**   |
| [touch-psychology.md](touch-psychology.md)             | 深入理解触控交互、菲茨定律、手势设计         |
| [mobile-performance.md](mobile-performance.md)         | 优化 RN/Flutter 性能、帧率、内存与电池       |
| [platform-ios.md](platform-ios.md)                     | iOS 开发专用：HIG 规范对齐                   |
| [platform-android.md](platform-android.md)             | Android 开发专用：Material Design 3 规范对齐 |
| [mobile-navigation.md](mobile-navigation.md)           | 导航模式决策、深度链接实现                   |
| [mobile-typography.md](mobile-typography.md)           | 字体比例尺、系统字体、无障碍适配             |
| [mobile-color-system.md](mobile-color-system.md)       | OLED 针对性优化、暗色模式策略                |
| [decision-trees.md](decision-trees.md)                 | 框架、状态、存储方案的最终决策逻辑           |

---

> **谨记：** 移动端用户是缺乏耐心的、随时会被打断的，且在小屏幕上使用不精确的手指。请针对**最恶劣的条件**进行设计：网络差、单手操作、强光直射、低电量。如果能在这些条件下良好运行，它将在任何地方都表现出色。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/mobile-design/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/mobile-design/SKILL.md`。
- **注意**：文档层不改技能流程；仅补充目录映射事实。
