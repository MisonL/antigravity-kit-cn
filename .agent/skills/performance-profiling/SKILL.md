---
name: performance-profiling
description: 性能分析原则。测量、分析与优化技术。
allowed-tools: Read, Glob, Grep, Bash
---

# 性能分析 (Performance Profiling)

> 测量、分析、优化 —— 严格按此顺序进行。

## 🔧 运行脚本 (Runtime Scripts)

**用于自动化性能审计：**

| 脚本                          | 目的                | 用法                                                     |
| ----------------------------- | ------------------- | -------------------------------------------------------- |
| `scripts/lighthouse_audit.py` | Lighthouse 性能审计 | `python scripts/lighthouse_audit.py https://example.com` |

---

## 1. 核心 Web 指标 (Core Web Vitals)

### 目标值 (Targets)

| 指标                     | 优秀 (Good) | 较差 (Poor) | 衡量维度   |
| ------------------------ | ----------- | ----------- | ---------- |
| **LCP** (最大内容绘制)   | < 2.5s      | > 4.0s      | 加载速度   |
| **INP** (交互到下次绘制) | < 200ms     | > 500ms     | 交互响应   |
| **CLS** (累计布局偏移)   | < 0.1       | > 0.25      | 视觉稳定性 |

---

## 2. 分析工作流 (Profiling Workflow)

### 四步走

1. **基准测试 (BASELINE)** → 测量当前状态。
2. **定位瓶颈 (IDENTIFY)** → 找出性能卡点。
3. **针对性修复 (FIX)** → 执行精准的优化。
4. **验证结果 (VALIDATE)** → 确认性能是否提升。

### 工具选择建议

- **页面加载**: Lighthouse
- **包体积**: 各种 Bundle Analyzer 工具
- **运行时性能**: Chrome DevTools Performance 面板
- **内存占用**: Chrome DevTools Memory 面板
- **网络分析**: Chrome DevTools Network 面板

---

## 3. 包体积分析 (Bundle Analysis)

### 注意事项

- **庞大的依赖**: 出现在包顶部的重型库。
- **重复代码**: 多个分片 (Chunks) 中包含相同内容。
- **冗余代码**: 覆盖率低的代码。
- **缺失分片**: 整个应用打包成一个巨大的文件。

---

## 4. 运行时分析 (Runtime Profiling)

- **Performance 面板**: 寻找超过 50ms 的长任务 (Long tasks)，它们会阻塞 UI 响应。
- **Memory 面板**: 观察堆内存 (Heap) 是否持续增长，以此识别潜在的泄露。

---

## 5. 常见的性能瓶颈 (Common Bottlenecks)

- **初次加载慢**: JS 体积过大，存在阻塞渲染的 CSS。
- **交互迟钝**: 事件处理逻辑过于沉重。
- **滚动卡顿**: 布局抖动 (Layout thrashing)。

---

## 6. 高优先级“速赢”方案 (Quick Wins)

1. **启用压缩** (Brotli/Gzip) —— 收益：极高。
2. **图像懒加载** —— 收益：极高。
3. **路由级代码拆分** —— 收益：极高。
4. **缓存静态资源** —— 收益：中。
5. **优化图像体积** —— 收益：中。

---

## 7. 反模式 (Anti-Patterns)

- ❌ **全凭猜测**: 在没有数据支撑的情况下就开始优化。
- ❌ **微优化**: 纠结于细枝末节，却忽略了最大的性能短板。
- ❌ **过早优化**: 在逻辑尚未稳定前就追求极致性能。

---

> **记住：** 最快的代码是不运行的代码。在尝试优化之前，先考虑能否移除。
