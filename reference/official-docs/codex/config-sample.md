# 配置示例（Sample Configuration）

> 来源：`https://developers.openai.com/codex/config-sample`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

以下示例可作为 `config.toml` 起点。  
按需复制你需要的键，不建议无差别全量粘贴。

```toml
################################################################################
# Codex 示例配置（config.toml）
# 说明：
# - 根键必须位于各表定义之前
# - 未设置的键会回退默认值
# - 示例中部分键为可选项，按需启用
################################################################################

################################################################################
# 核心模型
################################################################################

model = "gpt-5.2-codex"
model_provider = "openai"
# review_model = "gpt-5.2-codex"
# oss_provider = "ollama"

################################################################################
# 推理与冗长度
################################################################################

model_reasoning_effort = "medium"     # minimal / low / medium / high / xhigh
model_reasoning_summary = "auto"      # auto / concise / detailed / none
model_verbosity = "medium"            # low / medium / high
# model_supports_reasoning_summaries = false

################################################################################
# 指令覆盖
################################################################################

# developer_instructions = "额外开发指令"
# instructions = "旧字段，兼容使用"
# compact_prompt = "覆盖压缩提示词"
# model_instructions_file = "/path/to/instructions.txt"
# experimental_compact_prompt_file = "/path/to/compact_prompt.txt"

################################################################################
# 审批与沙箱
################################################################################

approval_policy = "on-request"        # untrusted / on-request / on-failure / never
sandbox_mode = "read-only"            # read-only / workspace-write / danger-full-access

[sandbox_workspace_write]
network_access = false
exclude_tmpdir_env_var = false
exclude_slash_tmp = false
writable_roots = []

################################################################################
# 认证与登录
################################################################################

cli_auth_credentials_store = "file"   # file / keyring / auto
# chatgpt_base_url = "https://chatgpt.com/backend-api/"
# forced_chatgpt_workspace_id = ""
# forced_login_method = "chatgpt"      # chatgpt / api
# mcp_oauth_credentials_store = "auto" # auto / file / keyring
# mcp_oauth_callback_port = 4321

################################################################################
# 项目文档读取策略
################################################################################

project_doc_max_bytes = 32768
project_doc_fallback_filenames = []
project_root_markers = [".git"]

################################################################################
# Web Search
################################################################################

web_search = "cached"                 # cached / live / disabled

################################################################################
# 通知与输出
################################################################################

# notify = ["python3", "/path/to/notify.py"]
hide_agent_reasoning = false
show_raw_agent_reasoning = false
file_opener = "vscode"                # vscode / cursor / windsurf / none
log_dir = "~/.codex/log"

################################################################################
# Shell 环境变量策略
################################################################################

[shell_environment_policy]
inherit = "all"                       # all / core / none
ignore_default_excludes = false
exclude = []
include_only = []
set = {}
use_login_shell = false

################################################################################
# 历史记录
################################################################################

[history]
persistence = "save-all"              # save-all / none
# max_bytes = 104857600

################################################################################
# TUI 配置
################################################################################

[tui]
notifications = true                  # true / false / ["agent-turn-complete"]
# notification_method = "auto"        # auto / osc9 / bel
animations = true
show_tooltips = true
alternate_screen = "auto"
# status_line = ["model", "context-remaining", "git-branch"]

################################################################################
# 功能开关（features）
################################################################################

[features]
collaboration_modes = true
request_rule = true
shell_tool = true
undo = true
shell_snapshot = false
unified_exec = false
apply_patch_freeform = false
personality = true
runtime_metrics = false
apps = false

################################################################################
# MCP 服务器示例
################################################################################

[mcp_servers.context7]
enabled = true
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
startup_timeout_sec = 10.0
tool_timeout_sec = 60.0

[mcp_servers.github]
enabled = false
url = "https://github-mcp.example.com/mcp"
bearer_token_env_var = "GITHUB_TOKEN"
startup_timeout_sec = 10.0
tool_timeout_sec = 60.0

################################################################################
# Provider 示例
################################################################################

[model_providers.openai]
name = "OpenAI"
base_url = "https://api.openai.com/v1"
wire_api = "responses"

[model_providers.ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"
wire_api = "chat"

[model_providers.azure]
name = "Azure"
base_url = "https://YOUR_PROJECT_NAME.openai.azure.com/openai"
wire_api = "responses"
query_params = { api-version = "2025-04-01-preview" }
env_key = "AZURE_OPENAI_API_KEY"

################################################################################
# 命名配置集（profiles）
################################################################################

[profiles.deep-review]
model = "gpt-5-pro"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "read-only"

[profiles.fast-local]
model_provider = "ollama"
model = "qwen2.5-coder:14b"
approval_policy = "never"
sandbox_mode = "workspace-write"

################################################################################
# 其他策略开关
################################################################################

[analytics]
enabled = true

[feedback]
enabled = true

[projects."/absolute/path/to/project"]
trust_level = "trusted"               # trusted / untrusted
```

## 使用建议

1. 先写最小配置：`model`、`approval_policy`、`sandbox_mode`。
2. 再按场景补充：`features`、`mcp_servers`、`model_providers`。
3. 团队协作时统一 `requirements.toml` 约束，避免配置越权。
