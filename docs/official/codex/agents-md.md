# 使用 AGENTS.md 自定义指令

> 来源：`https://developers.openai.com/codex/guides/agents-md`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

Codex 在执行任务前会读取 `AGENTS.md` 指令链。  
通过“全局 + 项目 + 子目录”分层指令，你可以让 Agent 在不同仓库中保持一致行为，并允许就近覆盖。

## Codex 如何发现与合并指令

Codex 启动时会构建一次指令链（TUI 通常是每次启动会话时构建）。

### 发现顺序

1. **全局层（Codex Home）**
   - 目录：`$CODEX_HOME`（默认 `~/.codex`）
   - 优先读取：`AGENTS.override.md`
   - 若无再读取：`AGENTS.md`
   - 同层最多取第一个非空文件

2. **项目层（从项目根到当前目录）**
   - 每一层目录按顺序检查：
     - `AGENTS.override.md`
     - `AGENTS.md`
     - `project_doc_fallback_filenames` 中定义的备选文件名
   - 每层目录最多取一个文件

3. **合并顺序**
   - 从根目录到当前目录依次拼接
   - 越靠近当前目录的文件越“后出现”，覆盖能力越强

### 大小限制

- 受 `project_doc_max_bytes` 控制（默认 `32 KiB`）
- 空文件会被跳过
- 达到上限后停止继续追加

## 创建全局指令

```bash
mkdir -p ~/.codex
```

在 `~/.codex/AGENTS.md` 写入跨项目通用规范，例如：

```markdown
# 全局工作约定

## 代码风格
- 先保证正确性，再追求优化
- 变更应尽量小而可回滚

## 输出要求
- 先给结论，再给依据
- 明确列出未完成项与风险
```

## 创建项目级与目录级指令

在仓库根目录放项目总约束：

```text
repo/
├── AGENTS.md
└── services/
    ├── AGENTS.md
    └── api/
        └── AGENTS.md
```

这样可以形成“总规则 -> 模块规则 -> 子模块规则”的分层覆盖。

## 备选文件名（Fallback）

当目录内不存在 `AGENTS.md` 时，可以通过配置补充候选文件名：

```toml
project_doc_fallback_filenames = ["TEAM.md", "ASSISTANT.md"]
```

用途：

- 与历史文档命名兼容
- 渐进迁移到 `AGENTS.md`

## 验证是否生效

建议检查：

1. `AGENTS.md` 是否在预期目录存在且非空
2. 项目是否被标记为受信任
3. `project_doc_max_bytes` 是否过小导致截断
4. 是否被同层的 `AGENTS.override.md` 覆盖

## 常见问题排查

### 指令没生效

- 检查当前 `cwd` 是否在目标目录链下
- 检查项目是否不受信任（会跳过项目级配置层）
- 检查文档是否超限被截断

### 指令互相冲突

- 按目录层级拆分职责
- 通用规则上移到根目录
- 细节规则下沉到子目录

### 想临时覆盖全局规则

- 在 `~/.codex` 放置 `AGENTS.override.md`，其优先级高于同层 `AGENTS.md`

## 实践建议

- 全局层只放稳定工作约定
- 项目根放仓库级规范（测试、提交、架构约束）
- 子目录放模块级细则（接口契约、边界约束）
- 指令保持短句、可执行、可验证
