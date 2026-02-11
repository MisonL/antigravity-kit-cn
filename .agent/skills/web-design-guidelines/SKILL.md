---
name: web-design-guidelines
description: 审阅 UI 代码是否符合 Web 界面指南。适用于“审阅我的 UI”“检查无障碍性”“审计设计”“审阅 UX”或“按最佳实践检查网站”等场景。
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web 界面指南

审阅文件是否符合 Web 界面指南。

## 工作方式

1. 从下方来源 URL 获取最新指南
2. 读取指定文件（或提示用户提供文件/匹配路径）
3. 按获取到的指南逐条检查
4. 使用精简的 `file:line` 格式输出发现

## 指南来源

每次审阅前都获取最新指南：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

使用 `WebFetch` 获取最新规则。获取内容包含完整规则及输出格式说明。

## 使用方式

当用户提供文件或路径参数时：
1. 从上述 URL 获取指南
2. 读取指定文件
3. 应用获取到的全部规则
4. 按指南指定格式输出发现

如果未指定文件，请先询问用户要审阅哪些文件。

---

## 相关技能

| 技能 | 适用场景 |
|-------|-------------|
| **[frontend-design](../frontend-design/SKILL.md)** | 编码前：学习设计原则（色彩、排版、UX 心理学） |
| **web-design-guidelines**（当前） | 编码后：审计无障碍、性能与最佳实践 |

## 设计工作流

```
1. DESIGN   → 阅读 frontend-design 原则
2. CODE     → 实现设计
3. AUDIT    → 运行 web-design-guidelines 审阅 ← 当前所处阶段
4. FIX      → 根据审阅发现进行修复
```
