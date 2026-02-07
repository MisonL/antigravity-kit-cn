---
description: 预览服务器启动、停止与状态检查。本地开发服务管理。
---

# /preview - 预览管理 (Preview Management)

$ARGUMENTS

---

## 任务 (Task)

管理预览服务器：启动、停止、状态检查。

### 指令集 (Commands)

```
/preview           - 显示当前实时状态
/preview start     - 启动预览服务器
/preview stop      - 停止预览服务器
/preview restart   - 重启服务器
/preview check     - 运行健康检查 (Health check)
```

---

## 使用示例 (Usage Examples)

### 启动服务器

```
/preview start

响应：
🚀 正在启动预览……
   端口 (Port)：3000
   类型：Next.js

✅ 预览已就绪！
   URL 地址：http://localhost:3000
```

### 状态检查

```
/preview

响应：
=== 预览状态 (Preview Status) ===

🌐 URL 地址：http://localhost:3000
📁 项目路径：C:/projects/my-app
🏷️ 项目类型：nextjs
💚 健康状态：正常 (OK)
```

### 端口冲突处理

```
/preview start

响应：
⚠️ 端口 3000 已被占用。

您可以选择：
1. 在端口 3001 启动
2. 关闭占用 3000 端口的应用
3. 指定一个不同的端口

您想执行哪项操作？(默认：1)
```

---

## 技术细节 (Technical)

自动预览使用的是 `auto_preview.py` 脚本：

```bash
python .agent/scripts/auto_preview.py start [port]
python .agent/scripts/auto_preview.py stop
python .agent/scripts/auto_preview.py status
```
