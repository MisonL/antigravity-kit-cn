---
description: 协调多 Agent 处理复杂任务。适用于多视角分析、综合评审、或需要跨领域协作的任务。
---

# 多 Agent 编排 (Multi-Agent Orchestration)

你现在处于 **ORCHESTRATION MODE**。任务目标：协调专家 Agent 解决复杂问题。

## 待编排任务 (Task to Orchestrate)
$ARGUMENTS

---

## 🔴 关键要求：最少 Agent 数量

> ⚠️ **ORCHESTRATION = 至少 3 个不同 Agent**
> 
> 少于 3 个 Agent 不叫编排，只是委派。
> 
> **完成前校验：**
> - 统计已调用 Agent 数
> - 若 `agent_count < 3` → 停止并继续调用 Agent
> - 单 Agent = 编排失败

### Agent 选择矩阵 (Agent Selection Matrix)

| Task Type | REQUIRED Agents (minimum) |
|-----------|---------------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## 起飞前检查：模式确认 (Pre-Flight Mode Check)

| Current Mode | Task Type | Action |
|--------------|-----------|--------|
| **plan** | Any | ✅ 按规划优先流程继续 |
| **edit** | Simple execution | ✅ 直接执行 |
| **edit** | Complex/multi-file | ⚠️ 询问："该任务需要先规划，是否切换到 plan mode？" |
| **ask** | Any | ⚠️ 询问："可以开始编排，是否切换到 edit 或 plan mode？" |

---

## 🔴 严格两阶段编排 (STRICT 2-PHASE ORCHESTRATION)

### PHASE 1：规划阶段（串行，禁止并行 Agent）

| Step | Agent | Action |
|------|-------|--------|
| 1 | `project-planner` | 生成 `docs/PLAN.md` |
| 2 | （可选）`explorer-agent` | 如有需要先做代码库探查 |

> 🔴 **规划阶段禁止其他 Agent！** 仅允许 project-planner 与 explorer-agent。

### ⏸️ 检查点：用户批准 (User Approval)

```
PLAN.md 完成后，必须询问：

"✅ 已生成计划：docs/PLAN.md

是否批准？(Y/N)
- Y: 开始实现
- N: 我会先修订计划"
```

> 🔴 **未获得用户明确批准，不得进入 Phase 2。**

### PHASE 2：实现阶段（批准后可并行）

| Parallel Group | Agents |
|----------------|--------|
| Foundation | `database-architect`, `security-auditor` |
| Core | `backend-specialist`, `frontend-specialist` |
| Polish | `test-engineer`, `devops-engineer` |

> ✅ 用户批准后，可并行调用多个 Agent。

## 可用 Agent（共 17 个）

| Agent | Domain | Use When |
|-------|--------|----------|
| `project-planner` | Planning | 任务拆解、生成 PLAN.md |
| `explorer-agent` | Discovery | 代码库映射与发现 |
| `frontend-specialist` | UI/UX | React、Vue、CSS、HTML |
| `backend-specialist` | Server | API、Node.js、Python |
| `database-architect` | Data | SQL、NoSQL、Schema |
| `security-auditor` | Security | 漏洞、安全设计、鉴权 |
| `penetration-tester` | Security | 主动攻防测试 |
| `test-engineer` | Testing | 单测、E2E、覆盖率 |
| `devops-engineer` | Ops | CI/CD、Docker、部署 |
| `mobile-developer` | Mobile | React Native、Flutter |
| `performance-optimizer` | Speed | Lighthouse、Profiling |
| `seo-specialist` | SEO | Meta、Schema、排名 |
| `documentation-writer` | Docs | README、API 文档 |
| `debugger` | Debug | 错误分析与排障 |
| `game-developer` | Games | Unity、Godot |
| `orchestrator` | Meta | 跨 Agent 协调 |

---

## 编排协议 (Orchestration Protocol)

### Step 1：分析任务领域 (Analyze Task Domains)
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

### Step 2：识别阶段 (Phase Detection)

| If Plan Exists | Action |
|----------------|--------|
| NO `docs/PLAN.md` | → 进入 PHASE 1（仅规划） |
| YES `docs/PLAN.md` + user approved | → 进入 PHASE 2（实现） |

### Step 3：按阶段执行 (Execute Based on Phase)

**PHASE 1（规划）：**
```
调用 project-planner 生成 PLAN.md
→ 计划完成后立即停止
→ 请求用户批准
```

**PHASE 2（实现，批准后）：**
```
并行调用 Agent：
Use the frontend-specialist agent to [task]
Use the backend-specialist agent to [task]
Use the test-engineer agent to [task]
```

**🔴 关键：上下文传递（强制）(Context Passing)**

调用任何子 Agent 时，必须携带：

1. **Original User Request：** 用户原始需求全文
2. **Decisions Made：** 用户对苏格拉底式问题的所有回答
3. **Previous Agent Work：** 前序 Agent 工作摘要
4. **Current Plan State：** 若工作区存在计划文件，必须附带

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

> ⚠️ **违规：** 调用子 Agent 不带完整上下文，会导致错误假设。


### Step 4：验证（强制）(Verification)
最后一个 Agent 必须执行合适的验证脚本：
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### Step 5：结果综合 (Synthesize Results)
将所有 Agent 输出汇总为统一报告。

---

## 输出格式 (Output Format)

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

## 🔴 退出闸门 (EXIT GATE)

结束编排前，必须确认：

1. ✅ **Agent Count:** `invoked_agents >= 3`
2. ✅ **Scripts Executed:** 至少执行过 `security_scan.py`
3. ✅ **Report Generated:** 已生成含全部 Agent 的 Orchestration Report

> **任一项失败 → 不得标记编排完成。必须补调用 Agent 或补跑脚本。**

---

**现在开始编排：选择 3+ Agent，按阶段执行，运行验证脚本，输出综合结果。**
