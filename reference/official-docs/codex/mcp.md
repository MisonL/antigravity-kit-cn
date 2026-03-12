# 模型上下文协议（MCP）

> 来源：`https://developers.openai.com/codex/mcp`  
> 同步日期：2026-02-12  
> 说明：本文件为官方内容的中文整理版，采用标准 Markdown 语法。

MCP（Model Context Protocol）用于把模型连接到外部工具与上下文。  
在 Codex 中，你可以通过 MCP 让 Agent 访问第三方文档、浏览器工具、设计工具等。

Codex CLI 与 IDE 扩展都支持 MCP，且共用同一份配置。

## 支持的 MCP 类型

- `STDIO` 服务器（本地进程）
  - 支持环境变量注入
- `Streamable HTTP` 服务器（远程地址）
  - 支持 Bearer Token
  - 支持 OAuth（若服务器支持）

## MCP 配置位置

默认写入：

```text
~/.codex/config.toml
```

也可在项目内配置：

```text
<repo>/.codex/config.toml
```

注意：项目级配置仅在“受信任项目”中生效。

## 使用 CLI 配置 MCP

### 添加服务器

```bash
codex mcp add <server-name> -- <stdio-command>
```

示例（Context7）：

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

### 查看帮助与状态

```bash
codex mcp --help
codex mcp list
codex mcp get <server-name>
```

在 Codex TUI 中，可用 `/mcp` 查看当前会话可用服务器。

## 通过 `config.toml` 手动配置

### STDIO 示例

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

### HTTP 示例

```toml
[mcp_servers.docs_remote]
url = "https://example.com/mcp"
bearer_token_env_var = "DOCS_TOKEN"
```

常见可选字段：

- `enabled`：是否启用
- `required`：启动失败时是否阻断会话
- `env` / `env_vars`：注入环境变量
- `http_headers` / `env_http_headers`：HTTP 头
- `startup_timeout_sec`：启动超时
- `tool_timeout_sec`：工具调用超时
- `enabled_tools` / `disabled_tools`：工具白名单/黑名单

## OAuth 登录（按需）

若远程 MCP 支持 OAuth，可执行：

```bash
codex mcp login <server-name>
```

## 常见 MCP 场景

- 文档检索：接入官方 API/SDK 文档
- 浏览器自动化：页面检查、交互、抓取
- 设计协作：Figma 等上下文接入
- 内部平台：接入公司内部服务与知识库

## 安全建议

- 默认最小权限：只配置必要服务器和必要工具。
- Token 使用环境变量注入，不写死在仓库。
- 对高风险服务器设置 `required = false`，避免启动失败阻断主流程。
