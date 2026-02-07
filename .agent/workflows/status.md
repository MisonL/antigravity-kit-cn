---
description: 展示 agent 与项目状态。用于进度跟踪与状态看板。
---

# /status - 展示状态 (Show Status)

$ARGUMENTS

---

## 任务 (Task)

查看当前项目及专家代理 (Agent) 的实时状态。

### 展示内容：

1. **项目信息 (Project Info)**
    - 项目名称与存储路径。
    - 技术栈 (Tech stack)。
    - 已实现的功能列表。

2. **代理状态看板 (Agent Status Board)**
    - 哪些代理正在运行。
    - 哪些任务已标记为完成。
    - 待处理的工作项。

3. **文件统计**
    - 新创建的文件总数。
    - 已修改的文件总数。

4. **预览状态 (Preview Status)**
    - 预览服务器是否正在运行。
    - 访问 URL 地址。
    - 健康检查 (Health check) 结果。

---

## 输出示例 (Example Output)

```markdown
=== 项目状态 (Project Status) ===

📁 项目名称：my-ecommerce
📂 存储路径：C:/projects/my-ecommerce
🏷️ 项目类型：nextjs-ecommerce
📊 运行状态：活动中 (active)

🔧 技术栈 (Tech Stack)：
框架：next.js
数据库：postgresql
认证：clerk
支付：stripe

✅ 已实现功能 (5)：
• 产品列表 (product-listing)
• 购物车 (cart)
• 结账 (checkout)
• 用户认证 (user-auth)
• 订单历史 (order-history)

⏳ 待处理项 (2)：
• 管理后台 (admin-panel)
• 邮件通知 (email-notifications)

📄 文件统计：已新建 73 个文件，已修改 12 个文件

=== 代理状态 (Agent Status) ===

✅ database-architect → 已完成
✅ backend-specialist → 已完成
🔄 frontend-specialist → 正在开发仪表盘组件 (进度：60%)
⏳ test-engineer → 等待中

=== 预览 (Preview) ===

🌐 URL 地址：http://localhost:3000
💚 健康状态：正常 (OK)
```

---

## 技术细节 (Technical)

状态查看使用的是以下脚本：

- `python .agent/scripts/session_manager.py status`
- `python .agent/scripts/auto_preview.py status`
