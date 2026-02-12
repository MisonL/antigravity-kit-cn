# Antigravity 技能

> **Antigravity Kit 中 Skills（技能）的创建与使用指南**

---

## 📋 介绍

虽然 Antigravity 的基础模型（如 Gemini）是强大的通用模型，但它们并不了解你的项目上下文或团队标准。把所有规则或工具都加载到智能体上下文会导致“工具膨胀”，成本上升、延迟增加并引发混淆。

**Antigravity Skills（技能）** 通过 **Progressive Disclosure（渐进式披露）** 解决这一问题。技能是专门的知识包，默认处于非激活状态，只有在你的具体请求与技能描述匹配时，相关信息才会加载进智能体上下文。

---

## 📁 结构与范围

技能以目录为单位组织，你可以按需求定义范围：

| 范围 | 路径 | 说明 |
|---------|-----------|-------|
| **Workspace（工作区）** | `<workspace-root>/.agent/skills/` | 仅作用于当前项目 |

### 技能目录结构

```
my-skill/
├── SKILL.md      # (Required) Metadata & instructions
├── scripts/      # (Optional) Python or Bash scripts
├── references/   # (Optional) Text, documentation, templates
└── assets/       # (Optional) Images or logos
```

---

## 🔍 示例 1：代码审查技能（Code Review Skill）

这是一个仅包含指令的技能，只需要创建 `SKILL.md`。

### 步骤 1：创建目录

```bash
mkdir -p .agent/skills/code-review
```

### 步骤 2：创建 SKILL.md

```markdown
---
name: code-review
description: Reviews code changes for bugs, style issues, and best practices. Use when reviewing PRs or checking code quality.
---

# Code Review Skill

When reviewing code, follow these steps:

## Review checklist

1. **Correctness**: Does the code do what it's supposed to?
2. **Edge cases**: Are error conditions handled?
3. **Style**: Does it follow project conventions?
4. **Performance**: Are there obvious inefficiencies?

## How to provide feedback

- Be specific about what needs to change
- Explain why, not just what
- Suggest alternatives when possible
```

> **注意：** `SKILL.md` 顶部包含元数据（name、description），其后是指令内容。Agent（智能体）只会先读元数据，只有需要时才加载完整指令。

### 试用

创建文件 `demo_bad_code.py`：

```python
import time

def get_user_data(users, id):
    # Find user by ID
    for u in users:
        if u['id'] == id:
            return u
    return None

def process_payments(items):
    total = 0
    for i in items:
        # Calculate tax
        tax = i['price'] * 0.1
        total = total + i['price'] + tax
        time.sleep(0.1)  # Simulate slow network call
    return total

def run_batch():
    users = [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
    items = [{'price': 10}, {'price': 20}, {'price': 100}]
    
    u = get_user_data(users, 3)
    print("User found: " + u['name'])  # Will crash if None
    
    print("Total: " + str(process_payments(items)))

if __name__ == "__main__":
    run_batch()
```

**提示词（Prompt）**：`审查 @demo_bad_code.py 文件`

Agent（智能体）会自动识别 `code-review` 技能，加载信息并按指令执行。

---

## 📄 示例 2：许可证头技能（License Header Skill）

此技能使用 `resources/`（或 `references/`）目录下的参考文件。

### 步骤 1：创建目录

```bash
mkdir -p .agent/skills/license-header-adder/resources
```

### 步骤 2：创建模板文件

**`.agent/skills/license-header-adder/resources/HEADER.txt`**：

```
/*
 * Copyright (c) 2026 YOUR_COMPANY_NAME LLC.
 * All rights reserved.
 * This code is proprietary and confidential.
 */
```

### 步骤 3：创建 SKILL.md

**`.agent/skills/license-header-adder/SKILL.md`**：

```markdown
---
name: license-header-adder
description: Adds the standard corporate license header to new source files.
---

# License Header Adder

This skill ensures that all new source files have the correct copyright header.

## Instructions

1. **Read the Template**: Read the content of `resources/HEADER.txt`.
2. **Apply to File**: When creating a new file, prepend this exact content.
3. **Adapt Syntax**: 
   - For C-style languages (Java, TS), keep the `/* */` block.
   - For Python/Shell, convert to `#` comments.
```

### 试用

**提示词（Prompt）**：`创建一个名为 data_processor.py 的 Python 脚本，输出 'Hello World'.`

Agent（智能体）将读取模板，将注释转换为 Python 格式，并自动添加到文件头部。

---

## 🎯 结论

通过创建 Skills（技能），你已经把通用 AI 模型变成了面向项目的专家：

- ✅ 体系化最佳实践（best practices）
- ✅ 遵循代码评审规则
- ✅ 自动添加许可证头
- ✅ Agent（智能体）自动了解团队工作方式

无需反复提醒 AI “记得加 license” 或 “修正提交格式”，现在 Agent 会自动执行。
