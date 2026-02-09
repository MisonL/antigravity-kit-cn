# tRPC 原则

> 为 TypeScript monorepos（TS 单仓）提供的端到端类型安全（type safety）。

## 何时使用

```
✅ 完美契合:
├── 前后端均为 TypeScript
├── monorepo（单仓）结构
├── 内部工具
├── 快速迭代开发
├── 类型安全（type safety）至关重要

❌ 不契合:
├── 非 TypeScript 客户端
├── 公共 API 服务
├── 需要遵循 REST 惯例
├── 多语言后端环境
```

## 核心优势

```
为什么要用 tRPC:
├── 零 Schema（模式）维护成本
├── 端到端类型推断
├── 跨技术栈的 IDE（集成开发环境）自动补全
├── API 变更即时反映在前端
└── 无需代码生成步骤
```

## 集成模式

```
常见配置:
├── Next.js + tRPC（最常见）
├── monorepo（单仓）共享类型定义
├── Remix + tRPC
└── 任意 TS（TypeScript）前端 + 后端
```
