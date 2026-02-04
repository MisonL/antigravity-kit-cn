---
description: 常用文档模版 (README, API Docs, Code Comments)
---

# 文档模版 (Documentation Templates)

## README.md 模版

```markdown
# 项目名称

> 一句话简介

## 功能列表

- ✨ 特性 A
- 🚀 特性 B

## 快速开始

1. 安装依赖
   \`\`\`bash
   npm install
   \`\`\`

2. 配置环境变量
   复制 \`.env.example\` 到 \`.env\`。

3. 启动开发服
   \`\`\`bash
   npm run dev
   \`\`\`
```

## 代码注释指南 (TSDoc)

不要解释"代码做了什么"，解释"为什么要这样做"或"参数是什么"。

```typescript
/**
 * 计算用户的会员积分。
 *
 * @param amount 消费金额 (分)
 * @param isVip 是否为 VIP 用户 (VIP 积分翻倍)
 * @returns 获得的积分数
 *
 * @example
 * calculatePoints(1000, true) // returns 20
 */
function calculatePoints(amount: number, isVip: boolean): number { ... }
```
