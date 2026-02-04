---
name: chrome-extension
description: Chrome 扩展模版原则。Manifest V3, React, TypeScript。
---

# Chrome 扩展模版

## 技术栈

| 组件     | 技术               |
| -------- | ------------------ |
| Manifest | V3                 |
| UI       | React 18           |
| 语言     | TypeScript         |
| 样式     | Tailwind CSS       |
| 打包器   | Vite               |
| 存储     | Chrome Storage API |

---

## 目录结构

```
project-name/
├── src/
│   ├── popup/           # 扩充弹出窗口
│   ├── options/         # 选项页面
│   ├── background/      # Service worker
│   ├── content/         # 内容脚本
│   ├── components/
│   ├── hooks/
│   └── lib/
│       ├── storage.ts   # Chrome storage 助手
│       └── messaging.ts # 消息传递
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## Manifest V3 概念

| 组件                       | 目的     |
| -------------------------- | -------- |
| Service Worker             | 后台处理 |
| Content Scripts (内容脚本) | 页面注入 |
| Popup (弹窗)               | 用户界面 |
| Options Page (选项页)      | 设置     |

---

## 权限

| 权限             | 用途           |
| ---------------- | -------------- |
| storage          | 保存用户数据   |
| activeTab        | 当前标签页访问 |
| scripting        | 注入脚本       |
| host_permissions | 站点访问       |

---

## 设置步骤

1. `npm create vite {{name}} -- --template react-ts`
2. 添加 Chrome 类型: `npm install -D @types/chrome`
3. 配置 Vite 用于多入口
4. 创建 manifest.json
5. `npm run dev` (监视模式)
6. 在 Chrome 中加载: `chrome://extensions` → 加载已解压的扩展程序

---

## 开发提示

| 任务            | 方法                      |
| --------------- | ------------------------- |
| 调试 Popup      | 右键图标 → 检查           |
| 调试 Background | 扩展页面 → Service worker |
| 调试 Content    | 页面上的 DevTools 控制台  |
| 热重载          | 带监视的 `npm run dev`    |

---

## 最佳实践

- 使用类型安全的消息传递
- 将 Chrome API 包装在 Promise 中
- 最小化权限
- 优雅处理离线
