---
name: python-fastapi
description: FastAPI REST API template principles（API 模板原则）。SQLAlchemy、Pydantic、Alembic。
---

# FastAPI API Template（API 模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Framework（框架） | FastAPI |
| Language（语言） | Python 3.11+ |
| ORM | SQLAlchemy 2.0 |
| Validation（校验） | Pydantic v2 |
| Migrations（迁移） | Alembic |
| Auth（认证） | JWT + passlib（密码哈希） |

---

## Directory Structure（目录结构）

```
project-name/
├── alembic/             # Migrations（迁移）
├── app/
│   ├── main.py          # FastAPI app（应用）
│   ├── config.py        # Settings（配置）
│   ├── database.py      # DB connection（数据库连接）
│   ├── models/          # SQLAlchemy models（模型）
│   ├── schemas/         # Pydantic schemas（模式）
│   ├── routers/         # API routes（路由）
│   ├── services/        # Business logic（业务逻辑）
│   ├── dependencies/    # Dependency Injection（依赖注入）
│   └── utils/
├── tests/
├── .env.example
└── requirements.txt
```

---

## Key Concepts（关键概念）

| Concept（概念） | Description（说明） |
| --- | --- |
| Async（异步） | async/await throughout（全程 async/await） |
| Dependency Injection（依赖注入） | FastAPI Depends |
| Pydantic v2 | Validation + serialization（验证 + 序列化） |
| SQLAlchemy 2.0 | Async sessions（异步会话） |

---

## API Structure（API 结构）

| Layer（层） | Responsibility（职责） |
| --- | --- |
| Routers（路由层） | HTTP handling（HTTP 处理） |
| Dependencies（依赖层） | Auth, validation（认证、校验） |
| Services（服务层） | Business logic（业务逻辑） |
| Models（模型层） | Database entities（数据库实体） |
| Schemas（模式层） | Request/response（请求/响应） |

---

## Setup Steps（设置步骤）

1. `python -m venv venv`
2. `source venv/bin/activate`
3. `pip install fastapi uvicorn sqlalchemy alembic pydantic`
4. Create `.env`（创建）
5. `alembic upgrade head`
6. `uvicorn app.main:app --reload`

---

## Best Practices（最佳实践）

- Use async everywhere（全程使用 async）
- Pydantic v2 for validation（用于验证）
- SQLAlchemy 2.0 async sessions（异步会话）
- Alembic for migrations（迁移）
- pytest-asyncio for tests（测试）
