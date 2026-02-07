---
name: server-management
description: 服务器管理原则与决策方法。涵盖进程管理、监控策略与扩缩容判断。强调思维方式，而非死记命令。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 服务器管理 (Server Management)

> 面向生产运维的服务器管理原则。  
> **学习如何思考，不是背命令。**

---

## 1. 进程管理原则 (Process Management Principles)

### 工具选型 (Tool Selection)

| Scenario | Tool |
|----------|------|
| **Node.js 应用** | PM2（集群 clustering、重载 reload） |
| **任意应用** | systemd（Linux 原生） |
| **Containers** | Docker/Podman |
| **Orchestration** | Kubernetes, Docker Swarm |

### 进程管理目标 (Process Management Goals)

| Goal | What It Means |
|------|---------------|
| **崩溃后重启 (Restart on crash)** | 自动恢复 (Auto-recovery) |
| **零停机重载 (Zero-downtime reload)** | 服务不中断 |
| **集群 (Clustering)** | 用满 CPU 多核 |
| **持久化 (Persistence)** | 服务器重启后仍可恢复 |

---

## 2. 监控原则 (Monitoring Principles)

### 监控什么 (What to Monitor)

| Category | Key Metrics |
|----------|-------------|
| **可用性 (Availability)** | 在线率 (Uptime)、健康检查 |
| **性能 (Performance)** | 响应时间、吞吐量 |
| **错误 (Errors)** | 错误率、错误类型 |
| **资源 (Resources)** | CPU、内存、磁盘 |

### 告警分级策略 (Alert Severity Strategy)

| Level | Response |
|-------|----------|
| **Critical** | 立即处理 |
| **Warning** | 尽快排查 |
| **Info** | 每日审查 |

### 监控工具选择 (Monitoring Tool Selection)

| Need | Options |
|------|---------|
| 简单/免费 | PM2 metrics, htop |
| 全链路可观测 | Grafana, Datadog |
| 错误追踪 | Sentry |
| 在线率监控 | UptimeRobot, Pingdom |

---

## 3. 日志管理原则 (Log Management Principles)

### 日志策略 (Log Strategy)

| Log Type | Purpose |
|----------|---------|
| **应用日志 (Application logs)** | 调试、审计 |
| **访问日志 (Access logs)** | 流量分析 |
| **错误日志 (Error logs)** | 问题发现 |

### 日志原则 (Log Principles)

1. 进行 **日志轮转 (Rotate logs)**，避免磁盘打满
2. 使用 **结构化日志 (Structured logging)**（如 JSON）便于解析
3. 合理划分日志级别（error/warn/info/debug）
4. 日志中不得出现敏感数据

---

## 4. 扩缩容决策 (Scaling Decisions)

### 何时扩缩容 (When to Scale)

| Symptom | Solution |
|---------|----------|
| CPU 持续高负载 | 增加实例（水平扩展 horizontal） |
| 内存持续高占用 | 增加 RAM 或修复内存泄漏 |
| 响应变慢 | 先做性能分析 (Profile) 再扩容 |
| 流量突增 | 自动扩缩容 (Auto-scaling) |

### 扩缩容策略 (Scaling Strategy)

| Type | When to Use |
|------|-------------|
| **垂直扩展 (Vertical)** | 快速止血、单实例场景 |
| **水平扩展 (Horizontal)** | 长期可持续、分布式场景 |
| **自动扩缩容 (Auto)** | 流量波动明显 |

---

## 5. 健康检查原则 (Health Check Principles)

### 健康状态判定 (What Constitutes Healthy)

| Check | Meaning |
|-------|---------|
| **HTTP 200** | 服务可响应 |
| **数据库已连接** | 数据可访问 |
| **依赖可用** | 外部服务可达 |
| **资源正常** | CPU/内存未耗尽 |

### 健康检查实现方式 (Health Check Implementation)

- 简单模式：仅返回 200
- 深度模式：检查所有关键依赖
- 按负载均衡器 (Load Balancer) 的接入需求选择

---

## 6. 安全原则 (Security Principles)

| Area | Principle |
|------|-----------|
| **访问控制 (Access)** | 仅用 SSH key，禁用口令登录 |
| **防火墙 (Firewall)** | 只开放必要端口 |
| **更新 (Updates)** | 定期打安全补丁 |
| **密钥管理 (Secrets)** | 放环境变量，不落地文件 |
| **审计 (Audit)** | 记录访问与变更 |

---

## 7. 故障排查优先级 (Troubleshooting Priority)

当系统异常时按顺序排查：

1. **先看是否在运行**（进程状态）
2. **再看日志**（错误信息）
3. **检查资源**（磁盘、内存、CPU）
4. **检查网络**（端口、DNS）
5. **检查依赖**（数据库、外部 API）

---

## 8. 反模式 (Anti-Patterns)

| ❌ Don't | ✅ Do |
|----------|-------|
| 以 root 身份直接运行服务 | 使用非 root 账号运行 |
| 忽略日志管理 | 配置日志轮转 |
| 不做监控 | 从第一天就接入监控 |
| 手工重启服务 | 配置自动重启 |
| 没有备份策略 | 制定并执行定期备份 |

---

> **牢记：** 管得好的服务器应当“平平无奇”。这正是目标。
