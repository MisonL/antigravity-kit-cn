# 移动端性能参考指南 (Mobile Performance Reference)

> 深入探讨 React Native 和 Flutter 的性能优化、60fps 动画、内存管理以及电池电量考量。
> **此文件涵盖了 AI 生成代码中最容易失败 (FAIL) 的首要领域。**

---

## 1. 移动端性能思维 (The Mobile Performance Mindset)

### 为什么移动端性能与众不同

```
桌面端 (DESKTOP):                    移动端 (MOBILE):
├── 电源无限 (Unlimited power)      ├── 电池容量有限 (Battery matters)
├── 内存充足 (Abundant RAM)         ├── 内存共享且有限 (RAM is limited)
├── 网络稳定 (Stable network)       ├── 网络不可靠 (Network is unreliable)
└── CPU 始终可用                    └── CPU 发热时会降频 (Throttles when hot)
```

### 性能预算概念 (Performance Budget Concept)

```
每一帧必须在以下时间内完成：
├── 60fps → 每帧 16.67ms
└── 120fps (ProMotion) → 每帧 8.33ms

如果你的代码耗时更长：
├── 掉帧 (Frame drops) → 滚动/动画卡顿 (Janky)
└── 用户会流失 (They WILL uninstall)
```

---

## 2. React Native 性能优化 (React Native Performance)

### 🚫 典型的 AI 错误：在列表使用 ScrollView

```javascript
// ❌ 严禁这样做 - AI 最容易犯的致命错误
<ScrollView>
    {items.map((item) => (
        <ItemComponent key={item.id} item={item} />
    ))}
</ScrollView>

// 为什么这是灾难性的：
// ├── 立即渲染所有项 (1000 个项 = 1000 次渲染)
// ├── 内存爆炸 (Memory explodes)
// └── 滚动变得极其卡顿
```

### FlatList 优化清单

```javascript
// ✅ 正确：应用了所有优化

// 1. 使用 React.memo 包装组件
const ListItem = React.memo(({ item }) => (
    <Pressable style={styles.item}>
        <Text>{item.title}</Text>
    </Pressable>
));

// 2. 使用 useCallback 记忆 renderItem
const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);

// 3. 稳定的 keyExtractor (严禁使用 index!)
const keyExtractor = useCallback((item) => item.id, []);

// 4. 为固定高度项目提供 getItemLayout
const getItemLayout = useCallback(
    (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    }),
    [],
);

// 5. 应用到 FlatList
<FlatList
    data={items}
    renderItem={renderItem}
    keyExtractor={keyExtractor}
    getItemLayout={getItemLayout}
    removeClippedSubviews={true} // Android: 卸载屏幕外视图
    maxToRenderPerBatch={10} // 每次增量渲染数量
    windowSize={5} // 渲染窗口大小
/>;
```

### 动画性能 (Animation Performance)

```javascript
// ❌ JS 线程动画 (会阻塞 JS 线程)
Animated.timing(value, { useNativeDriver: false }).start();

// ✅ 原生驱动动画 (在 UI 线程运行)
Animated.timing(value, { useNativeDriver: true }).start();

// 原生驱动仅支持：transform 和 opacity
```

---

## 3. Flutter 性能优化 (Flutter Performance)

### 🚫 典型的 AI 错误：过度使用 setState

```dart
// ❌ 错误：setState 会重建整个 Widget 树
void _increment() {
  setState(() { _counter++; }); // 重建了下方所有昂贵的 Widget
}
```

### `const` 构造函数革命

```dart
// ✅ 正确：使用 const 防止不必要的重建
Column(
  children: [
    Text('Counter: $_counter'),
    const ExpensiveWidget(), // 永远不会重复重建！
  ],
)
```

### ListView 优化

```dart
// ❌ 错误：不带 builder 的 ListView (一次性渲染所有)
ListView(children: items.map((e) => Item(e)).toList())

// ✅ 正确：ListView.builder (延迟渲染/懒加载)
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
  itemExtent: 56, // 固定高度提升性能
)
```

---

## 4. 动画性能 (跨平台原则)

### GPU vs CPU 动画

```
GPU 加速 (快):                   CPU 绑定 (慢):
├── transform: translate         ├── width, height
├── transform: scale             ├── top, left, right, bottom
├── transform: rotate            ├── margin, padding
└── opacity                      └── box-shadow (带动画)

规则：仅对 transform 和 opacity 进行动画处理。
```

---

## 5. 内存管理 (Memory Management)

### 常见内存泄漏 (Memory Leaks)

- **定时器 (Timers)**: 未在 cleanup/dispose 中清除。
- **侦听器 (Listeners)**: 未移除。
- **大图 (Large images)**: 未设置缓存限制或未调整大小。

### 图像内存计算

```
内存占用 = 宽 × 高 × 4 字节 (RGBA)
1080p = 8.3 MB | 4K = 33.2 MB
规则：始终将图像缩放到显示大小 (Retina 屏则 2-3 倍)。
```

---

## 6. 电池优化 (Battery Optimization)

| 来源         | 影响    | 缓解措施                   |
| ------------ | ------- | -------------------------- |
| **屏幕常亮** | 🔴 最高 | OLED 使用深色模式          |
| **持续 GPS** | 🔴 极高 | 使用显著位置变更监听       |
| **网络请求** | 🟡 高   | 批量处理 (Batch), 激进缓存 |

### OLED 省电规则

```
OLED 屏幕：黑色像素 = 关闭 = 零功耗
规则：在深色模式下，背景使用纯黑 (#000000) 而非深灰。
```

---

## 7. 网络性能 (Network Performance)

### 离线优先架构 (Offline-First)

1. **优先读取缓存** (Instant UI)。
2. **后台同步网络**。
3. **减少冗余请求**。

---

## 8. 性能测试 (Performance Testing)

### 性能指标

- **帧率**: ≥ 60fps。
- **冷启动**: < 2s。
- **内存**: 保持稳定，无持续增长。

### ⚠️ 严禁仅在以下环境测试：

- 模拟器/仿真器 (比实机快)。
- 开发模式 (比发布模式慢)。
- 仅使用高端设备。

---

## 9. 快速参考手册 (Quick Reference)

### React Native 要点

```javascript
// 列表：始终使用 FlatList/FlashList
// 动画：始终 useNativeDriver: true
// 清理：始终在 useEffect 中 return 清除函数
```

### Flutter 要点

```dart
// 组件：始终使用 const
// 列表：始终使用 builder
// 销毁：始终在 dispose() 中处理 controller
```

---

> **记住：** 性能不是一种“优化”——它是基础质量。慢速的应用就是损坏的应用。
