# Antigravity Kit 架构

> 全面的 AI Agent 能力扩展工具包

---

## 📋 概览

Antigravity Kit 是一个模块化系统，由以下部分组成：

- **20 个专家智能体（Agent）** - 基于角色的 AI 人设
- **36 个技能（Skill）** - 领域知识模块
- **11 个工作流（Workflow）** - 斜杠命令流程

---

## 🏗️ 目录结构

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 20 Specialist Agents
├── skills/                  # 36 Skills
├── workflows/               # 11 Slash Commands
├── rules/                   # Global Rules
└── scripts/                 # Master Validation Scripts
```

---

## 🤖 智能体（Agents）(20)

面向不同领域的专家型 AI 人设。

| 智能体 | 侧重 | 使用技能 |
| ------------------------ | -------------------- | -------------------------------------------------------- |
| `orchestrator`           | 多智能体协同 | parallel-agents, behavioral-modes                        |
| `project-planner`        | 需求探索、任务规划 | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | Web UI/UX | frontend-design, react-best-practices, tailwind-patterns |
| `backend-specialist`     | API、业务逻辑 | api-patterns, nodejs-best-practices, database-design     |
| `database-architect`     | Schema（模式）、SQL | database-design, prisma-expert                           |
| `mobile-developer`       | iOS、Android、RN | mobile-design                                            |
| `game-developer`         | 游戏逻辑、机制 | game-development                                         |
| `devops-engineer`        | CI/CD、Docker | deployment-procedures, docker-expert                     |
| `security-auditor`       | 安全合规 | vulnerability-scanner, red-team-tactics                  |
| `penetration-tester`     | 攻击性安全 | red-team-tactics                                         |
| `test-engineer`          | 测试策略 | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | 根因分析 | systematic-debugging                                     |
| `performance-optimizer`  | 性能、Web Vitals（核心指标） | performance-profiling                                    |
| `seo-specialist`         | 排名、可见性 | seo-fundamentals, geo-fundamentals                       |
| `documentation-writer`   | 手册、文档 | documentation-templates                                  |
| `product-manager`        | 需求、用户故事 | plan-writing, brainstorming                              |
| `product-owner`          | 策略、Backlog（待办）、MVP | plan-writing, brainstorming                              |
| `qa-automation-engineer` | E2E 测试、CI 流水线 | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | 遗留代码、重构 | clean-code, code-review-checklist                        |
| `explorer-agent`         | 代码库分析 | -                                                        |

---

## 🧩 技能（Skills）(36)

按任务上下文按需加载的模块化知识域。

### 前端与 UI

| 技能 | 说明 |
| ----------------------- | --------------------------------------------------------------------- |
| `react-best-practices`  | React 与 Next.js 性能优化（Vercel 57 条规则）                          |
| `web-design-guidelines` | Web UI 审计（无障碍、UX、性能，Vercel 100+ 条规则）                     |
| `tailwind-patterns`     | Tailwind CSS v4 工具集                                                 |
| `frontend-design`       | UI/UX 模式与设计系统                                                   |
| `ui-ux-pro-max`         | 50 种风格、21 套配色、50 组字体                                        |

### 后端与 API

| 技能 | 说明 |
| ----------------------- | ------------------------------ |
| `api-patterns`          | REST、GraphQL、tRPC            |
| `nestjs-expert`         | NestJS 模块、DI、装饰器        |
| `nodejs-best-practices` | Node.js 异步与模块化实践       |
| `python-patterns`       | Python 规范、FastAPI           |

### 数据库

| 技能 | 说明 |
| ----------------- | --------------------------- |
| `database-design` | 模式设计与优化               |
| `prisma-expert`   | Prisma ORM、迁移             |

### TypeScript 与 JavaScript

| 技能 | 说明 |
| ------------------- | ----------------------------------- |
| `typescript-expert` | 类型级编程与性能优化                |

### 云与基础设施

| 技能 | 说明 |
| ----------------------- | ------------------------- |
| `docker-expert`         | 容器化与 Compose          |
| `deployment-procedures` | CI/CD 与部署流程          |
| `server-management`     | 基础设施管理              |

### 测试与质量

| 技能 | 说明 |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest、Vitest、测试策略   |
| `webapp-testing`        | E2E、Playwright          |
| `tdd-workflow`          | 测试驱动开发             |
| `code-review-checklist` | 代码审查标准             |
| `lint-and-validate`     | Lint 与验证              |

### 安全

| 技能 | 说明 |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | 安全审计、OWASP          |
| `red-team-tactics`      | 红队攻防策略             |

### 架构与规划

| 技能 | 说明 |
| --------------- | -------------------------- |
| `app-builder`   | 全栈应用脚手架             |
| `architecture`  | 系统设计模式               |
| `plan-writing`  | 任务规划与拆解             |
| `brainstorming` | 苏格拉底式提问             |

### 移动端

| 技能 | 说明 |
| --------------- | --------------------- |
| `mobile-design` | 移动端 UI/UX 模式     |

### 游戏开发

| 技能 | 说明 |
| ------------------ | --------------------- |
| `game-development` | 游戏逻辑与机制        |

### SEO 与增长

| 技能 | 说明 |
| ------------------ | ----------------------------- |
| `seo-fundamentals` | SEO、E-E-A-T、Core Web Vitals（核心指标） |
| `geo-fundamentals` | GenAI 优化                    |

### 命令行

| 技能 | 说明 |
| -------------------- | ------------------------- |
| `bash-linux`         | Linux 命令与脚本          |
| `powershell-windows` | Windows PowerShell        |

### 其他

| 技能 | 说明 |
| ------------------------- | ------------------------- |
| `clean-code`              | 编码规范（全局）          |
| `behavioral-modes`        | 智能体行为模式            |
| `parallel-agents`         | 多智能体协作模式          |
| `mcp-builder`             | 模型上下文协议（MCP）     |
| `documentation-templates` | 文档模板                  |
| `i18n-localization`       | 国际化                    |
| `performance-profiling`   | Web Vitals（核心指标）、性能优化 |
| `systematic-debugging`    | 系统化排障                |

---

## 🔄 工作流（Workflows）(11)

斜杠命令（Slash command）流程，通过 `/command` 调用。

| 命令 | 说明 |
| ---------------- | ------------------------ |
| `/brainstorm`    | 苏格拉底式探索           |
| `/create`        | 创建新功能               |
| `/debug`         | 调试问题                 |
| `/deploy`        | 应用部署                 |
| `/enhance`       | 改进现有代码             |
| `/orchestrate`   | 多智能体协同             |
| `/plan`          | 任务拆解                 |
| `/preview`       | 预览变更                 |
| `/status`        | 查看项目状态             |
| `/test`          | 运行测试                 |
| `/ui-ux-pro-max` | 使用 50 种风格进行设计    |

---

## 🎯 技能加载协议

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### 技能结构

```plaintext
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

### 增强型技能（含 scripts/references）

| 技能 | 文件（Files） | 覆盖范围（Coverage）                  |
| ------------------- | ----- | ----------------------------------- |
| `ui-ux-pro-max`     | 27    | 50 种风格、21 套配色、50 组字体      |
| `app-builder`       | 20    | 全栈脚手架                          |

---

## 📜 脚本（Scripts）(2)

用于编排各技能脚本的主验证脚本。

### 主脚本

| 脚本（Script） | 用途（Purpose） | 使用场景（When to Use） |
| --------------- | --------------------------------------- | ------------------------ |
| `checklist.py`  | 基于优先级的验证（核心检查）             | 开发阶段、pre-commit     |
| `verify_all.py` | 全量综合验证（全检查）                   | 部署前、发版前           |

### 使用方式

```bash
# Quick validation during development
python .agent/scripts/checklist.py .

# Full verification before deployment
python .agent/scripts/verify_all.py . --url http://localhost:3000
```
