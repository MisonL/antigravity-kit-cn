# 高级配置（Advanced Configuration）

> 来源：`https://developers.openai.com/codex/config-advanced`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

当你需要更细粒度控制模型提供方、安全策略、MCP、可观测性等能力时，使用本页配置。  
基础项先看 `config-basic.md`。

## Profiles（命名配置集）

Profile 可把一组配置命名保存，并通过 CLI 快速切换。

注意：

- 当前为实验能力，后续可能调整。
- Codex IDE 扩展当前不支持 profile 切换。

示例：

```toml
model = "gpt-5-codex"
approval_policy = "on-request"

[profiles.deep-review]
model = "gpt-5-pro"
model_reasoning_effort = "high"
approval_policy = "never"

[profiles.lightweight]
model = "gpt-4.1"
approval_policy = "untrusted"
```

调用方式：

```bash
codex --profile deep-review
```

设置默认 profile：

```toml
profile = "deep-review"
```

## 单次运行覆盖配置（CLI）

除编辑 `~/.codex/config.toml` 外，也可为单次运行覆盖配置。

- 有专用参数时优先用专用参数（如 `--model`）。
- 其他键用 `-c` / `--config`。

```bash
# 专用参数
codex --model gpt-5.2

# 通用覆盖（值按 TOML 解析）
codex --config model='"gpt-5.2"'
codex --config sandbox_workspace_write.network_access=true
codex --config 'shell_environment_policy.include_only=["PATH","HOME"]'
```

说明：

- 支持点号路径设置嵌套键（如 `mcp_servers.context7.enabled=false`）。
- `--config` 值按 TOML 解析；解析失败时按字符串处理。

## 配置与状态目录

Codex 本地状态目录：`$CODEX_HOME`（默认 `~/.codex`）。

常见文件：

- `config.toml`：本地配置
- `auth.json`：文件型凭据存储（或系统 keychain/keyring）
- `history.jsonl`：会话历史（启用持久化时）
- 日志与缓存文件

## 项目级配置（`.codex/config.toml`）

Codex 会从项目根到当前目录逐层加载 `.codex/config.toml`。  
同名键冲突时，离当前目录最近的配置生效。

安全规则：

- 仅受信任项目加载项目级 `.codex/config.toml`
- 不受信任项目会忽略项目级配置

路径解析规则：

- 项目配置中的相对路径，按该配置文件所在 `.codex/` 目录解析

## 项目根识别

默认遇到 `.git` 即视为项目根。可通过 `project_root_markers` 调整：

```toml
project_root_markers = [".git", ".hg", ".sl"]
```

若设置为空数组：

```toml
project_root_markers = []
```

则不向上查找父目录，当前目录即项目根。

## 自定义模型提供方（Model Provider）

Provider 决定 Codex 如何连接模型（`base_url`、协议、鉴权、请求头等）。

```toml
model = "gpt-5.1"
model_provider = "proxy"

[model_providers.proxy]
name = "OpenAI via Proxy"
base_url = "http://proxy.example.com"
env_key = "OPENAI_API_KEY"

[model_providers.ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"
```

附加请求头：

```toml
[model_providers.example]
http_headers = { "X-Example-Header" = "example-value" }
env_http_headers = { "X-Example-Features" = "EXAMPLE_FEATURES" }
```

## OSS 模式（本地开源模型）

`--oss` 可切换到本地 provider（如 Ollama、LM Studio）。

```toml
oss_provider = "ollama" # 或 lmstudio
```

## Azure 与数据驻留（Data Residency）

Azure 示例：

```toml
[model_providers.azure]
name = "Azure"
base_url = "https://YOUR_PROJECT_NAME.openai.azure.com/openai"
env_key = "AZURE_OPENAI_API_KEY"
query_params = { api-version = "2025-04-01-preview" }
wire_api = "responses"
```

数据驻留示例：

```toml
model_provider = "openaidr"

[model_providers.openaidr]
name = "OpenAI Data Residency"
base_url = "https://us.api.openai.com/v1"
```

## 推理、冗长度与上下文限制

```toml
model_reasoning_summary = "none"
model_verbosity = "low"
model_supports_reasoning_summaries = true
model_context_window = 128000
```

说明：

- `model_verbosity` 仅对 Responses API provider 生效。
- Chat Completions provider 可能忽略该设置。

## 审批策略与沙箱策略

```toml
approval_policy = "untrusted"   # 也可 on-request / on-failure / never
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
exclude_tmpdir_env_var = false
exclude_slash_tmp = false
writable_roots = ["/Users/YOU/.pyenv/shims"]
network_access = false
```

提示：

- `workspace-write` 下某些环境会保持 `.git/`、`.codex/` 只读。
- 若需控制“哪些命令可跳出沙箱”，结合 `rules` 使用。
- `danger-full-access` 会关闭沙箱隔离，仅适用于你已具备外部隔离措施的环境。

## Shell 环境变量策略

`shell_environment_policy` 控制 Codex 启动子进程时可继承哪些环境变量。

```toml
[shell_environment_policy]
inherit = "none" # all / core / none
set = { PATH = "/usr/bin", MY_FLAG = "1" }
ignore_default_excludes = false
exclude = ["AWS_*", "AZURE_*"]
include_only = ["PATH", "HOME"]
```

说明：

- 匹配规则为不区分大小写的 glob。
- 默认会过滤包含 `KEY` / `SECRET` / `TOKEN` 的变量名（除非显式放开）。

## MCP 配置

MCP 细节请参见 `mcp.md`。  
常见配置入口为 `[mcp_servers.<name>]`。

## 可观测性与遥测（OTel + Metrics）

默认关闭。启用示例：

```toml
[otel]
environment = "staging"
exporter = "none"       # 或 otlp-http / otlp-grpc
log_user_prompt = false
```

HTTP 导出示例：

```toml
[otel]
exporter = { otlp-http = {
  endpoint = "https://otel.example.com/v1/logs",
  protocol = "binary",
  headers = { "x-otlp-api-key" = "${OTLP_TOKEN}" }
}}
```

gRPC 导出示例：

```toml
[otel]
exporter = { otlp-grpc = {
  endpoint = "https://otel.example.com:4317",
  headers = { "x-otlp-meta" = "abc123" }
}}
```

### 典型事件

- `codex.conversation_starts`
- `codex.api_request`
- `codex.sse_event`
- `codex.websocket_request`
- `codex.websocket_event`
- `codex.user_prompt`（默认脱敏）
- `codex.tool_decision`
- `codex.tool_result`

### 常见 OTel 指标

| 指标 | 类型 | 说明 |
| :--- | :--- | :--- |
| `codex.api_request` | counter | API 请求计数 |
| `codex.api_request.duration_ms` | histogram | API 请求耗时 |
| `codex.sse_event` | counter | SSE 事件计数 |
| `codex.sse_event.duration_ms` | histogram | SSE 处理耗时 |
| `codex.tool.call` | counter | 工具调用计数 |
| `codex.tool.call.duration_ms` | histogram | 工具执行耗时 |

### 匿名指标开关

```toml
[analytics]
enabled = false
```

该开关与 OTel 导出独立。

## 反馈开关

默认允许 `/feedback`。可全局禁用：

```toml
[feedback]
enabled = false
```

## 推理内容显示控制

```toml
hide_agent_reasoning = true
# show_raw_agent_reasoning = true
```

建议仅在确有需要时显示原始推理内容。

## 通知（notify / TUI 通知）

外部通知程序：

```toml
notify = ["python3", "/path/to/notify.py"]
```

通知参数为单个 JSON 字符串，常见字段：

- `type`
- `thread-id`
- `turn-id`
- `cwd`
- `input-messages`
- `last-assistant-message`

TUI 相关键位于 `[tui]`：

- `tui.notifications`
- `tui.notification_method`（`auto` / `osc9` / `bel`）
- `tui.animations`
- `tui.alternate_screen`
- `tui.show_tooltips`

## 历史持久化

关闭历史：

```toml
[history]
persistence = "none"
```

限制历史文件大小：

```toml
[history]
max_bytes = 104857600
```

## 可点击引用（file_opener）

```toml
file_opener = "vscode" # 或 cursor / windsurf / vscode-insiders / none
```

## 项目指令发现

两项关键参数：

- `project_doc_max_bytes`
- `project_doc_fallback_filenames`

用于控制 `AGENTS.md`（及备选文件）读取范围与容量。
