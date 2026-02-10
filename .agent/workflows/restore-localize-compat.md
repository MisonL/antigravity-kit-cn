---
description: 逐份修复 Markdown 文档漂移：先还原上游原文，再做语义汉化，最后做 Antigravity/Codex 兼容微调。
---

# /restore-localize-compat - 文档机制对齐流程

$ARGUMENTS

---

## 目标

用于处理“本地文档与上游文档差异过大，已破坏原有机制”的场景。

核心目标：

1. **先还原机制**：以 `reference/antigravity-kit` 为唯一机制基线。
2. **再汉化语义**：仅翻译自然语言，不改处理逻辑。
3. **后做兼容微调**：仅在必要时补充 Antigravity 与 Codex 的兼容说明。

---

## 背景与问题来源

本仓库是基于上游 Antigravity 项目进行汉化与扩展的分支，并新增了 Codex 适配能力。

在历史迭代中，部分 Markdown 文档出现了以下问题：

1. 与上游文档结构和机制发生较大偏离（章节顺序、执行步骤、约束描述被改写）。
2. 混入了非功能性说明，导致功能文档可执行性下降。
3. 个别文档只做了“文本改写”，但未保持与上游脚本和流程的对应关系。
4. 双语处理越界：把标题、段落写成“英文整句 + 中文整句括号翻译”。

这会带来两个直接风险：

1. Antigravity 主机制被误导，行为与上游预期不一致。
2. Codex 兼容适配建立在漂移文档之上，后续维护成本和回归风险显著上升。

因此本流程采用固定顺序：

1. 先恢复上游机制基线。
2. 再进行语义汉化。
3. 最后仅做必要的兼容微调。

---

## 适用范围

- `.agent/**/*.md`
- `docs/**/*.md`
- 根目录功能文档（如 `README.md`、`AGENT_FLOW.md`、`CHANGELOG.md` 等）

优先级建议：

1. `.agent/skills/**/SKILL.md`
2. `.agent/agents/*.md`
3. `.agent/workflows/*.md`
4. 其他功能与运维文档

---

## 官方规则基线（2026-02-07 已核对）

以下来源是“兼容微调”的唯一依据。若本地文档与下列官方规则冲突，必须先记录冲突点，再做最小改动。

### Antigravity 官方来源

1. Skills：`https://antigravity.google/assets/docs/agent/skills.md`
2. Rules / Workflows：`https://antigravity.google/assets/docs/agent/rules-workflows.md`
3. Strict Mode：`https://antigravity.google/assets/docs/agent/strict-mode.md`
4. Sandboxing：`https://antigravity.google/assets/docs/agent/sandbox-mode.md`
5. MCP：`https://antigravity.google/assets/docs/tools/mcp.md`

### Codex 官方来源

1. Skills：`https://developers.openai.com/codex/skills.md`
2. Rules：`https://developers.openai.com/codex/rules.md`
3. AGENTS.md：`https://developers.openai.com/codex/guides/agents-md.md`
4. MCP：`https://developers.openai.com/codex/mcp.md`
5. Workflows（用法范式）：`https://developers.openai.com/codex/workflows.md`
6. Security（审批与沙箱）：`https://developers.openai.com/codex/security.md`

---

## 模块差异、微调要求与示例（必须逐项执行）

### 1）Skills（技能）

官方差异：

1. Antigravity：技能主路径为 `.agent/skills/<skill-folder>/SKILL.md`，全局路径为 `~/.gemini/antigravity/skills/`。
2. Codex：技能主路径为 `.agents/skills/`，并支持 `~/.agents/skills`、`/etc/codex/skills`、系统内置技能。
3. Codex 明确要求 `SKILL.md` 含 `name` 与 `description`；Antigravity 允许 `name` 缺省为目录名。
4. 两者都采用 progressive disclosure（先看描述，命中后再加载完整指令）。

微调要求：

1. 业务文档中以上游 Antigravity 机制为准，不得把 `.agent/skills/` 改写成 `.agents/skills/`。
2. Codex 兼容说明必须写成“映射/构建层行为”，而不是改写技能原文机制。
3. 若出现同名 Skill，在说明中明确“可并存、不合并”，避免误判为去重失败。

示例（合规写法）：

```md
## Skills 兼容说明（最小补充）

- 机制基线：沿用上游 `.agent/skills/<name>/SKILL.md`。
- Codex 适配：由适配层映射到 `.agents/skills/<name>/SKILL.md`。
- 注意：文档层不改技能流程；仅补充目录映射事实。
```

### 2）Rules（规则）

官方差异：

1. Antigravity：Rules 是 Markdown 规则文件，支持 Manual / Always On / Model Decision / Glob 激活方式。
2. Antigravity：Rules 文件上限 12,000 字符，支持 `@filename` 引用。
3. Codex：Rules 是 `.rules`（Starlark）文件，核心是 `prefix_rule()` 用于控制“沙箱外命令”的 allow/prompt/forbidden。
4. Codex：支持 `match/not_match` 内联校验、`codex execpolicy check` 验证规则行为。

微调要求：

1. 禁止把 Antigravity 的自然语言规则“改写”为 Codex `.rules` 语法。
2. 禁止把 Codex `prefix_rule()` 塞入上游功能文档正文，除非该文档本身就是 Codex 规则文档。
3. 若文档涉及双端规则，必须分栏说明“语义规则（Antigravity）”与“命令审批规则（Codex）”。

示例（合规写法）：

```md
## Rules 兼容边界

- Antigravity 规则：`.agent/rules/*.md`（行为约束与触发策略）
- Codex 规则：`~/.codex/rules/*.rules`（命令前缀审批）
- 原则：两套规则并行，不互相改写语法。
```

### 3）Workflows（工作流）

官方差异：

1. Antigravity：Workflows 是可持久化 Markdown 流程，可通过 `/workflow-name` 调用，且支持工作流互相调用。
2. Codex：`workflows.md` 是“使用范式示例文档”，不是“可落盘注册的自定义 workflow 文件机制”。
3. Codex CLI 的斜杠命令是内置控制命令（如 `/status`、`/review`、`/mcp`），不等价于 Antigravity 的自定义 `/workflow-name`。

微调要求：

1. 上游 `.agent/workflows/*.md` 必须保持机制原样（标题结构、步骤、命令、调用关系都不变）。
2. 为 Codex 做兼容时，只能补“如何在 Codex 中等效执行该流程”（如转为 Skill 调度或提示模板），不能宣称 Codex 原生支持自定义 `/workflow-name`。

示例（合规写法）：

```md
## Workflow 兼容说明（最小补充）

- Antigravity：使用 `/deploy` 调用 `.agent/workflows/deploy.md`。
- Codex：无同构的自定义 workflow 注册机制。
- 兼容策略：将关键步骤封装为 Skill 或在 AGENTS.md 中定义执行约束。
```

### 4）Agents（智能体指令与分工）

官方差异：

1. Antigravity 官方自定义入口以 Rules / Workflows / Skills 为主，并未把 `AGENTS.md` 作为核心标准入口。
2. Codex 明确以 `AGENTS.md` / `AGENTS.override.md` 构建指令链，支持从全局到项目目录逐层覆盖。
3. Codex 对项目指令有字节上限（`project_doc_max_bytes`）与候选文件名回退（`project_doc_fallback_filenames`）。

微调要求：

1. `.agent/agents/*.md` 作为业务分工文档保留，不得因适配 Codex 而删除或重排机制章节。
2. Codex 侧仅同步“必要执行约束”到 `AGENTS.md` 托管区块，避免把整份上游 Agent 文档原样塞入。
3. 文档中必须区分“业务 Agent 文档”与“Codex 指令入口文档”。

示例（合规写法）：

```md
## Agents 兼容边界

- 业务分工：`.agent/agents/*.md`（上游机制基线）
- Codex 指令入口：`AGENTS.md`（项目层运行约束）
- 原则：分工文档不替代指令入口，指令入口不重写分工机制。
```

### 5）MCP（模型上下文协议）

官方差异：

1. Antigravity：通过 MCP Store 与 `mcp_config.json` 管理连接，强调 UI 内安装与授权流程。
2. Codex：通过 `config.toml` 的 `[mcp_servers.<name>]` 管理，支持 stdio 与 streamable HTTP、OAuth/Bearer、tool allow/deny 列表。
3. 两者都支持多服务连接，但配置位置、字段结构、启用方式不同。

微调要求：

1. 文档必须分别给出 Antigravity 与 Codex 的配置入口，不得混写为同一份配置文件。
2. 若描述“同名 MCP 服务”，必须说明是“逻辑同名，配置异构”。
3. 不得把一端的配置键名直接迁移到另一端示例中。

示例（合规写法）：

```md
## MCP 双端说明

- Antigravity：在 MCP Store 中安装，必要时编辑 `mcp_config.json`。
- Codex：在 `~/.codex/config.toml` 中配置 `[mcp_servers.xxx]`。
- 原则：服务能力可对齐，配置格式不对齐。
```

---

## 硬性约束（必须遵守）

1. **禁止脚本批量改写文档内容**（可使用检索命令定位，但修改必须逐份人工完成）。
2. **每次只处理 1 份文档**，必须完成“全流程闭环”后方可处理下一份：
   - Phase 1 → Phase 2 → Phase 3
   - 验收清单全通过
   - 提交流程完成（add/commit/push）
   - 处理报告完成并记录
3. **不得改机制**：不得删除/新增上游机制步骤、命令、参数语义、脚本调用关系。
4. **非功能性说明不得进入功能文档**（如宣传语、个人化样例、无关解释）。
5. **保留通用英文专有名词**（见下方术语表）。
6. **双语仅限术语级标注**，禁止整句英中并列。
7. **标题默认纯中文**，仅在“术语本身是官方英文名”时允许术语级括注。
8. **示例命令仅翻译提示词语义**，命令结构与参数必须原样保留。

---

## 红线禁令（违反即失败）

以下任一行为出现，视为该文件处理失败，必须整份返工：

1. **摘要化/改写化**：把上游原文“概括成短文”或“重写成另一套结构”。
2. **删节机制内容**：删除章节、删除流程步骤、删除命令示例、删除脚本引用。
3. **结构重排**：改变标题层级、段落顺序、列表结构、代码块位置。
4. **改动机制文本**：擅自修改命令、参数、路径、占位符、Frontmatter key。
5. **无依据兼容改动**：未给出冲突依据就加入“兼容说明”或“额外机制”。
6. **双语越界**：把标题或段落改成“英文整句 + 中文整句括号翻译”。

重点强调：

- **禁止把 100 行上游机制压缩成 30 行“精简版”**。
- **禁止“优化可读性”为理由删掉上游的规则细节**。
- **拿不准时保留原样，不要自作主张重写**。

---

## 常见违规示例对照表（必须对照执行）

### 示例 1：摘要化改写（禁止）

错误写法（违规）：

- 上游原文有完整 8 个章节，本地改成“3 段总结 + 若干建议”。

正确写法（合规）：

- 保留上游全部章节结构，仅把自然语言翻译为中文。

### 示例 2：删除机制步骤（禁止）

错误写法（违规）：

- 删掉上游的 “Testing the System / Edge Cases / Integration with Existing Workflows” 等章节。

正确写法（合规）：

- 这些章节必须全部保留；若需补充说明，只能在不改变原意的前提下最小补充。

### 示例 3：命令与参数被汉化或改写（禁止）

错误写法（违规）：

- 把 `--target`、`--fix`、`ag-kit update` 改成中文描述或替代命令。

正确写法（合规）：

- 命令、参数、路径、占位符保持原样；只翻译解释文本。

### 示例 3.1：示例命令中的提示词未翻译（禁止）

错误写法（违规）：

- 保留英文提示词：`python scripts/search.py "fintech crypto" --design-system`

正确写法（合规）：

- 仅翻译提示词语义，命令结构不变：`python scripts/search.py "金融 科技 加密" --design-system`
- 或：`python scripts/search.py "为金融科技产品生成设计系统关键词" --design-system`

### 示例 4：代码块“优化重排”（禁止）

错误写法（违规）：

- 把上游多个代码块合并成一个，或移动到其他章节。

正确写法（合规）：

- 代码块数量和位置与上游保持一致，仅允许代码块外文字语义汉化。

### 示例 5：无依据兼容说明（禁止）

错误写法（违规）：

- 直接新增“为 Codex 优化”段落，但未说明冲突来源与依据。

正确写法（合规）：

- 必须先给出冲突点、依据来源、最小改动理由，再做兼容微调。

### 示例 6：非功能性内容混入（禁止）

错误写法（违规）：

- 在功能文档加入宣传语、感谢语、个人化文案、无关解释。

正确写法（合规）：

- 功能文档仅保留机制与执行信息；非功能性内容放到 README 等合适位置。

### 示例 7：标题双语整句并列（禁止）

错误写法（违规）：

- `## 移动端设计系统 (Mobile Design System)`

正确写法（合规）：

- `## 移动端设计系统`
- 如需术语标注：`## MCP（模型上下文协议）配置`

### 示例 8：段落整句双语并列（禁止）

错误写法（违规）：

- `This skill provides core principles... (此技能提供核心原则...)`

正确写法（合规）：

- `此技能提供核心原则并按上下文路由到对应子技能。`
- 仅术语保留：`Orchestrator skill（编排器技能）`

---

## 术语保留与双语标注规则

针对“英文专用/通用名称”，执行以下规则：

1. **原名保留**：英文原名必须保留，不得强行替换为纯中文。
2. **首次双语（仅术语级）**：同一文档内首次出现时，使用 `English（中文）` 格式。
3. **后续一致**：后续可使用 `English` 或 `English（中文）`，但不得扩展为整句双语。
4. **机制文本例外**：命令、参数、路径、占位符、Frontmatter key 一律保持原样，不追加中文到代码/命令本体中。
5. **示例命令中的提示词需汉化**：若命令参数中包含自然语言提示词（prompt/query），该提示词需做语义中文翻译。
6. **禁止反向格式**：避免把术语写成“中文（English）”作为主格式，默认以英文原名为主。
7. **禁止标题整句双语**：标题中不得追加英文整句翻译。
8. **禁止段落整句双语**：正文中不得出现“英文句子 + 中文句子括注”的并排写法。
9. **表格以中文解释为主**：表头与说明列应使用中文，必要术语再做术语级括注。

推荐术语首现写法示例：

- Antigravity（反重力框架）
- Codex（代码智能体环境）
- Agent（智能体）
- Skill（技能）
- Workflow（工作流）
- Rule（规则）
- MCP（模型上下文协议）
- CLI（命令行界面）
- Frontmatter（文档头元数据）
- Schema（模式定义）
- API（应用程序接口）/ SDK（软件开发工具包）
- URL（统一资源定位符）
- path（路径）

---

## 三阶段执行流程（逐文件）

**注意：必须完成本节全部阶段与后续验收/提交/报告，才允许开始下一份文档。**

### Phase 1：还原上游原文（先还原）

对当前处理文件 `<file>`：

1. 找到上游对照文件：`reference/antigravity-kit/<file>`。
2. 先把本地内容恢复为上游结构与机制（章节、顺序、命令、参数、脚本路径保持一致）。
3. 确认未引入“上游补充说明”“reference 对齐提示”等后加段落。

仅用于核对的命令示例（可用）：

```bash
diff -u reference/antigravity-kit/<file> <file>
```

### Phase 2：语义汉化（不改机制）

在 Phase 1 基础上做语义翻译，规则如下：

1. 只翻译自然语言说明。
2. 保持以下内容原样：
   - 代码块内容
   - 命令与参数（如 `--target`、`--fix`）
   - 文件名与路径（如 `.agent/`、`SKILL.md`）
   - 占位符（如 `$ARGUMENTS`）
   - Frontmatter key（如 `description`）
3. 标题层级、段落顺序、列表结构不变。
4. 双语边界：仅保留术语级双语，不得把标题或段落改成整句双语并列。

### Phase 3：兼容微调（必要才做）

仅在出现真实冲突时微调：

1. **Antigravity 基线**：保留其官方机制与触发方式，不改默认工作流语义。
2. **Codex 兼容**：仅补充与本仓库适配层直接相关的信息（如 `.agents`、映射与托管规则）。
3. 微调应为最小改动，且不能反向破坏上游机制。

兼容微调的触发门槛（必须同时满足）：

1. 明确写出冲突点（哪一段与哪个运行规则冲突）。
2. 明确写出依据（对应官方规则或本仓库既有机制）。
3. 明确写出最小改动说明（为何不能零改动解决）。

---

## 验收清单（每份文档都要过）

1. 与上游对比后，机制性元素一致（章节流程、命令、参数、脚本引用不漂移）。
2. 仅语言层发生变化，不出现逻辑重写。
3. 无非功能性说明残留。
4. 术语保留符合规则。
5. 文档中的路径、命令、文件引用可执行或可解析。
6. 标题不存在英文整句并列或英文长尾注。
7. 正文不存在“英文整句 + 中文整句括注”的并排句式。

强制通过项（缺一不可）：

1. 标题层级数量与上游一致（`#` 到 `####`）。
2. 代码块数量与上游一致。
3. 机制关键字不丢失（命令、参数、脚本名、路径、工作流触发词）。
4. 不允许出现“本地新增解释覆盖上游原意”的段落。
5. 示例命令中若包含自然语言提示词，提示词已完成语义汉化（仅提示词翻译，命令结构不变）。
6. 标题与正文双语均为术语级，不存在整句级双语并列。

---

## 提交前人工核查（强制执行）

以下命令仅用于核查，允许使用：

```bash
# 1) 人工查看差异（逐段确认是否仅为语义汉化）
diff -u reference/antigravity-kit/<file> <file>

# 2) 快速核对标题结构数量
rg -n '^#{1,4} ' reference/antigravity-kit/<file>
rg -n '^#{1,4} ' <file>

# 3) 快速核对命令/参数/路径 token
rg -n 'ag-kit|python|--target|--fix|--path|--no-index|\\.agent/|\\.agents/|SKILL\\.md|AGENTS\\.md|antigravity\\.rules' <file>

# 4) 快速筛查标题双语整句（命中后需人工判断是否术语级）
rg -n '^#{1,4} .*\\([A-Za-z][^)]{8,}\\)$' <file>

# 5) 快速筛查段落整句双语并列（命中后逐条人工复核）
rg -n '[A-Za-z]{4,}[^\\n]{20,}\\([^)]*[\\u4e00-\\u9fa5]{4,}[^)]*\\)' <file>
```

人工核查口径：

1. 如果发现“少段落/少章节/少代码块”，立即返工，不得提交。
2. 如果发现“机制 token 丢失”，立即返工，不得提交。
3. 如果发现“新增机制说明”，必须提供依据，否则返工。
4. 如果发现“标题英文整句并列”，立即返工，不得提交。
5. 如果发现“段落整句双语并列”，立即返工，不得提交。

---

## 返工规则（必须执行）

1. 任一红线命中：整份文档回到 Phase 1 重做。
2. 验收清单未全过：禁止 `git commit`。
3. 未附处理报告：禁止进入下一份文档。

---

## 提交流程（强制）

每处理完 1 份文档，立刻执行：

```bash
git add <file>
git commit -m "docs: 对齐上游机制并语义汉化 <file>"
git push
```

然后再处理下一份文档。

---

## 建议报告模板（给编排者）

```markdown
## 文档处理报告

- 文件：`<file>`
- 结果：完成 / 阻塞
- 上游对照：`reference/antigravity-kit/<file>`
- 机制修复点：
  1. ...
  2. ...
- 汉化说明：
  1. ...
  2. ...
- 兼容微调：
  1. ...
- 结构核查：
  1. 标题层级数量（local/ref）：...
  2. 代码块数量（local/ref）：...
  3. 关键 token 核查：通过 / 不通过
- 提交记录：`<commit-sha>`
```
