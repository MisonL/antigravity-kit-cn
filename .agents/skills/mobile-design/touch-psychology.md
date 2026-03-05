# 触控心理学参考（Touch Psychology Reference）

> 深入覆盖移动端触控交互、触控版 Fitts' Law、拇指热区、手势心理学与触感反馈（Haptics）。
> **这是移动端版的 ux-psychology.md —— 所有移动端工作必读。**

---

## 1. 触控版 Fitts' Law

### 核心差异（The Fundamental Difference）

```
DESKTOP（鼠标/触控板）：
├── 光标尺寸：1 像素（高精度）
├── 视觉反馈：Hover 状态
├── 误差成本：低（易重试）
└── 目标获取：快且精准

MOBILE（手指）：
├── 接触面积：约 7mm 直径（精度低）
├── 视觉反馈：无 hover，仅点击
├── 误差成本：高（反复点击很挫败）
├── 遮挡：手指覆盖目标
└── 目标获取：更慢，需要更大目标
```

### Fitts' Law 公式（触控版）

```
Touch acquisition time = a + b × log₂(1 + D/W)

Where:
├── D = 目标距离
├── W = 目标宽度
└── 触控下 W 必须远大于桌面端
```

### 最小触控尺寸（Minimum Touch Target Sizes）

| 平台（Platform） | 最小值（Minimum） | 推荐值（Recommended） | 适用（Use For） |
|------------------|------------------|-----------------------|-----------------|
| **iOS (HIG)** | 44pt × 44pt | 48pt+ | 所有可点元素 |
| **Android (Material)** | 48dp × 48dp | 56dp+ | 所有可点元素 |
| **WCAG 2.2** | 44px × 44px | - | 无障碍合规 |
| **关键操作** | - | 56-64px | 主要 CTA、破坏性操作 |

### 视觉尺寸 vs 命中区（Visual Size vs Hit Area）

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │    [  BUTTON  ]         │ ← 视觉：36px
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │ ← 命中区：48px（padding 扩展）
└─────────────────────────────────────┘

✅ 正确：视觉可以更小，只要命中区 ≥ 44-48px
❌ 错误：命中区与视觉尺寸一样小
```

### 规则应用（Application Rules）

| 元素（Element） | 视觉尺寸（Visual Size） | 命中区（Hit Area） |
|-----------------|--------------------------|---------------------|
| 图标按钮 | 24-32px | 44-48px（padding） |
| 文本链接 | 任意 | 高度 ≥ 44px |
| 列表项 | 全宽 | 高度 48-56px |
| 复选/单选 | 20-24px | 44-48px 命中区 |
| 关闭/X 按钮 | 24px | ≥ 44px |
| Tab Bar 项 | 图标 24-28px | Tab 宽度全占，iOS 高度 49px |

---

## 2. 拇指热区（Thumb Zone Anatomy）

### 单手持机（One-Handed Phone Usage）

```
研究显示：49% 用户单手使用手机。

┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐    │
│  │       HARD TO REACH         │    │ ← 顶部状态栏、导航
│  │      (requires stretch)     │    │    放：返回、菜单、设置
│  │                             │    │
│  ├─────────────────────────────┤    │
│  │                             │    │
│  │       OK TO REACH           │    │ ← 内容区
│  │      (comfortable)          │    │    放：次级操作、内容
│  │                             │    │
│  ├─────────────────────────────┤    │
│  │                             │    │
│  │       EASY TO REACH         │    │ ← Tab Bar、FAB 热区
│  │      (thumb's arc)          │    │    放：主 CTA
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│          [    HOME    ]             │
└─────────────────────────────────────┘
```

### 拇指弧线（右手用户）

```
Right hand holding phone:

┌───────────────────────────────┐
│  STRETCH      STRETCH    OK   │
│                               │
│  STRETCH        OK       EASY │
│                               │
│    OK          EASY      EASY │
│                               │
│   EASY         EASY      EASY │
└───────────────────────────────┘

左手用户是镜像。
→ 需兼顾左右手或默认右手为主
```

### 布局放置建议（Placement Guidelines）

| 元素类型（Element Type） | 理想位置（Ideal Position） | 理由（Reason） |
|--------------------------|-----------------------------|---------------|
| **主 CTA** | 底部中间/右侧 | 拇指易达 |
| **Tab Bar** | 底部 | 符合自然位置 |
| **FAB** | 右下 | 右手易达 |
| **导航入口** | 顶部（需伸手） | 使用频率低 |
| **破坏性操作** | 左上 | 难触达 → 降误触 |
| **取消/关闭** | 左上 | 习惯 + 安全 |
| **确认/完成** | 右上或底部 | 习惯 |

### 大屏手机（>6"）

```
在大屏手机上，顶部 40% 变成“单手死区”。

解决方案：
├── Reachability（iOS）
├── 下拉式界面（drawer 下拉）
├── Bottom sheet 导航
├── 悬浮操作按钮（FAB）
└── 用手势替代顶部操作
```

---

## 3. 触控 vs 点击心理学（Touch vs Click Psychology）

### 预期差异（Expectation Differences）

| 维度（Aspect） | Click（Desktop） | Touch（Mobile） |
|---------------|------------------|-----------------|
| **反馈时延** | 可等待 100ms | 期待即时（<50ms） |
| **视觉反馈** | Hover → Click | 立即点按反馈 |
| **容错** | 易重试 | 更挫败、易感“坏掉” |
| **精度** | 高 | 低 |
| **菜单** | 右键 | 长按 |
| **取消** | ESC | 滑走/点空白 |

### 触控反馈要求（Touch Feedback Requirements）

```
点击 → 立即视觉反馈（< 50ms）
├── 高亮态（背景色变化）
├── 轻微缩放（0.95-0.98）
├── Ripple（Android Material）
├── 触感反馈确认
└── 绝对不能“无反应”

加载 → 100ms 内提示
├── 动作 > 100ms
├── 显示 spinner/progress
├── 按钮禁用（防连点）
└── 能做就用 Optimistic UI
```

### “胖手指”问题（The "Fat Finger" Problem）

```
问题：手指遮挡目标
├── 用户看不到准确点击位置
├── 反馈出现在手指下方
└── 错误率上升

解决方案：
├── 在触点上方显示反馈（tooltip）
├── 精准任务提供偏移光标
├── 文本选择提供放大镜
└── 足够大的目标让精度无关紧要
```

---

## 4. 手势心理学（Gesture Psychology）

### 手势可发现性问题（Gesture Discoverability Problem）

```
问题：手势不可见
├── 用户必须自行发现/记住
├── 无 hover/视觉提示
├── 心智模型与点击不同
└── 很多用户永远不会发现手势

解决方案：必须提供可见替代
├── 左滑删除 → 同时提供删除按钮/菜单
├── 下拉刷新 → 同时提供刷新按钮
├── 双指缩放 → 同时提供缩放控制
└── 手势是捷径，而不是唯一入口
```

### 常见手势约定（Common Gesture Conventions）

| 手势（Gesture） | 通用语义（Universal Meaning） | 使用场景（Usage） |
|-----------------|-------------------------------|------------------|
| **Tap** | 选择、激活 | 主动作 |
| **Double tap** | 放大、点赞 | 快速操作 |
| **Long press** | 上下文菜单、选择模式 | 次级操作 |
| **Swipe horizontal** | 导航、删除、操作 | 列表行为 |
| **Swipe down** | 刷新、关闭 | 下拉刷新 |
| **Pinch** | 放大/缩小 | 地图、图片 |
| **Two-finger scroll** | 嵌套滚动 | 内嵌滚动区 |

### 手势可感知性设计（Gesture Affordance Design）

```
滑动操作需要视觉提示：

┌─────────────────────────────────────────┐
│  ┌───┐                                  │
│  │ ≡ │  Item with hidden actions...   → │ ← 边缘提示（颜色露出）
│  └───┘                                  │
└─────────────────────────────────────────┘

✅ 好：边缘轻微露色提示可滑动
✅ 好：拖拽手柄图标（≡）暗示可排序
✅ 好：Onboarding tooltip 解释手势
❌ 坏：隐藏手势且无任何提示
```

### 平台手势差异（Platform Gesture Differences）

| 手势（Gesture） | iOS | Android |
|-----------------|-----|---------|
| **Back** | 左边缘滑动 | 系统返回键/手势 |
| **Share** | Action Sheet | Share Sheet |
| **Context menu** | 长按 / Force touch | 长按 |
| **Dismiss modal** | 下滑关闭 | 返回键或滑动 |
| **Delete in list** | 左滑后点删除 | 左滑即删或撤销 |

---

## 5. 触感反馈模式（Haptic Feedback Patterns）

### 为什么触感重要（Why Haptics Matter）

```
Haptics 带来的价值：
├── 不看屏也能确认操作
├── 更高级、更“真”的体验
├── 无障碍收益（盲人用户）
├── 降低误触
└── 提升情绪满足感

没有 haptics：
├── 体验廉价，像网页
├── 用户不确定是否已触发
└── 错失体验加分项
```

### iOS 触感类型（iOS Haptic Types）

| 类型（Type） | 强度（Intensity） | 场景（Use Case） |
|-------------|-------------------|------------------|
| `selection` | Light | Picker 滚动、开关、选择 |
| `light` | Light | 轻动作、hover 替代 |
| `medium` | Medium | 标准点击确认 |
| `heavy` | Strong | 重要完成、落地动作 |
| `success` | Pattern | 任务成功完成 |
| `warning` | Pattern | 警告与提醒 |
| `error` | Pattern | 出错反馈 |

### Android 触感类型（Android Haptic Types）

| 类型（Type） | 场景（Use Case） |
|-------------|------------------|
| `CLICK` | 标准点击反馈 |
| `HEAVY_CLICK` | 重要动作 |
| `DOUBLE_CLICK` | 确认动作 |
| `TICK` | 滚动/滑动反馈 |
| `LONG_PRESS` | 长按触发 |
| `REJECT` | 错误/无效操作 |

### 触感使用准则（Haptic Usage Guidelines）

```
✅ 适合使用 haptics 的场景：
├── 按钮点击
├── Toggle 开关
├── Picker/Slider 值变化
├── 下拉刷新触发
├── 成功操作完成
├── 错误与警告
├── 滑动操作达到阈值
└── 重要状态变化

❌ 不适合使用 haptics 的场景：
├── 每个滚动位置
├── 每条列表项
├── 后台事件
├── 被动展示
└── 频率过高（触感疲劳）
```

### 触感强度映射（Haptic Intensity Mapping）

| 动作重要性（Action Importance） | 触感级别（Haptic Level） | 示例（Example） |
|-------------------------------|---------------------------|----------------|
| 轻操作/浏览 | Light / None | 滚动、Hover
| 标准操作 | Medium / Selection | 点击、切换
| 重要操作 | Heavy / Success | 完成、确认
| 关键/破坏性 | Heavy / Warning | 删除、支付
| 错误 | Error pattern | 操作失败

---

## 6. 移动端认知负荷（Mobile Cognitive Load）

### 移动端与桌面差异（How Mobile Differs from Desktop）

| 因素（Factor） | Desktop | Mobile | 含义（Implication） |
|---------------|---------|--------|---------------------|
| **注意力** | 连续专注 | 频繁中断 | 设计应适配碎片化 |
| **环境** | 可控 | 随时随地 | 处理弱光/噪音 |
| **多任务** | 多窗口 | 单 App | 尽量一次完成任务 |
| **输入速度** | 快（键盘） | 慢（触控） | 减少输入、智能默认值 |
| **纠错** | 便捷（快捷键） | 困难 | 防错 + 易恢复 |

### 降低移动端认知负荷（Reducing Mobile Cognitive Load）

```
1. 每屏只放一个主动作（ONE PRIMARY ACTION）
   └── 下一步必须清晰

2. 渐进披露（PROGRESSIVE DISCLOSURE）
   └── 只展示当前需要的信息

3. 智能默认值（SMART DEFAULTS）
   └── 能预填就预填

4. 分块（CHUNKING）
   └── 长表单拆分步骤

5. 识别优先于记忆（RECOGNITION over RECALL）
   └── 给选项，不让用户记

6. 上下文保留（CONTEXT PERSISTENCE）
   └── 中断/后台保存状态
```

### 移动端米勒定律（Miller's Law for Mobile）

```
桌面：7±2
移动：建议 5±1（干扰更大）

导航：Tab Bar 最多 5 个
选项：每层最多 5 个
步骤：进度展示最多 5 步
```

### 移动端希克定律（Hick's Law for Mobile）

```
选择越多，决策越慢

移动端影响更严重：
├── 屏幕更小，整体难看全
├── 需要滚动，已看内容易遗忘
├── 中断更频繁
└── 决策疲劳更快

解决方案：渐进披露
├── 首屏只给 3-5 个选项
├── 用 "More" 承接额外选项
├── 按使用频率排序
└── 记住用户上次选择
```

---

## 7. 触控无障碍（Touch Accessibility）

### 运动障碍考虑（Motor Impairment Considerations）

```
运动障碍用户可能：
├── 有抖动（需更大目标）
├── 使用辅助设备（输入方式不同）
├── 单手使用（触达受限）
├── 需要更多时间（避免超时）
└── 更容易误触（需要确认）

设计响应：
├── 更大的触控目标（48dp+）
├── 手势时间可调整
├── 破坏性操作支持撤销
├── 支持 Switch Control
└── 支持语音控制
```

### 触控间距标准（Touch Target Spacing, A11y）

```
WCAG 2.2 Success Criterion 2.5.8：

触控目标必须满足：
├── 宽度 ≥ 44px
├── 高度 ≥ 44px
├── 相邻间距 ≥ 8px

或满足以下条件：
├── 行内文本（Inline）
├── 用户可自行放大（User-controlled）
├── 必要目标（Essential）
```

### 可达触控模式（Accessible Touch Patterns）

| 模式（Pattern） | 可达实现（Accessible Implementation） |
|----------------|----------------------------------------|
| Swipe actions | 提供菜单替代 |
| Drag and drop | 提供选择 + 移动选项 |
| Pinch zoom | 提供缩放按钮 |
| Force touch | 提供长按替代 |
| Shake gesture | 提供按钮替代 |

---

## 8. 触感中的情绪（Emotion in Touch）

### 高级感来源（The Premium Feel）

```
“高级触感”来自：
├── 即时响应（< 50ms）
├── 合理的 haptic 反馈
├── 顺滑 60fps 动画
├── 正确的阻尼与物理感
├── 适度音效（场景合适时）
└── 对弹簧物理的细节关注
```

### 情绪化触控反馈（Emotional Touch Feedback）

| 情绪（Emotion） | 触控反馈（Touch Response） |
|----------------|---------------------------|
| Success | 成功 haptic + confetti/check |
| Error | 错误 haptic + 抖动动画 |
| Warning | 警告 haptic + 注意色 |
| Delight | 预期外的顺滑动画 |
| Power | 关键动作的重触感 |

### 通过触控建立信任（Trust Building Through Touch）

```
触控中的信任信号：
├── 一致行为（同操作=同反馈）
├── 可靠反馈（不默默失败）
├── 敏感操作更“安全”的手感
├── 专业级动画（不抖）
└── 破坏性操作要确认
```

---

## 9. 触控心理学清单（Touch Psychology Checklist）

### 每个屏幕前（Before Every Screen）

- [ ] **所有触控目标 ≥ 44-48px？**
- [ ] **主 CTA 在拇指热区？**
- [ ] **破坏性操作有确认？**
- [ ] **手势有可见替代入口？**
- [ ] **关键操作有触感反馈？**
- [ ] **点击有即时视觉反馈？**
- [ ] **>100ms 动作有加载态？**

### 发布前（Before Release）

- [ ] **最小设备测试？**
- [ ] **大屏单手测试？**
- [ ] **所有手势有可见替代？**
- [ ] **触感在真机可用？**
- [ ] **无障碍设置下测试触控目标？**
- [ ] **没有过小的关闭按钮/图标？**

---

## 10. 速查卡（Quick Reference Card）

### 触控目标尺寸（Touch Target Sizes）

```
                     iOS        Android     WCAG
Minimum:           44pt       48dp       44px
Recommended:       48pt+      56dp+      -
Spacing:           8pt+       8dp+       8px+
```

### 拇指热区动作（Thumb Zone Actions）

```
TOP:      Navigation, settings, back（低频）
MIDDLE:   Content, secondary actions（次级）
BOTTOM:   Primary CTA, tab bar, FAB（高频）
```

### Haptic 选择（Haptic Selection）

```
Light:    Selection, toggle, minor
Medium:   Tap, standard action
Heavy:    Confirm, complete, drop
Success:  Task done
Error:    Failed action
Warning:  Attention needed
```

---

> **记住（Remember）**：每一次触控都是用户与设备的对话。要让它自然、响应、尊重人手的真实物理条件，而不是假设“像鼠标一样精准”。
