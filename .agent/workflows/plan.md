---
description: 使用 project-planner agent 创建项目计划。不写代码，只生成计划文件。
---

# /plan - 项目规划模式 (Project Planning Mode)

$ARGUMENTS

---

## 🔴 关键规则 (CRITICAL RULES)

1. **绝对禁止编写代码** —— 此命令仅用于创建计划文件。
2. **使用 project-planner 代理** —— 而不是使用 Antigravity Agent 自带的原生计划模式。
3. **苏格拉底之门 (Socratic Gate)** —— 在规划前，必须先通过提问澄清需求。
4. **动态命名** —— 计划文件将根据具体任务目标进行动态命名。

---

## 任务 (Task)

请在以下上下文中调用 `project-planner` (项目规划代理)：

```
上下文 (CONTEXT)：
- 老板的请求：$ARGUMENTS
- 模式：仅限规划 (PLANNING ONLY)，严禁编写代码
- 输出路径：./{task-slug}.md (动态命名，位于根目录)

命名规则 (NAMING RULES)：
1. 从请求中提取 2-3 个关键词。
2. 全小写，使用连字符 (-) 分隔。
3. 长度上限 30 个字符。
4. 示例：“e-commerce cart” → ecommerce-cart.md
5. **位置**：项目根目录 (./)

执行准则：
1. 遵循 project-planner.md 中的阶段 -1 (上下文检查)。
2. 遵循 project-planner.md 中的阶段 0 (苏格拉底之门)。
3. 创建包含任务拆解的 PLAN-{slug}.md 文件。
4. 绝对严禁编写任何业务代码文件。
5. 汇报所创建的准确文件名。
```

---

## 预期产出 (Expected Output)

| 交付物                    | 存储位置                    |
| ------------------------- | --------------------------- |
| 项目计划书 (Project Plan) | `./{task-slug}.md`          |
| 任务拆解                  | 计划文件内部                |
| 代理分配方案              | 计划文件内部                |
| 验证检查清单              | 计划文件内部的 Phase X 章节 |

---

## 规划完成后 (After Planning)

告知老板：

```
[OK] 计划已创建：./{task-slug}.md

后续步骤：
- 请审阅该计划。
- 运行 `/create` 命令开始落地实施。
- 或者您可以手动对该计划进行微调。
```

---

## 命名示例 (Naming Examples)

| 用户请求                   | 生成的计划文件        |
| -------------------------- | --------------------- |
| `/plan 带购物车的电商网站` | `./ecommerce-cart.md` |
| `/plan 健身类移动端应用`   | `./fitness-app.md`    |
| `/plan 添加深色模式功能`   | `./dark-mode.md`      |
| `/plan 修复身份验证 Bug`   | `./auth-fix.md`       |
| `/plan SaaS 仪表盘`        | `./saas-dashboard.md` |

---

## 使用场景 (Usage)

```
/plan 带购物车的电商网站
/plan 带健身追踪功能的移动端应用
/plan 带数据分析功能的 SaaS 仪表盘
```
