---
name: parallel-agents
description: 多智能体协同编排模式、任务分解与合并。当多个独立任务需要不同领域的专业知识，或需要多视角的综合分析时使用。
allowed-tools: Read, Glob, Grep
---

# Native Parallel Agents - 原生并行 Agents

> 通过 Antigravity 内置的 Agent 工具进行编排

## 概述 (Overview)

此 Skill 能够通过 Antigravity 的原生 Agent 系统协调多个专业 Agent。与外部脚本不同，这种方法将所有编排保留在 Antigravity 的控制范围内。

## 何时使用编排 (Orchestration)

✅ **适合：**

- 需要多种专业领域知识的复杂任务
- 从安全、性能和质量角度进行代码分析
- 综合审查 (架构 + 安全 + 测试)
- 需要后端 + 前端 + 数据库工作的特性实现

❌ **不适合：**

- 简单的、单一领域的任务
- 快速修复或小改动
- 一个 Agent 就足够的任务

---

## 原生 Agent 调用 (Native Agent Invocation)

### 单个 Agent

```
使用 security-auditor agent 审查认证
```

### 顺序链 (Sequential Chain)

```
首先，使用 explorer-agent 发现项目结构。
然后，使用 backend-specialist 审查 API 端点。
最后，使用 test-engineer 识别测试缺口。
```

### 带上下文传递 (With Context Passing)

```
使用 frontend-specialist 分析 React 组件。
基于这些发现，让 test-engineer 生成组件测试。
```

### 恢复先前工作

```
恢复 agent [agentId] 并继续额外的需求。
```

---

## 编排模式 (Orchestration Patterns)

### 模式 1: 综合分析

```
Agents: explorer-agent → [domain-agents] → synthesis

1. explorer-agent: 映射代码库结构
2. security-auditor: 安全态势
3. backend-specialist: API 质量
4. frontend-specialist: UI/UX 模式
5. test-engineer: 测试覆盖率
6. 综合所有发现
```

### 模式 2: 特性审查

```
Agents: affected-domain-agents → test-engineer

1. 识别受影响的领域 (后端？前端？两者？)
2. 调用相关领域的 Agent
3. test-engineer 验证变更
4. 综合建议
```

### 模式 3: 安全审计

```
Agents: security-auditor → penetration-tester → synthesis

1. security-auditor: 配置和代码审查
2. penetration-tester: 主动漏洞测试
3. 综合并确定修复优先级
```

---

## 可用 Agents (Available Agents)

| Agent                   | 专业领域 | 触发短语                                           |
| ----------------------- | -------- | -------------------------------------------------- |
| `orchestrator`          | 协调     | "comprehensive", "multi-perspective"               |
| `security-auditor`      | 安全     | "security", "auth", "vulnerabilities"              |
| `penetration-tester`    | 安全测试 | "pentest", "red team", "exploit"                   |
| `backend-specialist`    | 后端     | "API", "server", "Node.js", "Express"              |
| `frontend-specialist`   | 前端     | "React", "UI", "components", "Next.js"             |
| `test-engineer`         | 测试     | "tests", "coverage", "TDD"                         |
| `devops-engineer`       | DevOps   | "deploy", "CI/CD", "infrastructure"                |
| `database-architect`    | 数据库   | "schema", "Prisma", "migrations"                   |
| `mobile-developer`      | 移动端   | "React Native", "Flutter", "mobile"                |
| `api-designer`          | API 设计 | "REST", "GraphQL", "OpenAPI"                       |
| `debugger`              | 调试     | "bug", "error", "not working"                      |
| `explorer-agent`        | 探索发现 | "explore", "map", "structure"                      |
| `documentation-writer`  | 文档     | "write docs", "create README", "generate API docs" |
| `performance-optimizer` | 性能     | "slow", "optimize", "profiling"                    |
| `project-planner`       | 计划     | "plan", "roadmap", "milestones"                    |
| `seo-specialist`        | SEO      | "SEO", "meta tags", "search ranking"               |
| `game-developer`        | 游戏开发 | "game", "Unity", "Godot", "Phaser"                 |

---

## Antigravity 内置 Agents

这些可以与自定义 Agent 并行工作：

| Agent               | 模型   | 用途               |
| ------------------- | ------ | ------------------ |
| **Explore**         | Haiku  | 快速只读代码库搜索 |
| **Plan**            | Sonnet | 计划模式下的研究   |
| **General-purpose** | Sonnet | 复杂的多步修改     |

使用 **Explore** 进行快速搜索，使用 **自定义 agents** 获取领域专业知识。

---

## 综合协议 (Synthesis Protocol)

所有 Agent 完成后，进行综合：

```markdown
## 编排综合 (Orchestration Synthesis)

### 任务总结

[完成了什么]

### Agent 贡献

| Agent              | 发现     |
| ------------------ | -------- |
| security-auditor   | 发现了 X |
| backend-specialist | 识别了 Y |

### 综合建议

1. **Critical**: [来自 Agent A 的问题]
2. **Important**: [来自 Agent B 的问题]
3. **Nice-to-have**: [来自 Agent C 的增强]

### 行动项

- [ ] 修复关键安全问题
- [ ] 重构 API 端点
- [ ] 添加缺失的测试
```

---

## 最佳实践 (Best Practices)

1. **可用 Agents** - 有 17 个专业 Agent 可供编排
2. **逻辑顺序** - 发现 → 分析 → 实现 → 测试
3. **共享上下文** - 将相关发现传递给后续 Agent
4. **单一综合** - 一个统一的报告，而不是分散的输出
5. **验证变更** - 代码修改总是包含 test-engineer

---

## 关键优势 (Key Benefits)

- ✅ **单一会话** - 所有 Agent 共享上下文
- ✅ **AI 控制** - Claude 自主编排
- ✅ **原生集成** - 与内置 Explore, Plan Agent 协同工作
- ✅ **支持恢复** - 可以继续之前的 Agent 工作
- ✅ **上下文传递** - 发现结果在 Agent 之间流动
