---
name: testing-patterns
description: 测试模式、Mocking 策略与测试金字塔
---

# 测试模式 (Testing Patterns)

## 测试金字塔

- **Unit**: 快速，隔离。测试单一函数。
- **Integration**: 测试组件/模块组合。
- **E2E**: 真实浏览器环境，模拟用户。

推荐比例：70% Unit, 20% Integration, 10% E2E。

## Mocking 策略

不要测试你不拥有的代码（第三方库、数据库）。

1.  **Mock 外部服务**: 不要真的发 HTTP 请求到 Stripe。
2.  **Mock 数据库**: 使用内存数据库或 Docker 容器。
3.  **Dependency Injection**: 通过参数传入依赖，便于替换 Mock。

## AAA 模式

每个测试用例都应该包含三个部分：

1.  **Arrange (准备)**: 设置测试数据和环境。
2.  **Act (执行)**: 调用被测函数。
3.  **Assert (断言)**: 验证结果是否符合预期。

```typescript
test("should add numbers", () => {
    // Arrange
    const a = 1;
    const b = 2;

    // Act
    const result = add(a, b);

    // Assert
    expect(result).toBe(3);
});
```
