---
description: 测试生成与测试执行命令。用于创建并运行代码测试。
---

# /test - 测试生成与执行

$ARGUMENTS

---

## 目的

此命令用于生成测试用例、运行现有测试或检查测试覆盖率（Coverage）。

---

## 子命令

```
/test                - 运行所有测试
/test [文件/功能]    - 为特定目标生成测试用例
/test coverage       - 显示测试覆盖率报告
/test watch          - 以 Watch mode（观察模式）运行测试
```

---

## 行为

### 生成测试

当要求对某个文件或功能进行测试时：

1. **分析代码**
   - 识别函数与方法
   - 寻找 Edge cases（边界情况）
   - 检测需要 Mock（模拟）的外部依赖

2. **生成测试用例**
   - Happy path（正常路径）测试
   - 错误处理情况
   - 边界情况
   - 集成测试（如有必要）

3. **编写测试代码**
   - 使用项目指定的测试框架（Jest、Vitest 等）
   - 遵循现有的测试模式
   - Mock（模拟）外部依赖项

---

## 输出格式

### 测试生成示例

```markdown
## 🧪 Tests（测试）：[目标]

### 测试计划
| 测试用例 | 类型 | 覆盖点 |
|---|---|---|
| 应能创建用户 | Unit | Happy path（正常路径） |
| 应拒绝无效邮箱 | Unit | Validation（校验） |
| 应处理数据库错误 | Unit | Error case（错误处理） |

### 已生成的测试代码

`tests/[file].test.ts`

[包含测试代码的代码块]

---

运行命令：`npm test`
```

### 测试执行示例

```
🧪 正在运行测试……

✅ auth.test.ts（通过 5 项）
✅ user.test.ts（通过 8 项）
❌ order.test.ts（通过 2 项，失败 1 项）

失败详情：
  ✗ 应正确计算折扣后的总额
    期望值：90
    实际值：100

统计：共 15 项测试（通过 14 项，失败 1 项）
```

---

## 使用示例

```
/test src/services/auth.service.ts
/test 用户注册流程
/test coverage
/test 修复失败的测试项
```

---

## 测试模式

### 单元测试结构示例

```typescript
describe('AuthService', () => {
  it('should reject invalid token', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

---

## 核心原则

- **针对行为而非实现进行测试**
- **每个测试仅包含一个断言**（在可行的情况下）
- **使用描述性的测试名称**
- **Arrange-Act-Assert（准备-执行-断言）模式**
- **Mock（模拟）所有外部依赖项**
