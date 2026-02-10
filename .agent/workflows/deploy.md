---
description: 面向生产发布的部署命令。包含预检与部署执行流程。
---

# /deploy - 生产部署

$ARGUMENTS

---

## 目的

此命令用于处理生产环境部署，包含预检、部署执行及最终验证。

---

## 子命令

```
/deploy            - 交互式部署向导
/deploy check      - 仅运行部署前检查
/deploy preview    - 部署到预览/测试环境
/deploy production - 部署到生产环境
/deploy rollback   - 回滚到上一个版本
```

---

## 部署前检查清单

在任何部署开始之前：

```markdown
## 🚀 Pre-Deploy Checklist

### 代码质量
- [ ] 无 TypeScript 错误 (`npx tsc --noEmit`)
- [ ] ESLint 检查通过 (`npx eslint .`)
- [ ] 所有测试用例通过 (`npm test`)

### 安全性
- [ ] 无硬编码的机密信息
- [ ] 环境变量已文档化
- [ ] 依赖项已完成安全审计 (`npm audit`)

### 性能
- [ ] Bundle size（包体积）在可接受范围内
- [ ] 移除所有 console.log 语句
- [ ] 图片资源已优化

### 文档
- [ ] README 已更新
- [ ] CHANGELOG 已更新
- [ ] API 文档为最新状态

### 是否部署？（y/n）
```

---

## 部署流程

```
┌─────────────────┐
│  开始部署        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  预检            │
│  (Pre-flight)   │
└────────┬────────┘
         │
    通过？ ──否──► 修复问题
         │
        是
         │
         ▼
┌─────────────────┐
│  构建            │
│  应用            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  部署到          │
│  平台            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  健康检查        │
│  与验证          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ 完成         │
└─────────────────┘
```

---

## 输出格式

### 部署成功

```markdown
## 🚀 Deployment Complete

### 摘要
- **版本：** v1.2.3
- **环境：** production
- **耗时：** 47 秒
- **平台：** Vercel

### 访问入口
- 🌐 生产线上地址：https://app.example.com
- 📊 控制中心：https://vercel.com/project

### 变更内容
- 新增用户个人资料功能
- 修复登录问题
- 更新依赖项

### 健康检查
✅ API 响应正常（200 OK）
✅ 数据库已连接
✅ 所有服务状态健康
```

### 部署失败

```markdown
## ❌ Deployment Failed

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

### 可用回滚
上一个版本（v1.2.2）仍处于活动状态。
如有需要，请运行 `/deploy rollback`。
```

---

## 平台支持

| 平台 | 构建/部署命令 | 备注 |
| --- | --- | --- |
| Vercel | `vercel --prod` | Next.js 项目自动检测 |
| Railway | `railway up` | 需要安装 Railway CLI |
| Fly.io | `fly deploy` | 需要安装 flyctl |
| Docker | `docker compose up -d` | 适用于自托管部署 |

---

## 示例

```
/deploy
/deploy check
/deploy preview
/deploy production
/deploy rollback
```
