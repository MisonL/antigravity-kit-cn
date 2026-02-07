---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
allowed-tools: Read, Glob, Grep
---

# 代码审查检查清单 (Code Review Checklist)

## 快速审查检查清单 (Quick Review Checklist)

### 正确性 (Correctness)

- [ ] 代码做到了它应该做的事
- [ ] 边缘情况已处理
- [ ] 错误处理已就位
- [ ] 无明显 Bug

### 安全 (Security)

- [ ] 输入已经过验证和净化
- [ ] 无 SQL/NoSQL 注入漏洞
- [ ] 无 XSS 或 CSRF 漏洞
- [ ] 无硬编码的密钥或敏感凭据
- [ ] **AI-Specific (AI 特定):** 防止 Prompt Injection (提示词注入) (如果适用)
- [ ] **AI-Specific (AI 特定):** 输出在用于关键 Sink 之前已经过净化

### 性能 (Performance)

- [ ] 无 N+1 查询
- [ ] 无不必要的循环
- [ ] 适当的缓存
- [ ] 已考虑 Bundle size (包体积) 影响

### 代码质量 (Code Quality)

- [ ] 清晰的命名
- [ ] DRY - 无重复代码
- [ ] 遵循 SOLID 原则
- [ ] 适当的抽象级别

### 测试 (Testing)

- [ ] 新代码有单元测试
- [ ] 边缘情况已测试
- [ ] 测试可读且可维护

### 文档 (Documentation)

- [ ] 复杂逻辑已注释
- [ ] 公共 API 已文档化
- [ ] 如果需要，已更新 README

---

## AI & LLM 审查模式 (2025) (AI & LLM Review Patterns)

### 逻辑与幻觉 (Logic & Hallucinations)

- [ ] **Chain of Thought (思维链):** 逻辑是否遵循可验证的路径？
- [ ] **Edge Cases (边缘情况):** AI 是否考虑了空状态、超时和部分失败？
- [ ] **External State (外部状态):** 代码是否对文件系统或网络做出了安全假设？

### 提示工程审查 (Prompt Engineering Review)

```markdown
// ❌ Vague prompt in code (代码中模糊的提示词)
const response = await ai.generate(userInput);

// ✅ Structured & Safe prompt (结构化且安全的提示词)
const response = await ai.generate({
system: "You are a specialized parser...",
input: sanitize(userInput),
schema: ResponseSchema
});
```

---

## 需要标记的反模式 (Anti-Patterns to Flag)

```typescript
// ❌ Magic numbers (魔术数字)
if (status === 3) { ... }

// ✅ Named constants (命名常量)
if (status === Status.ACTIVE) { ... }

// ❌ Deep nesting (深层嵌套)
if (a) { if (b) { if (c) { ... } } }

// ✅ Early returns (提前返回)
if (!a) return;
if (!b) return;
if (!c) return;
// do work

// ❌ Long functions (100+ lines) (长函数)
// ✅ Small, focused functions (小而专注的函数)

// ❌ any type (any 类型)
const data: any = ...

// ✅ Proper types (正确的类型)
const data: UserData = ...
```

---

## 审查评论指南 (Review Comments Guide)

```
// Blocking issues use 🔴 (阻塞性问题使用 🔴)
🔴 BLOCKING: SQL injection vulnerability here

// Important suggestions use 🟡 (重要建议使用 🟡)
🟡 SUGGESTION: Consider using useMemo for performance

// Minor nits use 🟢 (小问题使用 🟢)
🟢 NIT: Prefer const over let for immutable variable

// Questions use ❓ (问题使用 ❓)
❓ QUESTION: What happens if user is null here?
```
