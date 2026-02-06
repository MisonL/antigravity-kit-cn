---
description: 测试生成与测试执行命令。用于创建并运行代码测试。
---

# /test - 测试生成与执行

$ARGUMENTS

---

## 目的

此命令用于生成测试、运行已有测试或检查测试覆盖率。

---

## 子命令

```
/test                - 运行全部测试
/test [file/feature] - 为指定目标生成测试
/test coverage       - 显示覆盖率报告
/test watch          - 以 watch 模式运行测试
```

---

## 行为

### 生成测试

当要求测试某个文件或功能时：

1. **分析代码**
   - 识别函数与方法
   - 找到边界情况
   - 识别需要 mock 的依赖

2. **生成测试用例**
   - Happy path 测试
   - 错误场景测试
   - 边界场景测试
   - 集成测试（如有必要）

3. **编写测试**
   - 使用项目已有测试框架（Jest、Vitest 等）
   - 遵循现有测试模式
   - Mock 外部依赖

---

## 输出格式

### 测试生成场景

```markdown
## 🧪 Tests: [Target]

### Test Plan
| Test Case | Type | Coverage |
|-----------|------|----------|
| Should create user | Unit | Happy path |
| Should reject invalid email | Unit | Validation |
| Should handle db error | Unit | Error case |

### Generated Tests

`tests/[file].test.ts`

[Code block with tests]

---

Run with: `npm test`
```

### 测试执行场景

```
🧪 Running tests...

✅ auth.test.ts (5 passed)
✅ user.test.ts (8 passed)
❌ order.test.ts (2 passed, 1 failed)

Failed:
  ✗ should calculate total with discount
    Expected: 90
    Received: 100

Total: 15 tests (14 passed, 1 failed)
```

---

## 示例

```
/test src/services/auth.service.ts
/test user registration flow
/test coverage
/test fix failed tests
```

---

## 测试模式

### 单元测试结构

```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should return token for valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@test.com', password: 'pass123' };
      
      // Act
      const result = await authService.login(credentials);
      
      // Assert
      expect(result.token).toBeDefined();
    });

    it('should throw for invalid password', async () => {
      // Arrange
      const credentials = { email: 'test@test.com', password: 'wrong' };
      
      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });
});
```

---

## 关键原则

- **测试行为，不测实现细节**
- **每个测试尽量单一断言**（在可行时）
- **测试名称应有描述性**
- **采用 Arrange-Act-Assert 模式**
- **Mock 外部依赖**
