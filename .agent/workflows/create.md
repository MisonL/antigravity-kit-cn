---
description: 新建应用命令。触发 App Builder 技能并启动与用户的交互式对话。
---

# /create - 创建应用

$ARGUMENTS

---

## 任务

此命令用于启动新应用创建流程。

### 步骤：

1. **请求分析**
   - 理解用户真正想要什么
   - 若信息缺失，使用 `conversation-manager` 技能补充提问

2. **项目规划**
   - 使用 `project-planner` agent 做任务拆解
   - 确定技术栈
   - 规划文件结构
   - 产出计划文件后再进入构建阶段

3. **应用构建（经确认后）**
   - 使用 `app-builder` 技能进行编排
   - 协同专家 agent：
     - `database-architect` → Schema
     - `backend-specialist` → API
     - `frontend-specialist` → UI

4. **预览**
   - 完成后使用 `auto_preview.py` 启动预览
   - 将访问 URL 提供给用户

---

## 使用示例

```
/create blog site
/create e-commerce app with product listing and cart
/create todo app
/create Instagram clone
/create crm system with customer management
```

---

## 开始前

如果请求不够明确，先问以下问题：
- 应用类型是什么？
- 基础功能有哪些？
- 谁会使用它？

先使用默认值，后续再逐步补充细节。
