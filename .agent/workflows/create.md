---
description: 新建应用命令。触发 App Builder 技能并发起与老板的交互式对话。
---

# /create - 创建应用 (Create Application)

$ARGUMENTS

---

## 任务 (Task)

此命令用于启动一个全新的应用创建流程。

### 具体步骤：

1. **需求分析 (Request Analysis)**
    - 理解老板的具体需求。
    - 如果信息缺失，调用 `conversation-manager` 技能进行提问。

2. **项目规划 (Project Planning)**
    - 使用 `project-planner` (项目规划代理) 进行任务拆解。
    - 确定技术栈。
    - 规划文件结构。
    - 创建计划文件并进入构建阶段。

3. **应用构建 (Application Building)** —— 需获得审批后进行
    - 调度 `app-builder` 技能。
    - 协调专家代理 (Expert Agents)：
        - `database-architect` (数据库架构师) → 设计 Schema。
        - `backend-specialist` (后端专家) → 开发 API。
        - `frontend-specialist` (前端专家) → 开发 UI。

4. **预览 (Preview)**
    - 完成后使用 `auto_preview.py` 启动预览。
    - 将 URL 呈现给老板。

---

## 使用示例 (Usage Examples)

```
/create 博客网站
/create 包含产品列表和购物车的电商应用
/create 待办事项 (Todo) 应用
/create Instagram 仿制版
/create 带有客户管理功能的 CRM 系统
```

---

## 在开始之前 (Before Starting)

如果需求不清晰，请提出以下问题：

- 应用属于什么类型？
- 基础功能有哪些？
- 谁会使用它？

先使用默认值，后续再添加细节。
