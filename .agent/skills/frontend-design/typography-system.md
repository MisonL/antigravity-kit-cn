# 字体排版系统参考（Typography System Reference）

> 字体排版（Typography）的原则与决策方法：学会思考，而不是死记参数。
> **不预设固定字体名与字号，重点是理解系统。**

---

## 1. 模块化比例原则（Modular Scale Principles）

### 什么是模块化比例（Modular Scale）？

```
字号之间的数学关系：
├── 先选一个 BASE（基础字号，通常是正文）
├── 再选一个 RATIO（比例系数）
└── 按公式生成所有字号：base × ratio^n
```

### 常见比例与适用场景（Common Ratios and When to Use）

| 比例（Ratio） | 数值（Value） | 视觉感受（Feeling） | 适用场景（Best For） |
|---------------|---------------|---------------------|----------------------|
| Minor Second | 1.067 | 非常克制 | 信息密集 UI、小屏 |
| Major Second | 1.125 | 轻微层级 | 紧凑型界面 |
| Minor Third | 1.2 | 舒适 | 移动应用、卡片布局 |
| Major Third | 1.25 | 平衡 | 通用 Web（最常见） |
| Perfect Fourth | 1.333 | 层级明显 | 编辑型内容、博客 |
| Perfect Fifth | 1.5 | 戏剧化 | 大标题、营销页 |
| Golden Ratio | 1.618 | 冲击力强 | Hero 区、展示型标题 |

### 生成你的字号阶梯（Generate Your Scale）

```
已知：base = YOUR_BASE_SIZE，ratio = YOUR_RATIO

Scale：
├── xs:  base ÷ ratio²
├── sm:  base ÷ ratio
├── base: YOUR_BASE_SIZE
├── lg:  base × ratio
├── xl:  base × ratio²
├── 2xl: base × ratio³
├── 3xl: base × ratio⁴
└── ... 按需继续扩展
```

### 如何选择基础字号（Choosing Base Size）

| 上下文（Context） | 基础字号范围（Base Size Range） | 原因（Why） |
|-------------------|----------------------------------|-------------|
| 移动端优先（Mobile-first） | 16-18px | 小屏阅读性更好 |
| 桌面应用（Desktop app） | 14-16px | 信息密度更高 |
| 编辑阅读（Editorial） | 18-21px | 长文阅读更舒适 |
| 无障碍优先（Accessibility focus） | 18px+ | 更易识别与阅读 |

---

## 2. 字体配对原则（Font Pairing Principles）

### 两种字体如何“搭得起来”

```
对比（Contrast）+ 和谐（Harmony）：
├── 差异要足够，才能建立层级
├── 相似也要足够，才能保持统一
└── 常见组合：serif + sans，或 display + neutral
```

### 配对策略（Pairing Strategies）

| 策略（Strategy） | 方法（How） | 结果（Result） |
|------------------|-------------|----------------|
| **对比型（Contrast）** | Serif 标题 + Sans 正文 | 经典、编辑感 |
| **同族型（Same Family）** | 同一 Variable Font 不同字重 | 统一、现代 |
| **同设计方（Same Designer）** | 同字体厂牌/设计者作品 | 比例通常更协调 |
| **同年代（Era Match）** | 同时期字体组合 | 风格一致性强 |

### 配对时重点观察（What to Look For）

```
配对时重点比较：
├── x-height（小写字母高度）
├── 字面宽度（窄体/宽体）
├── 笔画对比（粗细变化）
└── 整体气质（正式/轻松）
```

### 相对稳妥的配对模式（Safe Pairing Patterns）

| 标题风格（Heading Style） | 正文风格（Body Style） | 气质（Mood） |
|---------------------------|------------------------|--------------|
| Geometric sans | Humanist sans | 现代、友好 |
| Display serif | Clean sans | 编辑感、精致 |
| Neutral sans | Same sans | 极简、科技 |
| Bold geometric | Light geometric | 当代、干净 |

### 避免（Avoid）

- ❌ 两种装饰性字体同时使用。
- ❌ 过于相似但细节冲突的字体组合。
- ❌ 超过 2-3 个字体家族。
- ❌ x-height 差异过大的组合。

---

## 3. 行高原则（Line Height Principles）

### 行高的决定因素（The Relationship）

```
行高取决于：
├── 字号（越大通常所需行高比越低）
├── 行长（越长通常需要更大行高）
├── 字体设计（不同字体吃空间不同）
└── 内容类型（标题/正文需求不同）
```

### 场景建议（Guidelines by Context）

| 内容类型（Content Type） | 行高范围（Line Height Range） | 原因（Why） |
|--------------------------|--------------------------------|-------------|
| **标题（Headings）** | 1.1 - 1.3 | 行短，宜紧凑 |
| **正文（Body text）** | 1.4 - 1.6 | 阅读舒适 |
| **长文（Long-form）** | 1.6 - 1.8 | 可读性更高 |
| **界面元素（UI elements）** | 1.2 - 1.4 | 提升空间效率 |

### 调整因子（Adjustment Factors）

- 行长更长（Longer line length）→ 行高适当增加。
- 字号更大（Larger font size）→ 行高比可适当降低。
- 全大写（ALL CAPS）→ 往往需要更多行高。
- 字距偏紧（Tight tracking）→ 往往需要更多行高。

---

## 4. 行长原则（Line Length Principles）

### 最佳阅读宽度（Optimal Reading Width）

```
舒适区间：每行 45-75 个字符
├── < 45：断行过于频繁，阅读节奏破碎
├── 45-75：阅读最舒适
├── > 75：视线追踪压力增加
```

### 如何度量（How to Measure）

```css
/* 基于字符宽度（推荐） */
max-width: 65ch; /* ch = 字符 "0" 的宽度 */

/* 会随字号变化自动适配 */
```

### 场景调节（Context Adjustments）

| 场景（Context） | 字符范围（Character Range） |
|-----------------|-----------------------------|
| 桌面文章（Desktop article） | 60-75 字符 |
| 移动端（Mobile） | 35-50 字符 |
| 侧栏文本（Sidebar text） | 30-45 字符 |
| 超宽屏（Wide monitors） | 仍建议上限约 75ch |

---

## 5. 响应式排版原则（Responsive Typography Principles）

### 问题本质（The Problem）

```
固定字号无法良好跨端：
├── 桌面字号到移动端会显得过大
├── 移动字号到桌面端会显得过小
└── 断点突变会造成跳跃感
```

### 流体排版（Fluid Typography, clamp）

```css
/* 语法：clamp(MIN, PREFERRED, MAX) */
font-size: clamp(
  MINIMUM_SIZE,
  FLUID_CALCULATION,
  MAXIMUM_SIZE
);

/* FLUID_CALCULATION 常见形式：
   base + viewport-relative-unit */
```

### 缩放策略（Scaling Strategy）

| 元素（Element） | 缩放行为（Scaling Behavior） |
|-----------------|------------------------------|
| 正文（Body text） | 小幅缩放（如 1rem → 1.125rem） |
| 副标题（Subheadings） | 中等缩放 |
| 标题（Headings） | 更明显缩放 |
| 展示字（Display text） | 缩放幅度最大 |

---

## 6. 字重与强调原则（Weight and Emphasis Principles）

### 语义化字重使用（Semantic Weight Usage）

| 字重范围（Weight Range） | 名称（Name） | 用途（Use For） |
|--------------------------|--------------|-----------------|
| 300-400 | Light/Normal | 正文、段落 |
| 500 | Medium | 轻强调 |
| 600 | Semibold | 小标题、标签 |
| 700 | Bold | 标题、强强调 |
| 800-900 | Heavy/Black | 展示位、Hero 文本 |

### 如何制造对比（Creating Contrast）

```
有效对比 = 至少跨 2 个字重层级
├── 400 正文 + 700 标题 = 良好
├── 400 正文 + 500 强调 = 轻度
└── 600 标题 + 700 副标题 = 过近
```

### 避免（Avoid）

- ❌ 一页使用过多字重（建议最多 3-4 种）。
- ❌ 相邻字重做层级（如 400/500）导致层级不清。
- ❌ 长文本使用过重字重。

---

## 7. 字间距原则（Letter Spacing / Tracking）

### 核心原则（Principles）

```
大字（标题）应适度收紧 tracking：
├── 字越大，视觉空隙感越明显
└── 轻微负字距通常更紧凑

小字（正文）保持正常或略放宽：
├── 小字号下可读性更关键
└── 正文不要使用负字距

全大写（ALL CAPS）要增大字距：
├── 大写缺少升降部特征
└── 需额外空间避免拥挤
```

### 调整建议（Adjustment Guidelines）

| 场景（Context） | 字距建议（Tracking Adjustment） |
|-----------------|---------------------------------|
| Display/Hero | -2% to -4% |
| Headings | -1% to -2% |
| Body text | 0%（默认） |
| Small text | +1% to +2% |
| ALL CAPS | +5% to +10% |

---

## 8. 层级原则（Hierarchy Principles）

### 通过排版建立视觉层级

```
建立层级的主要手段：
├── SIZE（字号，最直观）
├── WEIGHT（字重，突出重点）
├── COLOR（颜色，对比等级）
├── SPACING（间距，分隔区块）
└── POSITION（位置，上方优先）
```

### 典型层级（Typical Hierarchy）

| 层级（Level） | 特征（Characteristics） |
|---------------|--------------------------|
| Primary（H1） | 最大、最醒目、辨识度最高 |
| Secondary（H2） | 明显更小，但仍突出 |
| Tertiary（H3） | 中等字号，可主要靠字重区分 |
| Body | 标准字号与字重 |
| Caption/Meta | 更小字号，常配更浅颜色 |

### 层级自测（Testing Hierarchy）

问自己一句："一眼能看出哪部分最重要吗？"

将页面眯眼观察时，层级仍应清晰。

---

## 9. 可读性心理学（Readability Psychology）

### F 型阅读路径（F-Pattern Reading）

```
用户常按 F 型扫描：
├── 先横向扫顶部（首行）
├── 再沿左侧纵向扫读
├── 再次横向扫（常在副标题）
└── 继续向下沿左侧浏览
```

**含义（Implication）**：关键信息应优先放在左侧与标题区域。

### 分块提升理解（Chunking for Comprehension）

- 段落保持简短（建议每段不超过 3-4 行）。
- 使用清晰小标题。
- 列表信息优先用 bullet points。
- 区块之间留出足够留白。

### 认知易读性（Cognitive Ease）

- 熟悉字体更容易阅读。
- 高对比降低视觉疲劳。
- 一致模式提升可预测性。

---

## 10. 排版选型检查清单（Typography Selection Checklist）

在最终确定排版前：

- [ ] **是否先询问了用户的字体偏好？**
- [ ] **是否考虑品牌与场景语境？**
- [ ] **是否选择了合适的比例（scale ratio）？**
- [ ] **是否限制在 2-3 个字体家族内？**
- [ ] **是否在所有字号下验证过可读性？**
- [ ] **是否检查了行长（45-75ch）？**
- [ ] **是否验证了无障碍对比度（accessibility）？**
- [ ] **是否与上一个项目风格有区分？**

### 反模式（Anti-Patterns）

- ❌ 每个项目都使用同一套字体。
- ❌ 字体家族过多。
- ❌ 只追求风格、忽视可读性。
- ❌ 固定字号且不做响应式。
- ❌ 正文使用装饰性字体。

---

> **记住（Remember）**：Typography 的核心是“信息传达清晰”。优先依据内容需求与受众来做选择，而非个人偏好。
