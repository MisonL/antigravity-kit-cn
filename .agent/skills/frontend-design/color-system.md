# 色彩系统参考 (Color System Reference)

> 色彩理论原则、选色流程与决策指南。  
> **不要死记十六进制色值，要学会“如何思考颜色”。**

---

## 1. 色彩理论基础 (Color Theory Fundamentals)

### 色环 (The Color Wheel)

```
                    YELLOW
                      │
           Yellow-    │    Yellow-
           Green      │    Orange
              ╲       │       ╱
               ╲      │      ╱
    GREEN ─────────── ● ─────────── ORANGE
               ╱      │      ╲
              ╱       │       ╲
           Blue-      │    Red-
           Green      │    Orange
                      │
                     RED
                      │
                   PURPLE
                  ╱       ╲
             Blue-         Red-
             Purple        Purple
                  ╲       ╱
                    BLUE
```

### 色彩关系 (Color Relationships)

| Scheme | How to Create | When to Use |
|--------|---------------|-------------|
| **Monochromatic（单色）** | 只选一个 hue，仅改变明度/饱和度 | 极简、专业、一致性强 |
| **Analogous（邻近色）** | 在色环上选 2-3 个相邻 hue | 和谐、平静、自然感 |
| **Complementary（互补色）** | 选色环上相对 hue | 高对比、鲜明、吸睛 |
| **Split-Complementary（分裂互补）** | 主色 + 互补色两侧相邻色 | 动态但更平衡 |
| **Triadic（三角色）** | 色环上等距 3 个 hue | 活泼、创意、表现力强 |

### 如何选择配色关系：
1. **项目氛围是什么？** 平静 → 邻近色；大胆 → 互补色。
2. **需要多少颜色？** 简洁 → 单色；复杂 → 三角色。
3. **受众是谁？** 保守 → 单色；年轻化 → 三角色。

---

## 2. 60-30-10 规则

### 分布原则 (Distribution Principle)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     60% PRIMARY (Background, large areas)       │
│     → Should be neutral or calming              │
│     → Carries the overall tone                  │
│                                                 │
├────────────────────────────────────┬────────────┤
│                                    │            │
│   30% SECONDARY                    │ 10% ACCENT │
│   (Cards, sections, headers)       │ (CTAs,     │
│   → Supports without dominating    │ highlights)│
│                                    │ → Draws    │
│                                    │   attention│
└────────────────────────────────────┴────────────┘
```

### 实现模式 (Implementation Pattern)
```css
:root {
  /* 60% - Pick based on light/dark mode and mood */
  --color-bg: /* neutral: white, off-white, or dark gray */
  --color-surface: /* slightly different from bg */
  
  /* 30% - Pick based on brand or context */
  --color-secondary: /* muted version of primary or neutral */
  
  /* 10% - Pick based on desired action/emotion */
  --color-accent: /* vibrant, attention-grabbing */
}
```

---

## 3. 色彩心理学：含义与选色 (Color Psychology)

### 按场景选色 (How to Choose Based on Context)

| If Project Is... | Consider These Hues | Why |
|------------------|---------------------|-----|
| **Finance, Tech, Healthcare** | Blues, Teals | 信任、稳定、平静 |
| **Eco, Wellness, Nature** | Greens, Earth tones | 生长、健康、自然 |
| **Food, Energy, Youth** | Orange, Yellow, Warm | 食欲、兴奋、温暖 |
| **Luxury, Beauty, Creative** | Deep Teal, Gold, Black | 高级感、质感、专业度 |
| **Urgency, Sales, Alerts** | Red, Orange | 行动驱动、强提醒 |

### 情绪联想（用于决策）(Emotional Associations)

| Hue Family | Positive Associations | Cautions |
|------------|----------------------|----------|
| **Blue** | 信任、冷静、专业 | 可能偏冷、企业感过重 |
| **Green** | 生长、自然、成功 | 过度使用会显平淡 |
| **Red** | 激情、紧迫、能量 | 刺激性高，需节制 |
| **Orange** | 温暖、友好、创意 | 饱和过高会显廉价 |
| **Purple** | ⚠️ **BANNED** - AI 过度使用！ | 建议改用 Deep Teal/Maroon/Emerald |
| **Yellow** | 乐观、注意力、活力 | 可读性弱，适合点缀 |
| **Black** | 优雅、力量、现代 | 可能显沉重 |
| **White** | 干净、极简、开阔 | 可能显冷淡 |

### 选色流程：
1. **行业是什么？** → 先收敛到 2-3 个色相家族
2. **情绪目标是什么？** → 选主色相
3. **对比策略是什么？** → 决定 light / dark 模式
4. **询问用户** → 确认后再落地

---

## 4. 调色盘生成原则 (Palette Generation Principles)

### 从单色出发（HSL 方法）

不要背 hex，学会 **操作 HSL**：

```
HSL = Hue, Saturation, Lightness

Hue (0-360): 色相家族
  0/360 = Red
  60 = Yellow
  120 = Green
  180 = Cyan
  240 = Blue
  300 = Purple

Saturation (0-100%): 饱和度
  Low = 低饱和、稳重
  High = 高饱和、活跃

Lightness (0-100%): 明度
  0% = Black
  50% = Pure color
  100% = White
```

### 生成完整色阶 (Generating a Full Palette)

给任意基色，建立阶梯：

```
Lightness Scale:
  50  (lightest) → L: 97%
  100            → L: 94%
  200            → L: 86%
  300            → L: 74%
  400            → L: 66%
  500 (base)     → L: 50-60%
  600            → L: 48%
  700            → L: 38%
  800            → L: 30%
  900 (darkest)  → L: 20%
```

### 饱和度调整 (Saturation Adjustments)

| Context | Saturation Level |
|---------|-----------------|
| **Professional/Corporate** | 较低（40-60%） |
| **Playful/Youth** | 较高（70-90%） |
| **Dark Mode** | 下调 10-20% |
| **Accessibility** | 以对比度为准，必要时继续调整 |

---

## 5. 基于上下文的选色指南 (Context-Based Selection Guide)

### 不要抄现成调色盘，按流程走：

**Step 1：识别场景**
```
What type of project?
├── E-commerce → Need trust + urgency balance
├── SaaS/Dashboard → Need low-fatigue, data focus
├── Health/Wellness → Need calming, natural feel
├── Luxury/Premium → Need understated elegance
├── Creative/Portfolio → Need personality, memorable
└── Other → ASK the user
```

**Step 2：选择主色相家族**
```
Based on context, pick ONE:
- Blue family (trust)
- Green family (growth)
- Warm family (energy)
- Neutral family (elegant)
- OR ask user preference
```

**Step 3：决定明暗模式**
```
Consider:
- User preference?
- Industry standard?
- Content type? (text-heavy = light preferred)
- Time of use? (evening app = dark option)
```

**Step 4：按原则生成调色盘**
- 使用 HSL 调整
- 遵循 60-30-10
- 做 WCAG 对比度校验
- 用真实内容做视觉验证

---

## 6. 深色模式原则 (Dark Mode Principles)

### 关键规则（非固定色值）

1. **避免纯黑** → 用带轻微色相的深灰
2. **避免纯白文本** → 建议明度 87-92%
3. **降低饱和度** → 深色模式下高饱和更刺眼
4. **海拔=亮度** → 层级越高，背景应略亮

### 深色模式中的层级对比

```
Background layers (darker → lighter as elevation increases):
Layer 0 (base)    → Darkest
Layer 1 (cards)   → Slightly lighter
Layer 2 (modals)  → Even lighter
Layer 3 (popups)  → Lightest dark
```

### Light → Dark 颜色适配

| Light Mode | Dark Mode Adjustment |
|------------|---------------------|
| 高饱和强调色 | 饱和度下调 10-20% |
| 纯白背景 | 改为带品牌色倾向的深灰 |
| 黑色文本 | 改为浅灰（非纯白） |
| 高彩背景 | 用降饱和、降明度版本 |

---

## 7. 无障碍指南 (Accessibility Guidelines)

### 对比度要求（WCAG）

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA (minimum) | 4.5:1 | 3:1 |
| AAA (enhanced) | 7:1 | 4.5:1 |

### 对比度检查流程

1. **转为相对亮度**
2. **计算比值**：`(lighter + 0.05) / (darker + 0.05)`
3. **持续调整**到满足目标等级

### 安全模式 (Safe Patterns)

| Use Case | Guideline |
|----------|-----------|
| **Text on light bg** | 文本明度建议 ≤ 35% |
| **Text on dark bg** | 文本明度建议 ≥ 85% |
| **Primary on white** | 主色需提供足够深的可读版本 |
| **Buttons** | 按钮底色与文字必须高对比 |

---

## 8. 选色检查清单 (Color Selection Checklist)

定稿前逐项确认：

- [ ] **问过用户偏好吗？**（若需求未指定）
- [ ] **匹配项目上下文吗？**（行业、受众）
- [ ] **遵循 60-30-10 吗？**（分布合理）
- [ ] **满足 WCAG 吗？**（已测对比度）
- [ ] **明暗模式都可用吗？**（若项目需要 dark mode）
- [ ] **不是你的默认最爱配色吗？**（避免惯性）
- [ ] **和上个项目明显不同吗？**（避免重复）

---

## 9. 需要避免的反模式 (Anti-Patterns to Avoid)

### ❌ DON'T:
- 每个项目都复用同一组 hex
- 默认紫色/紫罗兰（AI 常见倾向）
- 默认 dark mode + neon（AI 常见倾向）
- 用纯黑（#000000）做背景
- 在深色背景上用纯白（#FFFFFF）文本
- 忽略行业语境
- 跳过用户偏好确认

### ✅ DO:
- 每个项目生成新的调色体系
- 主动确认用户色彩偏好
- 按行业与受众决策
- 用 HSL 进行可控调整
- 做对比度与可访问性验证
- 同时提供 light 与 dark 方案（按需求）

---

> **牢记：** 颜色是“决策结果”，不是“默认配置”。每个项目都值得基于其独特语境进行认真选择。
