---
name: react-best-practices
description: 来自 Vercel Engineering 的 React 与 Next.js 性能优化规则。适用于构建组件、优化性能、消除瀑布式请求（waterfalls）、缩减 bundle、性能代码审查与服务端/客户端优化实现。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js 与 React 性能专家

> **来自 Vercel Engineering** - 按影响优先级整理的 57 条优化规则  
> **哲学：** 先消除 waterfall，再优化 bundle，最后再做微优化。

---

## 🎯 选择性阅读规则（强制）

**只阅读与当前任务相关的章节！** 先看下面内容地图，再按需加载。

> 🔴 **进行性能评审时：先看 CRITICAL（1-2），再看 HIGH/MEDIUM。**

---

## 📑 内容地图

| 文件                                    | 影响等级            | 规则数 | 阅读时机                                                       |
| --------------------------------------- | ------------------- | ------ | -------------------------------------------------------------- |
| `1-async-eliminating-waterfalls.md`     | 🔴 **CRITICAL**     | 5 条   | 页面加载慢、串行 API 调用、数据获取 waterfall（瀑布式请求）    |
| `2-bundle-bundle-size-optimization.md`  | 🔴 **CRITICAL**     | 5 条   | bundle 体积过大、TTI 慢、首屏加载问题                          |
| `3-server-server-side-performance.md`   | 🟠 **HIGH**         | 7 条   | SSR 缓慢、API Route 优化、服务端 waterfall（瀑布式请求）       |
| `4-client-client-side-data-fetching.md` | 🟡 **MEDIUM-HIGH**  | 4 条   | 客户端数据管理、SWR 模式、请求去重                             |
| `5-rerender-re-render-optimization.md`  | 🟡 **MEDIUM**       | 12 条  | 过度重渲染、React 性能、memoization                            |
| `6-rendering-rendering-performance.md`  | 🟡 **MEDIUM**       | 9 条   | 渲染瓶颈、虚拟列表、图像优化                                   |
| `7-js-javascript-performance.md`        | ⚪ **LOW-MEDIUM**   | 12 条  | 微优化、缓存、循环性能                                         |
| `8-advanced-advanced-patterns.md`       | 🔵 **VARIABLE**     | 3 条   | 高级 React 模式、useLatest、init-once                          |

**总计：8 大类，共 57 条规则**

---

## 🚀 快速决策树

**你的性能问题属于哪一类？**

```
🐌 页面加载慢 / 可交互时间（Time to Interactive，TTI）长
  → 阅读第 1 节：消除瀑布式请求（Eliminating Waterfalls）
  → 阅读第 2 节：包体积优化（Bundle Size Optimization）

📦 bundle 体积过大（> 200KB）
  → 阅读第 2 节：包体积优化（Bundle Size Optimization）
  → 检查：动态导入（dynamic imports）、桶文件导入（barrel imports）、tree-shaking

🖥️ 服务端渲染慢（SSR）
  → 阅读第 3 节：服务端性能（Server-Side Performance）
  → 检查：并行数据获取、streaming

🔄 重渲染过多 / UI 卡顿
  → 阅读第 5 节：重渲染优化（Re-render Optimization）
  → 检查：React.memo、useMemo、useCallback

🎨 渲染性能问题
  → 阅读第 6 节：渲染性能（Rendering Performance）
  → 检查：虚拟化、layout thrashing

🌐 客户端数据获取问题
  → 阅读第 4 节：客户端数据获取（Client-Side Data Fetching）
  → 检查：SWR 去重（deduplication）、localStorage

✨ 需要高级模式
  → 阅读第 8 节：高级模式（Advanced Patterns）
```

---

## 📊 影响优先级指南

**进行全量优化时，按以下顺序：**

```
1️⃣ CRITICAL（收益最大，先做）：
   ├─ 第 1 节：消除瀑布式请求（Eliminating Waterfalls）
   │  └─ 每个 waterfall 都会引入完整网络延迟（100-500ms+）
   └─ 第 2 节：包体积优化（Bundle Size Optimization）
      └─ 直接影响可交互时间（Time to Interactive）与最大内容绘制（LCP）

2️⃣ HIGH（显著收益，第二步）：
   └─ 第 3 节：服务端性能（Server-Side Performance）
      └─ 消除服务端 waterfall，提升响应速度

3️⃣ MEDIUM（中等收益，第三步）：
   ├─ 第 4 节：客户端数据获取（Client-Side Data Fetching）
   ├─ 第 5 节：重渲染优化（Re-render Optimization）
   └─ 第 6 节：渲染性能（Rendering Performance）

4️⃣ LOW（打磨项，最后做）：
   ├─ 第 7 节：JavaScript 性能（JavaScript Performance）
   └─ 第 8 节：高级模式（Advanced Patterns）
```

---

## 🔗 相关技能

| 需求                    | 技能                              |
| ----------------------- | --------------------------------- |
| API 设计模式            | `@[skills/api-patterns]`          |
| 数据库优化              | `@[skills/database-design]`       |
| 测试策略                | `@[skills/testing-patterns]`      |
| UI/UX 设计原则          | `@[skills/frontend-design]`       |
| TypeScript 模式         | `@[skills/typescript-expert]`     |
| 部署与 DevOps           | `@[skills/deployment-procedures]` |

---

## ✅ 性能评审清单

上线前检查：

**Critical（必须修复）：**

- [ ] 无串行数据获取（waterfall 瀑布式请求已消除）
- [ ] 主 bundle（包）< 200KB
- [ ] 应用代码中无 barrel imports（桶文件导入）
- [ ] 大组件已使用动态导入（dynamic imports）
- [ ] 可并行的数据获取已并行化

**High Priority（高优先级）：**

- [ ] 合适场景使用 Server Components（服务端组件）
- [ ] API Routes（接口路由）已优化（无 N+1 查询）
- [ ] 数据获取路径配置了 Suspense（挂起）边界
- [ ] 可静态生成内容已采用 SSG（静态生成）

**Medium Priority（中优先级）：**

- [ ] 高开销计算已 memoize（记忆化）
- [ ] 大列表（>100 项）已虚拟化
- [ ] 图片通过 `next/image` 优化
- [ ] 无不必要重渲染

**Low Priority（打磨）：**

- [ ] 热路径循环已优化
- [ ] RegExp 已提升至循环外
- [ ] 循环内属性访问已缓存

---

## ❌ 反模式

**不要这样做（DON'T）：**

- ❌ 对互不依赖任务使用串行 `await`
- ❌ 只用一个函数却导入整个库
- ❌ 在应用代码中使用 barrel exports（`index.ts` 重导出）
- ❌ 大组件/大库不做动态导入（dynamic imports）
- ❌ `useEffect` 拉数据却不做去重
- ❌ 高开销计算不做 memoization（记忆化）
- ❌ 本可用 server component 却硬用 client component

**推荐做法（DO）：**

- ✅ 使用 `Promise.all()` 并行获取数据
- ✅ 使用动态导入：`const Comp = dynamic(() => import('./Heavy'))`
- ✅ 精确导入：`import { specific } from 'library/specific'`
- ✅ 用 Suspense（挂起）边界提升体验
- ✅ 利用 React Server Components（服务端组件）
- ✅ 优化前先测量
- ✅ 使用 Next.js 内建优化（`next/image`、`next/font`）

---

## 🎯 如何使用本技能

### 新功能开发场景：

1. 开发阶段优先检查 **Section 1 & 2**（预防 waterfall 瀑布式请求，控制 bundle 包体积）
2. 默认优先考虑 server components（服务端组件，Section 3）
3. 对高开销操作应用 memoization（记忆化，Section 5）

### 性能评审场景：

1. 从 **Section 1** 开始（waterfall 影响最大）
2. 再看 **Section 2**（bundle 体积）
3. 再看 **Section 3**（服务端性能）
4. 最后按需补充其他章节

### 慢性能排障场景：

1. 先识别症状（慢加载、卡顿等）
2. 使用上方快速决策树
3. 阅读对应章节
4. 按优先级顺序落地修复

---

## 📚 学习路径

**初级（先抓关键）：**  
→ 第 1 节：消除瀑布式请求（Eliminating Waterfalls）  
→ 第 2 节：包体积优化（Bundle Size Optimization）

**中级（补齐高优先级）：**  
→ 第 3 节：服务端性能（Server-Side Performance）  
→ 第 5 节：重渲染优化（Re-render Optimization）

**高级（全量优化）：**  
→ 全章节 + 第 8 节：高级模式（Advanced Patterns）

---

## 🔍 验证脚本

| 脚本                                   | 用途                        | 执行命令                                                     |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------ |
| `scripts/react_performance_checker.py` | 自动化性能审计              | `python scripts/react_performance_checker.py <project_path>` |

---

## 📖 章节说明

### 第 1 节：消除瀑布式请求（CRITICAL）

**影响：** 每个 waterfall（瀑布式请求）会增加 100-500ms+ 延迟  
**关键概念：** 并行获取、`Promise.all()`、Suspense 边界、预加载

### 第 2 节：包体积优化（CRITICAL）

**影响：** 直接影响 TTI（可交互时间）、LCP（最大内容绘制）  
**关键概念：** 动态导入、tree-shaking（摇树优化）、避免 barrel imports（桶文件导入）

### 第 3 节：服务端性能（HIGH）

**影响：** 更快服务端响应、更好 SEO  
**关键概念：** 服务端并行获取、streaming、API Route（接口路由）优化

### 第 4 节：客户端数据获取（MEDIUM-HIGH）

**影响：** 减少冗余请求、提升 UX（用户体验）  
**关键概念：** SWR 去重、localStorage 缓存、事件监听

### 第 5 节：重渲染优化（MEDIUM）

**影响：** UI 更流畅、减少无效计算  
**关键概念：** `React.memo`、`useMemo`、`useCallback`、组件结构

### 第 6 节：渲染性能（MEDIUM）

**影响：** 提升渲染效率  
**关键概念：** 虚拟化、图像优化、layout thrashing（布局抖动）

### 第 7 节：JavaScript 性能（LOW-MEDIUM）

**影响：** 热路径增量优化  
**关键概念：** 循环优化、缓存、RegExp 提升

### 第 8 节：高级模式（VARIABLE）

**影响：** 特定场景收益明显  
**关键概念：** `useLatest` hook（钩子）、init-once 模式、event handler refs（事件处理引用）

---

## 🎓 最佳实践总结

**黄金法则：**

1. **先测量再优化** - 使用 React DevTools Profiler、Chrome DevTools
2. **先做高收益项** - Waterfalls（瀑布式请求）→ Bundle（包体积）→ Server（服务端）→ Micro（微优化）
3. **避免过度优化** - 聚焦真实瓶颈
4. **善用平台能力** - Next.js 内建大量优化
5. **关注真实用户环境** - 不是只看本机结果

**性能思维：**

- 串行 `await` 可能就是 waterfall（瀑布式请求）
- 每个 `import` 都可能引入 bundle（包体积）膨胀
- 每次无意义重渲染都是浪费
- server components（服务端组件）能减少下发 JS
- 用数据说话，不靠猜测

---

**来源：** Vercel Engineering  
**日期：** 2026 年 1 月  
**版本：** 1.0.0  
**规则总数：** 57 条，分 8 大类
