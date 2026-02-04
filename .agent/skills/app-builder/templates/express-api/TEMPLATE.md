---
name: express-api
description: Express.js REST API 模版原则。TypeScript, Prisma, JWT。
---

# Express.js API 模版

## 技术栈

| 组件   | 技术                |
| ------ | ------------------- |
| 运行时 | Node.js 20+         |
| 框架   | Express.js          |
| 语言   | TypeScript          |
| 数据库 | PostgreSQL + Prisma |
| 验证   | Zod                 |
| 认证   | JWT + bcrypt        |

---

## 目录结构

```
project-name/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts           # Express 设置
│   ├── config/          # 环境
│   ├── routes/          # 路由处理程序
│   ├── controllers/     # 业务逻辑
│   ├── services/        # 数据访问
│   ├── middleware/
│   │   ├── auth.ts      # JWT 验证
│   │   ├── error.ts     # 错误处理程序
│   │   └── validate.ts  # Zod 验证
│   ├── schemas/         # Zod 模式
│   └── utils/
└── package.json
```

---

## 中间件栈

| 顺序 | 中间件        |
| ---- | ------------- |
| 1    | helmet (安全) |
| 2    | cors          |
| 3    | morgan (日志) |
| 4    | body parsing  |
| 5    | routes        |
| 6    | error handler |

---

## API 响应格式

| 类型 | 结构                                   |
| ---- | -------------------------------------- |
| 成功 | `{ success: true, data: {...} }`       |
| 错误 | `{ error: "message", details: [...] }` |

---

## 设置步骤

1. 创建项目目录
2. `npm init -y`
3. 安装依赖: `npm install express prisma zod bcrypt jsonwebtoken`
4. 配置 Prisma
5. `npm run db:push`
6. `npm run dev`

---

## 最佳实践

- 分层架构 (路由 → 控制器 → 服务)
- 使用 Zod 验证所有输入
- 集中式错误处理
- 基于环境的配置
- 使用 Prisma 进行类型安全的 DB 访问
