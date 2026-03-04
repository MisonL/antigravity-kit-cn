# v3 Beta 升级手册（旧项目迁移）

本文用于把已安装旧版 Ag-Kit 的项目升级到 `3.0.0-beta.0`（统一 `.agents` 体系）。

## 1. 先决条件

1. 已安装 beta CLI：
```bash
npm i -g @mison/ag-kit-cn@beta
```
2. 在项目根目录执行。
3. 建议先提交一次本地改动或创建备份分支。

## 2. 推荐升级流程

```bash
ag-kit status
ag-kit update
ag-kit doctor --fix
ag-kit status
```

预期结果：
- 主目录为 `.agents/`
- 自动生成兼容投影：`.agent/`、`.gemini/`
- 根 `AGENTS.md`/`antigravity.rules` 托管区块已刷新
- 首轮执行 `init/update/update-all/doctor --fix` 时，会对索引中的受管 legacy 工作区做一次自动迁移
- `ag-kit status` 中 `Auto-Migration(v3)` 为 `done` 或 `pending`

## 3. 旧目录兼容规则

1. 旧 `.agent`：可迁移到 `.agents`，并重建投影。
2. 旧 `.codex`：
- 若可识别为本工具托管 legacy，会迁移并清理。
- 若为非托管目录，会保留不删除。
3. 旧 `.gemini`：
- `settings.json` 采用合并策略（保留用户字段）。
- `.gemini/agents` 默认追加 `ag-kit-*.md`，不清空用户文件。

## 4. 交互冲突处理

当检测到以下冲突时会询问：
1. 已有 `.agent`：备份替换 / 保留不动 / 改名失效后重建。
2. 已有 `.gemini/agents`：追加 / 备份替换 / 跳过写入。

CI 或自动化可用非交互：
```bash
ag-kit update --non-interactive
```

自动迁移一次性状态默认保存在：
```text
~/.ag-kit/migrations/v3.json
```
可通过 `AG_KIT_MIGRATION_STATE_PATH` 覆盖路径（便于 CI/测试隔离）。

## 5. 故障回滚

升级覆盖前的冲突文件会备份到：
```text
.agents-backup/<timestamp>/
```

回滚时可从备份目录恢复目标文件，再执行：
```bash
ag-kit doctor --fix
```

## 6. 常见问题

1. `status` 看到 `.codex`：
- 若提示“非托管 legacy”，属于预期，不会被自动删除。
2. `.gemini/settings.json` 格式异常：
- CLI 会先备份旧文件再写入最小可用配置。
3. 需要批量升级：
```bash
ag-kit update-all --targets full --prune-missing
```
