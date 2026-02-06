---
description: 创建新项目或新功能，包含脚手架生成
---

# 创建 (Create Workflow)

**触发命令**: `/create [description]`

## 目的

这是"将想法转化为代码"的第一步。它负责初始化项目结构、选择技术栈，并生成最初的脚手架代码。

## 步骤流程

1. **意图识别**:
    - 是**新项目** (New Project) 还是**新功能** (New Feature)？
    - 分析所需领域 (Frontend/Backend/Database/Mobile)。

2. **技术栈确认**:
    - 如果是新项目，推荐 Next.js + Tailwind (Web) 或 Hono (API)。
    - 确认是否需要 Docker、CI/CD 等基础设施。

3. **生成计划**:
    - 在开始写代码前，先列出将要创建/修改的文件列表。
    - 让用户确认。

4. **代码生成**:
    - 调用 `app-builder` 技能。
    - 顺序创建文件：配置文件 -> 基础组件 -> 业务逻辑 -> 页面。

5. **初步验证**:
    - 运行 Lint 检查。
    - 提醒用户安装依赖 (`npm install`)。

## 示例

> User: /create 一个带有登录页面的 Next.js 仪表盘
> AI: 收到。我建议使用 Next.js App Router + shadcn/ui。这是生成计划...

---

## 上游脚本流程补充（reference 对齐）

创建流程完成后，应启动预览链路：

- `python .agent/scripts/auto_preview.py start [port]`
