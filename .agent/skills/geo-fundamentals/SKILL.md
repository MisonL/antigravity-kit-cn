---
name: geo-fundamentals
description: 生成引擎优化 (GEO) 基础 - 针对 AI 搜索引擎优化内容
allowed-tools: Read, Glob, Grep
---

# GEO 基础 (Generative Engine Optimization)

**SEO 是给 Google 看的，GEO 是给 ChatGPT/Claude 看的。**

## 核心策略

1.  **权威性引用 (Authoritative Citations)**
    - 大语言模型倾向于引用它认为"权威"的来源。
    - 添加统计数据、专家语录、学术引用。

2.  **结构化数据 (Structured Data)**
    - 使用清晰的 Markdown 格式 (H1, H2, List)。
    - 提供`JSON-LD` 数据。
    - 包含清晰的"问答对" (FAQ)。

3.  **直接答案 (Direct Answers)**
    - 在文章开头直接给出简练的答案，方便 AI 提取摘要。

4.  **去重与独特性**
    - 不要只是复制粘贴。提供独特的见解或数据分析。

## 检查清单

- [ ] 是否有清晰的结构 (Header 层次)？
- [ ] 关键事实是否有数据支持？
- [ ] 语言是否简洁客观？
- [ ] 是否包含比较表 (Comparison Tables)？(AI 特别喜欢表格)

## 上游脚本流程补充（reference 对齐）

- `python scripts/geo_checker.py <project_path>`

用于 GEO（生成引擎优化）与可引用性校验。
