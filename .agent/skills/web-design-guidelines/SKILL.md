---
name: web-design-guidelines
description: 审阅 Web 界面指南 (WIG) 规范。当用户要求“审阅我的 UI”、“检查无障碍性”、“审计设计”、“审阅 UX”或“根据最佳实践检查我的网站”时，请使用此技能。
metadata:
    author: vercel
    version: "1.0.0"
    argument-hint: <文件或匹配路径>
---

# Web 界面指南 (Web Interface Guidelines - WIG)

审阅文件是否符合 Web 界面指南。

---

## 运行机制 (How It Works)

1. 从下方的来源 URL 获取最新的指南规则。
2. 读取指定的文件（或根据匹配路径检索）。
3. 根据获取到的指南规则逐项检查。
4. 以精简的 `file:line` 格式输出审计发现。

---

## 指南来源 (Guidelines Source)

在进行每次审阅前，请获取最新的指南内容：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 `WebFetch` 获取最新规则。获取的内容将包含所有详细规则及输出格式指令。

---

## 使用方法 (Usage)

当用户提供文件或路径参数时：

1. 从上述 URL 获取指南。
2. 读取指定文件。
3. 应用指南中的所有规则进行审计。
4. 使用指南中指定的格式输出审计结论。

如果未指定具体文件，请询问老板需要审阅哪些文件。

---

## 相关技能

| 技能                                               | 适用场景                                           |
| -------------------------------------------------- | -------------------------------------------------- |
| **[frontend-design](../frontend-design/SKILL.md)** | **开发前** —— 学习设计原则 (色彩、排版、UX 心理学) |
| **web-design-guidelines** (当前)                   | **开发后** —— 对无障碍性、性能及最佳实践进行审计   |

---

## 设计工作流 (Design Workflow)

```
1. 设计 (DESIGN) → 阅读 frontend-design 原则
2. 编码 (CODE)   → 实现设计
3. 审计 (AUDIT)  → 运行 web-design-guidelines 审阅 ← 当前阶段
4. 修复 (FIX)    → 根据审计结论进行针对性修复
```

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/web-design-guidelines/SKILL.md`。
- **Codex 适配**：由适配层映射到 `.agents/skills/web-design-guidelines/SKILL.md`。
- **注意**：文档层仅定义了 WIG 审计的执行框架；具体规则应从云端源动态获取。
