# 移动端调试指南 (Mobile Debugging Guide)

> **停止只靠 console.log() 调试！**  
> 移动应用存在复杂原生层，文本日志远远不够。  
> **本文件提供高效移动端调试策略。**

---

## 🧠 移动端调试思维 (MOBILE DEBUGGING MINDSET)

```
Web Debugging:      Mobile Debugging:
┌──────────────┐    ┌──────────────┐
│  Browser     │    │  JS Bridge   │
│  DevTools    │    │  Native UI   │
│  Network Tab │    │  GPU/Memory  │
└──────────────┘    │  Threads     │
                    └──────────────┘
```

**关键差异：**
1. **原生层问题：** JS 看起来正常但应用崩溃，通常是原生层（Java/Obj-C）问题。
2. **部署特性：** 不能像 Web 一样随意刷新，状态可能丢失或卡死。
3. **网络调试：** SSL Pinning、代理配置更复杂。
4. **设备日志：** `adb logcat` 与 `Console.app` 才是最终真相。

---

## 🚫 AI 调试反模式 (AI DEBUGGING ANTI-PATTERNS)

| ❌ Default | ✅ Mobile-Correct |
|------------|-------------------|
| "Add console.logs" | 使用 Flipper / Reactotron |
| "Check network tab" | 使用 Charles Proxy / Proxyman |
| "It works on simulator" | **必须真机测试**（硬件相关 bug） |
| "Reinstall node_modules" | **清理原生构建缓存**（Gradle/Pod） |
| Ignored native logs | 读取 `logcat` / Xcode logs |

---

## 1. 工具集 (The Toolset)

### ⚡ React Native & Expo

| Tool | Purpose | Best For |
|------|---------|----------|
| **Reactotron** | 状态/API/Redux 观测 | JS 侧调试 |
| **Flipper** | 布局/网络/数据库 | 原生 + JS Bridge 调试 |
| **Expo Tools** | 元素检查器 | 快速 UI 核查 |

### 🛠️ 原生层（深度排查）

| Tool | Platform | Command | Why Use? |
|------|----------|---------|----------|
| **Logcat** | Android | `adb logcat` | 原生崩溃、ANR |
| **Console** | iOS | via Xcode | 原生异常、内存问题 |
| **Layout Insp.** | Android | Android Studio | UI 层级错误 |
| **View Insp.** | iOS | Xcode | UI 层级错误 |

---

## 2. 常见调试工作流 (Common Debugging Workflows)

### 🕵️ “应用崩了” (Red Screen vs Crash to Home)

**场景 A：Red Screen（JS 错误）**
- **原因：** `undefined is not an object`、导入错误等。
- **处理：** 直接看屏幕堆栈，通常定位清晰。

**场景 B：闪退回桌面（原生崩溃）**
- **原因：** 原生模块失败、内存 OOM、权限声明缺失等。
- **工具：**
    - **Android:** `adb logcat *:E`（只看 Error）
    - **iOS:** Xcode → Window → Devices → View Device Logs

> **💡 提示：** 应用启动即崩，通常 100% 与原生配置有关（Info.plist、AndroidManifest.xml）。

### 🌐 “API 请求失败” (Network)

**Web：** 打开 Chrome DevTools → Network。  
**Mobile：** 通常没这么直接。

**方案 1：Reactotron / Flipper**
- 在监控面板中查看网络请求。

**方案 2：代理工具（Charles/Proxyman）**
- **复杂但强大。** 可观察原生 SDK 流量。
- 需要在设备安装 SSL 证书。

### 🐢 “UI 很卡” (Performance)

**不要猜，要测。**
- **React Native：** Performance Monitor（摇一摇菜单）。
- **Android：** 开发者选项中的 “Profile GPU Rendering”。
- **常见问题：**
    - **JS FPS 下降：** JS 线程计算过重。
    - **UI FPS 下降：** 视图层级过深、图片过重、布局复杂。

---

## 3. 平台特有噩梦 (Platform-Specific Nightmares)

### Android
- **Gradle Sync 失败：** 多见于 Java 版本冲突或重复类。
- **模拟器网络：** 模拟器的 `localhost` 是 `10.0.2.2`，不是 `127.0.0.1`。
- **构建缓存：** `./gradlew clean` 往往能救命。

### iOS
- **Pod 问题：** `pod deintegrate && pod install`。
- **签名错误：** 检查 Team ID 与 Bundle Identifier。
- **缓存清理：** Xcode → Product → Clean Build Folder。

---

## 📝 调试检查清单 (DEBUGGING CHECKLIST)

- [ ] **这是 JS 崩溃还是原生崩溃？**（红屏还是退桌面）
- [ ] **你清理过构建缓存吗？**（原生缓存很“顽固”）
- [ ] **你在真机上测过吗？**（模拟器会掩盖并发问题）
- [ ] **你看过原生日志吗？**（不仅是终端输出）

> **牢记：** JavaScript 看起来没问题但应用失败时，请优先排查原生层。
