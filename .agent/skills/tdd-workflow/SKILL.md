---
name: tdd-workflow
description: 测试驱动开发 (TDD) 工作流原则
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# TDD 工作流 (Test Driven Development)

## 红-绿-重构 (Red-Green-Refactor)

1.  **红 (Red)**: 写一个失败的测试。
    - 这一步迫使你思考接口设计 (API Design)。
    - 你甚至还没开始写实现代码。

2.  **绿 (Green)**: 写出能通过测试的最简单的代码。
    - 不要考虑优雅，犯规也没关系。
    - 目标是让测试条变绿。

3.  **重构 (Refactor)**: 在测试保护下优化代码。
    - 消除重复，优化命名，提升性能。
    - 因为有测试，你不用担心改坏。

## TDD 的好处

- **信心**: 你知道代码是工作的。
- **文档**: 测试用例就是最好的文档。
- **设计**: 因为要易于测试，代码结构自然会解耦 (低耦合)。

## 什么时候不适合 TDD？

- 探索性编程 (Exploratory / Prototype)。
- UI 样式调整。
