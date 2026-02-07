---
name: web-design-guidelines
description: 审阅 Web 界面指南 (WIG) 规范。当用户要求“审阅我的 UI”、“检查无障碍性”、“审计设计”、“审阅 UX”或“根据最佳实践检查我的网站”时，请使用此技能。
metadata:
    author: vercel
    version: "1.0.0"
    argument-hint: <文件或模式 (file-or-pattern)>
---

# Web 界面指南 (Web Interface Guidelines)

根据 Web 界面指南对文件进行合规性审阅。

---

## 工作机制 (How It Works)

1. 从下方的源 URL 获取最新的指南
2. 读取指定的文件（或提示用户提供文件/模式参数）
3. 根据获取到的指南中的所有规则进行检查
4. 以紧凑的 `文件:行号 (file:line)` 格式输出发现的问题

---

## 指南来源 (Guidelines Source)

在每次审阅前通过 WebFetch 获取最新的规则：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 WebFetch 检索最新规则。获取的内容包含所有规则和输出格式说明。

---

## 用法 (Usage)

当用户提供文件或模式参数时：

1. 从上述源 URL 获取指南
2. 读取指定的文件
3. 应用获取到的指南中的所有规则
4. 使用指南中指定的格式输出检查结果

如果未指定具体文件，请询问用户需要审阅哪些文件。

---

## 相关技能 (Related Skills)

| 技能 (Skill)                                       | 何时使用                                        |
| -------------------------------------------------- | ----------------------------------------------- |
| **[frontend-design](../frontend-design/SKILL.md)** | 编码前 —— 学习设计原则（色彩、排版、UX 心理学） |
| **web-design-guidelines** (当前)                   | 编码后 —— 审计无障碍性、性能及最佳实践          |

---

## 设计工作流 (Design Workflow)

```
1. 设计 (DESIGN) → 阅读前端设计原则 (frontend-design)
2. 编码 (CODE)   → 实现设计
3. 审计 (AUDIT)  → 运行 web-design-guidelines 审阅 ← 当前位置
4. 修复 (FIX)    → 处理审计中发现的问题
```
