---
description: 现代 CSS 视觉特效指南 (玻璃拟态, 新拟态, 光效)
---

# 视觉特效 (Visual Effects)

> 现代 CSS 视觉技术，如玻璃拟态、新拟态、光效和渐变。
> **效果增强意义。基于目的和上下文选择，而不是"看起来很酷"。**

---

## 1. 玻璃拟态原则 (Glassmorphism)

### 原理

```
关键属性:
├── 半透明背景 (非实色)
├── 背景模糊 (磨砂玻璃效果)
├── 微妙边框 (用于定义边界)
└── 通常: 轻微阴影增加深度
```

### 模式 (自定义数值)

```css
.glass {
    /* 透明度: 根据内容可读性调整 */
    background: rgba(R, G, B, OPACITY);
    /* OPACITY: 深色背景 0.1-0.3, 浅色背景 0.5-0.8 */

    /* 模糊: 越高 = 越磨砂 */
    backdrop-filter: blur(AMOUNT);
    /* AMOUNT: 8-12px 微妙, 16-24px 强烈 */

    /* 边框: 定义边缘 */
    border: 1px solid rgba(255, 255, 255, OPACITY);
    /* OPACITY: 通常 0.1-0.3 */

    /* 圆角: 匹配你的设计系统 */
    border-radius: YOUR_RADIUS;
}
```

### 何时使用

- ✅ 在多彩/图片背景之上
- ✅ 模态框, 覆盖层, 卡片
- ✅ 背后有滚动内容的导航栏

### 何时**不**使用

- 低对比度情况
- 对可访问性要求极高的内容
- 性能受限设备 (backdrop-filter 有开销)

---

## 2. 新拟态原则 (Neomorphism)

### 原理

```
核心概念: 使用双重阴影的柔软、挤压效果
├── 亮阴影 (来自光源方向)
├── 暗阴影 (相反方向)
└── 背景与周围匹配 (同色)
```

### 模式

```css
.neo-raised {
    /* 背景必须匹配父级 */
    background: SAME_AS_PARENT;

    /* 双阴影: 亮方向 + 暗方向 */
    box-shadow:
        OFFSET OFFSET BLUR rgba(light-color),
        -OFFSET -OFFSET BLUR rgba(dark-color);
}

.neo-pressed {
    /* Inset 创造"凹陷"效果 */
    box-shadow:
        inset OFFSET OFFSET BLUR rgba(dark-color),
        inset -OFFSET -OFFSET BLUR rgba(light-color);
}
```

### ⚠️ 可访问性警告

**低对比度** - 慎用，确保边界清晰。

---

## 3. 阴影层级原则

### 概念: 阴影指示高度 (Elevation)

```
高度越高 = 阴影越大
├── L0: 无阴影 (贴在表面)
├── L1: 微妙阴影 (轻微抬起)
├── L2: 中等阴影 (卡片, 按钮)
├── L3: 大阴影 (模态框, 下拉菜单)
└── L4: 深阴影 (悬浮元素)
```

### 自然阴影原则

1.  **Y 轴偏移大于 X 轴** (光从上方来)
2.  **低不透明度** (5-15% 微妙, 15-25% 明显)
3.  **多层叠加** 更真实 (环境光 + 直射光)
4.  **模糊随偏移缩放** (偏移越大 = 模糊越大)

---

## 4. 渐变原则 (Gradients)

### 类型

| 类型              | 模式                     | 用例             |
| :---------------- | :----------------------- | :--------------- |
| **线性 (Linear)** | Color A → Color B 沿直线 | 背景, 按钮, 头部 |
| **径向 (Radial)** | 中心 → 向外              | 聚光灯, 焦点     |
| **圆锥 (Conic)**  | 围绕中心                 | 饼图, 创意效果   |

### 创造和谐渐变

```
好渐变法则:
├── 使用色轮上相邻的颜色 (类比)
├── 或同色相不同亮度
├── 避免互补色 (可能看起来脏/刺眼)
└── 添加中间色标以获得平滑过渡
```

### 网格渐变 (Mesh Gradients)

```
多个径向渐变重叠:
├── 每个在不同位置
├── 每个具有透明衰减
├── **Hero 区域的"Wow"因素必备**
└── 创造有机、多彩的效果 (搜索: "Aurora Gradient CSS")
```

---

## 5. 边框特效

### 渐变边框

```
技术: 伪元素 + 渐变背景
├── 元素 padding = 边框宽度
├── 伪元素填充渐变
└── Mask 或 clip 创造边框效果
```

### 动效边框

```
技术: 旋转渐变或圆锥扫描
├── 伪元素比内容大
├── 动画旋转渐变
└── Overflow hidden 裁剪形状
```

### 发光边框

```css
/* 多重 box-shadow 创造发光 */
box-shadow:
    0 0 SMALL-BLUR COLOR,
    0 0 MEDIUM-BLUR COLOR,
    0 0 LARGE-BLUR COLOR;
```

---

## 6. 发光特效 (Glow Effects)

### 文本发光

```css
text-shadow:
    0 0 BLUR-1 COLOR,
    0 0 BLUR-2 COLOR,
    0 0 BLUR-3 COLOR;
```

### 脉冲发光动画

```css
@keyframes glow-pulse {
    0%,
    100% {
        box-shadow: 0 0 SMALL-BLUR COLOR;
    }
    50% {
        box-shadow: 0 0 LARGE-BLUR COLOR;
    }
}
```

---

## 7. 叠加技术 (Overlay)

### 图片上的渐变叠加

```
目的: 提高文字在图片上的可读性
模式: 透明到不透明的渐变
位置: 文字出现的地方
```

```css
.overlay::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        DIRECTION,
        transparent PERCENTAGE,
        rgba(0, 0, 0, OPACITY) 100%
    );
}
```

---

## 8. 现代 CSS 技术

### 容器查询 (Container Queries)

```
替代视口断点:
├── 组件响应 自身容器
├── 真正的模块化、可复用组件
└── 语法: @container (condition) { }
```

### :has() 选择器

```
基于子元素样式的父级:
├── "拥有 X 子元素的父级"
├── 启用以前不可能的模式
└── 渐进增强方法
```

### 滚动驱动动画

```
动画进度绑定滚动:
├── 滚动进入/退出动画
├── 视差效果
├── 进度指示器
└── 基于视图或滚动的进度条
```

---

## 9. 性能原则

### GPU 加速属性

```
便宜 (GPU):
├── transform (translate, scale, rotate)
└── opacity

昂贵 (CPU):
├── width, height
├── top, left, right, bottom
├── margin, padding
└── box-shadow (重新计算)
```

---

## 10. 特效选择检查清单

在应用任何特效之前：

- [ ] **它服务于目的吗？** (不仅是装饰)
- [ ] **适合上下文吗？** (品牌, 受众)
- [ ] **与之前的项目有变化吗？** (避免重复)
- [ ] **可访问吗？** (对比度, 运动敏感度)
- [ ] **性能好吗？** (特别是移动端)
- [ ] **询问了用户偏好吗？** (如果风格开放)

### 反模式

- ❌ 每一个元素都用玻璃拟态 (俗气)
- ❌ 默认深色 + 霓虹 (懒惰的 AI 外观)
- ❌ **无深度的静态/扁平设计 (失败)**
- ❌ 伤害可读性的特效
- ❌ 没有目的的动画

---

> **记住**: 特效增强意义。基于目的和上下文选择，而不是因为它"看起来很酷"。
