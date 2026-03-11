---
name: chrome-extension
description: Chrome Extension template（扩展模板）原则。Manifest V3（清单规范）、React、TypeScript。
---

# Chrome Extension Template（扩展模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Manifest（清单） | V3 |
| UI（界面） | React 18 |
| Language（语言） | TypeScript |
| Styling（样式） | Tailwind CSS |
| Bundler（打包器） | Vite |
| Storage（存储） | Chrome Storage API（存储 API） |

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
│       ├── storage.ts   # Chrome storage helpers（Chrome 存储助手）
│       └── messaging.ts # Message passing（消息传递）
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## Manifest V3 Concepts（Manifest V3 概念）

| Component（组件） | Purpose（作用） |
| --- | --- |
| Service Worker（后台） | Background processing（后台处理） |
| Content Scripts（内容脚本） | Page injection（页面注入） |
| Popup（弹窗） | User interface（用户界面） |
| Options Page（选项页） | Settings（设置） |

---

## Permissions（权限）

| Permission（权限） | Use（用途） |
| --- | --- |
| storage | 保存用户数据 |
| activeTab | 当前标签页访问 |
| scripting | 注入脚本 |
| host_permissions | 站点访问 |

---

## Setup Steps（设置步骤）

1. `npm create vite {{name}} -- --template react-ts`
2. 添加 Chrome 类型：`npm install -D @types/chrome`
3. 配置 Vite 多入口
4. 创建 `manifest.json`
5. `npm run dev`（watch mode，监视模式）
6. 在 Chrome 中加载：`chrome://extensions` → Load unpacked（加载已解压扩展）

---

## Development Tips（开发提示）

| Task（任务） | Method（方法） |
| --- | --- |
| 调试 Popup（弹窗） | 右键图标 → Inspect（检查） |
| 调试 Background（后台） | Extensions page（扩展管理页） → Service worker（后台） |
| 调试 Content（内容脚本） | 页面 DevTools（开发者工具）控制台 |
| Hot Reload（热更新） | `npm run dev`（watch mode） |

---

## Best Practices（最佳实践）

- 使用 type-safe messaging（类型安全的消息传递）
- 将 Chrome APIs 包装成 Promise（承诺）
- 最小化权限
- 优雅处理离线
