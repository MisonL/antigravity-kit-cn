# 动效图形参考（Motion Graphics Reference）

> 面向高质量 Web 体验的高级动效技术：Lottie、GSAP、SVG、3D、Particle（粒子）效果。
> **先理解原则，再做真正有价值的惊艳动效。**

---

## 1. Lottie 动画（Lottie Animations）

### 什么是 Lottie？

```
基于 JSON 的矢量动画：
├── 由 After Effects 通过 Bodymovin 导出
├── 体积轻量（通常比 GIF/视频更小）
├── 可缩放（矢量渲染，不会像素化）
├── 可交互（可控制播放、分段）
└── 跨平台（Web、iOS、Android、React Native）
```

### 何时使用 Lottie

| 场景（Use Case） | 为什么用 Lottie（Why Lottie） |
|------------------|-------------------------------|
| **加载动画（Loading animations）** | 品牌一致、流畅且轻量 |
| **空状态（Empty states）** | 更有吸引力的插画表达 |
| **引导流程（Onboarding flows）** | 适合复杂多步骤动画 |
| **成功/错误反馈（Success/Error feedback）** | 更有愉悦感的微交互 |
| **动态图标（Animated icons）** | 跨平台风格一致 |

### 设计原则（Principles）

- 文件体积尽量控制在 100KB 以内，保证性能。
- 循环播放（loop）应克制，避免分散注意力。
- 为 `prefers-reduced-motion` 提供静态回退。
- 尽可能按需（lazy load）加载动画资源。

### 资源来源（Sources）

- LottieFiles.com（免费资源库）
- After Effects + Bodymovin（自定义导出）
- Figma 插件（从设计稿导出）

---

## 2. GSAP（GreenSock）

### GSAP 的差异化能力

```
专业级时间线动画系统：
├── 可精确控制动效序列
├── ScrollTrigger 支持滚动驱动动画
├── MorphSVG 支持图形形态过渡
├── 物理风格缓动（physics-based easing）
└── 可作用于任意 DOM 元素
```

### 核心概念（Core Concepts）

| 概念（Concept） | 作用（Purpose） |
|-----------------|-----------------|
| **Tween** | 单次 A→B 动画 |
| **Timeline** | 可编排/重叠的动画序列 |
| **ScrollTrigger** | 由滚动位置控制播放 |
| **Stagger** | 元素级联（错峰）出现效果 |

### 何时使用 GSAP

- ✅ 复杂的序列化动效。
- ✅ 需要滚动触发（scroll-triggered）的揭示动画。
- ✅ 对时间控制精度要求高。
- ✅ 需要 SVG 形态变换（morphing）。
- ❌ 仅简单 hover/focus 动效（优先 CSS）。
- ❌ 极致性能受限的移动端场景（库体积与运行开销更高）。

### 设计原则（Principles）

- 使用 Timeline 做编排，而不是零散 Tween。
- Stagger 延迟建议 0.05-0.15s。
- ScrollTrigger 触发点建议在视口进入 70-80%。
- 组件卸载（unmount）时清理动画，防止内存泄漏。

---

## 3. SVG 动画（SVG Animations）

### SVG 动画类型

| 类型（Type） | 技术（Technique） | 场景（Use Case） |
|--------------|-------------------|------------------|
| **线稿绘制（Line Drawing）** | `stroke-dashoffset` | Logo 显示、签名字效 |
| **形态变换（Morph）** | 路径插值（Path interpolation） | 图标状态切换 |
| **变换（Transform）** | `rotate` / `scale` / `translate` | 交互式图标 |
| **颜色过渡（Color）** | `fill` / `stroke` transition | 状态变化反馈 |

### 线稿绘制原理（Line Drawing Principles）

```
stroke-dashoffset 绘制机制：
├── 将 dasharray 设为路径长度
├── 将 dashoffset 设为与 dasharray 相等（初始隐藏）
├── 动画将 dashoffset 过渡到 0（路径显现）
└── 形成“手绘出现”效果
```

### 何时使用 SVG 动画

- ✅ Logo 展示、品牌记忆点。
- ✅ 图标状态过渡（如 hamburger ↔ X）。
- ✅ 信息图、数据可视化。
- ✅ 可交互插画。
- ❌ 写实照片类内容（更适合视频）。
- ❌ 极复杂场景（性能成本高）。

### 设计原则（Principles）

- 动态获取路径长度，保证动画准确。
- 完整线稿建议时长 1-3s。
- 缓动推荐 `ease-out`，更自然。
- 填充动画应辅助主体，不与主动作竞争。

---

## 4. CSS 3D 变换（3D CSS Transforms）

### 核心属性（Core Properties）

```
CSS 3D 空间：
├── perspective：3D 景深（常见 500-1500px）
├── transform-style: preserve-3d（启用子元素 3D）
├── rotateX/Y/Z：按轴旋转
├── translateZ：沿 Z 轴远近位移
└── backface-visibility：控制背面是否可见
```

### 常见 3D 模式（Common 3D Patterns）

| 模式（Pattern） | 场景（Use Case） |
|-----------------|------------------|
| **卡片翻转（Card flip）** | 信息揭示、产品视图 |
| **悬停倾斜（Tilt on hover）** | 交互卡片、景深强化 |
| **视差分层（Parallax layers）** | 首屏 Hero、沉浸滚动 |
| **3D 轮播（3D carousel）** | 图库、滑动展示 |

### 设计原则（Principles）

- `perspective`：800-1200px 更克制，400-600px 更戏剧化。
- 变换组合保持简洁（优先 rotate + translate）。
- 翻转场景确保 `backface-visibility: hidden`。
- 必测 Safari（渲染细节差异明显）。

---

## 5. 粒子效果（Particle Effects）

### 粒子系统类型（Types of Particle Systems）

| 类型（Type） | 氛围（Feel） | 场景（Use Case） |
|--------------|--------------|------------------|
| **几何粒子（Geometric）** | 科技、网络感 | SaaS、科技官网 |
| **彩带粒子（Confetti）** | 庆祝感 | 成功反馈时刻 |
| **雪/雨粒子（Snow/Rain）** | 氛围感 | 季节主题、情绪化页面 |
| **尘埃/散景（Dust/Bokeh）** | 梦幻、轻奢 | 摄影、品牌展示 |
| **萤火粒子（Fireflies）** | 魔幻感 | 游戏、幻想主题 |

### 常用库（Libraries）

| 库（Library） | 适用点（Best For） |
|---------------|--------------------|
| **tsParticles** | 配置灵活、相对轻量 |
| **particles.js** | 简单背景效果 |
| **Canvas API** | 自定义能力强、控制最大 |
| **Three.js** | 复杂 3D 粒子场景 |

### 设计原则（Principles）

- 默认粒子量建议 30-50，避免压过内容。
- 速度建议 0.5-2，保持缓慢有机。
- 透明度建议 0.3-0.6，不喧宾夺主。
- “网络连线”应使用弱线条，避免视觉噪声。
- ⚠️ 移动端应关闭或降级粒子效果。

### 何时使用（When to Use）

- ✅ Hero 背景氛围增强。
- ✅ 成功庆祝（如彩带爆发）。
- ✅ 科技可视化（节点连接）。
- ❌ 内容密集页面（干扰阅读）。
- ❌ 低性能设备（耗电与掉帧风险）。

---

## 6. 滚动驱动动画（Scroll-Driven Animations）

### 原生 CSS（现代方案）

```
CSS Scroll Timelines：
├── animation-timeline: scroll() - 绑定文档滚动
├── animation-timeline: view() - 绑定元素进入视口
├── animation-range: entry/exit 设定区间
└── 无需 JavaScript
```

### 设计原则（Principles）

| 触发点（Trigger Point） | 场景（Use Case） |
|-------------------------|------------------|
| **Entry 0%** | 元素开始进入时 |
| **Entry 50%** | 元素一半可见时 |
| **Cover 50%** | 元素中心经过视口中心时 |
| **Exit 100%** | 元素完全离开时 |

### 最佳实践（Best Practices）

- Reveal（显现）动画建议在 entry ~25% 开始。
- Parallax（视差）适合用连续滚动进度。
- Sticky（粘性）元素适合使用 cover 区间。
- 必须实测滚动性能，避免卡顿。

---

## 7. 性能原则（Performance Principles）

### GPU 与 CPU 动画成本

```
低成本（GPU 加速）：
├── transform（translate、scale、rotate）
├── opacity
└── filter（谨慎使用）

高成本（会触发布局/重排）：
├── width、height
├── top、left、right、bottom
├── padding、margin
└── 复杂 box-shadow
```

### 优化清单（Optimization Checklist）

- [ ] 尽量只动画 `transform` / `opacity`。
- [ ] 重动画前短时使用 `will-change`（结束后移除）。
- [ ] 在低端设备上做实际测试。
- [ ] 实现 `prefers-reduced-motion`。
- [ ] 动画库按需加载。
- [ ] 对滚动计算做节流（throttle）。

---

## 8. 动效选型决策树（Motion Graphics Decision Tree）

```
你需要哪类动画？
│
├── 品牌级复杂动画？
│   └── Lottie（After Effects 导出）
│
├── 序列化 + 滚动触发？
│   └── GSAP + ScrollTrigger
│
├── Logo/图标动画？
│   └── SVG 动画（stroke 或 morph）
│
├── 可交互 3D 效果？
│   └── CSS 3D Transforms（简单）或 Three.js（复杂）
│
├── 氛围型背景？
│   └── tsParticles 或 Canvas
│
└── 简单入场/悬停？
    └── CSS @keyframes 或 Framer Motion
```

---

## 9. 反模式（Anti-Patterns）

| ❌ 不要这样做（Don't） | ✅ 推荐这样做（Do） |
|------------------------|--------------------|
| 所有元素同时动起来 | 用 Stagger 与序列化控制节奏 |
| 简单效果也上重库 | 先用 CSS 起步 |
| 忽略 reduced-motion | 始终提供降级方案 |
| 阻塞主线程 | 以 60fps 为目标做优化 |
| 每个项目都复用同一粒子效果 | 根据品牌与场景匹配 |
| 移动端堆复杂特效 | 做能力检测与特性降级 |

---

## 10. 速查表（Quick Reference）

| 效果（Effect） | 工具（Tool） | 性能级别（Performance） |
|----------------|--------------|--------------------------|
| Loading spinner | CSS / Lottie | Light（轻） |
| Staggered reveal | GSAP / Framer | Medium（中） |
| SVG path draw | CSS stroke | Light（轻） |
| 3D card flip | CSS transforms | Light（轻） |
| Particle background | tsParticles | Heavy（重） |
| Scroll parallax | GSAP ScrollTrigger | Medium（中） |
| Shape morphing | GSAP MorphSVG | Medium（中） |

---

> **记住（Remember）**：动效必须“增强信息传达”，而不是“制造干扰”。每个动画都应服务明确目的：反馈、引导、愉悦或叙事。
