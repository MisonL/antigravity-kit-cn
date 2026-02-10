# 🔄 智能体流程架构

> **Antigravity Kit** - Agent Flow（智能体流程）工作机制文档

---

## 📊 全流程概览图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户请求                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       请求分类                               │
│  • 识别意图，例如 build/debug/test/deploy                     │
│  • 识别领域，例如 frontend/backend/mobile                     │
│  • 识别复杂度，例如 simple/medium/complex                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │  工作流命令入口    │      │  直接智能体分配   │
    │  斜杠命令          │      │  分配             │
    └─────────┬─────────┘      └────────┬─────────┘
              │                         │
              ▼                         ▼
    ┌───────────────────┐      ┌──────────────────┐
    │ /brainstorm       │      │ 智能体选择        │
    │ /create           │      │ 按领域            │
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
         │         智能体初始化                │
         │  • 加载智能体角色/职责              │
         │  • 加载所需 Skills（技能）          │
         │  • 设置行为模式                     │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │        技能加载协议                 │
         │                                      │
         │  1. 读取 SKILL.md 元数据            │
         │  2. 读取 references/（如需）        │
         │  3. 执行 scripts/（如需）           │
         │  4. 应用规则与模式                  │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │           任务执行                  │
         │                                      │
         │  • 分析代码库                        │
         │  • 应用最佳实践                      │
         │  • 生成/修改代码                     │
         │  • 运行校验                          │
         │  • 执行测试                          │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │            验证层                   │
         │                                      │
         │  快速检查：checklist.py             │
         │  • 安全扫描                          │
         │  • 代码质量：lint/types              │
         │  • Schema（模式）校验                 │
         │  • 测试套件                           │
         │  • UX（用户体验）审计                 │
         │  • SEO（搜索引擎优化）检查             │
         │                                      │
         │  全量检查：verify_all.py            │
         │  • 以上全部 + Lighthouse             │
         │  • E2E（端到端）测试：Playwright      │
         │  • Bundle 分析                       │
         │  • 移动端审计                         │
         │  • i18n 校验                         │
         └──────────────┬──────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────────┐
         │            结果交付                 │
         │  • 向用户呈现变更                   │
         │  • 提供关键解释                     │
         │  • 建议下一步                       │
         └─────────────────────────────────────┘
```

---

## 🎯 详细执行流程

### 1️⃣ **请求入口类型**

```
用户输入类型：
┌─────────────────────────────────────────────────────────────┐
│ A. 自然语言请求                                              │
│    "构建一个带图表的 React 仪表盘"                          │
│                                                              │
│ B. 斜杠命令                                                  │
│    "/create feature: 用户认证"                             │
│                                                              │
│ C. 领域型请求                                                │
│    "优化数据库查询" → database-architect                    │
│    "修复安全漏洞"   → security-auditor                      │
│    "部署到 AWS"    → devops-engineer                        │
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
| 3    | 宣布智能体                   | → `🤖 正在应用 @[agent] 的知识...`       |
| 4    | 从 frontmatter 加载 skills    | → 检查 `skills:` 字段                    |

```
请求领域 → 智能体映射：

┌──────────────────────┬─────────────────────┬──────────────────────────┐
│ 领域                 │ 主智能体            │ 加载技能                │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ UI/UX 设计            │ frontend-specialist │ react-best-practices      │
│                      │                     │ frontend-design          │
│                      │                     │ tailwind-patterns        │
|                      │                     │ web-design-guidelines    │
│                      │                     │ frontend-design          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ API 开发              │ backend-specialist  │ api-patterns             │
│                      │                     │ nodejs-best-practices    │
│                      │                     │ nestjs-expert            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 数据库设计            │ database-architect  │ database-design          │
│                      │                     │ prisma-expert            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 移动端应用            │ mobile-developer    │ mobile-design            │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 游戏开发              │ game-developer      │ game-development         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ DevOps（运维）/部署   │ devops-engineer     │ docker-expert            │
│                      │                     │ deployment-procedures    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 安全审计              │ security-auditor    │ vulnerability-scanner    │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 渗透测试              │ penetration-tester  │ red-team-tactics         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 测试                  │ test-engineer       │ testing-patterns         │
│                      │                     │ webapp-testing           │
│                      │                     │ tdd-workflow             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 调试                  │ debugger            │ systematic-debugging     │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 性能                  │ performance-        │ performance-profiling    │
│                      │ optimizer           │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ SEO                  │ seo-specialist      │ seo-fundamentals         │
│                      │                     │ geo-fundamentals         │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 文档                  │ documentation-      │ documentation-templates  │
│                      │ writer              │                          │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 规划/发现             │ project-planner     │ brainstorming            │
│                      │                     │ plan-writing             │
│                      │                     │ architecture             │
├──────────────────────┼─────────────────────┼──────────────────────────┤
│ 多智能体任务           │ orchestrator        │ parallel-agents          │
│                      │                     │ behavioral-modes         │
└──────────────────────┴─────────────────────┴──────────────────────────┘
```

### 3️⃣ **技能加载协议**

```
┌─────────────────────────────────────────────────────────────┐
│                    技能加载流程                               │
└─────────────────────────────────────────────────────────────┘

步骤 1：请求匹配 Skill（技能）
┌──────────────────────────────────────────┐
│ 用户："构建一个 REST API（应用程序接口）" │
│   ↓                                       │
│ 关键词匹配："API" → api-patterns         │
└──────────────────────────────────────────┘
                    ↓
步骤 2：加载 Skill 元数据
┌──────────────────────────────────────────┐
│ 读取：.agent/skills/api-patterns/        │
│       └── SKILL.md（主说明）             │
└──────────────────────────────────────────┘
                    ↓
步骤 3：加载 references（如需）
┌──────────────────────────────────────────┐
│ 读取：api-patterns/rest.md               │
│       api-patterns/graphql.md            │
│       api-patterns/auth.md               │
│       api-patterns/documentation.md      │
└──────────────────────────────────────────┘
                    ↓
步骤 4：执行 scripts（如需）
┌──────────────────────────────────────────┐
│ 运行：scripts/api_validator.py           │
│      （校验 API 设计）                   │
└──────────────────────────────────────────┘
                    ↓
步骤 5：应用知识
┌──────────────────────────────────────────┐
│ 智能体获得：                             │
│ • API 设计模式                           │
│ • 认证策略                               │
│ • 文档模板                               │
│ • 校验脚本                               │
└──────────────────────────────────────────┘

### 相关技能模式

Skills（技能）相互联动：
- `frontend-design` → `web-design-guidelines`（编码后）
- `web-design-guidelines` → `frontend-design`（编码前）

> **注意**：Scripts（脚本）不会自动执行。AI 仅提出运行建议，需用户确认。
```

### 4️⃣ **工作流命令执行**

```
Slash Command（斜杠命令）流程：

/brainstorm
    ↓
    1. 加载：brainstorming skill
    2. 应用：苏格拉底式提问
    3. 输出：结构化发现文档

/create
    ↓
    1. 识别：项目类型，如 web/mobile/api/game
    2. 加载：app-builder skill（技能）+ 领域 Skills（技能）
    3. 选择：app-builder/templates/ 中的模板
    4. 脚手架：生成项目结构
    5. 校验：运行 checklist.py

/debug
    ↓
    1. 加载：systematic-debugging skill
    2. 分析：错误日志与调用栈
    3. 应用：根因分析
    4. 建议：带代码示例的修复方案
    5. 测试：验证修复有效

/deploy
    ↓
    1. 加载：deployment-procedures skill
    2. 识别：平台，如 Vercel、AWS、Docker
    3. 准备：构建产物
    4. 执行：部署脚本
    5. 验证：健康检查
    6. 输出：部署 URL

/test
    ↓
    1. 加载：testing-patterns + webapp-testing skills
    2. 识别：测试框架，如 Jest、Vitest、Playwright
    3. 生成：测试用例
    4. 执行：运行测试
    5. 报告：覆盖率 + 结果

/orchestrate
    ↓
    1. 加载：parallel-agents skill
    2. 拆解：任务为子任务
    3. 分配：每个子任务给专精智能体
    4. 协调：并行执行
    5. 汇总：合并结果
    6. 校验：运行全量验证

/plan
    ↓
    1. 加载：plan-writing + architecture skills
    2. 分析：需求
    3. 拆解：任务与预估
    4. 输出：结构化计划与里程碑

/ui-ux-pro-max
    ↓
    1. 加载：ui-ux-pro-max skill
    2. 访问：50 种设计风格
    3. 访问：21 套配色
    4. 访问：50 组字体组合
    5. 生成：基于所选风格的专业 UI
```

### 5️⃣ **多智能体编排**

```
复杂任务 → /orchestrate → 多专家协同

示例："构建全栈电商应用"

┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR AGENT                      │
│  将任务拆解为可顺序执行的工作流                             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ FRONTEND      │   │ BACKEND       │   │ DATABASE      │
│ SPECIALIST    │   │ SPECIALIST    │   │ ARCHITECT     │
│               │   │               │   │               │
│ Skills（技能）: │   │ Skills（技能）: │   │ Skills（技能）: │
│ • react-*     │   │ • api-*       │   │ • database-*  │
│ • nextjs-*    │   │ • nodejs-*    │   │ • prisma-*    │
│ • tailwind-*  │   │ • nestjs-*    │   │               │
│               │   │               │   │               │
│ Builds（产出）:│   │ Builds（产出）:│   │ Builds（产出）:│
│ • UI/UX       │   │ • REST API    │   │ • Schema      │
│ • Components  │   │ • Auth        │   │ • Migrations  │
│ • Pages       │   │ • Business    │   │ • Indexes     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └─────────────────┬─┴───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │          代码一致性                 │
        │  • AI 保持一致性                    │
        │  • 顺序化上下文切换                 │
        │  • 确保 API 契约一致                │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │      验证（所有智能体）             │
        │  • test-engineer → 测试             │
        │  • security-auditor → 安全          │
        │  • performance-optimizer → 性能     │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │              部署                   │
        │  • devops-engineer → 发布           │
        └─────────────────────────────────────┘
```

### 6️⃣ **验证与质量门禁**

```
┌─────────────────────────────────────────────────────────────┐
│                 验证流水线                                  │
└─────────────────────────────────────────────────────────────┘

开发阶段（快速检查）：
┌──────────────────────────────────────────┐
│ python .agent/scripts/checklist.py .     │
├──────────────────────────────────────────┤
│ ✓ 安全扫描：漏洞                         │
│ ✓ 代码质量：ESLint、TypeScript           │
│ ✓ Schema 校验：Prisma/DB                 │
│ ✓ 测试套件：单元测试                     │
│ ✓ UX 审计：无障碍                        │
│ ✓ SEO 检查：Meta 标签、性能              │
└──────────────────────────────────────────┘
        耗时：约 30 秒

发布前（全量验证）：
┌──────────────────────────────────────────────────────┐
│ python .agent/scripts/verify_all.py .                │
│        --url http://localhost:3000                   │
├──────────────────────────────────────────────────────┤
│ ✓ 覆盖全部快速检查                                   │
│ ✓ Lighthouse 审计：Core Web Vitals                   │
│ ✓ Playwright E2E 测试                                │
│ ✓ Bundle 分析：体积、tree-shaking                    │
│ ✓ 移动端审计：响应式、触控目标                       │
│ ✓ i18n 校验：翻译、语言环境                          │
└──────────────────────────────────────────────────────┘
        耗时：约 3-5 分钟
```

---

## 🧩 技能与脚本映射

```
带自动化脚本的 Skills（技能）：

┌─────────────────────────┬──────────────────────────────────┐
│ Skill（技能）            │ Script                           │
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
│ performance-profiling   │ scripts/lighthouse_runner.py     │
│                         │ scripts/bundle_analyzer.py       │
│ seo-fundamentals        │ scripts/seo_checker.py           │
│ testing-patterns        │ scripts/test_runner.py           │
│ vulnerability-scanner   │ scripts/security_scanner.py      │
│ webapp-testing          │ scripts/e2e_runner.py            │
└─────────────────────────┴──────────────────────────────────┘
```

---

## 🔄 完整请求生命周期示例

```
用户请求："构建一个带认证的 Next.js 仪表盘"

1. 请求分类
   ├─ 类型：新功能开发
   ├─ 领域：前端 + 后端
   ├─ 复杂度：中高
   └─ 建议：/create 或 /orchestrate

2. 工作流选择
   └─ 用户选择：/orchestrate（多智能体）

3. Orchestrator 拆解
   ├─ 前端：仪表盘 UI，例如 React 组件
   ├─ 后端：认证 API，例如 JWT、会话管理
   ├─ 数据库：用户 Schema，例如 Prisma
   └─ 测试：E2E 认证链路

4. 智能体分配
   ├─ frontend-specialist
   │   └─ Skills: react-best-practices, tailwind-patterns, frontend-design
   ├─ backend-specialist
   │   └─ Skills: api-patterns, nodejs-best-practices
   ├─ database-architect
   │   └─ Skills: database-design, prisma-expert
   └─ test-engineer
       └─ Skills: testing-patterns, webapp-testing

5. 多域顺序执行
   说明：AI 顺序处理各领域，在专精角色间切换上下文。
   这不是并行执行，而是模拟多智能体行为。

   ├─ 前端产出：
   │   ├─ app/dashboard/page.tsx - Server Component（服务器组件）
   │   ├─ components/DashboardLayout.tsx
   │   ├─ components/LoginForm.tsx
   │   └─ lib/auth-client.ts
   ├─ 后端产出：
   │   ├─ app/api/auth/login/route.ts
   │   ├─ app/api/auth/logout/route.ts
   │   ├─ lib/jwt.ts
   │   └─ middleware.ts
   ├─ 数据库产出：
   │   ├─ prisma/schema.prisma - User/Session 模型（用户/会话）
   │   └─ prisma/migrations/
   └─ 测试产出：
       ├─ tests/auth.spec.ts - Playwright（端到端测试框架）
       └─ tests/dashboard.spec.ts

6. 代码整合
   现实说明：AI 以连续流式方式写代码，保持一致性。
   不存在“合并”步骤 —— 从一开始就是一致生成。

   └─ AI 跨领域保持一致：
       ├─ 解析导入路径
       ├─ 确保类型安全
       └─ 连接 API 路由与 UI

7. 验证
   ├─ checklist.py
   │   ✓ Security：无泄漏密钥
   │   ✓ Lint：无 ESLint 错误
   │   ✓ Types：TypeScript 通过
   │   ✓ Tests：认证链路通过
   └─ verify_all.py
       ✓ E2E：登录 → 仪表盘 → 退出正常
       ✓ 无障碍：符合 WCAG AA
       ✓ 性能：Lighthouse 分数 > 90

8. 结果交付
   └─ 用户获得：
       ├─ 完整代码库
       ├─ 文档（如何运行）
       ├─ 测试报告
       └─ 部署说明
```

---

## 📈 统计与指标

```
┌──────────────────────────────────────────────────────────┐
│                    系统能力概览                           │
├──────────────────────────────────────────────────────────┤
│ 总智能体：               20                            │
│ 总技能：               36                            │
│ 总 Workflows：            11                            │
│ 主脚本：                  2，checklist、verify_all       │
│ 技能级脚本：            18                            │
│ 覆盖度：                  ~90% web/mobile 开发场景       │
│                                                          │
│ 支持的框架：                                                 │
│ ├─ 前端：React、Next.js、Vue、Nuxt、Astro                 │
│ ├─ 后端：Node.js、NestJS、FastAPI、Express                │
│ ├─ 移动端：React Native、Flutter                         │
│ ├─ 数据库：Prisma、TypeORM、Sequelize                     │
│ ├─ 测试：Jest、Vitest、Playwright、Cypress                │
│ └─ DevOps：Docker、Vercel、AWS、GitHub Actions            │
└──────────────────────────────────────────────────────────┘
```

---

## 🎓 最佳实践

### 各工作流的适用场景

```
/brainstorm
  ✓ 需求不清晰
  ✓ 需要探索选项
  ✓ 复杂问题需要拆解

/create
  ✓ 现有项目中的新功能
  ✓ 中小复杂度
  ✓ 单一领域（前端或后端）

/orchestrate
  ✓ 全栈特性
  ✓ 复杂多步骤任务
  ✓ 需要多个专家智能体

/debug
  ✓ Bug 报告
  ✓ 异常行为
  ✓ 性能问题

/test
  ✓ 需要测试覆盖
  ✓ 部署前
  ✓ 大改后

/deploy
  ✓ 准备发布
  ✓ 全部测试通过后
  ✓ 需要生产 URL

/plan
  ✓ 大型项目
  ✓ 需要时间预估
  ✓ 需要团队协作
```

---

## 🔗 快速索引

- **Architecture**: `.agent/ARCHITECTURE.md`
- **Agents（智能体）**: `.agent/agents/`
- **Skills（技能）**: `.agent/skills/`
- **Workflows**: `.agent/workflows/`
- **Scripts**: `.agent/scripts/`

---

**最后更新**：2026-01-26
**版本**：2.0.1
