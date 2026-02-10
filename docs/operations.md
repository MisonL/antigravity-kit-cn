# Ag-Kit 运维手册

本文面向维护 Ag-Kit 及其管理的 Agent（智能体）资源的 DevOps（运维）或高级用户。

## 1. 目录结构详解

### 1.1 项目根目录

```text
/my-project
├── .agent/               # Legacy（旧版）Gemini 模式直连目录（使用 Gemini 时）
├── .agents/              # Codex 托管上游目录（只读/自动管理）
│   ├── manifest.json     # 完整性清单，用于漂移检测
│   ├── AGENTS.md         # 核心规则源（由构建器生成）
│   ├── antigravity.rules # 风险控制源（由构建器生成）
│   └── skills/           # 编译后的技能
├── .agents-backup/       # Codex 自动备份目录（发生漂移覆盖时生成）
├── .codex/               # Legacy 历史目录（更新/doctor 时自动迁移清理）
├── AGENTS.md             # 工作区主入口（保留用户内容 + 托管区块注入）
├── antigravity.rules     # 工作区风险规则（保留用户内容 + 托管区块注入）
└── .gitignore            # 自动管理的忽略规则
```

### 1.2 全局数据

- **macOS / Linux**: `~/.ag-kit/workspaces.json`
- **Windows**: `%USERPROFILE%\.ag-kit\workspaces.json`
- 默认不会把系统临时目录写入索引（如 macOS `/var/folders/...`、Linux `/tmp`、Windows `%TEMP%`）。
- 对临时验证场景，可在 `init/update` 时加 `--no-index` 完全跳过索引登记。
- `ag-kit update` 仅处理当前目录（或 `--path` 指定目录），不依赖全局索引。
- `ag-kit update-all` 仅处理索引内工作区；若项目曾使用 `--no-index`，可在项目内执行一次不带 `--no-index` 的 `ag-kit update` 重新纳入索引。

## 2. 故障排查

### 2.1 更新失败或中断

当前版本已引入 Atomic Update（原子更新）机制。

- 更新过程先在临时目录准备，最后通过一次 `rename` 操作生效。
- **现象**: 如果进程在更新阶段被中断，项目目录不会出现半写状态，可能残留临时目录（例如 `/tmp/ag-kit-*`）。
- **解决**: 无需手动干预，重新运行 update 即可。

### 2.2 漂移检测警告

当 `ag-kit update` 或 `ag-kit doctor` 报告 Drift（漂移）时：

- **原因**: 用户手动修改了 `.agents` 目录下的受管文件。
- **后果**: 更新时会强制覆盖这些修改。
- **自动备份**: 覆盖前，Ag-Kit 会将修改过的文件备份到 `.agents-backup/<timestamp>/`。
- **智能覆盖**: 仅当文件确实是“用户修改且与新版本不同”时才备份；如果本地文件已与新版本一致，不会重复备份。
- **解决**: 检查备份，将需要的修改迁移到上游源码或通过 Overlay（覆盖层）机制实现。

### 2.3 Windows 权限问题

- 如果遇到 `EPERM` 或 `EBUSY`：
    - 确保没有 IDE 或终端占用 `.agents` 目录。
    - 关闭占用后重新执行 `ag-kit update` 或 `ag-kit doctor --fix`。

### 2.4 Doctor 自愈

```bash
ag-kit doctor --fix
```

- **功能**:
    - 如果 `manifest.json` 丢失，会对照当前文件状态重新生成（注意：这会假设当前状态是正确的）。
    - 会重同步 `AGENTS.md` 和 `antigravity.rules` 的托管区块。
    - Gemini 目标当前不支持自动修复，建议执行 `ag-kit update --target gemini`。

## 3. 升级流程

### 3.1 客户端升级

```bash
git -C /path/to/antigravity-kit-cn pull
cd /path/to/antigravity-kit-cn
npm install -g .
```

### 3.2 资源库迁移：Gemini -> Codex

1. 在项目根目录执行：
    ```bash
    ag-kit init --target codex --force
    ```
2. 系统会自动识别旧版 `.agent`，将其编译为 `.agents` 结构。
3. 确认 `.agents` 生成无误。
4. 移除旧版 `.agent`（可选）：
    ```bash
    rm -rf .agent
    ```
