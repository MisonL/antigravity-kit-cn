---
name: geo-fundamentals
description: Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity).
allowed-tools: Read, Glob, Grep
---

# GEO 基础 (GEO Fundamentals) - 生成引擎优化

> 针对 AI 驱动的搜索引擎的优化。

---

## 1. 什么是 GEO？(What is GEO?)

**GEO** = Generative Engine Optimization (生成引擎优化)

| 目标                                          | 平台                                |
| --------------------------------------------- | ----------------------------------- |
| Be cited in AI responses (在 AI 回复中被引用) | ChatGPT, Claude, Perplexity, Gemini |

### SEO vs GEO

| 方面            | SEO                          | GEO                         |
| --------------- | ---------------------------- | --------------------------- |
| Goal (目标)     | #1 ranking (排名第一)        | AI citations (AI 引用)      |
| Platform (平台) | Google                       | AI engines (AI 引擎)        |
| Metrics (指标)  | Rankings, CTR (排名，点击率) | Citation rate (引用率)      |
| Focus (焦点)    | Keywords (关键词)            | Entities, data (实体，数据) |

---

## 2. AI 引擎格局 (AI Engine Landscape)

| 引擎           | 引用风格                      | 机会                               |
| -------------- | ----------------------------- | ---------------------------------- |
| **Perplexity** | Numbered [1][2] (编号 [1][2]) | Highest citation rate (最高引用率) |
| **ChatGPT**    | Inline/footnotes (行内/脚注)  | Custom GPTs (自定义 GPT)           |
| **Claude**     | Contextual (上下文)           | Long-form content (长篇内容)       |
| **Gemini**     | Sources section (来源部分)    | SEO crossover (SEO 交叉)           |

---

## 3. RAG 检索因素 (RAG Retrieval Factors)

AI 引擎如何选择内容进行引用：

| 因素                            | 权重 |
| ------------------------------- | ---- |
| Semantic relevance (语义相关性) | ~40% |
| Keyword match (关键词匹配)      | ~20% |
| Authority signals (权威信号)    | ~15% |
| Freshness (新鲜度)              | ~10% |
| Source diversity (来源多样性)   | ~15% |

---

## 4. 被引用的内容 (Content That Gets Cited)

| 元素                                   | 为什么有效                                |
| -------------------------------------- | ----------------------------------------- |
| **Original statistics (原始统计数据)** | Unique, citable data (独特且可引用的数据) |
| **Expert quotes (专家引用)**           | Authority transfer (权威传递)             |
| **Clear definitions (清晰定义)**       | Easy to extract (易于提取)                |
| **Step-by-step guides (分步指南)**     | Actionable value (可操作的价值)           |
| **Comparison tables (对比表)**         | Structured info (结构化信息)              |
| **FAQ sections (常见问题部分)**        | Direct answers (直接回答)                 |

---

## 5. GEO 内容检查清单 (GEO Content Checklist)

### 内容元素 (Content Elements)

- [ ] Question-based titles (基于问题的标题)
- [ ] Summary/TL;DR at top (顶部摘要/太长不看)
- [ ] Original data with sources (带来源的原始数据)
- [ ] Expert quotes (专家引用) (name, title/姓名，头衔)
- [ ] FAQ section (常见问题部分) (3-5 Q&A)
- [ ] Clear definitions (清晰定义)
- [ ] "Last updated" timestamp ("最后更新"时间戳)
- [ ] Author with credentials (带资质的作者)

### 技术元素 (Technical Elements)

- [ ] Article schema with dates (带日期的文章 Schema)
- [ ] Person schema for author (作者的人物 Schema)
- [ ] FAQPage schema
- [ ] Fast loading (快速加载) (< 2.5s)
- [ ] Clean HTML structure (清晰的 HTML 结构)

---

## 6. 实体构建 (Entity Building)

| 行动                                         | 目的                            |
| -------------------------------------------- | ------------------------------- |
| Google Knowledge Panel (Google 知识面板)     | Entity recognition (实体识别)   |
| Wikipedia (if notable) (维基百科 (如果知名)) | Authority source (权威来源)     |
| Consistent info across web (全网一致信息)    | Entity consolidation (实体整合) |
| Industry mentions (行业提及)                 | Authority signals (权威信号)    |

---

## 7. AI 爬虫访问 (AI Crawler Access)

### 关键 AI User-Agents

| 爬虫          | 引擎                 |
| ------------- | -------------------- |
| GPTBot        | ChatGPT/OpenAI       |
| Claude-Web    | Claude               |
| PerplexityBot | Perplexity           |
| Googlebot     | Gemini (shared/共享) |

### 访问决策 (Access Decision)

| 策略                       | 何时使用                                        |
| -------------------------- | ----------------------------------------------- |
| Allow all (允许所有)       | Want AI citations (想要 AI 引用)                |
| Block GPTBot (阻止 GPTBot) | Don't want OpenAI training (不想要 OpenAI 训练) |
| Selective (选择性)         | Allow some, block others (允许部分，阻止其他)   |

---

## 8. 测量 (Measurement)

| 指标                                                 | 如何追踪                     |
| ---------------------------------------------------- | ---------------------------- |
| AI citations (AI 引用)                               | Manual monitoring (手动监控) |
| "According to [Brand]" mentions ("根据 [品牌]" 提及) | Search in AI (在 AI 中搜索)  |
| Competitor citations (竞争对手引用)                  | Compare share (比较份额)     |
| AI-referred traffic (AI 引荐流量)                    | UTM parameters (UTM 参数)    |

---

## 9. 反模式 (Anti-Patterns)

| ❌ Don't (不要)                      | ✅ Do (要)                        |
| ------------------------------------ | --------------------------------- |
| Publish without dates (发布不带日期) | Add timestamps (添加时间戳)       |
| Vague attributions (模糊归属)        | Name sources (命名来源)           |
| Skip author info (跳过作者信息)      | Show credentials (显示资质)       |
| Thin content (内容单薄)              | Comprehensive coverage (全面覆盖) |

---

> **记住：** AI 引用那些清晰、权威且易于提取的内容。成为最好的答案。

---

## 脚本 (Script)

| 脚本                     | 用途                                 | 命令                                           |
| ------------------------ | ------------------------------------ | ---------------------------------------------- |
| `scripts/geo_checker.py` | GEO audit (GEO 审计) (AI 引用就绪度) | `python scripts/geo_checker.py <project_path>` |
