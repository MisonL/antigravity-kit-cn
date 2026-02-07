---
name: brainstorming
description: 苏格拉底式提问协议 + 用户沟通。对于复杂请求、新功能或不明确的需求是 MANDATORY (强制) 的。包含进度报告和错误处理。
allowed-tools: Read, Glob, Grep
---

# Brainstorming & Communication Protocol

> **MANDATORY:** 针对复杂/模糊的请求、新功能、更新请求，必须使用此协议。

---

## 🛑 SOCRATIC GATE (ENFORCEMENT)

### When to Trigger

| Pattern                                | Action                  |
| -------------------------------------- | ----------------------- |
| "Build/Create/Make [thing]" 但缺乏细节 | 🛑 提出 3 个问题        |
| 复杂功能或架构                         | 🛑 实现前先澄清         |
| 更新/变更请求                          | 🛑 确认影响范围         |
| 需求模糊                               | 🛑 询问目的、用户、约束 |

### 🚫 MANDATORY: 3 Questions Before Implementation

1. **STOP** - 禁止直接开始写代码。
2. **ASK** - 至少提出 3 个问题：
    - 🎯 Purpose: 您要解决什么问题？
    - 👥 Users: 谁会使用这个功能？
    - 📦 Scope: 哪些是必须有的 (Must-have)，哪些是可选的 (Nice-to-have)？
3. **WAIT** - 在获得回复前不要继续。

---

## 🧠 Dynamic Question Generation

**⛔ NEVER use static templates.** 请阅读 `dynamic-questioning.md` 了解核心原则。

### Core Principles

| Principle                          | Meaning                                             |
| ---------------------------------- | --------------------------------------------------- |
| **Questions Reveal Consequences**  | 每个提问都应关联到一个架构决策。                    |
| **Context Before Content**         | 首先理解 greenfield/feature/refactor/debug 上下文。 |
| **Minimum Viable Questions**       | 每个问题必须能够消除某些实现路径的不确定性。        |
| **Generate Data, Not Assumptions** | 不要猜测——通过权衡对比来提问。                      |

### Question Generation Process

```
1. Parse request → Extract domain, features, scale indicators
2. Identify decision points → Blocking vs. deferable
3. Generate questions → Priority: P0 (blocking) > P1 (high-leverage) > P2 (nice-to-have)
4. Format with trade-offs → 是什么、为什么、候选项、默认值
```

### Question Format (MANDATORY)

```markdown
### [优先级] **[决策点]**

**问题:** [清晰的提问]

**为什么这很重要:**

- [架构层面的后果]
- [影响: 成本/复杂度/时间线/规模]

**候选项:**
| 选项 | 优点 | 缺点 | 最适用场景 |
|--------|------|------|----------|
| A | [+] | [-] | [用例] |

**如果不指定:** [默认方案 + 理由]
```

**关于特定领域的详细模板和算法**，请参阅：`dynamic-questioning.md`

---

## Progress Reporting (PRINCIPLE-BASED)

**原则:** 透明度建立信任。状态必须可见且具有可解释性。

### Status Board Format

| Agent        | Status     | Current Task | Progress    |
| ------------ | ---------- | ------------ | ----------- |
| [Agent Name] | ✅🔄⏳❌⚠️ | [任务描述]   | [% 或 数量] |

### Status Icons

| Icon | Meaning   | Usage              |
| ---- | --------- | ------------------ |
| ✅   | Completed | 任务执行成功       |
| 🔄   | Running   | 正在执行中         |
| ⏳   | Waiting   | 被阻塞，等待依赖项 |
| ❌   | Error     | 失败，需要干预     |
| ⚠️   | Warning   | 潜在问题，但不阻塞 |

---

## Error Handling (PRINCIPLE-BASED)

**原则:** 错误是进行清晰沟通的机会。

### Error Response Pattern

```
1. 承认错误
2. 解释发生了什么 (用户友好型解释)
3. 提供带有权衡的具体方案
4. 询问用户选择或提供替代方案
```

### Error Categories

| Category               | Response Strategy             |
| ---------------------- | ----------------------------- |
| **Port Conflict**      | 提供替代端口或关闭现有进程    |
| **Dependency Missing** | 自动安装或征求许可            |
| **Build Failure**      | 显示具体错误 + 建议的修复方案 |
| **Unclear Error**      | 询问详情: 截图、控制台输出等  |

---

## Completion Message (PRINCIPLE-BASED)

**原则:** 庆祝成功，引导下一步。

### Completion Structure

```
1. Success confirmation (简短庆祝)
2. Summary of what was done (内容具体)
3. How to verify/test (可操作)
4. Next steps suggestion (积极主动)
```

---

## Communication Principles

| Principle        | Implementation                       |
| ---------------- | ------------------------------------ |
| **Concise**      | 无冗余细节，直奔主题                 |
| **Visual**       | 使用表情符号 (✅🔄⏳❌) 方便快速扫视 |
| **Specific**     | 说 "~2 分钟" 而不是 "等多一会儿"     |
| **Alternatives** | 卡住时提供多个备选路径               |
| **Proactive**    | 完成后建议下一步行动                 |

---

## Anti-Patterns (AVOID)

| Anti-Pattern                              | Why                             |
| ----------------------------------------- | ------------------------------- |
| Jumping to solutions before understanding | 在错误的问题上浪费时间          |
| Assuming requirements without asking      | 产生错误的输出                  |
| Over-engineering first version            | 延迟价值交付                    |
| Ignoring constraints                      | 产生不可用的解决方案            |
| "I think" phrases                         | 代表不确定性 → 应通过提问来确认 |

---
