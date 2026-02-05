---
name: code-review-checklist
description: 代码审查指南，涵盖质量、安全和最佳实践
---

# 代码审查清单 (Code Review Checklist)

在 `review` 模式下，对照此清单检查代码。

## 1. 功能性 (Functionality)

- [ ] 代码是否实现了预期的功能？
- [ ] 边界情况 (空值、最大值、负值) 是否处理？
- [ ] 是否有并发问题 (Race Condition)？

## 2. 清晰度 (Readability)

- [ ] 命名是否清晰易懂？
- [ ] 逻辑是否过于复杂？能否简化？
- [ ] 是否存在魔法数字 (Magic Numbers)？

## 3. 安全性 (Security)

- [ ] 输入是否经过校验？
- [ ] 是否有 SQL 注入或 XSS 风险？
- [ ] 敏感信息 (API Key) 是否硬编码？

## 4. 性能 (Performance)

- [ ] 是否有 N+1 查询问题？
- [ ] 循环中是否有昂贵的操作？
- [ ] 资源是否正确释放 (文件句柄、数据库连接)？

## 5. 测试 (Tests)

- [ ] 是否有对应的单元测试？
- [ ] 测试用例是否覆盖了分支逻辑？
