---
description: 性能分析原则、Lighthouse 指标优化与 Bundle 分析
---

# 性能分析 (Performance Profiling)

## 核心指标 (Web Vitals)

1.  **LCP (Largest Contentful Paint)**: 最大内容渲染时间。
    - 目标: < 2.5s
    - 优化: 预加载关键图片，优化服务器响应 (TTFB)。

2.  **INP (Interaction to Next Paint)**: 交互响应延迟。
    - 目标: < 200ms
    - 优化: 减少主线程阻塞，使用 `useTransition`。

3.  **CLS (Cumulative Layout Shift)**: 累积布局偏移。
    - 目标: < 0.1
    - 优化: 给图片/视频设定明确的宽高。

## 分析工具

1.  **Chrome User Performance**:
    - 记录 Performance Profile。
    - 查找 "长任务" (Long Tasks, >50ms)。

2.  **Bundle Analysis**:
    - `webpack-bundle-analyzer` 或 `rollup-plugin-visualizer`。
    - 检查是否有意外引入的大库 (如整个 lodash, moment.js)。

## 优化策略 (RAIL 模型)

- **R**esponse: < 100ms
- **A**nimation: 60fps (16ms)
- **I**dle: 利用空闲时间 (requestIdleCallback)
- **L**oad: 首次加载 < 5s (3G)
