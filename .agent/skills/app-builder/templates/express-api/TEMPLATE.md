---
name: express-api
description: Express.js REST API 模板原则。TypeScript、Prisma、JWT。
---

# Express.js API 模板

## 技术栈

| 组件 | 技术 |
| --- | --- |
| 运行时 | Node.js 20+ |
| 框架 | Express.js |
| 语言 | TypeScript |
| 数据库 | PostgreSQL + Prisma |
| 校验 | Zod |
| 认证 | JWT + bcrypt |

---

## 目录结构

```
project-name/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts           # Express 启动入口
│   ├── config/          # 环境配置
│   ├── routes/          # 路由处理
│   ├── controllers/     # 业务逻辑
│   ├── services/        # 数据访问
│   ├── middleware/
│   │   ├── auth.ts      # JWT 鉴权
│   │   ├── error.ts     # 错误处理
│   │   └── validate.ts  # Zod 校验
│   ├── schemas/         # Zod 模式
│   └── utils/
└── package.json
```

---

## 中间件栈

| 顺序 | 中间件 |
| --- | --- |
| 1 | helmet（安全） |
| 2 | cors |
| 3 | morgan（日志） |
| 4 | 请求体解析（body parsing） |
| 5 | routes |
| 6 | 错误处理（error handler） |

---

## API 响应格式

| 类型 | 结构 |
| --- | --- |
| 成功 | `{ success: true, data: {...} }` |
| 错误 | `{ error: "message", details: [...] }` |

---

## 设置步骤

1. 创建项目目录
2. `npm init -y`
3. 安装依赖：`npm install express prisma zod bcrypt jsonwebtoken`
4. 配置 Prisma
5. `npm run db:push`
6. `npm run dev`

---

## 最佳实践

- 分层架构（routes → controllers → services）
- 使用 Zod 验证所有输入
- 集中式错误处理
- 基于环境的配置
- 使用 Prisma 进行类型安全的数据库访问
