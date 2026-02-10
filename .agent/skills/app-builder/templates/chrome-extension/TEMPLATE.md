---
name: chrome-extension
description: Chrome 扩展模板原则。Manifest V3、React、TypeScript。
---

# Chrome 扩展模板

## 技术栈

| 组件 | 技术 |
| --- | --- |
| 清单 | V3 |
| UI | React 18 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 打包器 | Vite |
| 存储 | Chrome Storage API（存储 API） |

---

## 目录结构

```
project-name/
├── src/
│   ├── popup/           # 扩展弹窗
│   ├── options/         # 选项页
│   ├── background/      # Service Worker（后台）
│   ├── content/         # Content Scripts（内容脚本）
│   ├── components/
│   ├── hooks/
│   └── lib/
│       ├── storage.ts   # Chrome 存储助手
│       └── messaging.ts # 消息传递
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## Manifest V3 概念

| 组件 | 作用 |
| --- | --- |
| Service Worker（后台） | 后台处理 |
| Content Scripts（内容脚本） | 页面注入 |
| Popup（弹窗） | 用户界面 |
| Options Page（选项页） | 设置 |

---

## 权限

| 权限 | 用途 |
| --- | --- |
| storage | 保存用户数据 |
| activeTab | 当前标签页访问 |
| scripting | 注入脚本 |
| host_permissions | 站点访问 |

---

## 设置步骤

1. `npm create vite {{name}} -- --template react-ts`
2. 添加 Chrome 类型：`npm install -D @types/chrome`
3. 配置 Vite 多入口
4. 创建 `manifest.json`
5. `npm run dev`（watch 模式）
6. 在 Chrome 中加载：`chrome://extensions` → Load unpacked（加载已解压扩展）

---

## 开发提示

| 任务 | 方法 |
| --- | --- |
| 调试 Popup | 右键图标 → Inspect（检查） |
| 调试 Background（后台） | 扩展管理页面（Extensions） → Service Worker |
| 调试 Content | 页面开发者工具（DevTools）控制台 |
| 热更新 | `npm run dev`（watch 模式） |

---

## 最佳实践

- 使用类型安全的消息传递
- 将 Chrome API 包装成 Promise（承诺）
- 最小化权限
- 优雅处理离线
