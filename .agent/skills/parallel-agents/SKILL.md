---
name: parallel-agents
description: 多智能体（Multi-agent）编排模式。当多个独立任务需要不同领域的专业知识，或需要多视角的综合分析时使用。
allowed-tools: Read, Glob, Grep
---

# 原生并行智能体

> 通过 Antigravity 内置的智能体工具实现编排（Orchestration）。

---

## 概览（Overview）

本技能旨在通过 Antigravity 的原生智能体系统协调多个专业化 Agent（智能体）。与外部脚本不同，这种方法将所有编排逻辑完全置于 Antigravity 的控制之下。

---

## 何时使用编排

✅ **适用场景：**

- 需要跨多个专业领域的复杂任务。
- 从安全、性能和代码质量等多维度进行代码分析。
- 综合评审（架构 + 安全 + 测试）。
- 需要后端 + 前端 + 数据库协同工作的需求实现。

❌ **不适用场景：**

- 简单的、仅涉及单一领域的任务。
- 快速修复或细微变动。
- 单个 Agent 即可胜任的任务。

---

## 原生 Agent 调用

### 调用单个 Agent

```
请使用 security-auditor 智能体来审阅身份认证逻辑。
```

### 顺序链式调用

```
首先，使用 explorer-agent 探索项目结构。
然后，使用 backend-specialist 审阅 API 端点。
最后，使用 test-engineer 识别测试缺口。
```

### 带上下文传递的调用

```
使用 frontend-specialist 分析 React 组件。
基于该分析结果，让 test-engineer 生成对应的组件测试。
```

### 恢复先前的工作

```
恢复智能体 [agentId] 并继续执行其他需求。
```

---

## 编排模式

### 模式 1：全面分析

```
智能体流：explorer-agent → [领域专家级 Agents] → 综合汇总（Synthesis）

1. explorer-agent：绘制代码库结构图。
2. security-auditor：评估安全态势。
3. backend-specialist：评估 API 质量。
4. frontend-specialist：评估 UI/UX（界面/体验）模式。
5. test-engineer：评估测试覆盖率。
6. 综合汇总所有发现。
```

### 模式 2：功能评审

```
智能体流：[受影响领域的 Agents] → test-engineer

1. 识别受影响的领域（后端？前端？还是二者兼有？）。
2. 调用相关的领域 Agent。
3. 由 test-engineer 验证变更。
4. 综合汇总改进建议。
```

### 模式 3：安全审计

```
智能体流：security-auditor → penetration-tester → 综合汇总

1. security-auditor：进行配置与代码审计。
2. penetration-tester：执行主动漏洞测试。
3. 综合汇总并给出按优先级排列的补救方案。
```

---

## 可用智能体清单

| 智能体（Agent） | 专业领域 | 触发词/场景 |
| -------------- | -------- | ---------- |
| `orchestrator` | 全局协调 | "全面的", "多维度的", "综合的" |
| `security-auditor` | 安全审计 | "安全", "认证", "漏洞" |
| `penetration-tester` | 渗透测试 | "渗透测试", "红队", "exploit（利用）" |
| `backend-specialist` | 后端开发 | "API（接口）", "服务器", "Node.js", "Express" |
| `frontend-specialist` | 前端开发 | "React", "UI（界面）", "组件", "Next.js" |
| `test-engineer` | 测试工程 | "测试", "覆盖率", "TDD（测试驱动开发）" |
| `devops-engineer` | 运维开发 | "部署", "CI/CD（持续集成/交付）", "基础设施" |
| `database-architect` | 数据库架构 | "模式（Schema）", "Prisma", "迁移" |
| `mobile-developer` | 移动端开发 | "React Native", "Flutter", "移动端" |
| `api-designer` | API 设计 | "REST（表述性状态转移）", "GraphQL（图查询语言）", "OpenAPI（开放 API 规范）" |
| `debugger` | 调试专家 | "Bug（缺陷）", "错误", "不工作" |
| `explorer-agent` | 探索发现 | "探索", "映射", "结构" |
| `documentation-writer` | 文档编写 | "写文档", "创建 README（说明文档）", "生成 API 文档" |
| `performance-optimizer` | 性能优化 | "慢", "优化", "分析（Profiling）" |
| `project-planner` | 项目策划 | "计划", "路线图", "里程碑" |
| `seo-specialist` | SEO 专家 | "SEO", "Meta（元）标签", "搜索排名" |
| `game-developer` | 游戏开发 | "游戏", "Unity", "Godot", "Phaser" |

---

## Antigravity 内置智能体

这些智能体与自定义 Agent 协同工作：

| 智能体 | 模型（Model） | 用途 |
| ------ | ------------ | ---- |
| **Explore** | Haiku | 快速的只读代码库搜索 |
| **Plan** | Sonnet | 计划模式下的调研工作 |
| **通用型（General）** | Sonnet | 复杂的、跨步骤的代码修改 |

针对快速搜索，请使用 **Explore**；针对特定领域知识，请使用**自定义智能体**。

---

## 综合汇总协议

当所有 Agent 完成工作后，进行综合汇总：

```markdown
## 编排综合报告

### 任务总结

[已完成的工作内容]

### 各智能体贡献

| 智能体 | 主要发现 |
| ------ | -------- |
| security-auditor | 发现了 X 安全缺陷 |
| backend-specialist | 识别了 Y 优化点 |

### 整合建议

1. **紧急（Critical）**: [来自 Agent A 的问题]
2. **重要（Important）**: [来自 Agent B 的问题]
3. **建议（Nice-to-have）**: [来自 Agent C 的改进点]

### 待办动作

- [ ] 修复紧急安全问题
- [ ] 重构 API 端点
- [ ] 补全缺失的测试
```

---

## 最佳实践

1. **Agent 多样性** —— 共有 17 个专业 Agent 可供编排调用。
2. **逻辑顺序** —— 遵循“探索 → 分析 → 实现 → 测试”的链路。
3. **共享上下文** —— 将关键发现传递给后续的 Agent。
4. **统一汇总** —— 输出一份完整的综合报告，而非零散的结果。
5. **验证变更** —— 凡涉及代码修改，务必由 `test-engineer` 介入。

---

## 核心优势

- ✅ **单次会话** —— 所有 Agent 共享上下文。
- ✅ **AI 自控** —— Claude 自主进行编排协调。
- ✅ **原生集成** —— 与内置的 Explore 和 Plan 智能体无缝配合。
- ✅ **支持恢复** —— 可继续先前 Agent 未完成的工作。
- ✅ **上下文流转** —— 发现结果在 Agent 之间顺畅传递。

---
