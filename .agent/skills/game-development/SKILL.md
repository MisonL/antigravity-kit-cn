---
name: game-development
description: 游戏开发编排器 (Orchestrator)。根据项目需求路由至特定平台的开发技能。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 游戏开发 (Game Development)

> **编排类技能**：提供核心原则，并引导至特定的子技能 (Sub-skills)。

---

## 何时使用此技能 (When to Use)

当您正在进行游戏开发项目时。本技能涵盖了游戏开发的**通用原则**，并会根据当前上下文指引您使用正确的子技能。

---

## 子技能路由 (Sub-Skill Routing)

### 平台选择 (Platform Selection)

| 目标平台                  | 使用子技能                      |
| ------------------------- | ------------------------------- |
| Web 浏览器 (HTML5, WebGL) | `game-development/web-games`    |
| 移动端 (iOS, Android)     | `game-development/mobile-games` |
| PC 端 (Steam, 桌面应用)   | `game-development/pc-games`     |
| VR/AR 虚拟现实设备        | `game-development/vr-ar`        |

### 维度选择 (Dimension Selection)

| 游戏类型                           | 使用子技能                  |
| ---------------------------------- | --------------------------- |
| 2D (Sprite 精灵、Tilemap 瓦片地图) | `game-development/2d-games` |
| 3D (Mesh 网格、Shader 着色器)      | `game-development/3d-games` |

### 专业领域 (Specialty Areas)

| 需求                       | 使用子技能                     |
| -------------------------- | ------------------------------ |
| GDD 策划、平衡性、用户心理 | `game-development/game-design` |
| 多人联机、网络同步         | `game-development/multiplayer` |
| 视觉风格、素材管线、动画   | `game-development/game-art`    |
| 音效设计、音乐、自适应音频 | `game-development/game-audio`  |

---

## 核心原则（全平台通用）

### 1. 游戏循环 (The Game Loop)

无论在何种平台上，所有的游戏都遵循这一模式：

```
输入 (INPUT)  → 读取玩家操作
更新 (UPDATE) → 处理游戏逻辑（固定步长 Fixed timestep）
渲染 (RENDER) → 绘制帧（插值处理 Interpolated）
```

**固定步长准则：**

- 物理/逻辑：应以固定频率运行（如 50Hz）。
- 渲染：尽可能快。
- 状态插值：在不同状态间进行插值，以确保视觉上的平滑度。

---

### 2. 模式选择矩阵 (Pattern Selection Matrix)

| 设计模式                    | 使用场景             | 示例                                              |
| --------------------------- | -------------------- | ------------------------------------------------- |
| **状态机 (State Machine)**  | 3-5 个离散状态       | 玩家状态：待机 (Idle) → 行走 (Walk) → 跳跃 (Jump) |
| **对象池 (Object Pooling)** | 频繁创建/销毁        | 子弹、粒子效果                                    |
| **观察者/事件 (Observer)**  | 跨系统通信           | 生命值变化 → UI 更新                              |
| **ECS**                     | 数以千计的同类实体   | RTS 单位、大规模粒子                              |
| **命令模式 (Command)**      | 撤销、重放、联网同步 | 输入记录                                          |
| **行为树 (Behavior Tree)**  | 复杂的 AI 决策       | 敌人 AI 逻辑                                      |

**决策规则：** 优先从状态机开始。仅在性能需求极高时才引入 ECS。

---

### 3. 输入抽象 (Input Abstraction)

将输入抽象为**动作 (ACTIONS)**，而非原始按键：

```
“跳跃 (jump)” → 空格键、手柄 A 键、触摸屏点击
“移动 (move)” → WASD、左摇杆、虚拟摇杆
```

**理由：** 实现多平台支持及可自定义的按键绑定。

---

### 4. 性能预算 (Performance Budget) (60 FPS = 16.67ms)

| 系统             | 预算   |
| ---------------- | ------ |
| 输入 (Input)     | 1ms    |
| 物理 (Physics)   | 3ms    |
| 人工智能 (AI)    | 2ms    |
| 游戏逻辑 (Logic) | 4ms    |
| 渲染 (Rendering) | 5ms    |
| 缓冲 (Buffer)    | 1.67ms |

**优化优先级：**

1. **算法** (O(n²) → O(n log n))。
2. **批处理 (Batching)** (减少绘图调用 draw calls)。
3. **对象池 (Pooling)** (避免垃圾回收 GC 峰值)。
4. **LOD** (根据距离调整细节)。
5. **裁剪 (Culling)** (跳过不可见物体)。

---

### 5. AI 复杂度选择

| AI 类型                  | 复杂度 | 使用场景               |
| ------------------------ | ------ | ---------------------- |
| **FSM (状态机)**         | 简单   | 3-5 个状态，行为可预测 |
| **行为树**               | 中等   | 模块化，对策划人员友好 |
| **GOAP**                 | 高     | 基于规划的呈现式行为   |
| **效用 AI (Utility AI)** | 高     | 基于评分机制的决策     |

---

### 6. 碰撞策略 (Collision Strategy)

| 类型                        | 适用于                   |
| --------------------------- | ------------------------ |
| **AABB**                    | 矩形，快速检测           |
| **圆形 (Circle)**           | 圆形物体，计算开销低     |
| **空间哈希 (Spatial Hash)** | 大量大小相近的物体       |
| **四叉树 (Quadtree)**       | 大规模世界，物体大小不一 |

---

## 反模式（通用型） (Anti-Patterns)

| 禁止 (Don't)         | 推荐 (Do)                          |
| -------------------- | ---------------------------------- |
| 每帧更新所有内容     | 使用事件机制、脏标记 (Dirty flags) |
| 在热点循环中创建对象 | 使用对象池                         |
| 完全不使用缓存       | 缓存常用引用                       |
| 不做分析就进行优化   | 优先进行性能分析 (Profile)         |
| 将输入与逻辑混在一起 | 抽象出输入层                       |

---

## 路由示例 (Routing Examples)

### 示例 1：“我想做一个基于浏览器的 2D 平台游戏”

→ 首先参考 `game-development/web-games` 选择框架。
→ 然后参考 `game-development/2d-games` 学习精灵/瓦片地图模式。
→ 参考 `game-development/game-design` 进行关卡设计。

### 示例 2：“适用于 iOS 和 Android 的移动端益智游戏”

→ 首先参考 `game-development/mobile-games` 处理触摸输入与商店发布。
→ 使用 `game-development/game-design` 进行谜题平衡性设计。

### 示例 3：“多人 VR 射击游戏”

→ `game-development/vr-ar` 处理舒适性与沉浸感。
→ `game-development/3d-games` 处理渲染逻辑。
→ `game-development/multiplayer` 处理联网同步。

---

> **谨记：** 优秀的游戏源于不断的迭代，而非一步到位的完美。快速产出原型，然后不断打磨。

---

