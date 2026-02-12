# 配置基础（Config basics）

> 来源：`https://developers.openai.com/codex/config-basic`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

Codex 会从多个层级读取配置。用户默认配置位于 `~/.codex/config.toml`，也可以在项目内通过 `.codex/config.toml` 做覆盖。  
出于安全考虑，项目级配置只会在“受信任项目”中加载。

## Codex 配置文件

- 用户级配置：`~/.codex/config.toml`
- 项目级配置：`<repo>/.codex/config.toml`

在 Codex IDE 扩展中可通过右上角齿轮进入：

`Codex Settings > Open config.toml`

CLI 与 IDE 共享同一套配置层。你可以用它：

- 设置默认模型与提供方（provider）
- 配置审批策略与沙箱
- 配置 MCP 服务器

## 配置优先级（从高到低）

1. CLI 参数与 `--config` 覆盖值
2. `--profile <name>` 对应的 profile 配置
3. 项目级 `.codex/config.toml`（从项目根到当前目录逐层加载，越近优先级越高，仅受信任项目）
4. 用户级配置 `~/.codex/config.toml`
5. 系统级配置（Unix 上可能存在 `/etc/codex/config.toml`）
6. 内置默认值

建议：

- 把通用默认值放在用户级配置
- 把场景差异放进 profile

如果项目被标记为“不受信任”，Codex 会跳过项目内 `.codex/` 层，回退到用户级/系统级/内置默认值。

## 常用配置项

### 默认模型

```toml
model = "gpt-5.2"
```

### 命令审批策略

```toml
approval_policy = "on-request"
```

### 沙箱级别

```toml
sandbox_mode = "workspace-write"
```

### Web Search 模式

`web_search` 可选值：

- `"cached"`：使用缓存检索结果（默认）
- `"live"`：实时联网检索（等价 `--search`）
- `"disabled"`：关闭 Web Search

```toml
web_search = "cached"
# web_search = "live"
# web_search = "disabled"
```

### 推理强度

```toml
model_reasoning_effort = "high"
```

### 沟通风格

```toml
personality = "friendly" # 或 pragmatic / none
```

### 子进程环境变量策略

```toml
[shell_environment_policy]
include_only = ["PATH", "HOME"]
```

### 日志目录

```toml
log_dir = "/absolute/path/to/codex-logs"
```

也可在单次运行时覆盖：

```bash
codex -c log_dir=./.codex-log
```

## 功能开关（Feature Flags）

在 `config.toml` 中使用 `[features]` 表启用/禁用可选能力。

```toml
[features]
shell_snapshot = true
```

### 常见功能键

| 键名 | 默认值 | 成熟度 | 说明 |
| :--- | :---: | :--- | :--- |
| `collaboration_modes` | `true` | Stable | 协作模式（如 plan mode） |
| `personality` | `true` | Stable | 人格/沟通风格控制 |
| `request_rule` | `true` | Stable | 智能审批（`prefix_rule` 建议） |
| `shell_tool` | `true` | Stable | 默认 shell 工具 |
| `undo` | `true` | Stable | 按回合撤销能力 |
| `shell_snapshot` | `false` | Beta | Shell 快照加速重复命令 |
| `unified_exec` | `false` | Beta | PTY 统一执行工具 |
| `apply_patch_freeform` | `false` | Experimental | 启用自由格式 `apply_patch` |
| `apps` | `false` | Experimental | 启用 Apps/Connectors |
| `runtime_metrics` | `false` | Experimental | 在 TUI 展示运行指标 |
| `remote_models` | `false` | Experimental | 启动前刷新远程模型列表 |
| `web_search` | `true` | Deprecated | 旧开关，建议改用顶层 `web_search` |

说明：

- 未写入某个功能键时，沿用默认值。
- 建议优先使用 Stable/Beta 功能，Experimental 功能需谨慎启用。

### 启用与禁用方式

- 在 `config.toml` 的 `[features]` 下设置 `feature_name = true/false`
- CLI 启用：`codex --enable feature_name`
- CLI 连续启用多个：`codex --enable a --enable b`
