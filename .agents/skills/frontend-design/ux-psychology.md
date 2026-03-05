# UX 心理学参考（UX Psychology Reference）

> 深入覆盖 UX 法则、情感化设计、信任构建与行为心理学。

---

## 1. 核心 UX 法则（Core UX Laws）

### Hick's Law（希克定律）

**Principle（原则）**：决策时间会随着可选项数量的增加而呈对数增长。

```
Decision Time = a + b × log₂(n + 1)
Where n = number of choices
```

**Application（应用）**：
- 导航：顶层入口控制在 5-7 个。
- 表单：拆成分步（progressive disclosure，渐进披露）。
- 选项：尽量给默认值。
- 筛选：优先展示高频项，进阶项折叠。

**Example（示例）**：
```
❌ Bad：一个导航里放 15 个菜单项
✅ Good：5 个主分类 + "More"

❌ Bad：一次性展示 20 个表单字段
✅ Good：3 步向导，每步 5-7 个字段
```

---

### Fitts' Law（菲茨定律）

**Principle（原则）**：命中目标所需时间由距离（D）与目标尺寸（W）共同决定。

```
MT = a + b × log₂(1 + D/W)
Where D = distance, W = width
```

**Application（应用）**：
- CTA：主按钮做更大（高度至少 44px）。
- 触控目标：移动端最小 44×44px。
- 布局：重要操作靠近自然光标路径。
- 角落：利用“Magic corners（魔法角）”提升命中率。

**Button Sizing（按钮尺寸）**：
```css
/* 按重要级别设定尺寸 */
.btn-primary { height: 48px; padding: 0 24px; }
.btn-secondary { height: 40px; padding: 0 16px; }
.btn-tertiary { height: 36px; padding: 0 12px; }

/* 移动端触控命中面积 */
@media (hover: none) {
  .btn { min-height: 44px; min-width: 44px; }
}
```

---

### Miller's Law（米勒定律）

**Principle（原则）**：人的工作记忆通常能同时容纳 7±2 个信息块（chunks）。

**Application（应用）**：
- 列表：按 5-7 个一组分块。
- 导航：菜单项不超过 7 个。
- 内容：长文用小标题分段。
- 数字：如手机号按分组展示（chunking）。

**Chunking Example（分块示例）**：
```
❌ 5551234567
✅ 555-123-4567

❌ 一大段无断点长文
✅ 短段落
   + 列表
   + 小标题
```

---

### Von Restorff Effect（隔离效应）

**Principle（原则）**：显著突出的元素更容易被记住。

**Application（应用）**：
- CTA：主按钮颜色应显著区别于其他元素。
- 定价：突出推荐套餐。
- 关键提示：做视觉区分。
- 新功能：使用 Badge 或 Callout。

**Example（示例）**：
```css
/* 所有按钮为灰，主按钮突出 */
.btn { background: #E5E7EB; }
.btn-primary { background: #3B82F6; }

/* 推荐套餐高亮 */
.pricing-card { border: 1px solid #E5E7EB; }
.pricing-card.popular {
  border: 2px solid #3B82F6;
  box-shadow: var(--shadow-lg);
}
```

---

### Serial Position Effect（序列位置效应）

**Principle（原则）**：列表的开头（首因）和结尾（近因）最容易被记住。

**Application（应用）**：
- 导航：最关键项放开头和结尾。
- 列表：重点放顶部和底部。
- 表单：关键字段提前。
- 长页面：顶部和底部都给 CTA。

**Example（示例）**：
```
Navigation: Home | [key items] | Contact

长落地页：
- Hero 顶部放 CTA
- 中间内容区
- 底部再次 CTA
```

---

### Jakob’s Law（雅各布定律）

**Principle（原则）**：用户多数时间花在其他网站上，因此他们期望你的站点遵循熟悉模式。

**Application（应用）**：
- **Patterns（模式）**：搜索框、购物车放在常见位置。
- **Mental Models（心智模型）**：使用常见图标（如放大镜）。
- **Vocabulary（措辞）**：用“Log In”而非“Enter the Portal”。
- **Layout（布局）**：Logo 左上角点击返回首页。
- **Interaction（交互）**：返回/前进手势应符合平台习惯。
- **Feedback（反馈）**：颜色语义遵循通用约定（红错绿对）。

**Example（示例）**：
```
❌ Bad：点击 Logo 进入 About Us
✅ Good：点击 Logo 返回首页

❌ Bad：用星标表示 Delete
✅ Good：用垃圾桶表示 Delete
```

---

### Tesler’s Law（复杂度守恒）

**Principle（原则）**：系统复杂度无法消失，只能在“用户”和“软件”之间转移。

**Application（应用）**：
- **Backend**：格式化交给系统（如货币格式）。
- **Detection**：自动识别卡类型、邮编推断城市。
- **Automation**：回访用户自动填充信息。
- **Personalization**：按先前输入动态展示字段。
- **Defaults**：合理默认值。
- **Integration**：用 SSO/Social Login 降低注册摩擦。

**Example（示例）**：
```
❌ Bad：每个价格字段都让用户手输 "USD $"
✅ Good：按用户地区自动补全 "$"

❌ Bad：让用户手选卡类型（Visa/Mastercard）
✅ Good：根据卡号前几位自动识别
```

---

### Parkinson’s Law（帕金森定律）

**Principle（原则）**：任务会膨胀到耗尽可用时间。

**Application（应用）**：
- **Efficiency**：自动保存（Auto-save）。
- **Speed**：减少转化路径步骤。
- **Clarity**：标签清晰，避免“到处试探”。
- **Feedback**：实时校验减少返工。
- **Onboarding**：为高阶用户提供快速入口。
- **Constraints**：字符限制帮助聚焦。

**Example（示例）**：
```
❌ Bad：10 页注册流程，离开页面就丢数据
✅ Good：一键登录（Google/Apple）

❌ Bad：写简介没有时间与结构约束
✅ Good：提供 Suggested Bios 快速完成
```

---

### Doherty Threshold（多尔蒂阈值）

**Principle（原则）**：当系统反馈速度 < 400ms 时，人机协作效率显著提升。

**Application（应用）**：
- **Feedback**：点击后立即视觉反馈。
- **Loading**：用 Skeleton 提升感知性能。
- **Optimism**：采用 Optimistic UI 先更新界面。
- **Motion**：微动效掩盖轻微延迟。
- **Caching**：后台预加载下一屏资源。
- **Prioritization**：先加载文本后加载大图。

**Example（示例）**：
```
❌ Bad：按钮点击后 2 秒毫无反应
✅ Good：立刻变色并出现 Loading 状态

❌ Bad：数据加载时白屏
✅ Good：Skeleton 显示内容骨架
```

---

### Postel’s Law（稳健性原则）

**Principle（原则）**：输出要保守，输入要宽容。

**Application（应用）**：
- **Error Handling**：输入有空格/破折号不应直接报错。
- **Formatting**：日期允许多种格式。
- **Inputs**：自动去首尾空白。
- **Fallbacks**：无头像时自动回退默认头像。
- **Search**：支持拼写容错并提示“你是不是想搜…”。
- **Accessibility**：保证跨浏览器/设备可用。

**Example（示例）**：
```
❌ Bad：手机号有空格就拒绝
✅ Good：接受并自动清洗空格

❌ Bad：日期必须输入完整 January
✅ Good：支持 January / Jan / 01
```

---

### Occam’s Razor（奥卡姆剃刀）

**Principle（原则）**：在效果等价时，优先选择假设最少、结构最简单的方案。

**Application（应用）**：
- **Logic**：减少不必要点击。
- **Visuals**：字体/颜色数量越少越好（满足表达即可）。
- **Function**：能一个字段解决就不要拆两个。
- **Copy**：最短文案表达清楚含义。
- **Layout**：删除不服务目标的装饰。
- **Flow**：非必要不分叉。

**Example（示例）**：
```
❌ Bad：登录流程分新页 -> 邮箱 -> 密码
✅ Good：一个 Modal 完成邮箱+密码

❌ Bad：单卡片用 5 个字号 + 4 种颜色
✅ Good：2 个字号 + 1 个强调色
```

---

## 2. 视觉知觉（Visual Perception / Gestalt Principles）

### Law of Proximity（接近律）

**Principle（原则）**：彼此接近的元素会被感知为同组。

**Application（应用）**：
- **Grouping**：标签贴近输入框。
- **Spacing**：无关区块之间留更大间距。
- **Cards**：卡片内文字应更靠近其图片而非边框。
- **Footers**：法律链接与社交链接分组。
- **Navigation**：用户设置与应用设置分区。
- **Forms**：地址字段一组，支付字段一组。

**Example（示例）**：
```
❌ Bad：表单每行间距都一样大
✅ Good：标签和输入框间距紧凑，字段组之间间距更大

❌ Bad：提交按钮漂在页面中间
✅ Good：提交按钮紧跟最后一个字段
```

---

### Law of Similarity（相似律）

**Principle（原则）**：视觉上相似的元素会被识别为同一组。

**Application（应用）**：
- **Consistency**：所有可点击文字保持一致色。
- **Iconography**：同组图标线宽一致。
- **Buttons**：同等级按钮形态一致。
- **Typography**：所有 H2 使用同一风格。
- **Feedback**：同类危险操作统一色（如红色）。
- **States**：Hover/Active 规则统一。

**Example（示例）**：
```
❌ Bad：链接有蓝有绿有黑粗体
✅ Good：所有可点击文本统一蓝色

❌ Bad：Submit 和 Cancel 同样式同颜色
✅ Good：Submit 实心，Cancel 轮廓（Ghost）
```

---

### Law of Common Region（共同区域律）

**Principle（原则）**：处于同一边界区域内的元素更容易被视作一组。

**Application（应用）**：
- **Containerizing**：用卡片包裹图片+标题。
- **Borders**：侧栏与主区之间用线分隔。
- **Backgrounds**：页脚使用差异背景色。
- **Modals**：弹窗使用独立容器边界。
- **Lists**：表格斑马纹辅助分行识别。
- **Header**：顶部实色条聚合导航项。

**Example（示例）**：
```
❌ Bad：新闻列表图文互相穿插难分
✅ Good：每条新闻独立卡片承载

❌ Bad：页脚背景与正文无差异
✅ Good：页脚深色，明确与正文分离
```

---

### Law of Uniform Connectedness（一致连通律）

**Principle（原则）**：视觉上被线条或连接关系串联的元素会被认为更相关。

**Application（应用）**：
- **Flow**：向导步骤间用线连接。
- **Menus**：下拉菜单与触发按钮视觉相连。
- **Graphs**：折线图用线连接数据点。
- **Relationship**：开关与其控制文本对应连接。
- **Hierarchy**：目录树体现层级。
- **Forms**：单选项与对应字段组关联。

**Example（示例）**：
```
❌ Bad：步骤 1/2/3 分散摆放
✅ Good：水平连线体现顺序

❌ Bad：下拉菜单与触发按钮分离漂浮
✅ Good：菜单视觉上“挂接”在按钮下方
```

---

### Law of Prägnanz（简洁律）

**Principle（原则）**：人会倾向将复杂/模糊图形解释为最简单、最稳定的形态。

**Application（应用）**：
- **Clarity**：导航图标保持几何清晰。
- **Reduction**：移除无必要 3D 纹理与阴影。
- **Shapes**：优先矩形/圆形等标准形。
- **Focus**：主动作保持高对比轮廓。
- **Logos**：Logo 在小尺寸下仍可识别。
- **UX**：一页一个核心目标。

**Example（示例）**：
```
❌ Bad：Files 图标做成超写实 3D 文件夹
✅ Good：简洁 2D 轮廓图标

❌ Bad：复杂多色 Logo 拿来当 loading
✅ Good：单色圆环式 loading
```

---

### Law of Figure/Ground（图地关系）

**Principle（原则）**：视觉系统会区分“主体（figure）”与“背景（ground）”。

**Application（应用）**：
- **Focus**：Modal 配合遮罩（scrim）突出主体。
- **Depth**：用阴影表现主体浮于背景。
- **Contrast**：明暗对比保证层次。
- **Blur**：背景模糊强调前景信息。
- **Navigation**：悬浮吸顶头部保持层级。
- **Hover**：卡片悬停轻抬升以强化主体感。

**Example（示例）**：
```
❌ Bad：弹窗无边界无阴影，融入背景
✅ Good：弹窗 + 阴影 + 背景变暗

❌ Bad：白字直接压在复杂彩色图上
✅ Good：白字置于半透明深色遮罩之上
```

---

### Law of Focal Point（焦点律）

**Principle（原则）**：视觉上最突出的元素会最先抓住注意力。

**Application（应用）**：
- **Entry**：核心价值主张放焦点位。
- **Color**：中性界面中仅一个高饱和行动色。
- **Movement**：CTA 可用轻动效吸引视线。
- **Size**：最重要数据用最大字号。
- **Typography**：标题加粗，正文常规字重。
- **Direction**：用箭头/人物视线引导注意。

**Example（示例）**：
```
❌ Bad：首页 5 个同色同尺寸按钮
✅ Good：1 个主按钮明显更大更亮

❌ Bad：Total Revenue 与 System Version 同等级
✅ Good：Total Revenue 用大号粗体置顶
```

---

## 3. 认知偏差与行为（Cognitive Biases & Behavior）

### Zeigarnik Effect（蔡格尼克效应）

**Principle（原则）**：未完成任务比已完成任务更容易被记住。

**Application（应用）**：
- **Gamification**：显示“Profile 60% complete”。
- **Engagement**：预告下一学习模块。
- **Retention**：展示待探索功能 To-Do。
- **Feedback**：未读消息徽标常驻。
- **Momentum**：每完成一步即展示下一步。
- **Shopping**：购物车提醒“继续完成订单”。

**Example（示例）**：
```
❌ Bad：引导过程无剩余步骤提示
✅ Good：清单显示“已完成 3/5”

❌ Bad：课程视频看一半也打勾完成
✅ Good：进度环保持半满直到看完
```

### Goal Gradient Effect（目标梯度效应）

**Principle（原则）**：用户越接近目标，完成动机越强。

**Application（应用）**：
- **Momentum**：给用户“人工领先”（如赠送 2 枚印章）。
- **Progress**：10 字段表单拆成 2×5 字段。
- **Feedback**：中途里程碑反馈。
- **Motivation**：明确告知离目标还有多远。
- **Navigation**：面包屑体现终点接近度。
- **Loading**：接近 100% 时可加快进度节奏。

**Example（示例）**：
```
❌ Bad：进度条从 0% 起步，心理负担大
✅ Good：打开应用即从 20% 起步

❌ Bad：结账流程突然冒出“第 5 步”
✅ Good：明确步骤：Shipping > Payment > Almost Done
```

### Peak-End Rule（峰终定律）

**Principle（原则）**：用户对体验的评价主要取决于“峰值时刻”和“结束时刻”。

**Application（应用）**：
- **Success**：让完成页可记忆。
- **Delight**：在价值达成点添加庆祝反馈。
- **Support**：客服对话结束要有明确帮助感。
- **Unboarding**：即使离开也要体面退出。
- **Onboarding**：首次使用结尾要有“我完成了”的胜利感。
- **Error Handling**：404 也可做成有帮助且友好的体验。

**Example（示例）**：
```
❌ Bad：报税 20 分钟后只显示 "Submitted"
✅ Good：显示 "Congratulations" + 退款摘要

❌ Bad：游戏结束仅 "Game Over"
✅ Good：展示高分总结 + 庆祝反馈
```

### Aesthetic-Usability Effect（美即易用效应）

**Principle（原则）**：用户常将“美观”感知为“更易用”。

**Application（应用）**：
- **Trust**：高保真视觉能获得初始信任额度。
- **Branding**：高质量视觉一致性提升专业度。
- **Engagement**：好看界面提升探索意愿。
- **Patience**：好看界面让用户更容忍轻微加载。
- **Confidence**：干净设计降低复杂工具的心理门槛。
- **Loyalty**：美学体验有助于情感忠诚。

**Example（示例）**：
```
❌ Bad：银行 App 文本错位、配色冲突
✅ Good：现代、干净、动画顺滑

❌ Bad：低清像素化图库图
✅ Good：高质量品牌插图/图片
```

### Anchoring Bias（锚定偏差）

**Principle（原则）**：用户会强依赖最先看到的信息（anchor）做后续判断。

**Application（应用）**：
- **Pricing**：显示划线原价。
- **Tiers**：最贵 Enterprise 放在显眼位置。
- **Sorting**：先展示 Most Popular。
- **Discounts**：先说 Save 20%，再说最终价。
- **Limits**："每人限购 12" 形成价值锚点。
- **Defaults**：建议赞助金额可先给较高默认值。

**Example（示例）**：
```
❌ Bad：只显示 "$49"
✅ Good："~~$99~~ $49 (50% Off)"

❌ Bad：笔记本按最低价到最高价排序
✅ Good：先展示高端 Pro 款，让其他选项更显性价比
```

### Social Proof（社会认同）

**Principle（原则）**：人在不确定情境下会参考他人行为。

**Application（应用）**：
- **Validation**：显示“已有 50,000+ 用户加入”。
- **Reviews**：星级 + 真实认证评价。
- **Logos**：Trusted by 品牌墙。
- **Live Feed**：实时购买动态提示。
- **Activity**：当前浏览人数提示。
- **Certificates**：行业奖项与安全认证。

**Example（示例）**：
```
❌ Bad：注册页只有表单
✅ Good：注册页展示 "Join 2 million designers"

❌ Bad：匿名无头像评价
✅ Good：带头像+姓名+Verified Buyer 标识
```

### Scarcity Principle（稀缺性原则）

**Principle（原则）**：稀缺资源会被主观赋予更高价值。

**Application（应用）**：
- **Urgency**："仅剩 2 件"。
- **Time**：限时倒计时。
- **Access**：邀请制内测/专属层级。
- **Seasonality**：季节限定款。
- **Low Stock**：缺货预定提醒。
- **Demand**："10 人已加入购物车"。

**Example（示例）**：
```
❌ Bad：永不结束的“促销”且无倒计时
✅ Good：Deal of the Day + 实时倒计时

❌ Bad：商品可售但无库存信息
✅ Good："当前价格仅剩 3 件"
```

### Authority Bias（权威偏差）

**Principle（原则）**：用户更容易相信权威主体观点。

**Application（应用）**：
- **Expertise**：专家背书与职业信息。
- **Certifications**：Norton / ISO / HIPAA 等认证。
- **Media**：As seen on 媒体露出。
- **Endorsements**：行业专家/影响者推荐。
- **Language**：文案专业、准确、稳定。
- **History**：成立年份强调长期可信。

**Example（示例）**：
```
❌ Bad：健康文章作者写 "Admin"
✅ Good："Reviewed by Dr. Jane Smith"

❌ Bad：安全产品无任何认证信息
✅ Good：展示 ISO 27001 + Norton Secured
```

### Loss Aversion（损失厌恶）

**Principle（原则）**：用户更在意“避免损失”而非“获得同等收益”。

**Application（应用）**：
- **Messaging**：强调“不要失去已有权益”。
- **Trials**：试用到期提醒“保留你的数据”。
- **Scarcity**：一旦错过不再有。
- **Carts**：提醒购物车内容可能失效。
- **Loyalty**：积分将到期提醒。
- **Risk**：30 天退款保证，降低“损失恐惧”。

**Example（示例）**：
```
❌ Bad："点击领取 10 美元券"
✅ Good："你有 10 美元额度今晚到期"

❌ Bad："Cancel your subscription"
✅ Good："取消后将失去 50 个已保存项目访问权"
```

### False-Consensus Effect（虚假共识效应）

**Principle（原则）**：人会高估自己的偏好与大众一致的程度。

**Application（应用）**：
- **Testing**：你不是用户，必须做真实用户测试。
- **Research**：访谈（定性）+ 数据分析（定量）。
- **Bias**：盲审设计，避免个人偏好主导。
- **Persona**：遵循用户画像而非直觉。
- **Variation**：覆盖不同人群/能力。
- **Objectivity**：借助热力图验证真实行为。

**Example（示例）**：
```
❌ Bad：设计师主观判断“这很直觉”就上线
✅ Good：先做 A/B test 再决策

❌ Bad：假设“所有人都懂英文”，不做本地化
✅ Good：根据用户地域数据做 localization
```

### Curse of Knowledge（知识诅咒）

**Principle（原则）**：专家容易默认他人具备同等背景知识。

**Application（应用）**：
- **Copy**：避免术语堆砌，使用平实语言。
- **Onboarding**：按“零基础用户”设计引导。
- **Tooltips**：复杂术语提供悬浮解释。
- **Structure**：渐进披露隐藏高级项。
- **Labels**：图标 + 文本，不只靠图标。
- **Support**：为新手提供完整 FAQ。

**Example（示例）**：
```
❌ Bad：报错 "Exception: Null Pointer at 0x0045"
✅ Good："出现异常，请刷新后重试"

❌ Bad：云产品导航直接使用 "S3 Bucket Instances"
✅ Good：使用 "File Storage" 等易懂术语
```

### Stepping Stone Effect（登门槛效应 / Foot-in-the-Door）

**Principle（原则）**：用户先完成小任务，更容易承诺大任务。

**Application（应用）**：
- **Funnel**：先要邮箱，再要信用卡。
- **Engagement**：注册前先问一个偏好问题。
- **Onboarding**：用一系列快速 Yes/No。
- **Trust**：先给免费工具，再引导订阅。
- **Profile**：先传头像，再完善个人简介。
- **Sales**：先提供低门槛前置商品（tripwire）。

**Example（示例）**：
```
❌ Bad：点击试用立刻要求信用卡
✅ Good：先邮箱+密码，后续再引导绑定

❌ Bad：问卷一页展示 50 题
✅ Good：从 1 个简单 Yes/No 开始
```

---

## 4. 情感化设计（Emotional Design, Don Norman）

### 三层处理模型（Three Levels of Processing）

```
┌─────────────────────────────────────────────────────────────┐
│  VISCERAL（本能层）                                          │
│  ─────────────────────                                      │
│  • 即时、自动反应                                             │
│  • 首次印象（前 50ms）                                        │
│  • 由颜色、形状、图像触发                                     │
│  • "Wow, this looks beautiful!"                            │
├─────────────────────────────────────────────────────────────┤
│  BEHAVIORAL（行为层）                                         │
│  ─────────────────────────────                              │
│  • 可用性与功能完成感                                         │
│  • 使用过程中的愉悦                                            │
│  • 性能、可靠、易用                                            │
│  • "This works exactly how I expected!"                    │
├─────────────────────────────────────────────────────────────┤
│  REFLECTIVE（反思层）                                         │
│  ─────────────────────────────                              │
│  • 价值认同与意义建构                                          │
│  • 个人身份与品牌关系                                          │
│  • 长期记忆与忠诚                                              │
│  • "This brand represents who I am"                        │
└─────────────────────────────────────────────────────────────┘
```

### 面向三层进行设计（Designing for Each Level）

**Visceral（本能层）**：
```css
/* 第一眼美感 */
.hero {
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  color: white;
}

/* 令人愉悦的微交互 */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Behavioral（行为层）**：
```javascript
// 即时反馈
button.onclick = () => {
  button.disabled = true;
  button.textContent = 'Saving...';

  save().then(() => {
    showSuccess('Saved!');  // 立刻确认完成
  });
};
```

**Reflective（反思层）**：
```html
<!-- 品牌使命与价值 -->
<section class="about">
  <h2>Why We Exist</h2>
  <p>We believe technology should empower, not complicate...</p>
</section>

<!-- 将社会认同与身份认同绑定 -->
<blockquote>
  "This tool helped me become the designer I wanted to be."
</blockquote>
```

---

## 5. 信任构建系统（Trust Building System）

### 信任信号分类（Trust Signal Categories）

| Category（类别） | Elements（元素） | Implementation（实现） |
|------------------|------------------|------------------------|
| **Security（安全）** | SSL、安全徽章、加密 | 表单附近可见锁标与安全标识 |
| **Social Proof（社会认同）** | 评价、证言、品牌 logo | 星级评分、用户头像、客户品牌墙 |
| **Transparency（透明）** | 政策、价格、联系方式 | 清晰入口、无隐藏费用、真实地址 |
| **Professional（专业感）** | 设计质量、一致性 | 无断裂样式，品牌表达统一 |
| **Authority（权威）** | 认证、奖项、媒体背书 | "As seen in..."、行业认证 |

### 信任信号放置（Trust Signal Placement）

```
┌────────────────────────────────────────────────────┐
│  HEADER：信任条（"Free shipping | 30-day returns | │
│          Secure checkout"）                       │
├────────────────────────────────────────────────────┤
│  HERO：社会认同（"Trusted by 10,000+"）            │
├────────────────────────────────────────────────────┤
│  PRODUCT：评价可见 + 安全徽章                      │
├────────────────────────────────────────────────────┤
│  CHECKOUT：支付图标 + SSL + 保障承诺                │
├────────────────────────────────────────────────────┤
│  FOOTER：联系方式 + 政策 + 认证                     │
└────────────────────────────────────────────────────┘
```

### 信任样式 CSS 模式（Trust-Building CSS Patterns）

```css
/* 信任徽章 */
.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F0FDF4;  /* 浅绿 = 安全感 */
  border-radius: 2px; /* 更直角 = 更精确/严谨 */
  font-size: 14px;
  color: #166534;
}

/* 安全表单提示 */
.secure-form::before {
  content: '🔒 Secure form';
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 8px;
}

/* 证言卡片 */
.testimonial {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 16px; /* 更大圆角 = 更友好 */
  box-shadow: var(--shadow-sm);
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;  /* 真人头像优于缩写字母 */
}
```

---

## 6. 认知负荷管理（Cognitive Load Management）

### 三种认知负荷（Three Types of Cognitive Load）

| Type（类型） | Definition（定义） | Designer's Role（设计者职责） |
|--------------|--------------------|-------------------------------|
| **Intrinsic** | 任务本身固有复杂度 | 拆分为更小步骤 |
| **Extraneous** | 由糟糕设计引入的负担 | 必须消除 |
| **Germane** | 用于学习与理解的必要负担 | 通过引导支持它 |

### 降负策略（Reduction Strategies）

**1. Simplify（简化，降低 Extraneous）**
```css
/* 视觉噪声高 → 视觉简洁 */
.card-busy {
  border: 2px solid red;
  background: linear-gradient(...);
  box-shadow: 0 0 20px ...;
  /* 过度设计 */
}

.card-clean {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  /* 平静、聚焦 */
}
```

**2. Chunk Information（信息分块）**
```html
<!-- 压迫式展示 -->
<form>
  <!-- 一次性 15 个字段 -->
</form>

<!-- 分块展示 -->
<form>
  <fieldset>
    <legend>Step 1: Personal Info</legend>
    <!-- 3-4 fields -->
  </fieldset>
  <fieldset>
    <legend>Step 2: Shipping</legend>
    <!-- 3-4 fields -->
  </fieldset>
</form>
```

**3. Progressive Disclosure（渐进披露）**
```html
<!-- 复杂项按需展开 -->
<div class="filters">
  <div class="filters-basic">
    <!-- 高频筛选可见 -->
  </div>
  <button onclick="toggleAdvanced()">
    Advanced Options ▼
  </button>
  <div class="filters-advanced" hidden>
    <!-- 高级筛选默认隐藏 -->
  </div>
</div>
```

**4. Use Familiar Patterns（使用熟悉模式）**
```
✅ 标准导航位置
✅ 常见图标语义（🔍 = search）
✅ 常规表单布局
✅ 常见手势模式（swipe、pinch）
```

**5. Offload Information（把记忆负担交给系统）**
```html
<!-- 不要求用户死记 -->
<label>
  Card Number
  <input type="text" inputmode="numeric"
         autocomplete="cc-number"
         placeholder="1234 5678 9012 3456">
</label>

<!-- 明确展示已填内容 -->
<div class="order-summary">
  <p>Shipping to: <strong>John Doe, 123 Main St...</strong></p>
  <a href="#">Edit</a>
</div>
```

---

## 7. 说服式设计（Persuasive Design, Ethical）

### 合伦理的说服策略（Ethical Persuasion Techniques）

| Technique（技术） | Ethical Use（合伦理用法） | Dark Pattern（需避免） |
|-------------------|---------------------------|------------------------|
| **Scarcity** | 真实库存稀缺 | 伪造倒计时 |
| **Social Proof** | 真实用户评价 | 伪造证言 |
| **Authority** | 真实资质背书 | 误导性徽章 |
| **Urgency** | 真实截止时间 | 人造 FOMO |
| **Commitment** | 进度保存与延续 | 情绪绑架/内疚诱导 |

### Nudge 模式（Nudge Patterns）

**Smart Defaults（智能默认）**：
```html
<!-- 默认选推荐项 -->
<input type="radio" name="plan" value="monthly">
<input type="radio" name="plan" value="annual" checked>
  Annual (Save 20%)
```

**Anchoring（锚定）**：
```html
<!-- 用原价框定折扣价值 -->
<div class="price">
  <span class="original">$99</span>
  <span class="current">$79</span>
  <span class="savings">Save 20%</span>
</div>
```

**Social Proof（社会认同）**：
```html
<!-- 实时活动 -->
<div class="activity">
  <span class="avatar">👤</span>
  <span>Sarah from NYC just purchased</span>
</div>

<!-- 聚合证明 -->
<p>Join 50,000+ designers who use our tool</p>
```

**Progress & Commitment（进度与承诺）**：
```html
<!-- 进度可视化促进完成 -->
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
  <span>60% complete - almost there!</span>
</div>
```

---

## 8. 用户画像速查（User Persona Quick Reference）

### Gen Z（1997-2012）

```
CHARACTERISTICS（特征）：
- 数字原住民，移动优先
- 重视真实与多元
- 注意力周期较短
- 偏视觉学习

DESIGN APPROACH（设计策略）：
├── Colors：高饱和、强对比、大胆渐变
├── Typography：大字号、可变、实验性
├── Layout：纵向滚动、移动端原生
├── Interactions：快节奏、游戏化、手势化
├── Content：短视频、meme、story 形态
└── Trust：同伴评价 > 权威背书
```

### Millennials（1981-1996）

```
CHARACTERISTICS（特征）：
- 重体验胜过重占有
- 购买前会充分研究
- 社会责任意识更强
- 价格敏感且重品质

DESIGN APPROACH（设计策略）：
├── Colors：低饱和粉彩、自然土色
├── Typography：清晰易读 Sans-serif
├── Layout：响应式、卡片化
├── Interactions：平滑且有目的动效
├── Content：价值导向、透明表达
└── Trust：评价、可持续、价值观一致
```

### Gen X（1965-1980）

```
CHARACTERISTICS（特征）：
- 独立、自主
- 重效率
- 对营销说辞更谨慎
- 科技接受度平衡

DESIGN APPROACH（设计策略）：
├── Colors：专业、可信
├── Typography：熟悉、保守
├── Layout：清晰层级、传统结构
├── Interactions：功能优先，不炫技
├── Content：直接、事实导向
└── Trust：专业能力、过往记录
```

### Baby Boomers（1946-1964）

```
CHARACTERISTICS（特征）：
- 重细节
- 建立信任后忠诚度高
- 重视真人服务
- 科技自信度相对较低

DESIGN APPROACH（设计策略）：
├── Colors：高对比、简色板
├── Typography：大字号（18px+）、高对比
├── Layout：线性、简单、留白充分
├── Interactions：最小化且反馈明确
├── Content：完整、细致
└── Trust：电话、地址、真人信息
```

---

## 9. 情绪与颜色映射（Emotion Color Mapping）

```
┌────────────────────────────────────────────────────┐
│  EMOTION          │  COLORS           │  USE       │
├───────────────────┼───────────────────┼────────────┤
│  Trust            │  Blue, Green      │  Finance   │
│  Excitement       │  Red, Orange      │  Sales     │
│  Calm             │  Blue, Soft green │  Wellness  │
│  Luxury           │  Black, Gold      │  Premium   │
│  Creativity       │  Teal, Pink       │  Art       │
│  Energy           │  Yellow, Orange   │  Sports    │
│  Nature           │  Green, Brown     │  Eco       │
│  Happiness        │  Yellow, Orange   │  Kids      │
│  Sophistication   │  Gray, Navy       │  Corporate │
│  Urgency          │  Red              │  Errors    │
└───────────────────┴───────────────────┴────────────┘
```

---

## 10. 心理学上线前清单（Psychology Checklist）

### Before Launch（上线前）

- [ ] **Hick's Law**：导航选项是否控制在 7 项内，减少决策疲劳？
- [ ] **Fitts' Law**：主 CTA 是否足够大且移动端易点击？
- [ ] **Miller's Law**：信息是否按 5-7 单元分块？
- [ ] **Jakob's Law**：是否遵循用户熟悉的 Web 约定？
- [ ] **Doherty Threshold**：核心反馈是否在 400ms 内返回？是否有 Skeleton？
- [ ] **Tesler's Law**：复杂度是否尽量转移给系统处理？
- [ ] **Parkinson’s Law**：是否提供一键式捷径减少完成时间？
- [ ] **Von Restorff**：主 CTA 是否相对其他元素足够突出？
- [ ] **Serial Position**：关键信息是否放在开头或结尾？
- [ ] **Gestalt Laws**：相关元素是否通过接近/区域等方式清晰成组？
- [ ] **Zeigarnik Effect**：未完成任务是否有进度提示？
- [ ] **Goal Gradient**：是否给用户“起步领先”以提高完成率？
- [ ] **Peak-End Rule**：成功页是否制造了愉悦收尾时刻？
- [ ] **Occam’s Razor**：是否去除了多余视觉/功能元素？
- [ ] **Aesthetic-Usability**：视觉质量是否足以建立初始信任？
- [ ] **Trust & Authority**：安全标识、评价、认证是否可见？
- [ ] **Social Proof**：关键决策点是否提供真实社会认同？
- [ ] **Scarcity & Urgency**：稀缺和紧迫是否真实、合伦理？
- [ ] **Loss Aversion**：文案是否强调“避免失去”而不仅是“获得”？
- [ ] **Anchoring**：定价呈现是否合理锚定期望？
- [ ] **Postel’s Law**：输入格式是否足够宽容且鲁棒？
- [ ] **False-Consensus**：是否经过真实用户测试，而非仅内部评审？
- [ ] **Curse of Knowledge**：文案是否去术语化并对新手友好？
- [ ] **Stepping Stone**：漏斗是否从低摩擦任务开始（如仅邮箱）？
- [ ] **Cognitive Load**：视觉噪声是否被有效控制？
- [ ] **Emotional Design**：色彩与图像是否触发预期情绪反应？
- [ ] **Feedback**：交互元素是否具备 hover/active/success 即时反馈？
- [ ] **Accessibility**：对比度与键盘/读屏可达性是否达标？
- [ ] **Prägnanz**：图标和形状是否“一眼识别”？
- [ ] **Figure/Ground**：焦点元素与背景层次是否明确？
