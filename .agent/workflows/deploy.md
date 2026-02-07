---
description: 面向生产发布的部署命令。包含预检与部署执行流程。
---

# /deploy - 生产环境部署 (Production Deployment)

$ARGUMENTS

---

## 目的 (Purpose)

此命令用于处理生产环境部署，包含起飞前预检 (Pre-flight checks)、部署执行及最终验证。

---

## 子命令 (Sub-commands)

```
/deploy            - 交互式部署向导 (Wizard)
/deploy check      - 仅运行部署前预检
/deploy preview    - 部署到预览/测试环境 (Staging)
/deploy production - 部署到生产环境
/deploy rollback   - 回滚 (Rollback) 到上一个版本
```

---

## 部署前检查清单 (Pre-Deployment Checklist)

在任何部署开始之前：

```markdown
## 🚀 部署前预检清单 (Pre-Deploy Checklist)

### 代码质量

- [ ] 无 TypeScript 错误 (`npx tsc --noEmit`)
- [ ] ESLint 检查通过 (`npx eslint .`)
- [ ] 所有测试用例通过 (`npm test`)

### 安全性

- [ ] 无硬编码的机密信息
- [ ] 环境变量已文档化
- [ ] 依赖项已完成安全审计 (`npm audit`)

### 性能表现

- [ ] 包体积 (Bundle size) 在可接受范围内
- [ ] 移除所有 console.log 语句
- [ ] 图片资源已优化

### 文档更新

- [ ] README 已更新
- [ ] CHANGELOG 已更新
- [ ] API 文档为最新状态

### 确定要部署吗？ (y/n)
```

---

## 部署工作流 (Deployment Flow)

```
┌─────────────────┐
│  /deploy        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  起飞前预检      │
│  (Pre-flight)   │
└────────┬────────┘
         │
    通过？ ──否──► 修复问题
         │
        是
         │
         ▼
┌─────────────────┐
│  构建应用        │
│  (Build)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  部署到目标平台  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  健康检查与验证  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ 部署完成     │
└─────────────────┘
```

---

## 输出格式 (Output Format)

### 部署成功示例

```markdown
## 🚀 部署已完成 (Deployment Complete)

### 摘要 (Summary)

- **版本：** v1.2.3
- **环境：** 生产环境 (production)
- **耗时：** 47 秒
- **平台：** Vercel

### 访问入口 (URLs)

- 🌐 生产线上地址：https://app.example.com
- 📊 控制中心：https://vercel.com/project

### 变更内容 (What Changed)

- 新增了用户个人资料功能
- 修复了登录 Bug
- 更新了依赖项版本

### 健康检查 (Health Check)

✅ API 响应正常 (200 OK)
✅ 数据库已连接
✅ 所有服务状态健康
```

### 部署失败示例

```markdown
## ❌ 部署失败

### 错误摘要

构建过程在以下步骤失败：TypeScript 编译

### 错误详情
```

error TS2345: Argument of type 'string' is not assignable...

```

### 解决方案
1. 修复 `src/services/user.ts:45` 中的 TypeScript 错误
2. 在本地运行 `npm run build` 进行验证
3. 再次尝试 `/deploy`
4. 如果无法即时修复，请考虑回滚

### 可用回滚
上一个版本 (v1.2.2) 仍处于活动状态。
如有需要，请运行 `/deploy rollback`。
```

---

## 平台支持 (Platform Support)

| 平台    | 构建/部署命令          | 备注                    |
| ------- | ---------------------- | ----------------------- |
| Vercel  | `vercel --prod`        | Next.js 项目自动检测    |
| Railway | `railway up`           | 需要安装 Railway CLI    |
| Fly.io  | `fly deploy`           | 需要安装 flyctl         |
| Docker  | `docker compose up -d` | 适用于私有化/自托管部署 |

---

## 示例 (Examples)

```
/deploy
/deploy check
/deploy preview
/deploy production --skip-tests
/deploy rollback
```
