---
description: Lottie, GSAP, SVG, 3D, 粒子等高级动效技术
---

# 动态图形参考 (Motion Graphics Reference)

> 优质 Web 体验的高级动画技术 - Lottie, GSAP, SVG, 3D, 粒子。
> **学习原则，创造 WOW 效果。**

---

## 1. Lottie 动画

### 什么是 Lottie?

```
基于 JSON 的矢量动画:
├── 通过 Bodymovin 从 After Effects 导出
├── 轻量 (比 GIF/视频小)
├── 可缩放 (矢量，无像素化)
├── 可交互 (控制播放、片段)
└── 跨平台 (Web, iOS, Android, React Native)
```

### 何时使用 Lottie

| 用例              | 为什么选 Lottie?   |
| :---------------- | :----------------- |
| **加载动画**      | 品牌化, 平滑, 轻量 |
| **空状态**        | 吸引人的插画       |
| **引导流程**      | 复杂的多步动画     |
| **成功/错误反馈** | 令人愉悦的微交互   |
| **动画图标**      | 跨平台一致性       |

### 原则

- 文件大小保持在 100KB 以下以保证性能
- 谨慎使用循环 (避免干扰)
- 为减弱动态模式提供静态降级
- 尽可能懒加载动画文件

---

## 2. GSAP (GreenSock)

### GSAP 强在哪里

```
专业的时间轴动画:
├── 对序列的精确控制
├── ScrollTrigger 用于滚动驱动动画
├── MorphSVG 用于形状变形
├── 基于物理的缓动
└── 适用于任何 DOM 元素
```

### 核心概念

| 概念              | 目的              |
| :---------------- | :---------------- |
| **Tween**         | 单个 A→B 动画     |
| **Timeline**      | 序列化/重叠的动画 |
| **ScrollTrigger** | 滚动位置控制播放  |
| **Stagger**       | 元素间的级联效果  |

### 何时使用 GSAP

- ✅ 复杂的序列动画
- ✅ 滚动触发的揭示
- ✅ 需要精确的时间控制
- ✅ SVG 变形效果
- ❌ 简单的 Hover/Focus 效果 (用 CSS)
- ❌ 性能敏感的移动端 (较重)

---

## 3. SVG 动画

### SVG 动画类型

| 类型                 | 技术                     | 用例            |
| :------------------- | :----------------------- | :-------------- |
| **线条描绘**         | stroke-dashoffset        | Logo 揭示, 签名 |
| **变形 (Morph)**     | 路径插值                 | 图标过渡        |
| **变换 (Transform)** | rotate, scale, translate | 交互图标        |
| **颜色**             | fill/stroke 过渡         | 状态变化        |

### 线条描绘原则

```
stroke-dashoffset 描绘原理:
├── 设置 dasharray 为路径长度
├── 设置 dashoffset 等于 dasharray (隐藏)
├── 动画 dashoffset 到 0 (揭示)
└── 创造"正在绘制"的效果
```

---

## 4. 3D CSS Transforms

### 核心属性

```
CSS 3D 空间:
├── perspective: 3D 场深度 (500-1500px 典型值)
├── transform-style: preserve-3d (启用子元素 3D)
├── rotateX/Y/Z: 轴向旋转
├── translateZ: 向观众移近/移远
└── backface-visibility: 显示/隐藏背面
```

### 常见 3D 模式

| 模式         | 用例                  |
| :----------- | :-------------------- |
| **卡片翻转** | 揭示, 闪卡, 产品视图  |
| **悬停倾斜** | 交互卡片, 3D 深度     |
| **视差层**   | Hero 区域, 沉浸式滚动 |
| **3D 轮播**  | 以此画廊, 滑块        |

---

## 5. 粒子效果 (Particle Effects)

### 粒子系统类型

| 类型          | 感觉       | 用例           |
| :------------ | :--------- | :------------- |
| **几何**      | 科技, 网络 | SaaS, 科技网站 |
| **纸屑**      | 庆祝       | 成功时刻       |
| **雪/雨**     | 氛围       | 季节性, 情绪   |
| **灰尘/光斑** | 梦幻       | 摄影, 奢华     |
| **萤火虫**    | 魔法       | 游戏, 奇幻     |

### 库

| 库               | 适合               |
| :--------------- | :----------------- |
| **tsParticles**  | 可配置, 轻量       |
| **particles.js** | 简单背景           |
| **Canvas API**   | 自定义, 最大控制权 |
| **Three.js**     | 复杂 3D 粒子       |

### 原则

- 默认: 30-50 个粒子 (不要过多)
- 运动: 慢, 有机 (速度 0.5-2)
- 不透明度: 0.3-0.6 (不要抢内容)
- 连线: 微妙的线条营造"网络"感
- ⚠️ 在移动端禁用或减少

---

## 6. 滚动驱动动画 (Scroll-Driven Animations)

### 原生 CSS (现代)

```
CSS 滚动时间轴:
├── animation-timeline: scroll() - 文档滚动
├── animation-timeline: view() - 元素在视口中
├── animation-range: 进入/退出 阈值
└── 无需 JavaScript
```

### 最佳实践

- 揭示动画: 在 ~25% 进入时开始
- 视差: 连续滚动进度
- 粘性元素: 使用 cover 范围
- 始终测试滚动性能

---

## 7. 性能原则

### GPU vs CPU 动画

```
便宜 (GPU 加速):
├── transform (translate, scale, rotate)
├── opacity
└── filter (慎用)

昂贵 (触发重排 Reflow):
├── width, height
├── top, left, right, bottom
├── padding, margin
└── 复杂的 box-shadow
```

### 优化检查清单

- [ ] 只动画 transform/opacity
- [ ] 在重动画前使用 `will-change` (之后移除)
- [ ] 在低端设备上测试
- [ ] 实现 `prefers-reduced-motion`
- [ ] 懒加载动画库
- [ ] 节流 (Throttle) 基于滚动的计算

---

## 8. 动效决策树

```
你需要什么动画？
│
├── 复杂的品牌动画？
│   └── Lottie (AE 导出)
│
├── 序列化的滚动触发？
│   └── GSAP + ScrollTrigger
│
├── Logo/图标动画？
│   └── SVG 动画 (描边或变形)
│
├── 交互式 3D 效果？
│   └── CSS 3D Transforms (简单) 或 Three.js (复杂)
│
├── 氛围背景？
│   └── tsParticles 或 Canvas
│
└── 简单的入场/悬停？
    └── CSS @keyframes 或 Framer Motion
```

---

## 9. 反模式

| ❌ 别做              | ✅ 做           |
| :------------------- | :-------------- |
| 同时动画所有东西     | 错开和序列化    |
| 用重型库做简单效果   | 从 CSS 开始     |
| 忽略减弱动态         | 总是提供降级    |
| 阻塞主线程           | 优化至 60fps    |
| 每个项目用一样的粒子 | 匹配品牌/上下文 |
| 移动端上搞复杂特效   | 功能检测        |

---

> **记住**: 动态图形应该增强而不是干扰。每一个动画必须服务于一个**目的**——反馈、引导、愉悦或叙事。
