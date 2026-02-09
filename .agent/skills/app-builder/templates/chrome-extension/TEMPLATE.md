---
name: chrome-extension
description: Chrome 扩展模板原则。Manifest V3、React、TypeScript。
---

# Chrome Extension Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Manifest | V3 |
| UI | React 18 |
| Language（语言） | TypeScript |
| Styling（样式） | Tailwind CSS |
| Bundler（打包器） | Vite |
| Storage（存储） | Chrome Storage API |

---

## Directory Structure（目录结构）

```
project-name/
├── src/
│   ├── popup/           # Extension popup（扩展弹窗）
│   ├── options/         # Options page（选项页）
│   ├── background/      # Service worker（后台）
│   ├── content/         # Content scripts（内容脚本）
│   ├── components/
│   ├── hooks/
│   └── lib/
│       ├── storage.ts   # Chrome storage helpers（存储助手）
│       └── messaging.ts # Message passing（消息传递）
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## Manifest V3 Concepts（概念）

| Component | Purpose |
| --- | --- |
| Service Worker | Background processing（后台处理） |
| Content Scripts | Page injection（页面注入） |
| Popup | User interface（用户界面） |
| Options Page | Settings（设置） |

---

## Permissions（权限）

| Permission | Use |
| --- | --- |
| storage | Save user data（保存用户数据） |
| activeTab | Current tab access（当前标签页访问） |
| scripting | Inject scripts（注入脚本） |
| host_permissions | Site access（站点访问） |

---

## Setup Steps（设置步骤）

1. `npm create vite {{name}} -- --template react-ts`
2. Add Chrome types（安装类型）: `npm install -D @types/chrome`
3. Configure Vite for multi-entry（多入口）
4. Create `manifest.json`
5. `npm run dev`（watch mode）
6. Load in Chrome: `chrome://extensions` → Load unpacked

---

## Development Tips（开发提示）

| Task | Method |
| --- | --- |
| Debug Popup | 右键图标 → Inspect |
| Debug Background | Extensions page → Service worker |
| Debug Content | DevTools console on page |
| Hot Reload | `npm run dev` with watch |

---

## Best Practices（最佳实践）

- 使用类型安全的消息传递
- 将 Chrome API 包装成 Promise
- 最小化权限
- 优雅处理离线
