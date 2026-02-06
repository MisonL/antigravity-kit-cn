---
name: code-review-checklist
description: 涵盖代码质量、安全性和最佳实践的代码审查指南。
allowed-tools: Read, Glob, Grep
---

# 代码审查检查清单 (Code Review Checklist)

## 快速审查清单

### 正确性 (Correctness)

- [ ] 代码是否实现了预期功能
- [ ] 边缘情况是否已处理
- [ ] 错误处理机制是否到位
- [ ] 是否存在明显的 Bug

### 安全性 (Security)

- [ ] 输入是否经过校验和清洗 (Sanitized)
- [ ] 是否存在 SQL/NoSQL 注入风险
- [ ] 是否存在 XSS 或 CSRF 漏洞
- [ ] 是否存在硬编码的密钥或敏感凭据 (Secrets)
- [ ] **AI 相关:** 是否防御了 Prompt 注入 (如果适用)
- [ ] **AI 相关:** 输出在进入关键执行点前是否经过清洗

### 性能 (Performance)

- [ ] 是否存在 N+1 查询问题
- [ ] 是否存在不必要的循环
- [ ] 缓存策略是否合适
- [ ] 是否考虑了对包体积 (Bundle size) 的影响

### 代码质量 (Code Quality)

- [ ] 命名是否清晰直观
- [ ] DRY 原则 - 是否存在重复代码
- [ ] 是否遵循了 SOLID 原则
- [ ] 抽象层级是否合适

### 测试 (Testing)

- [ ] 新代码是否有对应的单元测试
- [ ] 边缘情况是否经过测试
- [ ] 测试代码是否易读、易维护

### 文档 (Documentation)

- [ ] 复杂逻辑是否有注释说明
- [ ] 公开 API 是否有文档记录
- [ ] README 是否根据需要进行了更新

## AI & LLM 审查模式 (2025)

### 逻辑与幻觉

- [ ] **思维链 (Chain of Thought):** 逻辑路径是否可验证？
- [ ] **边缘情况:** AI 是否考虑了空状态、超时和部分失败？
- [ ] **外部状态:** 代码对文件系统或网络的假设是否安全？

### Prompt 工程审查

```markdown
// ❌ 代码中 prompt 模糊
const response = await ai.generate(userInput);

// ✅ 结构化且安全的 prompt
const response = await ai.generate({
system: "你是一个专业的解析器...",
input: sanitize(userInput),
schema: ResponseSchema
});
```

## 需指出并标记的反模式 (Anti-Patterns)

```typescript
// ❌ 魔法数字
if (status === 3) { ... }

// ✅ 具名常量
if (status === Status.ACTIVE) { ... }

// ❌ 深层嵌套
if (a) { if (b) { if (c) { ... } } }

// ✅ 提前返回 (Early returns)
if (!a) return;
if (!b) return;
if (!c) return;
// 执行主要逻辑

// ❌ 巨型函数 (100+ 行)
// ✅ 短小、专注的函数

// ❌ 使用 any 类型
const data: any = ...

// ✅ 正确的类型定义
const data: UserData = ...
```

## 审查评论指南 (Review Comments Guide)

```
// 阻碍性问题使用 🔴
🔴 BLOCKING: 此处存在 SQL 注入漏洞

// 重要建议使用 🟡
🟡 SUGGESTION: 为了性能考虑，建议此处使用 useMemo

// 次要细节 (Nits) 使用 🟢
🟢 NIT: 对于不可变的变量，优先使用 const 而非 let

// 疑问使用 ❓
❓ QUESTION: 如果此处 user 为 null 会发生什么？
```
