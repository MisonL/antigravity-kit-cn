---
description: 启动预览服务器并检查状态
---

# 预览 (Preview Workflow)

**触发命令**: `/preview`

## 目的

在本地启动开发服务器，让用户可以预览当前项目的效果。

## 步骤流程

1. **环境检查**:
    - 检查 `package.json` 中的 `scripts`。
    - 寻找 `dev`, `start`, `preview` 等命令。
    - 检查端口占用情况。

2. **启动服务**:
    - 运行 `npm run dev` (或其他对应命令)。
    - 获取 `localhost` 地址。

3. **健康检查**:
    - 确保服务成功启动且无报错。
    - 输出访问地址。

## 示例

> User: /preview
> AI: 正在启动开发服务器... 成功！请访问 http://localhost:3000

---

## 上游脚本流程补充（reference 对齐）

预览流程依赖 `auto_preview.py`：

- `python .agent/scripts/auto_preview.py start [port]`
- `python .agent/scripts/auto_preview.py stop`
- `python .agent/scripts/auto_preview.py status`
