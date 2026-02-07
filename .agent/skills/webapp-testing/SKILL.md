---
name: webapp-testing
description: Web 应用测试原则、E2E 测试策略
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Web 应用测试 (Web App Testing)

> 发现并测试一切。不放过任何一条未经测试的代码路径。

---

## 🔧 运行时脚本

**执行以下脚本进行自动化浏览器测试：**

| 脚本                           | 用途           | 执行命令                                                  |
| ------------------------------ | -------------- | --------------------------------------------------------- |
| `scripts/playwright_runner.py` | 基础浏览器测试 | `python scripts/playwright_runner.py https://example.com` |
|                                | 包含截图       | `python scripts/playwright_runner.py <url> --screenshot`  |
|                                | 无障碍检查     | `python scripts/playwright_runner.py <url> --a11y`        |

**前置要求**：`pip install playwright && playwright install chromium`

---

## 1. 深度审计方法 (Deep Audit)

### 探索优先

- **路由 (Routes)**：扫描 `app/`, `pages/` 目录。
- **API 端点**：搜索项目中的 HTTP 方法定义。
- **组件**：遍历组件目录。

### 系统化测试流程

1. **映射 (Map)**：列出所有路由与 API。
2. **扫描 (Scan)**：验证其基本响应情况。
3. **测试 (Test)**：覆盖关键业务路径。

---

## 2. Web 测试金字塔

```
        /\          端到端测试 (E2E) (少量)
       /  \         关键用户路径验证
      /----\
     /      \       集成测试 (Integration) (适量)
    /--------\      API 接口、数据流
   /          \
  /------------\    组件测试 (Component) (大量)
                    单个 UI 单元验证
```

---

## 3. E2E 测试准则

### 测试优先级

1. **核心流程 (Happy path)**。
2. **身份认证流程**。
3. **关键业务操作**。
4. **错误边界处理**。

### 最佳实践

- **使用 `data-testid`**：确保选择器稳定，不受 UI 样式变动影响。
- **等待元素加载**：避免因网络延迟导致的测试偶发性失败 (Flaky)。
- **隔离状态**：每个测试应能独立运行。
- **模拟真实用户**：关注用户行为而非内部实现。

---

## 4. Playwright 核心准则

### 核心概念

- **POM (Page Object Model)**：封装页面逻辑。
- **Fixtures**：实现可复用的测试初始化。
- **内置断言**：利用其自动等待功能。
- **Trace Viewer**：用于调试失败的测试。

---

## 5. 视觉测试 (Visual Testing)

- **适用场景**：设计系统、营销页面、基础组件库。
- **策略**：建立基准截图 (Baseline)，在后续变更中进行像素级对比，审核视觉差异。

---

## 6. API 测试准则

- **状态码校验**：200, 400, 404, 500。
- **响应结构**：验证是否符合 Schema 规范。
- **用户友好度**：检查错误消息是否清晰。

---

## 7. 测试组织结构

```
tests/
├── e2e/           # 完整用户流
├── integration/   # API 与数据集成
├── component/     # UI 单元测试
└── fixtures/      # 共享测试数据
```

---

## 8. CI 持续集成

1. 安装依赖环境。
2. 安装浏览器驱动。
3. 执行测试套件。
4. 上传测试产物 (Traces, Screenshots)。

---

## 9. 应避免的反模式 (Anti-Patterns)

| ❌ 禁止 (Don't)                | ✅ 推荐 (Do)         |
| ------------------------------ | -------------------- |
| 测试内部实现细节               | 测试对外的行为表现   |
| 使用强制等待 (`sleep`, `wait`) | 使用自动等待机制     |
| 忽略资源清理                   | 保持测试间的高度隔离 |
| 忽视偶发失败的测试             | 排查并锁定根本原因   |

---

> **谨记：** E2E 测试运行成本高昂。请务必仅针对业务的关键路径进行部署。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/webapp-testing/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/webapp-testing/SKILL.md`。
- **注意**：文档层不应替代 Playwright 官方手册；仅在此定义 Web 测试策略。
