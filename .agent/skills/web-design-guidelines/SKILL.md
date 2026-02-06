---
name: web-design-guidelines
description: Web 界面指南 (WIG) 审查与无障碍检查。当被要求 "review my UI", "check accessibility", "audit design", "review UX", 或 "check my site against best practices" 时使用。
metadata:
    author: vercel
    version: "1.0.0"
    argument-hint: <file-or-pattern>
---

# Web Interface Guidelines - Web 界面指南

> 根据 Web 界面指南审查文件。

## 工作原理 (How It Works)

1. 从下方的源 URL 获取最新指南
2. 读取指定文件 (或提示用户提供文件/模式)
3. 对照获取的指南中的所有规则进行检查
4. 以简洁的 `file:line` 格式输出发现

## 指南来源 (Guidelines Source)

在每次审查前获取最新指南：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 WebFetch 检索最新规则。获取的内容包含所有规则和输出格式说明。

## 用法 (Usage)

当用户提供文件或模式参数时：

1. 从上述源 URL 获取指南
2. 读取指定文件
3. 应用获取的指南中的所有规则
4. 使用指南中指定的格式输出发现

如果未指定文件，询问用户要审查哪些文件。

---

## 相关 Skills (Related Skills)

| Skill                                              | 何时使用                                                      |
| -------------------------------------------------- | ------------------------------------------------------------- |
| **[frontend-design](../frontend-design/SKILL.md)** | 编码前 (Before coding) - 学习设计原则 (颜色, 排版, UX 心理学) |
| **web-design-guidelines** (此 Skill)               | 编码后 (After coding) - 审计无障碍性, 性能, 和最佳实践        |

## 设计工作流 (Design Workflow)

```
1. DESIGN   → 阅读 frontend-design 原则
2. CODE     → 实现设计
3. AUDIT    → 运行 web-design-guidelines 审查 ← 你在这里
4. FIX      → 解决审计发现的问题
```
