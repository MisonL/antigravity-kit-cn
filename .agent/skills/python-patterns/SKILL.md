---
description: Python 开发原则、架构与工具链
---

# Python 最佳实践

## 核心原则 (The Zen of Python)

1.  **明确优于隐晦 (Explicit is better than implicit)**
2.  **简单优于复杂 (Simple is better than complex)**
3.  **扁平优于嵌套 (Flat is better than nested)**

## 项目结构

推荐使用 `pyproject.toml` 管理依赖和配置（替代 requirements.txt + setup.py）。

```
my_project/
├── pyproject.toml
├── uv.lock (或 poetry.lock)
├── src/
│   └── my_package/
│       ├── __init__.py
│       └── main.py
└── tests/
```

## 工具链推荐

- **依赖管理**: `uv` (极速) 或 `poetry`。
- **Lint/Format**: `ruff` (All-in-one, 极速)。
- **类型检查**: `mypy` 或 `pyright`。

## 异步编程 (Asyncio)

- 现代 Python 网络编程必须使用 `async/await`。
- 尽量使用异步库 (`httpx` 代替 `requests`, `motor` 代替 `pymongo`)。
