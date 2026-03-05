# Repository Guidelines

## 项目结构与模块组织
- `bin/`：CLI 主入口与核心逻辑。`bin/ag-kit.js` 负责命令分发，`bin/core/` 处理构建/转换，`bin/adapters/` 实现 full 安装与兼容投影（`.agent/.gemini`），`bin/utils/` 放通用工具。
- `scripts/`：维护脚本（如 `clean.js`、`health-check.js`、`postinstall-check.js`；`health-check.sh` 为类 Unix 兼容封装）。
- `tests/`：Node 内置测试（`*.test.js`），覆盖 CLI、适配器、生成器、清理与健康检查。
- `docs/` 与 `reference/`：规范文档与参考资料。
- `web/`：Next.js 文档站（`web/src` 源码，`web/public` 静态资源）。
- `.agents/`：项目模板源（Canonical）；CLI 安装时生成目标项目兼容投影（`.agent/.gemini`）。

## 构建、测试与开发命令
- 根项目依赖安装：`bun install`（如需兼容可用 `npm install`）。
- 运行测试：`bun run test`（等价 `node --test tests`）。
- 健康复检：`bun run health-check`（测试 + CLI 核心链路 + 清理预检）。
- 清理产物：`bun run clean`，预览清理：`bun run clean:dry-run`。
- 本地调试 CLI：`node bin/ag-kit.js --version` 或 `node bin/ag-kit.js init --path ./tmp-workspace`。
- `web/` 子项目：`cd web && bun install && bun run dev`，发布构建 `bun run build`，代码检查 `bun run lint`。

## 代码风格与命名约定
- 遵循 `.editorconfig`：默认 4 空格缩进，JSON/YAML 2 空格，LF，UTF-8。
- 根目录 Node 代码以 CommonJS 为主（`require/module.exports`）；保持与现有文件风格一致。
- 文件命名使用 kebab-case（如 `managed-block.js`、`health-check-script.test.js`）。
- 变更 `web/` 代码时，提交前至少执行一次 `cd web && bun run lint`。

## 测试规范
- 使用 Node 内置 `node:test` + `node:assert`，测试文件放在 `tests/` 且命名为 `*.test.js`。
- 新功能或修复必须补充对应回归测试，尤其是 CLI 参数、索引写入、目标目录生成等高风险路径。
- 当前仓库未设置硬性覆盖率阈值；PR 需说明“新增/更新了哪些测试”与“本地执行结果”。

## 提交与 PR 规范
- 建议采用 Conventional Commits：`type(scope): summary`，例如 `feat(cli): ...`、`fix(test): ...`、`docs(readme): ...`。
- 单次提交尽量聚焦单一主题（功能、修复、文档分离）。
- PR 需包含：变更背景、核心改动、验证命令与结果；涉及 CLI 行为变化时补充示例命令，涉及 `web/` UI 变更时附截图。

## 配置与安全提示
- 使用 `AG_KIT_INDEX_PATH` 可重定向全局工作区索引，便于测试隔离。
- 测试中如需跳过上游检查，可使用 `AG_KIT_SKIP_UPSTREAM_CHECK=1`。
- 不要提交临时或构建产物（如 `web/.next`、`web/node_modules`、`.temp_ag_kit`）；可先执行 `bun run clean:dry-run` 自检。
