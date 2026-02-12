# 🔄 智能体流程架构

> **Antigravity Kit** - 完整的 AI 智能体工作流文档

---

## 📊 全流程概览图

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST CLASSIFICATION                        │
│  • Analyze intent (build, debug, test, deploy, etc.)           │
│  • Identify domain (frontend, backend, mobile, etc.)           │
│  • Detect complexity (simple, medium, complex)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │ WORKFLOW COMMAND  │      │  DIRECT AGENT    │
    │  (Slash Command)  │      │  ASSIGNMENT      │
    └─────────┬─────────┘      └────────┬─────────┘
              │                         │
              ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │ /brainstorm       │      │ Agent Selection  │
    │ /create           │      │ Based on Domain  │
    │ /debug            │      │                  │
    │ /deploy           │      │ • frontend-*     │
    │ /enhance          │      │ • backend-*      │
    │ /orchestrate      │      │ • mobile-*       │
    │ /plan             │      │ • database-*     │
    │ /preview          │      │ • devops-*       │
    │ /status           │      │ • test-*         │
    │ /test             │      │ • security-*     │
    │ /ui-ux-pro-max    │      │ • game-*         │
    └─────────┬─────────┘      └────────┬─────────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────┐
         │       AGENT INITIALIZATION          │
         │  • Load agent persona/role          │
         │  • Load required skills             │
         │  • Set behavioral mode              │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │      SKILL LOADING PROTOCOL         │
         │                                      │
         │  1. Read SKILL.md metadata          │
         │  2. Load references/ (if needed)    │
         │  3. Execute scripts/ (if needed)    │
         │  4. Apply rules and patterns        │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │         TASK EXECUTION              │
         │                                      │
         │  • Analyze codebase                 │
         │  • Apply best practices             │
         │  • Generate/modify code             │
         │  • Run validations                  │
         │  • Execute tests                    │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │      VALIDATION LAYER               │
         │                                      │
         │  Quick Check (checklist.py):        │
         │  • Security scan                    │
         │  • Code quality (lint/types)        │
         │  • Schema validation                │
         │  • Test suite                       │
         │  • UX audit                         │
         │  • SEO check                        │
         │                                      │
         │  Full Check (verify_all.py):        │
         │  • All above + Lighthouse           │
         │  • E2E tests (Playwright)           │
         │  • Bundle analysis                  │
         │  • Mobile audit                     │
         │  • i18n check                       │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │         RESULT DELIVERY             │
         │  • Present changes to user          │
         │  • Provide explanations             │
         │  • Suggest next steps               │
         └─────────────────────────────────────┘
```

---

## 🎯 智能体详细流程

### 1️⃣ **请求入口类型**

```
User Input Types:
┌─────────────────────────────────────────────────────────────┐
│ A. Natural Language Request                                 │
│    "Build a React dashboard with charts"                    │
│                                                              │
│ B. Slash Command                                            │
│    "/create feature: user authentication"                   │
│                                                              │
│ C. Domain-Specific Request                                  │
│    "Optimize database queries" → database-architect         │
│    "Fix security vulnerability" → security-auditor          │
│    "Deploy to AWS" → devops-engineer                        │
└─────────────────────────────────────────────────────────────┘
```

#### 苏格拉底门禁协议

在实现前先确认：

- **新功能** → 至少提出 3 个战略性问题
- **Bug 修复** → 确认理解 + 询问影响
- **模糊请求** → 询问目的、用户、范围

### 2️⃣ **智能体选择矩阵**

#### 智能体路由检查清单（强制）

在任何代码/设计工作之前：

| 步骤 | 检查项 | 未满足时 |
| ---- | ---------------------------- | ---------------------------------------- |
| 1    | 识别正确智能体               | → 分析请求领域                           |
| 2    | 阅读智能体的 .md 文件         | → 打开 `.agent/agents/{agent}.md`        |
| 3    | 宣布智能体                   | → `🤖 Applying knowledge of @[agent]...` |
| 4    | 从 frontmatter 加载 skills    | → 检查 `skills:` 字段                    |

```
Request Domain → Agent Mapping:

┌──────────────────────┬─────────────────────┬──────────────────────────┐
│ Domain               │ Primary Agent       │ Skills Loaded            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ UI/UX Design         │ frontend-specialist │ nextjs-react-expert       │
│                      │                     │ frontend-design          │
│                      │                     │ tailwind-patterns        │
│                      │                     │ web-design-guidelines    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ API Development      │ backend-specialist  │ api-patterns             │
│                      │                     │ nodejs-best-practices    │
│                      │                     │ rust-pro                 │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Database Design      │ database-architect  │ database-design          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Mobile App           │ mobile-developer    │ mobile-design            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Game Development     │ game-developer      │ game-development         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ DevOps/Deployment    │ devops-engineer     │ docker-expert            │
│                      │                     │ deployment-procedures    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Security Audit       │ security-auditor    │ vulnerability-scanner    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Penetration Testing  │ penetration-tester  │ red-team-tactics         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Testing              │ test-engineer       │ testing-patterns         │
│                      │                     │ webapp-testing           │
│                      │                     │ tdd-workflow             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Debugging            │ debugger            │ systematic-debugging     │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Performance          │ performance-        │ performance-profiling    │
│                      │ optimizer           │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ SEO                  │ seo-specialist      │ seo-fundamentals         │
│                      │                     │ geo-fundamentals         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Documentation        │ documentation-      │ documentation-templates  │
│                      │ writer              │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Planning/Discovery   │ project-planner     │ brainstorming            │
│                      │                     │ plan-writing             │
│                      │                     │ architecture             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ Multi-Agent Tasks    │ orchestrator        │ parallel-agents          │
│                      │                     │ behavioral-modes         │
└──────────────────────┴─────────────────────┴──────────────────────────┘
```

### 3️⃣ **技能加载协议**

```
┌─────────────────────────────────────────────────────────────┐
│                    SKILL LOADING FLOW                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Match Request to Skill
┌──────────────────────────────────────────┐
│ User: "Build a REST API"                 │
│   ↓                                       │
│ Keyword Match: "API" → api-patterns      │
└──────────────────────────────────────────┘
                    ↓
Step 2: Load Skill Metadata
┌──────────────────────────────────────────┐
│ Read: .agent/skills/api-patterns/        │
│       └── SKILL.md (main instructions)   │
└──────────────────────────────────────────┘
                    ↓
Step 3: Load References (if needed)
┌──────────────────────────────────────────┐
│ Read: api-patterns/rest.md               │
│       api-patterns/graphql.md            │
│       api-patterns/auth.md               │
│       api-patterns/documentation.md      │
└──────────────────────────────────────────┘
                    ↓
Step 4: Execute Scripts (if needed)
┌──────────────────────────────────────────┐
│ Run: scripts/api_validator.py            │
│      (validates API design)              │
└──────────────────────────────────────────┘
                    ↓
Step 5: Apply Knowledge
┌──────────────────────────────────────────┐
│ Agent now has:                           │
│ • API design patterns                    │
│ • Authentication strategies              │
│ • Documentation templates                │
│ • Validation scripts                     │
└──────────────────────────────────────────┘
```

### 相关技能模式

Skills（技能）相互联动：
- `frontend-design` → `web-design-guidelines`（编码后）
- `web-design-guidelines` → `frontend-design`（编码前）

> **注意**：Scripts（脚本）不会自动执行。AI 仅提出运行建议，需用户确认。

### 4️⃣ **工作流命令执行**

```
Slash Command Flow:

/brainstorm
    ↓
    1. Load: brainstorming skill
    2. Apply: Socratic questioning
    3. Output: Structured discovery document

/create
    ↓
    1. Detect: Project type (web/mobile/api/game)
    2. Load: app-builder skill + domain-specific skills
    3. Select: Template from app-builder/templates/
    4. Scaffold: Generate project structure
    5. Validate: Run checklist.py

/debug
    ↓
    1. Load: systematic-debugging skill
    2. Analyze: Error logs, stack traces
    3. Apply: Root cause analysis
    4. Suggest: Fix with code examples
    5. Test: Verify fix works

/deploy
    ↓
    1. Load: deployment-procedures skill
    2. Detect: Platform (Vercel, AWS, Docker, etc.)
    3. Prepare: Build artifacts
    4. Execute: Deployment scripts
    5. Verify: Health checks
    6. Output: Deployment URL

/test
    ↓
    1. Load: testing-patterns + webapp-testing skills
    2. Detect: Test framework (Jest, Vitest, Playwright)
    3. Generate: Test cases
    4. Execute: Run tests
    5. Report: Coverage + results

/orchestrate
    ↓
    1. Load: parallel-agents skill
    2. Decompose: Task into subtasks
    3. Assign: Each subtask to specialist agent
    4. Coordinate: Parallel execution
    5. Merge: Combine results
    6. Validate: Run full verification

/plan
    ↓
    1. Load: plan-writing + architecture skills
    2. Analyze: Requirements
    3. Break down: Tasks with estimates
    4. Output: Structured plan with milestones

/restore-localize-compat
    ↓
    1. Load: i18n-localization + intelligent-routing skills
    2. Compare: current doc vs reference baseline
    3. Restore: mechanism structure first
    4. Localize: semantic Chinese translation only
    5. Verify: compatibility notes remain minimal

/ui-ux-pro-max
    ↓
    1. Load: ui-ux-pro-max skill
    2. Access: 50 design styles
    3. Access: 21 color palettes
    4. Access: 50 font combinations
    5. Generate: Professional UI with selected style
```

### 5️⃣ **多智能体编排**

```
Complex Task → /orchestrate → Multiple Specialist Personas

Example: "Build a full-stack e-commerce app"

┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR AGENT                       │
│  Decomposes task into sequential workstreams                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ FRONTEND      │   │ BACKEND       │   │ DATABASE      │
│ SPECIALIST    │   │ SPECIALIST    │   │ ARCHITECT     │
│               │   │               │   │               │
│ Skills:       │   │ Skills:       │   │ Skills:       │
│ • react-*     │   │ • api-*       │   │ • database-*  │
│ • nextjs-*    │   │ • nodejs-*    │   │ • prisma-*    │
│ • tailwind-*  │   │ • nestjs-*    │   │               │
│               │   │               │   │               │
│ Builds:       │   │ Builds:       │   │ Builds:       │
│ • UI/UX       │   │ • REST API    │   │ • Schema      │
│ • Components  │   │ • Auth        │   │ • Migrations  │
│ • Pages       │   │ • Business    │   │ • Indexes     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └─────────────────┬─┴───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      CODE COHERENCE                 │
        │  • AI maintains consistency         │
        │  • Sequential context switching     │
        │  • Ensure API contracts match       │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │    VALIDATION (All Agents)          │
        │  • test-engineer → Tests            │
        │  • security-auditor → Security      │
        │  • performance-optimizer → Perf     │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │    DEPLOYMENT                       │
        │  • devops-engineer → Deploy         │
        └─────────────────────────────────────┘
```

### 6️⃣ **验证与质量门禁**

```
┌─────────────────────────────────────────────────────────────┐
│                 VALIDATION PIPELINE                          │
└─────────────────────────────────────────────────────────────┘

During Development (Quick Checks):
┌──────────────────────────────────────────┐
│ python .agent/scripts/checklist.py .     │
├──────────────────────────────────────────┤
│ ✓ Security Scan (vulnerabilities)        │
│ ✓ Code Quality (ESLint, TypeScript)      │
│ ✓ Schema Validation (Prisma/DB)          │
│ ✓ Test Suite (Unit tests)                │
│ ✓ UX Audit (Accessibility)               │
│ ✓ SEO Check (Meta tags, performance)     │
└──────────────────────────────────────────┘
        Time: ~30 seconds

Pre-Deployment (Full Verification):
┌──────────────────────────────────────────────────────┐
│ python .agent/scripts/verify_all.py .                │
│        --url http://localhost:3000                   │
├──────────────────────────────────────────────────────┤
│ ✓ All Quick Checks                                   │
│ ✓ Lighthouse Audit (Core Web Vitals)                 │
│ ✓ Playwright E2E Tests                               │
│ ✓ Bundle Analysis (Size, tree-shaking)               │
│ ✓ Mobile Audit (Responsive, touch targets)           │
│ ✓ i18n Check (Translations, locale)                  │
└──────────────────────────────────────────────────────┘
        Time: ~3-5 minutes
```

---

## 🧩 技能与脚本映射

```
Skills with Automated Scripts:

┌─────────────────────────┬──────────────────────────────────┐
│ Skill                   │ Script                           │
├─────────────────────────┼──────────────────────────────────┤
│ api-patterns            │ scripts/api_validator.py         │
│ database-design         │ scripts/schema_validator.py      │
│ frontend-design         │ scripts/accessibility_checker.py │
│                         │ scripts/ux_audit.py              │
│ geo-fundamentals        │ scripts/geo_checker.py           │
│ i18n-localization       │ scripts/i18n_checker.py          │
│ lint-and-validate       │ scripts/lint_runner.py           │
│                         │ scripts/type_coverage.py         │
│ mobile-design           │ scripts/mobile_audit.py          │
│ nextjs-react-expert     │ scripts/react_performance_checker.py │
│ performance-profiling   │ scripts/lighthouse_audit.py      │
│ seo-fundamentals        │ scripts/seo_checker.py           │
│ testing-patterns        │ scripts/test_runner.py           │
│ vulnerability-scanner   │ scripts/security_scan.py         │
│ webapp-testing          │ scripts/playwright_runner.py     │
└─────────────────────────┴──────────────────────────────────┘
```

---

## 🔄 完整请求生命周期示例

```
User Request: "Build a Next.js dashboard with authentication"

1. REQUEST CLASSIFICATION
   ├─ Type: Build new feature
   ├─ Domain: Frontend + Backend
   ├─ Complexity: Medium-High
   └─ Suggested: /create or /orchestrate

2. WORKFLOW SELECTION
   └─ User chooses: /orchestrate (multi-agent approach)

3. ORCHESTRATOR DECOMPOSITION
   ├─ Frontend: Dashboard UI (React components)
   ├─ Backend: Auth API (JWT, session management)
   ├─ Database: User schema (Prisma)
   └─ Testing: E2E auth flow

4. AGENT ASSIGNMENT
   ├─ frontend-specialist
   │   └─ Skills: nextjs-react-expert, tailwind-patterns, frontend-design
   ├─ backend-specialist
   │   └─ Skills: api-patterns, nodejs-best-practices
   ├─ database-architect
   │   └─ Skills: database-design
   └─ test-engineer
       └─ Skills: testing-patterns, webapp-testing

5. SEQUENTIAL MULTI-DOMAIN EXECUTION
   Note: AI processes each domain sequentially, switching context between specialist "personas."
   This is NOT true parallel execution but simulated multi-agent behavior.

   ├─ Frontend builds:
   │   ├─ app/dashboard/page.tsx (Server Component)
   │   ├─ components/DashboardLayout.tsx
   │   ├─ components/LoginForm.tsx
   │   └─ lib/auth-client.ts
   ├─ Backend builds:
   │   ├─ app/api/auth/login/route.ts
   │   ├─ app/api/auth/logout/route.ts
   │   ├─ lib/jwt.ts
   │   └─ middleware.ts
   ├─ Database builds:
   │   ├─ prisma/schema.prisma (User, Session models)
   │   └─ prisma/migrations/
   └─ Testing builds:
       ├─ tests/auth.spec.ts (Playwright)
       └─ tests/dashboard.spec.ts

6. CODE INTEGRATION
   Reality Note: AI writes code as a continuous stream, maintaining consistency.
   There is no "merge" step - it's all generated coherently from the start.

   └─ AI maintains coherence across domains
       ├─ Resolves import paths
       ├─ Ensures type safety
       └─ Connects API routes to UI

7. VALIDATION
   ├─ checklist.py
   │   ✓ Security: No leaked secrets
   │   ✓ Lint: No ESLint errors
   │   ✓ Types: TypeScript passes
   │   ✓ Tests: Auth flow passes
   └─ verify_all.py
       ✓ E2E: Login → Dashboard → Logout works
       ✓ Accessibility: WCAG AA compliant
       ✓ Performance: Lighthouse score > 90

8. RESULT DELIVERY
   └─ User receives:
       ├─ Complete codebase
       ├─ Documentation (how to run)
       ├─ Test reports
       └─ Deployment instructions
```

---

## 📈 统计与指标

```
┌──────────────────────────────────────────────────────────┐
│                    SYSTEM CAPABILITIES                    │
├──────────────────────────────────────────────────────────┤
│ Total Agents:              20                            │
│ Total Skills:              36                            │
│ Total Workflows:           11                            │
│ Master Scripts:            2 (checklist, verify_all)     │
│ Skill-Level Scripts:       18                            │
│ Coverage:                  ~90% web/mobile development   │
│                                                          │
│ Supported Frameworks:                                    │
│ ├─ Frontend: React, Next.js, Vue, Nuxt, Astro          │
│ ├─ Backend: Node.js, NestJS, FastAPI, Express          │
│ ├─ Mobile: React Native, Flutter                        │
│ ├─ Database: Prisma, TypeORM, Sequelize                │
│ ├─ Testing: Jest, Vitest, Playwright, Cypress          │
│ └─ DevOps: Docker, Vercel, AWS, GitHub Actions         │
└──────────────────────────────────────────────────────────┘
```

---

## 🎓 最佳实践

### 各工作流的适用场景

```
/brainstorm
  ✓ Unclear requirements
  ✓ Need to explore options
  ✓ Complex problem needs breaking down

/create
  ✓ New feature in existing project
  ✓ Small-to-medium complexity
  ✓ Single domain (frontend OR backend)

/orchestrate
  ✓ Full-stack features
  ✓ Complex multi-step tasks
  ✓ Need multiple specialist agents

/debug
  ✓ Bug reports
  ✓ Unexpected behavior
  ✓ Performance issues

/test
  ✓ Need test coverage
  ✓ Before deployment
  ✓ After major changes

/deploy
  ✓ Ready to ship
  ✓ After all tests pass
  ✓ Need production URL

/plan
  ✓ Large projects
  ✓ Need time estimates
  ✓ Team coordination needed
```

---

## 🔗 快速索引

- **架构（Architecture）**: `.agent/ARCHITECTURE.md`
- **智能体（Agents）**: `.agent/agents/`
- **技能（Skills）**: `.agent/skills/`
- **工作流（Workflows）**: `.agent/workflows/`
- **脚本（Scripts）**: `.agent/scripts/`

---

**最后更新**：2026-01-26
**版本**：2.0.1
