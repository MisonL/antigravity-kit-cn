---
name: parallel-agents
description: 多智能体 (Multi-agent) 编排模式。当多个独立任务需要不同领域的专业知识，或需要多视角的综合分析时使用。
allowed-tools: Read, Glob, Grep
---

# 原生并行智能体 (Parallel Agents)

> 通过 Antigravity (反重力框架) 内置的智能体 (Agent) 工具进行编排

---

## 概述

此技能 (Skill) 能够通过 Antigravity 的原生智能体系统协调多个专业智能体。与外部脚本不同，这种方法将所有编排 (Orchestration) 保留在 Antigravity 的控制范围内。

## 何时使用编排

✅ **适合：**

- 需要多种专业领域知识的复杂任务
- 从安全、性能和质量角度进行代码分析
- 综合审查 (架构 + 安全 + 测试)
- 需要后端 + 前端 + 数据库工作的特性实现

❌ **不适合：**

- 简单的、单一领域的任务
- 快速修复或小改动
- 一个智能体就足够的任务

---

## 原生智能体调用

### 单个智能体

```
使用 security-auditor 智能体审查认证流程
```

### 顺序链

```
首先，使用 explorer-agent 发现项目结构。
然后，使用 backend-specialist 审查 API 端点。
最后，使用 test-engineer 识别测试缺口。
```

### 带上下文传递

```
使用 frontend-specialist 分析 React 组件。
基于这些发现，让 test-engineer 生成组件测试。
```

### 恢复先前工作

```
恢复智能体 [agentId] 并继续执行额外的需求。
```

---

## 编排模式

### 模式 1：综合分析

```
智能体：explorer-agent → [domain-agents] → 综合 (synthesis)

1. explorer-agent：映射代码库结构
2. security-auditor：安全态势分析
3. backend-specialist：API 质量审查
4. frontend-specialist：UI/UX 模式分析
5. test-engineer：测试覆盖率检查
6. 综合所有发现
```

### 模式 2：特性审查

```
智能体：affected-domain-agents → test-engineer

1. 识别受影响的领域（后端？前端？两者？）
2. 调用相关领域的智能体
3. test-engineer 验证变更
4. 综合建议
```

### 模式 3：安全审计

```
智能体：security-auditor → penetration-tester → 综合

1. security-auditor：配置与代码审查
2. penetration-tester：主动漏洞测试
3. 综合并确定修复优先级
```

---

## 可用智能体

| 智能体                  | 专业领域 | 触发短语                                 |
| ----------------------- | -------- | ---------------------------------------- |
| `orchestrator`          | 协调     | "综合", "多视角"                         |
| `security-auditor`      | 安全     | "安全", "认证", "漏洞"                   |
| `penetration-tester`    | 安全测试 | "渗透测试", "红队", "利用"               |
| `backend-specialist`    | 后端     | "API", "服务器", "Node.js", "Express"    |
| `frontend-specialist`   | 前端     | "React", "UI", "组件", "Next.js"         |
| `test-engineer`         | 测试     | "测试", "覆盖率", "TDD"                  |
| `devops-engineer`       | DevOps   | "部署", "CI/CD", "基础设施"              |
| `database-architect`    | 数据库   | "模式", "Prisma", "迁移"                 |
| `mobile-developer`      | 移动端   | "React Native", "Flutter", "移动"        |
| `api-designer`          | API 设计 | "REST", "GraphQL", "OpenAPI"             |
| `debugger`              | 调试     | "Bug", "错误", "不工作"                  |
| `explorer-agent`        | 发现     | "探索", "映射", "结构"                   |
| `documentation-writer`  | 文档     | "写文档", "创建 README", "生成 API 文档" |
| `performance-optimizer` | 性能     | "慢", "优化", "分析"                     |
| `project-planner`       | 计划     | "计划", "路线图", "里程碑"               |
| `seo-specialist`        | SEO      | "SEO", "元标签", "搜索排名"              |
| `game-developer`        | 游戏开发 | "游戏", "Unity", "Godot", "Phaser"       |

---

## Antigravity 内置智能体

这些可以与自定义智能体并行工作：

| 智能体              | 模型   | 用途               |
| ------------------- | ------ | ------------------ |
| **Explore**         | Haiku  | 快速只读代码库搜索 |
| **Plan**            | Sonnet | 计划模式下的研究   |
| **General-purpose** | Sonnet | 复杂的多步修改     |

使用 **Explore** 进行快速搜索，使用 **自定义智能体** 获取领域专业知识。

---

## 综合协议

所有智能体完成后，进行综合：

```markdown
## 编排综合

### 任务总结

[完成了什么工作]

### 智能体贡献

| 智能体             | 发现     |
| ------------------ | -------- |
| security-auditor   | 发现了 X |
| backend-specialist | 识别了 Y |

### 综合建议

1. **关键 (Critical)**: [来自智能体 A 的问题]
2. **重要 (Important)**: [来自智能体 B 的问题]
3. **优化 (Nice-to-have)**: [来自智能体 C 的增强]

### 行动项

- [ ] 修复关键安全问题
- [ ] 重构 API 端点
- [ ] 添加缺失的测试
```

---

## 最佳实践

1. **可用智能体** - 可以编排 17 个专业智能体
2. **逻辑顺序** - 发现 → 分析 → 实现 → 测试
3. **共享上下文** - 将相关发现传递给后续智能体
4. **单一综合** - 生成一个统一报告，而非分散的输出
5. **验证变更** - 代码修改总是包含 test-engineer

---

## 关键优势

- ✅ **单一会话** - 所有智能体共享上下文
- ✅ **AI 控制** - Claude 自主编排
- ✅ **原生集成** - 与内置 Explore, Plan 智能体协同工作
- ✅ **恢复支持** - 可以继续之前的智能体工作
- ✅ **上下文传递** - 发现结果在智能体之间流动
