---
description: 移动性能优化、FlashList 对策、图片缓存与内存管理
---

# 移动端性能参考 (Mobile Performance Reference)

> 移动性能优化、FlashList 对策、图片缓存与内存管理。
> **性能不是一种特性——它是最基本的功能。**

---

## 1. 移动端性能黄金法则

```
60 FPS 法则:
├── 必须在 16.67ms 内完成每帧渲染
├── 如果错过 → 掉帧 (Jank)
├── 掉帧 = 用户感知为"卡顿"、"廉价"、"低质量"

JS 线程 vs UI 线程:
├── UI 线程 (Main): 负责渲染、滚动、原生手势。
└── JS 线程: 负责 React 逻辑、状态更新、API 处理。

❌ 阻塞 JS 线程 → 按钮无反应。
❌ 阻塞 UI 线程 → 滚动冻结 (最坏情况)。
```

### 关键指标

| 指标         | 目标               | 测量工具                          |
| :----------- | :----------------- | :-------------------------------- |
| **FPS**      | 始终 60 (理想 120) | React DevTools / Android Profiler |
| **App 启动** | < 2 秒             | Flipper / Xcode Instruments       |
| **交互响应** | < 100ms            | 你的感觉 / 性能监视器             |
| **内存使用** | 无泄漏             | Android Profiler / Instruments    |

---

## 2. 列表性能 (List Performance)

列表是移动端性能问题的**头号原因**。

### FlashList (Shopify) vs FlatList

| 特性         | FlashList             | FlatList            |
| :----------- | :-------------------- | :------------------ |
| **渲染速度** | ⚡⚡ 5-10x 更快       | 🐢 慢，尤其在低端机 |
| **回收机制** | 回收 View 实例 (即时) | 销毁并重新创建 (慢) |
| **内存占用** | 极低                  | 随列表长度增加      |
| **空白区域** | 极少                  | 快速滚动时常见      |

**规则: 新列表默认使用 FlashList。**

### FlashList 检查清单

```javascript
<FlashList
    data={data}
    renderItem={renderItem}
    estimatedItemSize={100} // ⚠️ 必须设置且要准确！
    keyExtractor={(item) => item.id}
    getItemType={(item) => item.type} // ⚠️ 对不同类型的行至关重要
/>
```

1.  **estimatedItemSize**: 如果不设置，性能与 FlatList 一样差。
2.  **getItemType**: 如果有多种行布局，必须使用此属性，否则回收机制会失效。
3.  **Components**: 列表项组件应该使用 `React.memo` 包装。
4.  **匿名函数**: 避免在 `renderItem` 中使用内联箭头函数。

---

## 3. 图片优化 (Image Optimization)

移动端图片是**二号性能杀手**。

| 策略               | 实现                                               | 为什么                   |
| :----------------- | :------------------------------------------------- | :----------------------- |
| **正确的尺寸**     | 请求 `w=300` 而不是 `w=3000`                       | 减少内存解码压力         |
| **缓存 (Caching)** | `react-native-fast-image` / `cached_network_image` | 这里是移动端，网络不可靠 |
| **格式**           | WebP / AVIF                                        | 比 PNG/JPG 小 30-50%     |
| **预加载**         | 关键图片 (Hero images)                             | 避免闪烁                 |
| **占位符**         | Blurhash / 骨架屏                                  | 即时视觉反馈             |

### 内存中的图片

一张 4K 图片 (3840x2160) 占用多少内存？

- 文件大小: 2MB (压缩后)
- **内存解码大小**: 3840 _ 2160 _ 4 bytes ≈ **32MB**!

**危险:** 一个包含 10 张全尺寸图片的列表 = **320MB 内存** → App 崩溃 (OOM)。
**解决方案:** 始终调整图片大小至显示尺寸 (Resize to exact display dimensions)。

---

## 4. 渲染优化 (Render Optimization)

### 避免过度渲染 (Over-rendering)

React Native / Flutter 特有的痛点：

1.  **Context 地狱**:
    - 如果 Context 更新，所有消费者都会重新渲染。
    - **修复**: 拆分 Context，或使用 Zustand/Riverpod (原子化更新)。

2.  **内联对象/函数**:
    - `style={{ margin: 10 }}` → 每次都创建新对象 → 破坏 memoization。
    - **修复**: `const styles = StyleSheet.create(...)`。

3.  **Memoization (记忆化)**:
    - 使用 `useMemo` 计算复杂数据。
    - 使用 `useCallback` 缓存处理函数。
    - 使用 `React.memo` 缓存子组件。

### 桥接 (The Bridge) - RN 遗留问题

(注意: 新架构/Fabric 解决了大部分问题，但老代码仍需注意)

- JS 和 Native 之间的通信通过"桥"进行。
- **瓶颈**: 发送大量数据过桥 (例如：Base64 图片，大量 JSON)。
- **规则**: 保持过桥数据序列化轻量。动画使用 Native Driver (Worklet)。

---

## 5. 启动时间 (Startup Time)

用户等待 2 秒就会开始流失。

| 阶段               | 罪魁祸首            | 修复                                     |
| :----------------- | :------------------ | :--------------------------------------- |
| **Pre-main**       | 太多原生 SDK 初始化 | 延迟初始化非关键 SDK                     |
| **JS Bundle**      | 巨大的 Bundle 体积  | 代码拆分 (Code splitting)、Lazy require  |
| **Native Modules** | 同步加载所有模块    | TurboModules (按需加载)                  |
| **首屏渲染**       | 复杂的首页结构      | 缓存首页数据，显示骨架屏                 |
| **Hermes**         | 未开启 Hermes       | **必须开启 Hermes** (提高字节码加载速度) |

### Hermes 引擎

- **必须开启**。
- Android: 大幅减少启动时间 (2x faster)。
- iOS: 减少内存占用。

---

## 6. 动画性能

### 黄金法则

1.  **使用 UI 线程**: 动画必须在 UI 线程运行 (Native Driver / Reanimated Worklets)。
2.  **避免布局抖动**: 动画 `transform` (scale, translate) 和 `opacity`。
3.  **不要动画化**: `width`, `height`, `margin`, `padding`, `top`, `left` (这会触发布局重算)。

### reanimated 3

```javascript
// ✅ GOOD: 运行在 UI 线程 (Worklet)
const style = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: withSpring(offset.value) }]
  };
});

// ❌ BAD: 运行在 JS 线程，导致掉帧
Animated.View style={{ left: this.state.x }}
```

---

## 7. 离线优先架构 (Offline-First)

这不是纯粹的"速度"，而是"感知性能"。

- **乐观 UI (Optimistic UI)**:
    - 点击 "Like" → 立即变红 → 后台发请求。
    - 如果失败 → 变回原样 + 提示错误。
    - **效果**: App 感觉是即时的 (0ms 延迟)。

- **本地优先 (Local-First)**:
    - 先读 DB (WatermelonDB / Realm / SQLite)。
    - 渲染数据。
    - 然后从 API 更新数据。
    - **效果**: 永远无需等待加载圈。

---

## 8. Android 特定优化

Android 设备碎片化严重，低端机性能差。

1.  **开启 `enableFreeze` (React Freeze)**: 冻结不可见的屏幕，释放 CPU。
2.  **减少过度绘制 (Overdraw)**: 不要堆叠不必要的背景色。
3.  **使用 ProGuard/R8**: 混淆并移除未使用的代码，减小 APK 体积。
4.  **扁平化视图层级**: 嵌套越深，渲染越慢。

---

## 9. 性能检查清单

### 发布前检查

- [ ] **Hermes 已开启？**
- [ ] **列表使用 FlashList 且定义了 estimatedItemSize？**
- [ ] **图片使用适当尺寸的 CDN URL？**
- [ ] **没有 `console.log` 遗留？** (极慢)
- [ ] **使用了生产环境构建？** (**DEV**=false)
- [ ] **关键动画在 UI 线程运行？**
- [ ] **Android 低端机测试过？**
- [ ] **首屏加载有骨架屏/缓存？**

---

> **记住:** 开发者通常用高端 iPhone。用户通常用低端 Android。**在最差的设备上测试性能，而不是最好的设备。**
