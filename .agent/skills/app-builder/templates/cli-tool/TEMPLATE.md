---
name: cli-tool
description: Node.js CLI tool template principles（CLI 工具模板原则）。Commander.js、interactive prompts（交互式提示）。
---

# CLI Tool Template（CLI 工具模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Runtime（运行时） | Node.js 20+ |
| Language（语言） | TypeScript |
| CLI Framework（CLI 框架） | Commander.js |
| Prompts（提示） | Inquirer.js |
| Output（输出） | chalk + ora（着色/加载） |
| Config（配置） | cosmiconfig |

---

## Directory Structure（目录结构）

```
project-name/
├── src/
│   ├── index.ts         # Entry point（入口）
│   ├── cli.ts           # CLI setup（CLI 设置）
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

## CLI Design Principles（CLI 设计原则）

| Principle（原则） | Description（说明） |
| --- | --- |
| Subcommands（子命令） | Group related actions（分组相关操作） |
| Options（选项） | Flags with defaults（带默认值的标志） |
| Interactive（交互） | Prompts when needed（需要时提示） |
| Non-interactive（非交互） | Support `--yes` flags（支持 `--yes` 标志） |

---

## Key Components（关键组件）

| Component（组件） | Purpose（用途） |
| --- | --- |
| Commander | Command parsing（命令解析） |
| Inquirer | Interactive prompts（交互提示） |
| Chalk | Colored output（彩色输出） |
| Ora | Spinners/loading（旋转指示/加载） |
| Cosmiconfig | Config file discovery（配置文件发现） |

---

## Setup Steps（设置步骤）

1. Create project directory（创建项目目录）
2. `npm init -y`
3. Install deps（安装依赖）：`npm install commander @inquirer/prompts chalk ora cosmiconfig`
4. Configure bin in package.json（配置 bin）
5. `npm link` for local testing（本地测试）

---

## Publishing（发布）

```bash
npm login
npm publish
```

---

## Best Practices（最佳实践）

- Provide helpful error messages（清晰错误信息）
- Support both interactive and non-interactive modes（同时支持交互与非交互）
- Use consistent output styling（一致的输出样式）
- Validate inputs with Zod（使用 Zod 验证输入）
- Exit with proper codes（0 success, 1 error）
