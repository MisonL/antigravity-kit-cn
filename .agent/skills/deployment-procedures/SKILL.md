---
name: deployment-procedures
description: 生产部署决策、安全部署流程与回滚策略
allowed-tools: Read, Glob, Grep, Bash
---

# 部署程序 (Deployment Procedures)

## 核心原则

1.  **不可变基础设施 (Immutable Infrastructure)**
    - 一旦部署，不要 SSH 上去修改代码。
    - 如果需要变更，构建新镜像并重新部署。

2.  **零停机部署 (Zero Downtime)**
    - **蓝绿部署 (Blue-Green)**: 同时运行新旧版本，切换路由。
    - **滚动更新 (Rolling Update)**: 逐个替换实例。

3.  **环境一致性 (Parity)**
    - 开发、测试、生产环境应尽可能保持一致（使用 Docker）。

## 部署清单 (Checklist)

- [ ] **Secrets**: 环境变量 (.env) 是否已配置且安全？
- [ ] **Database**: 迁移脚本 (Migrations) 是否已运行？
- [ ] **Assets**: 静态资源是否已上传 CDN？
- [ ] **Health Check**: `/health` 接口是否返回 200？
- [ ] **SSL**: HTTPS 证书是否有效？

## 回滚策略 (Rollback)

- **自动回滚**: 如果部署后健康检查失败，自动切回旧版本。
- **数据库兼容**: 数据库变更是最难回滚的。确保新代码兼容旧 Schema。
