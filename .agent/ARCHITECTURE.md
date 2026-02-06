# Antigravity Kit 架构

> 全面的 AI Agent 能力扩展工具包

---

## 📋 概览

Antigravity Kit 是一个模块化系统，由以下部分组成：

- **20 个专家 Agent** - 基于角色的 AI 人设
- **36 个 Skills** - 面向领域的知识模块
- **11 个 Workflows** - Slash 命令流程

---

## 🏗️ 目录结构

```plaintext
.agent/
├── ARCHITECTURE.md          # 本文件
├── agents/                  # 20 个专家 Agent
├── skills/                  # 36 个 Skills
├── workflows/               # 11 个 Slash 命令
├── rules/                   # 全局规则
└── scripts/                 # 主验证脚本
```

---

## 🤖 Agents (20)

面向不同领域的专家型 AI 人设。

| Agent                    | Focus                | Skills Used                                              |
| ------------------------ | -------------------- | -------------------------------------------------------- |
| `orchestrator`           | 多 Agent 协同        | parallel-agents, behavioral-modes                        |
| `project-planner`        | 探索、任务规划       | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | Web UI/UX            | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist`     | API、业务逻辑        | api-patterns, nodejs-best-practices, database-design     |
| `database-architect`     | Schema、SQL          | database-design, prisma-expert                           |
| `mobile-developer`       | iOS、Android、RN     | mobile-design                                            |
| `game-developer`         | 游戏逻辑、机制       | game-development                                         |
| `devops-engineer`        | CI/CD、Docker        | deployment-procedures, docker-expert                     |
| `security-auditor`       | 安全合规             | vulnerability-scanner, red-team-tactics                  |
| `penetration-tester`     | 攻击面安全测试       | red-team-tactics                                         |
| `test-engineer`          | 测试策略             | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | 根因分析             | systematic-debugging                                     |
| `performance-optimizer`  | 性能、Web Vitals     | performance-profiling                                    |
| `seo-specialist`         | 排名、可见性         | seo-fundamentals, geo-fundamentals                       |
| `documentation-writer`   | 手册、文档           | documentation-templates                                  |
| `product-manager`        | 需求、用户故事       | plan-writing, brainstorming                              |
| `product-owner`          | 策略、Backlog、MVP   | plan-writing, brainstorming                              |
| `qa-automation-engineer` | E2E 测试、CI 流水线  | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | 遗留代码、重构       | clean-code, code-review-checklist                        |
| `explorer-agent`         | 代码库分析           | -                                                        |

---

## 🧩 Skills (36)

按任务上下文按需加载的模块化知识域。

### Frontend & UI

| Skill                   | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `react-best-practices`  | React 与 Next.js 性能优化（Vercel - 57 条规则）                      |
| `web-design-guidelines` | Web UI 审计 - 100+ 规则（无障碍、UX、性能，Vercel）                  |
| `tailwind-patterns`     | Tailwind CSS v4 工具集                                                |
| `frontend-design`       | UI/UX 模式与设计系统                                                  |
| `ui-ux-pro-max`         | 50 种风格、21 套配色、50 组字体                                       |

### Backend & API

| Skill                   | Description                    |
| ----------------------- | ------------------------------ |
| `api-patterns`          | REST、GraphQL、tRPC            |
| `nestjs-expert`         | NestJS 模块、DI、装饰器        |
| `nodejs-best-practices` | Node.js 异步与模块化实践       |
| `python-patterns`       | Python 规范、FastAPI           |

### Database

| Skill             | Description                 |
| ----------------- | --------------------------- |
| `database-design` | Schema 设计、优化           |
| `prisma-expert`   | Prisma ORM、迁移            |

### TypeScript/JavaScript

| Skill               | Description                         |
| ------------------- | ----------------------------------- |
| `typescript-expert` | 类型编程与性能优化                  |

### Cloud & Infrastructure

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `docker-expert`         | 容器化与 Compose          |
| `deployment-procedures` | CI/CD 与部署流程          |
| `server-management`     | 基础设施管理              |

### Testing & Quality

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest、Vitest、测试策略   |
| `webapp-testing`        | E2E、Playwright          |
| `tdd-workflow`          | 测试驱动开发             |
| `code-review-checklist` | 代码审查标准             |
| `lint-and-validate`     | Lint 与验证              |

### Security

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | 安全审计、OWASP          |
| `red-team-tactics`      | 红队攻防策略             |

### Architecture & Planning

| Skill           | Description                |
| --------------- | -------------------------- |
| `app-builder`   | 全栈应用脚手架             |
| `architecture`  | 系统设计模式               |
| `plan-writing`  | 任务规划与拆解             |
| `brainstorming` | 苏格拉底式提问             |

### Mobile

| Skill           | Description           |
| --------------- | --------------------- |
| `mobile-design` | 移动端 UI/UX 模式     |

### Game Development

| Skill              | Description           |
| ------------------ | --------------------- |
| `game-development` | 游戏逻辑与机制        |

### SEO & Growth

| Skill              | Description                   |
| ------------------ | ----------------------------- |
| `seo-fundamentals` | SEO、E-E-A-T、Core Web Vitals |
| `geo-fundamentals` | GenAI 优化                    |

### Shell/CLI

| Skill                | Description               |
| -------------------- | ------------------------- |
| `bash-linux`         | Linux 命令与脚本          |
| `powershell-windows` | Windows PowerShell        |

### Other

| Skill                     | Description               |
| ------------------------- | ------------------------- |
| `clean-code`              | 编码规范（全局）          |
| `behavioral-modes`        | Agent 行为模式            |
| `parallel-agents`         | 多 Agent 协作模式         |
| `mcp-builder`             | Model Context Protocol    |
| `documentation-templates` | 文档模板                  |
| `i18n-localization`       | 国际化                    |
| `performance-profiling`   | Web Vitals、性能优化      |
| `systematic-debugging`    | 系统化排障                |

---

## 🔄 Workflows (11)

Slash 命令流程。通过 `/command` 调用。

| Command          | Description              |
| ---------------- | ------------------------ |
| `/brainstorm`    | 苏格拉底式需求探索       |
| `/create`        | 创建新功能               |
| `/debug`         | 问题排查                 |
| `/deploy`        | 应用部署                 |
| `/enhance`       | 改进现有代码             |
| `/orchestrate`   | 多 Agent 协同            |
| `/plan`          | 任务拆解                 |
| `/preview`       | 预览变更                 |
| `/status`        | 查看项目状态             |
| `/test`          | 运行测试                 |
| `/ui-ux-pro-max` | 基于 50 种风格做设计     |

---

## 🎯 Skill 加载协议

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### Skill 结构

```plaintext
skill-name/
├── SKILL.md           # （必需）元数据与指令
├── scripts/           # （可选）Python/Bash 脚本
├── references/        # （可选）模板、文档
└── assets/            # （可选）图片、Logo
```

### 增强型 Skills（带 scripts/references）

| Skill               | Files | Coverage                            |
| ------------------- | ----- | ----------------------------------- |
| `ui-ux-pro-max`     | 27    | 50 种风格、21 套配色、50 组字体     |
| `app-builder`       | 20    | 全栈脚手架                          |

---

## 📜 Scripts (2)

用于编排各 Skill 级脚本的主验证脚本。

### 主脚本

| Script          | Purpose                                  | When to Use              |
| --------------- | ---------------------------------------- | ------------------------ |
| `checklist.py`  | 基于优先级的验证（核心检查）             | 开发阶段、pre-commit     |
| `verify_all.py` | 全量综合验证（全检查）                   | 部署前、发版前           |

### 使用方式

```bash
# 开发阶段的快速验证
python .agent/scripts/checklist.py .

# 部署前的完整验证
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### 它们检查什么

**checklist.py**（核心检查）：

- Security（漏洞、密钥）
- Code Quality（lint、types）
- Schema Validation
- Test Suite
- UX Audit
- SEO Check

**verify_all.py**（完整套件）：

- 包含 checklist.py 全部检查，另外增加：
- Lighthouse（Core Web Vitals）
- Playwright E2E
- Bundle Analysis
- Mobile Audit
- i18n Check

详细说明见 [scripts/README.md](scripts/README.md)

---

## 📊 统计

| Metric              | Value                          |
| ------------------- | ------------------------------ |
| **Total Agents**    | 20                             |
| **Total Skills**    | 36                             |
| **Total Workflows** | 11                             |
| **Total Scripts**   | 2（master）+ 18（skill-level） |
| **Coverage**        | 约 90% web/mobile 开发场景     |

---

## 🔗 快速索引

| Need     | Agent                 | Skills                                |
| -------- | --------------------- | ------------------------------------- |
| Web App  | `frontend-specialist` | react-best-practices, frontend-design |
| API      | `backend-specialist`  | api-patterns, nodejs-best-practices   |
| Mobile   | `mobile-developer`    | mobile-design                         |
| Database | `database-architect`  | database-design, prisma-expert        |
| Security | `security-auditor`    | vulnerability-scanner                 |
| Testing  | `test-engineer`       | testing-patterns, webapp-testing      |
| Debug    | `debugger`            | systematic-debugging                  |
| Plan     | `project-planner`     | brainstorming, plan-writing           |
