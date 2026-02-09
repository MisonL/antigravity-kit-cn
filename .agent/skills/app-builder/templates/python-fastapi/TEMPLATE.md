---
name: python-fastapi
description: FastAPI REST API 模板原则。SQLAlchemy、Pydantic、Alembic。
---

# FastAPI API Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Framework（框架） | FastAPI |
| Language（语言） | Python 3.11+ |
| ORM | SQLAlchemy 2.0 |
| Validation（验证） | Pydantic v2 |
| Migrations（迁移） | Alembic |
| Auth（认证） | JWT + passlib |

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
│   ├── dependencies/    # DI（依赖注入）
│   └── utils/
├── tests/
├── .env.example
└── requirements.txt
```

---

## Key Concepts（关键概念）

| Concept | Description |
| --- | --- |
| Async | 全程 async/await |
| Dependency Injection | FastAPI Depends |
| Pydantic v2 | Validation + serialization（验证与序列化） |
| SQLAlchemy 2.0 | Async sessions（异步会话） |

---

## API Structure（结构）

| Layer | Responsibility |
| --- | --- |
| Routers | HTTP handling（HTTP 处理） |
| Dependencies | Auth, validation（认证与验证） |
| Services | Business logic（业务逻辑） |
| Models | Database entities（数据库实体） |
| Schemas | Request/response（请求/响应） |

---

## Setup Steps（设置步骤）

1. `python -m venv venv`
2. `source venv/bin/activate`
3. `pip install fastapi uvicorn sqlalchemy alembic pydantic`
4. Create `.env`（创建环境文件）
5. `alembic upgrade head`
6. `uvicorn app.main:app --reload`

---

## Best Practices（最佳实践）

- Use async everywhere（全程 async）
- Pydantic v2 for validation（用于验证）
- SQLAlchemy 2.0 async sessions（异步会话）
- Alembic for migrations（迁移工具）
- pytest-asyncio for tests（异步测试）
