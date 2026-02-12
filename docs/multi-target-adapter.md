# 多目标适配器

当前版本引入多目标适配器架构，支持在同一项目中共存并管理不同类型的 Agent（智能体）模板源。

## 架构概览

```mermaid
graph TD
    CLI[ag-kit CLI] --> Router[Target Router]
    Router --> |target=gemini| Gemini[GeminiAdapter (.agent)]
    Router --> |target=codex| Codex[CodexAdapter (.agents)]
```

## 支持的目标

### 1. Gemini（旧版）

- **标识**: `gemini`
- **存储**: `.agent/`（直连模式）
- **特点**: 轻量级，直接克隆自 Git 仓库或本地模板。
- **适用**: 个人开发者、快速原型、不强制版本控制的场景。

### 2. Codex（代码智能体环境）

- **标识**: `codex`
- **存储**:
    - `.agents/`（托管上游，用户不可修改）
    - `.agents-backup/`（发生覆盖冲突时自动备份）
    - `AGENTS.md` / `antigravity.rules`（工作区托管区块注入）
- **特点**:
    - **Drift Detection（漂移检测）**: 自动识别用户对托管文件的修改。
    - **Atomic Update（原子更新）**: 防止更新中断导致损坏。
    - **资源映射**: 自动将标准 Skill（技能）/Workflow（工作流）转换为 Codex 规范。
    - **遗留迁移**: 自动识别旧版 `.codex/` 并迁移到 `.agents/`。
- **适用**: 团队协作、生产环境、需要严格版本管理和升级保障的场景。

> 说明：`antigravity.rules` 是 Ag-Kit 注入的托管说明内容，不等同于 Codex 官方 `.rules`（命令审批执行规则）。

## 命令行用法

CLI（命令行界面）命令如下。

### 安装/初始化

```bash
# 安装 Gemini
ag-kit init --target gemini

# 安装 Codex
ag-kit init --target codex

# 交互选择目标，TTY（终端）下无默认值
ag-kit init

# 临时目录验证（跳过全局索引登记）
ag-kit init --target codex --no-index
```

### 更新

```bash
# 更新当前项目（自动检测已安装目标）
ag-kit update

# 强制更新指定目标
ag-kit update --target codex

# 更新但不刷新全局索引
ag-kit update --target codex --no-index
```

### 诊断与修复

```bash
# 检查所有目标健康状态
ag-kit doctor

# 尝试自动修复
ag-kit doctor --fix
```
