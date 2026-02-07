---
name: frontend-design
description: Design thinking and decision-making for web UI. Use when designing components, layouts, color schemes, typography, or creating aesthetic interfaces. Teaches principles, not fixed values.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 前端设计系统 (Frontend Design System)

> **哲学 (Philosophy):** 每一个像素都有其目的。克制即是奢华。用户心理驱动决策。
> **核心原则 (Core Principle):** THINK (思考)，不要死记硬背。ASK (询问)，不要假设。

---

## 🎯 选择性阅读规则 (强制) - Selective Reading Rule (MANDATORY)

**始终阅读“必须”的文件，“可选”的文件仅在需要时阅读：**

| 文件                                         | 状态                   | 何时阅读                                                      |
| -------------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| [ux-psychology.md](ux-psychology.md)         | 🔴 **REQUIRED (必须)** | 始终先读！                                                    |
| [color-system.md](color-system.md)           | ⚪ Optional (可选)     | Color/palette (颜色/调色板) 决策时                            |
| [typography-system.md](typography-system.md) | ⚪ Optional (可选)     | Font selection/pairing (字体选择/搭配) 时                     |
| [visual-effects.md](visual-effects.md)       | ⚪ Optional (可选)     | Glassmorphism (玻璃拟态), shadows (阴影), gradients (渐变) 时 |
| [animation-guide.md](animation-guide.md)     | ⚪ Optional (可选)     | Animation (动画) 需要时                                       |
| [motion-graphics.md](motion-graphics.md)     | ⚪ Optional (可选)     | Lottie, GSAP, 3D                                              |
| [decision-trees.md](decision-trees.md)       | ⚪ Optional (可选)     | Context templates (上下文模板) 时                             |

> 🔴 **ux-psychology.md = ALWAYS READ (始终阅读)。其他 = 仅在相关时阅读。**

---

## 🔧 运行时脚本 (Runtime Scripts)

**执行这些脚本进行审计 (不要阅读，直接运行)：**

| 脚本                  | 用途                                                        | 用法                                        |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `scripts/ux_audit.py` | UX Psychology & Accessibility Audit (UX 心理学与无障碍审计) | `python scripts/ux_audit.py <project_path>` |

---

## ⚠️ 关键：假设前先询问 (强制) - CRITICAL: ASK BEFORE ASSUMING (MANDATORY)

> **STOP! 如果用户的请求是开放式的，不要默认为你的喜好。**

### 当用户提示词模糊时，询问 (When User Prompt is Vague, ASK):

**未指定颜色？ (Color not specified?)** 问：

> "What color palette do you prefer? (blue/green/orange/neutral/other?)"
> "你更喜欢哪种调色板？(蓝色/绿色/橙色/中性色/其他？)"

**未指定风格？ (Style not specified?)** 问：

> "What style are you going for? (minimal/bold/retro/futuristic/organic?)"
> "你想要什么风格？(极简/大胆/复古/未来主义/有机？)"

**未指定布局？ (Layout not specified?)** 问：

> "Do you have a layout preference? (single column/grid/asymmetric/full-width?)"
> "你有布局偏好吗？(单栏/网格/不对称/全宽？)"

### ⛔ 避免的默认倾向 (非避风港) - DEFAULT TENDENCIES TO AVOID (ANTI-SAFE HARBOR):

| AI Default Tendency (AI 默认倾向)                 | Why It's Bad (为什么不好)  | Think Instead (试着思考)           |
| ------------------------------------------------- | -------------------------- | ---------------------------------- |
| **Bento Grids (便当网格) (Modern Cliché)**        | 每个 AI 设计都在用         | 为什么这个内容 **需要** 网格？     |
| **Hero Split (Left/Right) (左右分割 Hero)**       | 可预测且无聊               | 巨大的排版或垂直叙事怎么样？       |
| **Mesh/Aurora Gradients (网格/极光渐变)**         | "新"的懒惰背景             | 什么是激进的颜色配对？             |
| **Glassmorphism (玻璃拟态)**                      | AI 认为的 "Premium (高级)" | 实色、高对比度的扁平化怎么样？     |
| **Deep Cyan / Fintech Blue (深青/金融科技蓝)**    | 紫色禁令后的避风港         | 为什么不是红色、黑色或霓虹绿？     |
| **"Orchestrate / Empower" (编排/赋能)**           | AI 生成的文案              | 人类会怎么说这个？                 |
| Dark background + neon glow (深色背景 + 霓虹发光) | 过度使用，"AI 风格"        | **品牌** 实际上需要什么？          |
| **Rounded everything (全圆角)**                   | 通用/安全                  | 哪里可以使用锐利、粗野主义的边缘？ |

> 🔴 **"你选择的每一个‘安全’结构都会让你离通用模板更近一步。承担风险 (TAKE RISKS)。"**

---

## 1. 约束分析 (始终优先) - Constraint Analysis (ALWAYS FIRST)

在任何设计工作之前，回答这些问题或询问用户：

| Constraint (约束)     | Question (问题)  | Why It Matters (为什么重要) |
| --------------------- | ---------------- | --------------------------- |
| **Timeline (时间线)** | 多少时间？       | 决定复杂性                  |
| **Content (内容)**    | 就绪还是占位符？ | 影响布局灵活性              |
| **Brand (品牌)**      | 现有指南？       | 可能规定颜色/字体           |
| **Tech (技术)**       | 什么技术栈？     | 影响能力                    |
| **Audience (受众)**   | 到底是谁？       | 驱动所有视觉决策            |

### 受众 → 设计方法 (Audience → Design Approach)

| 受众                       | 思考方向                   |
| -------------------------- | -------------------------- |
| **Gen Z (Z 世代)**         | 大胆、快速、移动优先、真实 |
| **Millennials (千禧一代)** | 干净、极简、价值驱动       |
| **Gen X (X 世代)**         | 熟悉、值得信赖、清晰       |
| **Boomers (婴儿潮一代)**   | 易读、高对比度、简单       |
| **B2B**                    | 专业、数据为中心、信任     |
| **Luxury (奢侈品)**        | 克制的优雅、留白           |

---

## 2. UX 心理学原则 (UX Psychology Principles)

### 核心定律 (内化这些) - Core Laws (Internalize These)

| 定律                               | 原则                   | 应用                         |
| ---------------------------------- | ---------------------- | ---------------------------- |
| **Hick's Law (希克定律)**          | 更多选择 = 更慢决策    | 限制选项，使用渐进式披露     |
| **Fitts' Law (菲茨定律)**          | 更大 + 更近 = 更易点击 | 适当调整 CTA (行动号召) 大小 |
| **Miller's Law (米勒定律)**        | 工作记忆约 7 项        | 将内容分组 (Chunking)        |
| **Von Restorff (冯·雷斯托夫效应)** | 不同 = 难忘            | 使 CTA 视觉独特              |
| **Serial Position (系列位置效应)** | 最初/最后记得最清      | 关键信息在开始/结束          |

### 情感设计层级 (Emotional Design Levels)

```
VISCERAL (本能)    → First impression (第一印象): colors (颜色), imagery (意象), overall feel (整体感觉)
BEHAVIORAL (行为)  → Using it (使用它): speed (速度), feedback (反馈), efficiency (效率)
REFLECTIVE (反思)  → After (之后): "I like what this says about me" ("我喜欢这所表达的关于我的特质")
```

### 建立信任 (Trust Building)

- 敏感操作上的安全指示器
- 相关处的社会证明 (Social proof)
- 清晰的联系/支持入口
- 一致、专业的设计
- 透明的政策

---

## 3. 布局原则 (Layout Principles)

### 黄金比例 (Golden Ratio) (φ = 1.618)

```
用于比例和谐:
├── Content (内容) : Sidebar (侧边栏) = roughly 62% : 38%
├── Each heading size (每个标题大小) = previous (上一个) × 1.618 (for dramatic scale/为了戏剧性比例)
├── Spacing (间距) can follow: sm → md → lg (each × 1.618)
```

### 8 点网格概念 (8-Point Grid Concept)

```
All spacing and sizing in multiples of 8 (所有间距和尺寸均为 8 的倍数):
├── Tight (紧凑): 4px (half-step for micro/微小的半步)
├── Small (小): 8px
├── Medium (中): 16px
├── Large (大): 24px, 32px
├── XL (超大): 48px, 64px, 80px
└── Adjust based on content density (根据内容密度调整)
```

### 关键尺寸原则 (Key Sizing Principles)

| 元素                         | 考虑因素             |
| ---------------------------- | -------------------- |
| **Touch targets (触摸目标)** | 最小舒适点击尺寸     |
| **Buttons (按钮)**           | 基于重要性层级的高度 |
| **Inputs (输入框)**          | 与按钮高度匹配以对齐 |
| **Cards (卡片)**             | 一致的内边距，透气   |
| **Reading width (阅读宽度)** | 45-75 字符为最佳     |

---

## 4. 颜色原则 (Color Principles)

### 60-30-10 规则 (60-30-10 Rule)

```
60% → Primary/Background (主色/背景) (calm, neutral base/平静，中性基底)
30% → Secondary (辅助色) (supporting areas/支撑区域)
10% → Accent (强调色) (CTAs, highlights, attention/行动号召，高亮，注意)
```

### 颜色心理学 (用于决策) - Color Psychology (For Decision Making)

| 如果你需要...                   | 考虑色相             | 避免         |
| ------------------------------- | -------------------- | ------------ |
| Trust, calm (信任，平静)        | 蓝色系               | 激进的红色   |
| Growth, nature (增长，自然)     | 绿色系               | 工业灰色     |
| Energy, urgency (能量，紧迫)    | 橙色，红色           | 被动的蓝色   |
| Luxury, creativity (奢华，创意) | 深青色，金色，祖母绿 | 廉价感的亮色 |
| Clean, minimal (干净，极简)     | 中性色               | 压倒性的颜色 |

### 选择流程 (Selection Process)

1. **What's the industry? (什么行业？)** (缩小选项)
2. **What's the emotion? (什么情绪？)** (挑选主色)
3. **Light or dark mode? (亮色还是暗色模式？)** (设定基础)
4. **ASK USER (询问用户)** 如果未指定

有关详细颜色理论：[color-system.md](color-system.md)

---

## 5. 排版原则 (Typography Principles)

### 比例选择 (Scale Selection)

| 内容类型                 | 比例系数  | 感觉          |
| ------------------------ | --------- | ------------- |
| Dense UI (紧凑 UI)       | 1.125-1.2 | 紧凑，高效    |
| General web (通用 Web)   | 1.25      | 平衡 (最常见) |
| Editorial (编辑类)       | 1.333     | 易读，宽敞    |
| Hero/display (Hero/展示) | 1.5-1.618 | 戏剧性冲击    |

### 配对概念 (Pairing Concept)

```
Contrast + Harmony (对比 + 和谐):
├── DIFFERENT enough for hierarchy (足够不同以区分层级)
├── SIMILAR enough for cohesion (足够相似以保持内聚)
└── Usually (通常): display + neutral (展示 + 中性), or serif + sans (衬线 + 无衬线)
```

### 易读性规则 (Readability Rules)

- **Line length (行长)**: 45-75 字符最佳
- **Line height (行高)**: 正文文本 1.4-1.6
- **Contrast (对比度)**: 检查 WCAG 要求
- **Size (字号)**: Web 正文 16px+

有关详细排版：[typography-system.md](typography-system.md)

---

## 6. 视觉效果原则 (Visual Effects Principles)

### 玻璃拟态 (Glassmorphism) (适当时)

```
Key properties (关键属性):
├── Semi-transparent background (半透明背景)
├── Backdrop blur (背景模糊)
├── Subtle border for definition (用于定义的微妙边框)
└── ⚠️ **WARNING:** Standard blue/white glassmorphism is a modern cliché. Use it radically or not at all (标准的蓝/白玻璃拟态是现代陈词滥调。要么激进地使用，要么不用)。
```

### 阴影层级 (Shadow Hierarchy)

```
Elevation concept (抬升概念):
├── Higher elements = larger shadows (更高元素 = 更大阴影)
├── Y-offset > X-offset (light from above) (Y 偏移 > X 偏移 (光从上方来))
├── Multiple layers = more realistic (多层 = 更真实)
└── Dark mode (暗色模式): may need glow instead (可能需要发光代替)
```

### 渐变使用 (Gradient Usage)

```
Harmonious gradients (和谐的渐变):
├── Adjacent colors on wheel (色轮上的相邻颜色) (analogous/类比)
├── OR same hue, different lightness (或者相同色相，不同亮度)
├── Avoid harsh complementary pairs (避免刺眼的互补对)
├── 🚫 **NO Mesh/Aurora Gradients (禁止网格/极光渐变)** (floating blobs/漂浮的斑点)
└── VARY from project to project radically (在不同项目中激进地变化)
```

有关完整效果指南：[visual-effects.md](visual-effects.md)

---

## 7. 动画原则 (Animation Principles)

### 计时概念 (Timing Concept)

```
Duration based on (持续时间基于):
├── Distance (距离) (further = longer/更远 = 更长)
├── Size (尺寸) (larger = slower/更大 = 更慢)
├── Importance (重要性) (critical = clear/关键 = 清晰)
└── Context (上下文) (urgent = fast/紧急 = 快, luxury = slow/奢华 = 慢)
```

### 缓动选择 (Easing Selection)

| 动作            | 缓动        | 为什么         |
| --------------- | ----------- | -------------- |
| Entering (进入) | Ease-out    | 减速，安顿下来 |
| Leaving (离开)  | Ease-in     | 加速，退出     |
| Emphasis (强调) | Ease-in-out | 平滑，刻意     |
| Playful (好玩)  | Bounce      | 有趣，充满活力 |

### 性能 (Performance)

- 仅动画化 transform 和 opacity
- 尊重减弱动态 (reduced-motion) 偏好
- 在低端设备上测试

有关动画模式：[animation-guide.md](animation-guide.md)，进阶：[motion-graphics.md](motion-graphics.md)

---

## 8. "Wow Factor" 检查清单 ("Wow Factor" Checklist)

### 高级感指标 (Premium Indicators)

- [ ] Generous whitespace (慷慨的留白) (luxury = breathing room/奢华 = 呼吸空间)
- [ ] Subtle depth and dimension (微妙的深度和维度)
- [ ] Smooth, purposeful animations (流畅、有目的的动画)
- [ ] Attention to detail (关注细节) (alignment, consistency/对齐，一致性)
- [ ] Cohesive visual rhythm (内聚的视觉韵律)
- [ ] Custom elements (自定义元素) (not all defaults/不全是默认值)

### 信任构建者 (Trust Builders)

- [ ] Security cues where appropriate (适当时的安全提示)
- [ ] Social proof / testimonials (社会证明/推荐)
- [ ] Clear value proposition (清晰的价值主张)
- [ ] Professional imagery (专业的意象)
- [ ] Consistent design language (一致的设计语言)

### 情感触发器 (Emotional Triggers)

- [ ] Hero that evokes intended emotion (唤起预期情绪的 Hero)
- [ ] Human elements (人文元素) (faces, stories/面孔，故事)
- [ ] Progress/achievement indicators (进度/成就指示器)
- [ ] Moments of delight (愉悦时刻)

---

## 9. 反模式 (Anti-Patterns) (不要做什么)

### ❌ 懒惰设计指标 (Lazy Design Indicators)

- 不考虑就使用默认系统字体
- 不匹配的库存图片
- 不一致的间距
- 太多相互竞争的颜色
- 没有层级的文字墙
- 不可访问的对比度

### ❌ AI 倾向模式 (避免！) - AI Tendency Patterns (AVOID!)

- **Same colors every project (每个项目都是相同的颜色)**
- **Dark + neon as default (默认暗色 + 霓虹)**
- **Purple/violet everything (紫色/紫罗兰色一切) (PURPLE BAN/紫色禁令 ✅)**
- **Bento grids for simple landing pages (简单落地页使用便当网格)**
- **Mesh Gradients & Glow Effects (网格渐变 & 发光效果)**
- **Same layout structure / Vercel clone (相同的布局结构 / Vercel 克隆)**
- **Not asking user preferences (不询问用户偏好)**

### ❌ 黑暗模式 (不道德) - Dark Patterns (Unethical)

- 隐藏成本
- 虚假紧迫感
- 强制行动
- 欺骗性 UI
- 确认羞辱 (Confirmshaming)

---

## 10. 决策流程总结 (Decision Process Summary)

```
For EVERY design task (对于每个设计任务):

1. CONSTRAINTS (约束)
   └── What's the timeline, brand, tech, audience? (时间线、品牌、技术、受众是什么？)
   └── If unclear → ASK (如果不清楚 → 问)

2. CONTENT (内容)
   └── What content exists? (存在什么内容？)
   └── What's the hierarchy? (层级是什么？)

3. STYLE DIRECTION (风格方向)
   └── What's appropriate for context? (什么适合上下文？)
   └── If unclear → ASK (don't default!) (如果不清楚 → 问 (不要用默认！))

4. EXECUTION (执行)
   └── Apply principles above (应用上述原则)
   └── Check against anti-patterns (对照反模式检查)

5. REVIEW (审查)
   └── "Does this serve the user?" ("这服务于用户吗？")
   └── "Is this different from my defaults?" ("这与我的默认设置不同吗？")
   └── "Would I be proud of this?" ("我会为此感到自豪吗？")
```

---

## 参考文件 (Reference Files)

有关特定领域的更深入指导：

- [color-system.md](color-system.md) - Color theory and selection process (颜色理论和选择流程)
- [typography-system.md](typography-system.md) - Font pairing and scale decisions (字体搭配和比例决策)
- [visual-effects.md](visual-effects.md) - Effects principles and techniques (效果原则和技术)
- [animation-guide.md](animation-guide.md) - Motion design principles (动态设计原则)
- [motion-graphics.md](motion-graphics.md) - Advanced (进阶): Lottie, GSAP, SVG, 3D, Particles
- [decision-trees.md](decision-trees.md) - Context-specific templates (特定于上下文的模板)
- [ux-psychology.md](ux-psychology.md) - User psychology deep dive (用户心理学深潜)

---

## 相关 Skill (Related Skills)

| Skill (技能)                                                   | 何时使用                                      |
| -------------------------------------------------------------- | --------------------------------------------- |
| **frontend-design** (this/本技能)                              | 编码前 - 学习设计原则 (颜色, 排版, UX 心理学) |
| **[web-design-guidelines](../web-design-guidelines/SKILL.md)** | 编码后 - 审计无障碍性、性能和最佳实践         |

## 设计后工作流 (Post-Design Workflow)

实施设计后，运行审计：

```
1. DESIGN (设计) → Read frontend-design principles (阅读前端设计原则) ← YOU ARE HERE (你在这里)
2. CODE (编码)   → Implement the design (实施设计)
3. AUDIT (审计)  → Run web-design-guidelines review (运行 web-design-guidelines 审查)
4. FIX (修复)    → Address findings from audit (解决审计发现的问题)
```

> **下一步 (Next Step):** 编码后，使用 `web-design-guidelines` 技能来审计你的实现，检查无障碍性、焦点状态、动画和性能问题。

---

> **记住：** Design is THINKING, not copying (设计是思考，而不是复制)。每个项目都值得基于其独特背景和用户进行新的考虑。**Avoid the Modern SaaS Safe Harbor (避免现代 SaaS 避风港)!**
