# 移动端性能参考（Mobile Performance Reference）

> 深入覆盖 React Native 与 Flutter 的性能优化、60fps 动画、内存管理与电量因素。
> **这是 AI 代码最容易失败的第一大领域。**

---

## 1. 移动端性能思维（The Mobile Performance Mindset）

### 为什么移动端性能不同（Why Mobile Performance is Different）

```
DESKTOP：                        MOBILE：
├── 计算资源充足                 ├── 电量是硬限制
├── RAM 相对充裕                 ├── RAM 共享且有限
├── 网络相对稳定                 ├── 网络不可靠
├── CPU 持续可用                 ├── 高温降频
└── 用户仍期望快                 └── 用户期待“即时响应”
```

### 性能预算概念（Performance Budget Concept）

```
每一帧必须在以下时间内完成：
├── 60fps → 16.67ms/帧
├── 120fps（ProMotion）→ 8.33ms/帧

如果代码超时：
├── 掉帧 → 滚动/动画卡顿
├── 用户感知为“慢/坏”
└── 他们会卸载 App
```

---

## 2. React Native 性能（React Native Performance）

### 🚫 AI 最大错误：用 ScrollView 渲染列表

```javascript
// ❌ 千万别这样做（AI 最常犯错）
<ScrollView>
  {items.map(item => (
    <ItemComponent key={item.id} item={item} />
  ))}
</ScrollView>

// 为什么灾难性：
// ├── 一次性渲染所有项目（1000 条 = 1000 次渲染）
// ├── 内存暴涨
// ├── 首屏渲染要等很久
// └── 滚动严重卡顿

// ✅ 必须使用 FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
```

### FlatList 优化清单（FlatList Optimization Checklist）

```javascript
// ✅ 正确示例：关键优化全部启用

// 1. 列表项组件 memo 化
const ListItem = React.memo(({ item }: { item: Item }) => {
  return (
    <Pressable style={styles.item}>
      <Text>{item.title}</Text>
    </Pressable>
  );
});

// 2. renderItem 使用 useCallback
const renderItem = useCallback(
  ({ item }: { item: Item }) => <ListItem item={item} />,
  [] // 空依赖 = 不重建
);

// 3. keyExtractor 稳定（不要用 index）
const keyExtractor = useCallback((item: Item) => item.id, []);

// 4. 固定高度时提供 getItemLayout
const getItemLayout = useCallback(
  (data: Item[] | null, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }),
  []
);

// 5. 应用于 FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  // 性能相关参数
  removeClippedSubviews={true} // Android：移除屏外视图
  maxToRenderPerBatch={10} // 每批渲染数量
  windowSize={5} // 渲染窗口（5=前后各 2 屏）
  initialNumToRender={10} // 首屏渲染数量
  updateCellsBatchingPeriod={50} // 批处理间隔
/>
```

### 每项优化的意义（Why Each Optimization Matters）

| 优化项（Optimization） | 防止的问题（What It Prevents） | 影响（Impact） |
|------------------------|---------------------------------|----------------|
| `React.memo` | 父组件变化导致重复渲染 | 🔴 Critical |
| `useCallback renderItem` | 每次 render 生成新函数 | 🔴 Critical |
| 稳定 `keyExtractor` | 列表复用错位 | 🔴 Critical |
| `getItemLayout` | 异步布局计算 | 🟡 High |
| `removeClippedSubviews` | 屏外内存堆积 | 🟡 High |
| `maxToRenderPerBatch` | 主线程阻塞 | 🟢 Medium |
| `windowSize` | 过高内存占用 | 🟢 Medium |

### FlashList：更好的选择

```javascript
// 大型列表推荐使用 FlashList
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={ITEM_HEIGHT}
  keyExtractor={keyExtractor}
/>

// 相对 FlatList 的优势：
// ├── 复用更高效
// ├── 内存管理更好
// ├── API 更简洁
// └── 需要的优化参数更少
```

### 动画性能（Animation Performance）

```javascript
// ❌ JS 线程驱动动画（会阻塞）
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false, // BAD!
}).start();

// ✅ Native driver 动画（UI 线程）
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // GOOD!
}).start();

// Native driver 只支持：
// ├── transform（translate、scale、rotate）
// └── opacity
//
// 不支持：
// ├── width、height
// ├── backgroundColor
// ├── borderRadius 变化
// └── margin、padding
```

### 复杂动画用 Reanimated

```javascript
// Native driver 不支持的场景，用 Reanimated 3

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Component = () => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value) }],
  }));

  return <Animated.View style={animatedStyles} />;
};

// 优势：
// ├── UI 线程运行（60fps）
// ├── 几乎所有属性可动画化
// ├── 手势驱动动画
// └── Worklets 支持复杂逻辑
```

### 内存泄漏预防（Memory Leak Prevention）

```javascript
// ❌ 内存泄漏：未清理 interval
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);
  // 缺少 cleanup！
}, []);

// ✅ 正确清理
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);

  return () => clearInterval(interval); // CLEANUP!
}, []);

// 常见泄漏来源：
// ├── Timers（setInterval、setTimeout）
// ├── Event listeners
// ├── Subscriptions（WebSocket、PubSub）
// ├── 卸载后仍更新状态的异步操作
// └── 不受限的图片缓存
```

### React Native 性能检查清单

```markdown
## 每个列表前
- [ ] 使用 FlatList 或 FlashList（不要用 ScrollView）
- [ ] renderItem 用 useCallback
- [ ] 列表项用 React.memo
- [ ] keyExtractor 使用稳定 ID（不要用 index）
- [ ] 固定高度时提供 getItemLayout

## 每个动画前
- [ ] useNativeDriver: true（尽可能）
- [ ] 复杂动画使用 Reanimated
- [ ] 仅动画 transform/opacity
- [ ] 在低端 Android 设备测试

## 发布前
- [ ] 清理 console.log
- [ ] 所有 useEffect 都有 cleanup
- [ ] 无内存泄漏（Profiler 检查）
- [ ] 在 release 包里测试（非 dev）
```

---

## 3. Flutter 性能（Flutter Performance）

### 🚫 AI 最大错误：滥用 setState

```dart
// ❌ 错误：setState 会重建整棵 widget 树
class BadCounter extends StatefulWidget {
  @override
  State<BadCounter> createState() => _BadCounterState();
}

class _BadCounterState extends State<BadCounter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++; // 下面所有内容都会重建！
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        ExpensiveWidget(), // 不必要重建
        AnotherExpensiveWidget(), // 不必要重建
      ],
    );
  }
}
```

### `const` 构造器革命（The `const` Constructor Revolution）

```dart
// ✅ 正确：const 可避免重建

class GoodCounter extends StatefulWidget {
  const GoodCounter({super.key}); // CONST 构造器！

  @override
  State<GoodCounter> createState() => _GoodCounterState();
}

class _GoodCounterState extends State<GoodCounter> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        const ExpensiveWidget(), // 不会重建
        const AnotherExpensiveWidget(), // 不会重建
      ],
    );
  }
}

// 规则：所有不依赖状态的 widget 都应加 const
```

### 精准状态管理（Targeted State Management）

```dart
// ❌ setState 重建全树
setState(() => _value = newValue);

// ✅ ValueListenableBuilder：局部重建
class TargetedState extends StatelessWidget {
  final ValueNotifier<int> counter = ValueNotifier(0);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 只有这部分会随 counter 改变
        ValueListenableBuilder<int>(
          valueListenable: counter,
          builder: (context, value, child) => Text('$value'),
          child: const Icon(Icons.star), // 不会重建
        ),
        const ExpensiveWidget(), // 永远不重建
      ],
    );
  }
}
```

### Riverpod/Provider 最佳实践（Riverpod/Provider Best Practices）

```dart
// ❌ 错误：在 build 中读取整个 provider
Widget build(BuildContext context) {
  final state = ref.watch(myProvider); // 任意变化都会重建
  return Text(state.name);
}

// ✅ 正确：只选择需要的字段
Widget build(BuildContext context) {
  final name = ref.watch(myProvider.select((s) => s.name));
  return Text(name); // 仅 name 变化才重建
}
```

### ListView 优化（ListView Optimization）

```dart
// ❌ 错误：ListView 无 builder（一次性渲染）
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)

// ✅ 正确：ListView.builder（懒加载）
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  // 进一步优化：
  itemExtent: 56, // 固定高度 = 更快布局
  cacheExtent: 100, // 预渲染距离
)

// ✅ 更好：ListView.separated 适合分隔线
ListView.separated(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  separatorBuilder: (context, index) => const Divider(),
)
```

### 图片优化（Image Optimization）

```dart
// ❌ 错误：不缓存 + 原尺寸
Image.network(url)

// ✅ 正确：缓存 + 限尺寸
CachedNetworkImage(
  imageUrl: url,
  width: 100,
  height: 100,
  fit: BoxFit.cover,
  memCacheWidth: 200, // 2x for retina
  memCacheHeight: 200,
  placeholder: (context, url) => const Skeleton(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
)
```

### Dispose 规范（Dispose Pattern）

```dart
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final StreamSubscription _subscription;
  late final AnimationController _controller;
  late final TextEditingController _textController;

  @override
  void initState() {
    super.initState();
    _subscription = stream.listen((_) {});
    _controller = AnimationController(vsync: this);
    _textController = TextEditingController();
  }

  @override
  void dispose() {
    // 始终按创建的逆序清理
    _textController.dispose();
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Container();
}
```

### Flutter 性能检查清单

```markdown
## 每个 Widget 前
- [ ] const 构造器已加（无运行时参数）
- [ ] 静态子节点使用 const
- [ ] setState 影响范围最小化
- [ ] Provider 读取使用 selector

## 每个列表前
- [ ] 使用 ListView.builder（不要用 ListView children）
- [ ] 固定高度提供 itemExtent
- [ ] 图片缓存 + 尺寸限制

## 每个动画前
- [ ] 使用 Impeller（Flutter 3.16+）
- [ ] 避免 Opacity（用 FadeTransition）
- [ ] AnimationController 使用 TickerProviderStateMixin

## 发布前
- [ ] 所有 dispose() 已实现
- [ ] 生产环境移除 print()
- [ ] 在 profile/release 模式测试
- [ ] DevTools 性能叠层检查
```

---

## 4. 动画性能（Animation Performance, Both Platforms）

### 60fps 必达（The 60fps Imperative）

```
人眼感知：
├── < 24 fps → 像幻灯片（坏）
├── 24-30 fps → 明显卡顿
├── 30-45 fps → 不够顺滑
├── 45-60 fps → 可接受
├── 60 fps → 丝滑（目标）
└── 120 fps → 高端（ProMotion）

不要发布 < 60fps 的动画。
```

### GPU vs CPU 动画

```
GPU 加速（快）：              CPU 计算（慢）：
├── transform: translate       ├── width, height
├── transform: scale           ├── top, left, right, bottom
├── transform: rotate          ├── margin, padding
├── opacity                    ├── border-radius（动画）
└──（合成层，离开主线程）      └── box-shadow（动画）

规则：只动画 transform 与 opacity，
否则会触发 layout 重新计算。
```

### 动画时长参考（Animation Timing Guide）

| 动画类型（Animation Type） | 时长（Duration） | 缓动（Easing） |
|----------------------------|------------------|----------------|
| 微交互（Micro-interaction） | 100-200ms | ease-out |
| 标准过渡 | 200-300ms | ease-out |
| 页面过渡 | 300-400ms | ease-in-out |
| 复杂/戏剧化 | 400-600ms | ease-in-out |
| Skeleton Loading | 1000-1500ms | linear（循环） |

### 弹簧物理（Spring Physics）

```javascript
// React Native Reanimated
withSpring(targetValue, {
  damping: 15,      // 阻尼（越大越快停）
  stiffness: 150,   // 刚度（越大越紧）
  mass: 1,          // 质量
})

// Flutter
SpringSimulation(
  SpringDescription(
    mass: 1,
    stiffness: 150,
    damping: 15,
  ),
  start,
  end,
  velocity,
)

// 自然手感范围：
// Damping: 10-20（弹性到收敛）
// Stiffness: 100-200（松到紧）
// Mass: 0.5-2（轻到重）
```

---

## 5. 内存管理（Memory Management）

### 常见内存泄漏（Common Memory Leaks）

| 来源（Source） | 平台（Platform） | 解决方案（Solution） |
|----------------|------------------|----------------------|
| Timers | Both | cleanup/dispose 清理 |
| Event listeners | Both | cleanup/dispose 移除 |
| Subscriptions | Both | cleanup/dispose 取消 |
| Large images | Both | 限制缓存/尺寸 |
| Async after unmount | RN | isMounted 或 AbortController |
| Animation controllers | Flutter | dispose controllers |

### 图片内存（Image Memory）

```
图片内存 = 宽 × 高 × 4 字节（RGBA）

1080p 图片 = 1920 × 1080 × 4 = 8.3 MB
4K 图片 = 3840 × 2160 × 4 = 33.2 MB

10 张 4K = 332 MB → 直接崩溃

规则：必须按显示尺寸加载（或 2-3x retina）。
```

### 内存 Profiling（Memory Profiling）

```
React Native：
├── Flipper → Memory tab
├── Xcode Instruments（iOS）
└── Android Studio Profiler

Flutter：
├── DevTools → Memory tab
├── Observatory
└── flutter run --profile
```

---

## 6. 电量优化（Battery Optimization）

### 电量消耗来源（Battery Drain Sources）

| 来源（Source） | 影响（Impact） | 缓解（Mitigation） |
|----------------|----------------|--------------------|
| **屏幕常亮** | 🔴 Highest | OLED 下优先暗色 |
| **持续 GPS** | 🔴 Very high | 用 significant change 模式 |
| **网络请求** | 🟡 High | 批量请求 + 强缓存 |
| **动画** | 🟡 Medium | 低电量时降级 |
| **后台任务** | 🟡 Medium | 非关键延后处理 |
| **CPU 计算** | 🟢 Lower | 转到后端处理 |

### OLED 省电原则（OLED Battery Saving）

```
OLED：黑色像素 = 不发光 = 0 功耗

暗色模式节能：
├── 纯黑（#000000）→ 最大节能
├── 深灰（#1a1a1a）→ 少量节能
├── 彩色 → 一定功耗
└── 白色（#FFFFFF）→ 最大耗电

规则：暗色模式背景尽量用纯黑。
```

### 后台任务准则（Background Task Guidelines）

```
iOS：
├── Background refresh：系统调度，频次受限
├── Push notifications：重要更新才用
├── Background modes：仅 Location/Audio/VoIP
└── Background tasks：最大约 30 秒

Android：
├── WorkManager：系统调度、节能优先
├── Foreground service：前台可见、持续运行
├── JobScheduler：批量网络任务
└── Doze mode：必须遵守并批处理
```

---

## 7. 网络性能（Network Performance）

### 离线优先架构（Offline-First Architecture）

```
                    ┌──────────────┐
                    │     UI       │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Cache      │ ← 先读缓存
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Network    │ ← 网络更新缓存
                    └──────────────┘

收益：
├── UI 秒开（缓存无需 loading）
├── 支持离线
├── 降低流量消耗
└── 慢网体验更好
```

### 请求优化（Request Optimization）

```
BATCH：多请求合并
├── 10 个小请求 → 1 个批量请求
├── 降低连接开销
└── 电量更友好（无线模块只唤醒一次）

CACHE：不重复拉取无变化数据
├── ETag/If-None-Match 头
├── Cache-Control 头
└── Stale-while-revalidate 模式

COMPRESS：减少体积
├── gzip/brotli
├── 只请求必要字段（GraphQL）
└── 大列表必须分页
```

---

## 8. 性能测试（Performance Testing）

### 测什么（What to Test）

| 指标（Metric） | 目标（Target） | 工具（Tool） |
|----------------|----------------|--------------|
| **帧率** | ≥ 60fps | Performance overlay |
| **内存** | 稳定无增长 | Profiler |
| **冷启动** | < 2s | 手动计时 |
| **TTI** | < 3s | Lighthouse |
| **列表滚动** | 无卡顿 | 体感验证 |
| **动画顺滑** | 无掉帧 | Performance monitor |

### 真实设备测试（Test on Real Devices）

```
⚠️ 永远不要只信：
├── 模拟器/模拟机（远快于真机）
├── Dev 模式（比 Release 慢）
├── 只有高端设备

✅ 必须覆盖：
├── 低端 Android（<$200）
├── 老 iOS 设备（iPhone 8 / SE）
├── Release/Profile 构建
└── 真实数据（不是 10 条假数据）
```

### 性能监控清单（Performance Monitoring Checklist）

```markdown
## 开发中
- [ ] 开启性能叠层
- [ ] 关注掉帧
- [ ] 内存稳定
- [ ] 无性能警告

## 发布前
- [ ] 低端设备实测
- [ ] 长时使用内存 Profiling
- [ ] 冷启动时间已测
- [ ] 列表 1000+ 条滚动测试
- [ ] 动画 60fps 测试
- [ ] 慢 3G 网络测试
```

---

## 9. 速查卡（Quick Reference Card）

### React Native Essentials

```javascript
// 列表：必须使用
<FlatList
  data={data}
  renderItem={useCallback(({item}) => <MemoItem item={item} />, [])}
  keyExtractor={useCallback(item => item.id, [])}
  getItemLayout={useCallback((_, i) => ({length: H, offset: H*i, index: i}), [])}
/>

// 动画：必须 native
useNativeDriver: true

// 清理：必须有 cleanup
useEffect(() => {
  return () => cleanup();
}, []);
```

### Flutter Essentials

```dart
// Widgets：必须 const
const MyWidget()

// Lists：必须 builder
ListView.builder(itemBuilder: ...)

// State：必须精准
ValueListenableBuilder() or ref.watch(provider.select(...))

// Dispose：必须清理
@override
void dispose() {
  controller.dispose();
  super.dispose();
}
```

### 动画目标（Animation Targets）

```
Transform/Opacity only ← 可动画属性
16.67ms per frame ← 时间预算
60fps minimum ← 最低目标
Low-end Android ← 必测设备
```

---

> **记住（Remember）**：性能不是“优化项”，而是“基础质量”。慢 App 等于坏 App。请以用户最差的设备为标准，而不是你最好的设备。
