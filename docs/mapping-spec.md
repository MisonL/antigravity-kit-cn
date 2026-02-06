# Codex 资源映射规范 (Mapping Spec)

Codex 适配器包含一个内置的资源转换层 (`bin/core/`), 负责将通用的 Agent 技能 (Skills) 和工作流 (Workflows) 转换为 Codex 兼容的标准化格式。

## 转换规则

### 1. Skills (技能)

- **源路径**: `.agent/skills/<name>/SKILL.md`
- **Codex ID**: `<name>`（保持与上游技能名一致）
- **目标路径**: `.agents/skills/<name>/SKILL.md`

### 2. Workflows (工作流)

- **源路径**: `.agent/workflows/<name>.md`
- **Codex ID**: `workflow-<name>`
- **目标路径**: `.agents/skills/workflow-<name>/SKILL.md`
- **说明**: 工作流会转换为符合 Codex 规范的 `SKILL.md`（自动补齐 `name` / `description` frontmatter）。
- **冲突处理**: 若生成 ID 与现有 Skill/Workflow 冲突，构建器会自动追加 `-2`、`-3`... 后缀，确保 ID 和目录唯一。

## 托管文件生成

### `codex.json` (元数据)

包含版本信息和所有资源的清单映射。

### `AGENTS.md` (规则接入点)

自动生成的 Markdown 文件，列出所有可用能力 (Capabilities) 并声明版本。
安装/更新时，CLI 会把该内容注入工作区根目录 `AGENTS.md` 的托管区块中（不会覆盖用户自定义内容）。

### `antigravity.rules` (风险控制)

自动生成风险控制规则，安装/更新时同样会注入工作区根目录 `antigravity.rules` 的托管区块。

### `manifest.json` (托管清单)

用于完整性与漂移检测，核心结构如下：

```json
{
  "version": 2,
  "target": "codex",
  "kitVersion": "2.0.1",
  "files": {
    "skills/example-skill/SKILL.md": {
      "hash": "sha256...",
      "source": "bundled/skills/example-skill/SKILL.md"
    }
  }
}
```

覆盖策略：仅当 `当前文件 hash != manifest hash` 且 `当前文件 hash != 新版本 hash` 时，才会备份并覆盖。

## 动态构建 (Just-in-Time Build)

当使用 `ag-kit init --target codex` 安装一个旧版 (Gemini 结构) 的仓库时，CLI 会自动触发构建流程：

1. 克隆/读取源仓库。
2. 识别为 Legacy 结构 (.agent/skills 存在但无 manifest.json)。
3. 在临时目录启动构建流水线。
4. 将构建产物安装到项目的 `.agents` 目录（若检测到旧版 `.codex` 会自动迁移/清理）。

此过程对用户透明。
