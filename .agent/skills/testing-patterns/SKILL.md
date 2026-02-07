---
name: testing-patterns
description: 测试模式与原则。覆盖单元测试、集成测试与 Mock 策略。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 测试模式 (Testing Patterns)

> 构建可靠测试体系的原则。

---

## 1. 测试金字塔 (Testing Pyramid)

```
        /\          E2E（少量）
       /  \         关键流程
      /----\
     /      \       Integration（中量）
    /--------\      API、数据库查询
   /          \
  /------------\    Unit（大量）
                    函数、类等基础逻辑
```

---

## 2. AAA 模式 (AAA Pattern)

| Step | Purpose |
|------|---------|
| **Arrange** | 准备测试数据与上下文 |
| **Act** | 执行被测代码 |
| **Assert** | 断言结果是否符合预期 |

---

## 3. 测试类型选择 (Test Type Selection)

### 各类型使用时机 (When to Use Each)

| Type | Best For | Speed |
|------|----------|-------|
| **Unit** | 纯函数、核心逻辑 | 快（<50ms） |
| **Integration** | API、数据库、服务协作 | 中 |
| **E2E** | 关键用户流程 | 慢 |

---

## 4. 单元测试原则 (Unit Test Principles)

### 优秀单元测试特征 (Good Unit Tests)

| Principle | Meaning |
|-----------|---------|
| 快速 (Fast) | 单个用例 < 100ms |
| 隔离 (Isolated) | 不依赖外部系统 |
| 可重复 (Repeatable) | 每次结果一致 |
| 自校验 (Self-checking) | 无需手工验证 |
| 及时 (Timely) | 与代码同步编写 |

### 单元测试该测什么 (What to Unit Test)

| Test | Don't Test |
|------|------------|
| 业务逻辑 | 框架内部实现 |
| 边界条件 | 第三方库本身 |
| 错误处理 | 过于简单的 getter |

---

## 5. 集成测试原则 (Integration Test Principles)

### 重点覆盖 (What to Test)

| Area | Focus |
|------|-------|
| API 端点 | 请求/响应链路 |
| 数据库 | 查询与事务行为 |
| 外部服务 | 契约一致性 |

### Setup/Teardown 约定

| Phase | Action |
|-------|--------|
| Before All | 建立资源连接 |
| Before Each | 重置状态 |
| After Each | 执行清理 |
| After All | 释放连接 |

---

## 6. Mock 原则 (Mocking Principles)

### 何时需要 Mock (When to Mock)

| Mock | Don't Mock |
|------|------------|
| 外部 API | 被测代码本身 |
| 数据库（单元测试） | 简单依赖对象 |
| 时间/随机数 | 纯函数 |
| 网络请求 | 内存型替代实现 |

### Mock 类型 (Mock Types)

| Type | Use |
|------|-----|
| Stub | 返回固定值 |
| Spy | 跟踪调用行为 |
| Mock | 预设期望并校验 |
| Fake | 提供简化实现 |

---

## 7. 测试组织方式 (Test Organization)

### 命名规范 (Naming)

| Pattern | Example |
|---------|---------|
| Should 行为式 | "should return error when..." |
| When 条件式 | "when user not found..." |
| Given-when-then | "given X, when Y, then Z" |

### 分组方式 (Grouping)

| Level | Use |
|-------|-----|
| describe | 归类相关测试 |
| it/test | 单个测试用例 |
| beforeEach | 共享初始化逻辑 |

---

## 8. 测试数据策略 (Test Data)

### 常见策略 (Strategies)

| Approach | Use |
|----------|-----|
| Factories | 动态生成测试数据 |
| Fixtures | 预定义数据集 |
| Builders | 链式构建对象 |

### 基本原则 (Principles)

- 使用贴近真实的数据
- 非关键字段可随机化（faker）
- 共享公共 fixtures
- 保持最小必要数据集

---

## 9. 最佳实践 (Best Practices)

| Practice | Why |
|----------|-----|
| 单测关注单一断言目标 | 失败原因更清晰 |
| 用例相互独立 | 避免顺序依赖 |
| 保持测试快速 | 能高频执行 |
| 命名具描述性 | 测试即文档 |
| 严格清理状态 | 避免副作用污染 |

---

## 10. 反模式 (Anti-Patterns)

| ❌ Don't | ✅ Do |
|----------|-------|
| 测实现细节 | 测可观察行为 |
| 重复测试代码 | 使用 factories 复用 |
| 测试前置过于复杂 | 简化或拆分场景 |
| 忽略 flaky 测试 | 修复根因 |
| 不做清理 | 重置状态 |

---

> **牢记：** 测试本身就是文档。如果别人无法通过测试理解代码行为，就应该重写测试。
