---
name: react-best-practices
description: React and Next.js performance optimization from Vercel Engineering. Use when building React components, optimizing performance, eliminating waterfalls, reducing bundle size, reviewing code for performance issues, or implementing server/client-side optimizations.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Next.js & React 性能专家

> **来自 Vercel 工程团队** - 57 条按影响力排序的优化规则
> **哲学:** 首先消除瀑布流，其次优化包体积，最后进行微优化。

---

## 🎯 选择性阅读规则 (强制)

**仅阅读与你任务相关的部分！** 检查下方的内容映射并加载你需要的内容。

> 🔴 **对于性能审查：从关键部分 (1-2) 开始，然后转到高/中优先级。**

---

## 📑 内容映射

| 文件                                    | 影响力                    | 规则  | 何时阅读                                  |
| --------------------------------------- | ------------------------- | ----- | ----------------------------------------- |
| `1-async-eliminating-waterfalls.md`     | 🔴 **关键 (CRITICAL)**    | 5 条  | 页面加载慢, 串行 API 调用, 数据获取瀑布流 |
| `2-bundle-bundle-size-optimization.md`  | 🔴 **关键 (CRITICAL)**    | 5 条  | 包体积大, 交互时间慢, 首屏加载问题        |
| `3-server-server-side-performance.md`   | 🟠 **高 (HIGH)**          | 7 条  | SSR 慢, API 路由优化, 服务端瀑布流        |
| `4-client-client-side-data-fetching.md` | 🟡 **中高 (MEDIUM-HIGH)** | 4 条  | 客户端数据管理, SWR 模式, 去重            |
| `5-rerender-re-render-optimization.md`  | 🟡 **中 (MEDIUM)**        | 12 条 | 过度重新渲染, React 性能, 记忆化          |
| `6-rendering-rendering-performance.md`  | 🟡 **中 (MEDIUM)**        | 9 条  | 渲染瓶颈, 虚拟化, 图片优化                |
| `7-js-javascript-performance.md`        | ⚪ **低中 (LOW-MEDIUM)**  | 12 条 | 微优化, 缓存, 循环性能                    |
| `8-advanced-advanced-patterns.md`       | 🔵 **可变 (VARIABLE)**    | 3 条  | 高级 React 模式, useLatest, init-once     |

**总计：8 个类别中的 57 条规则**

---

## 🚀 快速决策树

**你的性能问题是什么？**

```
🐌 页面加载慢 / 交互时间长
  → 阅读第 1 节：消除瀑布流
  → 阅读第 2 节：包体积优化

📦 包体积大 (> 200KB)
  → 阅读第 2 节：包体积优化
  → 检查：动态导入, 桶导入, 摇树优化 (Tree-shaking)

🖥️ 服务端渲染慢
  → 阅读第 3 节：服务端性能
  → 检查：并行数据获取, 流式传输

🔄 太多重新渲染 / UI 卡顿
  → 阅读第 5 节：重新渲染优化
  → 检查：React.memo, useMemo, useCallback

🎨 渲染性能问题
  → 阅读第 6 节：渲染性能
  → 检查：虚拟化, 布局抖动

🌐 客户端数据获取问题
  → 阅读第 4 节：客户端数据获取
  → 检查：SWR 去重, localStorage

✨ 需要高级模式
  → 阅读第 8 节：高级模式
```

---

## 📊 影响力优先级指南

**在进行全面优化时使用此顺序：**

```
1️⃣ 关键 (CRITICAL) (最大收益 - 先做):
   ├─ 第 1 节：消除瀑布流
   │  └─ 每个瀑布流增加完整的网络延迟 (100-500ms+)
   └─ 第 2 节：包体积优化
      └─ 影响交互时间和最大内容绘制

2️⃣ 高 (HIGH) (显著影响 - 次做):
   └─ 第 3 节：服务端性能
      └─ 消除服务端瀑布流，更快的响应时间

3️⃣ 中 (MEDIUM) (中等收益 - 第三做):
   ├─ 第 4 节：客户端数据获取
   ├─ 第 5 节：重新渲染优化
   └─ 第 6 节：渲染性能

4️⃣ 低 (LOW) (打磨 - 最后做):
   ├─ 第 7 节：JavaScript 性能
   └─ 第 8 节：高级模式
```

---

## 🔗 相关技能

| 需求            | Skill                   |
| --------------- | ----------------------- |
| API 设计模式    | `api-patterns`          |
| 数据库优化      | `database-design`       |
| 测试策略        | `testing-patterns`      |
| UI/UX 设计原则  | `frontend-design`       |
| TypeScript 模式 | `typescript-expert`     |
| 部署与运维      | `deployment-procedures` |

---

## ✅ 性能审查检查清单

发布到生产环境之前：

**关键 (Critical - 必须修复):**

- [ ] 无串行数据获取 (瀑布流已消除)
- [ ] 主包体积 < 200KB
- [ ] 应用代码中无桶导入 (Barrel imports)
- [ ] 大组件使用动态导入
- [ ] 尽可能并行获取数据

**高优先级 (High Priority):**

- [ ] 适当时使用服务端组件
- [ ] API 路由已优化 (无 N+1 查询)
- [ ] 数据获取使用 Suspense 边界
- [ ] 尽可能使用静态生成

**中优先级 (Medium Priority):**

- [ ] 昂贵计算已记忆化
- [ ] 列表渲染已虚拟化 (如果 > 100 项)
- [ ] 使用 next/image 优化图片
- [ ] 无不必要的重新渲染

**低优先级 (Low Priority):**

- [ ] 热路径循环已优化
- [ ] RegExp 模式已提升
- [ ] 循环中缓存属性访问

---

## ❌ 反模式 (常见错误)

**不要 (DON'T):**

- ❌ 对独立操作使用串行 `await`
- ❌ 只需要一个函数时导入整个库
- ❌ 在应用代码中使用桶导出 (`index.ts` re-exports)
- ❌ 大组件/库跳过动态导入
- ❌ 在 useEffect 中获取数据而不去重
- ❌ 忘记记忆化昂贵计算
- ❌ 当服务端组件可行时使用客户端组件

**要 (DO):**

- ✅ 使用 `Promise.all()` 并行获取数据
- ✅ 使用动态导入: `const Comp = dynamic(() => import('./Heavy'))`
- ✅ 直接导入: `import { specific } from 'library/specific'`
- ✅ 使用 Suspense 边界以获得更好的 UX
- ✅ 利用 React 服务端组件
- ✅ 优化前测量性能
- ✅ 使用 Next.js 内置优化 (next/image, next/font)

---

## 🎯 如何使用此技能

### 对于新功能:

1. 构建时检查 **第 1 节 & 第 2 节** (防止瀑布流，保持小包体积)
2. 默认使用服务端组件 (第 3 节)
3. 对昂贵操作应用记忆化 (第 5 节)

### 对于性能审查:

1. 从 **第 1 节** 开始 (瀑布流 = 最大影响)
2. 然后 **第 2 节** (包体积)
3. 然后 **第 3 节** (服务端)
4. 最后根据需要查看其他部分

### 对于调试性能慢:

1. 识别症状 (加载慢，卡顿等)
2. 使用上方的快速决策树
3. 阅读相关部分
4. 按优先级顺序应用修复

---

## 📚 学习路径

**初学者 (关注关键):**
→ 第 1 节：消除瀑布流
→ 第 2 节：包体积优化

**中级 (增加高优先级):**
→ 第 3 节：服务端性能
→ 第 5 节：重新渲染优化

**高级 (全面优化):**
→ 所有部分 + 第 8 节：高级模式

---

## 🔍 验证脚本

| 脚本                                   | 用途           | 命令                                                         |
| -------------------------------------- | -------------- | ------------------------------------------------------------ |
| `scripts/react_performance_checker.py` | 自动化性能审计 | `python scripts/react_performance_checker.py <project_path>` |

---

## 📖 章节详情

### 第 1 节：消除瀑布流 (关键)

**影响:** 每个瀑布流增加 100-500ms+ 延迟
**关键概念:** 并行获取, Promise.all(), Suspense 边界, 预加载

### 第 2 节：包体积优化 (关键)

**影响:** 直接影响交互时间 (TTI) 和最大内容绘制 (LCP)
**关键概念:** 动态导入, 摇树优化, 避免桶导入

### 第 3 节：服务端性能 (高)

**影响:** 更快的服务器响应，更好的 SEO
**关键概念:** 并行服务端获取, 流式传输, API 路由优化

### 第 4 节：客户端数据获取 (中高)

**影响:** 减少冗余请求，更好的 UX
**关键概念:** SWR 去重, localStorage 缓存, 事件监听器

### 第 5 节：重新渲染优化 (中)

**影响:** 更流畅的 UI，更少的浪费计算
**关键概念:** React.memo, useMemo, useCallback, 组件结构

### 第 6 节：渲染性能 (中)

**影响:** 更好的渲染效率
**关键概念:** 虚拟化, 图片优化, 布局抖动

### 第 7 节：JavaScript 性能 (低中)

**影响:** 热路径中的增量改进
**关键概念:** 循环优化, 缓存, RegExp 提升

### 第 8 节：高级模式 (可变)

**影响:** 特定用例
**关键概念:** useLatest hook, 一次初始化模式, 事件处理程序 refs

---

## 🎓 最佳实践总结

**黄金法则:**

1. **先测量 (Measure first)** - 使用 React DevTools Profiler, Chrome DevTools
2. **最大影响优先** - 瀑布流 → 包 → 服务端 → 微优化
3. **不要过度优化** - 关注真正的瓶颈
4. **使用平台特性** - Next.js 内置了优化
5. **考虑用户** - 现实世界条件很重要

**性能心态:**

- 每个串行的 `await` = 潜在的瀑布流
- 每个 `import` = 潜在的包膨胀
- 每个重新渲染 = 浪费的计算 (如果不必要)
- 服务端组件 = 更少发送 JavaScript
- 测量，不要猜测

---

**来源:** Vercel Engineering
**总规则:** 8 个类别中的 57 条规则
