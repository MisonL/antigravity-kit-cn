# 移动端调试指南 (Mobile Debugging Guide)

> **停止使用 console.log() 调试！**
> 移动应用拥有复杂的原生层。文本日志是不够的。
> **本文档教授有效的移动端调试策略。**

---

## 🧠 移动端调试思维 (Mobile Debugging Mindset)

```
Web 调试:           移动端调试:
┌──────────────┐    ┌──────────────┐
│  浏览器      │    │  JS Bridge   │
│  DevTools    │    │  原生 UI     │
│  网络面板    │    │  GPU/内存    │
└──────────────┘    │  线程        │
                    └──────────────┘
```

**关键区别:**

1.  **原生层 (Native Layer):** 如果 JS 代码没问题但应用崩溃，很可能是原生代码 (Java/Obj-C) 的问题。
2.  **部署 (Deployment):** 你不能简单地"刷新"。状态可能会丢失或卡住。
3.  **网络 (Network):** SSL Pinning 和代理设置更难处理。
4.  **设备日志 (Device Logs):** `adb logcat` 和 `Console.app` 是你的真理来源。

---

## 🚫 AI 调试反模式

| ❌ 默认做法             | ✅ 移动端正确做法                   |
| ----------------------- | ----------------------------------- |
| "添加 console.logs"     | 使用 Flipper / Reactotron           |
| "检查网络面板"          | 使用 Charles Proxy / Proxyman       |
| "在模拟器上可以运行"    | **在真机上测试** (硬件特定 Bug)     |
| "重新安装 node_modules" | **清理原生构建** (Gradle/Pod cache) |
| 忽略原生日志            | 阅读 `logcat` / Xcode logs          |

---

## 1. 工具集 (The Toolset)

### ⚡ React Native & Expo

| 工具           | 目的           | 最适合场景     |
| -------------- | -------------- | -------------- |
| **Reactotron** | 状态/API/Redux | JS 端调试      |
| **Flipper**    | 布局/网络/DB   | 原生 + JS 桥接 |
| **Expo Tools** | 元素检查器     | 快速 UI 检查   |

### 🛠️ 原生层 (The Deep Dive)

| 工具             | 平台    | 命令           | 为何使用?      |
| ---------------- | ------- | -------------- | -------------- |
| **Logcat**       | Android | `adb logcat`   | 原生崩溃, ANRs |
| **Console**      | iOS     | via Xcode      | 原生异常, 内存 |
| **Layout Insp.** | Android | Android Studio | UI 层级 Bug    |
| **View Insp.**   | iOS     | Xcode          | UI 层级 Bug    |

---

## 2. 常见调试工作流

### 🕵️ "应用刚刚崩溃了" (红屏 vs 闪退到桌面)

**场景 A: 红屏 (Red Screen - JS 错误)**

- **原因:** Undefined is not an object, import error.
- **修复:** 阅读屏幕上的堆栈跟踪。通常很清晰。

**场景 B: 闪退到桌面 (Native Crash)**

- **原因:** 原生模块失败, OOM (内存溢出), 权限使用未声明。
- **工具:**
    - **Android:** `adb logcat *:E` (过滤错误)
    - **iOS:** 打开 Xcode → Window → Devices → View Device Logs

> **💡 专家提示:** 如果应用启动即崩溃，几乎 100% 是原生配置问题 (Info.plist, AndroidManifest.xml)。

### 🌐 "API 请求失败" (网络)

**Web:** 打开 Chrome DevTools → Network.
**Mobile:** _你通常无法直接看到。_

**方案 1: Reactotron/Flipper**

- 在监控应用中查看网络请求。

**方案 2: Proxy (Charles/Proxyman)**

- **困难但强大。** 这里的甚至可以看到原生 SDK 的所有流量。
- 需要在设备上安装 SSL 证书。

### 🐢 "UI 卡顿" (性能)

**不要猜。** 测量它。

- **React Native:** Performance Monitor (摇晃菜单).
- **Android:** 开发者选项中的 "GPU 呈现模式分析" (Profile GPU Rendering).
- **问题:**
    - **JS FPS 下降:** JavaScript 线程中计算过重。
    - **UI FPS 下降:** 视图过多, 层级过于复杂, 图片过大。

---

## 3. 平台特定噩梦

### Android

- **Gradle Sync Fail:** 通常是 Java 版本不匹配或重复的类。
- **Emulator Network:** 模拟器的 `localhost` 是 `10.0.2.2`, **不是** `127.0.0.1`。
- **Cached Builds:** `./gradlew clean` 是你最好的朋友。

### iOS

- **Pod Issues:** `pod deintegrate && pod install`。
- **Signing Errors:** 检查 Team ID 和 Bundle Identifier。
- **Cache:** Xcode → Product → Clean Build Folder。

---

## 📝 调试检查清单

- [ ] **是 JS 崩溃还是原生崩溃?** (红屏还是桌面?)
- [ ] **你清理构建了吗?** (原生缓存非常顽固)
- [ ] **你在真机上吗?** (模拟器会隐藏并发 Bug)
- [ ] **你检查原生日志了吗?** (不仅仅是终端输出)

> **记住:** 如果 JavaScript 看起来完美但应用失败，请仔细检查原生端。
