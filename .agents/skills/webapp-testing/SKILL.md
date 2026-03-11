---
name: webapp-testing
description: Web 应用测试原则。覆盖端到端（E2E）、Playwright 与深度审计策略。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Web 应用测试

> 发现并测试一切，不放过任何路由。Web 应用测试（Web App Testing）以完整覆盖为目标。

## 运行时脚本（Runtime Scripts）

**使用以下脚本执行自动化浏览器测试：**

| 脚本（Script） | 用途（Purpose） | 用法（Usage） |
|---------------|----------------|---------------|
| `scripts/playwright_runner.py` | 基础浏览器测试 | `python scripts/playwright_runner.py <网址>` |
| | 带截图输出 | `python scripts/playwright_runner.py <网址> --screenshot` |
| | 可访问性检查 | `python scripts/playwright_runner.py <网址> --a11y` |

**依赖要求：** `pip install playwright && playwright install chromium`

---

## 1. 深度审计方法（Deep Audit Approach）

### 先做发现（Discovery First）

| 目标（Target） | 如何发现（How to Find） |
|---------------|------------------------|
| 路由（Routes） | 扫描 app/、pages/、router 文件 |
| API 端点（API Endpoints） | 用 Grep 检索 HTTP 方法 |
| 组件（Components） | 查找组件目录 |
| 功能点（Features） | 阅读相关文档 |

### 系统化测试（Systematic Testing）

1. **Map（建图）** - 列出全部路由/API
2. **Scan（扫描）** - 验证是否可响应
3. **Test（测试）** - 覆盖关键路径

---

## 2. Web 测试金字塔（Testing Pyramid for Web）

```
        /\          端到端（E2E，少量）
       /  \         关键用户流程
      /----\
     /      \       集成测试（Integration，中量）
    /--------\      API、数据流
   /          \
  /------------\    组件测试（Component，大量）
                    单个 UI 单元
```

---

## 3. 端到端（E2E）测试原则

### 测什么（What to Test）

| 优先级（Priority） | 测试内容（Tests） |
|-------------------|------------------|
| 1 | Happy Path（主流程） |
| 2 | 鉴权流程（Authentication flows） |
| 3 | 关键业务动作 |
| 4 | 错误处理 |

### 端到端（E2E）最佳实践

| 实践（Practice） | 原因（Why） |
|----------------|------------|
| 使用 `data-testid` | 选择器稳定 |
| 等待元素就绪 | 避免不稳定测试（flaky tests） |
| 保持干净状态 | 用例彼此独立 |
| 避免依赖实现细节 | 面向用户行为测试 |

---

## 4. Playwright 原则（Playwright Principles）

### 核心概念（Core Concepts）

| 概念（Concept） | 用途（Use） |
|----------------|-----------|
| Page Object Model（页面对象模型） | 封装页面逻辑 |
| Fixtures（测试夹具） | 复用测试准备过程 |
| Assertions（断言） | 内置自动等待能力 |
| Trace Viewer（追踪查看器） | 调试失败用例 |

### 配置建议（Configuration）

| 设置项（Setting） | 建议（Recommendation） |
|-----------------|------------------------|
| 重试次数（Retries） | CI 中设为 2 |
| Trace（追踪） | `on-first-retry` |
| Screenshots（截图） | `on-failure` |
| Video（视频） | `retain-on-failure` |

---

## 5. 视觉回归测试（Visual Testing）

### 何时使用（When to Use）

| 场景（Scenario） | 价值（Value） |
|-----------------|--------------|
| 设计系统（Design system） | 高 |
| 营销页面（Marketing pages） | 高 |
| 组件库（Component library） | 中 |
| 动态内容页面 | 相对较低 |

### 策略（Strategy）

- 先建立基线截图（Baseline screenshots）
- 变更后做对比
- 审查视觉差异
- 对有意变更更新基线

---

## 6. API 测试原则（API Testing Principles）

### 覆盖范围（Coverage Areas）

| 范围（Area） | 测试内容（Tests） |
|-------------|------------------|
| 状态码（Status codes） | 200, 400, 404, 500 |
| 响应结构（Response shape） | 与 schema（模式）匹配 |
| 错误信息（Error messages） | 对用户友好 |
| 边界场景（Edge cases） | 空值、大输入、特殊字符 |

---

## 7. 测试组织方式（Test Organization）

### 文件结构（File Structure）

```
tests/
├── e2e/           # 全链路用户流程
├── integration/   # API、数据流
├── component/     # UI 单元
└── fixtures/      # 共享数据
```

### 命名约定（Naming Convention）

| 模式（Pattern） | 示例（Example） |
|---------------|----------------|
| 按功能命名（Feature-based） | `login.spec.ts` |
| 描述性命名（Descriptive） | `user-can-checkout.spec.ts` |

---

## 8. CI 集成（CI Integration）

### 流水线步骤（Pipeline Steps）

1. 安装依赖
2. 安装浏览器
3. 执行测试
4. 上传产物（trace（追踪）、截图）

### 并行策略（Parallelization）

| 策略（Strategy） | 用途（Use） |
|-----------------|-----------|
| 按文件并行（Per file） | Playwright 默认策略 |
| 分片（Sharding） | 大规模测试集 |
| Workers（并发工作者）并发 | 多浏览器/多进程执行 |

---

## 9. 反模式（Anti-Patterns）

| ❌ 避免（Don't） | ✅ 建议（Do） |
|----------------|-------------|
| 测实现细节 | 测用户行为 |
| 硬编码等待时间 | 使用自动等待 |
| 跳过清理步骤 | 确保用例隔离 |
| 忽略不稳定测试（flaky tests） | 修复根因 |

---

> **牢记：** 端到端（E2E）成本高，只用于关键路径。
