---
name: react-best-practices
description: 来自 Vercel 工程团队的 React 和 Next.js 性能优化指南。在构建 React 组件、优化性能、消除瀑布流、减小包体积、进行代码审计或实施服务端/客户端优化时使用。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js & React 性能专家 (Next.js & React Performance Expert)

> **源自 Vercel 工程团队** - 按影响力排列的 57 条性能优化准则。
> **核心哲学：** 优先消除瀑布流 (Waterfalls)，其次优化包体积 (Bundles)，最后进行微观调优。

---

## 🎯 选择性阅读准则 (必读)

**仅阅读与当前任务相关的章节！** 请查阅下方的目录地图并加载所需内容。

> 🔴 **进行性能审计时：请从“关键 (CRITICAL)”章节 (1-2) 开始，随后推进至高/中优先级。**

---

## 📑 内容地图 (Content Map)

| 文件                                    | 影响力                    | 规则数 | 阅读时机                                           |
| --------------------------------------- | ------------------------- | ------ | -------------------------------------------------- |
| `1-async-eliminating-waterfalls.md`     | 🔴 **关键 (CRITICAL)**    | 5 条   | 页面加载慢、API 顺序调用、数据请求瀑布流           |
| `2-bundle-bundle-size-optimization.md`  | 🔴 **关键 (CRITICAL)**    | 5 条   | 包体积过大、TTI (可交互时间) 慢、首屏加载问题      |
| `3-server-server-side-performance.md`   | 🟠 **高 (HIGH)**          | 7 条   | SSR 缓慢、API 路由优化、服务端瀑布流               |
| `4-client-client-side-data-fetching.md` | 🟡 **中高 (MEDIUM-HIGH)** | 4 条   | 客户端数据管理、SWR 模式、数据去重                 |
| `5-rerender-re-render-optimization.md`  | 🟡 **中 (MEDIUM)**        | 12 条  | 过度重新渲染、React 性能分析、记忆化 (Memoization) |
| `6-rendering-rendering-performance.md`  | 🟡 **中 (MEDIUM)**        | 9 条   | 渲染瓶颈、虚拟化、图像优化                         |
| `7-js-javascript-performance.md`        | ⚪ **低中 (LOW-MEDIUM)**  | 12 条  | 微观优化、缓存、循环性能                           |
| `8-advanced-advanced-patterns.md`       | 🔵 **不确定 (VARIABLE)**  | 3 条   | 进阶 React 模式、useLatest、单次初始化             |

**总计：涵盖 8 个类别的 57 条准则**

---

## 🚀 决策决策树 (Quick Decision Tree)

**您正面临哪类性能问题？**

```
🐌 页面加载缓慢 / TTI (可交互时间) 过长
  → 查阅第 1 节：消除瀑布流 (Eliminating Waterfalls)
  → 查阅第 2 节：包体积优化 (Bundle Size Optimization)

📦 打包体积过大 (> 200KB)
  → 查阅第 2 节：包体积优化 (Bundle Size Optimization)
  → 检查点：动态导入 (Dynamic imports)、桶文件导入 (Barrel imports)、摇树优化 (Tree-shaking)

🖥️ 服务端渲染 (SSR) 缓慢
  → 查阅第 3 节：服务端性能优化 (Server-Side Performance)
  → 检查点：并行数据请求、流式传输 (Streaming)

🔄 过多的重新渲染 / UI 响应卡顿
  → 查阅第 5 节：重新渲染优化 (Re-render Optimization)
  → 检查点：React.memo, useMemo, useCallback

🎨 渲染性能瓶颈
  → 查阅第 6 节：渲染性能优化 (Rendering Performance)
  → 检查点：列表虚拟化、布局抖动 (Layout thrashing)

🌐 客户端数据请求问题
  → 查阅第 4 节：客户端数据获取 (Client-Side Data Fetching)
  → 检查点：SWR 去重、localStorage 缓存

✨ 需要进阶模式
  → 查阅第 8 节：进阶模式 (Advanced Patterns)
```

---

## 📊 影响力优先级指南

**执行全面优化时的推荐顺序：**

```
1️⃣ 关键 (CRITICAL) (收益最大 - 优先执行):
   ├─ 第 1 节：消除瀑布流
   │  └─ 每个瀑布流都会增加完整的网络延迟 (100-500ms+)
   └─ 第 2 节：包体积优化
      └─ 直接影响 TTI (可交互时间) 和 LCP (最大内容渲染)

2️⃣ 高 (HIGH) (影响显著 - 其次执行):
   └─ 第 3 节：服务端性能优化
      └─ 消除服务端瀑布流，提升响应速度

3️⃣ 中 (MEDIUM) (收益适中 - 第三步执行):
   ├─ 第 4 节：客户端数据获取
   ├─ 第 5 节：重新渲染优化
   └─ 第 6 节：渲染性能优化

4️⃣ 低 (LOW) (细节抛光 - 最后执行):
   ├─ 第 7 节：JavaScript 性能调优
   └─ 第 8 节：进阶模式
```

---

## ✅ 性能复查检查清单 (Must Fix before Production)

### 关键 (Critical) - 必须修复：

- [ ] 消除顺序数据请求（消除所有瀑布流）。
- [ ] 主包体积控制在 200KB 以内。
- [ ] 应用代码中严禁使用桶文件 (Barrel) 导入。
- [ ] 为大型组件使用动态导入 (Dynamic imports)。
- [ ] 尽可能实现并行数据请求。

### 高优先级：

- [ ] 在合适场景优先使用服务端组件 (Server Components)。
- [ ] API 路由经过优化（严禁 N+1 查询）。
- [ ] 为数据请求设置 Suspense 边界。
- [ ] 尽可能利用静态生成 (Static generation)。

---

## ❌ 应避免的反模式 (Anti-Patterns)

### 严禁行为 (DON'T):

- ❌ 对相互独立的异步操作使用顺序 `await`。
- ❌ 仅为了一个函数而导入整个库。
- ❌ 在应用代码中使用桶文件导出 (`index.ts` 重新导出)。
- ❌ 忽略大型组件或库的动态导入。
- ❌ 在 `useEffect` 中进行未去重的数据请求。
- ❌ 忘记对昂贵的计算任务进行记忆化 (Memoize)。
- ❌ 在服务端组件可胜任时过度使用客户端组件。

### 推荐做法 (DO):

- ✅ 使用 `Promise.all()` 实现并行请求。
- ✅ 使用动态导入：`const Comp = dynamic(() => import('./Heavy'))`。
- ✅ 采用直接导入：`import { specific } from 'library/specific'`。
- ✅ 利用 Suspense 边界提升交互体验。
- ✅ 充分发挥 React Server Components (RSC) 的优势。
- ✅ 在开始优化前先进行性能测量。
- ✅ 使用 Next.js 原生优化组件 (next/image, next/font)。

---

## 🔍 验证脚本 (Validation Script)

| 脚本                                   | 用途           | 执行命令                                                 |
| -------------------------------------- | -------------- | -------------------------------------------------------- |
| `scripts/react_performance_checker.py` | 自动化性能审计 | `python scripts/react_performance_checker.py <项目路径>` |

---

## 📖 章节核心详情 (Section Details)

### 第 1 节：消除瀑布流 (关键)

**核心：** 每个瀑布流增加 100-500ms+ 延迟。关注：并行获取、Promise.all()、Suspense 边界、预加载。

### 第 2 节：包体积优化 (关键)

**核心：** 直接影响 TTI 和 LCP。关注：动态导入、摇树优化、规避桶文件导入。

### 第 3 节：服务端性能优化 (高)

**核心：** 提升服务端响应速度与 SEO。关注：并行服务端获取、流式传输、API 路由优化。

### 第 4 节：客户端数据获取 (中高)

**核心：** 减少冗余请求，提升 UX。关注：SWR 去重、localStorage 缓存、事件监听器管理。

### 第 5 节：重新渲染优化 (中)

**核心：** 界面流畅度提升。关注：React.memo, useMemo, useCallback, 组件结构优化。

---

## 🎓 最佳实践总结

**黄金法则：**

1. **先测量，后行动** —— 使用 React DevTools Profiler, Chrome DevTools。
2. **抓大放小** —— 瀑布流 → 包体积 → 服务端 → 微观调优。
3. **避免过度优化** —— 聚焦于真实的性能瓶颈。
4. **利用平台原生特性** —— 充分挖掘 Next.js 内置的优化能力。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/nextjs-react-expert/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/nextjs-react-expert/SKILL.md`。
- **注意**：文档层不应替代 React 开发流水线；仅在此定义 Vercel 性能准则。
