---
name: electron-desktop
description: Electron desktop app template principles（桌面应用模板原则）。Cross-platform（跨平台）、React、TypeScript。
---

# Electron Desktop App Template（桌面应用模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Framework（框架） | Electron 28+ |
| UI | React 18 |
| Language（语言） | TypeScript |
| Styling（样式） | Tailwind CSS |
| Bundler（打包器） | Vite + electron-builder |
| IPC（进程间通信） | Type-safe communication（类型安全通信） |

---

## Directory Structure（目录结构）

```
project-name/
├── electron/
│   ├── main.ts          # Main process（主进程）
│   ├── preload.ts       # Preload script（预加载脚本）
│   └── ipc/             # IPC handlers（IPC 处理）
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

| Process（进程） | Role（角色） |
| --- | --- |
| Main（主进程） | Node.js, system access（系统访问） |
| Renderer（渲染进程） | Chromium, React UI（界面） |
| Preload（预加载） | Bridge（桥接）, context isolation（上下文隔离） |

---

## Key Concepts（关键概念）

| Concept（概念） | Purpose（用途） |
| --- | --- |
| contextBridge | Safe API exposure（安全 API 暴露） |
| ipcMain/ipcRenderer | Process communication（进程通信） |
| nodeIntegration: false | Security（安全） |
| contextIsolation: true | Security（安全） |

---

## Setup Steps（设置步骤）

1. `npm create vite {{name}} -- --template react-ts`
2. Install（安装）：`npm install -D electron electron-builder vite-plugin-electron`
3. Create `electron/` directory（创建目录）
4. Configure main process（配置主进程）
5. `npm run electron:dev`

---

## Build Targets（构建目标）

| Platform（平台） | Output（输出） |
| --- | --- |
| Windows | NSIS, Portable |
| macOS | DMG, ZIP |
| Linux | AppImage, DEB |

---

## Best Practices（最佳实践）

- Use preload script for main/renderer bridge（主/渲染进程桥接）
- Type-safe IPC with typed handlers（类型安全 IPC）
- Custom title bar for native feel（原生感）
- Handle window state（maximize/minimize）
- Auto-updates with electron-updater（自动更新）
