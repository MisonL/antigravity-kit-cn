---
name: electron-desktop
description: Electron 桌面应用模版原则。跨平台, React, TypeScript。
---

# Electron 桌面应用模版

## 技术栈

| 组件   | 技术                    |
| ------ | ----------------------- |
| 框架   | Electron 28+            |
| UI     | React 18                |
| 语言   | TypeScript              |
| 样式   | Tailwind CSS            |
| 打包器 | Vite + electron-builder |
| IPC    | 类型安全的通信          |

---

## 目录结构

```
project-name/
├── electron/
│   ├── main.ts          # 主进程
│   ├── preload.ts       # 预加载脚本
│   └── ipc/             # IPC 处理程序
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── TitleBar.tsx # 自定义标题栏
│   │   └── ...
│   └── hooks/
├── public/
└── package.json
```

---

## 进程模型

| 进程                | 角色               |
| ------------------- | ------------------ |
| Main (主进程)       | Node.js, 系统访问  |
| Renderer (渲染进程) | Chromium, React UI |
| Preload (预加载)    | 桥接, 上下文隔离   |

---

## 关键概念

| 概念                   | 目的            |
| ---------------------- | --------------- |
| contextBridge          | 安全的 API 暴露 |
| ipcMain/ipcRenderer    | 进程通信        |
| nodeIntegration: false | 安全性          |
| contextIsolation: true | 安全性          |

---

## 设置步骤

1. `npm create vite {{name}} -- --template react-ts`
2. 安装: `npm install -D electron electron-builder vite-plugin-electron`
3. 创建 electron/ 目录
4. 配置主进程
5. `npm run electron:dev`

---

## 构建目标

| 平台    | 输出           |
| ------- | -------------- |
| Windows | NSIS, Portable |
| macOS   | DMG, ZIP       |
| Linux   | AppImage, DEB  |

---

## 最佳实践

- 使用预加载脚本进行主/渲染进程桥接
- 具有类型化处理程序的类型安全 IPC
- 自定义标题栏以获得原生感觉
- 处理窗口状态 (最大化, 最小化)
- 使用 electron-updater 自动更新
