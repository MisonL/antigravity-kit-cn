---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
allowed-tools: Read, Glob, Grep
---

# 代码审查检查清单 (Code Review Checklist)

## 快速审查检查清单 (Quick Review Checklist)

### 正确性 (Correctness)

- [ ] 代码实现了预期的功能
- [ ] 边缘情况已处理
- [ ] 错误处理已就位
- [ ] 无明显 Bug

### 安全性 (Security)

- [ ] 输入已验证和脱敏
- [ ] 无 SQL/NoSQL 注入漏洞
- [ ] 无 XSS 或 CSRF 漏洞
- [ ] 无硬编码的密钥或敏感凭证
- [ ] **AI 特定:** 防止 Prompt Injection (提示词注入) (如果适用)
- [ ] **AI 特定:** 输出在使用于关键位置前已脱敏

### 性能 (Performance)

- [ ] 无 N+1 查询
- [ ] 无不必要的循环
- [ ] 适当的缓存
- [ ] 考虑了包体积影响

### 代码质量 (Code Quality)

- [ ] 清晰的命名
- [ ] DRY (Don't Repeat Yourself) - 无重复代码
- [ ] 遵循 SOLID 原则
- [ ] 适当的抽象级别

### 测试 (Testing)

- [ ] 新代码有单元测试
- [ ] 边缘情况已测试
- [ ] 测试可读且可维护

### 文档 (Documentation)

- [ ] 复杂逻辑有注释
- [ ] 公共 API (应用程序接口) 已文档化
- [ ] README 根据需要更新

## AI & LLM 审查模式 (2025)

### 逻辑与幻觉 (Logic & Hallucinations)

- [ ] **思维链 (Chain of Thought):** 逻辑是否遵循可验证的路径？
- [ ] **边缘情况 (Edge Cases):** AI 是否考虑了空状态、超时和部分失败？
- [ ] **外部状态 (External State):** 代码是否对文件系统或网络做出了安全的假设？

### 提示词工程审查 (Prompt Engineering Review)

```markdown
// ❌ Vague prompt in code
const response = await ai.generate(userInput);

// ✅ Structured & Safe prompt
const response = await ai.generate({
system: "You are a specialized parser...",
input: sanitize(userInput),
schema: ResponseSchema
});
```

## 需要标记的反模式 (Anti-Patterns to Flag)

```typescript
// ❌ Magic numbers
if (status === 3) { ... }

// ✅ Named constants
if (status === Status.ACTIVE) { ... }

// ❌ Deep nesting
if (a) { if (b) { if (c) { ... } } }

// ✅ Early returns
if (!a) return;
if (!b) return;
if (!c) return;
// do work

// ❌ Long functions (100+ lines)
// ✅ Small, focused functions

// ❌ any type
const data: any = ...

// ✅ Proper types
const data: UserData = ...
```

## 审查评论指南 (Review Comments Guide)

```
// Blocking issues use 🔴
🔴 BLOCKING: SQL injection vulnerability here

// Important suggestions use 🟡
🟡 SUGGESTION: Consider using useMemo for performance

// Minor nits use 🟢
🟢 NIT: Prefer const over let for immutable variable

// Questions use ❓
❓ QUESTION: What happens if user is null here?
```
