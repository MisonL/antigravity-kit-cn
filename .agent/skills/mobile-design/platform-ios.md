# iOS 平台指南（iOS Platform Guidelines）

> Human Interface Guidelines（HIG）要点、iOS 设计惯例、SF Pro 排版与原生模式。
> **做 iPhone/iPad 必读。**

---

## 1. Human Interface Guidelines 哲学

### 核心设计原则（Core Apple Design Principles）

```
CLARITY（清晰）：
├── 文本在任何字号都清晰可读
├── 图标精确且清楚
├── 装饰克制且恰当
└── 功能性驱动设计

DEFERENCE（克制）：
├── UI 帮助用户理解与操作
├── 内容占据屏幕主体
├── UI 不与内容争夺注意力
└── 半透明暗示更多内容

DEPTH（层次）：
├── 清晰视觉层级表达结构
├── 过渡强调深度感
├── 触控揭示功能
└── 内容高于 UI
```

### iOS 设计价值（iOS Design Values）

| 价值 | 实现方式 |
|------|----------|
| **Aesthetic Integrity** | 设计匹配功能（游戏 ≠ 生产力） |
| **Consistency** | 系统控件 + 熟悉模式 |
| **Direct Manipulation** | 触控直接作用于内容 |
| **Feedback** | 操作得到明确反馈 |
| **Metaphors** | 用现实隐喻帮助理解 |
| **User Control** | 用户发起操作且可取消 |

---

## 2. iOS 排版（iOS Typography）

### SF Pro 字体家族

```
iOS 系统字体：
├── SF Pro Text：正文（< 20pt）
├── SF Pro Display：大标题（≥ 20pt）
├── SF Pro Rounded：更友好场景
├── SF Mono：代码/等宽数据
└── SF Compact：Apple Watch/小屏
```

### iOS 字号体系（Dynamic Type）

| Style | Default Size | Weight | Usage |
|-------|--------------|--------|-------|
| **Large Title** | 34pt | Bold | 导航栏（滚动折叠） |
| **Title 1** | 28pt | Bold | 页面标题 |
| **Title 2** | 22pt | Bold | 分区标题 |
| **Title 3** | 20pt | Semibold | 子分区标题 |
| **Headline** | 17pt | Semibold | 强调正文 |
| **Body** | 17pt | Regular | 主体内容 |
| **Callout** | 16pt | Regular | 次要内容 |
| **Subhead** | 15pt | Regular | 辅助内容 |
| **Footnote** | 13pt | Regular | 注释、时间戳 |
| **Caption 1** | 12pt | Regular | 标注 |
| **Caption 2** | 11pt | Regular | 细小文本 |

### Dynamic Type 支持（必须）

```swift
// ❌ 错误：固定字号
Text("Hello")
    .font(.system(size: 17))

// ✅ 正确：Dynamic Type
Text("Hello")
    .font(.body) // 随用户设置缩放

// React Native 对应
<Text style={{ fontSize: 17 }}> // ❌ 固定
<Text style={styles.body}> // 使用动态字号系统
```

### 字重使用（Font Weight Usage）

| 字重 | iOS 常量 | 场景 |
|------|----------|------|
| Regular (400) | `.regular` | 正文 |
| Medium (500) | `.medium` | 按钮、强调 |
| Semibold (600) | `.semibold` | 小标题 |
| Bold (700) | `.bold` | 标题、关键信息 |
| Heavy (800) | `.heavy` | 很少使用，营销场景 |

---

## 3. iOS 颜色系统（iOS Color System）

### 系统语义色（System Colors）

```
使用语义色以自动适配暗色模式：

Primary：
├── .label → 主文本
├── .secondaryLabel → 次级文本
├── .tertiaryLabel → 第三级文本
├── .quaternaryLabel → 水印

Backgrounds：
├── .systemBackground → 主背景
├── .secondarySystemBackground → 分组内容
├── .tertiarySystemBackground → 浮层内容

Fills：
├── .systemFill → 大块形状
├── .secondarySystemFill → 中块形状
├── .tertiarySystemFill → 小块形状
├── .quaternarySystemFill → 极轻形状
```

### 系统强调色（System Accent Colors）

| 颜色 | Light Mode | Dark Mode | 用途 |
|------|------------|-----------|------|
| Blue | #007AFF | #0A84FF | 链接/高亮/默认 tint |
| Green | #34C759 | #30D158 | 成功/正向 |
| Red | #FF3B30 | #FF453A | 错误/破坏性 |
| Orange | #FF9500 | #FF9F0A | 警告 |
| Yellow | #FFCC00 | #FFD60A | 注意 |
| Purple | #AF52DE | #BF5AF2 | 特殊功能 |
| Pink | #FF2D55 | #FF375F | 收藏/情感 |
| Teal | #5AC8FA | #64D2FF | 信息提示 |

### 暗色模式注意事项

```
iOS 暗色模式不是简单反色：

LIGHT MODE：              DARK MODE：
├── 白色背景               ├── 纯黑或近黑背景
├── 高饱和色               ├── 低饱和色
├── 黑色文本               ├── 浅色文本
└── 阴影                   └── 光晕或无阴影

规则：始终使用语义色自动适配。
```

---

## 4. iOS 布局与间距（iOS Layout & Spacing）

### 安全区（Safe Areas）

```
┌─────────────────────────────────────┐
│░░░░░░░░░░░ Status Bar ░░░░░░░░░░░░░│ ← 顶部安全区
├─────────────────────────────────────┤
│                                     │
│                                     │
│         Safe Content Area           │
│                                     │
│                                     │
├─────────────────────────────────────┤
│░░░░░░░░░ Home Indicator ░░░░░░░░░░░│ ← 底部安全区
└─────────────────────────────────────┘

规则：不要把可交互内容放到 unsafe 区域。
```

### 标准边距与内边距（Standard Margins & Padding）

| 元素 | Margin | 说明 |
|------|--------|------|
| 屏幕边缘 → 内容 | 16pt | 标准左右边距 |
| 分组表格区块 | 上下 16pt | 留呼吸感 |
| 列表项 padding | 水平 16pt | 标准 cell padding |
| 卡片内边距 | 16pt | 卡片内容 |
| 按钮内边距 | 12pt 垂直 / 16pt 水平 | 最小值 |

### iOS 栅格（iOS Grid System）

```
iPhone Grid（Standard）：
├── 左右边距 16pt
├── 最小间距 8pt
├── 内容按 8pt 倍数排列

iPhone Grid（Compact）：
├── 左右边距 8pt（必要时）
├── 最小间距 4pt

iPad Grid：
├── 左右边距 20pt（或更多）
├── 建议多栏布局
```

---

## 5. iOS 导航模式（iOS Navigation Patterns）

### 导航类型（Navigation Types）

| 模式 | 场景 | 实现 |
|------|------|------|
| **Tab Bar** | 3-5 顶层入口 | 底部常驻 |
| **Navigation Controller** | 层级深入 | Stack + 返回按钮 |
| **Modal** | 聚焦任务/打断 | Sheet 或全屏 |
| **Sidebar** | iPad 多栏 | 左侧边栏 |

### Tab Bar 指南

```
┌─────────────────────────────────────┐
│                                     │
│         Content Area                │
│                                     │
├─────────────────────────────────────┤
│  🏠     🔍     ➕     ❤️     👤    │ ← Tab bar (49pt height)
│ Home   Search  New   Saved  Profile │
└─────────────────────────────────────┘

规则：
├── 最多 3-5 项
├── 图标：SF Symbols 或自定义（25×25pt）
├── 文本：必须显示（无障碍）
├── 激活态：填充图标 + tint 色
└── Tab bar 始终可见（不要随滚动隐藏）
```

### Navigation Bar 指南

```
┌─────────────────────────────────────┐
│ < Back     Page Title      Edit    │ ← Navigation bar (44pt)
├─────────────────────────────────────┤
│                                     │
│         Content Area                │
│                                     │
└─────────────────────────────────────┘

规则：
├── 返回按钮：系统 chevron + 上一页标题（或 “Back”）
├── 标题：居中 + 动态字号
├── 右侧操作：最多 2 个
├── 大标题：可随滚动折叠
└── 优先文字按钮而非纯图标
```

### Modal 展示方式

| 样式 | 场景 | 视觉 |
|------|------|------|
| **Sheet（默认）** | 次要任务 | 卡片上滑，父级仍可见 |
| **Full Screen** | 沉浸式任务 | 覆盖全屏 |
| **Popover** | iPad 快速信息 | 有箭头气泡 |
| **Alert** | 关键打断 | 居中对话框 |
| **Action Sheet** | 上下文操作 | 底部选项 |

### 手势（Gestures）

| 手势 | iOS 约定 |
|------|----------|
| **边缘左滑** | 返回上一层 |
| **下拉（sheet）** | 关闭 modal |
| **长按** | 上下文菜单 |
| **深按** | Peek/Pop（旧版） |
| **双指滑动** | 内嵌滚动 |

---

## 6. iOS 组件（iOS Components）

### Buttons

```
按钮样式（UIKit/SwiftUI）：

┌──────────────────────────────┐
│         Tinted               │ ← 主操作（填充）
├──────────────────────────────┤
│         Bordered             │ ← 次操作（描边）
├──────────────────────────────┤
│         Plain                │ ← 三级操作（文字）
└──────────────────────────────┘

尺寸：
├── Mini：狭小空间
├── Small：紧凑 UI
├── Medium：行内操作
├── Large：主 CTA（高度 ≥ 44pt）
```

### Lists & Tables

```
列表样式：

.plain         → 无分隔线，边到边
.insetGrouped  → 圆角卡片（iOS 14+ 默认）
.grouped       → 全宽分组
.sidebar       → iPad 侧栏导航

Cell Accessories：
├── Disclosure indicator (>) → 进入详情
├── Detail button (i) → 信息页不跳转
├── Checkmark (✓) → 选择
├── Reorder (≡) → 拖拽排序
└── Delete (-) → 侧滑/编辑删除
```

### Text Fields

```
iOS Text Field Anatomy：

┌─────────────────────────────────────┐
│ 🔍 Search...                    ✕  │
└─────────────────────────────────────┘
  ↑                               ↑
  Leading icon                   Clear button

边框：圆角矩形
高度：≥ 36pt
Placeholder：secondary text color
Clear button：有文本时显示
```

### Segmented Controls

```
使用场景：
├── 2-5 个相关选项
├── 内容筛选
├── 视图切换

┌───────┬───────┬───────┐
│  All  │ Active│ Done  │
└───────┴───────┴───────┘

规则：
├── 等宽分段
├── 仅文本或仅图标（不要混用）
├── 最多 5 段
└── 更复杂时考虑 Tabs
```

---

## 7. iOS 特有模式（iOS Specific Patterns）

### 下拉刷新（Pull to Refresh）

```
原生 UIRefreshControl：
├── 下拉到阈值 → 显示 spinner
├── 松手 → 触发刷新
├── 加载中 → spinner 旋转
├── 完成 → spinner 消失

规则：使用原生 UIRefreshControl，不要自造。
```

### Swipe Actions

```
iOS 侧滑操作：

← Swipe Left（破坏性）        Swipe Right（建设性） →
┌─────────────────────────────────────────────────────────────┐
│                    List Item Content                        │
└─────────────────────────────────────────────────────────────┘

左滑：Archive/Delete/Flag
右滑：Pin/Star/Mark as Read

Full swipe：触发首个动作
```

### Context Menus

```
长按 → 弹出上下文菜单

┌─────────────────────────────┐
│       Preview Card          │
├─────────────────────────────┤
│  📋 Copy                    │
│  📤 Share                   │
│  ➕ Add to...               │
├─────────────────────────────┤
│  🗑️ Delete          (Red)   │
└─────────────────────────────┘

规则：
├── Preview：显示放大内容
├── Actions：与内容相关
├── Destructive：放最后且标红
└── 最多约 8 项（更多可滚动）
```

### Sheets & Half-Sheets

```
iOS 15+ Sheets：

┌─────────────────────────────────────┐
│                                     │
│        Parent View (dimmed)          │
│                                     │
├─────────────────────────────────────┤
│  ═══  (Grabber)                     │ ← 拖动调整高度
│                                     │
│        Sheet Content                │
│                                     │
│                                     │
└─────────────────────────────────────┘

Detents：
├── .medium → 半屏
├── .large → 全屏（含 safe area）
├── Custom → 指定高度
```

---

## 8. SF Symbols

### 使用指南（Usage Guidelines）

```
SF Symbols：苹果官方图标库（5000+）

Weights：应匹配文本字重
├── Ultralight / Thin / Light
├── Regular / Medium / Semibold
├── Bold / Heavy / Black

Scales：
├── .small → 小文本内联
├── .medium → 标准 UI
├── .large → 强调/独立图标
```

### Symbol 配置（Symbol Configurations）

```swift
// SwiftUI
Image(systemName: "star.fill")
    .font(.title2)
    .foregroundStyle(.yellow)

// 渲染模式
Image(systemName: "heart.fill")
    .symbolRenderingMode(.multicolor)

// 动画（iOS 17+）
Image(systemName: "checkmark.circle")
    .symbolEffect(.bounce)
```

### 最佳实践（Symbol Best Practices）

| 指南 | 实现方式 |
|------|----------|
| 匹配文本字重 | Symbol weight = font weight |
| 使用标准符号 | 用户更易识别 |
| 多色有意义时用 | 非装饰 |
| 旧系统提供兜底 | 检查可用性 |

---

## 9. iOS 无障碍（iOS Accessibility）

### VoiceOver 要求

```
每个交互元素必须：
├── Accessibility label（是什么）
├── Accessibility hint（做什么，可选）
├── Accessibility traits（button/link 等）
└── Accessibility value（当前状态）

SwiftUI：
.accessibilityLabel("Play")
.accessibilityHint("Plays the selected track")

React Native：
accessibilityLabel="Play"
accessibilityHint="Plays the selected track"
accessibilityRole="button"
```

### Dynamic Type 缩放

```
必须支持 Dynamic Type

用户可设置：
├── xSmall → 14pt body
├── Small → 15pt body
├── Medium → 16pt body
├── Large（默认） → 17pt body
├── xLarge → 19pt body
├── xxLarge → 21pt body
├── xxxLarge → 23pt body
├── Accessibility sizes → 最高 53pt

你的 App 必须在所有字号下正常排版。
```

### Reduce Motion

```
尊重动态偏好：

@Environment(\.accessibilityReduceMotion) var reduceMotion

if reduceMotion {
    // 使用即时过渡
} else {
    // 允许动画
}

React Native:
import { AccessibilityInfo } from 'react-native';
AccessibilityInfo.isReduceMotionEnabled()
```

---

## 10. iOS 检查清单（iOS Checklist）

### 每个 iOS 页面前

- [ ] 使用 SF Pro 或 SF Symbols
- [ ] 支持 Dynamic Type
- [ ] 遵守 Safe Areas
- [ ] 导航符合 HIG（返回手势可用）
- [ ] Tab bar 项 ≤ 5
- [ ] 触控目标 ≥ 44pt

### iOS 发布前

- [ ] 暗色模式已测试
- [ ] 全字号测试（Accessibility Inspector）
- [ ] VoiceOver 已测试
- [ ] 边缘滑动返回可用
- [ ] 键盘遮挡处理
- [ ] 适配 Notch/Dynamic Island
- [ ] Home indicator 区域处理
- [ ] 可用原生组件尽量用原生

---

> **记住（Remember）**：iOS 用户对 HIG 非常敏感，偏离原生模式会被认为“坏掉”。不确定时，优先使用原生组件。
