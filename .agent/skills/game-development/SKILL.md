---
name: game-development
description: Game development orchestrator. Routes to platform-specific skills based on project needs.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 游戏开发 (Game Development)

> **编排器技能 (Orchestrator skill)**：提供核心原则并路由到专门的子技能。

---

## 何时使用此技能

你正在进行游戏开发项目。此技能教授游戏开发原则，并根据上下文指导你使用正确的子技能。

---

## 子技能路由

### 平台选择

| 如果游戏目标是...         | 使用子技能                      |
| ------------------------- | ------------------------------- |
| Web 浏览器 (HTML5, WebGL) | `game-development/web-games`    |
| 移动端 (iOS, Android)     | `game-development/mobile-games` |
| PC (Steam, Desktop)       | `game-development/pc-games`     |
| VR/AR 头显                | `game-development/vr-ar`        |

### 维度选择

| 如果游戏是...       | 使用子技能                  |
| ------------------- | --------------------------- |
| 2D (精灵, Tilemaps) | `game-development/2d-games` |
| 3D (Mesh, Shaders)  | `game-development/3d-games` |

### 专业领域

| 如果你需要...              | 使用子技能                     |
| -------------------------- | ------------------------------ |
| GDD, 平衡, 玩家心理        | `game-development/game-design` |
| 多人游戏, 网络             | `game-development/multiplayer` |
| 视觉风格, 资产管线, 动画   | `game-development/game-art`    |
| 音效设计, 音乐, 自适应音频 | `game-development/game-audio`  |

---

## 核心原则 (所有平台)

### 1. 游戏循环 (The Game Loop)

每个游戏，无论平台如何，都遵循此模式：

```
INPUT (输入)  → 读取玩家动作
UPDATE (更新) → 处理游戏逻辑 (固定时间步长)
RENDER (渲染) → 绘制帧 (插值)
```

**固定时间步长规则 (Fixed Timestep Rule):**

- 物理/逻辑：固定速率 (例如 50Hz)
- 渲染：尽可能快
- 在状态之间插值以获得平滑的视觉效果

---

### 2. 模式选择矩阵

| 模式                              | 何时使用         | 示例             |
| --------------------------------- | ---------------- | ---------------- |
| **State Machine (状态机)**        | 3-5 个离散状态   | 玩家：空闲→走→跳 |
| **Object Pooling (对象池)**       | 频繁生成/销毁    | 子弹，粒子       |
| **Observer/Events (观察者/事件)** | 跨系统通信       | 生命值→UI 更新   |
| **ECS (实体组件系统)**            | 数千个相似实体   | RTS 单位，粒子   |
| **Command (命令)**                | 撤销，重放，网络 | 输入录制         |
| **Behavior Tree (行为树)**        | 复杂 AI 决策     | 敌人 AI          |

**决策规则**: 从状态机开始。仅在性能需要时添加 ECS。

---

### 3. 输入抽象

将输入抽象为动作 (ACTIONS)，而不是原始按键：

```
"jump" (跳跃)  → Space, 手柄 A, 触摸点击
"move" (移动)  → WASD, 左摇杆, 虚拟摇杆
```

**为什么**: 启用多平台、可重新绑定的控件。

---

### 4. 性能预算 (60 FPS = 16.67ms)

| 系统     | 预算   |
| -------- | ------ |
| 输入     | 1ms    |
| 物理     | 3ms    |
| AI       | 2ms    |
| 游戏逻辑 | 4ms    |
| 渲染     | 5ms    |
| 缓冲     | 1.67ms |

**优化优先级:**

1. 算法 (O(n²) → O(n log n))
2. Batching (批处理) (减少绘制调用)
3. Pooling (池化) (避免 GC 峰值)
4. LOD (多细节层次) (按距离细节)
5. Culling (剔除) (跳过不可见)

---

### 5. 按复杂度选择 AI

| AI 类型                     | 复杂度 | 何时使用               |
| --------------------------- | ------ | ---------------------- |
| **FSM (有限状态机)**        | 简单   | 3-5 个状态，可预测行为 |
| **Behavior Tree (行为树)**  | 中等   | 模块化，设计师友好     |
| **GOAP (目标导向行动计划)** | 高     | 涌现式，基于计划       |
| **Utility AI (效用 AI)**    | 高     | 基于评分的决策         |

---

### 6. 碰撞策略

| 类型                        | 最适合             |
| --------------------------- | ------------------ |
| **AABB**                    | 矩形，快速检查     |
| **Circle (圆形)**           | 圆形物体，廉价     |
| **Spatial Hash (空间哈希)** | 许多相似大小的物体 |
| **Quadtree (四叉树)**       | 大世界，不同大小   |

---

## 反模式 (通用)

| 不要               | 要                      |
| ------------------ | ----------------------- |
| 每帧更新所有内容   | 使用事件，脏标记        |
| 在热循环中创建对象 | Object pooling (对象池) |
| 什么都不缓存       | 缓存引用                |
| 不分析就优化       | 先分析 (Profile first)  |
| 混合输入与逻辑     | 抽象输入层              |

---

## 路由示例

### 示例 1: "想要制作一个基于浏览器的 2D 平台游戏"

→ 从 `game-development/web-games` 开始进行框架选择
→ 然后 `game-development/2d-games` 用于精灵/瓦片地图模式
→ 参考 `game-development/game-design` 进行关卡设计

### 示例 2: "iOS 和 Android 的移动益智游戏"

→ 从 `game-development/mobile-games` 开始用于触摸输入和商店
→ 使用 `game-development/game-design` 进行谜题平衡

### 示例 3: "多人 VR 射击游戏"

→ `game-development/vr-ar` 用于舒适度和沉浸感
→ `game-development/3d-games` 用于渲染
→ `game-development/multiplayer` 用于网络

---

> **记住：** 伟大的游戏源于迭代，而非完美。快速原型，然后打磨。
