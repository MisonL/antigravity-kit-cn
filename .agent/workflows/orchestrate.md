---
description: 为复杂任务协调多个 agent。用于多视角分析、综合评审或需要多领域协作的任务。
---

# 多 Agent 编排

你现在处于 **ORCHESTRATION MODE**。你的任务：协调专业 agent 共同解决这个复杂问题。

## 待编排任务
$ARGUMENTS

---

## 🔴 关键：最少 Agent 数要求

> ⚠️ **ORCHESTRATION = 至少 3 个不同 agent**
>
> 如果你使用少于 3 个 agent，这不叫编排，只是委派。
>
> **完成前必须校验：**
> - 统计已调用 agent 数
> - 若 `agent_count < 3` → 立即停止并继续调用更多 agent
> - 只用单个 agent = 编排失败

### Agent 选择矩阵

| 任务类型 | 必需 Agent（最少） |
|-----------|-------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## 起飞前检查：模式校验

| 当前模式 | 任务类型 | 动作 |
|--------------|-----------|--------|
| **plan** | 任意 | ✅ 采用先规划策略继续 |
| **edit** | 简单执行 | ✅ 直接继续 |
| **edit** | 复杂/多文件 | ⚠️ 询问：“该任务需要先规划。切到 plan 模式吗？” |
| **ask** | 任意 | ⚠️ 询问：“已可开始编排。切到 edit 或 plan 模式吗？” |

---

## 🔴 严格两阶段编排

### PHASE 1：规划阶段（串行 - 禁止并行 agent）

| 步骤 | Agent | 动作 |
|------|-------|--------|
| 1 | `project-planner` | 创建 docs/PLAN.md |
| 2 | （可选）`explorer-agent` | 必要时做代码库探索 |

> 🔴 **规划阶段禁止其他 agent！** 仅允许 project-planner 与 explorer-agent。

### ⏸️ 检查点：用户批准

```
After PLAN.md is complete, ASK:

"✅ Plan created: docs/PLAN.md

Do you approve? (Y/N)
- Y: Start implementation
- N: I'll revise the plan"
```

> 🔴 **未获得用户明确批准，禁止进入 Phase 2！**

### PHASE 2：实施阶段（批准后并行 agent）

| 并行组 | Agents |
|----------------|--------|
| Foundation | `database-architect`, `security-auditor` |
| Core | `backend-specialist`, `frontend-specialist` |
| Polish | `test-engineer`, `devops-engineer` |

> ✅ 用户批准后，再并行调用多个 agent。

## 可用 Agent（共 17 个）

| Agent | 领域 | 使用场景 |
|-------|--------|----------|
| `project-planner` | 规划 | 任务拆解、PLAN.md |
| `explorer-agent` | 探索 | 代码库映射 |
| `frontend-specialist` | UI/UX | React、Vue、CSS、HTML |
| `backend-specialist` | 服务端 | API、Node.js、Python |
| `database-architect` | 数据 | SQL、NoSQL、Schema |
| `security-auditor` | 安全 | 漏洞、认证 |
| `penetration-tester` | 安全 | 主动渗透测试 |
| `test-engineer` | 测试 | 单测、E2E、覆盖率 |
| `devops-engineer` | 运维 | CI/CD、Docker、部署 |
| `mobile-developer` | 移动端 | React Native、Flutter |
| `performance-optimizer` | 性能 | Lighthouse、Profiling |
| `seo-specialist` | SEO | Meta、Schema、排名 |
| `documentation-writer` | 文档 | README、API 文档 |
| `debugger` | 调试 | 错误分析 |
| `game-developer` | 游戏 | Unity、Godot |
| `orchestrator` | 元协调 | 协同编排 |

---

## 编排协议

### Step 1：分析任务领域
识别该任务涉及的全部领域：
```
□ Security     → security-auditor, penetration-tester
□ Backend/API  → backend-specialist
□ Frontend/UI  → frontend-specialist
□ Database     → database-architect
□ Testing      → test-engineer
□ DevOps       → devops-engineer
□ Mobile       → mobile-developer
□ Performance  → performance-optimizer
□ SEO          → seo-specialist
□ Planning     → project-planner
```

### Step 2：阶段判定

| 若计划存在 | 动作 |
|----------------|--------|
| 无 `docs/PLAN.md` | → 进入 PHASE 1（仅规划） |
| 有 `docs/PLAN.md` 且用户已批准 | → 进入 PHASE 2（实施） |

### Step 3：按阶段执行

**PHASE 1（规划）：**
```
Use the project-planner agent to create PLAN.md
→ STOP after plan is created
→ ASK user for approval
```

**PHASE 2（实施 - 批准后）：**
```
Invoke agents in PARALLEL:
Use the frontend-specialist agent to [task]
Use the backend-specialist agent to [task]
Use the test-engineer agent to [task]
```

**🔴 关键：上下文传递（强制）**

调用任意子 agent 时，必须包含：

1. **原始用户请求：** 用户提出的完整文本
2. **已做决策：** 用户对苏格拉底问题的所有回答
3. **前序 agent 产出：** 之前 agent 已做工作的摘要
4. **当前计划状态：** 若工作区中存在计划文件，必须一并传递

**完整上下文示例：**
```
Use the project-planner agent to create PLAN.md:

**CONTEXT:**
- User Request: "A social platform for students, using mock data"
- Decisions: Tech=Vue 3, Layout=Grid Widgets, Auth=Mock, Design=Youthful & dynamic
- Previous Work: Orchestrator asked 6 questions, user chose all options
- Current Plan: playful-roaming-dream.md exists in workspace with initial structure

**TASK:** Create detailed PLAN.md based on ABOVE decisions. Do NOT infer from folder name.
```

> ⚠️ **违规：** 不带完整上下文调用子 agent，会导致错误假设！


### Step 4：验证（强制）
最后一个 agent 必须运行适配的验证脚本：
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### Step 5：综合结果
将所有 agent 输出汇总为统一报告。

---

## 输出格式

```markdown
## 🎼 Orchestration Report

### Task
[Original task summary]

### Mode
[Current Antigravity Agent mode: plan/edit/ask]

### Agents Invoked (MINIMUM 3)
| # | Agent | Focus Area | Status |
|---|-------|------------|--------|
| 1 | project-planner | Task breakdown | ✅ |
| 2 | frontend-specialist | UI implementation | ✅ |
| 3 | test-engineer | Verification scripts | ✅ |

### Verification Scripts Executed
- [x] security_scan.py → Pass/Fail
- [x] lint_runner.py → Pass/Fail

### Key Findings
1. **[Agent 1]**: Finding
2. **[Agent 2]**: Finding
3. **[Agent 3]**: Finding

### Deliverables
- [ ] PLAN.md created
- [ ] Code implemented
- [ ] Tests passing
- [ ] Scripts verified

### Summary
[One paragraph synthesis of all agent work]
```

---

## 🔴 退出闸门

在结束编排前，必须核对：

1. ✅ **Agent 数量：** `invoked_agents >= 3`
2. ✅ **脚本已执行：** 至少执行过 `security_scan.py`
3. ✅ **报告已生成：** Orchestration Report 中列出全部 agent

> **任一检查失败 → 不得标记编排完成。继续调用 agent 或执行脚本。**

---

**现在开始编排。选择 3+ 个 agent，按阶段执行，运行验证脚本，并综合结果。**
