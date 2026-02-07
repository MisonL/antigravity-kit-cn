---
name: python-patterns
description: Python 开发原则与决策。框架选择、异步模式、类型提示、项目结构。教导思考而非复制。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Python 实践模式 (Python Patterns)

> 2025 年 Python 开发的原则与决策准则。
> **学习如何思考 (THINK)，而非死记硬背模式。**

---

## ⚠️ 如何使用此技能 (How to Use)

本技能旨在传授**决策原则**，而非固定的、用于复制的代码。

- 在框架选择不明确时，主动请教老板 (ASK)。
- 根据**上下文 (CONTEXT)** 选择异步 (Async) 或同步 (Sync) 模式。
- 不要每次都默认使用相同的框架。

---

## 1. 框架选择 (2025) (Framework Selection)

### 决策树

```
您想要构建什么？
│
├── API 优先 / 微服务
│   └── FastAPI (异步支持、现代、高性能)
│
├── 全栈 Web / CMS / 后台管理
│   └── Django (功能齐整 "Batteries-included")
│
├── 简单应用 / 脚本 / 学习用途
│   └── Flask (极简、灵活)
│
├── AI/ML API 部署服务
│   └── FastAPI (搭配 Pydantic, 异步, uvicorn)
│
└── 后台任务处理 (Background workers)
    └── Celery + 任意框架
```

### 对比原则

| 维度         | FastAPI     | Django           | Flask          |
| ------------ | ----------- | ---------------- | -------------- |
| **最佳用途** | API, 微服务 | 全栈, CMS        | 简单应用, 学习 |
| **异步支持** | 原生支持    | Django 5.0+ 支持 | 通过插件支持   |
| **后台管理** | 需手动实现  | 内置 (Admin)     | 通过插件支持   |
| **ORM 选择** | 自选        | Django ORM       | 自选           |
| **学习曲线** | 低          | 中               | 低             |

### 务必询问老板的问题：

1. 本项是纯 API 还是包含前端的全栈应用？
2. 是否需要后台管理界面？
3. 团队对异步编程的熟悉程度如何？
4. 是否有现成的基础设施限制？

---

## 2. 异步 (Async) vs 同步 (Sync) 决策

### 何时使用异步

```
在以下场景，使用 async def 为佳：
├── I/O 密集型操作 (数据库、HTTP 请求、文件操作)
├── 存在大量并发连接
├── 实时交互功能 (Real-time)
├── 微服务间的通信
└── 使用 FastAPI / Starlette / Django ASGI
```

### 何时使用同步

```
在以下场景，使用 def (同步) 为佳：
├── CPU 密集型操作
├── 简单脚本
├── 遗留代码库 (Legacy)
├── 团队不熟悉异步模式
└── 使用了阻塞类型的库 (无异步版本)
```

### 黄金准则

```
I/O 密集型 → 使用 async (等待外部响应)
CPU 密集型 → 使用 sync + multiprocessing (多进程计算)

禁止行为：
├── 盲目混用同步与异步代码
├── 在异步代码中调用阻塞同步库
├── 在 CPU 密集型任务中强行使用异步
```

---

## 3. 类型提示策略 (Type Hints Strategy)

### 何时标注类型

```
必须标注：
├── 函数参数
├── 返回值类型
├── 类属性
├── 公共 API
```

```
可以省略：
├── 局部变量 (利用类型推导)
├── 一次性脚本
├── 测试代码 (通常情况下)
```

### 现代 Pydantic 验证准则

使用 Pydantic 的场景：

- API 请求/响应模型。
- 配置项/设置 (Settings)。
- 关键数据验证与序列化。

---

## 4. 项目结构原则 (Project Structure)

### 结构选择

```
小型项目 / 脚本：
├── main.py
├── utils.py
└── requirements.txt

中型 API 项目：
├── app/
│   ├── models/ (数据库模型)
│   ├── routes/ (端点逻辑)
│   ├── services/ (业务逻辑)
│   └── schemas/ (Pydantic 模型)
├── tests/
└── pyproject.toml
```

---

## 5. Django 准则 (2025)

### Django 异步支持 (5.0+)

适用场景：外部 API 调用、WebSocket (Channels)、高并发视图。

### 最佳实践

- **厚模型，薄视图 (Fat models, thin views)**：将逻辑下沉至模型层。
- **查询优化**：使用 `select_related()` (外键) 和 `prefetch_related()` (多对多)，严禁 N+1 查询。

---

## 6. FastAPI 准则

### 依赖注入 (Dependency Injection)

- 适用于：数据库 Session、当前用户/认证、全局配置。
- 核心优势：可测试性 (Mocking)、职责分离。

### Pydantic v2 集成

- 深度利用请求验证与响应序列化。
- 确保类型提示与 Pydantic 模型 100% 同步。

---

## 7. 后台任务处理 (Background Tasks)

| 方案                | 最佳用途                               |
| ------------------- | -------------------------------------- |
| **BackgroundTasks** | 简单的、进程内的任务 (Fire-and-forget) |
| **Celery**          | 分布式的、复杂的、需重试的工作流       |
| **ARQ**             | 基于 Redis 的异步任务方案              |
| **RQ**              | 简单的 Redis 队列                      |

---

## 8. 错误处理原则 (Error Handling)

### 异常处理策略

- 创建自定义异常类。
- 在服务层抛出领域异常，在处理器 (Handlers/Middleware) 中统一转化。
- 🚫 严禁向外部公开堆栈跟踪 (Security!)。

---

## 9. 测试原则 (Testing Principles)

### 异步测试 (Async Testing)

- 使用 `pytest-asyncio` 或现代内置测试工具。
- 始终为关键链路、边界情况和错误处理编写测试。

---

## 10. 决策检查清单 (Decision Checklist)

在实现之前：

- [ ] **是否询问过老板关于框架的偏好？**
- [ ] **是否根据当前场景选择了最佳框架？**
- [ ] **是否明确了异步 vs 同步的选择？**
- [ ] **是否规划了类型提示策略？**
- [ ] **是否定义了清晰的项目结构？**
- [ ] **是否规划了全局错误处理？**

---

## 11. 应避免的反模式 (Anti-Patterns)

### ❌ 禁止：

- 在简单的 API 项目中默认使用 Django（FastAPI 可能更合适）。
- 在异步代码中使用同步阻塞库。
- 忽略公共 API 的类型提示。
- 将复杂的业务逻辑直接写在路由或视图中。
- 忽视 N+1 查询问题。

### ✅ 推荐：

- 根据业务上下文选择框架。
- 明确职责分离 (Routes → Services → Repos)。
- 优先测试关键业务路径。

---

> **谨记**：Python 模式的核心在于为您的特定上下文做出决策。不要只是复制冗余代码 —— 思考最适合该应用的方案。

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/python-patterns/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/python-patterns/SKILL.md`。
- **注意**：文档层不应替代 Python 架构建议；仅在此定义决策逻辑。
