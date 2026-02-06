---
name: server-management
description: 服务器管理原则、进程监控与扩缩容决策
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 服务器管理 (Server Management)

## 进程管理

不要直接运行 `node server.js`。

1.  **Systemd**: Linux 标准的服务管理器。自动重启，日志管理。
2.  **PM2**: Node.js 常用。支持集群模式 (Cluster Mode)。
3.  **Docker**: 容器化是最佳实践。

## 监控策略

你需要回答三个问题：

1.  **服务器还活着吗？** (Uptime Monitor)
2.  **资源够用吗？** (Metrics: CPU, RAM, Disk)
3.  **业务正常吗？** (Logs, APM)

## 扩缩容决策

- **垂直扩展 (Scale Up)**: 买更贵的机器。简单，但有上限。
- **水平扩展 (Scale Out)**: 加更多的机器。复杂（需负载均衡），但理论无上限。

## 安全基线

- **禁用 Root 登录**。
- **配置防火墙 (UFW/IPTables)**: 只开放 80, 443, 22。
- **自动安全更新**: `unattended-upgrades`。

## 协同建议

- 遇到线上故障定位时，可配合 `/debug` 工作流先做根因定位，再执行运维修复。
