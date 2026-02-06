---
description: 展示 agent 与项目状态。用于进度跟踪与状态看板。
---

# /status - 查看状态

$ARGUMENTS

---

## 任务

展示当前项目与 agent 状态。

### 展示内容

1. **项目信息**
   - 项目名称与路径
   - 技术栈
   - 当前功能

2. **Agent 状态看板**
   - 正在运行的 agents
   - 已完成任务
   - 待处理工作

3. **文件统计**
   - 已创建文件数
   - 已修改文件数

4. **预览状态**
   - 服务是否运行
   - URL
   - 健康检查结果

---

## 输出示例

```
=== Project Status ===

📁 Project: my-ecommerce
📂 Path: C:/projects/my-ecommerce
🏷️ Type: nextjs-ecommerce
📊 Status: active

🔧 Tech Stack:
   Framework: next.js
   Database: postgresql
   Auth: clerk
   Payment: stripe

✅ Features (5):
   • product-listing
   • cart
   • checkout
   • user-auth
   • order-history

⏳ Pending (2):
   • admin-panel
   • email-notifications

📄 Files: 73 created, 12 modified

=== Agent Status ===

✅ database-architect → Completed
✅ backend-specialist → Completed
🔄 frontend-specialist → Dashboard components (60%)
⏳ test-engineer → Waiting

=== Preview ===

🌐 URL: http://localhost:3000
💚 Health: OK
```

---

## 技术说明

状态查询使用以下脚本：
- `python .agent/scripts/session_manager.py status`
- `python .agent/scripts/auto_preview.py status`
