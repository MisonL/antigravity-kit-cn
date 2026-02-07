# 视觉效果参考指南 (Visual Effects Reference)

> 现代 CSS 效果原则与技术 —— 学习概念，创造变体。
> **没有固定的数值供复制 —— 理解背后的模式。**

---

## 1. 玻璃拟态原则 (Glassmorphism Principles)

### 成功的关键属性

- **半透明背景**: 非实色背景。
- **背景模糊 (Backdrop Blur)**: 毛玻璃效果 (`backdrop-filter: blur()`)。
- **微弱边框**: 用于定义边界感。
- **微弱阴影**: 增加深度。

---

## 2. 新拟态原则 (Neomorphism Principles)

- **双重阴影**: 光源方向的亮影 + 相反方向的暗影。
- **背景一致**: 背景必须与父元素颜色一致。
- **注意**: 存在对比度风险，需谨慎用于关键操作。

---

## 3. 阴影层级原则 (Shadow Hierarchy)

阴影表示海拔 (Elevation)：

- **Level 1**: 微弱阴影（稍微抬升）。
- **Level 2**: 中等阴影（卡片、按钮）。
- **Level 3**: 大阴影（模态框、下拉菜单）。
- **Level 4**: 深阴影（悬浮元素）。

---

## 4. 渐变原则 (Gradient Principles)

- **和谐法则**: 使用色环上相邻的颜色（同类色）或同一色相的不同亮度。
- **Mesh Gradients (网格渐变)**: 通过重叠多个径向渐变，实现类似“极光 (Aurora)”的有机动感效果。**这是 Hero 区域提升高级感的必考题。**

---

## 5. 发光效果原则 (Glow Effects)

- **多层阴影**: 通过堆叠不同模糊度 (Blur) 的 `box-shadow` 或 `text-shadow` 实现强力霓虹感。
- **动画**: 结合色彩脉动动画增加视觉灵动性。

---

## 6. 性能原则 (Performance Principles)

- **GPU 加速**: 优先对 `transform` 和 `opacity` 进行动画处理。
- **避免 CPU 瓶颈**: 不要频繁动画化 `width`, `height`, `margin`, `box-shadow` 等导致强制重排的属性。

---

## 7. 视觉效果检查清单 (Selection Checklist)

- [ ] 效果是否服务于特定功能？（而非单纯装饰）
- [ ] 是否与当前品牌调性一致？
- [ ] 动画是否尊重了用户的 `prefers-reduced-motion` 设置？
- [ ] 在移动设备上是否有性能瓶颈？

---

> **记住：** 视觉效果应增强意义。基于目的和语境进行选择，而非仅仅因为它“看起来很酷”。
