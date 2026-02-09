# 迁移原则（Migration Principles）

> 面向零停机变更的安全迁移策略。

## 安全迁移策略（Safe Migration Strategy）

```
零停机变更建议：
│
├── 新增列（Adding column）
│   └── 先设为 nullable（可为空） → 回填数据 → 再加 NOT NULL
│
├── 删除列（Removing column）
│   └── 先停止使用 → 部署过渡版本 → 再删除列
│
├── 新增索引（Adding index）
│   └── `CREATE INDEX CONCURRENTLY`（非阻塞）
│
└── 重命名列（Renaming column）
    └── 新增新列 → 迁移数据 → 部署 → 删除旧列
```

## 迁移哲学（Migration Philosophy）

- 不要一步到位做破坏性变更
- 先在数据副本上验证迁移
- 预先准备回滚方案
- 在可行场景下使用事务包裹

## Serverless 数据库（Serverless Databases）

### Neon（Serverless PostgreSQL）

| 特性（Feature） | 价值（Benefit） |
| -------------- | -------------- |
| Scale to zero（零实例） | 节省成本 |
| Instant branching（即时分支） | 开发/预览环境方便 |
| Full PostgreSQL（完整 PostgreSQL） | 兼容生态成熟 |
| Autoscaling（自动伸缩） | 自动应对流量波动 |

### Turso（Edge SQLite）

| 特性（Feature） | 价值（Benefit） |
| -------------- | -------------- |
| Edge locations（边缘节点） | 超低延迟 |
| SQLite compatible（兼容 SQLite） | 使用简单 |
| Generous free tier（较大免费额度） | 成本友好 |
| Global distribution（全球分布） | 全球访问性能更好 |

<!-- /preview -->
