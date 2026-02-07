---
name: frontend-design
description: Design thinking and decision-making for web UI. Use when designing components, layouts, color schemes, typography, or creating aesthetic interfaces. Teaches principles, not fixed values.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 前端设计系统

> **哲学：** 每一个像素都有其目的。克制即是奢华。用户心理驱动决策。
> **核心原则：** THINK（思考），不要死记硬背。ASK（询问），不要假设。

---

## 🎯 选择性阅读规则（强制）

**始终阅读“必须”的文件，“可选”的文件仅在需要时阅读：**

| 文件                                         | 状态                   | 何时阅读                                                      |
| -------------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| [ux-psychology.md](ux-psychology.md)         | 🔴 **必须** | 始终先读！                            |
| [color-system.md](color-system.md)           | ⚪ 可选     | 颜色/调色板决策时                      |
| [typography-system.md](typography-system.md) | ⚪ 可选     | 字体选择/搭配决策时                    |
| [visual-effects.md](visual-effects.md)       | ⚪ 可选     | 玻璃拟态、阴影、渐变决策时             |
| [animation-guide.md](animation-guide.md)     | ⚪ 可选     | 动画方案需要时                         |
| [motion-graphics.md](motion-graphics.md)     | ⚪ 可选     | Lottie、GSAP、3D 动效需求时            |
| [decision-trees.md](decision-trees.md)       | ⚪ 可选     | 需要上下文决策模板时                   |

> 🔴 **`ux-psychology.md` 必须始终阅读；其他文件仅在相关场景阅读。**

---

## 🔧 运行时脚本

**执行这些脚本进行审计 (不要阅读，直接运行)：**

| 脚本                  | 用途                                                        | 用法                                        |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `scripts/ux_audit.py` | UX 心理学与无障碍审计 | `python scripts/ux_audit.py <project_path>` |

---

## ⚠️ 关键：假设前先询问（强制）

> **如果用户的请求是开放式的，不要按你的偏好默认决策。**

### 当用户提示词模糊时，先询问：

**未指定颜色？** 问：

> "你更喜欢哪种调色板？（蓝色/绿色/橙色/中性色/其他）"

**未指定风格？** 问：

> "你想要什么风格？（极简/大胆/复古/未来主义/有机）"

**未指定布局？** 问：

> "你有布局偏好吗？（单栏/网格/不对称/全宽）"

### ⛔ 避免默认倾向（反避风港）

| AI 默认倾向                                        | 为什么不好                 | 替代思路                           |
| ------------------------------------------------- | -------------------------- | ---------------------------------- |
| **Bento Grids (便当网格) (Modern Cliché)**        | 每个 AI 设计都在用         | 为什么这个内容 **需要** 网格？     |
| **Hero Split (Left/Right) (左右分割 Hero)**       | 可预测且无聊               | 巨大的排版或垂直叙事怎么样？       |
| **Mesh/Aurora Gradients (网格/极光渐变)**         | "新"的懒惰背景             | 什么是激进的颜色配对？             |
| **Glassmorphism (玻璃拟态)**                      | AI 认为的 "Premium (高级)" | 实色、高对比度的扁平化怎么样？     |
| **Deep Cyan / Fintech Blue (深青/金融科技蓝)**    | 紫色禁令后的避风港         | 为什么不是红色、黑色或霓虹绿？     |
| **"Orchestrate / Empower" (编排/赋能)**           | AI 生成的文案              | 人类会怎么说这个？                 |
| Dark background + neon glow (深色背景 + 霓虹发光) | 过度使用，"AI 风格"        | **品牌** 实际上需要什么？          |
| **Rounded everything (全圆角)**                   | 通用/安全                  | 哪里可以使用锐利、粗野主义的边缘？ |

> 🔴 **你选择的每一个“安全”结构都会让你更接近通用模板。请主动承担设计风险。**

---

## 1. 约束分析（始终优先）

在任何设计工作之前，回答这些问题或询问用户：

| Constraint (约束)     | Question (问题)  | Why It Matters (为什么重要) |
| --------------------- | ---------------- | --------------------------- |
| **Timeline (时间线)** | 多少时间？       | 决定复杂性                  |
| **Content (内容)**    | 就绪还是占位符？ | 影响布局灵活性              |
| **Brand (品牌)**      | 现有指南？       | 可能规定颜色/字体           |
| **Tech (技术)**       | 什么技术栈？     | 影响能力                    |
| **Audience (受众)**   | 到底是谁？       | 驱动所有视觉决策            |

### 受众 → 设计方法

| 受众                       | 思考方向                   |
| -------------------------- | -------------------------- |
| **Gen Z (Z 世代)**         | 大胆、快速、移动优先、真实 |
| **Millennials (千禧一代)** | 干净、极简、价值驱动       |
| **Gen X (X 世代)**         | 熟悉、值得信赖、清晰       |
| **Boomers (婴儿潮一代)**   | 易读、高对比度、简单       |
| **B2B**                    | 专业、数据为中心、信任     |
| **Luxury (奢侈品)**        | 克制的优雅、留白           |

---

## 2. UX 心理学原则

### 核心定律（内化这些）

| 定律                               | 原则                   | 应用                         |
| ---------------------------------- | ---------------------- | ---------------------------- |
| **Hick's Law (希克定律)**          | 更多选择 = 更慢决策    | 限制选项，使用渐进式披露     |
| **Fitts' Law (菲茨定律)**          | 更大 + 更近 = 更易点击 | 适当调整 CTA (行动号召) 大小 |
| **Miller's Law (米勒定律)**        | 工作记忆约 7 项        | 将内容分组 (Chunking)        |
| **Von Restorff (冯·雷斯托夫效应)** | 不同 = 难忘            | 使 CTA 视觉独特              |
| **Serial Position (系列位置效应)** | 最初/最后记得最清      | 关键信息在开始/结束          |

### 情感设计层级

```
本能层（Visceral）   → 第一印象：颜色、意象、整体感觉
行为层（Behavioral） → 使用过程：速度、反馈、效率
反思层（Reflective） → 使用之后：这是否表达了用户的自我认同
```

### 建立信任

- 敏感操作上的安全指示器
- 相关处的社会证明 (Social proof)
- 清晰的联系/支持入口
- 一致、专业的设计
- 透明的政策

---

## 3. 布局原则

### 黄金比例（φ = 1.618）

```
用于比例和谐:
├── 内容区 : 侧边栏 ≈ 62% : 38%
├── 每级标题字号 = 上一级 × 1.618（用于拉开戏剧化层级）
├── 间距可按 sm → md → lg 递进（每级约 × 1.618）
```

### 8 点网格概念

```
所有间距和尺寸均为 8 的倍数：
├── 紧凑：4px（微调半步）
├── 小：8px
├── 中：16px
├── 大：24px, 32px
├── 超大：48px, 64px, 80px
└── 根据内容密度调整
```

### 关键尺寸原则

| 元素                         | 考虑因素             |
| ---------------------------- | -------------------- |
| **Touch targets (触摸目标)** | 最小舒适点击尺寸     |
| **Buttons (按钮)**           | 基于重要性层级的高度 |
| **Inputs (输入框)**          | 与按钮高度匹配以对齐 |
| **Cards (卡片)**             | 一致的内边距，透气   |
| **Reading width (阅读宽度)** | 45-75 字符为最佳     |

---

## 4. 颜色原则

### 60-30-10 规则

```
60% → 主色/背景（平静、中性基底）
30% → 辅助色（支撑区域）
10% → 强调色（CTA、高亮、注意力）
```

### 颜色心理学（用于决策）

| 如果你需要...                   | 考虑色相             | 避免         |
| ------------------------------- | -------------------- | ------------ |
| 信任、平静（Trust, calm）       | 蓝色系               | 激进的红色   |
| 成长、自然（Growth, nature）    | 绿色系               | 工业灰色     |
| 能量、紧迫（Energy, urgency）   | 橙色、红色           | 被动的蓝色   |
| 奢华、创意（Luxury, creativity） | 深青色、金色、祖母绿 | 廉价感的亮色 |
| 干净、极简（Clean, minimal）    | 中性色               | 压倒性的颜色 |

### 选择流程

1. **行业是什么？**（先缩小选项）
2. **要传达什么情绪？**（确定主色方向）
3. **亮色还是暗色模式？**（设定基础风格）
4. **未指定就先问用户。**

有关详细颜色理论：[color-system.md](color-system.md)

---

## 5. 排版原则

### 比例选择

| 内容类型                 | 比例系数  | 感觉          |
| ------------------------ | --------- | ------------- |
| 紧凑型 UI（Dense UI）      | 1.125-1.2 | 紧凑，高效    |
| 通用 Web（General web）    | 1.25      | 平衡（最常见） |
| 编辑类（Editorial）        | 1.333     | 易读，宽敞    |
| 展示区（Hero/display）     | 1.5-1.618 | 戏剧性冲击    |

### 配对概念

```
对比 + 和谐：
├── 层级上要足够不同
├── 风格上要足够一致
└── 常见组合：展示字体 + 中性字体，或衬线 + 无衬线
```

### 易读性规则

- **行长**：45-75 字符最佳
- **行高**：正文文本 1.4-1.6
- **对比度**：检查 WCAG 要求
- **字号**：Web 正文 16px+

有关详细排版：[typography-system.md](typography-system.md)

---

## 6. 视觉效果原则

### 玻璃拟态（适当时）

```
关键属性：
├── 半透明背景
├── 背景模糊
├── 细微边框增强边界感
└── ⚠️ **警告：** 标准蓝白玻璃拟态已是陈词滥调，要么激进使用，要么不要使用。
```

### 阴影层级

```
抬升概念：
├── 元素越高，阴影越大
├── Y 偏移应大于 X 偏移（模拟上方光源）
├── 多层阴影更接近真实质感
└── 暗色模式下可考虑以发光替代重阴影
```

### 渐变使用

```
和谐的渐变：
├── 优先使用色轮相邻色（analogous）
├── 或同色相的明暗变化
├── 避免刺眼的互补色硬拼
├── 🚫 禁止千篇一律的网格/极光渐变漂浮斑点
└── 不同项目要做明显区分，不要复用同一套渐变模板
```

有关完整效果指南：[visual-effects.md](visual-effects.md)

---

## 7. 动画原则

### 计时概念

```
持续时间依据：
├── 距离：越远越长
├── 尺寸：越大越慢
├── 重要性：越关键越要清晰可辨
└── 上下文：紧急更快，奢华更慢
```

### 缓动选择

| 动作            | 缓动        | 为什么         |
| --------------- | ----------- | -------------- |
| Entering (进入) | Ease-out    | 减速，安顿下来 |
| Leaving (离开)  | Ease-in     | 加速，退出     |
| Emphasis (强调) | Ease-in-out | 平滑，刻意     |
| Playful (好玩)  | Bounce      | 有趣，充满活力 |

### 性能

- 仅动画化 transform 和 opacity
- 尊重减弱动态 (reduced-motion) 偏好
- 在低端设备上测试

有关动画模式：[animation-guide.md](animation-guide.md)，进阶：[motion-graphics.md](motion-graphics.md)

---

## 8. 质感检查清单（Wow Factor）

### 高级感指标

- [ ] Generous whitespace (慷慨的留白) (luxury = breathing room/奢华 = 呼吸空间)
- [ ] Subtle depth and dimension (微妙的深度和维度)
- [ ] Smooth, purposeful animations (流畅、有目的的动画)
- [ ] Attention to detail (关注细节) (alignment, consistency/对齐，一致性)
- [ ] Cohesive visual rhythm (内聚的视觉韵律)
- [ ] Custom elements (自定义元素) (not all defaults/不全是默认值)

### 信任构建者

- [ ] Security cues where appropriate (适当时的安全提示)
- [ ] Social proof / testimonials (社会证明/推荐)
- [ ] Clear value proposition (清晰的价值主张)
- [ ] Professional imagery (专业的意象)
- [ ] Consistent design language (一致的设计语言)

### 情感触发器

- [ ] Hero that evokes intended emotion (唤起预期情绪的 Hero)
- [ ] Human elements (人文元素) (faces, stories/面孔，故事)
- [ ] Progress/achievement indicators (进度/成就指示器)
- [ ] Moments of delight (愉悦时刻)

---

## 9. 反模式（不要做什么）

### ❌ 懒惰设计指标

- 不考虑就使用默认系统字体
- 不匹配的库存图片
- 不一致的间距
- 太多相互竞争的颜色
- 没有层级的文字墙
- 不可访问的对比度

### ❌ AI 倾向模式（避免）

- **Same colors every project (每个项目都是相同的颜色)**
- **Dark + neon as default (默认暗色 + 霓虹)**
- **Purple/violet everything (紫色/紫罗兰色一切) (PURPLE BAN/紫色禁令 ✅)**
- **Bento grids for simple landing pages (简单落地页使用便当网格)**
- **Mesh Gradients & Glow Effects (网格渐变 & 发光效果)**
- **Same layout structure / Vercel clone (相同的布局结构 / Vercel 克隆)**
- **Not asking user preferences (不询问用户偏好)**

### ❌ 黑暗模式（不道德）

- 隐藏成本
- 虚假紧迫感
- 强制行动
- 欺骗性 UI
- 确认羞辱 (Confirmshaming)

---

## 10. 决策流程总结

```
每个设计任务都按以下流程执行：

1. CONSTRAINTS（约束）
   └── 时间线、品牌、技术、受众是什么？
   └── 不清楚就先 ASK（询问）

2. CONTENT（内容）
   └── 已有内容是什么？
   └── 信息层级是什么？

3. STYLE DIRECTION（风格方向）
   └── 哪种风格符合当前上下文？
   └── 不清楚就先 ASK（询问），不要默认套模板

4. EXECUTION（执行）
   └── 应用上面的原则
   └── 对照反模式自检

5. REVIEW（审查）
   └── 这是否真的服务于用户？
   └── 这是否明显区别于默认套路？
   └── 这是否达到可交付质量？
```

---

## 参考文件

有关特定领域的更深入指导：

- [color-system.md](color-system.md) - Color theory and selection process (颜色理论和选择流程)
- [typography-system.md](typography-system.md) - Font pairing and scale decisions (字体搭配和比例决策)
- [visual-effects.md](visual-effects.md) - Effects principles and techniques (效果原则和技术)
- [animation-guide.md](animation-guide.md) - Motion design principles (动态设计原则)
- [motion-graphics.md](motion-graphics.md) - Advanced (进阶): Lottie, GSAP, SVG, 3D, Particles
- [decision-trees.md](decision-trees.md) - Context-specific templates (特定于上下文的模板)
- [ux-psychology.md](ux-psychology.md) - User psychology deep dive (用户心理学深潜)

---

## 相关 Skill

| Skill (技能)                                                   | 何时使用                                      |
| -------------------------------------------------------------- | --------------------------------------------- |
| **frontend-design** (this/本技能)                              | 编码前 - 学习设计原则 (颜色, 排版, UX 心理学) |
| **[web-design-guidelines](../web-design-guidelines/SKILL.md)** | 编码后 - 审计无障碍性、性能和最佳实践         |

## 设计后工作流

实施设计后，运行审计：

```
1. DESIGN（设计）→ 阅读 `frontend-design` 原则（当前在此阶段）
2. CODE（编码）→ 实施设计
3. AUDIT（审计）→ 运行 `web-design-guidelines` 审查
4. FIX（修复）→ 解决审查发现的问题
```

> **下一步：** 编码后，使用 `web-design-guidelines` 技能审计实现，重点检查无障碍、焦点状态、动画和性能问题。

---

> **记住：** 设计是思考，不是复制。每个项目都应基于其独特背景与用户重新判断，避免落入现代 SaaS 的“安全模板”。
