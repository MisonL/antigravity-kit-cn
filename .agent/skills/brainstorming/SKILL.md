---
name: brainstorming
description: Socratic questioning protocol + user communication. MANDATORY for complex requests, new features, or unclear requirements. Includes progress reporting and error handling.
allowed-tools: Read, Glob, Grep
---

# 头脑风暴与沟通协议 (Brainstorming & Communication Protocol)

> **MANDATORY (强制):** 用于复杂/模糊的请求、新功能、更新。

---

## 🛑 苏格拉底之门 (强制实施) - SOCRATIC GATE (ENFORCEMENT)

### 何时触发 (When to Trigger)

| 模式                                                         | 行动                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| "Build/Create/Make [thing]" (构建/创建/制作 [东西]) 且无细节 | 🛑 ASK 3 questions (问 3 个问题)                          |
| 复杂功能或架构                                               | 🛑 Clarify before implementing (实施前澄清)               |
| 更新/变更请求                                                | 🛑 Confirm scope (确认范围)                               |
| 模糊的需求                                                   | 🛑 Ask purpose, users, constraints (询问目的、用户、约束) |

### 🚫 MANDATORY (强制): 实施前的 3 个问题

1. **STOP (停)** - 不要开始编码
2. **ASK (问)** - 至少 3 个问题：
    - 🎯 Purpose (目的): 你要解决什么问题？
    - 👥 Users (用户): 谁将使用这个？
    - 📦 Scope (范围): 必须有 vs 最好有？
3. **WAIT (等)** - 在继续之前获得回应

---

## 🧠 动态提问生成 (Dynamic Question Generation)

**⛔ NEVER use static templates (绝不使用静态模板)。** 阅读 `dynamic-questioning.md` 了解原则。

### 核心原则 (Core Principles)

| 原则                                                    | 以此为原则                                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Questions Reveal Consequences (问题揭示后果)**        | 每个问题都连接到一个架构决策                                                  |
| **Context Before Content (内容前的上下文)**             | 首先了解 greenfield (绿地)/feature (功能)/refactor (重构)/debug (调试) 上下文 |
| **Minimum Viable Questions (最小可行问题)**             | 每个问题必须消除实施路径                                                      |
| **Generate Data, Not Assumptions (生成数据，而非假设)** | 不要猜测——用权衡来提问                                                        |

### 问题生成流程 (Question Generation Process)

```
1. Parse request (解析请求) → Extract domain (提取领域), features (功能), scale indicators (规模指标)
2. Identify decision points (识别决策点) → Blocking (阻塞) vs. deferable (可推迟)
3. Generate questions (生成问题) → Priority (优先级): P0 (blocking/阻塞) > P1 (high-leverage/高杠杆) > P2 (nice-to-have/最好有)
4. Format with trade-offs (格式化权衡) → What (什么), Why (为什么), Options (选项), Default (默认)
```

### 问题格式 (MANDATORY/强制)

```markdown
### [优先级] **[决策点]**

**Question:** [清晰的问题]

**Why This Matters:**

- [架构后果]
- [影响: 成本/复杂性/时间线/规模]

**Options:**
| 选项 | 优点 | 缺点 | 适用场景 |
|--------|------|------|----------|
| A | [+] | [-] | [用例] |

**If Not Specified:** [默认值 + 理由]
```

**有关详细的特定领域问题库和算法**，请参阅：`dynamic-questioning.md`

---

## 进度报告 (基于原则) - Progress Reporting (PRINCIPLE-BASED)

**PRINCIPLE (原则):** Transparency builds trust (透明建立信任)。Status must be visible and actionable (状态必须可见且可操作)。

### 状态板格式 (Status Board Format)

| Agent        | 状态       | 当前任务   | 进度        |
| ------------ | ---------- | ---------- | ----------- |
| [Agent Name] | ✅🔄⏳❌⚠️ | [任务描述] | [% 或 计数] |

### 状态图标 (Status Icons)

| 图标 | 含义               | 用法             |
| ---- | ------------------ | ---------------- |
| ✅   | Completed (已完成) | 任务成功完成     |
| 🔄   | Running (运行中)   | 当前正在执行     |
| ⏳   | Waiting (等待中)   | 受阻，等待依赖   |
| ❌   | Error (错误)       | 失败，需要关注   |
| ⚠️   | Warning (警告)     | 潜在问题，不阻塞 |

---

## 错误处理 (基于原则) - Error Handling (PRINCIPLE-BASED)

**PRINCIPLE (原则):** Errors are opportunities for clear communication (错误是清晰沟通的机会)。

### 错误响应模式 (Error Response Pattern)

```
1. Acknowledge the error (承认错误)
2. Explain what happened (user-friendly) (解释发生了什么 (用户友好))
3. Offer specific solutions with trade-offs (提供带有权衡的具体解决方案)
4. Ask user to choose or provide alternative (请用户选择或提供替代方案)
```

### 错误类别 (Error Categories)

| 类别                              | 响应策略                   |
| --------------------------------- | -------------------------- |
| **Port Conflict (端口冲突)**      | 提供替代端口或关闭现有端口 |
| **Dependency Missing (依赖缺失)** | 自动安装或请求权限         |
| **Build Failure (构建失败)**      | 显示具体错误 + 建议修复    |
| **Unclear Error (不清楚的错误)**  | 询问细节：截图，控制台输出 |

---

## 完成消息 (基于原则) - Completion Message (PRINCIPLE-BASED)

**PRINCIPLE (原则):** Celebrate success, guide next steps (庆祝成功，引导后续步骤)。

### 完成结构 (Completion Structure)

```
1. Success confirmation (celebrate briefly) (成功确认 (简短庆祝))
2. Summary of what was done (concrete) (已完成内容的总结 (具体))
3. How to verify/test (actionable) (如何验证/测试 (可操作))
4. Next steps suggestion (proactive) (下一步建议 (主动))
```

---

## 沟通原则 (Communication Principles)

| 原则                        | 实施                                                          |
| --------------------------- | ------------------------------------------------------------- |
| **Concise (简洁)**          | 无不必要的细节，直击要点                                      |
| **Visual (视觉化)**         | 使用表情符号 (✅🔄⏳❌) 以便快速浏览                          |
| **Specific (具体)**         | "~2 分钟" 也就是 "~2 minutes"，不要说 "wait a bit (稍等一下)" |
| **Alternatives (替代方案)** | 受阻时提供多种路径                                            |
| **Proactive (主动)**        | 完成后建议下一步                                              |

---

## 反模式 (Anti-Patterns) (避免/AVOID)

| 反模式                                                             | 为什么                   |
| ------------------------------------------------------------------ | ------------------------ |
| Jumping to solutions before understanding (在理解之前跳到解决方案) | 把时间浪费在错误的问题上 |
| Assuming requirements without asking (假设需求而不询问)            | 创造错误的输出           |
| Over-engineering first version (过度设计第一个版本)                | 延迟价值交付             |
| Ignoring constraints (忽略约束)                                    | 创造不可用的解决方案     |
| "I think" phrases ("我认为" 短语)                                  | 不确定性 → 改为询问      |
