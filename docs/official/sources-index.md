# 官方来源证据索引

> 用途：为 `docs/official` 中文整理文档提供可机器校验的最小证据层（来源 URL + 拉取时间 + 快照哈希）。

## Antigravity

| 本地文件 | 来源 URL | 拉取时间 (UTC) | SHA256 |
| --- | --- | --- | --- |
| `docs/official/antigravity/agent-modes-settings.md` | `https://antigravity.google/assets/docs/agent/agent-modes-settings.md` | `2026-02-12T12:56:22Z` | `614174f8c730a0db8b290dede16b294a9535cef7b9ddca9c108dc2ef583b2919` |
| `docs/official/antigravity/rules-workflows.md` | `https://antigravity.google/assets/docs/agent/rules-workflows.md` | `2026-02-12T12:56:22Z` | `063b2e9c86555f0103d0fafee5f71caf330cd95fb25257841efe32d36ee9667b` |
| `docs/official/antigravity/skills.md` | `https://antigravity.google/assets/docs/agent/skills.md` | `2026-02-12T12:56:22Z` | `2176fc1968c2188daed75b064f8771e4516b4b462cc5c1b98553e05cfab055fa` |

## Codex

| 本地文件 | 来源 URL | 拉取时间 (UTC) | SHA256 |
| --- | --- | --- | --- |
| `docs/official/codex/config-basic.md` | `https://developers.openai.com/codex/config-basic.md` | `2026-02-12T12:56:22Z` | `9a270e83da4e3467c117166cc69684cace72037c97c96f0f05f212d28ccf0809` |
| `docs/official/codex/config-advanced.md` | `https://developers.openai.com/codex/config-advanced.md` | `2026-02-12T12:56:22Z` | `ed1ebb5ad918fd9043ebeb176d1f29654d76547c4ae896eb4718db320f98a1af` |
| `docs/official/codex/config-reference.md` | `https://developers.openai.com/codex/config-reference.md` | `2026-02-12T12:56:22Z` | `e23bc1439e3f4cb907d165e6980ece03070d69484f74c4cb3dd95068c519a91c` |
| `docs/official/codex/config-sample.md` | `https://developers.openai.com/codex/config-sample.md` | `2026-02-12T12:56:22Z` | `80af7755383b5f3956b3288435bca81ef02062f6dd988aa6205fe1ae95a3660b` |
| `docs/official/codex/rules.md` | `https://developers.openai.com/codex/rules.md` | `2026-02-12T12:56:22Z` | `c9ca3c8bf4fa68ccf85c831388ea360b6e2108bcfcfcc0b7bd7e2ab5df173af1` |
| `docs/official/codex/agents-md.md` | `https://developers.openai.com/codex/guides/agents-md.md` | `2026-02-12T12:56:22Z` | `ed8fd0bdb19826d907424d313d38b37fe9a60c78b96692f409e1f15373817aac` |
| `docs/official/codex/mcp.md` | `https://developers.openai.com/codex/mcp.md` | `2026-02-12T12:56:22Z` | `bb7d0e864ed572a11067505f9cd673972610d2d53997db3647b309da00763fa2` |
| `docs/official/codex/skills.md` | `https://developers.openai.com/codex/skills.md` | `2026-02-12T12:56:22Z` | `8ca8093fa07e50d302a76a6693789995bb733208fd3e89022e2ebd2328b3b64c` |

## 校验方法

```bash
shasum -a 256 docs/official/codex/skills.md
```

将输出哈希与本表对比即可。
