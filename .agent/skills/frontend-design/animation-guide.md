# 动效指南参考 (Animation Guidelines Reference)

> 动效原则与时序心理学。学会做决策，而不是复制参数。  
> **不要死记固定时长，要理解“什么因素影响时序”。**

---

## 1. 时长原则 (Duration Principles)

### 什么决定动效速度 (What Affects Timing)

```
Factors that determine animation speed:
├── DISTANCE: Further travel = longer duration
├── SIZE: Larger elements = slower animations
├── COMPLEXITY: Complex = slower to process
├── IMPORTANCE: Critical actions = clear feedback
└── CONTEXT: Urgent = fast, luxurious = slow
```

### 按目的划分的时长区间

| Purpose | Range | Why |
|---------|-------|-----|
| 即时反馈 | 50-100ms | 低于明显感知阈值 |
| 微交互 | 100-200ms | 快且可感知 |
| 标准过渡 | 200-300ms | 节奏舒适 |
| 复杂动画 | 300-500ms | 给用户跟随时间 |
| 页面切换 | 400-600ms | 交接更顺滑 |
| **Wow/Premium 效果** | 800ms+ | 戏剧化、有机弹簧、分层表达 |

### 选择时长时问自己

1. 元素移动距离有多远？
2. 这个变化是否必须被用户明确注意？
3. 用户是在等待，还是背景动效？

---

## 2. 缓动原则 (Easing Principles)

### 缓动在做什么 (What Easing Does)

```
Easing = how speed changes over time
├── Linear: constant speed (mechanical, robotic)
├── Ease-out: fast start, slow end (natural entry)
├── Ease-in: slow start, fast end (natural exit)
└── Ease-in-out: slow both ends (smooth, deliberate)
```

### 各缓动的适用场景

| Easing | Best For | Feels Like |
|--------|----------|------------|
| **Ease-out** | 元素进入 | 到达、落定 |
| **Ease-in** | 元素离开 | 离场、抽离 |
| **Ease-in-out** | 强调、循环 | 平滑、从容 |
| **Linear** | 连续运动 | 机械、恒定 |
| **Bounce/Elastic** | 活泼界面 | 趣味、弹性 |

### 常用模式

```css
/* Entering view = ease-out (decelerate) */
.enter {
  animation-timing-function: ease-out;
}

/* Leaving view = ease-in (accelerate) */
.exit {
  animation-timing-function: ease-in;
}

/* Continuous = ease-in-out */
.continuous {
  animation-timing-function: ease-in-out;
}
```

---

## 3. 微交互原则 (Micro-Interaction Principles)

### 好的微交互在解决什么

```
Purpose of micro-interactions:
├── FEEDBACK: Confirm the action happened
├── GUIDANCE: Show what's possible
├── STATUS: Indicate current state
└── DELIGHT: Small moments of joy
```

### 按钮状态

```
Hover → slight visual change (lift, color, scale)
Active → pressed feeling (scale down, shadow change)
Focus → clear indicator (outline, ring)
Loading → progress indicator (spinner, skeleton)
Success → confirmation (check, color)
```

### 原则

1. **立即响应**（低于 100ms 感知阈值）
2. **动作匹配反馈**（按压用 `scale(0.95)`，悬停可 `translateY(-4px) + glow`）
3. **大胆但平滑**（体现“高手质感”）
4. **反馈一致**（同类动作给同类反馈）

---

## 4. 加载态原则 (Loading States Principles)

### 按场景选择加载表现

| Situation | Approach |
|-----------|----------|
| 快速加载（<1s） | 通常无需指示器 |
| 中等加载（1-3s） | Spinner 或简洁动画 |
| 长加载（3s+） | 进度条或 Skeleton |
| 时长未知 | 不定进度指示 |

### Skeleton 屏

```
Purpose: Reduce perceived wait time
├── Show layout shape immediately
├── Animate subtly (shimmer, pulse)
├── Replace with content when ready
└── Feels faster than spinner
```

### 进度指示器

```
When to show progress:
├── User-initiated action
├── File uploads/downloads
├── Multi-step processes
└── Long operations

When NOT needed:
├── Very quick operations
├── Background tasks
└── Initial page loads (skeleton better)
```

---

## 5. 页面转场原则 (Page Transitions Principles)

### 转场策略

```
Simple rule: exit fast, enter slower
├── Outgoing content fades quickly
├── Incoming content animates in
└── Avoids "everything moving at once"
```

### 常见转场模式

| Pattern | When to Use |
|---------|-------------|
| **Fade** | 安全默认，普适性高 |
| **Slide** | 顺序导航（上一页/下一页） |
| **Scale** | Modal 打开/关闭 |
| **Shared element** | 维持视觉连续性 |

### 方向一致性

```
Navigation direction = animation direction
├── Forward → slide from right
├── Backward → slide from left
├── Deeper → scale up from center
├── Back up → scale down
```

---

## 6. 滚动动效原则 (Scroll Animation Principles)

### 渐进揭示 (Progressive Reveal)

```
Content appears as user scrolls:
├── Reduces initial cognitive load
├── Rewards exploration
├── Must not feel sluggish
└── Option to disable (accessibility)
```

### 触发时机

| When to Trigger | Effect |
|-----------------|--------|
| 刚进入视口 | 标准 reveal |
| 位于视口中心 | 用于重点强调 |
| 部分可见 | 提前触发 |
| 完全可见 | 延后触发 |

### 常用属性

- Fade in（opacity）
- Slide up（transform）
- Scale（transform）
- 组合使用

### 性能要求

- 使用 Intersection Observer
- 仅动画 transform/opacity
- 移动端必要时降级

---

## 7. Hover 效果原则 (Hover Effects Principles)

### 让效果匹配动作语义

| Element | Effect | Intent |
|---------|--------|--------|
| **可点击卡片** | 上浮 + 阴影 | “这是可交互的” |
| **按钮** | 颜色/亮度变化 | “点击我” |
| **图片** | 缩放放大 | “可进一步查看” |
| **链接** | 下划线/变色 | “可跳转” |

### 原则

1. **传达可交互性** - hover 是交互信号
2. **不要过量** - 细微变化已足够
3. **匹配重要性** - 越重要变化可越明显
4. **考虑触屏替代** - 移动端无 hover

---

## 8. 反馈动效原则 (Feedback Animation Principles)

### 成功态

```
Celebrate appropriately:
├── Minor action → subtle check/color
├── Major action → more pronounced animation
├── Completion → satisfying animation
└── Match brand personality
```

### 错误态

```
Draw attention without panic:
├── Color change (semantic red)
├── Shake animation (brief!)
├── Focus on error field
└── Clear messaging
```

### 时序建议

- 成功态：可略长（给用户确认感）
- 错误态：应更快（别阻碍继续操作）
- 加载态：持续直到完成

---

## 9. 性能原则 (Performance Principles)

### 哪些属性动画成本低

```
GPU-accelerated (FAST):
├── transform: translate, scale, rotate
└── opacity: 0 to 1

CPU-intensive (SLOW):
├── width, height
├── top, left, right, bottom
├── margin, padding
├── border-radius changes
└── box-shadow changes
```

### 优化策略

1. **优先动画 transform/opacity**
2. **避免触发布局重排**（尺寸/位置频繁变更）
3. **谨慎使用 will-change**（仅在必要处）
4. **低端设备实测**（不要只看开发机）

### 尊重用户偏好

```css
@media (prefers-reduced-motion: reduce) {
  /* Honor this preference */
  /* Essential animations only */
  /* Reduce or remove decorative motion */
}
```

---

## 10. 动效决策检查清单 (Animation Decision Checklist)

添加动效前，逐项确认：

- [ ] **有明确目的？**（feedback/guidance/delight）
- [ ] **时长合适？**（不过快不过慢）
- [ ] **缓动选对了吗？**（enter/exit/emphasis）
- [ ] **性能可接受？**（优先 transform/opacity）
- [ ] **测试过 reduced motion？**（可访问性）
- [ ] **与其他动效节奏一致？**
- [ ] **不是默认参数套用？**（避免惯性）
- [ ] **需求不清晰时问过用户风格？**

### 反模式

- ❌ 每个项目都用同一套时长
- ❌ 为动而动（无业务目的）
- ❌ 忽略 reduced-motion 偏好
- ❌ 动画高成本属性
- ❌ 同时大量元素并行动画
- ❌ 过长延迟导致用户烦躁

---

> **牢记：** 动画是“沟通”，不是“装饰”。每一次动效都应有意义，并服务于用户体验。
