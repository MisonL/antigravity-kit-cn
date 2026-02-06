---
description: 预览服务器启动、停止与状态检查。本地开发服务管理。
---

# /preview - 预览管理

$ARGUMENTS

---

## 任务

管理预览服务器：启动、停止、状态检查。

### 命令

```
/preview           - 显示当前状态
/preview start     - 启动服务器
/preview stop      - 停止服务器
/preview restart   - 重启
/preview check     - 健康检查
```

---

## 使用示例

### 启动服务器
```
/preview start

Response:
🚀 Starting preview...
   Port: 3000
   Type: Next.js

✅ Preview ready!
   URL: http://localhost:3000
```

### 状态检查
```
/preview

Response:
=== Preview Status ===

🌐 URL: http://localhost:3000
📁 Project: C:/projects/my-app
🏷️ Type: nextjs
💚 Health: OK
```

### 端口冲突
```
/preview start

Response:
⚠️ Port 3000 is in use.

Options:
1. Start on port 3001
2. Close app on 3000
3. Specify different port

Which one? (default: 1)
```

---

## 技术说明

自动预览使用 `auto_preview.py` 脚本：

```bash
python .agent/scripts/auto_preview.py start [port]
python .agent/scripts/auto_preview.py stop
python .agent/scripts/auto_preview.py status
```
