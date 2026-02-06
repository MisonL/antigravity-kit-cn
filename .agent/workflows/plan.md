---
description: 使用 project-planner agent 创建项目计划。不写代码，只生成计划文件。
---

# /plan - 项目规划模式

$ARGUMENTS

---

## 🔴 关键规则

1. **禁止写代码** - 本命令仅创建计划文件
2. **必须使用 project-planner agent** - 不是 Antigravity Agent 原生 Plan 模式
3. **苏格拉底闸门** - 规划前先做澄清提问
4. **动态命名** - 计划文件名需基于任务生成

---

## 任务

使用 `project-planner` agent，并传入以下上下文：

```
CONTEXT:
- User Request: $ARGUMENTS
- Mode: PLANNING ONLY (no code)
- Output: docs/PLAN-{task-slug}.md (dynamic naming)

NAMING RULES:
1. Extract 2-3 key words from request
2. Lowercase, hyphen-separated
3. Max 30 characters
4. Example: "e-commerce cart" → PLAN-ecommerce-cart.md

RULES:
1. Follow project-planner.md Phase -1 (Context Check)
2. Follow project-planner.md Phase 0 (Socratic Gate)
3. Create PLAN-{slug}.md with task breakdown
4. DO NOT write any code files
5. REPORT the exact file name created
```

---

## 预期输出

| Deliverable | Location |
|-------------|----------|
| Project Plan | `docs/PLAN-{task-slug}.md` |
| Task Breakdown | Inside plan file |
| Agent Assignments | Inside plan file |
| Verification Checklist | Phase X in plan file |

---

## 规划完成后

告知用户：
```
[OK] Plan created: docs/PLAN-{slug}.md

Next steps:
- Review the plan
- Run `/create` to start implementation
- Or modify plan manually
```

---

## 命名示例

| Request | Plan File |
|---------|-----------|
| `/plan e-commerce site with cart` | `docs/PLAN-ecommerce-cart.md` |
| `/plan mobile app for fitness` | `docs/PLAN-fitness-app.md` |
| `/plan add dark mode feature` | `docs/PLAN-dark-mode.md` |
| `/plan fix authentication bug` | `docs/PLAN-auth-fix.md` |
| `/plan SaaS dashboard` | `docs/PLAN-saas-dashboard.md` |

---

## 使用方式

```
/plan e-commerce site with cart
/plan mobile app for fitness tracking
/plan SaaS dashboard with analytics
```
