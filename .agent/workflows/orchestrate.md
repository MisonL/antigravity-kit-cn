---
description: 为复杂任务协调多个代理。用于多视角分析、综合评审或需要多领域协作的任务。
---

# 多智能体编排 (Multi-Agent Orchestration)

你现在处于 **编排模式 (ORCHESTRATION MODE)**。你的任务是：协调多个专家代理 (Agents) 来解决这一复杂问题。

## 待编排任务

$ARGUMENTS

---

## 🔴 关键：最小代理数量要求

> ⚠️ **编排 = 至少调用 3 个不同的专家代理**
>
> 如果调用的代理少于 3 个，那你不是在“编排”，而仅仅是在“指派”。
>
> **完成前的校验：**
>
> - 清点已调用的代理数量。
> - 如果 `agent_count < 3` → 停止并调用更多相关代理。
> - 仅调用单个代理 = 编排工作流失败。

### 代理选型矩阵 (Agent Selection Matrix)

| 任务类型     | 必须调用的代理 (最少 3 个)                                                |
| ------------ | ------------------------------------------------------------------------- |
| **Web 应用** | frontend-specialist, backend-specialist, test-engineer                    |
| **API 开发** | backend-specialist, security-auditor, test-engineer                       |
| **UI/设计**  | frontend-specialist, seo-specialist, performance-optimizer                |
| **数据库**   | database-architect, backend-specialist, security-auditor                  |
| **全栈开发** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **故障调试** | debugger, explorer-agent, test-engineer                                   |
| **安全审计** | security-auditor, penetration-tester, devops-engineer                     |

---

## 起飞前检查：模式校验 (Mode Check)

| 当前模式        | 任务类型    | 动作指令                                                |
| --------------- | ----------- | ------------------------------------------------------- |
| **计划 (plan)** | 任何类型    | ✅ 按照“计划优先 (planning-first)”的方法进行            |
| **编辑 (edit)** | 简单执行    | ✅ 直接进行编排执行                                     |
| **编辑 (edit)** | 复杂/多文件 | ⚠️ 提问：“此任务需要详细规划。是否切换到计划模式？”     |
| **提问 (ask)**  | 任何类型    | ⚠️ 提问：“准备好进行编排了。是否切换到编辑或计划模式？” |

---

## 🔴 严格的两阶段编排协议

### 阶段 1：规划 (串行执行 - 禁止并行调用代理)

| 步骤 | 执行代理                | 动作内容                     |
| ---- | ----------------------- | ---------------------------- |
| 1    | `project-planner`       | 创建 `docs/PLAN.md` 计划文件 |
| 2    | (可选) `explorer-agent` | 如有必要，进行代码库探索     |

> 🔴 **规则**：规划阶段**严禁**调用其它代理！仅限项目规划专家和探索者代理。

### ⏸️ 检查点：获老板批准

```
当 PLAN.md 完成后，必须提问：
“✅ 计划已创建：docs/PLAN.md

老板，您批准该计划吗？(Y/N)
- Y：开始实施
- N：我将根据意见修改计划”
```

> 🔴 **严禁**在未获得老板明确批准的情况下进入阶段 2！

### 阶段 2：实施 (获批后并行调用多个代理)

| 并行组                | 涉及代理                                    |
| --------------------- | ------------------------------------------- |
| 基础设施 (Foundation) | `database-architect`, `security-auditor`    |
| 核心业务 (Core)       | `backend-specialist`, `frontend-specialist` |
| 完善打磨 (Polish)     | `test-engineer`, `devops-engineer`          |

> ✅ 获得老板批准后，同时 (PARALLEL) 调用多个代理进行工作。

## 可用专家代理列表 (共 17 个)

| 代理名称                | 领域范围     | 何时调用                         |
| ----------------------- | ------------ | -------------------------------- |
| `project-planner`       | 项目规划     | 任务拆解、`PLAN.md` 编写         |
| `explorer-agent`        | 探索者       | 代码库映射与调研                 |
| `frontend-specialist`   | 前端专家     | React, Vue, CSS, HTML 实现       |
| `backend-specialist`    | 后端专家     | API, Node.js, Python 实现        |
| `database-architect`    | 数据库架构师 | SQL, NoSQL, Schema 设计          |
| `security-auditor`      | 安全审查员   | 漏洞审查、Auth (认证) 校验       |
| `penetration-tester`    | 渗透测试员   | 主动防御及漏洞测试               |
| `test-engineer`         | 测试工程师   | 单元测试、E2E 覆盖率             |
| `devops-engineer`       | 运维工程师   | CI/CD, Docker, 部署配置          |
| `mobile-developer`      | 移动端开发   | React Native, Flutter 处理       |
| `performance-optimizer` | 性能优化专家 | Lighthouse, 性能分析 (Profiling) |
| `seo-specialist`        | SEO 专家     | 元标签、Schema、关键词排名       |
| `documentation-writer`  | 文档编写者   | README, API 参考文档             |
| `debugger`              | 调试专家     | 深度错误分析与根因定位           |
| `game-developer`        | 游戏开发专家 | Unity, Godot 游戏引擎处理        |
| `orchestrator`          | 编排者       | 负责全局协调的元代理             |

---

## 编排执行协议

### 步骤 1：分析任务领域

识别任务涉及的所有维度：

```
□ 安全性 (Security) → security-auditor, penetration-tester
□ 后端/API          → backend-specialist
□ 前端/UI            → frontend-specialist
□ 数据库             → database-architect
... (其它维度)
```

### 步骤 2：阶段识别

| 是否存在计划文件           | 接下来的动作             |
| -------------------------- | ------------------------ |
| 缺失 `docs/PLAN.md`        | → 进入阶段 1（仅限规划） |
| 已有 `docs/PLAN.md` + 获批 | → 进入阶段 2（实施阶段） |

### 步骤 3：根据阶段执行任务

**阶段 1 (规划)：**

```
调用 project-planner 代理创建 PLAN.md
→ 计划创建后停止
→ 征求老板批准
```

**阶段 2 (实施 - 批准后)：**

```
并行 (PARALLEL) 调用多个相关代理：
使用 frontend-specialist 代理处理 [任务]
使用 backend-specialist 代理处理 [任务]
使用 test-engineer 代理处理 [任务]
```

**🔴 关键：上下文传递 (强制项)**

在调用任何子代理 (Subagent) 时，你**必须**包含：

1. **原始用户请求**：老板所提要求的完整描述。
2. **已做的决策**：所有通过苏格拉底之门 (Socratic Gate) 确认的答案。
3. **前序代理工作**：之前调用的代理完成了哪些工作。
4. **当前计划状态**：如果工作区存在计划文件，务必包含其具体内容。

---

### 步骤 4：验证 (强制项)

最后一个执行的代理必须运行相关的验证脚本：

```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### 步骤 5：综合产出

将所有代理的执行结果汇总为统一的汇报文档。

---

## 输出格式 (Output Format)

```markdown
## 🎼 编排执行报告 (Orchestration Report)

### 任务概要

[原始任务的简要汇总]

### 当前模式 (Mode)

[Agent 模式：plan/edit/ask]

### 已调用的代理 (最少 3 个)

| #   | 代理名称            | 关注领域       | 状态 |
| --- | ------------------- | -------------- | ---- |
| 1   | project-planner     | 任务拆解与规划 | ✅   |
| 2   | frontend-specialist | UI 界面实现    | ✅   |
| 3   | test-engineer       | 运行验证脚本   | ✅   |

### 已执行的验证脚本

- [x] security_scan.py → 通过/未通过
- [x] lint_runner.py → 通过/未通过

### 关键发现 (Key Findings)

1. **[代理 1]**：发现汇总
2. **[代理 2]**：发现汇总

### 交付成果 (Deliverables)

- [ ] PLAN.md 已创建
- [ ] 代码已实施完成
- [ ] 测试用例通过
- [ ] 脚本验证已完成

### 总结

[一段对所有代理工作的综合性描述]
```

---

## 🔴 退出门禁 (EXIT GATE)

在完成编排任务前，必须验证：

1. ✅ **代理数量**：`调用的代理总数 >= 3`。
2. ✅ **脚本执行**：至少运行了 `security_scan.py`。
3. ✅ **报告产出**：生成了包含所有代理发现的完整编排报告。

> **如果上述任何一项未通过 → 严禁宣布编排已完成。请继续调用相关代理或运行验证脚本。**

---

开始进行编排任务。选择 3 个以上的专家代理，按序执行，运行验证脚本，并产出综合报告。
