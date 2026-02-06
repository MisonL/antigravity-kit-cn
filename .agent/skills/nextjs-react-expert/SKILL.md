---
name: nextjs-react-expert
description: 来自 Vercel 工程团队的 React 和 Next.js 性能优化指南。用于构建组件、消除瀑布流、减少包体积、审查代码或实施服务端/客户端优化。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js & React Performance Expert - 性能专家

> **源自 Vercel 工程团队** - 按影响优先级排序的 57 条优化规则
> **哲学：** 首先消除瀑布流，其次优化包体积，最后微优化。

---

## 🎯 选择性阅读规则 (强制)

**仅阅读与你任务相关的部分！** 检查下方的内容映射并加载你需要的内容。

> 🔴 **对于性能审查：从 关键 (CRITICAL) 部分 (1-2) 开始，然后移动到 高/中 (HIGH/MEDIUM)。**

---

## 📑 内容映射 (Content Map)

| 文件                                    | 影响 (Impact)             | 规则数   | 何时阅读                                  |
| --------------------------------------- | ------------------------- | -------- | ----------------------------------------- |
| `1-async-eliminating-waterfalls.md`     | 🔴 **关键 (CRITICAL)**    | 5 rules  | 页面加载慢，顺序 API 调用，数据获取瀑布流 |
| `2-bundle-bundle-size-optimization.md`  | 🔴 **关键 (CRITICAL)**    | 5 rules  | 包体积大，交互时间 (TTI) 慢，首屏加载问题 |
| `3-server-server-side-performance.md`   | 🟠 **高 (HIGH)**          | 7 rules  | SSR 慢，API 路由优化，服务端瀑布流        |
| `4-client-client-side-data-fetching.md` | 🟡 **中高 (MEDIUM-HIGH)** | 4 rules  | 客户端数据管理，SWR 模式，去重            |
| `5-rerender-re-render-optimization.md`  | 🟡 **中 (MEDIUM)**        | 12 rules | 过度重绘，React 性能，Memoization         |
| `6-rendering-rendering-performance.md`  | 🟡 **中 (MEDIUM)**        | 9 rules  | 渲染瓶颈，虚拟化，图像优化                |
| `7-js-javascript-performance.md`        | ⚪ **低中 (LOW-MEDIUM)**  | 12 rules | 微优化，缓存，循环性能                    |
| `8-advanced-advanced-patterns.md`       | 🔵 **可变 (VARIABLE)**    | 3 rules  | 高级 React 模式，useLatest，init-once     |

**总计：8 个类别共 57 条规则**

---

## 🚀 快速决策树

**你的性能问题是什么？**

```
🐌 页面加载慢 / 交互时间长
  → 阅读第 1 部分：消除瀑布流
  → 阅读第 2 部分：包体积优化

📦 包体积大 (> 200KB)
  → 阅读第 2 部分：包体积优化
  → 检查：动态导入，Barrel 导入，Tree-shaking

🖥️ 服务端渲染 (SSR) 慢
  → 阅读第 3 部分：服务端性能
  → 检查：并行数据获取，流式传输 (Streaming)

🔄 太多重绘 / UI 卡顿
  → 阅读第 5 部分：重绘优化
  → 检查：React.memo, useMemo, useCallback

🎨 渲染性能问题
  → 阅读第 6 部分：渲染性能
  → 检查：虚拟化，布局抖动 (Layout thrashing)

🌐 客户端数据获取问题
  → 阅读第 4 部分：客户端数据获取
  → 检查：SWR 去重，localStorage

✨ 需要高级模式
  → 阅读第 8 部分：高级模式
```

---

## 📊 影响优先级指南

**进行全面优化时，请使用此顺序：**

```
1️⃣ 关键 (CRITICAL) (收益最大 - 首先做):
   ├─ 第 1 部分：消除瀑布流
   │  └─ 每个瀑布流增加完整的网络延迟 (100-500ms+)
   └─ 第 2 部分：包体积优化
      └─ 影响交互时间 (TTI) 和最大内容绘制 (LCP)

2️⃣ 高 (HIGH) (显着影响 - 其次做):
   └─ 第 3 部分：服务端性能
      └─ 消除服务端瀑布流，更快的响应时间

3️⃣ 中 (MEDIUM) (适度收益 - 第三做):
   ├─ 第 4 部分：客户端数据获取
   ├─ 第 5 部分：重绘优化
   └─ 第 6 部分：渲染性能

4️⃣ 低 (LOW) (打磨 - 最后做):
   ├─ 第 7 部分：JavaScript 性能
   └─ 第 8 部分：高级模式
```

---

## 🔗 相关 Skills

| 需求            | Skill                             |
| --------------- | --------------------------------- |
| API 设计模式    | `@[skills/api-patterns]`          |
| 数据库优化      | `@[skills/database-design]`       |
| 测试策略        | `@[skills/testing-patterns]`      |
| UI/UX 设计原则  | `@[skills/frontend-design]`       |
| TypeScript 模式 | `@[skills/typescript-expert]`     |
| 部署与 DevOps   | `@[skills/deployment-procedures]` |

---

## ✅ 性能审查检查清单

发布到生产环境前：

**关键 (必须修复):**

- [ ] 无顺序数据获取 (消除瀑布流)
- [ ] 主包体积 < 200KB
- [ ] 应用代码中无 Barrel 导入
- [ ] 对大型组件使用动态导入
- [ ] 尽可能并行获取数据

**高优先级:**

- [ ] 在适当的地方使用服务端组件 (Server Components)
- [ ] API 路由已优化 (无 N+1 查询)
- [ ] 用于数据获取的 Suspense 边界
- [ ] 尽可能使用静态生成

**中优先级:**

- [ ] 昂贵的计算已 Memoized
- [ ] 列表渲染已虚拟化 (如果 > 100 项)
- [ ] 图像已使用 next/image 优化
- [ ] 无不必要的重绘

**低优先级 (打磨):**

- [ ] 热路径循环已优化
- [ ] RegExp 模式已提升 (Hoisted)
- [ ] 循环中的属性访问已缓存

---

## ❌ 反模式 (常见错误)

**不要 (DON'T):**

- ❌ 对独立操作使用顺序 `await`
- ❌ 当你只需要一个函数时导入整个库
- ❌ 在应用代码中使用 Barrel 导出 (`index.ts` re-exports)
- ❌ 跳过大型组件/库的动态导入
- ❌ 在 useEffect 中获取数据而不去重
- ❌ 忘记 Memoize 昂贵的计算
- ❌ 当服务端组件可以工作时使用客户端组件

**要 (DO):**

- ✅ 使用 `Promise.all()` 并行获取数据
- ✅ 使用动态导入：`const Comp = dynamic(() => import('./Heavy'))`
- ✅ 直接导入：`import { specific } from 'library/specific'`
- ✅ 使用 Suspense 边界以获得更好的 UX
- ✅ 利用 React Server Components
- ✅ 优化前先测量
- ✅ 使用 Next.js 内置优化 (next/image, next/font)

---

## 🎯 如何使用此 Skill

### 对于新功能:

1. 构建时检查 **第 1 和 第 2 部分** (防止瀑布流，保持包体积小)
2. 默认使用服务端组件 (第 3 部分)
3. 对昂贵的操作应用 Memoization (第 5 部分)

### 对于性能审查:

1. 从 **第 1 部分** 开始 (瀑布流 = 最大影响)
2. 然后 **第 2 部分** (包体积)
3. 然后 **第 3 部分** (服务端)
4. 最后根据需要检查其他部分

### 对于调试慢性能:

1. 识别症状 (加载慢，卡顿等)
2. 使用上方的快速决策树
3. 阅读相关部分
4. 按优先级顺序应用修复

---

## 📚 学习路径

**初学者 (专注于关键):**
→ 第 1 部分：消除瀑布流
→ 第 2 部分：包体积优化

**中级 (添加高优先级):**
→ 第 3 部分：服务端性能
→ 第 5 部分：重绘优化

**高级 (完全优化):**
→ 所有部分 + 第 8 部分：高级模式

---

## 🔍 验证脚本

| Script                                 | Purpose        | Command                                                      |
| -------------------------------------- | -------------- | ------------------------------------------------------------ |
| `scripts/react_performance_checker.py` | 自动化性能审计 | `python scripts/react_performance_checker.py <project_path>` |

---

## 📖 章节详情

### 第 1 部分：消除瀑布流 (关键)

**影响:** 每个瀑布流增加 100-500ms+ 延迟
**核心概念:** 并行获取, Promise.all(), Suspense 边界, 预加载

### 第 2 部分：包体积优化 (关键)

**影响:** 直接影响交互时间 (TTI), 最大内容绘制 (LCP)
**核心概念:** 动态导入, Tree-shaking, 避免 Barrel 导入

### 第 3 部分：服务端性能 (高)

**影响:** 更快的服务器响应, 更好的 SEO
**核心概念:** 并行服务端获取, 流式传输, API 路由优化

### 第 4 部分：客户端数据获取 (中高)

**影响:** 减少冗余请求, 更好的 UX
**核心概念:** SWR 去重, localStorage 缓存, 事件监听器

### 第 5 部分：重绘优化 (中)

**影响:** 更流畅的 UI, 更少的浪费计算
**核心概念:** React.memo, useMemo, useCallback, 组件结构

### 第 6 部分：渲染性能 (中)

**影响:** 更好的渲染效率
**核心概念:** 虚拟化, 图像优化, 布局抖动

### 第 7 部分：JavaScript 性能 (低中)

**影响:** 热路径中的增量改进
**核心概念:** 循环优化, 缓存, RegExp 提升

### 第 8 部分：高级模式 (可变)

**影响:** 特定用例
**核心概念:** useLatest hook, init-once 模式, 事件处理程序 refs

---

## 🎓 最佳实践总结 (Best Practices Summary)

**黄金法则:**

1. **先测量** - 使用 React DevTools Profiler, Chrome DevTools
2. **最大影响优先** - 瀑布流 → 包体积 → 服务端 → 微优化
3. **不要过度优化** - 关注真正的瓶颈
4. **使用平台功能** - Next.js 内置了优化
5. **为用户着想** - 真实世界的条件很重要

**性能心态:**

- 序列中的每个 `await` = 潜在的瀑布流
- 每个 `import` = 潜在的包膨胀
- 每次重绘 = 浪费的计算 (如果不必要)
- 服务端组件 = 更少的 JavaScript 发送到客户端
- 测量，不要猜测

---

**来源:** Vercel Engineering
**日期:** January 2026
**版本:** 1.0.0
**总规则:** 8 个类别共 57 条
