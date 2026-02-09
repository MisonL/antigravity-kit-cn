---
name: react-native-app
description: React Native 移动应用模板原则。Expo、TypeScript、导航。
---

# React Native 应用模板（2026 版）

现代移动应用模板，针对新架构（New Architecture）与 React 19 优化。

## 技术栈

| 组件 | 技术 | 版本/说明 |
| --- | --- | --- |
| 核心 | React Native + Expo | SDK 52+（启用新架构） |
| 语言 | TypeScript | v5+（Strict Mode，严格模式） |
| UI 逻辑 | React | v19（React Compiler（编译器），自动记忆化） |
| 导航 | Expo Router | v4+（基于文件（File-based）、通用链接（Universal Links）） |
| 样式 | NativeWind | v4.0（Tailwind v4，CSS-first 配置） |
| 状态 | Zustand + React Query | v5+（异步状态管理） |
| 存储 | Expo SecureStore | 加密本地存储 |

---

## 目录结构

Expo Router 与 NativeWind v4 的标准化结构。

```
project-name/
├── app/                 # Expo Router（基于文件的路由）
│   ├── _layout.tsx      # 根布局（Stack/Tabs 配置）
│   ├── index.tsx        # 主屏幕
│   ├── (tabs)/          # 标签栏路由组
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   └── profile.tsx
│   ├── +not-found.tsx   # 404 页面
│   └── [id].tsx         # 动态路由（类型化）
├── components/
│   ├── ui/              # 原语组件（Button, Text）
│   └── features/        # 复杂组件
├── hooks/               # 自定义 Hooks
├── lib/
│   ├── api.ts           # Axios/Fetch 客户端
│   └── storage.ts       # SecureStore 封装
├── store/               # Zustand 状态仓库
├── constants/           # 颜色、主题配置
├── assets/              # 字体、图片
├── global.css           # NativeWind v4 入口点
├── tailwind.config.ts   # Tailwind 配置（如需自定义主题）
├── babel.config.js      # NativeWind Babel 插件
└── app.json             # Expo 配置
```

---

## 导航模式（Expo Router）

| 模式 | 描述 | 实现 |
| --- | --- | --- |
| Stack（堆栈） | 层级导航（Push/Pop） | `<Stack />` 在 `_layout.tsx` |
| Tabs（标签） | 底部导航栏 | `<Tabs />` 在 `(tabs)/_layout.tsx` |
| Drawer（抽屉） | 侧滑菜单 | `expo-router/drawer` |
| Modals（模态） | 覆盖屏幕 | Stack 页面中的 `presentation: 'modal'` |

---

## 关键依赖与用途

| 依赖 | 用途 |
| --- | --- |
| expo-router | 基于文件的路由（类似 Next.js） |
| nativewind | 在 React Native 中使用 Tailwind CSS 类 |
| react-native-reanimated | 平滑动画（在 UI 线程上运行） |
| @tanstack/react-query | 服务端状态管理、缓存、预取 |
| zustand | 全局状态管理（比 Redux 更轻） |
| expo-image | 优化图像渲染以提升性能 |

---

## 设置步骤（2026 标准）

1. 初始化项目：
   ```bash
   npx create-expo-app@latest my-app --template default
   cd my-app
   ```

2. 安装核心依赖：
   ```bash
   npx expo install expo-router react-native-safe-area-context react-native-screens expo-link expo-constants expo-status-bar
   ```

3. 安装 NativeWind v4：
   ```bash
   npm install nativewind tailwindcss react-native-reanimated
   ```

4. 配置 NativeWind（Babel 与 CSS）：
   - 在 `babel.config.js` 添加插件：`plugins: ["nativewind/babel"]`。
   - 创建 `global.css` 并包含：`@import "tailwindcss";`。
   - 在 `app/_layout.tsx` 中导入 `global.css`。

5. 运行项目：
   ```bash
   npx expo start -c
   # 按 'i' 启动 iOS 模拟器或按 'a' 启动 Android 模拟器
   ```

---

## 最佳实践（更新）

- **新架构（New Architecture）**：确保 `app.json` 中 `newArchEnabled: true`，以利用 TurboModules 与 Fabric Renderer。
- **类型化路由（Typed Routes）**：使用 Expo Router 的 “Typed Routes” 特性实现类型安全路由（例如 `router.push('/path')`）。
- **React 19**：借助 React Compiler（编译器，如已启用）减少 `useMemo` 或 `useCallback` 的使用。
- **组件**：使用 NativeWind `className` 构建 UI 原语（Box, Text），提高可复用性。
- **资产**：使用 `expo-image` 代替默认 `<Image />`，提升缓存与性能。
- **API**：使用 TanStack Query 包装 API 调用，避免在 `useEffect` 中直接调用。
