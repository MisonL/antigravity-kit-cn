---
name: code-review-checklist
description: 代码审查指南。涵盖代码质量、安全性及最佳实践。
allowed-tools: Read, Glob, Grep
---

# 代码审查检查清单 (Code Review Checklist)

## 快速审查清单 (Quick Review Checklist)

### 正确性 (Correctness)

- [ ] **功能对齐**：代码是否实现了预期的功能？
- [ ] **边缘情况**：是否处理了所有的边缘情况 (Edge cases)？
- [ ] **错误处理**：是否建立了完善的错误处理机制？
- [ ] **无明显 Bug**：是否存在显而易见的逻辑漏洞？

### 安全性 (Security)

- [ ] **输入校验**：是否对所有输入进行了验证与净化 (Sanitized)？
- [ ] **注入防护**：是否存在 SQL/NoSQL 注入风险？
- [ ] **XSS/CSRF**：是否存在跨站脚本或跨站请求伪造漏洞？
- [ ] **凭据安全**：是否存在硬编码的密钥 (Secrets) 或敏感凭据？
- [ ] **AI 特定**：是否针对提示词注入 (Prompt Injection) 进行了防护（如适用）？
- [ ] **AI 特定**：输出内容在进入关键接收端 (Sinks) 前是否已净化？

### 性能 (Performance)

- [ ] **N+1 问题**：是否存在数据库 N+1 查询问题？
- [ ] **循环优化**：是否存在不必要的循环逻辑？
- [ ] **缓存策略**：是否使用了适当的缓存机制？
- [ ] **包体积**：是否考虑了对打包体积 (Bundle size) 的影响？

### 代码质量 (Code Quality)

- [ ] **命名清晰**：变量及函数命名是否意图明确？
- [ ] **DRY 原则**：是否遵循了“不要重复自己”原则，无冗余代码？
- [ ] **SOLID 原则**：是否遵循了面向对象设计的 SOLID 原则？
- [ ] **抽象层次**：抽象层级是否恰当？

### 测试 (Testing)

- [ ] **单元测试**：新代码是否配有相应的单元测试 (Unit tests)？
- [ ] **边缘测试**：边缘情况是否包含在测试范围内？
- [ ] **可读性**：测试用例是否易于阅读与维护？

### 文档 (Documentation)

- [ ] **逻辑注释**：复杂逻辑是否配有必要的说明注释？
- [ ] **API 文档**：公共 API 是否已记录？
- [ ] **README**：如有必要，是否已更新项目 README 文件？

---

## AI & LLM 审查模式 (2025) (AI & LLM Review Patterns)

### 逻辑与幻觉 (Logic & Hallucinations)

- [ ] **思维链 (Chain of Thought)**：其逻辑推理路径是否可验证？
- [ ] **边缘情况**：AI 是否考虑了空状态、超时及部分失败的情况？
- [ ] **外部状态**：代码对于文件系统或网络的假设是否安全？

### 提示词工程审查 (Prompt Engineering Review)

```markdown
// ❌ 代码中存在模糊的提示词
const response = await ai.generate(userInput);

// ✅ 结构化且安全的提示词
const response = await ai.generate({
system: "您是一个专业的解析器……",
input: sanitize(userInput),
schema: ResponseSchema
});
```

---

## 应标识的反模式 (Anti-Patterns to Flag)

```typescript
// ❌ 魔术数字 (Magic numbers)
if (status === 3) { ... }

// ✅ 具名常量 (Named constants)
if (status === Status.ACTIVE) { ... }

// ❌ 深度嵌套
if (a) { if (b) { if (c) { ... } } }

// ✅ 卫语句/早期返回 (Early returns)
if (!a) return;
if (!b) return;
if (!c) return;
// 处理核心逻辑

// ❌ 长函数 (超过 100 行)
// ✅ 短小且专注的函数 (Small, focused functions)

// ❌ 使用 any 类型
const data: any = ...

// ✅ 使用正确的类型
const data: UserData = ...
```

---

## 审查评注指南 (Review Comments Guide)

```
// 🔴 阻塞性问题：关键路径中存在 SQL 注入漏洞
🔴 BLOCKING: 此处存在 SQL 注入风险

// 🟡 重要建议：考虑使用 useMemo 优化性能
🟡 SUGGESTION: 考虑此处使用 useMemo 进行性能优化

// 🟢 细节修饰 (Nits)：对于不可变变量，优先使用 const
🟢 NIT: 对于不可变变量，建议优先使用 const 而非 let

// ❓ 疑问确认：如果此处用户 (User) 为空会怎样？
❓ QUESTION: 如果此处 User 为 null 会发生什么情况？
```

---

