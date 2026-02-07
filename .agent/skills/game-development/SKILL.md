---
name: game-development
description: Game development orchestrator. Routes to platform-specific skills based on project needs.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 游戏开发 (Game Development)

> **Orchestrator skill (编排器技能)** that provides core principles and routes to specialized sub-skills. (提供核心原则并路由到专门的子技能。)

---

## 何时使用此技能 (When to Use This Skill)

You are working on a game development project. This skill teaches the PRINCIPLES of game development and directs you to the right sub-skill based on context. (你正在进行游戏开发项目。此技能教授游戏开发原则，并根据上下文指导你使用正确的子技能。)

---

## 子技能路由 (Sub-Skill Routing)

### 平台选择 (Platform Selection)

| If the game targets... (如果游戏目标是...) | Use Sub-Skill (使用子技能)      |
| ------------------------------------------ | ------------------------------- |
| Web browsers (HTML5, WebGL)                | `game-development/web-games`    |
| Mobile (iOS, Android)                      | `game-development/mobile-games` |
| PC (Steam, Desktop)                        | `game-development/pc-games`     |
| VR/AR headsets                             | `game-development/vr-ar`        |

### 维度选择 (Dimension Selection)

| If the game is... (如果游戏是...)     | Use Sub-Skill (使用子技能)  |
| ------------------------------------- | --------------------------- |
| 2D (sprites, tilemaps/精灵，瓦片地图) | `game-development/2d-games` |
| 3D (meshes, shaders/网格，着色器)     | `game-development/3d-games` |

### 专业领域 (Specialty Areas)

| If you need... (如果你需要...)                                     | Use Sub-Skill (使用子技能)     |
| ------------------------------------------------------------------ | ------------------------------ |
| GDD, balancing, player psychology (GDD，平衡，玩家心理)            | `game-development/game-design` |
| Multiplayer, networking (多人游戏，网络)                           | `game-development/multiplayer` |
| Visual style, asset pipeline, animation (视觉风格，资产管线，动画) | `game-development/game-art`    |
| Sound design, music, adaptive audio (音效设计，音乐，自适应音频)   | `game-development/game-audio`  |

---

## 核心原则 (所有平台) - Core Principles (All Platforms)

### 1. 游戏循环 (The Game Loop)

Every game, regardless of platform, follows this pattern (每个游戏，无论平台如何，都遵循此模式):

```
INPUT (输入)  → Read player actions (读取玩家动作)
UPDATE (更新) → Process game logic (fixed timestep) (处理游戏逻辑 (固定时间步长))
RENDER (渲染) → Draw the frame (interpolated) (绘制帧 (插值))
```

**Fixed Timestep Rule (固定时间步长规则):**

- Physics/logic (物理/逻辑): Fixed rate (e.g., 50Hz) (固定速率 (例如 50Hz))
- Rendering (渲染): As fast as possible (尽可能快)
- Interpolate between states for smooth visuals (在状态之间插值以获得平滑的视觉效果)

---

### 2. 模式选择矩阵 (Pattern Selection Matrix)

| 模式                              | 何时使用                                       | 示例                                      |
| --------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| **State Machine (状态机)**        | 3-5 discrete states (3-5 个离散状态)           | Player: Idle→Walk→Jump (玩家：空闲→走→跳) |
| **Object Pooling (对象池)**       | Frequent spawn/destroy (频繁生成/销毁)         | Bullets, particles (子弹，粒子)           |
| **Observer/Events (观察者/事件)** | Cross-system communication (跨系统通信)        | Health→UI updates (生命值→UI 更新)        |
| **ECS (实体组件系统)**            | Thousands of similar entities (数千个相似实体) | RTS units, particles (RTS 单位，粒子)     |
| **Command (命令)**                | Undo, replay, networking (撤销，重放，网络)    | Input recording (输入录制)                |
| **Behavior Tree (行为树)**        | Complex AI decisions (复杂 AI 决策)            | Enemy AI (敌人 AI)                        |

**决策规则 (Decision Rule):** Start with State Machine. Add ECS only when performance demands. (从状态机开始。仅在性能需要时添加 ECS。)

---

### 3. 输入抽象 (Input Abstraction)

Abstract input into ACTIONS, not raw keys (将输入抽象为动作，而不是原始按键):

```
"jump" (跳跃)  → Space, Gamepad A, Touch tap (空格，手柄 A，触摸点击)
"move" (移动)  → WASD, Left stick, Virtual joystick (WASD，左摇杆，虚拟摇杆)
```

**Why (为什么):** Enables multi-platform, rebindable controls (启用多平台、可重新绑定的控件).

---

### 4. 性能预算 (Performance Budget) (60 FPS = 16.67ms)

| 系统                  | 预算   |
| --------------------- | ------ |
| Input (输入)          | 1ms    |
| Physics (物理)        | 3ms    |
| AI                    | 2ms    |
| Game Logic (游戏逻辑) | 4ms    |
| Rendering (渲染)      | 5ms    |
| Buffer (缓冲)         | 1.67ms |

**Optimization Priority (优化优先级):**

1. Algorithm (算法) (O(n²) → O(n log n))
2. Batching (批处理) (reduce draw calls/减少绘制调用)
3. Pooling (池化) (avoid GC spikes/避免 GC 峰值)
4. LOD (多细节层次) (detail by distance/按距离细节)
5. Culling (剔除) (skip invisible/跳过不可见)

---

### 5. 按复杂度选择 AI (AI Selection by Complexity)

| AI 类型                     | 复杂度        | 何时使用                                                  |
| --------------------------- | ------------- | --------------------------------------------------------- |
| **FSM (有限状态机)**        | Simple (简单) | 3-5 states, predictable behavior (3-5 个状态，可预测行为) |
| **Behavior Tree (行为树)**  | Medium (中等) | Modular, designer-friendly (模块化，设计师友好)           |
| **GOAP (目标导向行动计划)** | High (高)     | Emergent, planning-based (涌现式，基于计划)               |
| **Utility AI (效用 AI)**    | High (高)     | Scoring-based decisions (基于评分的决策)                  |

---

### 6. 碰撞策略 (Collision Strategy)

| 类型                        | 最适合                                          |
| --------------------------- | ----------------------------------------------- |
| **AABB**                    | Rectangles, fast checks (矩形，快速检查)        |
| **Circle (圆形)**           | Round objects, cheap (圆形物体，廉价)           |
| **Spatial Hash (空间哈希)** | Many similar-sized objects (许多相似大小的物体) |
| **Quadtree (四叉树)**       | Large worlds, varying sizes (大世界，不同大小)  |

---

## 反模式 (通用) - Anti-Patterns (Universal)

| Don't (不要)                                     | Do (要)                                    |
| ------------------------------------------------ | ------------------------------------------ |
| Update everything every frame (每帧更新所有内容) | Use events, dirty flags (使用事件，脏标记) |
| Create objects in hot loops (在热循环中创建对象) | Object pooling (对象池)                    |
| Cache nothing (什么都不缓存)                     | Cache references (缓存引用)                |
| Optimize without profiling (不分析就优化)        | Profile first (先分析)                     |
| Mix input with logic (混合输入与逻辑)            | Abstract input layer (抽象输入层)          |

---

## 路由示例 (Routing Examples)

### Example 1: "I want to make a browser-based 2D platformer"

### 示例 1: "I want to make a browser-based 2D platformer (我想制作一个基于浏览器的 2D 平台游戏)"

→ Start with `game-development/web-games` for framework selection (从 `game-development/web-games` 开始进行框架选择)
→ Then `game-development/2d-games` for sprite/tilemap patterns (然后 `game-development/2d-games` 用于精灵/瓦片地图模式)
→ Reference `game-development/game-design` for level design (参考 `game-development/game-design` 进行关卡设计)

### Example 2: "Mobile puzzle game for iOS and Android"

### 示例 2: "Mobile puzzle game for iOS and Android (iOS 和 Android 的移动益智游戏)"

→ Start with `game-development/mobile-games` for touch input and stores (从 `game-development/mobile-games` 开始用于触摸输入和商店)
→ Use `game-development/game-design` for puzzle balancing (使用 `game-development/game-design` 进行谜题平衡)

### Example 3: "Multiplayer VR shooter"

### 示例 3: "Multiplayer VR shooter (多人 VR 射击游戏)"

→ `game-development/vr-ar` for comfort and immersion (用于舒适度和沉浸感)
→ `game-development/3d-games` for rendering (用于渲染)
→ `game-development/multiplayer` for networking (用于网络)

---

> **记住：** Great games come from iteration, not perfection. Prototype fast, then polish. (伟大的游戏源于迭代，而非完美。快速原型，然后打磨。)
