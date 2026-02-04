---
name: python-fastapi
description: FastAPI REST API 模版原则。SQLAlchemy, Pydantic, Alembic。
---

# FastAPI API 模版

## 技术栈

| 组件 | 技术           |
| ---- | -------------- |
| 框架 | FastAPI        |
| 语言 | Python 3.11+   |
| ORM  | SQLAlchemy 2.0 |
| 验证 | Pydantic v2    |
| 迁移 | Alembic        |
| 认证 | JWT + passlib  |

---

## 目录结构

```
project-name/
├── alembic/             # 迁移
├── app/
│   ├── main.py          # FastAPI 应用
│   ├── config.py        # 设置
│   ├── database.py      # DB 连接
│   ├── models/          # SQLAlchemy 模型
│   ├── schemas/         # Pydantic 模式
│   ├── routers/         # API 路由
│   ├── services/        # 业务逻辑
│   ├── dependencies/    # 依赖注入
│   └── utils/
├── tests/
├── .env.example
└── requirements.txt
```

---

## 关键概念

| 概念                 | 描述             |
| -------------------- | ---------------- |
| Async                | 全程 async/await |
| Dependency Injection | FastAPI Depends  |
| Pydantic v2          | 验证 + 序列化    |
| SQLAlchemy 2.0       | 异步会话         |

---

## API 结构

| 层           | 职责       |
| ------------ | ---------- |
| Routers      | HTTP 处理  |
| Dependencies | 认证，验证 |
| Services     | 业务逻辑   |
| Models       | 数据库实体 |
| Schemas      | 请求/响应  |

---

## 设置步骤

1. `python -m venv venv`
2. `source venv/bin/activate`
3. `pip install fastapi uvicorn sqlalchemy alembic pydantic`
4. 创建 `.env`
5. `alembic upgrade head`
6. `uvicorn app.main:app --reload`

---

## 最佳实践

- 随处使用 async
- 使用 Pydantic v2 进行验证
- SQLAlchemy 2.0 异步会话
- Alembic 用于迁移
- pytest-asyncio 用于测试
