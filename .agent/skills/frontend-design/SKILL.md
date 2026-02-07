---
name: frontend-design
description: Design thinking and decision-making for web UI. Use when designing components, layouts, color schemes, typography, or creating aesthetic interfaces. Teaches principles, not fixed values.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 前端设计系统 (Frontend Design System)

> **Philosophy:** 每一个像素都有其目的。克制即奢华。用户心理驱动决策。
> **Core Principle:** 思考，不要死记硬背。提问，不要假设。

---

## 🎯 选择性阅读规则 (强制) (Selective Reading Rule - MANDATORY)

**始终阅读必读文件，仅在需要时阅读可选文件：**

| 文件                                         | 状态        | 何时阅读             |
| -------------------------------------------- | ----------- | -------------------- |
| [ux-psychology.md](ux-psychology.md)         | 🔴 **必读** | 始终先读！           |
| [color-system.md](color-system.md)           | ⚪ 可选     | 颜色/配色方案决策    |
| [typography-system.md](typography-system.md) | ⚪ 可选     | 字体选择/配对        |
| [visual-effects.md](visual-effects.md)       | ⚪ 可选     | 玻璃拟态、阴影、渐变 |
| [animation-guide.md](animation-guide.md)     | ⚪ 可选     | 需要动画时           |
| [motion-graphics.md](motion-graphics.md)     | ⚪ 可选     | Lottie, GSAP, 3D     |
| [decision-trees.md](decision-trees.md)       | ⚪ 可选     | 上下文模板           |

> 🔴 **ux-psychology.md = 始终阅读。其他 = 仅在相关时阅读。**

---

## 🔧 运行时脚本 (Runtime Scripts)

**执行这些脚本进行审计 (不要阅读，直接运行)：**

| 脚本                  | 目的                  | 用法                                        |
| --------------------- | --------------------- | ------------------------------------------- |
| `scripts/ux_audit.py` | UX 心理学与无障碍审计 | `python scripts/ux_audit.py <project_path>` |

---

## ⚠️ 关键：假设前先问 (强制) (CRITICAL: ASK BEFORE ASSUMING - MANDATORY)

> **停止！如果用户的请求是开放式的，不要默认为你的喜好。**

### 当用户提示模糊时，提问：

**未指定颜色？** 问：

> "你倾向于什么色调？(蓝色/绿色/橙色/中性色/其他？)"

**未指定风格？** 问：

> "你想要什么风格？(极简/大胆/复古/未来主义/有机？)"

**未指定布局？** 问：

> "你有布局偏好吗？(单栏/网格/不对称/全宽？)"

### ⛔ 应避免的默认倾向 (反避风港) (DEFAULT TENDENCIES TO AVOID - ANTI-SAFE HARBOR):

| AI 默认倾向                    | 为什么不好          | 应该思考什么                     |
| ------------------------------ | ------------------- | -------------------------------- |
| **Bento Grids (现代陈词滥调)** | 每个 AI 设计都在用  | 为什么这个内容 _需要_ 网格？     |
| **Hero Split (左/右)**         | 可预测且无聊        | 试试巨大排版或垂直叙事？         |
| **Mesh/Aurora Gradients**      | "新" 的懒惰背景     | 什么是激进的色彩配对？           |
| **Glassmorphism (玻璃拟态)**   | AI 对 "高级" 的理解 | 试试实色、高对比度的扁平化？     |
| **Deep Cyan / Fintech Blue**   | 避开紫色的安全港    | 为什么不是红色、黑色或霓虹绿？   |
| **"Orchestrate / Empower"**    | AI 生成的文案       | 人类会怎么说？                   |
| 深色背景 + 霓虹发光            | 过度使用，"AI 风格" | **品牌**实际上需要什么？         |
| **圆角一切**                   | 通用/安全           | 哪里可以使用锐利、野兽派的边缘？ |

> 🔴 **"你选择的每一个 '安全' 结构都让你离通用模板更近一步。承担风险 (TAKE RISKS)。"**

---

## 1. 约束分析 (始终优先) (Constraint Analysis - ALWAYS FIRST)

在任何设计工作之前，回答这些问题或询问用户：

| 约束       | 问题             | 为什么重要        |
| ---------- | ---------------- | ----------------- |
| **时间线** | 有多少时间？     | 决定复杂度        |
| **内容**   | 现成还是占位符？ | 影响布局灵活性    |
| **品牌**   | 现有指南？       | 可能规定颜色/字体 |
| **技术**   | 什么技术栈？     | 影响能力          |
| **受众**   | 确切是谁？       | 驱动所有视觉决策  |

### 受众 → 设计方法 (Audience → Design Approach)

| 受众            | 思考方向                   |
| --------------- | -------------------------- |
| **Gen Z**       | 大胆、快速、移动优先、真实 |
| **Millennials** | 干净、极简、价值驱动       |
| **Gen X**       | 熟悉、值得信赖、清晰       |
| **Boomers**     | 易读、高对比度、简单       |
| **B2B**         | 专业、数据为中心、信任     |
| **Luxury**      | 克制的优雅、留白           |

---

## 2. UX 心理学原则 (UX Psychology Principles)

### 核心定律 (内化这些) (Core Laws - Internalize These)

| 定律                               | 原则                   | 应用                     |
| ---------------------------------- | ---------------------- | ------------------------ |
| **席克定律 (Hick's Law)**          | 更多选择 = 更慢决策    | 限制选项，使用渐进式披露 |
| **菲茨定律 (Fitts' Law)**          | 更大 + 更近 = 更易点击 | 适当调整 CTA 大小        |
| **米勒定律 (Miller's Law)**        | 工作记忆约容纳 7 项    | 将内容分组 (Chunking)    |
| **冯·雷斯托夫效应 (Von Restorff)** | 不同 = 难忘            | 让 CTA 在视觉上独特      |
| **系列位置效应 (Serial Position)** | 首尾记忆最深           | 关键信息放在开始/结束    |

### 情感化设计层级 (Emotional Design Levels)

```
本能层 (VISCERAL - instant)  → 第一印象：颜色、图像、整体感觉
行为层 (BEHAVIORAL - use)    → 使用中：速度、反馈、效率
反思层 (REFLECTIVE - memory) → 之后：“我喜欢这体现出的我的品味”
```

### 信任建立 (Trust Building)

- 敏感操作上的安全指示
- 相关的社会证明
- 清晰的联系/支持入口
- 一致、专业的设计
- 透明的政策

---

## 3. 布局原则 (Layout Principles)

### 黄金比例 (Golden Ratio - φ = 1.618)

```
用于比例和谐：
├── 内容 : 侧边栏 = 大致 62% : 38%
├── 每个标题大小 = 上一级 × 1.618 (戏剧性比例)
├── 间距可以遵循：sm → md → lg (每个 × 1.618)
```

### 8 点网格概念 (8-Point Grid Concept)

```
所有间距和尺寸均为 8 的倍数：
├── 紧凑 (Tight): 4px (微调的半步)
├── 小 (Small): 8px
├── 中 (Medium): 16px
├── 大 (Large): 24px, 32px
├── 特大 (XL): 48px, 64px, 80px
└── 根据内容密度调整
```

### 关键尺寸原则 (Key Sizing Principles)

| 元素         | 考虑因素           |
| ------------ | ------------------ |
| **触摸目标** | 最小舒适点击尺寸   |
| **按钮**     | 高度基于重要性层级 |
| **输入框**   | 匹配按钮高度以对齐 |
| **卡片**     | 一致的内边距，透气 |
| **阅读宽度** | 45-75 字符为最佳   |

---

## 4. 色彩原则 (Color Principles)

### 60-30-10 规则 (60-30-10 Rule)

```
60% → 主色/背景 (冷静，中性基底)
30% → 辅助色 (支持区域)
10% → 强调色 (CTA，高亮，注意力)
```

### 色彩心理学 (用于决策) (Color Psychology - For Decision Making)

| 如果你需要... | 考虑色相             | 避免         |
| ------------- | -------------------- | ------------ |
| 信任、冷静    | 蓝色系               | 激进的红色   |
| 增长、自然    | 绿色系               | 工业灰色     |
| 能量、紧迫    | 橙色、红色           | 被动的蓝色   |
| 奢华、创造力  | 深青色、金色、祖母绿 | 廉价感的亮色 |
| 干净、极简    | 中性色               | 压倒性的颜色 |

### 选择流程 (Selection Process)

1. **什么行业？** (缩小选项范围)
2. **什么情绪？** (挑选主色)
3. **亮色还是暗色模式？** (设定基调)
4. **询问用户** 如果未指定

关于详细色彩理论：[color-system.md](color-system.md)

---

## 5. 排版原则 (Typography Principles)

### 比例选择 (Scale Selection)

| 内容类型  | 比例系数  | 感觉          |
| --------- | --------- | ------------- |
| 密集 UI   | 1.125-1.2 | 紧凑，高效    |
| 通用 Web  | 1.25      | 平衡 (最常见) |
| 编辑类    | 1.333     | 易读，宽敞    |
| Hero/展示 | 1.5-1.618 | 戏剧性冲击力  |

### 配对概念 (Pairing Concept)

```
对比 + 和谐：
├── 足够不同以区分层级
├── 足够相似以保持凝聚力
└── 通常：展示字体 + 中性字体，或衬线 + 无衬线
```

### 易读性规则 (Readability Rules)

- **行长**: 45-75 字符最佳
- **行高**: 正文 1.4-1.6
- **对比度**: 检查 WCAG 要求
- **字号**: Web 正文 16px+

关于详细排版：[typography-system.md](typography-system.md)

---

## 6. 视觉特效原则 (Visual Effects Principles)

### 玻璃拟态 (适当时使用) (Glassmorphism - When Appropriate)

```
关键属性：
├── 半透明背景
├── 背景模糊 (Backdrop blur)
├── 微妙的边框以定义边界
└── ⚠️ **警告：** 标准蓝/白玻璃拟态是现代陈词滥调。激进地使用它，否则别用。
```

### 阴影层级 (Shadow Hierarchy)

```
海拔概念 (Elevation concept)：
├── 更高的元素 = 更大的阴影
├── Y 轴偏移 > X 轴偏移 (光线来自上方)
├── 多层阴影 = 更真实
└── 暗色模式：可能需要发光代替
```

### 渐变使用 (Gradient Usage)

```
和谐渐变：
├── 色轮上相邻的颜色 (类比色)
├── 或者相同色相，不同亮度
├── 避免刺眼的互补色配对
├── 🚫 **禁止 Mesh/Aurora Gradients** (漂浮的斑点)
└── 根据项目激进地变化
```

关于完整特效指南：[visual-effects.md](visual-effects.md)

---

## 7. 动画原则 (Animation Principles)

### 计时概念 (Timing Concept)

```
持续时间基于：
├── 距离 (更远 = 更长)
├── 大小 (更大 = 更慢)
├── 重要性 (关键 = 清晰)
└── 上下文 (紧急 = 快，奢华 = 慢)
```

### 缓动选择 (Easing Selection)

| 动作            | 缓动        | 原因           |
| --------------- | ----------- | -------------- |
| 进入 (Entering) | Ease-out    | 减速，安顿下来 |
| 离开 (Leaving)  | Ease-in     | 加速，退出     |
| 强调 (Emphasis) | Ease-in-out | 平滑，刻意     |
| 俏皮 (Playful)  | Bounce      | 有趣，充满活力 |

### 性能 (Performance)

- 仅动画化 transform 和 opacity
- 尊重减弱动态 (reduced-motion) 偏好
- 在低端设备上测试

关于动画模式：[animation-guide.md](animation-guide.md)，进阶：[motion-graphics.md](motion-graphics.md)

---

## 8. "Wow 因素" 检查清单 ("Wow Factor" Checklist)

### 高级感指标 (Premium Indicators)

- [ ] 慷慨的留白 (奢华 =呼吸空间)
- [ ] 微妙的深度和维度
- [ ] 平滑、有目的的动画
- [ ] 关注细节 (对齐、一致性)
- [ ] 凝聚的视觉韵律
- [ ] 自定义元素 (不全是默认值)

### 信任构建者 (Trust Builders)

- [ ] 适当的安全提示
- [ ] 社会证明 / 推荐语
- [ ] 清晰的价值主张
- [ ] 专业图像
- [ ] 一致的设计语言

### 情感触发器 (Emotional Triggers)

- [ ] 唤起预期情绪的 Hero 区域
- [ ] 人性化元素 (面孔、故事)
- [ ] 进度/成就指示器
- [ ] 愉悦时刻 (Moments of delight)

---

## 9. 反模式 (应避免) (Anti-Patterns - What NOT to Do)

### ❌ 懒惰设计指标 (Lazy Design Indicators)

- 未经考虑的默认系统字体
- 不匹配的库存图片
- 不一致的间距
- 太多相互竞争的颜色
- 没有层级的文字墙
- 不可访问的对比度

### ❌ AI 倾向模式 (避免！) (AI Tendency Patterns - AVOID!)

- **每个项目都用相同的颜色**
- **默认使用深色 + 霓虹**
- **紫色/紫罗兰色一切 (紫色禁令 PURPLE BAN ✅)**
- **简单落地页也用 Bento grids**
- **Mesh Gradients & 发光效果**
- **相同的布局结构 / Vercel 克隆**
- **不询问用户偏好**

### ❌ 黑暗模式 (不道德) (Dark Patterns - Unethical)

- 隐藏成本
- 虚假紧迫感
- 强制操作 -以此欺骗性 UI
- 确认羞辱 (Confirmshaming)

---

## 10. 决策流程总结 (Decision Process Summary)

```
对于每一个设计任务：

1. 约束 (CONSTRAINTS)
   └── 时间线、品牌、技术、受众是什么？
   └── 如果不清楚 → 问 (ASK)

2. 内容 (CONTENT)
   └── 现有什么内容？
   └── 层级是什么？

3. 风格方向 (STYLE DIRECTION)
   └── 什么适合上下文？
   └── 如果不清楚 → 问 (不要默认！)

4. 执行 (EXECUTION)
   └── 应用上述原则
   └── 检查反模式

5. 审查 (REVIEW)
   └── "这服务于用户吗？"
   └── "这与我的默认设置不同吗？"
   └── "我会为此感到自豪吗？"
```

---

## 参考文件 (Reference Files)

关于特定领域的更深入指导：

- [color-system.md](color-system.md) - 色彩理论与选择流程
- [typography-system.md](typography-system.md) - 字体配对与比例决策
- [visual-effects.md](visual-effects.md) - 特效原则与技术
- [animation-guide.md](animation-guide.md) - 动态设计原则
- [motion-graphics.md](motion-graphics.md) - 进阶：Lottie, GSAP, SVG, 3D, 粒子
- [decision-trees.md](decision-trees.md) - 特定上下文模板
- [ux-psychology.md](ux-psychology.md) - 用户心理学深度剖析

---

## 相关技能 (Related Skills)

| 技能                                                           | 何时使用                                      |
| -------------------------------------------------------------- | --------------------------------------------- |
| **frontend-design** (本技能)                                   | 编码前 - 学习设计原则 (色彩, 排版, UX 心理学) |
| **[web-design-guidelines](../web-design-guidelines/SKILL.md)** | 编码后 - 审计无障碍性、性能和最佳实践         |

## 设计后工作流 (Post-Design Workflow)

实施设计后，运行审计：

```
1. DESIGN   → 阅读 frontend-design 原则 ← 你在这里
2. CODE     → 实现设计
3. AUDIT    → 运行 web-design-guidelines 审查
4. FIX      → 解决审计发现的问题
```

> **下一步:** 编码后，使用 `web-design-guidelines` 技能来审计你的实现，检查无障碍性、焦点状态、动画和性能问题。

---

> **记住:** 设计是思考，不是复制。每个项目都值得基于其独特背景和用户进行新的考虑。**拒绝现代 SaaS 安全港 (Avoid the Modern SaaS Safe Harbor)!**
