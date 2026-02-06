---
description: 面向生产发布的部署命令。包含预检与部署执行流程。
---

# /deploy - 生产部署

$ARGUMENTS

---

## 目的

此命令用于处理生产部署，涵盖部署前检查、部署执行与部署后验证。

---

## 子命令

```
/deploy            - 交互式部署向导
/deploy check      - 仅运行部署前检查
/deploy preview    - 部署到预览/预发环境
/deploy production - 部署到生产环境
/deploy rollback   - 回滚到上一版本
```

---

## 部署前检查清单

在任何部署前：

```markdown
## 🚀 Pre-Deploy Checklist

### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passing (`npx eslint .`)
- [ ] All tests passing (`npm test`)

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited (`npm audit`)

### Performance
- [ ] Bundle size acceptable
- [ ] No console.log statements
- [ ] Images optimized

### Documentation
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API docs current

### Ready to deploy? (y/n)
```

---

## 部署流程

```
┌─────────────────┐
│  /deploy        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pre-flight     │
│  checks         │
└────────┬────────┘
         │
    Pass? ──No──► Fix issues
         │
        Yes
         │
         ▼
┌─────────────────┐
│  Build          │
│  application    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy to      │
│  platform       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Health check   │
│  & verify       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ Complete    │
└─────────────────┘
```

---

## 输出格式

### 部署成功

```markdown
## 🚀 Deployment Complete

### Summary
- **Version:** v1.2.3
- **Environment:** production
- **Duration:** 47 seconds
- **Platform:** Vercel

### URLs
- 🌐 Production: https://app.example.com
- 📊 Dashboard: https://vercel.com/project

### What Changed
- Added user profile feature
- Fixed login bug
- Updated dependencies

### Health Check
✅ API responding (200 OK)
✅ Database connected
✅ All services healthy
```

### 部署失败

```markdown
## ❌ Deployment Failed

### Error
Build failed at step: TypeScript compilation

### Details
```
error TS2345: Argument of type 'string' is not assignable...
```

### Resolution
1. Fix TypeScript error in `src/services/user.ts:45`
2. Run `npm run build` locally to verify
3. Try `/deploy` again

### Rollback Available
Previous version (v1.2.2) is still active.
Run `/deploy rollback` if needed.
```

---

## 平台支持

| Platform | Command | Notes |
|----------|---------|-------|
| Vercel | `vercel --prod` | Next.js 会自动识别 |
| Railway | `railway up` | 需要 Railway CLI |
| Fly.io | `fly deploy` | 需要 flyctl |
| Docker | `docker compose up -d` | 适用于自托管 |

---

## 示例

```
/deploy
/deploy check
/deploy preview
/deploy production --skip-tests
/deploy rollback
```
