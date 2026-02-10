---
name: cli-tool
description: Node.js CLI 工具模板原则。Commander.js、交互式提示。
---

# CLI 工具模板

## 技术栈

| 组件 | 技术 |
| --- | --- |
| 运行时 | Node.js 20+ |
| 语言 | TypeScript |
| CLI 框架 | Commander.js |
| 提示 | Inquirer.js |
| 输出 | chalk + ora |
| 配置 | cosmiconfig |

---

## 目录结构

```
project-name/
├── src/
│   ├── index.ts         # 入口
│   ├── cli.ts           # CLI 设置
│   ├── commands/        # 命令处理
│   ├── lib/
│   │   ├── config.ts    # 配置加载
│   │   └── logger.ts    # 样式化输出
│   └── types/
├── bin/
│   └── cli.js           # 可执行文件
└── package.json
```

---

## CLI 设计原则

| 原则 | 说明 |
| --- | --- |
| 子命令 | 分组相关操作 |
| 选项 | 带默认值的标志 |
| 交互 | 需要时提示 |
| 非交互 | 支持 `--yes` 标志 |

---

## 关键组件

| 组件 | 用途 |
| --- | --- |
| Commander | 命令解析 |
| Inquirer | 交互提示 |
| Chalk | 彩色输出 |
| Ora | 旋转指示/加载 |
| Cosmiconfig | 配置文件发现 |

---

## 设置步骤

1. 创建项目目录
2. `npm init -y`
3. 安装依赖：`npm install commander @inquirer/prompts chalk ora cosmiconfig`
4. 在 package.json 配置 bin
5. `npm link` 进行本地测试

---

## 发布

```bash
npm login
npm publish
```

---

## 最佳实践

- 提供清晰的错误信息
- 同时支持交互与非交互模式
- 使用一致的输出样式
- 使用 Zod 验证输入
- 以正确状态码退出（0 成功，1 失败）
