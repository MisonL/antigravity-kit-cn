---
name: express-api
description: Express.js REST API 模板原则。TypeScript、Prisma、JWT。
---

# Express.js API Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Runtime（运行时） | Node.js 20+ |
| Framework（框架） | Express.js |
| Language（语言） | TypeScript |
| Database（数据库） | PostgreSQL + Prisma |
| Validation（验证） | Zod |
| Auth（认证） | JWT + bcrypt |

---

## Directory Structure（目录结构）

```
project-name/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts           # Express setup（启动入口）
│   ├── config/          # Environment（环境配置）
│   ├── routes/          # Route handlers（路由处理）
│   ├── controllers/     # Business logic（业务逻辑）
│   ├── services/        # Data access（数据访问）
│   ├── middleware/
│   │   ├── auth.ts      # JWT verify（鉴权）
│   │   ├── error.ts     # Error handler（错误处理）
│   │   └── validate.ts  # Zod validation（校验）
│   ├── schemas/         # Zod schemas（模式）
│   └── utils/
└── package.json
```

---

## Middleware Stack（中间件栈）

| Order | Middleware |
| --- | --- |
| 1 | helmet（security） |
| 2 | cors |
| 3 | morgan（logging） |
| 4 | body parsing（请求体解析） |
| 5 | routes |
| 6 | error handler（错误处理） |

---

## API Response Format（响应格式）

| Type | Structure |
| --- | --- |
| Success（成功） | `{ success: true, data: {...} }` |
| Error（错误） | `{ error: "message", details: [...] }` |

---

## Setup Steps（设置步骤）

1. Create project directory（创建项目目录）
2. `npm init -y`
3. Install deps（安装依赖）: `npm install express prisma zod bcrypt jsonwebtoken`
4. Configure Prisma（配置 Prisma）
5. `npm run db:push`
6. `npm run dev`

---

## Best Practices（最佳实践）

- 分层架构（routes → controllers → services）
- 使用 Zod 验证所有输入
- 集中式错误处理
- 基于环境的配置
- 使用 Prisma 进行类型安全的 DB 访问
