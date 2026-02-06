---
name: testing-patterns
description: 测试模式、Mocking 策略与测试金字塔
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Testing Patterns - 测试模式

> 可靠测试套件的原则。

---

## 1. 测试金字塔 (Testing Pyramid)

```
        /\          E2E (Few - 少)
       /  \         关键流程 (Critical flows)
      /----\
     /      \       Integration (Some - 一些)
    /--------\      API, DB 查询 (API, DB queries)
   /          \
  /------------\    Unit (Many - 多)
                    函数, 类 (Functions, classes)
```

---

## 2. AAA 模式 (AAA Pattern)

| 步骤        | 目的         |
| ----------- | ------------ |
| **Arrange** | 设置测试数据 |
| **Act**     | 执行被测代码 |
| **Assert**  | 验证结果     |

---

## 3. 测试类型选择

### 何时使用每种

| 类型            | 最适合        | 速度       |
| --------------- | ------------- | ---------- |
| **Unit**        | 纯函数, 逻辑  | 快 (<50ms) |
| **Integration** | API, DB, 服务 | 中         |
| **E2E**         | 关键用户流程  | 慢         |

---

## 4. 单元测试原则 (Unit Test Principles)

### 好的单元测试

| 原则                 | 含义           |
| -------------------- | -------------- |
| 快速 (Fast)          | 每个 < 100ms   |
| 隔离 (Isolated)      | 无外部依赖     |
| 可重复 (Repeatable)  | 结果始终相同   |
| 自检 (Self-checking) | 无需人工验证   |
| 及时 (Timely)        | 与代码一起编写 |

### 单元测试什么

| 测试     | 不要测试      |
| -------- | ------------- |
| 业务逻辑 | 框架代码      |
| 边缘情况 | 第三方库      |
| 错误处理 | 简单的 getter |

---

## 5. 集成测试原则 (Integration Test Principles)

### 测试什么

| 领域     | 关注点           |
| -------- | ---------------- |
| API 端点 | 请求/响应        |
| 数据库   | 查询, 事务       |
| 外部服务 | 契约 (Contracts) |

### 设置/拆卸 (Setup/Teardown)

| 阶段        | 行动     |
| ----------- | -------- |
| Before All  | 连接资源 |
| Before Each | 重置状态 |
| After Each  | 清理     |
| After All   | 断开连接 |

---

## 6. Mocking 原则 (Mocking Principles)

### 何时 Mock

| Mock              | 不要 Mock  |
| ----------------- | ---------- |
| 外部 API          | 被测代码   |
| 数据库 (单元测试) | 简单的依赖 |
| 时间/随机         | 纯函数     |
| 网络              | 内存存储   |

### Mock 类型

| 类型 | 用途       |
| ---- | ---------- |
| Stub | 返回固定值 |
| Spy  | 追踪调用   |
| Mock | 设置预期   |
| Fake | 简化的实现 |

---

## 7. 测试组织 (Test Organization)

### 命名 (Naming)

| 模式            | 示例                          |
| --------------- | ----------------------------- |
| Should behavior | "should return error when..." |
| When condition  | "when user not found..."      |
| Given-when-then | "given X, when Y, then Z"     |

### 分组 (Grouping)

| 级别       | 用途         |
| ---------- | ------------ |
| describe   | 分组相关测试 |
| it/test    | 单个用例     |
| beforeEach | 公共设置     |

---

## 8. 测试数据 (Test Data)

### 策略

| 方法      | 用途         |
| --------- | ------------ |
| Factories | 生成测试数据 |
| Fixtures  | 预定义数据集 |
| Builders  | 流式对象创建 |

### 原则

- 使用真实数据
- 随机化非必要值 (faker)
- 共享公共 fixtures
- 保持数据最小化

---

## 9. 最佳实践 (Best Practices)

| 实践             | 为什么         |
| ---------------- | -------------- |
| 每个测试一个断言 | 清晰的失败原因 |
| 独立测试         | 无顺序依赖     |
| 快速测试         | 频繁运行       |
| 描述性名称       | 自文档化       |
| 清理             | 避免副作用     |

---

## 10. 反模式 (Anti-Patterns)

| ❌ 不要 (Don't)  | ✅ 要 (Do)     |
| ---------------- | -------------- |
| 测试实现         | 测试行为       |
| 重复测试代码     | 使用 Factories |
| 复杂测试设置     | 简化或拆分     |
| 忽略不稳定的测试 | 修复根本原因   |
| 跳过清理         | 重置状态       |

---

> **记住：** 测试是文档。如果有人无法从测试中理解代码做了什么，重写它们。
