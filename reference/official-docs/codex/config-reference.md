# 配置参考（Configuration Reference）

> 来源：`https://developers.openai.com/codex/config-reference`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。  
> 说明：完整示例请结合 `config-sample.md` 一并阅读。

本页用于快速检索 Codex 常用配置项。  
配置分为两类：

- `config.toml`：运行时配置
- `requirements.toml`：受管控环境下的限制策略

## `config.toml`

### 核心与模型

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `model` | string | 默认模型名称 |
| `review_model` | string | `/review` 专用模型（可选） |
| `model_provider` | string | 当前模型提供方 ID |
| `oss_provider` | string | `--oss` 模式默认本地 provider |
| `model_context_window` | number | 模型上下文窗口 token 上限 |
| `model_auto_compact_token_limit` | number | 自动压缩触发阈值 |
| `tool_output_token_limit` | number | 单次工具输出的 token 限制 |
| `log_dir` | string | 本地日志目录 |

### 推理与表达

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `model_reasoning_effort` | string | 推理强度（如 `low`/`medium`/`high`） |
| `model_reasoning_summary` | string | 推理摘要策略 |
| `model_verbosity` | string | 响应冗长度 |
| `model_supports_reasoning_summaries` | bool | 强制声明支持推理摘要 |
| `personality` | string | 默认沟通风格（如 `friendly`） |

### 指令与提示词覆盖

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `developer_instructions` | string | 额外开发指令（优先于项目文档前注入） |
| `instructions` | string | 旧字段（兼容） |
| `compact_prompt` | string | 压缩提示词内联覆盖 |
| `model_instructions_file` | string | 覆盖内置基础指令的文件路径 |
| `experimental_compact_prompt_file` | string | 压缩提示词文件路径 |

### 审批与沙箱

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `approval_policy` | string | 审批策略（`untrusted`/`on-request`/`on-failure`/`never`） |
| `sandbox_mode` | string | 沙箱模式（`read-only`/`workspace-write`/`danger-full-access`） |

`[sandbox_workspace_write]` 子表常见键：

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `network_access` | bool | 是否允许沙箱内外网访问 |
| `writable_roots` | string[] | 额外可写目录白名单 |
| `exclude_tmpdir_env_var` | bool | 是否排除 `$TMPDIR` |
| `exclude_slash_tmp` | bool | 是否排除 `/tmp` |

### 身份与认证

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `cli_auth_credentials_store` | string | 凭据存储方式（`file`/`keyring`/`auto`） |
| `chatgpt_base_url` | string | ChatGPT 登录后端地址 |
| `forced_chatgpt_workspace_id` | string | 限定 ChatGPT workspace ID |
| `forced_login_method` | string | 强制登录方式（`chatgpt`/`api`） |
| `mcp_oauth_credentials_store` | string | MCP OAuth 凭据存储策略 |
| `mcp_oauth_callback_port` | number | MCP OAuth 回调端口 |

### 项目文档与根目录发现

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `project_doc_max_bytes` | number | 每层项目指令文档读取上限 |
| `project_doc_fallback_filenames` | string[] | `AGENTS.md` 缺失时的备选文件名 |
| `project_root_markers` | string[] | 项目根目录识别标记 |

### 历史与引用链接

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `file_opener` | string | 引用链接协议（`vscode`/`cursor`/`none` 等） |

`[history]` 子表：

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `persistence` | string | 历史持久化模式（`save-all`/`none`） |
| `max_bytes` | number | 历史文件大小上限 |

### Shell 环境策略

`[shell_environment_policy]` 子表：

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `inherit` | string | 继承策略（`all`/`core`/`none`） |
| `ignore_default_excludes` | bool | 是否忽略默认敏感变量过滤 |
| `exclude` | string[] | 额外排除模式 |
| `include_only` | string[] | 仅保留变量白名单 |
| `set` | table | 强制注入/覆盖变量 |
| `use_login_shell` | bool | 是否通过登录 shell 初始化 |

### 通知与界面

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `notify` | string[] | 外部通知程序命令 |
| `hide_agent_reasoning` | bool | 隐藏推理事件输出 |
| `show_raw_agent_reasoning` | bool | 显示原始推理内容 |
| `disable_response_storage` | bool | 禁止响应存储（若版本支持） |
| `profile` | string | 默认 profile 名称 |
| `web_search` | string | Web Search 模式（`cached`/`live`/`disabled`） |

`[tui]` 子表常见键：

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `notifications` | bool/string[] | TUI 通知开关或事件白名单 |
| `notification_method` | string | 终端通知方式（`auto`/`osc9`/`bel`） |
| `animations` | bool | 是否启用动画 |
| `alternate_screen` | string | 是否使用备用屏幕 |
| `show_tooltips` | bool | 是否显示引导提示 |
| `status_line` | string[] | 底部状态栏项 |

### 中央功能开关

`[features]` 子表（示例）：

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `collaboration_modes` | bool | 协作模式能力 |
| `request_rule` | bool | 智能审批建议 |
| `shell_snapshot` | bool | Shell 快照 |
| `unified_exec` | bool | 统一执行工具 |
| `apply_patch_freeform` | bool | 自由格式补丁工具 |
| `apps` | bool | Apps/Connectors |
| `personality` | bool | 风格控制能力 |
| `runtime_metrics` | bool | 运行指标展示 |
| `remote_models` | bool | 远程模型刷新 |

### MCP 服务器

`[mcp_servers.<name>]` 支持两类配置：

1. **STDIO**：`command` + `args`
2. **HTTP**：`url`

常见键：

- `enabled`
- `required`
- `env` / `env_vars`
- `http_headers` / `env_http_headers`
- `startup_timeout_sec`
- `tool_timeout_sec`
- `enabled_tools`
- `disabled_tools`
- `bearer_token_env_var`

### 模型提供方

`[model_providers.<name>]` 常见键：

- `name`
- `base_url`
- `wire_api`（`responses` / `chat`）
- `env_key`
- `query_params`
- `http_headers`
- `env_http_headers`
- `request_max_retries`
- `stream_max_retries`
- `stream_idle_timeout_ms`

### 其他常见子表

| 子表 | 用途 |
| :--- | :--- |
| `[profiles.<name>]` | 命名配置集 |
| `[skills.<path>]` | 按路径启停 Skill |
| `[apps.<app_name>]` | App/Connector 开关 |
| `[projects."<absolute_path>"]` | 项目信任级别 |
| `[analytics]` | 匿名指标开关 |
| `[feedback]` | `/feedback` 开关 |
| `[otel]` | OTel 总开关与导出策略 |
| `[otel.exporter."otlp-http"]` | OTel HTTP 导出 |
| `[otel.exporter."otlp-grpc"]` | OTel gRPC 导出 |

## `requirements.toml`

`requirements.toml` 用于组织/企业环境“限制可用能力”，防止本地配置越权。

### 常见限制项

| 键 | 类型 | 说明 |
| :--- | :--- | :--- |
| `allowed_approval_policies` | string[] | 允许的审批策略集合 |
| `allowed_sandbox_modes` | string[] | 允许的沙箱模式集合 |

### MCP 约束（示例）

```toml
allowed_approval_policies = ["untrusted", "on-request", "on-failure"]
allowed_sandbox_modes = ["read-only", "workspace-write"]

[mcp_servers.docs]
identity = { command = "codex-mcp" }

[mcp_servers.remote]
identity = { url = "https://example.com/mcp" }
```

说明：

- 通过 `requirements.toml` 可以禁止高风险策略（如 `approval_policy = "never"`、`sandbox_mode = "danger-full-access"`）。
- 组织可用它统一团队安全基线。
