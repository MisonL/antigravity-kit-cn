---
name: python-patterns
description: Python 开发原则与决策。框架选择、异步模式、类型提示、项目结构。教导思考而非复制。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Python Patterns - Python 模式

> 2025 年 Python 开发的原则与决策。
> **学会思考，而不是死记模式。**

---

## ⚠️ 如何使用此 Skill

本 Skill 教授 **决策原则**，而非供复制的固定代码。

- 不清楚时 **询问** 用户关于框架的偏好
- 根据 **上下文** 选择 async vs sync
- 不要每次都默认使用相同的框架

---

## 1. 框架选择

### 决策树

```
你要构建什么？
│
├── API 优先 / 微服务
│   └── FastAPI (异步, 现代, 快速)
│
├── 全栈 Web / CMS / Admin
│   └── Django (电池内置)
│
├── 简单 / 脚本 / 学习
│   └── Flask (极简, 灵活)
│
├── AI/ML API 服务
│   └── FastAPI (Pydantic, 异步, uvicorn)
│
└── 后台 Worker
    └── Celery + 任何框架
```

### 比较原则

| 因素         | FastAPI                        | Django      | Flask      |
| ------------ | ------------------------------ | ----------- | ---------- |
| **最适合**   | API, 微服务                    | 全栈, CMS   | 简单, 学习 |
| **异步**     | 原生                           | Django 5.0+ | 通过扩展   |
| **Admin**    | 手动                           | 内置        | 通过扩展   |
| **ORM**      | 自己选择 (SQLAlchemy/Tortoise) | Django ORM  | 自己选择   |
| **学习曲线** | 低                             | 中 (陡峭)   | 低         |

### 选择时要问的问题：

1. 是纯 API 还是全栈？
2. 需要 Admin 界面吗？
3. 团队熟悉异步吗？
4. 现有基础设施如何？

---

## 2. 异步 (Async) vs 同步 (Sync) 决策

### 何时使用 Async

```
async def 在以下情况更好：
├── I/O 密集型操作 (数据库, HTTP, 文件)
├── 许多并发连接
├── 实时特性
├── 微服务通信
└── FastAPI/Starlette/Django ASGI

def (sync) 在以下情况更好：
├── CPU 密集型操作
├── 简单脚本
├── 遗留代码库
├── 团队不熟悉异步
└── 阻塞库 (无异步版本)
```

### 黄金法则

```
I/O 密集型 → async (等待外部)
CPU 密集型 → sync + multiprocessing (多进程计算)

不要：
├── 粗心地混合 sync 和 async
├── 在 async 代码中使用 sync 库
└── 强行对 CPU 工作使用 async
```

### 异步库选择

| 需求        | 异步库                         |
| ----------- | ------------------------------ |
| HTTP 客户端 | httpx                          |
| PostgreSQL  | asyncpg                        |
| Redis       | aioredis / redis-py async      |
| 文件 I/O    | aiofiles                       |
| 数据库 ORM  | SQLAlchemy 2.0 async, Tortoise |

---

## 3. 类型提示策略

### 何时添加类型

```
总是添加类型:
├── 函数参数
├── 返回类型
├── 类属性
├── 公共 API

可以跳过:
├── 局部变量 (让推断工作)
├── 一次性脚本
├── 测试 (通常)
```

### 常见类型模式

```python
# 理解这些模式：

# Optional → 可能是 None
from typing import Optional
def find_user(id: int) -> Optional[User]: ...

# Union → 多种类型之一
def process(data: str | dict) -> None: ...

# Generic collections
def get_items() -> list[Item]: ...
def get_mapping() -> dict[str, int]: ...

# Callable
from typing import Callable
def apply(fn: Callable[[int], str]) -> str: ...
```

### Pydantic 用于验证

```
何时使用 Pydantic:
├── API 请求/响应模型
├── 配置/设置
├── 数据验证
├── 序列化

好处:
├── 运行时验证
├── 自动生成 JSON schema
├── 与 FastAPI 原生集成
└── 清晰的错误消息
```

---

## 4. 项目结构原则

### 结构选择

```
小项目 / 脚本:
├── main.py
├── utils.py
└── requirements.txt

中型 API:
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── schemas/
├── tests/
└── pyproject.toml

大型应用:
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
按特性或层组织:

按层 (By layer):
├── routes/ (API 端点)
├── services/ (业务逻辑)
├── models/ (数据库模型)
├── schemas/ (Pydantic 模型)
└── dependencies/ (共享依赖)

按特性 (By feature):
├── users/
│   ├── routes.py
│   ├── service.py
│   └── schemas.py
└── products/
    └── ...
```

---

## 5. Django 原则

### Django Async (Django 5.0+)

```
Django 支持异步:
├── 异步视图 (Async views)
├── 异步中间件 (Async middleware)
├── 异步 ORM (有限)
└── ASGI 部署

何时在 Django 中使用异步:
├── 外部 API 调用
├── WebSocket (Channels)
├── 高并发视图
└── 后台任务触发
```

### Django 最佳实践

```
模型设计:
├── 胖模型，瘦视图 (Fat models, thin views)
├── 对常用查询使用 Managers
├── 对共享字段使用抽象基类

视图:
├── 复杂 CRUD 使用基于类的视图 (CBV)
├── 简单端点使用基于函数的视图 (FBV)
├── DRF 使用 ViewSets

查询:
├── select_related() 用于 FK (外键)
├── prefetch_related() 用于 M2M (多对多)
├── 避免 N+1 查询
└── 使用 .only() 获取特定字段
```

---

## 6. FastAPI 原则

### async def vs def

```
使用 async def 当:
├── 使用异步数据库驱动
├── 进行异步 HTTP 调用
├── I/O 密集型操作
└── 想要处理并发

使用 def 当:
├── 阻塞操作
├── 同步数据库驱动
├── CPU 密集型工作
└── FastAPI 会自动在线程池中运行它
```

### 依赖注入

```
使用依赖注入用于:
├── 数据库会话
├── 当前用户 / Auth
├── 配置
├── 共享资源

好处:
├── 可测试性 (mock 依赖)
├── 清晰的分离
├── 自动清理 (yield)
```

### Pydantic v2 集成

```python
# FastAPI + Pydantic 紧密集成:

# 请求验证
@app.post("/users")
async def create(user: UserCreate) -> UserResponse:
    # user 已经被验证
    ...

# 响应序列化
# 返回类型变成响应 schema
```

---

## 7. 后台任务

### 选择指南

| 解决方案            | 最适合                       |
| ------------------- | ---------------------------- |
| **BackgroundTasks** | 简单, 进程内任务             |
| **Celery**          | 分布式, 复杂工作流           |
| **ARQ**             | 异步, 基于 Redis             |
| **RQ**              | 简单 Redis 队列              |
| **Dramatiq**        | 基于 Actor, 比 Celery 更简单 |

### 何时使用每种

```
FastAPI BackgroundTasks:
├── 快速操作
├── 无需持久化
├── 射后不理 (Fire-and-forget)
└── 同一进程

Celery/ARQ:
├── 长时间运行的任务
├── 需要重试逻辑
├── 分布式 Worker
├── 持久化队列
└── 复杂工作流
```

---

## 8. 错误处理原则

### 异常策略

```
在 FastAPI 中:
├── 创建自定义异常类
├── 注册异常处理程序
├── 返回一致的错误格式
└── 记录日志而不暴露内部细节

模式:
├── 在 Service 中抛出领域异常
├── 在 Handler 中捕获并转换
└── 客户端获得干净的错误响应
```

### 错误响应哲学

```
包括:
├── 错误代码 (编程用)
├── 消息 (人类可读)
├── 细节 (适用时字段级)
└── 不包含堆栈跟踪 (安全)
```

---

## 9. 测试原则

### 测试策略

| 类型            | 目的       | 工具                      |
| --------------- | ---------- | ------------------------- |
| **Unit**        | 业务逻辑   | pytest                    |
| **Integration** | API 端点   | pytest + httpx/TestClient |
| **E2E**         | 完整工作流 | pytest + DB               |

### 异步测试

```python
# 使用 pytest-asyncio 进行异步测试

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/users")
        assert response.status_code == 200
```

### Fixtures 策略

```
常用 Fixtures:
├── db_session → 数据库连接
├── client → 测试客户端
├── authenticated_user → 带有 Token 的用户
└── sample_data → 测试数据设置
```

---

## 10. 决策检查清单

实施前：

- [ ] **询问过用户关于框架的偏好？**
- [ ] **为当前上下文选择了框架？** (不仅仅是默认)
- [ ] **决定了 async vs sync？**
- [ ] **规划了类型提示策略？**
- [ ] **定义了项目结构？**
- [ ] **规划了错误处理？**
- [ ] **考虑了后台任务？**

---

## 11. 避免的反模式

### ❌ 不要 (DON'T):

- 对于简单 API 默认使用 Django (FastAPI 可能更好)
- 在 async 代码中使用 sync 库
- 跳过公共 API 的类型提示
- 将业务逻辑放在路由/视图中
- 忽略 N+1 查询
- 粗心地混合 async 和 sync

### ✅ 要 (DO):

- 根据上下文选择框架
- 询问关于 async 的需求
- 使用 Pydantic 进行验证
- 关注点分离 (routes → services → repos)
- 测试关键路径

---

> **记住**：Python 模式是关于为你特定上下文做决策。不要复制代码——思考什么最适合你的应用。
