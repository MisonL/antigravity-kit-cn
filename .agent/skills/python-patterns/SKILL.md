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

常见框架包括 FastAPI（异步 Web 框架）、Django（全栈框架）、Flask（微框架）。

- 需求不明确时，先询问用户框架偏好
- 根据上下文（Context）决定 async（异步）或 sync（同步）
- 不要每次都默认同一框架

---

## 1. 框架选型（2025）

### 决策树

```
你要构建什么？
│
├── API 优先（API-first）/ 微服务
│   └── FastAPI（async、现代、速度快）
│
├── 全栈 Web / CMS / 管理后台
│   └── Django（开箱即用，batteries-included）
│
├── 简单应用 / 脚本 / 学习
│   └── Flask（极简、灵活）
│
├── AI/ML API 服务化
│   └── FastAPI（Pydantic、async、Uvicorn）
│
└── 后台任务
    └── Celery + 任意 Web 框架
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
async def（异步函数）更适合：
├── I/O 密集操作（数据库、HTTP、文件）
├── 大量并发连接
├── 实时交互场景
├── 微服务通信
└── FastAPI/Starlette/Django ASGI（异步服务器网关接口）

def（同步函数）更适合：
├── CPU 密集操作
├── 简单脚本
├── 遗留代码库
├── 团队不熟悉 async
└── 依赖阻塞型库（无 async 版本）
```

### 黄金法则

```
I/O bound（I/O 密集）→ async（等待外部资源）
CPU bound（CPU 密集）→ sync + multiprocessing（本地计算）

不要：
├── 随意混用 sync 与 async
├── 在 async 代码里调用阻塞库
└── 为 CPU 任务强行上 async
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
必须标注：
├── 函数参数
├── 返回类型
├── 类属性
├── 对外公开 API

可省略：
├── 局部变量（让推断工作）
├── 一次性脚本
├── 测试代码（通常可选）
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
适用场景：
├── API 请求/响应模型
├── 配置与 settings
├── 数据校验
├── 序列化

收益：
├── 运行时校验
├── 自动生成 JSON Schema（JSON 模式）
├── 与 FastAPI 原生协同
└── 清晰错误提示
```

---

## 4. 项目结构原则

### 结构选择

```
小项目 / 脚本：
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
可按“分层”或“按功能”组织：

按分层：
├── routes/（API 端点）
├── services/（业务逻辑）
├── models/（数据库模型）
├── schemas/（Pydantic 模型）
└── dependencies/（共享依赖）

按功能：
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
Django 已支持 async（异步）：
├── 异步视图（Async views）
├── 异步中间件（Async middleware）
├── 异步 ORM（部分能力）
└── ASGI 部署

Django 中适合 async（异步）的场景：
├── 调用外部 API
├── WebSocket（Channels）
├── 高并发视图
└── 触发后台任务
```

### Django 最佳实践

```
模型设计：
├── 模型肥、视图薄（Fat models, thin views）
├── 通过 manager 抽共用查询
├── 共享字段放抽象基类

视图选择：
├── 复杂 CRUD 用类视图（class-based views）
├── 简单接口用函数视图（function-based views）
├── DRF（Django REST Framework）场景可用 viewsets（视图集）

查询优化：
├── 外键用 select_related()
├── 多对多用 prefetch_related()
├── 避免 N+1 查询
└── 用 .only() 限定字段
```

---

## 6. FastAPI 原则

### FastAPI 中 `async def` 与 `def` 的选择

```
适用 async def：
├── 使用 async 数据库驱动
├── 发起 async HTTP 调用
├── I/O 密集操作
└── 需要高并发吞吐

适用 def：
├── 阻塞型操作
├── sync 数据库驱动
├── CPU 密集任务
└── FastAPI 会自动放入线程池执行
```

### 依赖注入

```
依赖注入（Dependency Injection）适用：
├── 数据库会话
├── 当前用户 / 鉴权
├── 配置对象
├── 共享资源

收益：
├── 可测试性提升（可 mock/模拟）
├── 职责清晰分离
├── 可自动清理资源（yield）
```

### Pydantic v2 集成

```python
# FastAPI 与 Pydantic 深度集成：

# 请求校验
@app.post("/users")
async def create(user: UserCreate) -> UserResponse:
    # user 在进入业务前已完成校验
    ...

# 响应序列化
# 返回类型会成为响应 schema
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
FastAPI BackgroundTasks：
├── 短平快任务
├── 不要求持久化
├── 即发即忘（Fire-and-forget）
└── 与 Web 进程同进程运行

Celery/ARQ：
├── 长耗时任务
├── 需要重试机制
├── 分布式 worker（执行进程）
├── 持久化队列
└── 复杂工作流
```

---

## 8. 错误处理原则

### 异常策略

```
在 FastAPI 中：
├── 定义自定义异常类
├── 注册统一异常处理器
├── 返回一致的错误格式
└── 记录日志但不暴露内部细节

推荐模式：
├── service 层抛领域异常
├── handler 层转换为 HTTP 响应
└── 客户端收到干净错误对象
```

### 错误响应原则

```
应包含：
├── 错误码（Error code，用于程序处理）
├── 消息（Message，人类可读）
├── 细节（Details，字段级，按需）
└── 禁止返回堆栈（stack traces，出于安全）
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
# 异步测试使用 pytest-asyncio

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
常用 fixture（测试夹具）：
├── db_session → 数据库连接
├── client → 测试客户端
├── authenticated_user → 带 token（令牌）的用户
└── sample_data → 测试数据准备
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
