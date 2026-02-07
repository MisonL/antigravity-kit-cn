# 移动端导航参考（Mobile Navigation Reference）

> 导航模式、深度链接（Deep Linking）、返回行为处理，以及 Tab/Stack/Drawer 的选择。
> **导航是 App 的骨架——做错了，所有体验都会显得“坏掉了”。**

---

## 1. 导航选择决策树（Navigation Selection Decision Tree）

```
你是什么类型的应用？
        │
        ├── 3-5 个顶层入口（同等重要）
        │   └── ✅ Tab Bar / Bottom Navigation（底部标签）
        │       示例：社交、E-commerce、电商工具
        │
        ├── 深层级内容（逐级深入）
        │   └── ✅ Stack Navigation（堆栈导航）
        │       示例：设置、邮箱文件夹
        │
        ├── 顶层入口很多（>5）
        │   └── ✅ Drawer Navigation（抽屉导航）
        │       示例：Gmail、复杂企业应用
        │
        ├── 单一线性流程
        │   └── ✅ 仅使用 Stack（向导/引导）
        │       示例：结算、首次设置流程
        │
        └── 平板/折叠屏
            └── ✅ Navigation Rail + List-Detail
                示例：iPad 邮件、笔记
```

---

## 2. Tab Bar 导航（Tab Bar Navigation）

### 何时使用（When to Use）

```
✅ 适合 Tab Bar 的情况：
├── 3-5 个顶层目的地
├── 目的地同等重要
├── 用户频繁切换
├── 每个 Tab 维护独立的导航栈
└── App 使用时长较短、碎片化

❌ 不适合 Tab Bar 的情况：
├── 顶层入口超过 5 个
├── 目的地存在明确层级
├── 各 Tab 使用频率严重不均
└── 内容需要按顺序流转
```

### Tab Bar 最佳实践（Tab Bar Best Practices）

```
iOS Tab Bar：
├── 高度：49pt（含 Home 指示条为 83pt）
├── 最大项数：5
├── 图标：SF Symbols，25×25pt
├── 文本：始终显示（无障碍）
├── 激活态：Tint 颜色

Android Bottom Navigation：
├── 高度：80dp
├── 最大项数：5（理想 3-5）
├── 图标：Material Symbols，24dp
├── 文本：始终显示
├── 激活态：Pill 形状 + 填充图标
```

### Tab 状态保留（Tab State Preservation）

```
规则：每个 Tab 维护独立的导航栈。

用户路径：
1. Home Tab → 进入商品详情 → 加入购物车
2. 切到 Profile Tab
3. 再切回 Home Tab
→ 应回到“加入购物车”页面，而非 Home 根页面

实现：
├── React Navigation：每个 Tab 内独立 Navigator
├── Flutter：使用 IndexedStack 保持状态
└── 切换 Tab 不得重置栈
```

---

## 3. Stack 导航（Stack Navigation）

### 核心概念（Core Concepts）

```
堆栈模型：卡片一层层叠加

Push：把新页面压栈
Pop：移除顶部页面（返回）
Replace：替换当前页面
Reset：清空栈并设置新根

视觉：新页面从右侧滑入（LTR）
返回：页面向右滑出
```

### Stack 导航模式（Stack Navigation Patterns）

| 模式（Pattern） | 场景（Use Case） | 实现（Implementation） |
|-----------------|------------------|------------------------|
| **Simple Stack** | 线性流程 | 每步 Push |
| **Nested Stack** | 分区内子导航 | Tab 内部 Stack |
| **Modal Stack** | 聚焦任务 | 以 Modal 形式呈现 |
| **Auth Stack** | 登录/主流程切换 | 条件 Root |

### 返回键处理（Back Button Handling）

```
iOS：
├── 从左侧边缘滑返回（系统）
├── 导航栏返回按钮（可选）
├── 交互式返回手势
└── 无充分理由不要屏蔽滑动返回

Android：
├── 系统返回键/手势
├── 工具栏 Up 按钮（可选，深层页面）
├── 预测性返回动画（Android 14+）
└── 必须正确处理返回（Activity/Fragment）

跨平台通用规则：
├── 返回永远是“向上返回栈”
├── 不要劫持返回去做别的事
├── 丢弃未保存数据前需二次确认
└── 深度链接进入必须可完整返回
```

---

## 4. Drawer 导航（Drawer Navigation）

### 何时使用（When to Use）

```
✅ 适合 Drawer 的情况：
├── 顶层入口超过 5 个
├── 有一部分入口不常访问
├── 功能复杂且模块多
├── 导航需要展示品牌/用户信息
└── 平板/大屏可做常驻 Drawer

❌ 不适合 Drawer 的情况：
├── 入口 5 个以内（优先 Tabs）
├── 所有入口同等重要
├── 以移动端为主的轻量应用
└── 强依赖“可发现性”（Drawer 默认隐藏）
```

### Drawer 模式（Drawer Patterns）

```
Modal Drawer：
├── 覆盖内容（背后有遮罩）
├── 边缘滑动打开
├── 汉堡按钮（☰）触发
└── 移动端最常见

Permanent Drawer：
├── 始终可见（大屏）
├── 内容区域右移
├── 适合生产力应用
└── 平板/桌面

Navigation Rail（Android）：
├── 窄竖栏
├── 图标 + 可选文本
├── 适配竖屏平板
└── 宽度 80dp
```

---

## 5. Modal 导航（Modal Navigation）

### Modal vs Push

```
PUSH（Stack）：               MODAL：
├── 横向滑入                  ├── 纵向上滑（sheet）
├── 层级内流转                ├── 独立任务
├── 返回回到上一级            ├── 关闭（X）回到原处
├── 共享导航上下文            ├── 独立导航上下文
└── “向内深入”                └── “聚焦完成任务”

适合用 MODAL 的场景：
├── 创建新内容
├── 设置/偏好
├── 完成交易
├── 自包含流程
├── 快速操作
```

### Modal 类型（Modal Types）

| 类型（Type） | iOS | Android | 场景（Use Case） |
|-------------|-----|---------|------------------|
| **Sheet** | `.sheet` | Bottom Sheet | 快速任务 |
| **Full Screen** | `.fullScreenCover` | 全屏 Activity | 复杂表单 |
| **Alert** | Alert | Dialog | 确认操作 |
| **Action Sheet** | Action Sheet | Menu/Bottom Sheet | 选项选择 |

### Modal 关闭方式（Modal Dismissal）

```
用户期望的关闭方式：
├── 点击 X / Close
├── 下拉关闭（sheet）
├── 点击遮罩（非关键任务）
├── Android 系统返回
├── 硬件返回键（旧 Android）

规则：只有在“未保存数据”时才允许阻止关闭。
```

---

## 6. 深度链接（Deep Linking）

### 为什么从第一天就要做 Deep Links

```
Deep links 能支持：
├── 推送通知跳转
├── 内容分享
├── 营销活动
├── Spotlight/Search 集成
├── Widget 跳转
├── 外部应用集成

后期补做会非常痛苦：
├── 需要重构导航
├── 屏幕依赖关系不清晰
├── 参数传递复杂
└── 必须从一开始规划
```

### URL 结构（URL Structure）

```
Scheme://host/path?params

示例：
├── myapp://product/123
├── https://myapp.com/product/123（Universal/App Link）
├── myapp://checkout?promo=SAVE20
├── myapp://tab/profile/settings

层级应与导航一致：
├── myapp://home
├── myapp://home/product/123
├── myapp://home/product/123/reviews
└── URL path = navigation path
```

### 深度链接导航规则（Deep Link Navigation Rules）

```
1. 全栈构建（FULL STACK CONSTRUCTION）
   myapp://product/123 应当：
   ├── Home 作为栈根
   ├── Product 页面压到顶部
   └── 返回键回到 Home

2. 鉴权意识（AUTHENTICATION AWARENESS）
   若深链需要登录：
   ├── 记录目标页面
   ├── 跳转登录
   ├── 登录后回到目标页面

3. 无效链接（INVALID LINKS）
   目标不存在时：
   ├── 回退到兜底页面（home）
   ├── 显示错误提示
   └── 不可崩溃或白屏

4. 有状态导航（STATEFUL NAVIGATION）
   活跃会话中收到深链：
   ├── 不要清空当前栈
   ├── 直接压栈，或
   ├── 询问用户是否跳转
```

---

## 7. 导航状态持久化（Navigation State Persistence）

### 需要持久化的内容（What to Persist）

```
应该持久化：
├── 当前 Tab 选择
├── 列表滚动位置
├── 表单草稿
├── 最近导航栈
└── 用户偏好

不应持久化：
├── Modal 状态（对话框）
├── 临时 UI 状态
├── 过期数据（返回时应刷新）
├── 认证状态（用安全存储）
```

### 实现示例（Implementation）

```javascript
// React Navigation - State Persistence
const [isReady, setIsReady] = useState(false);
const [initialState, setInitialState] = useState();

useEffect(() => {
  const loadState = async () => {
    const savedState = await AsyncStorage.getItem('NAV_STATE');
    if (savedState) setInitialState(JSON.parse(savedState));
    setIsReady(true);
  };
  loadState();
}, []);

const handleStateChange = (state) => {
  AsyncStorage.setItem('NAV_STATE', JSON.stringify(state));
};

<NavigationContainer
  initialState={initialState}
  onStateChange={handleStateChange}
>
```

---

## 8. 过渡动画（Transition Animations）

### 平台默认（Platform Defaults）

```
iOS Transitions：
├── Push：从右滑入
├── Modal：从底部上滑（sheet）或淡入
├── Tab 切换：淡入淡出
├── 交互式：滑动返回

Android Transitions：
├── Push：淡入 + 右滑
├── Modal：从底部上滑
├── Tab 切换：淡入淡出或无动画
├── Shared element：Hero 动画
```

### 自定义过渡（Custom Transitions）

```
适合自定义的情况：
├── 需要匹配品牌调性
├── 需要共享元素关联
├── 需要特殊揭示效果
└── 必须克制，<300ms

适合默认的情况：
├── 大多数场景
├── 标准 drill-down
├── 平台一致性优先
└── 性能敏感路径
```

### 共享元素过渡（Shared Element Transitions）

```
在两个屏之间建立元素连结：

Screen A：产品卡片图片
            ↓（点击）
Screen B：同一图片的详情放大

图片从卡片位置动画到详情位置。

实现方式：
├── React Navigation：shared element 库
├── Flutter：Hero widget
├── SwiftUI：matchedGeometryEffect
└── Compose：Shared element transitions
```

---

## 9. 导航反模式（Navigation Anti-Patterns）

### ❌ 导航“罪状”（Navigation Sins）

| 反模式（Anti-Pattern） | 问题（Problem） | 解决方案（Solution） |
|------------------------|----------------|----------------------|
| **返回不一致** | 用户迷失，不可预测 | 始终 pop stack |
| **隐藏式导航** | 功能不可发现 | 明显 Tabs/Drawer 触发点 |
| **过深层级** | 用户迷路 | 最多 3-4 层 + 面包屑 |
| **破坏滑动返回** | iOS 用户不适 | 不要覆盖手势 |
| **无深度链接** | 不能分享/通知差 | 从一开始规划 |
| **Tab 栈被重置** | 切换时丢失上下文 | 保持 Tab 状态 |
| **主流程用 Modal** | 无法回溯 | 用 Stack 导航 |

### ❌ AI 常见导航错误（AI Navigation Mistakes）

```
AI 常见问题：
├── 什么都用 Modal（错误）
├── 忘记 Tab 状态保持（错误）
├── 忽略 Deep Linking（错误）
├── 覆盖平台返回行为（错误）
├── 切换 Tab 时重置栈（错误）
└── 忽视预测性返回（Android 14+）

规则：遵循平台导航模式。
不要重复造轮子。
```

---

## 10. 导航检查清单（Navigation Checklist）

### 导航架构前（Before Navigation Architecture）

- [ ] 应用类型已确定（tabs/drawer/stack）。
- [ ] 顶层入口数量已统计。
- [ ] Deep link URL scheme 已规划。
- [ ] 认证流程与导航已集成。
- [ ] 平板/大屏场景已考虑。

### 每个页面前（Before Every Screen）

- [ ] 能否返回？（无死路）
- [ ] 是否规划了 Deep link？
- [ ] 离开/返回时状态是否保留？
- [ ] 过渡是否匹配页面关系？
- [ ] 是否需要鉴权？是否已处理？

### 发布前（Before Release）

- [ ] 所有 Deep links 已测试。
- [ ] 返回键全路径可用。
- [ ] Tab 状态保持正常。
- [ ] iOS 边缘滑动返回正常。
- [ ] Android 14+ 预测性返回正常。
- [ ] Universal/App Links 已配置。
- [ ] 推送通知深链可用。

---

> **记住（Remember）**：导航做到“无感”才是好导航。用户不应该思考“怎么去”，而是“直接到达”。如果用户在意导航，说明它有问题。
