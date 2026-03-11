# 移动端排版参考（Mobile Typography Reference）

> 字号比例、系统字体、Dynamic Type、无障碍与暗色模式排版。
> **排版失败是移动端不可读的头号原因。**

---

## 1. 移动端排版基础（Mobile Typography Fundamentals）

### 为什么移动端排版不同（Why Mobile Type is Different）

```
DESKTOP：                        MOBILE：
├── 20-30" 观看距离              ├── 12-15" 观看距离
├── 视口大                         ├── 视口小且窄
├── Hover 获取信息                 ├── Tap/Scroll 获取信息
├── 光照可控                       ├── 光照变化大（户外等）
├── 字号固定                       ├── 用户可调字号
└── 长时阅读                       └── 快速扫读
```

### 移动端排版规则（Mobile Type Rules）

| 规则（Rule） | Desktop | Mobile |
|-------------|---------|--------|
| **正文最小字号** | 14px | 16px（14pt/14sp） |
| **最大行长** | 75 字符 | 40-60 字符 |
| **行高** | 1.4-1.5 | 1.4-1.6（更宽松） |
| **字重** | 可变 | 正文字重偏 Regular，Bold 克制 |
| **对比度** | AA（4.5:1） | AA 最低，优选 AAA |

---

## 2. 系统字体（System Fonts）

### iOS：SF Pro 家族

```
San Francisco（SF）家族：
├── SF Pro Display：大标题（≥ 20pt）
├── SF Pro Text：正文（< 20pt）
├── SF Pro Rounded：更亲和场景
├── SF Mono：等宽字体
└── SF Compact：Apple Watch / 紧凑 UI

特性：
├── Optical sizing（自动光学尺寸调整）
├── Dynamic tracking（动态字距）
├── Tabular/Proportional 数字
├── 可读性极强
```

### Android：Roboto 家族

```
Roboto 家族：
├── Roboto：默认无衬线
├── Roboto Flex：可变字体
├── Roboto Serif：衬线
├── Roboto Mono：等宽
├── Roboto Condensed：紧凑版

特性：
├── 屏幕优化
├── 多语言覆盖
├── 丰富字重
├── 小字号清晰
```

### 何时使用系统字体（When to Use System Fonts）

```
✅ 适合系统字体：
├── 品牌不要求自定义字体
├── 阅读效率优先
├── 原生一致感更重要
├── 性能关键
├── 需要广泛语言支持

❌ 不适合系统字体：
├── 强品牌识别必须自定义
├── 需要视觉差异化
├── 编辑/杂志型排版
└──（但仍需兼顾无障碍）
```

### 自定义字体注意事项（Custom Font Considerations）

```
使用自定义字体时：
├── 仅引入必要字重
├── 子集化减小体积
├── 所有 Dynamic Type 尺寸都测试
├── 兜底为系统字体
├── 评估渲染质量
└── 检查语言覆盖
```

---

## 3. 字号比例（Type Scale）

### iOS 字号体系（Built-in）

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Large Title | 34pt | Bold | 41pt |
| Title 1 | 28pt | Bold | 34pt |
| Title 2 | 22pt | Bold | 28pt |
| Title 3 | 20pt | Semibold | 25pt |
| Headline | 17pt | Semibold | 22pt |
| Body | 17pt | Regular | 22pt |
| Callout | 16pt | Regular | 21pt |
| Subhead | 15pt | Regular | 20pt |
| Footnote | 13pt | Regular | 18pt |
| Caption 1 | 12pt | Regular | 16pt |
| Caption 2 | 11pt | Regular | 13pt |

### Android 字号体系（Material 3）

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display Large | 57sp | 400 | 64sp |
| Display Medium | 45sp | 400 | 52sp |
| Display Small | 36sp | 400 | 44sp |
| Headline Large | 32sp | 400 | 40sp |
| Headline Medium | 28sp | 400 | 36sp |
| Headline Small | 24sp | 400 | 32sp |
| Title Large | 22sp | 400 | 28sp |
| Title Medium | 16sp | 500 | 24sp |
| Title Small | 14sp | 500 | 20sp |
| Body Large | 16sp | 400 | 24sp |
| Body Medium | 14sp | 400 | 20sp |
| Body Small | 12sp | 400 | 16sp |
| Label Large | 14sp | 500 | 20sp |
| Label Medium | 12sp | 500 | 16sp |
| Label Small | 11sp | 500 | 16sp |

### 自定义比例（Creating Custom Scale）

```
若需自定义比例，使用 modular ratio：

推荐比例：
├── 1.125（Major second）：密集 UI
├── 1.200（Minor third）：紧凑
├── 1.250（Major third）：平衡（常见）
├── 1.333（Perfect fourth）：宽松
└── 1.500（Perfect fifth）：戏剧化

以 1.25 比例，16px 为 base 示例：
├── xs: 10px（16 ÷ 1.25 ÷ 1.25）
├── sm: 13px（16 ÷ 1.25）
├── base: 16px
├── lg: 20px（16 × 1.25）
├── xl: 25px（16 × 1.25 × 1.25）
├── 2xl: 31px
├── 3xl: 39px
└── 4xl: 49px
```

---

## 4. Dynamic Type / Text Scaling

### iOS Dynamic Type（必须支持）

```swift
// ❌ 错误：固定字号（不随用户设置缩放）
Text("Hello")
    .font(.system(size: 17))

// ✅ 正确：Dynamic Type
Text("Hello")
    .font(.body) // 随系统设置缩放

// 自定义字体 + Dynamic Type
Text("Hello")
    .font(.custom("MyFont", size: 17, relativeTo: .body))
```

### Android 文本缩放（必须支持）

```
始终用 sp：
├── sp = Scale-independent pixels
├── 随系统字体设置缩放
├── dp 不会缩放（不要用于文字）

用户可从 85% 放大到 200%：
├── 默认（100%）：14sp = 14dp
├── 最大（200%）：14sp = 28dp

必须测试 200%！
```

### 缩放挑战（Scaling Challenges）

```
大字号问题：
├── 文本溢出容器
├── 按钮过高
├── 图标相对文字显得过小
├── 布局断裂

解决方案：
├── 使用弹性容器（不要固定高度）
├── 允许文本换行
├── 图标随文字缩放
├── 开发时测试极端字号
├── 长文用可滚动容器
```

---

## 5. 排版无障碍（Typography Accessibility）

### 最小字号（Minimum Sizes）

| 元素（Element） | 最小值（Minimum） | 推荐值（Recommended） |
|----------------|-------------------|------------------------|
| Body text | 14px/pt/sp | 16px/pt/sp |
| Secondary text | 12px/pt/sp | 13-14px/pt/sp |
| Captions | 11px/pt/sp | 12px/pt/sp |
| Buttons | 14px/pt/sp | 14-16px/pt/sp |
| **Nothing smaller** | 11px | - |

### 对比度要求（Contrast Requirements, WCAG）

```
普通文本（< 18pt 或 < 14pt bold）：
├── AA：最小 4.5:1
├── AAA：建议 7:1

大文本（≥ 18pt 或 ≥ 14pt bold）：
├── AA：最小 3:1
├── AAA：建议 4.5:1

Logo/装饰性文本：无硬性要求
```

### 无障碍行高（Line Height for Accessibility）

```
WCAG Success Criterion 1.4.12：

行高（line spacing）：≥ 1.5×
段落间距：≥ 字号的 2×
字母间距：≥ 字号的 0.12×
词间距：≥ 字号的 0.16×

移动端建议：
├── 正文：1.4-1.6
├── 标题：1.2-1.3
├── 不低于 1.2
```

---

## 6. 暗色模式排版（Dark Mode Typography）

### 颜色调整（Color Adjustments）

```
Light Mode：               Dark Mode：
├── 黑字（#000）           ├── 白/浅灰（#E0E0E0）
├── 高对比                 ├── 对比略降
├── 饱和度更高             ├── 去饱和
└── 深色用于强调           └── 浅色用于强调

规则：不要在深色背景用纯白（#FFF）。
用 off-white（#E0E0E0 ~ #F0F0F0）减少视觉疲劳。
```

### 暗色模式层级（Dark Mode Hierarchy）

| 层级（Level） | Light Mode | Dark Mode |
|--------------|------------|-----------|
| Primary text | #000000 | #E8E8E8 |
| Secondary text | #666666 | #A0A0A0 |
| Tertiary text | #999999 | #707070 |
| Disabled text | #CCCCCC | #505050 |

### 暗色模式字重（Weight in Dark Mode）

```
暗色模式下文字视觉更细（光晕效应）。

建议：
├── 正文可用 medium 替代 regular
├── 轻微增加字距
├── 在 OLED 真机测试
└── 比亮色模式稍加粗
```

---

## 7. 排版反模式（Typography Anti-Patterns）

### ❌ 常见错误

| 错误（Mistake） | 问题（Problem） | 修复（Fix） |
|----------------|-----------------|-------------|
| **固定字号** | 无障碍失效 | 动态缩放 |
| **文字过小** | 不可读 | 正文 ≥ 14pt/sp |
| **对比度过低** | 阳光下不可见 | ≥ 4.5:1 |
| **行过长** | 难追踪 | ≤ 60 字符 |
| **行高过紧** | 拥挤难读 | ≥ 1.4× |
| **字号过多** | 视觉混乱 | ≤ 5-7 个字号 |
| **正文全大写** | 难读 | 仅标题使用 |
| **浅灰对白** | 强光下不可见 | 提高对比 |

### ❌ AI 排版常见错误

```
AI 常见问题：
├── 使用固定 px 而非 pt/sp
├── 忽略 Dynamic Type
├── 正文过小（12-14px）
├── 忽略行高
├── 低对比“美学灰”
├── 移动端套用桌面比例
└── 不做大字号测试

规则：排版必须能缩放。
必须测试最小与最大设置。
```

---

## 8. 字体加载与性能（Font Loading & Performance）

### 字体文件优化（Font File Optimization）

```
字体体积在移动端很敏感：
├── 完整字体：每个字重 100-300KB
├── 子集（Latin）：每个字重 15-40KB
├── 变量字体：100-200KB（含所有字重）

建议：
├── 只保留必要字符集
├── 使用 WOFF2
├── 最多 2-3 个字体文件
├── 可优先 variable font
├── 合理缓存
```

### 加载策略（Loading Strategy）

```
1. 系统字体兜底
   先显示系统字体 → 自定义字体加载后替换

2. font-display: swap
   避免文字空白

3. 预加载关键字体
   首屏必要字体预加载

4. 不阻塞渲染
   不要为了字体延迟内容展示
```

---

## 9. 排版检查清单（Typography Checklist）

### 任意文本设计前（Before Any Text Design）

- [ ] 正文 ≥ 16px/pt/sp？
- [ ] 行高 ≥ 1.4？
- [ ] 行长 ≤ 60 字符？
- [ ] 字号层级明确（≤ 5-7 个字号）？
- [ ] iOS 使用 pt / Android 使用 sp？

### 发布前（Before Release）

- [ ] iOS Dynamic Type 测试通过？
- [ ] Android 字体缩放 200% 测试？
- [ ] 暗色模式对比度检查？
- [ ] 强光可读性测试？
- [ ] 文本层级清晰？
- [ ] 自定义字体有系统兜底？
- [ ] 长文本滚动正常？

---

## 10. 速查（Quick Reference）

### 排版 Token

```
// iOS
.largeTitle  // 34pt, Bold
.title       // 28pt, Bold
.title2      // 22pt, Bold
.title3      // 20pt, Semibold
.headline    // 17pt, Semibold
.body        // 17pt, Regular
.subheadline // 15pt, Regular
.footnote    // 13pt, Regular
.caption     // 12pt, Regular

// Android (Material 3)
displayLarge   // 57sp
headlineLarge  // 32sp
titleLarge     // 22sp
bodyLarge      // 16sp
labelLarge     // 14sp
```

### 最小字号（Minimum Sizes）

```
Body:       14-16pt/sp（16 优先）
Secondary:  12-13pt/sp
Caption:    11-12pt/sp
Nothing:    < 11pt/sp
```

### 行高（Line Height）

```
Headings:  1.1-1.3
Body:      1.4-1.6
Long text: 1.5-1.75
```

---

> **记住（Remember）**：如果用户读不清你的文字，App 就是坏的。排版不是装饰，它是主要界面。必须在真实设备、真实光线与无障碍设置下测试。
