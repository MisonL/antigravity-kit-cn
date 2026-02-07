# 7. JavaScript 性能优化 (JavaScript Performance)

> **影响等级:** 中低 (LOW-MEDIUM)
> **核心关注:** 对热点路径 (Hot paths) 的微优化可以累积成显著的性能提升。

---

## 规则 7.1: 避免布局抖动 (Avoid Layout Thrashing)

**核心原则**: 避免交替进行“样式写入”与“布局读取”。

- **错误**: 修改样式后立即读取 `offsetWidth`，强制浏览器触发同步重排 (Reflow)。
- **正确**: 批量读取，然后批量写入；或者优先使用 CSS Classes 切换样式。

---

## 规则 7.2: 为重复查找构建索引映射 (Build Index Maps)

对于在数组中频繁使用 `.find()` 的热点逻辑，应预先构建 `Map`。

- **复杂度提升**: 从 O(n) 降低至 O(1)。
- 在 1000 订单 × 1000 用户的情况下，操作次数从 100w 降至 2000 次。

---

## 规则 7.3: 在循环中缓存属性访问 (Cache Property Access)

在热点路径的循环中缓存深度对象属性。

- **优化**: 将 `obj.config.settings.value` 提取到循环外部变量中。

---

## 规则 7.4: 缓存存储 API 调用 (Cache Storage API Calls)

`localStorage` 和 `document.cookie` 是同步且昂贵的。

- **对策**: 在内存中使用 `Map` 或模块级变量缓存读取结果，仅在值变更时同步回 Storage。

---

## 规则 7.5: 数组比较时的早期长度检查 (Early Length Check)

在进行耗时的数组比较（如排序、深度相等判断）前，优先检查 `length`。

- 如果长度不等，数组绝对不相等，可立即返回 `true`/`false`。

---

## 规则 7.6: 使用循环而非排序查找极值 (Min/Max Instead of Sort)

查找最大/最小值只需一次 O(n) 遍历。

- **反模式**: 先使用 `sort()` 排序数组然后取第一个元素。这会导致 O(n log n) 的不必要开销。

---

## 规则 7.7: 使用 toSorted() 保证不可变性

使用 React 时，`.sort()` 会直接修改原数组，可能破坏 State 模型。

- **对策**: 使用 `toSorted()` (Node 20+) 或 `[...arr].sort()`。

---

## 规则 7.8: 正则表达式预编译与提取 (Hoist RegExp)

不要在渲染函数内创建 `new RegExp`。

- **对策**: 提取到模块顶层变量，或者使用 `useMemo` 缓存。

---

> **记住：** 性能优化不是为了写出复杂代码，而是为了减少 CPU 的无效忙碌。
