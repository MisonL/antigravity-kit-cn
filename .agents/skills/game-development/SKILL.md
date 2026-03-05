---
name: game-development
description: 游戏开发编排器。根据项目需求路由到特定平台技能。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 游戏开发

> **编排类技能**：提供核心原则，并引导至专业子技能。

---

## 何时使用此技能

当你在进行游戏开发项目时使用。本技能讲解游戏开发的**核心原则**，并根据上下文指引到合适的子技能。

---

## 子技能路由

### 平台选择

| 如果目标平台是... | 使用子技能 |
| --- | --- |
| Web 浏览器（HTML5, WebGL） | `game-development/web-games` |
| 移动端（iOS, Android） | `game-development/mobile-games` |
| PC（Steam, 桌面） | `game-development/pc-games` |
| VR/AR 头显 | `game-development/vr-ar` |

### 维度选择

| 如果游戏是... | 使用子技能 |
| --- | --- |
| 2D（sprites, tilemaps） | `game-development/2d-games` |
| 3D（meshes, shaders） | `game-development/3d-games` |

### 专业领域

| 如果你需要... | 使用子技能 |
| --- | --- |
| GDD、平衡性、玩家心理 | `game-development/game-design` |
| 多人联机、网络同步 | `game-development/multiplayer` |
| 视觉风格、素材管线、动画 | `game-development/game-art` |
| 音效设计、音乐、自适应音频 | `game-development/game-audio` |

---

## 核心原则（全平台）

### 1. 游戏循环

不论平台，所有游戏都遵循这一模式：

```
INPUT  → 读取玩家操作
UPDATE → 处理游戏逻辑（固定步长）
RENDER → 绘制帧（插值）
```

**固定步长规则：**
- 物理/逻辑：固定频率（例如 50Hz）
- 渲染：尽可能快
- 在不同状态间做插值以保证画面平滑

---

### 2. 模式选择矩阵

| 模式 | 使用场景 | 示例 |
| --- | --- | --- |
| **状态机（State Machine）** | 3-5 个离散状态 | 玩家：Idle（待机）→Walk（行走）→Jump（跳跃） |
| **对象池（Object Pooling）** | 频繁生成/销毁 | 子弹、粒子 |
| **观察者/事件（Observer/Events）** | 跨系统通信 | 生命值→UI（界面）更新 |
| **ECS（实体组件系统）** | 大量相似实体 | RTS（即时战略）单位、粒子 |
| **命令（Command）** | 撤销、回放、联网同步 | 输入记录 |
| **行为树（Behavior Tree）** | 复杂 AI（人工智能）决策 | 敌人 AI |

**决策规则：** 先用状态机。只有在性能需要时再引入 ECS。

---

### 3. 输入抽象

将输入抽象为动作（Actions），而不是原始按键：

```
"jump"  → Space、手柄 A、触摸点击
"move"  → WASD、左摇杆、虚拟摇杆
```

**原因：** 便于多平台支持与可重绑控制。

---

### 4. 性能预算（60 FPS（帧率） = 16.67ms）

| 系统 | 预算 |
| --- | --- |
| 输入 | 1ms |
| 物理 | 3ms |
| AI（人工智能） | 2ms |
| 游戏逻辑 | 4ms |
| 渲染 | 5ms |
| 缓冲 | 1.67ms |

**优化优先级：**
1. 算法（O(n²) → O(n log n)）
2. 批处理（减少 draw calls（绘制调用））
3. 对象池（避免 GC（垃圾回收）峰值）
4. LOD（细节层级，按距离调整细节）
5. 裁剪（跳过不可见）

---

### 5. AI 复杂度选择

| AI 类型 | 复杂度 | 使用场景 |
| --- | --- | --- |
| **FSM（有限状态机）** | 简单 | 3-5 状态，行为可预测 |
| **行为树（Behavior Tree）** | 中等 | 模块化，策划友好 |
| **GOAP（目标导向行动规划）** | 高 | 基于规划的涌现行为 |
| **效用 AI（Utility AI）** | 高 | 基于评分决策 |

---

### 6. 碰撞策略

| 类型 | 适用场景 |
| --- | --- |
| **AABB（轴对齐包围盒）** | 矩形，检测快 |
| **Circle（圆形）** | 圆形物体，开销低 |
| **Spatial Hash（空间哈希）** | 大量相似尺寸物体 |
| **Quadtree（四叉树）** | 大型世界，尺寸差异大 |

---

## 反模式（通用）

| 禁止 | 推荐 |
| --- | --- |
| 每帧更新所有内容 | 使用事件、脏标记 |
| 在热点循环中创建对象 | 使用对象池 |
| 不做缓存 | 缓存常用引用 |
| 不做分析就优化 | 先做性能分析 |
| 输入与逻辑混在一起 | 抽象输入层 |

---

## 路由示例

### 示例 1：“我想做一个基于浏览器的 2D 平台游戏”
→ 先用 `game-development/web-games` 选择框架  
→ 再用 `game-development/2d-games` 学习精灵/瓦片地图模式  
→ 参考 `game-development/game-design` 进行关卡设计

### 示例 2：“适用于 iOS 和 Android 的移动端益智游戏”
→ 先用 `game-development/mobile-games` 处理触控与商店发布  
→ 使用 `game-development/game-design` 做谜题平衡

### 示例 3：“多人 VR 射击游戏”
→ `game-development/vr-ar` 处理舒适性与沉浸感  
→ `game-development/3d-games` 处理渲染  
→ `game-development/multiplayer` 处理联网同步

---

> **谨记：** 优秀的游戏来自迭代，而不是一步到位的完美。快速产出原型，再逐步打磨。
