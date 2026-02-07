# Android 平台设计准则 (Android Platform Guidelines)

> Material Design 3 核心要点、Android 设计惯例、Roboto 排版以及原生交互模式。
> **在为 Android 设备构建应用时，务必阅读此文件。**

---

## 1. Material Design 3 哲学 (Material Design 3 Philosophy)

### 核心 Material 原则

- **Material as Metaphor (材质隐喻)**: 表面存在于 3D 空间，光影定义层级。
- **Adaptive Design (适应性设计)**: 对设备能力做出响应，从壁纸提取动态颜色。
- **Accessible by Default (默认无障碍)**: 内置大触控目标、清晰层级及语义化颜色。

---

## 2. Android 排版 (Android Typography)

### Roboto 字体族

- **Roboto**: 默认无衬线。
- **Roboto Flex**: 可变字体 (Variable font)。
- **Roboto Serif**: 衬线替代方案。

### Material 字号比例 (Type Scale)

| 角色               | 字号 | 字重    | 行高 | 用途             |
| ------------------ | ---- | ------- | ---- | ---------------- |
| **Display Large**  | 57sp | Regular | 64sp | 英雄文本、启动页 |
| **Headline Large** | 32sp | Regular | 40sp | 页面标题         |
| **Body Large**     | 16sp | Regular | 24sp | 主要正文         |
| **Label Large**    | 14sp | Medium  | 20sp | 按钮、FAB        |

**规则**: 务必对文本使用 `sp` (Scalable pixels) 单位，以支持用户自定义字号缩放。

---

## 3. Material 颜色系统 (Material Color System)

### 动态颜色 (Dynamic Color / Material You)

Android 12+ 支持从壁纸提取颜色并自动应用于应用主题。

- **Primary**: 关键操作配色。
- **Secondary/Tertiary**: 辅助与强调色。
- **Surface**: 派生的背景与容器颜色。

### 深色模式 (Dark Theme)

- **背景**: 默认 #121212 (非纯黑)。
- **海拔高度 (Elevation)**: 在深色模式下，随着海拔升高，表面会使用更浅的叠加层 (Overlay) 来表达深度。

---

## 4. 布局与间距 (Layout & Spacing)

### 8dp 基准网格

- **4dp**: 组件内部步长。
- **8dp**: 最小间距。
- **16dp**: 标准间距。
- **Margins**: 手机端建议 16dp，平板端建议 24dp。

---

## 5. Android 导航模式 (Navigation Patterns)

### 导航组件

- **底部导航 (Bottom Navigation)**: 3-5 个顶级入口。
- **导航轨 (Navigation Rail)**: 适合平板或折叠屏的侧边导航。
- **返回导航 (Back Navigation)**: Android 14+ 引入了**预测性返回** (Predictive back)，需正确处理 Activity 栈。

---

## 6. Material 组件 (Material Components)

### 按钮与 FAB

- **Filled**: 主要按钮。
- **Tonal**: 次要强调。
- **FAB**: 悬浮操作按钮，位于右下角，建议 16dp 边距。

### 卡片与文本框

- **卡片 (Cards)**: 圆角默认为 12dp (M3 规范)。
- **文本框 (Text Fields)**: 高度 56dp，支持悬浮标签动画。

---

## 7. 触控反馈: 涟漪效果 (Ripple Effect)

**强制要求**: 每一个可触摸元素都必须具备 Ripple 效果。

- **浅色背景**: 约 12% 不透明度的黑色。
- **深色背景**: 约 12% 不透明度的白色。

---

## 8. Android 检查清单 (Android Checklist)

- [ ] 是否使用了 Material 3 组件？
- [ ] 触控目标是否 ≥ 48dp？
- [ ] 所有可点击项是否有 Ripple 效果？
- [ ] 文字单位是否均使用了 `sp`？
- [ ] 是否在 200% 字号缩放下进行了测试？
- [ ] 返回键逻辑是否正确（是否存在死循环或意外退出）？

---

> **记住：** Android 用户期望 Material Design。忽略 Material 模式的自定义设计会让用户感到陌生和生涩。
