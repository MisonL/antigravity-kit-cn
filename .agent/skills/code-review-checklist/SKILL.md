---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
allowed-tools: Read, Glob, Grep
---

# Code Review Checklist

## Quick Review Checklist

### Correctness

- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] No obvious bugs

### Security

- [ ] Input validated and sanitized
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] No XSS or CSRF vulnerabilities
- [ ] No hardcoded secrets or sensitive credentials
- [ ] **AI-Specific:** Protection against Prompt Injection (if applicable)
- [ ] **AI-Specific:** Outputs are sanitized before being used in critical sinks

### Performance

- [ ] No N+1 queries
- [ ] No unnecessary loops
- [ ] Appropriate caching
- [ ] Bundle size impact considered

### Code Quality

- [ ] Clear naming
- [ ] DRY - no duplicate code
- [ ] SOLID principles followed
- [ ] Appropriate abstraction level

### Testing

- [ ] Unit tests for new code
- [ ] Edge cases tested
- [ ] Tests readable and maintainable

### Documentation

- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] README updated if needed

## AI & LLM Review Patterns (2025)

### Logic & Hallucinations

- [ ] **Chain of Thought:** 逻辑路径是否可验证？
- [ ] **Edge Cases:** AI 是否考虑了空状态、超时和部分失败？
- [ ] **External State:** 代码对文件系统或网络的假设是否安全？

### Prompt Engineering Review

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

## Anti-Patterns to Flag

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

## Review Comments Guide

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
