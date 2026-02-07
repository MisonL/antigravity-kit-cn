---
name: react-best-practices
description: React and Next.js performance optimization from Vercel Engineering. Use when building React components, optimizing performance, eliminating waterfalls, reducing bundle size, reviewing code for performance issues, or implementing server/client-side optimizations.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js & React 性能专家 (Next.js & React Performance Expert)

> **来自 Vercel 工程团队 (From Vercel Engineering)** - 57 条按影响力排序的优化规则
> **哲学 (Philosophy):** 首先消除瀑布流，其次优化包体积，通过再进行微优化。

---

## 🎯 选择性阅读规则 (强制) - Selective Reading Rule (MANDATORY)

**仅阅读与你任务相关的部分！(Read ONLY sections relevant to your task!)** 检查下方的内容映射并加载你需要的内容。

> 🔴 **对于性能审查：从关键部分 (1-2) 开始，然后转到高/中优先级。**

---

## 📑 内容映射 (Content Map)

| 文件                                    | 影响力                    | 规则     | 何时阅读                                                                                                      |
| --------------------------------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `1-async-eliminating-waterfalls.md`     | 🔴 **CRITICAL (关键)**    | 5 rules  | Slow page loads (页面加载慢), sequential API calls (串行 API 调用), data fetching waterfalls (数据获取瀑布流) |
| `2-bundle-bundle-size-optimization.md`  | 🔴 **CRITICAL (关键)**    | 5 rules  | Large bundle size (包体积大), slow Time to Interactive (交互时间慢), First Load issues (首屏加载问题)         |
| `3-server-server-side-performance.md`   | 🟠 **HIGH (高)**          | 7 rules  | Slow SSR (SSR 慢), API route optimization (API 路由优化), server-side waterfalls (服务端瀑布流)               |
| `4-client-client-side-data-fetching.md` | 🟡 **MEDIUM-HIGH (中高)** | 4 rules  | Client data management (客户端数据管理), SWR patterns (SWR 模式), deduplication (去重)                        |
| `5-rerender-re-render-optimization.md`  | 🟡 **MEDIUM (中)**        | 12 rules | Excessive re-renders (过度重新渲染), React performance (React 性能), memoization (记忆化)                     |
| `6-rendering-rendering-performance.md`  | 🟡 **MEDIUM (中)**        | 9 rules  | Rendering bottlenecks (渲染瓶颈), virtualization (虚拟化), image optimization (图片优化)                      |
| `7-js-javascript-performance.md`        | ⚪ **LOW-MEDIUM (低中)**  | 12 rules | Micro-optimizations (微优化), caching (缓存), loop performance (循环性能)                                     |
| `8-advanced-advanced-patterns.md`       | 🔵 **VARIABLE (可变)**    | 3 rules  | Advanced React patterns (高级 React 模式), useLatest, init-once                                               |

**总计：8 个类别中的 57 条规则 (Total: 57 rules across 8 categories)**

---

## 🚀 快速决策树 (Quick Decision Tree)

**你的性能问题是什么？**

```
🐌 Slow page loads / Long Time to Interactive (页面加载慢 / 交互时间长)
  → Read Section 1: Eliminating Waterfalls (消除瀑布流)
  → Read Section 2: Bundle Size Optimization (包体积优化)

📦 Large bundle size (> 200KB) (包体积大 (> 200KB))
  → Read Section 2: Bundle Size Optimization (包体积优化)
  → Check: Dynamic imports (动态导入), barrel imports (桶导入), tree-shaking (摇树优化)

🖥️ Slow Server-Side Rendering (服务端渲染慢)
  → Read Section 3: Server-Side Performance (服务端性能)
  → Check: Parallel data fetching (并行数据获取), streaming (流式传输)

🔄 Too many re-renders / UI lag (太多重新渲染 / UI 卡顿)
  → Read Section 5: Re-render Optimization (重新渲染优化)
  → Check: React.memo, useMemo, useCallback

🎨 Rendering performance issues (渲染性能问题)
  → Read Section 6: Rendering Performance (渲染性能)
  → Check: Virtualization (虚拟化), layout thrashing (布局抖动)

🌐 Client-side data fetching problems (客户端数据获取问题)
  → Read Section 4: Client-Side Data Fetching (客户端数据获取)
  → Check: SWR deduplication (SWR 去重), localStorage

✨ Need advanced patterns (需要高级模式)
  → Read Section 8: Advanced Patterns (高级模式)
```

---

## 📊 影响力优先级指南 (Impact Priority Guide)

**在进行全面优化时使用此顺序：**

```
1️⃣ CRITICAL (关键) (Biggest Gains - Do First / 最大收益 - 先做):
   ├─ Section 1: Eliminating Waterfalls (消除瀑布流)
   │  └─ Each waterfall adds full network latency (100-500ms+) (每个瀑布流增加完整的网络延迟)
   └─ Section 2: Bundle Size Optimization (包体积优化)
      └─ Affects Time to Interactive and Largest Contentful Paint (影响交互时间和最大内容绘制)

2️⃣ HIGH (高) (Significant Impact - Do Second / 显著影响 - 次做):
   └─ Section 3: Server-Side Performance (服务端性能)
      └─ Eliminates server-side waterfalls, faster response times (消除服务端瀑布流，更快的响应时间)

3️⃣ MEDIUM (中) (Moderate Gains - Do Third / 中等收益 - 第三做):
   ├─ Section 4: Client-Side Data Fetching (客户端数据获取)
   ├─ Section 5: Re-render Optimization (重新渲染优化)
   └─ Section 6: Rendering Performance (渲染性能)

4️⃣ LOW (低) (Polish - Do Last / 打磨 - 最后做):
   ├─ Section 7: JavaScript Performance (JavaScript 性能)
   └─ Section 8: Advanced Patterns (高级模式)
```

---

## 🔗 相关 Skill (Related Skills)

| 需求                                     | Skill                             |
| ---------------------------------------- | --------------------------------- |
| API design patterns (API 设计模式)       | `@[skills/api-patterns]`          |
| Database optimization (数据库优化)       | `@[skills/database-design]`       |
| Testing strategies (测试策略)            | `@[skills/testing-patterns]`      |
| UI/UX design principles (UI/UX 设计原则) | `@[skills/frontend-design]`       |
| TypeScript patterns (TypeScript 模式)    | `@[skills/typescript-expert]`     |
| Deployment & DevOps (部署与运维)         | `@[skills/deployment-procedures]` |

---

## ✅ 性能审查检查清单 (Performance Review Checklist)

发布到生产环境之前：

**Critical (关键 - 必须修复):**

- [ ] No sequential data fetching (无串行数据获取) (waterfalls eliminated/瀑布流已消除)
- [ ] Bundle size < 200KB for main bundle (主包体积 < 200KB)
- [ ] No barrel imports in app code (应用代码中无桶导入)
- [ ] Dynamic imports used for large components (大组件使用动态导入)
- [ ] Parallel data fetching where possible (尽可能并行获取数据)

**High Priority (高优先级):**

- [ ] Server components used where appropriate (适当时使用服务端组件)
- [ ] API routes optimized (no N+1 queries) (API 路由已优化 (无 N+1 查询))
- [ ] Suspense boundaries for data fetching (数据获取使用 Suspense 边界)
- [ ] Static generation used where possible (尽可能使用静态生成)

**Medium Priority (中优先级):**

- [ ] Expensive computations memoized (昂贵计算已记忆化)
- [ ] List rendering virtualized (if > 100 items) (列表渲染已虚拟化 (如果 > 100 项))
- [ ] Images optimized with next/image (使用 next/image 优化图片)
- [ ] No unnecessary re-renders (无不必要的重新渲染)

**Low Priority (Polish) (低优先级 - 打磨):**

- [ ] Hot path loops optimized (热路径循环已优化)
- [ ] RegExp patterns hoisted (RegExp 模式已提升)
- [ ] Property access cached in loops (循环中缓存属性访问)

---

## ❌ 反模式 (常见错误) - Anti-Patterns (Common Mistakes)

**DON'T (不要):**

- ❌ Use sequential `await` for independent operations (对独立操作使用串行 `await`)
- ❌ Import entire libraries when you need one function (只需要一个函数时导入整个库)
- ❌ Use barrel exports (`index.ts` re-exports) in app code (在应用代码中使用桶导出)
- ❌ Skip dynamic imports for large components/libraries (大组件/库跳过动态导入)
- ❌ Fetch data in useEffect without deduplication (在 useEffect 中获取数据而不去重)
- ❌ Forget to memoize expensive computations (忘记记忆化昂贵计算)
- ❌ Use client components when server components work (当服务端组件可行时使用客户端组件)

**DO (要):**

- ✅ Fetch data in parallel with `Promise.all()` (使用 `Promise.all()` 并行获取数据)
- ✅ Use dynamic imports (使用动态导入): `const Comp = dynamic(() => import('./Heavy'))`
- ✅ Import directly (直接导入): `import { specific } from 'library/specific'`
- ✅ Use Suspense boundaries for better UX (使用 Suspense 边界以获得更好的 UX)
- ✅ Leverage React Server Components (利用 React 服务端组件)
- ✅ Measure performance before optimizing (优化前测量性能)
- ✅ Use Next.js built-in optimizations (next/image, next/font) (使用 Next.js 内置优化)

---

## 🎯 如何使用此技能 (How to Use This Skill)

### 对于新功能 (For New Features):

1. 构建时检查 **Section 1 & 2** (防止瀑布流，保持小包体积)
2. 默认使用服务端组件 (Section 3)
3. 对昂贵操作应用记忆化 (Section 5)

### 对于性能审查 (For Performance Reviews):

1. 从 **Section 1** 开始 (瀑布流 = 最大影响)
2. 然后 **Section 2** (包体积)
3. 然后 **Section 3** (服务端)
4. 最后根据需要查看其他部分

### 对于调试性能慢 (For Debugging Slow Performance):

1. 识别症状 (加载慢，卡顿等)
2. 使用上方的快速决策树
3. 阅读相关部分
4. 按优先级顺序应用修复

---

## 📚 学习路径 (Learning Path)

**Beginner (初学者) (Focus on Critical/关注关键):**
→ Section 1: Eliminating Waterfalls (消除瀑布流)
→ Section 2: Bundle Size Optimization (包体积优化)

**Intermediate (中级) (Add High Priority/增加高优先级):**
→ Section 3: Server-Side Performance (服务端性能)
→ Section 5: Re-render Optimization (重新渲染优化)

**Advanced (高级) (Full Optimization/全面优化):**
→ All sections + Section 8: Advanced Patterns (所有部分 + 高级模式)

---

## 🔍 验证脚本 (Validation Script)

| 脚本                                   | 用途                                         | 命令                                                         |
| -------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `scripts/react_performance_checker.py` | Automated performance audit (自动化性能审计) | `python scripts/react_performance_checker.py <project_path>` |

---

## 📖 章节详情 (Section Details)

### Section 1: Eliminating Waterfalls (CRITICAL) - 消除瀑布流 (关键)

**Impact (影响):** Each waterfall adds 100-500ms+ latency (每个瀑布流增加 100-500ms+ 延迟)
**Key Concepts (关键概念):** Parallel fetching (并行获取), Promise.all(), Suspense boundaries (Suspense 边界), preloading (预加载)

### Section 2: Bundle Size Optimization (CRITICAL) - 包体积优化 (关键)

**Impact (影响):** Directly affects Time to Interactive, Largest Contentful Paint (直接影响交互时间和最大内容绘制)
**Key Concepts (关键概念):** Dynamic imports (动态导入), tree-shaking (摇树优化), barrel import avoidance (避免桶导入)

### Section 3: Server-Side Performance (HIGH) - 服务端性能 (高)

**Impact (影响):** Faster server responses, better SEO (更快的服务器响应，更好的 SEO)
**Key Concepts (关键概念):** Parallel server fetching (并行服务端获取), streaming (流式传输), API route optimization (API 路由优化)

### Section 4: Client-Side Data Fetching (MEDIUM-HIGH) - 客户端数据获取 (中高)

**Impact (影响):** Reduces redundant requests, better UX (减少冗余请求，更好的 UX)
**Key Concepts (关键概念):** SWR deduplication (SWR 去重), localStorage caching (localStorage 缓存), event listeners (事件监听器)

### Section 5: Re-render Optimization (MEDIUM) - 重新渲染优化 (中)

**Impact (影响):** Smoother UI, less wasted computation (更流畅的 UI，更少的浪费计算)
**Key Concepts (关键概念):** React.memo, useMemo, useCallback, component structure (组件结构)

### Section 6: Rendering Performance (MEDIUM) - 渲染性能 (中)

**Impact (影响):** Better rendering efficiency (更好的渲染效率)
**Key Concepts (关键概念):** Virtualization (虚拟化), image optimization (图片优化), layout thrashing (布局抖动)

### Section 7: JavaScript Performance (LOW-MEDIUM) - JavaScript 性能 (低中)

**Impact (影响):** Incremental improvements in hot paths (热路径中的增量改进)
**Key Concepts (关键概念):** Loop optimization (循环优化), caching (缓存), RegExp hoisting (RegExp 提升)

### Section 8: Advanced Patterns (VARIABLE) - 高级模式 (可变)

**Impact (影响):** Specific use cases (特定用例)
**Key Concepts (关键概念):** useLatest hook, init-once patterns (一次初始化模式), event handler refs (事件处理程序 refs)

---

## 🎓 最佳实践总结 (Best Practices Summary)

**黄金法则 (Golden Rules):**

1. **Measure first (先测量)** - Use React DevTools Profiler, Chrome DevTools
2. **Biggest impact first (最大影响优先)** - Waterfalls → Bundle → Server → Micro (瀑布流 → 包 → 服务端 → 微优化)
3. **Don't over-optimize (不要过度优化)** - Focus on real bottlenecks (关注真正的瓶颈)
4. **Use platform features (使用平台特性)** - Next.js has optimizations built-in (Next.js 内置了优化)
5. **Think about users (考虑用户)** - Real-world conditions matter (现实世界条件很重要)

**性能心态 (Performance Mindset):**

- Every `await` in sequence = potential waterfall (每个串行的 `await` = 潜在的瀑布流)
- Every `import` = potential bundle bloat (每个 `import` = 潜在的包膨胀)
- Every re-render = wasted computation (if unnecessary) (每个重新渲染 = 浪费的计算 (如果不必要))
- Server components = less JavaScript to ship (服务端组件 = 更少发送 JavaScript)
- Measure, don't guess (测量，不要猜测)

---

**Source:** Vercel Engineering
**Date:** January 2026
**Version:** 1.0.0
**Total Rules:** 57 across 8 categories (8 个类别中的 57 条规则)
