---
name: cli-tool
description: Node.js CLI 工具模板原则。Commander.js、交互式提示。
---

# CLI Tool Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Runtime（运行时） | Node.js 20+ |
| Language（语言） | TypeScript |
| CLI Framework | Commander.js |
| Prompts（提示） | Inquirer.js |
| Output（输出） | chalk + ora |
| Config（配置） | cosmiconfig |

---

## Directory Structure（目录结构）

```
project-name/
├── src/
│   ├── index.ts         # Entry point（入口）
│   ├── cli.ts           # CLI setup（设置）
│   ├── commands/        # Command handlers（命令处理）
│   ├── lib/
│   │   ├── config.ts    # Config loader（配置加载）
│   │   └── logger.ts    # Styled output（样式化输出）
│   └── types/
├── bin/
│   └── cli.js           # Executable（可执行文件）
└── package.json
```

---

## CLI Design Principles（设计原则）

| Principle | Description |
| --- | --- |
| Subcommands | 分组相关操作 |
| Options | 带默认值的标志 |
| Interactive | 需要时提示 |
| Non-interactive | 支持 `--yes` 标志 |

---

## Key Components（关键组件）

| Component | Purpose |
| --- | --- |
| Commander | Command parsing（命令解析） |
| Inquirer | Interactive prompts（交互提示） |
| Chalk | Colored output（彩色输出） |
| Ora | Spinners/loading（加载指示） |
| Cosmiconfig | Config file discovery（配置发现） |

---

## Setup Steps（设置步骤）

1. Create project directory（创建项目目录）
2. `npm init -y`
3. Install deps（安装依赖）: `npm install commander @inquirer/prompts chalk ora cosmiconfig`
4. Configure bin in package.json
5. `npm link` for local testing

---

## Publishing（发布）

```bash
npm login
npm publish
```

---

## Best Practices（最佳实践）

- 提供清晰的错误信息
- 同时支持交互与非交互模式
- 使用一致的输出样式
- 使用 Zod 验证输入
- 以正确状态码退出（0 成功，1 失败）
