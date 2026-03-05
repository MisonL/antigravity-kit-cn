# 视觉效果参考（Visual Effects Reference）

> 现代 CSS 视觉效果的原则与技术：先理解概念，再做场景化变化。
> **不要复制固定参数，重点是掌握模式（patterns）。**

---

## 1. 玻璃拟态原则（Glassmorphism Principles）

### 玻璃拟态为什么成立（What Makes Glassmorphism Work）

```
关键属性：
├── 半透明背景（不是纯实色）
├── 背景模糊（backdrop blur，磨砂玻璃感）
├── 轻边框（定义边界）
└── 常见搭配：轻阴影增强层次
```

### 模式（Pattern，可自定义参数）

```css
.glass {
  /* 透明度：按内容可读性调整 */
  background: rgba(R, G, B, OPACITY);
  /* OPACITY：深背景常用 0.1-0.3，浅背景常用 0.5-0.8 */

  /* 模糊：越高越“磨砂” */
  backdrop-filter: blur(AMOUNT);
  /* AMOUNT：8-12px 较克制，16-24px 更明显 */

  /* 边框：用于定义边界 */
  border: 1px solid rgba(255, 255, 255, OPACITY);
  /* OPACITY：常见 0.1-0.3 */

  /* 圆角：与设计系统一致 */
  border-radius: YOUR_RADIUS;
}
```

### 何时使用玻璃拟态（When to Use Glassmorphism）
- ✅ 叠在彩色/图片背景上。
- ✅ Modal、Overlay、Card 等浮层组件。
- ✅ 背后有滚动内容的导航条。
- ❌ 文本密集内容区（可读性风险）。
- ❌ 纯色简背景场景（收益很低）。

### 何时不应使用（When NOT to Use）
- 低对比度场景。
- 无障碍要求非常高的核心信息区。
- 性能受限设备。

---

## 2. 新拟态原则（Neomorphism Principles）

### 新拟态为什么成立（What Makes Neomorphism Work）

```
核心：使用“双阴影（DUAL shadows）”制造柔和浮雕感
├── 亮阴影（模拟光源方向）
├── 暗阴影（反向）
└── 背景色与父容器一致（same color）
```

### 模式（The Pattern）

```css
.neo-raised {
  /* 背景必须与父容器一致 */
  background: SAME_AS_PARENT;

  /* 双阴影：亮向 + 暗向 */
  box-shadow:
    OFFSET OFFSET BLUR rgba(light-color),
    -OFFSET -OFFSET BLUR rgba(dark-color);

  /* OFFSET：常见 6-12px */
  /* BLUR：常见 12-20px */
}

.neo-pressed {
  /* inset 形成“按下去”效果 */
  box-shadow:
    inset OFFSET OFFSET BLUR rgba(dark-color),
    inset -OFFSET -OFFSET BLUR rgba(light-color);
}
```

### 无障碍提醒（Accessibility Warning）
⚠️ **对比度通常偏低**，要克制使用并确保边界清晰。

### 适用场景（When to Use）
- 装饰性元素。
- 轻交互状态反馈。
- 扁平底色的极简 UI。

---

## 3. 阴影层级原则（Shadow Hierarchy Principles）

### 概念：阴影代表“海拔”（elevation）

```
海拔越高，阴影越大
├── Level 0：无阴影（贴在表面）
├── Level 1：轻阴影（微抬起）
├── Level 2：中阴影（卡片、按钮）
├── Level 3：大阴影（弹窗、下拉）
└── Level 4：深阴影（漂浮元素）
```

### 阴影可调参数（Shadow Properties to Adjust）

```css
box-shadow: OFFSET-X OFFSET-Y BLUR SPREAD COLOR;

/* Offset：阴影方向 */
/* Blur：柔和程度（越大越软） */
/* Spread：扩散范围 */
/* Color：通常是低透明度黑色 */
```

### 自然阴影原则（Principles for Natural Shadows）

1. **Y-offset 大于 X-offset**（符合上方光源直觉）。
2. **透明度控制**（5-15% 克制，15-25% 更明显）。
3. **多层阴影**更真实（环境光 + 直射光）。
4. **偏移越大，模糊也应越大**。

### 深色模式阴影（Dark Mode Shadows）
- 深背景下阴影可见性更弱。
- 可适度提高透明度。
- 或改用 glow/highlight 做层次。

---

## 4. 渐变原则（Gradient Principles）

### 渐变类型与场景（Types and When to Use）

| 类型（Type） | 形式（Pattern） | 场景（Use Case） |
|--------------|-----------------|------------------|
| **Linear** | 颜色 A → 颜色 B 线性过渡 | 背景、按钮、标题区 |
| **Radial** | 从中心向外扩散 | 聚焦、光斑 |
| **Conic** | 围绕中心旋转过渡 | 饼图、创意效果 |

### 如何做和谐渐变（Creating Harmonious Gradients）

```
优质渐变规则：
├── 优先使用相邻色（analogous）
├── 或同色相的明度变化
├── 避免直接互补色硬拼（容易刺眼）
└── 增加中间停点让过渡更平滑
```

### 渐变语法模式（Gradient Syntax Pattern）

```css
.gradient {
  background: linear-gradient(
    DIRECTION,           /* 角度或 to-关键词 */
    COLOR-STOP-1,        /* 颜色 + 可选位置 */
    COLOR-STOP-2,
    /* ... more stops */
  );
}

/* DIRECTION 示例： */
/* 90deg, 135deg, to right, to bottom right */
```

### Mesh 渐变（Mesh Gradients）

```
多个径向渐变叠加：
├── 每个渐变位于不同位置
├── 每个渐变都有透明衰减
├── Hero 区常用于制造“Wow”感
└── 可形成有机彩色氛围（可搜索：Aurora Gradient CSS）
```

---

## 5. 边框效果原则（Border Effects Principles）

### 渐变边框（Gradient Borders）

```
技术路线：伪元素 + 渐变背景
├── 元素 padding 作为边框厚度
├── 伪元素铺满渐变
└── 通过 mask/clip 实现“只显示边框”
```

### 动态边框（Animated Borders）

```
技术路线：旋转渐变或锥形扫描（conic sweep）
├── 伪元素略大于内容
├── 动画旋转渐变
└── 用 overflow hidden 裁切形状
```

### 发光边框（Glow Borders）

```css
/* 多层 box-shadow 叠加发光 */
box-shadow:
  0 0 SMALL-BLUR COLOR,
  0 0 MEDIUM-BLUR COLOR,
  0 0 LARGE-BLUR COLOR;

/* 每一层都在增强发光范围 */
```

---

## 6. 发光效果原则（Glow Effects Principles）

### 文字发光（Text Glow）

```css
text-shadow:
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR,
  0 0 BLUR-3 COLOR;

/* 层数越多，发光越强 */
/* 模糊越大，扩散越柔 */
```

### 元素发光（Element Glow）

```css
box-shadow:
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR;

/* 使用与元素相近的颜色更自然 */
/* 低透明度偏克制，高透明度偏霓虹 */
```

### 脉冲发光动画（Pulsing Glow Animation）

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 SMALL-BLUR COLOR; }
  50% { box-shadow: 0 0 LARGE-BLUR COLOR; }
}

/* 动画曲线与时长共同决定体感 */
```

---

## 7. 覆盖层技术（Overlay Techniques）

### 图片渐变遮罩（Gradient Overlay on Images）

```
目的：提升图上文字可读性
模式：从透明渐变到不透明
位置：对准文字出现区域
```

```css
.overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    DIRECTION,
    transparent PERCENTAGE,
    rgba(0,0,0,OPACITY) 100%
  );
}
```

### 彩色遮罩（Colored Overlay）

```css
/* Blend mode 或分层渐变 */
background:
  linear-gradient(YOUR-COLOR-WITH-OPACITY),
  url('image.jpg');
```

---

## 8. 现代 CSS 技术（Modern CSS Techniques）

### 容器查询（Container Queries, Concept）

```
区别于 viewport 断点：
├── 组件响应“自己的容器”
├── 更模块化、可复用
└── 语法：@container (condition) { }
```

### `:has()` 选择器（Concept）

```
基于子元素反向影响父元素样式：
├── “包含某类子元素的父元素”
├── 能实现以往难做的模式
└── 建议走渐进增强（progressive enhancement）
```

### 滚动驱动动画（Scroll-Driven Animations, Concept）

```
动画进度绑定滚动：
├── 元素进入/退出动画
├── 视差效果（parallax）
├── 进度指示器
└── 可用 view-based 或 scroll-based timeline
```

---

## 9. 性能原则（Performance Principles）

### GPU 友好属性（GPU-Accelerated Properties）

```
低成本动画（GPU）：
├── transform（translate、scale、rotate）
└── opacity

高成本动画（CPU）：
├── width、height
├── top、left、right、bottom
├── margin、padding
└── box-shadow（需要重复计算）
```

### `will-change` 使用建议（will-change Usage）

```css
/* 仅在重动画场景、且克制使用 */
.heavy-animation {
  will-change: transform;
}

/* 动画结束后可移除，避免长期占用优化资源 */
```

### 减少动态（Reduced Motion）

```css
@media (prefers-reduced-motion: reduce) {
  /* 禁用或显著减弱动画 */
  /* 尊重用户系统偏好 */
}
```

---

## 10. 效果选型检查清单（Effect Selection Checklist）

应用任何视觉效果前：

- [ ] **是否有明确目的？**（不是纯装饰）
- [ ] **是否符合场景语境？**（品牌、受众）
- [ ] **是否区别于上一个项目？**（避免重复）
- [ ] **是否无障碍友好？**（对比、动效敏感）
- [ ] **是否性能可控？**（尤其移动端）
- [ ] **是否询问过用户偏好？**（当风格开放时）

### 反模式（Anti-Patterns）

- ❌ 所有元素都套 Glassmorphism（廉价感/杂乱感）。
- ❌ 默认深色 + 霓虹（典型 AI 模板化风格）。
- ❌ **纯静态/纯平面且缺乏层次（FAILED）**。
- ❌ 效果损害文字可读性。
- ❌ 无意义动画。

---

> **记住（Remember）**：视觉效果应“强化信息语义”。基于目的与上下文选择，而不是只因为“看起来很酷”。
