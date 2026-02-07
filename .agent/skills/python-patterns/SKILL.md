---
name: python-patterns
description: Python 开发原则与决策。框架选择、异步模式、类型提示、项目结构。教导思考而非复制。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Python 模式 (Python Patterns)

> 2025 年 Python 开发的原则与决策。
> **学会思考，而不是死记代码模式。**

---

## ⚠️ 如何使用此技能 (Skill)

本技能教授的是 **决策原则**，而非可以直接复制的固定代码。

- 不清楚时 **询问** 用户关于框架的偏好
- 根据 **上下文 (Context)** 选择异步 (Async) 或同步 (Sync)
- 不要每次都默认使用相同的框架

---

## 1. 框架选择 (2025)

### 决策树

```
你要构建什么？
│
├── API 优先 / 微服务 (Microservices)
│   └── FastAPI (异步，现代，快速)
│
├── 全栈 Web / CMS / 后台管理
│   └── Django (功能齐整)
│
├── 简单项目 / 脚本 / 学习
│   └── Flask (极简，灵活)
│
├── AI/ML API 服务
│   └── FastAPI (Pydantic, 异步, uvicorn)
│
└── 后台任务处理 (Background workers)
    └── Celery + 任意框架
```

### 比较原则

| 因素             | FastAPI     | Django      | Flask          |
| ---------------- | ----------- | ----------- | -------------- |
| **最适合**       | API, 微服务 | 全栈, CMS   | 简单项目, 学习 |
| **异步 (Async)** | 原生支持    | Django 5.0+ | 通过扩展支持   |
| **管理后台**     | 手动构建    | 内置        | 通过扩展支持   |
| **ORM**          | 自行选择    | Django ORM  | 自行选择       |
| **学习曲线**     | 低          | 中          | 低             |

### 选型提问：

1. 仅限 API 还是全栈项目？
2. 是否需要管理后台界面？
3. 团队是否熟悉异步编程？
4. 现有的基础设施如何？

---

## 2. 异步 vs 同步决策

### 何时使用异步 (Async)

```
async def 在以下场景更佳：
├── I/O 密集型操作 (数据库, HTTP, 文件)
├── 大量并发连接
├── 实时特性 (Real-time features)
├── 微服务间通信
└── FastAPI / Starlette / Django ASGI
```

### 何时使用同步 (Sync)

```
def (同步) 在以下场景更佳：
├── CPU 密集型操作
├── 简单脚本
├── 遗留代码库
├── 团队不熟悉异步
└── 阻塞性库 (无异步版本)
```

### 黄金法则

```
I/O 密集型 → 异步 (等待外部响应)
CPU 密集型 → 同步 + 多进程 (multiprocessing) (进行计算)

不要：
├── 随意混合同步与异步
├── 在异步代码中使用同步库
└── 强行在 CPU 工作中使用异步
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

## 3. 类型提示 (Type Hints) 策略

### 何时使用类型

```
始终标记类型：
├── 函数参数
├── 返回值类型
├── 类属性
├── 公开 API (Public APIs)

可以跳过：
├── 局部变量（利用类型推断）
├── 一次性脚本
├── 测试代码（通常）
```

### 常见类型模式

```python
# 这些是模式，请理解它们：

# Optional → 可能是 None
from typing import Optional
def find_user(id: int) -> Optional[User]: ...

# Union → 多种类型之一
def process(data: str | dict) -> None: ...

# 泛型集合
def get_items() -> list[Item]: ...
def get_mapping() -> dict[str, int]: ...

# Callable
from typing import Callable
def apply(fn: Callable[[int], str]) -> str: ...
```

### 使用 Pydantic 进行校验

```
何时使用 Pydantic：
├── API 请求/响应模型 (Models)
├── 配置/设置 (Settings)
├── 数据验证 (Validation)
├── 序列化 (Serialization)

优势：
├── 运行时验证
├── 自动生成 JSON Schema
├── 与 FastAPI 原生集成
└── 清晰的错误消息
```

---

## 4. 项目结构原则

### 结构选择

```
小型项目 / 脚本：
├── main.py
├── utils.py
└── requirements.txt

中型 API：
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── schemas/
├── tests/
└── pyproject.toml

大型应用：
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
按功能或按层组织：

按层组织：
├── routes/ (API 端点)
├── services/ (业务逻辑)
├── models/ (数据库模型)
├── schemas/ (Pydantic 模型)
└── dependencies/ (共享依赖)

按功能组织：
├── users/
│   ├── routes.py
│   ├── service.py
│   └── schemas.py
└── products/
    └── ...
```

---

## 5. Django 原则 (2025)

### Django 异步支持 (Django 5.0+)

```
Django 支持异步：
├── 异步视图 (Async views)
├── 异步中间件
├── 异步 ORM（受限）
└── ASGI 部署

何时在 Django 中使用异步：
├── 外部 API 调用
├── WebSocket (Channels)
├── 高并发视图
└── 触发后台任务
```

### Django 最佳实践

```
模型设计：
├── 胖模型，瘦视图 (Fat models, thin views)
├── 为常用查询使用管理器 (Managers)
├── 为共享字段使用抽象基类

视图：
├── 复杂 CRUD 使用类视图 (CBV)
├── 简单端点使用函数视图 (FBV)
├── DRF 使用 ViewSets

查询：
├── select_related() 用于外键 (FKs)
├── prefetch_related() 用于多对多 (M2M)
├── 避免 N+1 查询
└── 使用 .only() 获取特定字段
```

---

## 6. FastAPI 原则

### async def vs def 在 FastAPI 中

```
在以下情况使用 async def：
├── 使用异步数据库驱动
├── 进行异步 HTTP 调用
├── I/O 密集型操作
├── 希望处理并发

在以下情况使用 def：
├── 阻塞性操作
├── 同步数据库驱动
├── CPU 密集型工作
└── FastAPI 会自动在线程池中运行它们
```

### 依赖注入 (Dependency Injection)

```
为以下内容使用依赖：
├── 数据库会话 (Sessions)
├── 当前用户 / 认证 (Auth)
├── 配置信息
├── 共享资源

优势：
├── 可测试性 (模拟依赖)
├── 清晰的分离
├── 自动清理 (yield)
```

### Pydantic v2 集成

```python
# FastAPI + Pydantic 紧密集成：

# 请求验证
@app.post("/users")
async def create(user: UserCreate) -> UserResponse:
    # user 已通过验证
    ...

# 响应序列化
# 返回类型即变为响应 Schema
```

---

## 7. 后台任务 (Background Tasks)

### 选择指南

| 解决方案            | 最适合                            |
| ------------------- | --------------------------------- |
| **BackgroundTasks** | 简单的进程内任务                  |
| **Celery**          | 分布式、复杂的流水线 (Workflows)  |
| **ARQ**             | 异步、基于 Redis                  |
| **RQ**              | 简单的 Redis 队列                 |
| **Dramatiq**        | 基于 Actor 模式，比 Celery 更简单 |

### 何时使用

```
FastAPI BackgroundTasks：
├── 快速操作
├── 无需持久化
├── fire-and-forget (即发即弃)
└── 同一进程内

Celery/ARQ：
├── 长时间运行的任务
├── 需要重试逻辑
├── 分布式工作节点 (Workers)
├── 持久化队列
└── 复杂的流水线
```

---

## 8. 错误处理原则

### 异常策略

```
在 FastAPI 中：
├── 创建自定义异常类
├── 注册异常处理器 (Handlers)
├── 返回一致的错误格式
└── 记录日志且不暴露内部细节

模式：
├── 在服务层抛出领域异常
├── 在处理器中捕获并转换
└── 客户端获得干净的错误响应
```

### 错误响应哲学

```
包含以下项：
├── 错误代码 (编程使用)
├── 消息 (人类可读)
├── 详情 (适用时提供字段级信息)
└── **禁止** 堆栈跟踪 (安全风险)
```

---

## 9. 测试原则

### 测试策略

| 类型                       | 目的     | 工具                      |
| -------------------------- | -------- | ------------------------- |
| **单元测试 (Unit)**        | 业务逻辑 | pytest                    |
| **集成测试 (Integration)** | API 端点 | pytest + httpx/TestClient |
| **端到端测试 (E2E)**       | 完整流程 | pytest + 数据库           |

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

### 固件 (Fixtures) 策略

```
常用固件：
├── db_session → 数据库连接
├── client → 测试客户端
├── authenticated_user → 带有 Token 的用户
└── sample_data → 测试数据设置
```

---

## 10. 决策检查清单

在实施之前：

- [ ] **询问过用户关于框架的偏好？**
- [ ] **为当前场景选择了框架？**（而非单纯默认）
- [ ] **决定了使用异步还是同步？**
- [ ] **规划了类型提示策略？**
- [ ] **定义了项目结构？**
- [ ] **规划了错误处理？**
- [ ] **考虑了后台任务？**

---

## 11. 避免的反模式

### ❌ 不要：

- 在简单的 API 中默认使用 Django（FastAPI 可能更佳）
- 在异步代码中使用同步库
- 忽略公开 API 的类型提示
- 将业务逻辑放在路由/视图中
- 忽视 N+1 查询
- 随意混合异步与同步

### ✅ 要：

- 根据上下文选择框架
- 询问关于异步的需求
- 使用 Pydantic 进行校验
- 关注点分离（路由 → 服务 → 仓储）
- 测试关键路径

---

> **记住**：Python 模式核心在于为特定场景进行决策。不要直接复制代码 —— 思考什么最适合你的应用。
