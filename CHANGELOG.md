# 更新日志

本文件记录灵轨（Ling）的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/2.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

## [ling-1.1.1] - 2026-03-14

### 新增

- Spec 项目级工作区初始化与诊断：新增 `ling spec init` / `ling spec doctor`，在工作区落盘 `.ling/spec` 资产与 `issues.csv` 校验。
- Spec Profiles 资产：全局与项目级均包含 `profiles/`，并纳入完整性校验与回退语义。
- Spec 资产分支拉取：`ling spec init --branch <name>` 支持从指定分支的 `.spec/` 拉取 templates/references/profiles。

### 变更

- Spec 状态判定强化：`ling spec status` 增加文件级完整性校验，且在 `state.json` 缺失但检测到残留 artifacts 时返回 `broken` 并给出修复提示。
- CI 改为 npm：CI 矩阵不再依赖 bun，统一使用 `npm ci/test/run` 执行验证。

## [ling-1.1.0] - 2026-03-13

### 新增

- 已有资产冲突处理：`init/update/update-all/global sync/spec enable` 在交互终端逐项确认（保留 / 备份后移除 / 直接移除），并支持按资产类别复用选择。
- 预备份与回退：项目级覆盖前快照落盘到 `.agent-backup/.agents-backup`；全局与 Spec 维持快照备份路径。

### 维护

- ag-kit 更名清理：内部 CLI 入口更名为 `bin/ling-cli.js`，并移除 `AG_KIT_*` 兼容环境变量与 `~/.ag-kit` 控制目录迁移逻辑。
- 托管区块标记更名为 `LING MANAGED BLOCK`，并兼容识别旧 `AG-KIT` 标记后自动迁移。

## [ling-1.0.2] - 2026-03-13

### 变更

- npm 全局命令：移除 `ag-kit` bin 别名，仅保留 `ling`。

## [ling-1.0.1] - 2026-03-13

### 修复

- 健康检查脚本：允许 `ling spec status --quiet` 在 `missing` 状态返回非 0 退出码，并继续校验输出内容。
- Web 文档站 lint：移除 `useEffect` 内同步 `setState` 的用法，改为渲染期平台判断并对快捷键提示增加 `suppressHydrationWarning`。

### 维护

- CLI 入口权限：`bin/ling.js` 设置为可执行，保持与 `bin/ling-cli.js` 一致。

## [ling-1.0.0] - 2026-03-13

### 版本与标签

- npm 包版本遵循 SemVer：`1.0.0`
- git tag 与 CLI 显示统一使用：`ling-1.0.0`

### 新增

- 品牌更名基础设施：
  - 主命令切换为 `ling`
  - 目标目录结构：`gemini -> .agent/`，`codex -> .agents/`
  - 控制目录、索引和备份默认迁移到 `~/.ling/`
  - `antigravity.rules` 收敛为 `ling.rules`
- Spec Profile 全局层最小闭环：
  - `ling spec status`
  - `ling spec enable`
  - `ling spec disable`
  - 内置 `harness-engineering` 与 `cybernetic-systems-engineering`
  - 内置 templates / references 资产与回退能力

### 修复

- 分发模板与脚本文本清理装饰性字符：避免在模板文本与脚本输出中使用 Emoji 或装饰性 Unicode，提升跨平台终端显示一致性。
- Web 文档站快捷键提示对齐跨平台：搜索入口提示使用 `Cmd + K`（macOS）或 `Ctrl + K`（其他平台）。
- 安全扫描器稳定性改进：减少自扫误报、提升依赖锁文件识别准确性，并验证 Web 基础安全响应头配置。

## Legacy

本项目在 Ling 重启前的 2.x/3.x 版本记录已冻结，不再维护。

[Unreleased]: https://github.com/MisonL/Ling/compare/ling-1.1.1...HEAD
[ling-1.1.1]: https://github.com/MisonL/Ling/releases/tag/ling-1.1.1
[ling-1.1.0]: https://github.com/MisonL/Ling/releases/tag/ling-1.1.0
[ling-1.0.2]: https://github.com/MisonL/Ling/releases/tag/ling-1.0.2
[ling-1.0.1]: https://github.com/MisonL/Ling/releases/tag/ling-1.0.1
[ling-1.0.0]: https://github.com/MisonL/Ling/releases/tag/ling-1.0.0
