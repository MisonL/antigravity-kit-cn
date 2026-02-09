---
name: electron-desktop
description: Electron 桌面应用模板原则。跨平台、React、TypeScript。
---

# Electron Desktop App Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Framework（框架） | Electron 28+ |
| UI | React 18 |
| Language（语言） | TypeScript |
| Styling（样式） | Tailwind CSS |
| Bundler（打包器） | Vite + electron-builder |
| IPC | Type-safe communication（类型安全通信） |

---

## Directory Structure（目录结构）

```
project-name/
├── electron/
│   ├── main.ts          # Main process（主进程）
│   ├── preload.ts       # Preload script（预加载脚本）
│   └── ipc/             # IPC handlers（通信处理）
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── TitleBar.tsx # Custom title bar（自定义标题栏）
│   │   └── ...
│   └── hooks/
├── public/
└── package.json
```

---

## Process Model（进程模型）

| Process | Role |
| --- | --- |
| Main（主进程） | Node.js, 系统访问 |
| Renderer（渲染进程） | Chromium, React UI |
| Preload（预加载） | Bridge, context isolation（桥接与上下文隔离） |

---

## Key Concepts（关键概念）

| Concept | Purpose |
| --- | --- |
| contextBridge | Safe API exposure（安全 API 暴露） |
| ipcMain/ipcRenderer | Process communication（进程通信） |
| nodeIntegration: false | Security（安全） |
| contextIsolation: true | Security（安全） |

---

## Setup Steps（设置步骤）

1. `npm create vite {{name}} -- --template react-ts`
2. Install（安装）: `npm install -D electron electron-builder vite-plugin-electron`
3. 创建 `electron/` 目录
4. 配置主进程
5. `npm run electron:dev`

---

## Build Targets（构建目标）

| Platform | Output |
| --- | --- |
| Windows | NSIS, Portable |
| macOS | DMG, ZIP |
| Linux | AppImage, DEB |

---

## Best Practices（最佳实践）

- 使用预加载脚本进行主/渲染进程桥接
- 类型安全 IPC（使用类型化处理程序）
- 自定义标题栏以获得原生感
- 处理窗口状态（最大化/最小化）
- 使用 electron-updater 自动更新
