---
description: 新建应用命令。触发 App Builder（应用构建器）技能并启动与用户的交互式对话。
---

# /create - 创建应用

$ARGUMENTS

---

## 任务

此命令用于启动一个全新的应用创建流程。

### 步骤：

1. **需求分析**
   - 理解用户的具体需求
   - 如果信息缺失，使用 `conversation-manager` 技能进行提问

2. **项目规划**
   - 使用 `project-planner` Agent（智能体）进行任务拆解
   - 确定技术栈
   - 规划文件结构
   - 创建计划文件并进入构建阶段

3. **应用构建（审批后）**
   - 调度 `app-builder` 技能
   - 协调专家 Agent（智能体）：
     - `database-architect` → Schema（架构）
     - `backend-specialist` → API（接口）
     - `frontend-specialist` → UI（界面）

4. **预览**
   - 完成后使用 `auto_preview.py` 启动预览
   - 将 URL（链接）呈现给用户

---

## 使用示例

```
/create 博客网站
/create 包含产品列表和购物车的电商应用
/create 待办事项（Todo）应用
/create Instagram 克隆
/create 具备客户管理功能的 CRM（客户关系管理）系统
```

---

## 在开始之前

如果需求不清晰，请提出以下问题：
- 应用属于什么类型？
- 基础功能有哪些？
- 谁会使用它？

先使用默认值，后续再添加细节。
