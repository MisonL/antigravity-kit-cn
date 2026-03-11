---
description: 使用 project-planner Agent 创建项目计划。不写代码，仅生成计划文件。
---

# /plan - 项目规划模式

$ARGUMENTS

---

## 🔴 关键规则

1. **绝对禁止编写代码** —— 此命令仅用于创建计划文件
2. **使用 project-planner Agent** —— 不使用 Antigravity Agent 的原生 Plan 模式
3. **Socratic Gate（苏格拉底之门）** —— 在规划前必须先通过提问澄清需求
4. **Dynamic Naming（动态命名）** —— 计划文件根据任务自动命名

---

## 任务

请在以下上下文中调用 `project-planner` Agent：

```
CONTEXT（上下文）：
- 用户需求：$ARGUMENTS
- 模式：仅限规划（不写代码）
- 输出：docs/PLAN-{task-slug}.md（动态命名）

NAMING RULES（命名规则）：
1. 从请求中提取 2-3 个关键词
2. 全小写，使用连字符（-）分隔
3. 长度上限 30 个字符
4. 示例：“e-commerce cart” → PLAN-ecommerce-cart.md

RULES（执行准则）：
1. 遵循 project-planner.md 的 Phase -1（Context Check）
2. 遵循 project-planner.md 的 Phase 0（Socratic Gate）
3. 创建包含任务拆解的 PLAN-{slug}.md 文件
4. 绝对严禁编写任何业务代码文件
5. 汇报所创建的准确文件名
```

---

## 预期产出

| 交付物 | 存储位置 |
| --- | --- |
| 项目计划书 | `docs/PLAN-{task-slug}.md` |
| 任务拆解 | 计划文件内部 |
| Agent 分配方案 | 计划文件内部 |
| 验证检查清单 | 计划文件内部的 Phase X 章节 |

---

## 规划完成后

告知用户：
```
[OK] 计划已创建：docs/PLAN-{slug}.md

后续步骤：
- 请审阅该计划
- 运行 `/create` 命令开始落地实施
- 或者手动对该计划进行微调
```

---

## 命名示例

| 用户请求 | 生成的计划文件 |
| --- | --- |
| `/plan 带购物车的电商网站` | `docs/PLAN-ecommerce-cart.md` |
| `/plan 健身类移动端应用` | `docs/PLAN-fitness-app.md` |
| `/plan 添加深色模式功能` | `docs/PLAN-dark-mode.md` |
| `/plan 修复身份验证问题` | `docs/PLAN-auth-fix.md` |
| `/plan SaaS 仪表盘` | `docs/PLAN-saas-dashboard.md` |

---

## 使用场景

```
/plan 带购物车的电商网站
/plan 带健身追踪功能的移动端应用
/plan 带数据分析功能的 SaaS 仪表盘
```
