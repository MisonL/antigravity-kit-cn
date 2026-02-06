---
name: game-development
description: 游戏开发编排器。根据项目需求路由到特定平台的 Skills。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Game Development - 游戏开发

> **编排 Skill**，提供核心原则并路由到专业的子 Skill。

---

## 何时使用此 Skill

你正在进行游戏开发项目。本 Skill 教授游戏开发的 **原则** 并根据上下文将你引导至正确的子 Skill。

---

## 子 Skill 路由 (Sub-Skill Routing)

### 平台选择

| 如果游戏目标是...         | 使用子 Skill                    |
| ------------------------- | ------------------------------- |
| Web 浏览器 (HTML5, WebGL) | `game-development/web-games`    |
| 移动端 (iOS, Android)     | `game-development/mobile-games` |
| PC (Steam, Desktop)       | `game-development/pc-games`     |
| VR/AR 头显                | `game-development/vr-ar`        |

### 维度选择

| 如果游戏是...       | 使用子 Skill                |
| ------------------- | --------------------------- |
| 2D (精灵, 瓦片地图) | `game-development/2d-games` |
| 3D (网格, 着色器)   | `game-development/3d-games` |

### 专业领域

| 如果你需要...              | 使用子 Skill                   |
| -------------------------- | ------------------------------ |
| GDD, 数值平衡, 玩家心理    | `game-development/game-design` |
| 多人游戏, 网络             | `game-development/multiplayer` |
| 视觉风格, 资产管线, 动画   | `game-development/game-art`    |
| 音效设计, 音乐, 自适应音频 | `game-development/game-audio`  |

---

## 核心原则 (所有平台)

### 1. 游戏循环 (The Game Loop)

无论平台如何，每个游戏都遵循此模式：

```
INPUT  → 读取玩家操作
UPDATE → 处理游戏逻辑 (固定时间步长)
RENDER → 绘制帧 (插值)
```

**固定时间步长规则 (Fixed Timestep Rule):**

- 物理/逻辑：固定速率 (例如 50Hz)
- 渲染：尽可能快
- 在状态之间插值以获得平滑的视觉效果

---

### 2. 模式选择矩阵 (Pattern Selection Matrix)

| 模式                              | 何时使用         | 示例                 |
| --------------------------------- | ---------------- | -------------------- |
| **状态机 (State Machine)**        | 3-5 个离散状态   | 玩家：空闲→行走→跳跃 |
| **对象池 (Object Pooling)**       | 频繁生成/销毁    | 子弹，粒子           |
| **观察者/事件 (Observer/Events)** | 跨系统通信       | 生命值→UI 更新       |
| **ECS**                           | 数千个相似实体   | RTS 单位，粒子       |
| **命令 (Command)**                | 撤销，重播，网络 | 输入录制             |
| **行为树 (Behavior Tree)**        | 复杂 AI 决策     | 敌人 AI              |

**决策规则：** 从状态机开始。仅当性能需要时才添加 ECS。

---

### 3. 输入抽象 (Input Abstraction)

将输入抽象为 **动作 (ACTIONS)**，而不是原始按键：

```
"jump"  → Space, Gamepad A, Touch tap
"move"  → WASD, Left stick, Virtual joystick
```

**原因:** 启用多平台，可重新绑定控制。

---

### 4. 性能预算 (Performance Budget) (60 FPS = 16.67ms)

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
2. 批处理 (减少绘制调用)
3. 池化 (避免 GC 峰值)
4. LOD (按距离调整细节)
5. 剔除 (跳过不可见对象)

---

### 5. AI 选择 (按复杂度)

| AI 类型        | 复杂度 | 何时使用               |
| -------------- | ------ | ---------------------- |
| **FSM**        | 简单   | 3-5 个状态，可预测行为 |
| **行为树**     | 中等   | 模块化，设计师友好     |
| **GOAP**       | 高     | 涌现式，基于规划       |
| **Utility AI** | 高     | 基于评分的决策         |

---

### 6. 碰撞策略 (Collision Strategy)

| 类型             | 适用场景           |
| ---------------- | ------------------ |
| **AABB**         | 矩形，快速检查     |
| **Circle**       | 圆形对象，廉价     |
| **Spatial Hash** | 许多大小相似的对象 |
| **Quadtree**     | 大世界，大小不一   |

---

## 反模式 (通用)

| 不要               | 要                     |
| ------------------ | ---------------------- |
| 每一帧更新所有内容 | 使用事件，脏标记       |
| 在热循环中创建对象 | 对象池                 |
| 什么都不缓存       | 缓存引用               |
| 不分析就优化       | 先分析 (Profile first) |
| 将输入与逻辑混合   | 抽象输入层             |

---

## 路由示例 (Routing Examples)

### 示例 1: "我想做一个基于浏览器的 2D 平台游戏"

→ 从 `game-development/web-games` 开始进行框架选择
→ 然后 `game-development/2d-games` 用于精灵/瓦片地图模式
→ 参考 `game-development/game-design` 进行关卡设计

### 示例 2: "iOS 和 Android 的移动端解谜游戏"

→ 从 `game-development/mobile-games` 开始，用于触摸输入和应用商店
→ 使用 `game-development/game-design` 进行谜题平衡

### 示例 3: "多人 VR 射击游戏"

→ `game-development/vr-ar` 用于舒适度和沉浸感
→ `game-development/3d-games` 用于渲染
→ `game-development/multiplayer` 用于网络

---

> **记住：** 伟大的游戏来自迭代，而不是完美。快速原型，然后打磨。
