# Antigravity Kit

> 包含 Skills（技能）、Agents（智能体）与 Workflows（工作流）的 AI Agent 模板

<div  align="center">
    <a href="https://unikorn.vn/p/antigravity-kit?ref=unikorn" target="_blank"><img src="https://unikorn.vn/api/widgets/badge/antigravity-kit?theme=dark" alt="Antigravity Kit - Nổi bật trên Unikorn.vn" style="width: 210px; height: 54px;" width="210" height="54" /></a>
    <a href="https://unikorn.vn/p/antigravity-kit?ref=unikorn" target="_blank"><img src="https://unikorn.vn/api/widgets/badge/antigravity-kit/rank?theme=dark&type=daily" alt="Antigravity Kit - Hàng ngày" style="width: 250px; height: 64px;" width="250" height="64" /></a>
    <a href="https://launch.j2team.dev/products/antigravity-kit" target="_blank"><img src="https://launch.j2team.dev/badge/antigravity-kit/dark" alt="Antigravity Kit on J2TEAM Launch" width="250" height="54" /></a>
</div>

## 快速安装

```bash
npx @vudovn/ag-kit init
```

或全局安装：

```bash
npm install -g @vudovn/ag-kit
ag-kit init
```

这会把包含全部模板的 `.agent` 目录安装到你的项目中。

## 使用方法

### 使用智能体

**无需显式提及智能体！** 系统会自动检测并应用合适专家：

```
你："添加 JWT 认证"
AI：🤖 正在应用 @security-auditor + @backend-specialist...

你："修复深色模式按钮"
AI：🤖 正在使用 @frontend-specialist...

你："登录返回 500 错误"
AI：🤖 正在使用 @debugger 进行系统化分析...
```

**工作原理：**

- 静默分析请求
- 自动检测领域（前端、后端、安全等）
- 选择最佳专家
- 告知你正在应用哪方面的专业知识
- 无需了解系统架构即可获得专家级响应

**优势：**

- ✅ 零学习曲线：描述需求即可
- ✅ 始终获得专家响应
- ✅ 透明：显示正在使用的智能体
- ✅ 仍可显式提及智能体进行覆盖

### 使用工作流

使用斜杠命令调用工作流：

| 命令 | 描述 |
| ---------------- | ------------------------------------- |
| `/brainstorm`    | 在实施前探索方案 |
| `/create`        | 创建新功能或应用 |
| `/debug`         | 系统化调试 |
| `/deploy`        | 部署应用 |
| `/enhance`       | 改进现有代码 |
| `/orchestrate`   | 多智能体协同 |
| `/plan`          | 创建任务拆解 |
| `/preview`       | 本地预览变更 |
| `/status`        | 检查项目状态 |
| `/test`          | 生成并运行测试 |
| `/ui-ux-pro-max` | 50 种风格的设计 |

示例：

```
/brainstorm 认证系统
/create 带 Hero 部分的着陆页
/debug 为什么登录失败
```

### 使用技能

技能会根据任务上下文自动加载。AI 会阅读技能描述并应用相关知识。

## CLI 工具

| 命令         | 描述                               |
| --------------- | ----------------------------------------- |
| `ag-kit init`   | 安装 `.agent` 目录到你的项目 |
| `ag-kit update` | 更新到最新版本              |
| `ag-kit status` | 检查安装状态                 |

### 常用选项

```bash
ag-kit init --force        # 覆盖现有 .agent 目录
ag-kit init --path ./myapp # 安装到指定目录
ag-kit init --branch dev   # 使用指定分支
ag-kit init --quiet        # 静默输出（用于 CI/CD）
ag-kit init --dry-run      # 预览操作但不执行
```

## 文档

- **[Web App Example](https://antigravity-kit.vercel.app//docs/guide/examples/web-app)** - 创建 Web 应用的分步指南
- **[Online Docs](https://antigravity-kit.vercel.app//docs)** - 在线浏览全部文档

## 请我喝咖啡

<p align="center">
  <a href="https://buymeacoffee.com/vudovn">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
  </a>
</p>

<p align="center"> - or - </p>

<p align="center">
  <img src="https://img.vietqr.io/image/mbbank-0779440918-compact.jpg" alt="Buy me coffee" width="200" />
</p>

## 许可证

MIT © Vudovn
