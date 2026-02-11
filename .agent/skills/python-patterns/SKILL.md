---
name: python-patterns
description: Python（编程语言）开发原则与决策方法。覆盖框架选型、异步模式、类型标注与项目结构。强调思考而非照抄。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Python 模式

> 面向 2025 的 Python 开发原则与决策方法。  
> **学习如何思考，不要只记模式。**

---

## ⚠️ 本技能使用方式

本技能强调**决策原则**，不是固定代码模板。

- 需求不明确时，先询问用户框架偏好
- 根据 Context（上下文）决定 async（异步）或 sync（同步）
- 不要每次都默认同一框架

---

## 1. 框架选型（2025）

### 决策树

```
What are you building?
│
├── API-first / Microservices
│   └── FastAPI (async, modern, fast)
│
├── Full-stack web / CMS / Admin
│   └── Django (batteries-included)
│
├── Simple / Script / Learning
│   └── Flask (minimal, flexible)
│
├── AI/ML API serving
│   └── FastAPI (Pydantic, async, uvicorn)
│
└── Background workers
    └── Celery + any framework
```

### 对比原则

| 维度 | FastAPI | Django | Flask |
|------|---------|--------|-------|
| **适用场景** | API、微服务 | 全栈、CMS | 简单项目、学习 |
| **异步支持** | 原生支持 | Django 5.0+ | 依赖扩展 |
| **管理后台** | 手动构建 | 内置 Admin（管理后台） | 依赖扩展 |
| **ORM（对象关系映射）** | 自由选择 | Django ORM | 自由选择 |
| **学习曲线** | 低 | 中 | 低 |

### 选型前必须询问：
1. 是纯 API 还是全栈应用？
2. 是否需要后台管理界面？
3. 团队是否熟悉 async？
4. 是否有现有基础设施约束？

---

## 2. 异步与同步决策

### 何时使用异步（async）

```
async def is better when:
├── I/O-bound operations (database, HTTP, file)
├── Many concurrent connections
├── Real-time features
├── Microservices communication
└── FastAPI/Starlette/Django ASGI

def (sync) is better when:
├── CPU-bound operations
├── Simple scripts
├── Legacy codebase
├── Team unfamiliar with async
└── Blocking libraries (no async version)
```

### 黄金法则

```
I/O-bound → async (waiting for external)
CPU-bound → sync + multiprocessing (computing)

Don't:
├── Mix sync and async carelessly
├── Use sync libraries in async code
└── Force async for CPU work
```

### 异步库选型

| 需求 | 异步库 |
|------|--------|
| HTTP 客户端 | httpx |
| PostgreSQL | asyncpg |
| Redis（内存数据库） | aioredis / redis-py async |
| 文件 I/O | aiofiles |
| 数据库 ORM | SQLAlchemy 2.0 async, Tortoise |

---

## 3. 类型标注策略

### 哪些地方要标注

```
Always type:
├── Function parameters
├── Return types
├── Class attributes
├── Public APIs

Can skip:
├── Local variables (let inference work)
├── One-off scripts
├── Tests (usually)
```

### 常见类型模式

```python
# 下面是模式示例，请理解其语义：

# Optional（可选）→ 可能为 None
from typing import Optional
def find_user(id: int) -> Optional[User]: ...

# Union（联合类型）→ 多类型之一
def process(data: str | dict) -> None: ...

# 泛型集合
def get_items() -> list[Item]: ...
def get_mapping() -> dict[str, int]: ...

# Callable（可调用）
from typing import Callable
def apply(fn: Callable[[int], str]) -> str: ...
```

### 用 Pydantic（数据校验库）做校验

```
When to use Pydantic:
├── API request/response models
├── Configuration/settings
├── Data validation
├── Serialization

Benefits:
├── Runtime validation
├── Auto-generated JSON schema
├── Works with FastAPI natively
└── Clear error messages
```

---

## 4. 项目结构原则

### 结构选择

```
Small project / Script:
├── main.py
├── utils.py
└── requirements.txt

Medium API:
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── schemas/
├── tests/
└── pyproject.toml

Large application:
├── src/
│   └── myapp/
│       ├── core/
│       ├── api/
│       ├── services/
│       ├── models/
│       └── ...
├── tests/
└── pyproject.toml
```

### FastAPI 结构原则

```
Organize by feature or layer:

By layer:
├── routes/ (API endpoints)
├── services/ (business logic)
├── models/ (database models)
├── schemas/ (Pydantic models)
└── dependencies/ (shared deps)

By feature:
├── users/
│   ├── routes.py
│   ├── service.py
│   └── schemas.py
└── products/
    └── ...
```

---

## 5. Django 原则（2025）

### Django 异步能力（Django 5.0+）

```
Django supports async:
├── Async views
├── Async middleware
├── Async ORM (limited)
└── ASGI deployment

When to use async in Django:
├── External API calls
├── WebSocket (Channels)
├── High-concurrency views
└── Background task triggering
```

### Django 最佳实践

```
Model design:
├── Fat models, thin views
├── Use managers for common queries
├── Abstract base classes for shared fields

Views:
├── Class-based for complex CRUD
├── Function-based for simple endpoints
├── Use viewsets with DRF

Queries:
├── select_related() for FKs
├── prefetch_related() for M2M
├── Avoid N+1 queries
└── Use .only() for specific fields
```

---

## 6. FastAPI 原则

### FastAPI 中 `async def` 与 `def` 的选择

```
Use async def when:
├── Using async database drivers
├── Making async HTTP calls
├── I/O-bound operations
└── Want to handle concurrency

Use def when:
├── Blocking operations
├── Sync database drivers
├── CPU-bound work
└── FastAPI runs in threadpool automatically
```

### 依赖注入

```
Use dependencies for:
├── Database sessions
├── Current user / Auth
├── Configuration
├── Shared resources

Benefits:
├── Testability (mock dependencies)
├── Clean separation
├── Automatic cleanup (yield)
```

### Pydantic v2 集成

```python
# FastAPI + Pydantic are tightly integrated:

# Request validation
@app.post("/users")
async def create(user: UserCreate) -> UserResponse:
    # user is already validated
    ...

# Response serialization
# Return type becomes response schema
```

---

## 7. 后台任务

### 方案选择指南

| 方案 | 适用场景 |
|------|----------|
| **BackgroundTasks** | 简单、进程内任务 |
| **Celery** | 分布式、复杂工作流 |
| **ARQ** | 异步 + Redis |
| **RQ** | 简单 Redis 队列 |
| **Dramatiq** | Actor 模式，比 Celery 更轻量 |

### 各方案适用场景

```
FastAPI BackgroundTasks:
├── Quick operations
├── No persistence needed
├── Fire-and-forget
└── Same process

Celery/ARQ:
├── Long-running tasks
├── Need retry logic
├── Distributed workers
├── Persistent queue
└── Complex workflows
```

---

## 8. 错误处理原则

### 异常策略

```
In FastAPI:
├── Create custom exception classes
├── Register exception handlers
├── Return consistent error format
└── Log without exposing internals

Pattern:
├── Raise domain exceptions in services
├── Catch and transform in handlers
└── Client gets clean error response
```

### 错误响应原则

```
Include:
├── Error code (programmatic)
├── Message (human readable)
├── Details (field-level when applicable)
└── NOT stack traces (security)
```

---

## 9. 测试原则

### 测试策略

| 类型 | 目的 | 工具 |
|------|------|------|
| **单元测试（Unit）** | 业务逻辑 | pytest |
| **集成测试（Integration）** | API 端点 | pytest + httpx/TestClient |
| **端到端测试（E2E）** | 完整工作流 | pytest + DB |

### 异步测试

```python
# Use pytest-asyncio for async tests

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/users")
        assert response.status_code == 200
```

### Fixture 策略

```
Common fixtures:
├── db_session → Database connection
├── client → Test client
├── authenticated_user → User with token
└── sample_data → Test data setup
```

---

## 10. 决策检查清单

开始实现前：

- [ ] **是否询问了用户的框架偏好？**
- [ ] **是否针对当前上下文选了框架？**（而非默认）
- [ ] **是否明确了异步 vs 同步（async/sync）？**
- [ ] **是否规划了类型标注策略？**
- [ ] **是否确定了项目结构？**
- [ ] **是否设计了错误处理方案？**
- [ ] **是否评估了后台任务需求？**

---

## 11. 需要避免的反模式

### ❌ 不要这样做：
- 简单 API 也默认 Django（FastAPI 往往更合适）
- 在 async 代码里用 sync 库
- 对公开 API 跳过类型标注
- 把业务逻辑塞进 routes/views
- 忽略 N+1 查询
- 粗糙混用 async 与 sync

### ✅ 推荐做法：
- 基于上下文选框架
- 先确认 async 需求
- 用 Pydantic 做数据校验
- 分层解耦（routes → services → repos（仓储层））
- 覆盖关键路径测试

---

> **牢记：** Python 模式的核心是“按当前场景做决策”。不要抄代码，先判断什么最适合你的应用。
