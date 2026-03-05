# PLAN-agents-v3-full

## 0. 文档信息
- 计划名称：Agents v3 全量统一与兼容升级
- 计划状态：Approved
- 计划日期：2026-03-04
- 目标版本：`3.0.0-beta.0`
- 执行范围：CLI、适配器、迁移链路、测试、文档、预发布流程
- 关键约束：以 `.agents` 为唯一源目录；兼容 `.agent/.gemini/.codex` 旧结构；仅处理本项目托管内容

## 1. 目标与非目标
### 1.1 目标
1. 统一 `.agents` 为唯一安装源目录。
2. 自动生成兼容视图：`.agent`、`.gemini`、根 `AGENTS.md` 托管区块。
3. 升级兼容旧目录：`.agent`、`.codex`、`.gemini`。
4. `init/update/update-all/doctor` 全链路支持 v3 收敛。
5. 提供一键入口 `sync`，将“首次安装/日常升级/必要时自愈”收敛为一条命令。
6. 支持用户级默认配置（如 `nonInteractive/disableAgentProjection`），减少反复传参。
7. 发布 `3.0.0-beta.0` 预览版（GitHub prerelease + npm beta tag）。

### 1.2 非目标
1. 不重写 skills/workflows 的业务语义。
2. 不引入破坏性命令名变更。
3. 不处理用户非本项目托管文件的结构重写。

## 2. 统一目录体系
### 2.1 Canonical
- Canonical：`<workspace>/.agents/**`。
- Manifest：`<workspace>/.agents/manifest.json`（v3）。

### 2.2 Projections
- Antigravity 兼容：`<workspace>/.agent/**`（由 `.agents` 投影，不作为主源）。
- Gemini CLI 兼容：`<workspace>/.gemini/settings.json` + `<workspace>/.gemini/agents/ag-kit-*.md`。
- Codex 项目指令入口：根 `AGENTS.md` 托管区块（managed block）。

## 3. 冲突与迁移策略
### 3.1 归属与边界
- 仅覆盖/清理 manifest 或命名空间可识别的托管文件。
- 非托管 `.codex` 不删除。
- 任何覆盖前先备份到 `~/.ag-kit/backups/<workspace-key>/<timestamp>/`（兼容旧版 `.agents-backup`）。
- 单次 install/update/doctor 修复产生的 rollback 快照与冲突备份统一落在同一 `<timestamp>` 目录，便于追溯与回退。

### 3.2 交互策略
当检测到以下冲突且为交互终端时，必须询问用户：
1. 已存在未托管 `.agent`：
   - 备份后替换
   - 保留不动
   - 改名失效（`.agent.user.<ts>`）后创建新投影
2. 已存在 `.gemini/agents`：
   - 追加 `ag-kit-*.md`
   - 备份后替换
   - 跳过写入
3. 仅检测到疑似旧版仅 `.agent` 安装（无托管证据）：
   - 询问是否迁移到 v3 `.agents` 体系
   - 非交互需显式 `--accept-legacy-agent` 才会迁移（避免误覆盖用户自建 `.agent`）

非交互默认：`.agent` 备份后替换；`.gemini/agents` 追加。

## 4. CLI 行为定义
1. 新增 `sync`：一键同步当前项目到最新状态。未安装则执行 `init`；已安装则执行 `update`；必要时在存在托管信号的前提下触发 `doctor --fix` 自愈。
2. `init`/`update` 统一执行 full 安装（不再分开安装 gemini/codex）。
3. `--target gemini|codex` 保留兼容，但内部归一为 full。
4. 对仅 legacy `.agent` 的工作区，`update/update-all/doctor --fix` 支持通过 `--accept-legacy-agent` 迁移到 v3。
5. `status` 显示 canonical + projection + legacy 状态。
6. `doctor --fix` 收敛到 v3，并保持幂等。
7. 可选用户配置：`~/.ag-kit/config.json`（或 `AG_KIT_CONFIG_PATH`）用于设置默认参数；CLI 显式参数优先于配置文件。

## 5. MCP 双通道策略（Context7）
- `context7`：`@upstash/context7-mcp`
- `context7_backup`：`@iflow-mcp/context7-mcp@1.0.0`
- 官方不可用时可尝试备用通道。
- 配置不使用 `values` 字段，只使用规范字段（如 `env`）。

## 6. 测试矩阵
1. init/update 默认 full 行为。
2. legacy `.agent`/`.codex`/`.gemini` 迁移。
3. `.gemini/settings.json` 合并保留用户键。
4. `.gemini/agents` 追加幂等。
5. 非托管 `.codex` 不删除。
6. `doctor --fix` 连续执行幂等。

## 7. 发布流程
1. 分支：`preview/agents-v3`。
2. 版本：`3.0.0-beta.0`。
3. 校验：`bun run test`、`bun run health-check`、关键 smoke。
4. 发布：`npm publish --tag beta` + GitHub prerelease。
