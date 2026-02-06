# Antigravity Kit CN

> 包含 Skills、Agents、Workflows 的 AI Agent 能力模板（中文增强版，含 Codex 适配）

## 快速安装

```bash
git clone https://github.com/MisonL/antigravity-kit-cn.git
cd antigravity-kit-cn
npm install -g .
```

在目标项目中初始化：

```bash
cd /path/to/your-project
ag-kit init --target gemini
ag-kit init --target codex
```

说明：

- `gemini` 目标使用 `.agent/`。
- `codex` 目标使用 `.codex/`，并托管注入 `AGENTS.md` / `antigravity.rules`。

## 使用方式

### 使用 Agents

无需手动指定 Agent，系统会自动路由并声明当前专家。

示例：

```text
You: "添加 JWT 认证"
AI: 🤖 正在应用 @security-auditor + @backend-specialist...

You: "修复深色模式按钮"
AI: 🤖 正在使用 @frontend-specialist...

You: "登录返回 500 错误"
AI: 🤖 正在使用 @debugger 进行系统化分析...
```

### 使用 Workflows

| 命令 | 说明 |
| ---- | ---- |
| `/brainstorm` | 结构化探索方案 |
| `/create` | 创建新功能/新应用 |
| `/debug` | 系统化排查问题 |
| `/deploy` | 部署发布 |
| `/enhance` | 增强现有实现 |
| `/orchestrate` | 多智能体协同 |
| `/plan` | 任务拆解与排期 |
| `/preview` | 本地预览与验收 |
| `/status` | 状态检查 |
| `/test` | 测试生成与执行 |
| `/ui-ux-pro-max` | 高质量 UI 设计流程 |

示例：

```text
/brainstorm 认证系统
/create 带 Hero 的落地页
/debug 为什么登录失败
```

### 使用 Skills

Skills 根据任务上下文自动加载，Agent 会先读 `SKILL.md`，再按需读取 `references/` 与 `scripts/`。

## CLI 参考

| 命令 | 描述 |
| ---- | ---- |
| `ag-kit init` | 初始化目标结构（gemini/codex） |
| `ag-kit update` | 更新当前工作区已安装目标 |
| `ag-kit update-all` | 批量更新索引内工作区 |
| `ag-kit doctor` | 健康检查，可 `--fix` 自愈 |
| `ag-kit status` | 查看安装状态 |
| `ag-kit exclude` | 管理全局索引排除项 |

常用选项：

```bash
ag-kit init --target codex --force
ag-kit init --path ./myapp --target gemini
ag-kit init --branch dev --target codex
ag-kit init --quiet
ag-kit init --no-index
ag-kit update --target codex --dry-run
ag-kit doctor --target codex --fix
```

## Buy me coffee

> 本项目由 **Mison** 进行汉化处理与额外功能开发。

<table>
  <tr>
    <td align="center" width="50%">
      <strong>支持 Mison（本仓库维护者）</strong><br />
      <img src="../image/README/mison-wechat-pay.jpg" alt="Mison 微信赞赏码" width="260" /><br />
      <sub>微信赞赏码</sub>
    </td>
    <td align="center" width="50%">
      <strong>感谢上游作者 vudovn 创建并维护 Antigravity-Kit</strong><br />
      <a href="https://buymeacoffee.com/vudovn">
        <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
      </a><br />
      <img src="https://img.vietqr.io/image/mbbank-0779440918-compact.jpg" alt="Upstream donation channel" width="200" />
    </td>
  </tr>
</table>

## License

MIT © Vudovn, Mison
