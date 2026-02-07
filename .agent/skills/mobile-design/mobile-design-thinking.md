# 移动端设计思维（Mobile Design Thinking）

> **这份文件用于阻止 AI 套用记忆化模式，强制真实思考。**
> 用机制阻断“训练默认值”的惯性。
> **相当于前端布局拆解的移动端版本。**

---

## 🧠 深度移动思考协议（DEEP MOBILE THINKING PROTOCOL）

### 每个移动端项目开始前必须执行

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEEP MOBILE THINKING                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ CONTEXT SCAN                                               │
│     └── 我对项目有哪些默认假设？                                │
│         └── 必须质疑这些假设                                    │
│                                                                 │
│  2️⃣ ANTI-DEFAULT ANALYSIS                                      │
│     └── 我是不是在套用记忆模板？                                │
│         └── 这真是此项目最佳选择吗？                            │
│                                                                 │
│  3️⃣ PLATFORM DECOMPOSITION                                     │
│     └── iOS 与 Android 是否分别考虑？                           │
│         └── 各自平台特有模式是什么？                            │
│                                                                 │
│  4️⃣ TOUCH INTERACTION BREAKDOWN                                │
│     └── 每个交互是否逐一分析？                                  │
│         └── 是否应用 Fitts' Law 与 Thumb Zone？                 │
│                                                                 │
│  5️⃣ PERFORMANCE IMPACT ANALYSIS                                │
│     └── 是否评估组件性能影响？                                  │
│         └── 默认方案是否足够快？                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚫 AI 移动端默认模式（FORBIDDEN LIST）

### 这些模式不可无脑使用

以下是 AI 训练数据里学来的“默认模式”。
在使用前必须 **质疑** 并 **评估替代方案**。

```
┌─────────────────────────────────────────────────────────────────┐
│                 🚫 AI MOBILE SAFE HARBOR                        │
│           (Default Patterns - Never Use Without Questioning)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  导航默认值（NAVIGATION DEFAULTS）：                            │
│  ├── 所有项目都用 Tab bar（Drawer 会更好吗？）                  │
│  ├── 固定 5 个 Tabs（3 个够不够？6+ 是否 Drawer？）             │
│  ├── “Home” 放左侧（用户行为支持吗？）                          │
│  └── 汉堡菜单（是否过时？）                                     │
│                                                                 │
│  状态管理默认值（STATE MANAGEMENT DEFAULTS）：                  │
│  ├── Redux 全覆盖（Zustand/Jotai 是否足够？）                   │
│  ├── 一切全局状态（本地状态是否足够？）                         │
│  ├── Context Provider 地狱（atom 更好吗？）                      │
│  └── Flutter 一律 BLoC（Riverpod 是否更现代？）                  │
│                                                                 │
│  列表实现默认值（LIST IMPLEMENTATION DEFAULTS）：               │
│  ├── FlatList 默认（FlashList 是否更快？）                       │
│  ├── windowSize=21（真的需要这么大？）                          │
│  ├── removeClippedSubviews（一定要开？）                         │
│  └── ListView.builder（ListView.separated 更好吗？）            │
│                                                                 │
│  UI 模式默认值（UI PATTERN DEFAULTS）：                          │
│  ├── FAB 右下角（左下是否更易达？）                             │
│  ├── 所有列表都下拉刷新（真的需要吗？）                         │
│  ├── 左滑删除（右滑是否更自然？）                               │
│  └── 所有弹窗都用 Bottom Sheet（全屏更合适？）                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 组件拆解（MANDATORY）

### 每个屏幕都必须完成拆解分析

```
SCREEN: [Screen Name]
├── PRIMARY ACTION: [核心动作是什么？]
│   └── 是否位于拇指热区？[Yes/No → Why?]
│
├── TOUCH TARGETS: [所有可点击元素]
│   ├── [Element 1]: [Size]pt → 是否足够？
│   ├── [Element 2]: [Size]pt → 是否足够？
│   └── Spacing: [Gap]pt → 误触风险？
│
├── SCROLLABLE CONTENT:
│   ├── 是否列表？→ FlatList/FlashList [为什么选它？]
│   ├── Item 数量：~[N] → 性能评估？
│   └── 是否固定高度？→ 是否需要 getItemLayout？
│
├── STATE REQUIREMENTS:
│   ├── 本地状态是否足够？
│   ├── 是否需要上提状态？
│   └── 是否必须全局？[为什么？]
│
├── PLATFORM DIFFERENCES:
│   ├── iOS：是否需要差异化？
│   └── Android：是否需要差异化？
│
├── OFFLINE CONSIDERATION:
│   ├── 是否离线可用？
│   └── 缓存策略：[Yes/No/Which one?]
│
└── PERFORMANCE IMPACT:
    ├── 是否存在重组件？
    ├── 是否需要 memoization？
    └── 动画性能？
```

---

## 🎯 模式质疑矩阵（PATTERN QUESTIONING MATRIX）

对每个默认模式都必须回答以下问题：

### 导航模式质疑（Navigation Pattern Questioning）

| 假设（Assumption） | 质疑问题（Question） | 替代方案（Alternative） |
|-------------------|----------------------|--------------------------|
| "我要用 Tab bar" | 目的地有几个？ | 3 个→极简 Tab，6+→Drawer |
| "固定 5 个 Tab" | 是否真的同等重要？ | "More" Tab / Drawer 混合 |
| "底部导航" | iPad/平板支持？ | Navigation Rail 替代 |
| "Stack 导航" | 是否考虑深度链接？ | URL 结构 = 导航结构 |

### 状态模式质疑（State Pattern Questioning）

| 假设（Assumption） | 质疑问题（Question） | 替代方案（Alternative） |
|-------------------|----------------------|--------------------------|
| "我要用 Redux" | 复杂度真的高吗？ | 简单：Zustand，Server：TanStack |
| "全局状态" | 真的是全局吗？ | 本地上提 / Context selector |
| "Context Provider" | 会导致重渲染吗？ | Zustand / Jotai（原子化） |
| "BLoC 模式" | 这些样板值不值？ | Riverpod（更少代码） |

### 列表模式质疑（List Pattern Questioning）

| 假设（Assumption） | 质疑问题（Question） | 替代方案（Alternative） |
|-------------------|----------------------|--------------------------|
| "FlatList" | 性能是否关键？ | FlashList（更快） |
| "标准 renderItem" | 是否 memoize？ | useCallback + React.memo |
| "Index 作为 key" | 顺序会变化吗？ | 使用 item.id |
| "ListView" | 是否需要分割线？ | ListView.separated |

### UI 模式质疑（UI Pattern Questioning）

| 假设（Assumption） | 质疑问题（Question） | 替代方案（Alternative） |
|-------------------|----------------------|--------------------------|
| "FAB 右下角" | 考虑用户惯用手？ | 适配无障碍设置 |
| "下拉刷新" | 这个列表需要刷新吗？ | 只在必要时启用 |
| "Bottom sheet" | 内容量足够吗？ | 复杂流程用全屏 |
| "滑动操作" | 可发现性如何？ | 提供显式按钮 |

---

## 🧪 反记忆测试（ANTI-MEMORIZATION TEST）

### 每个方案提交前必须自检

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANTI-MEMORIZATION CHECKLIST                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ 我是不是因为“习惯如此”才选这个方案？                         │
│    → 如果是：立即停止，重新评估替代方案。                       │
│                                                                 │
│  □ 这是我在训练数据里见过的模式吗？                             │
│    → 如果是：它真的适合这个项目吗？                             │
│                                                                 │
│  □ 我是否在未思考的情况下写了方案？                             │
│    → 如果是：退一步，先做拆解分析。                             │
│                                                                 │
│  □ 我是否考虑过替代方案？                                       │
│    → 如果没有：至少想出 2 个替代再决定。                        │
│                                                                 │
│  □ 我是否考虑过平台差异？                                       │
│    → 如果没有：iOS/Android 分别分析。                           │
│                                                                 │
│  □ 我是否评估过性能影响？                                       │
│    → 如果没有：评估内存/CPU/电量成本。                          │
│                                                                 │
│  □ 这个方案是否适合当前项目上下文？                             │
│    → 如果没有：按上下文定制。                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 基于上下文的决策协议（CONTEXT-BASED DECISION PROTOCOL）

### 按项目类型做差异化思考

```
确定项目类型：
        │
        ├── E-Commerce App
        │   ├── Navigation：Tab（Home、Search、Cart、Account）
        │   ├── Lists：商品网格（memoized，图片优化）
        │   ├── Performance：图片缓存极其关键
        │   ├── Offline：购物车持久化、商品缓存
        │   └── Special：结算流程、支付安全
        │
        ├── Social/Content App
        │   ├── Navigation：Tab（Feed、Search、Create、Notify、Profile）
        │   ├── Lists：无限滚动、复杂条目
        │   ├── Performance：Feed 渲染极关键
        │   ├── Offline：Feed 缓存、草稿保存
        │   └── Special：实时更新、媒体处理
        │
        ├── Productivity/SaaS App
        │   ├── Navigation：Drawer 或自适应（手机 Tab、平板 Rail）
        │   ├── Lists：数据表格、表单
        │   ├── Performance：数据同步
        │   ├── Offline：完整离线编辑
        │   └── Special：冲突解决、后台同步
        │
        ├── Utility App
        │   ├── Navigation：极简（可能只有 Stack）
        │   ├── Lists：通常很少
        │   ├── Performance：极速启动
        │   ├── Offline：核心功能离线可用
        │   └── Special：Widget、快捷方式
        │
        └── Media/Streaming App
            ├── Navigation：Tab（Home、Search、Library、Profile）
            ├── Lists：横向轮播、纵向流
            ├── Performance：预加载、缓冲
            ├── Offline：下载管理
            └── Special：后台播放、投屏
```

---

## 🔄 交互拆解（INTERACTION BREAKDOWN）

### 每个手势都必须被分析

在添加任何手势前：

```
GESTURE: [Gesture Type]
├── DISCOVERABILITY:
│   └── 用户如何发现这个手势？
│       ├── 是否有视觉提示？
│       ├── 是否在 onboarding 中说明？
│       └── 是否有按钮替代？（必须）
│
├── PLATFORM CONVENTION:
│   ├── iOS 上这个手势意味着什么？
│   ├── Android 上这个手势意味着什么？
│   └── 是否偏离平台惯例？
│
├── ACCESSIBILITY:
│   ├── 运动障碍用户是否能完成？
│   ├── VoiceOver/TalkBack 是否有替代？
│   └── 是否支持 switch control？
│
├── CONFLICT CHECK:
│   ├── 是否与系统手势冲突？
│   │   ├── iOS：边缘返回
│   │   ├── Android：返回手势
│   │   └── Home indicator 上滑
│   └── 是否与 App 内其他手势冲突？
│
└── FEEDBACK:
    ├── 是否有触感反馈（haptic）？
    ├── 是否有足够视觉反馈？
    └── 是否需要音频反馈？
```

---

## 🎭 不是“过清单”就够（SPIRIT OVER CHECKLIST）

### 通过清单 ≠ 做好体验

| ❌ 自我欺骗（Self-Deception） | ✅ 真实评估（Honest Assessment） |
|-----------------------------|---------------------------------|
| “触控目标 44px 了”但在边缘够不到 | “单手能否真正触达？” |
| “我用了 FlatList”但未 memoize | “滚动是否真顺滑？” |
| “做了平台差异”但只是换图标 | “iOS 像 iOS，Android 像 Android 吗？” |
| “有离线支持”但只是通用报错 | “用户离线时到底能做什么？” |
| “有加载态”但只有 spinner | “用户是否知道等待时长？” |

> 🔴 **通过清单不是目标，做出优秀的移动体验才是目标。**

---

## 📝 移动端设计承诺（MOBILE DESIGN COMMITMENT）

### 每个移动端项目开始时必须填写

```
📱 MOBILE DESIGN COMMITMENT

Project: _______________
Platform: iOS / Android / Both

1. 我在本项目中不会使用的默认模式：
   └── _______________

2. 本项目的上下文重点：
   └── _______________

3. 我将实现的平台差异：
   └── iOS: _______________
   └── Android: _______________

4. 我将专门优化的性能点：
   └── _______________

5. 本项目的独特挑战：
   └── _______________

🧠 如果填不出来 → 说明我还没理解项目。
   → 需要回到上下文，向用户补问。
```

---

## 🚨 强制：每次移动端工作前（MANDATORY）

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-WORK VALIDATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ 是否完成组件拆解（Component Decomposition）？                │
│  □ 是否填写模式质疑矩阵（Pattern Questioning Matrix）？         │
│  □ 是否通过反记忆测试（Anti-Memorization Test）？               │
│  □ 是否做了上下文决策？                                         │
│  □ 是否做了交互拆解？                                           │
│  □ 是否填写移动端设计承诺？                                     │
│                                                                 │
│  ⚠️ 未完成以上步骤，不得写代码。                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

> **记住（Remember）**：如果你是因为“大家都这么做”而选择方案，那就是“没思考”。每个项目都独特，每个上下文都不同，每个用户行为都有差异。**先思考，再写代码。**
