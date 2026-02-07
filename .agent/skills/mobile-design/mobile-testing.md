# 移动端测试模式（Mobile Testing Patterns）

> **移动端测试不是 Web 测试。约束不同，策略不同。**
> 本文件强调“何时用什么方法”和“为什么”。
> **代码示例尽量少，重点在决策。**

---

## 🧠 移动端测试思维（MOBILE TESTING MINDSET）

```
移动端测试与 Web 不同：
├── 真机很关键（模拟器会隐藏问题）
├── 平台差异（iOS vs Android）
├── 网络条件剧烈变化
├── 需考虑电量/性能
├── App 生命周期（后台、被杀、恢复）
├── 权限与系统对话框
└── 触控交互 vs 点击
```

---

## 🚫 AI 移动端测试反模式（ANTI-PATTERNS）

| ❌ AI 默认 | 为什么错 | ✅ 移动端正确做法 |
|-----------|----------|------------------|
| 只用 Jest | 覆盖不到原生层 | Jest + 真机 E2E |
| Enzyme 模式 | 过时且偏 Web | React Native Testing Library |
| 浏览器 E2E（Cypress） | 测不了原生能力 | Detox / Maestro |
| 全部 mock | 会漏掉集成问题 | 真机集成测试 |
| 忽略平台差异 | iOS/Android 行为不同 | 平台专测 |
| 不测性能 | 移动端性能关键 | 低端机 Profiling |
| 只测 Happy Path | 移动端边界多 | 离线、权限、中断 |
| 100% 单元测试覆盖 | 虚假安全感 | 金字塔平衡 |
| 复制 Web 测试模式 | 环境完全不同 | 用移动端工具与策略 |

---

## 1. 测试工具选择（Testing Tool Selection）

### 决策树（Decision Tree）

```
你在测什么？
        │
        ├── 纯函数/工具/助手
        │   └── Jest（单元测试）
        │       └── 无需特殊移动端配置
        │
        ├── 独立组件（隔离）
        │   ├── React Native → React Native Testing Library
        │   └── Flutter → flutter_test（Widget tests）
        │
        ├── 带 hooks/context/navigation 的组件
        │   ├── React Native → RNTL + mocked providers
        │   └── Flutter → integration_test
        │
        ├── 完整用户流程（登录、结账等）
        │   ├── Detox（RN，快且可靠）
        │   ├── Maestro（跨平台，YAML）
        │   └── Appium（老方案，慢，兜底）
        │
        └── 性能/内存/电量
            ├── Flashlight（RN 性能）
            ├── Flutter DevTools
            └── 真机 Profiling（Xcode/Android Studio）
```

### 工具对比（Tool Comparison）

| 工具（Tool） | 平台 | 速度 | 可靠性 | 适用场景 |
|-------------|------|------|--------|---------|
| **Jest** | RN | ⚡⚡⚡ | ⚡⚡⚡ | 单元测试/逻辑 |
| **RNTL** | RN | ⚡⚡⚡ | ⚡⚡ | 组件测试 |
| **flutter_test** | Flutter | ⚡⚡⚡ | ⚡⚡⚡ | Widget tests |
| **Detox** | RN | ⚡⚡ | ⚡⚡⚡ | 关键 E2E |
| **Maestro** | Both | ⚡⚡ | ⚡⚡ | 跨平台 E2E |
| **Appium** | Both | ⚡ | ⚡ | 兜底/Legacy |

---

## 2. 移动端测试金字塔（Testing Pyramid for Mobile）

```
                    ┌───────────────┐
                    │    E2E Tests  │  10%
                    │  (Real device) │  慢、贵，但关键
                    ├───────────────┤
                    │  Integration  │  20%
                    │    Tests      │  组件+上下文
                    ├───────────────┤
                    │  Component    │  30%
                    │    Tests      │  UI 级别
                    ├───────────────┤
                    │   Unit Tests  │  40%
                    │    (Jest)     │  纯逻辑
                    └───────────────┘
```

### 为什么是这个比例（Why This Distribution）

| 层级 | 原因 |
|------|------|
| **E2E 10%** | 慢且不稳定，但能抓集成问题 |
| **Integration 20%** | 不跑完整 App 也能测关键流程 |
| **Component 30%** | UI 变化反馈快 |
| **Unit 40%** | 最快且最稳定，覆盖逻辑 |

> 🔴 **如果 90% 是单测而 0% E2E，你测错了重点。**

---

## 3. 每个层级测什么（What to Test at Each Level）

### 单元测试（Unit Tests, Jest）

```
✅ 测：
├── 工具函数（formatDate、calculatePrice）
├── 状态 reducer（Redux/Zustand）
├── API 响应转换
├── 校验逻辑
└── 业务规则

❌ 不测：
├── 组件渲染（去组件测试）
├── 导航（去集成测试）
├── 原生模块（mock）
└── 第三方库
```

### 组件测试（RNTL / flutter_test）

```
✅ 测：
├── 组件正确渲染
├── 用户交互（tap、type、swipe）
├── loading/error/empty 状态
├── 无障碍 label 是否存在
└── props 改变行为

❌ 不测：
├── 内部实现细节
├── 全量 snapshot（只对关键组件）
├── 过细样式细节（脆弱）
└── 第三方组件内部
```

### 集成测试（Integration Tests）

```
✅ 测：
├── 表单提交流程
├── 页面间导航
├── 跨页面状态保持
├── API 集成（配合 mock server）
└── Context/provider 交互

❌ 不测：
├── 每条路径都测（太慢）
├── 第三方服务（mock）
└── 后端逻辑（后端测试）
```

### E2E 测试（End-to-End）

```
✅ 测：
├── 关键用户路径（登录、购买、注册）
├── 离线 → 在线切换
├── Deep link 处理
├── 推送通知跳转
├── 权限流程
└── 支付流程

❌ 不测：
├── 所有边界（太慢）
├── 视觉回归（用 snapshot）
├── 非关键功能
└── 纯后端逻辑
```

---

## 4. 平台特定测试（Platform-Specific Testing）

### iOS 与 Android 的差异

| 区域 | iOS 行为 | Android 行为 | 两端都测？ |
|------|----------|--------------|------------|
| **返回导航** | 边缘滑动 | 系统返回键 | ✅ YES |
| **权限** | 仅一次，需设置开启 | 每次询问，带 rationale | ✅ YES |
| **键盘** | 外观与行为不同 | 外观与行为不同 | ✅ YES |
| **日期选择器** | 轮盘/Modal | Material dialog | ⚠️ 自定义 UI 时 |
| **推送格式** | APNs payload | FCM payload | ✅ YES |
| **Deep links** | Universal Links | App Links | ✅ YES |
| **手势** | 部分特有 | Material 手势 | ⚠️ 自定义交互时 |

### 平台测试策略（Platform Testing Strategy）

```
每个平台：
├── 跑单测（同一套）
├── 跑组件测试（同一套）
├── 真机 E2E
│   ├── iOS：真机（不只模拟器）
│   └── Android：中端机（不只旗舰）
└── 平台特有功能单独验证
```

---

## 5. 离线与网络测试（Offline & Network Testing）

### 需要覆盖的离线场景（Offline Scenarios）

| 场景 | 要验证的行为 |
|------|--------------|
| 启动即离线 | 展示缓存或离线提示 |
| 操作中断网 | 操作入队不丢失 |
| 恢复联网 | 队列同步无重复 |
| 慢网（2G） | loading/超时逻辑正常 |
| 波动网络 | 重试与错误恢复 |

### 如何测试网络条件（How to Test Network Conditions）

```
方法：
├── 单元测试：mock NetInfo，测逻辑
├── 集成测试：mock API 响应，测 UI
├── E2E（Detox）：device.setURLBlacklist()
├── E2E（Maestro）：设置 network conditions
└── 手动：Charles Proxy / Network Link Conditioner
```

---

## 6. 性能测试（Performance Testing）

### 测什么（What to Measure）

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| **App 启动** | < 2 秒 | Profiler / Flashlight |
| **页面切换** | < 300ms | React DevTools |
| **列表滚动** | 60 FPS | Profiler / 体感 |
| **内存** | 稳定无泄漏 | Instruments / Android Profiler |
| **包体积** | 尽量小 | Metro bundler 分析 |

### 何时做性能测试（When to Performance Test）

```
必须测试：
├── 发布前（必做）
├── 大功能上线后
├── 依赖升级后
├── 用户反馈变慢时
└── CI（可选基准）

测试地点：
├── 真机（必须）
├── 低端机（如 Galaxy A / 旧 iPhone）
├── 不在模拟器（性能不可信）
└── 用真实数据（不是 3 条）
```

---

## 7. 无障碍测试（Accessibility Testing）

### 需要验证的内容（What to Verify）

| 元素 | 检查点 |
|------|--------|
| 交互元素 | 有 accessibilityLabel |
| 图片 | 有 alt 或标记装饰性 |
| 表单 | label 与输入关联 |
| 按钮 | role = button |
| 触控目标 | iOS ≥ 44x44 / Android ≥ 48x48 |
| 对比度 | WCAG AA 最低 |

### 如何测试（How to Test）

```
自动化：
├── React Native：jest-axe
├── Flutter：测试中的 Accessibility checker
└── Lint 规则补充缺失 label

手动：
├── 开启 VoiceOver（iOS）/ TalkBack（Android）
├── 全流程用读屏操作
├── 增大字体测试
└── 减少动态（reduced motion）测试
```

---

## 8. CI/CD 集成（CI/CD Integration）

### 运行策略（What to Run Where）

| 阶段 | 测试 | 设备 |
|------|------|------|
| **PR** | Unit + Component | 无（速度优先） |
| **Merge to main** | + Integration | 模拟器/模拟机 |
| **Pre-release** | + E2E | 真机（设备农场） |
| **Nightly** | 全量 | 设备农场 |

### 设备农场选择（Device Farm Options）

| 服务 | 优势 | 缺点 |
|------|------|------|
| **Firebase Test Lab** | 免费额度、Google 设备 | 偏 Android |
| **AWS Device Farm** | 机型广 | 费用高 |
| **BrowserStack** | 体验好 | 费用高 |
| **本地设备** | 免费、可靠 | 覆盖有限 |

---

## 📝 移动端测试清单（MOBILE TESTING CHECKLIST）

### PR 前
- [ ] 新逻辑有单测
- [ ] 新 UI 有组件测试
- [ ] 测试里无 console.log
- [ ] CI 测试通过

### 发布前
- [ ] iOS 真机 E2E
- [ ] Android 真机 E2E
- [ ] 低端机测试
- [ ] 离线场景验证
- [ ] 性能可接受
- [ ] 无障碍验证

### 有意识跳过（What to Skip, Consciously）
- [ ] 不追求 100% 覆盖（关注有效覆盖）
- [ ] 不测每个视觉排列（snapshot 适量）
- [ ] 不测第三方库内部
- [ ] 不测后端逻辑（另行测试）

---

## 🎯 测试前必问（Testing Questions to Ask）

在写测试前先回答：

1. **什么最可能出错？** → 测它
2. **用户最在意什么？** → E2E 测它
3. **哪里逻辑复杂？** → 单测覆盖
4. **哪些平台差异大？** → 双端测试
5. **离线会发生什么？** → 覆盖该场景

> **记住（Remember）**：好的移动端测试，是测“对的东西”，不是测“所有东西”。不稳定的 E2E 比不测更糟糕；能抓 bug 的单测，价值远高于 100 个无意义通过的测试。
