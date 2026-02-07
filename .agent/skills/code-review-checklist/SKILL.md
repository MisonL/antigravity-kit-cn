---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
allowed-tools: Read, Glob, Grep
---

# 代码审查检查清单

## 快速审查检查清单

### 正确性

- [ ] 代码做到了它应该做的事
- [ ] 边缘情况已处理
- [ ] 错误处理已就位
- [ ] 无明显 Bug

### 安全

- [ ] 输入已经过验证和净化
- [ ] 无 SQL/NoSQL 注入漏洞
- [ ] 无 XSS 或 CSRF 漏洞
- [ ] 无硬编码的密钥或敏感凭据
- [ ] **AI 特定:** 防止提示词注入 (Prompt Injection) (如果适用)
- [ ] **AI 特定:** 输出在用于关键 Sink 之前已经过净化

### 性能

- [ ] 无 N+1 查询
- [ ] 无不必要的循环
- [ ] 适当的缓存
- [ ] 已考虑包体积 (Bundle size) 影响

### 代码质量

- [ ] 清晰的命名
- [ ] DRY - 无重复代码
- [ ] 遵循 SOLID 原则
- [ ] 适当的抽象级别

### 测试

- [ ] 新代码有单元测试
- [ ] 边缘情况已测试
- [ ] 测试可读且可维护

### 文档

- [ ] 复杂逻辑已注释
- [ ] 公共 API 已文档化
- [ ] 如果需要，已更新 README

---

## AI & LLM 审查模式 (2025)

### 逻辑与幻觉

- [ ] **思维链 (Chain of Thought):** 逻辑是否遵循可验证的路径？
- [ ] **边缘情况 (Edge Cases):** AI 是否考虑了空状态、超时和部分失败？
- [ ] **外部状态 (External State):** 代码是否对文件系统或网络做出了安全假设？

### 提示工程审查

```markdown
// ❌ 代码中模糊的提示词
const response = await ai.generate(userInput);

// ✅ 结构化且安全的提示词
const response = await ai.generate({
system: "You are a specialized parser...",
input: sanitize(userInput),
schema: ResponseSchema
});
```

---

## 需要标记的反模式

```typescript
// ❌ 魔术数字
if (status === 3) { ... }

// ✅ 命名常量
if (status === Status.ACTIVE) { ... }

// ❌ 深层嵌套
if (a) { if (b) { if (c) { ... } } }

// ✅ 提前返回
if (!a) return;
if (!b) return;
if (!c) return;
// do work

// ❌ 长函数 (100+ 行)
// ✅ 小而专注的函数

// ❌ any 类型
const data: any = ...

// ✅ 正确的类型
const data: UserData = ...
```

---

## 审查评论指南

```
// 阻塞性问题使用 🔴
🔴 BLOCKING: SQL injection vulnerability here

// 重要建议使用 🟡
🟡 SUGGESTION: Consider using useMemo for performance

// 小问题使用 🟢
🟢 NIT: Prefer const over let for immutable variable

// 问题使用 ❓
❓ QUESTION: What happens if user is null here?
```
