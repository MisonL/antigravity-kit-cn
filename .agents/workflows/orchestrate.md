---
description: 协调多 Agent 处理复杂任务。适用于多视角分析、综合评审或需要跨领域协作的任务。
---

# 多 Agent（智能体）编排

你现在处于 **ORCHESTRATION MODE（编排模式）**。你的任务：协调专业 Agent（智能体）解决这个复杂问题。

## 待编排任务
$ARGUMENTS

---

## 🔴 关键：最少 Agent 数量要求

> ⚠️ **ORCHESTRATION（编排）= 至少 3 个不同 Agent（智能体）**
>
> 如果使用少于 3 个 Agent，你就不是在编排，而是在委派。
>
> **完成前校验：**
> - 统计已调用 Agent 数
> - 若 `agent_count < 3` → 停止并继续调用 Agent
> - 单 Agent = 编排失败

### Agent 选择矩阵

| 任务类型 | 必需 Agent（最少） |
| --- | --- |
| **Web App（Web 应用）** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design（界面/设计）** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database（数据库）** | database-architect, backend-specialist, security-auditor |
| **Full Stack（全栈）** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug（调试）** | debugger, explorer-agent, test-engineer |
| **Security（安全）** | security-auditor, penetration-tester, devops-engineer |

---

## 起飞前：模式确认

| 当前模式 | 任务类型 | 动作 |
| --- | --- | --- |
| **plan** | 任意 | ✅ 继续遵循“先规划”流程 |
| **edit** | 简单执行 | ✅ 直接执行 |
| **edit** | 复杂/多文件 | ⚠️ 询问：“该任务需要先规划，是否切换到 plan mode（计划模式）？” |
| **ask** | 任意 | ⚠️ 询问：“已准备编排，是否切换到 edit 或 plan mode（计划模式）？” |

---

## 🔴 严格两阶段编排

### PHASE 1：PLANNING（规划）（串行，禁止并行 Agent）

| 步骤 | Agent | 动作 |
| --- | --- | --- |
| 1 | `project-planner` | 创建 docs/PLAN.md |
| 2 | （可选）`explorer-agent` | 如有需要先做代码库探查 |

> 🔴 **规划阶段禁止其他 Agent！** 仅允许 project-planner 与 explorer-agent。

### ⏸️ 检查点：用户批准

```
PLAN.md 完成后，必须询问：

"✅ 已生成计划：docs/PLAN.md

是否批准？(Y/N)
- Y: 开始实现
- N: 我会先修订计划"
```

> 🔴 **未获得用户明确批准，不得进入 Phase 2（第二阶段）。**

### PHASE 2：IMPLEMENTATION（实现）（批准后可并行）

| 并行分组 | Agents |
| --- | --- |
| Foundation（基础） | `database-architect`, `security-auditor` |
| Core（核心） | `backend-specialist`, `frontend-specialist` |
| Polish（收尾） | `test-engineer`, `devops-engineer` |

> ✅ 用户批准后，可并行调用多个 Agent。

## 可用 Agent（共 17 个）

| Agent | 领域 | 使用场景 |
| --- | --- | --- |
| `project-planner` | 规划 | 任务拆解、生成 PLAN.md |
| `explorer-agent` | 发现 | 代码库映射与发现 |
| `frontend-specialist` | UI/UX | React、Vue、CSS、HTML |
| `backend-specialist` | 后端 | API、Node.js、Python |
| `database-architect` | 数据 | SQL、NoSQL、Schema |
| `security-auditor` | 安全 | 漏洞、鉴权 |
| `penetration-tester` | 安全 | 主动测试 |
| `test-engineer` | 测试 | Unit、E2E、Coverage |
| `devops-engineer` | 运维 | CI/CD、Docker、Deploy |
| `mobile-developer` | 移动端 | React Native、Flutter |
| `performance-optimizer` | 性能 | Lighthouse、Profiling |
| `seo-specialist` | SEO | Meta、Schema、Rankings |
| `documentation-writer` | 文档 | README、API 文档 |
| `debugger` | 调试 | 错误分析 |
| `game-developer` | 游戏 | Unity、Godot |
| `orchestrator` | 协调 | 跨 Agent 协调 |

---

## 编排协议

### Step 1：分析任务领域

识别该任务涉及的全部领域：

```
□ Security（安全）     → security-auditor, penetration-tester
□ Backend/API（后端/API）  → backend-specialist
□ Frontend/UI（前端/UI）  → frontend-specialist
□ Database（数据库）     → database-architect
□ Testing（测试）        → test-engineer
□ DevOps（运维）         → devops-engineer
□ Mobile（移动端）       → mobile-developer
□ Performance（性能）    → performance-optimizer
□ SEO                   → seo-specialist
□ Planning（规划）       → project-planner
```

### Step 2：识别阶段

| 计划是否存在 | 动作 |
| --- | --- |
| 否 `docs/PLAN.md` | → 进入 PHASE 1（仅规划） |
| 是 `docs/PLAN.md` + 已获用户批准 | → 进入 PHASE 2（实现） |

### Step 3：按阶段执行

**PHASE 1（规划）：**
```
使用 project-planner Agent 创建 PLAN.md
→ 计划完成后立即停止
→ 请求用户批准
```

**PHASE 2（实现，批准后）：**
```
并行调用 Agent：
使用 frontend-specialist Agent 处理 [task]
使用 backend-specialist Agent 处理 [task]
使用 test-engineer Agent 处理 [task]
```

**🔴 关键：上下文传递（强制）**

调用任何子 Agent 时，必须携带：

1. **Original User Request（用户原始需求）：** 用户需求全文
2. **Decisions Made（已确定决策）：** 用户对苏格拉底式问题的所有回答
3. **Previous Agent Work（前序 Agent 工作）：** 之前 Agent 的工作摘要
4. **Current Plan State（当前计划状态）：** 若工作区存在计划文件，必须附带

**完整上下文示例：**

```
使用 project-planner Agent 创建 PLAN.md：

**上下文：**
- 用户需求："面向学生的社交平台，使用 mock 数据"
- 已确定决策：Tech=Vue 3, Layout=Grid Widgets（网格组件）, Auth=Mock（模拟）, Design=青春且动感
- 前序工作：Orchestrator 提了 6 个问题，用户选择了所有选项
- 当前计划：playful-roaming-dream.md 已存在于工作区并包含初始结构

**任务：** 基于以上决策生成详细 PLAN.md。不要根据文件夹名称推断。
```

> ⚠️ **违规：** 调用子 Agent 不带完整上下文，将导致错误假设。

### Step 4：验证（强制）

最后一个 Agent 必须执行合适的验证脚本：

```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### Step 5：结果综合

将所有 Agent 输出汇总为统一报告。

---

## 输出格式

```markdown
## 🎼 Orchestration Report（编排报告）

### 任务
[原始任务摘要]

### 模式
[当前 Antigravity Agent 模式：plan/edit/ask]

### 已调用 Agent（最少 3 个）
| # | Agent | 关注领域 | 状态 |
|---|-------|----------|------|
| 1 | project-planner | 任务拆解 | ✅ |
| 2 | frontend-specialist | UI 实现 | ✅ |
| 3 | test-engineer | 验证脚本 | ✅ |

### 已执行的验证脚本
- [x] security_scan.py → 通过/失败
- [x] lint_runner.py → 通过/失败

### 关键发现
1. **[Agent 1]**: 发现
2. **[Agent 2]**: 发现
3. **[Agent 3]**: 发现

### 交付物
- [ ] 已创建 PLAN.md
- [ ] 已实现代码
- [ ] 测试通过
- [ ] 脚本已验证

### 总结
[对所有 Agent 工作的单段综合摘要]
```

---

## 🔴 退出门槛

在完成编排之前，确认：

1. ✅ **Agent 数量：** `invoked_agents >= 3`
2. ✅ **脚本已执行：** 至少运行 `security_scan.py`
3. ✅ **报告已生成：** Orchestration Report（编排报告）中列出全部 Agent

> **如果任一检查失败 → 不得标记编排完成。继续调用 Agent 或运行脚本。**

---

**立即开始编排。选择 3 个以上 Agent，顺序执行，运行验证脚本，并综合结果。**
