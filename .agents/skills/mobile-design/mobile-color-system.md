# 移动端颜色系统参考（Mobile Color System Reference）

> OLED 优化、暗色模式、电量友好颜色与户外可见性。
> **移动端颜色不是“审美问题”，还是“电量与可用性问题”。**

---

## 1. 移动端颜色基础（Mobile Color Fundamentals）

### 为什么移动端颜色不同（Why Mobile Color is Different）

```
DESKTOP：                           MOBILE：
├── LCD 屏（背光）                  ├── OLED 普及（自发光）
├── 光照可控                         ├── 户外/强光
├── 电源稳定                         ├── 电量敏感
├── 偏好导向                         ├── 系统级暗色模式
└── 观看稳定                         └── 角度/运动变化大
```

### 移动端颜色优先级（Mobile Color Priorities）

| 优先级 | 原因 |
|--------|------|
| **1. 可读性** | 户外与光照变化 |
| **2. 电量效率** | OLED 下暗色更省电 |
| **3. 系统集成** | 暗色/亮色模式支持 |
| **4. 语义色** | 错误/成功/警告 |
| **5. 品牌色** | 在功能满足后考虑 |

---

## 2. OLED 注意事项（OLED Considerations）

### OLED 与 LCD 的差异

```
LCD（液晶）：
├── 背光一直开
├── 黑色 = 背光穿过暗滤光层
├── 能耗基本恒定
└── 暗色模式几乎不省电

OLED（有机发光）：
├── 每个像素自发光
├── 黑色 = 像素关闭（0 功耗）
├── 能耗随亮度变化
└── 暗色模式可显著省电
```

### OLED 省电与颜色

```
颜色能耗（相对）：

#000000（纯黑）   ████░░░░░░  0%
#1A1A1A（近黑）   █████░░░░░  ~15%
#333333（深灰）   ██████░░░░  ~30%
#666666（中灰）   ███████░░░  ~50%
#FFFFFF（白色）   ██████████  100%

高饱和色也耗电：
├── 蓝色像素：最省电
├── 绿色像素：中等
├── 红色像素：最耗电
└── 去饱和色更省电
```

### 纯黑 vs 近黑

```
#000000（纯黑）：
├── 省电最大
├── 滚动时可能“黑色拖影”
├── 对比极强，略刺眼
└── Apple 纯暗色常用

#121212 或 #1A1A1A（近黑）：
├── 仍然省电
├── 滚动更平滑
├── 眼睛更舒适
└── Material 推荐

建议：背景用 #000000，表面用 #0D0D0D-#1A1A1A
```

---

## 3. 暗色模式设计（Dark Mode Design）

### 暗色模式的价值

```
用户启用暗色模式通常为了：
├── 省电（OLED）
├── 减少眼疲劳（弱光）
├── 个人偏好
├── AMOLED 风格
└── 无障碍（光敏感）
```

### 暗色模式配色策略

```
LIGHT MODE                      DARK MODE
──────────                      ─────────
Background: #FFFFFF      →      #000000 or #121212
Surface:    #F5F5F5      →      #1E1E1E
Surface 2:  #EEEEEE      →      #2C2C2C

Primary:    #1976D2      →      #90CAF9（更亮）
Text:       #212121      →      #E0E0E0（非纯白）
Secondary:  #757575      →      #9E9E9E

暗色模式的“层级”靠亮度：
├── 更高层级 = 表面更亮
├── 0dp → 0% overlay
├── 4dp → 9% overlay
├── 8dp → 12% overlay
└── 用亮度层级营造深度
```

### 暗色模式文本颜色

| 角色 | Light Mode | Dark Mode |
|------|------------|-----------|
| Primary | #000000 | #E8E8E8（非纯白） |
| Secondary | #666666 | #B0B0B0 |
| Disabled | #9E9E9E | #6E6E6E |
| Links | #1976D2 | #8AB4F8 |

### 颜色反转规则

```
不要直接反转颜色：
├── 高饱和色会刺眼
├── 语义色失去含义
├── 品牌色被破坏
└── 对比变化不可控

应当构建独立的暗色 palette：
├── 适度去饱和
├── 用更亮的色阶做强调
├── 语义色保持含义
└── 独立检查对比度
```

---

## 4. 户外可见性（Outdoor Visibility）

### 强光问题（The Sunlight Problem）

```
户外屏幕可见性问题：
├── 强光冲淡低对比
├── 眩光降低可读性
├── 偏光镜影响显示
└── 用户用手遮挡屏幕

受影响元素：
├── 浅灰文字 + 白底
├── 轻微色差
├── 低透明覆盖
└── 粉彩色
```

### 高对比策略（High Contrast Strategies）

```
户外可见性原则：

最低对比要求：
├── 正文：4.5:1（WCAG AA）
├── 大字：3:1（WCAG AA）
├── 推荐：7:1+（AAA）

避免：
├── #999 on #FFF（不达标）
├── #BBB on #FFF（不达标）
├── 浅色 + 浅背景
└── 关键内容用细微渐变

应该：
├── 使用系统语义色
├── 强光环境实测
├── 提供高对比模式
└── 关键 UI 使用纯色
```

---

## 5. 语义色（Semantic Colors）

### 含义一致性（Consistent Meaning）

| 语义 | 含义 | iOS 默认 | Android 默认 |
|------|------|----------|-------------|
| Error | 问题/破坏 | #FF3B30 | #B3261E |
| Success | 成功/完成 | #34C759 | #4CAF50 |
| Warning | 注意/警告 | #FF9500 | #FFC107 |
| Info | 信息提示 | #007AFF | #2196F3 |

### 语义色规则（Semantic Color Rules）

```
不要用语义色做：
├── 品牌色（混淆含义）
├── 纯装饰（削弱语义）
├── 随意点缀
└── 仅用颜色提示状态

必须：
├── 搭配图标（色盲用户）
├── 明暗模式保持一致
├── 全 App 语义一致
└── 遵循平台习惯
```

### 错误态颜色（Error State Colors）

```
错误态需要：
├── 偏红色（语义）
├── 高对比
├── 图标强化
├── 清晰文字解释

iOS：
├── Light：#FF3B30
├── Dark：#FF453A

Android：
├── Light：#B3261E
├── Dark：#F2B8B5（在 error container）
```

---

## 6. 动态颜色（Dynamic Color, Android）

### Material You

```
Android 12+ 动态颜色：

用户壁纸 → 颜色抽取 → App 主题

系统自动提供：
├── Primary（主色）
├── Secondary（辅助色）
├── Tertiary（强调色）
├── Surface（中性表面）
├── On-colors（文本/前景色）
```

### 动态颜色支持

```kotlin
// Jetpack Compose
MaterialTheme(
    colorScheme = dynamicColorScheme()
        ?: staticColorScheme() // 旧系统兜底
)

// React Native
// 支持有限，可考虑 react-native-material-you
```

### 兜底颜色（Fallback Colors）

```
动态颜色不可用时：
├── Android < 12
├── 用户关闭动态颜色
├── 启动器不支持

提供静态配色：
├── 定义品牌色
├── 测试明暗模式
├── 角色对应一致
└── 支持 light + dark
```

---

## 7. 颜色无障碍（Color Accessibility）

### 色盲考虑（Colorblind Considerations）

```
约 8% 男性、0.5% 女性存在色盲

类型：
├── Protanopia（红弱）
├── Deuteranopia（绿弱）
├── Tritanopia（蓝弱）
├── Monochromacy（极少见）

设计规则：
├── 不依赖颜色单一传达
├── 使用纹理/图标/文字
├── 用模拟器测试
├── 避免仅红/绿区分
```

### 对比度测试工具（Contrast Testing Tools）

```
建议工具：
├── Xcode 无障碍检查器
├── Android Accessibility Scanner
├── 对比度计算器
├── 色盲模拟器
└── 真机强光测试
```

### 充足对比（Sufficient Contrast）

```
WCAG 指南：

AA（最低）
├── 正文：4.5:1
├── 大字（18pt+）：3:1
├── UI 组件：3:1

AAA（增强）
├── 正文：7:1
├── 大字：4.5:1

移动端建议：满足 AA，尽量达到 AAA
```

---

## 8. 颜色反模式（Color Anti-Patterns）

### ❌ 常见错误

| 错误 | 问题 | 修复 |
|------|------|------|
| **浅灰对白** | 户外不可见 | 对比 ≥ 4.5:1 |
| **暗色模式用纯白** | 刺眼 | 用 #E0E0E0-#F0F0F0 |
| **暗色仍用高饱和** | 过亮刺眼 | 去饱和 |
| **只用红/绿区分** | 色盲无法识别 | 加图标 |
| **用语义色做品牌色** | 含义混淆 | 品牌色用中性 |
| **忽略系统暗色模式** | 体验跳变 | 支持两种模式 |

### ❌ AI 常见颜色错误

```
AI 常见问题：
├── 明暗模式用同一套颜色
├── 忽略 OLED 电量
├── 不计算对比度
├── 默认紫色/紫罗兰（BANNED）
├── 低对比“审美灰”
├── 不做户外测试
└── 忽视色盲用户

规则：按最差条件设计。
必须在强光、色盲模拟、低电量场景下验证。
```

---

## 9. 颜色系统清单（Color System Checklist）

### 选色前（Before Choosing Colors）

- [ ] 明暗模式色板已定义？
- [ ] 对比度 ≥ 4.5:1？
- [ ] OLED 电量是否考虑？
- [ ] 语义色遵循平台习惯？
- [ ] 色盲可用性保障？

### 发布前（Before Release）

- [ ] 强光环境可读性测试？
- [ ] OLED 真机暗色测试？
- [ ] 系统暗色模式是否尊重？
- [ ] Android 动态颜色支持？
- [ ] Error/Success/Warning 一致？
- [ ] 所有文本对比达标？

---

## 10. 速查（Quick Reference）

### 暗色模式背景色（Dark Mode Backgrounds）

```
True black（OLED 省电最大）：#000000
Near black（Material）：      #121212
Surface 1：                    #1E1E1E
Surface 2：                    #2C2C2C
Surface 3：                    #3C3C3C
```

### 暗色文本色（Text on Dark）

```
Primary：   #E0E0E0 ~ #ECECEC
Secondary： #A0A0A0 ~ #B0B0B0
Disabled：  #606060 ~ #707070
```

### 对比度（Contrast Ratios）

```
小字：   4.5:1（最低）
大字：   3:1（最低）
UI：     3:1（最低）
理想：   7:1（AAA）
```

---

> **记住（Remember）**：移动端颜色必须在最差条件下可用——强光、眼疲劳、色盲、低电量。无法通过这些场景的颜色，就是无效颜色。
