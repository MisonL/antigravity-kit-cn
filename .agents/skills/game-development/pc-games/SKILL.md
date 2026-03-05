---
name: pc-games
description: PC 与主机游戏开发原则。引擎选择、平台特性、优化策略。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# PC/主机游戏开发

> 引擎选择与平台特定原则。

---

## 1. 引擎选择

### 决策树

```
你在构建什么？
│
├── 2D 游戏
│   ├── 开源很重要？ → Godot
│   └── 大型团队/资产？ → Unity
│
├── 3D 游戏
│   ├── AAA 视觉质量？ → Unreal
│   ├── 跨平台优先？ → Unity
│   └── 独立/开源？ → Godot 4
│
└── 特定需求
    ├── DOTS 性能？ → Unity
    ├── Nanite/Lumen？ → Unreal
    └── 轻量级？ → Godot
```

### 比较

| 因素 | Unity 6 | Godot 4 | Unreal 5 |
| --- | --- | --- | --- |
| 2D | 好 | 极好 | 有限 |
| 3D | 好 | 好 | 极好 |
| 学习 | 中等 | 容易 | 难 |
| 成本 | 收入分成 | 免费 | 100 万美元后 5% |
| 团队 | 任何 | 个人-中型 | 中型-大型 |

---

## 2. 平台特性

### Steam 集成

| 特性 | 目的 |
| --- | --- |
| Achievements（成就） | 玩家目标 |
| Cloud Saves（云存档） | 跨设备进度 |
| Leaderboards（排行榜） | 竞争 |
| Workshop（创意工坊） | 用户模组 |
| Rich Presence（富呈现） | 显示游戏内状态 |

### 主机要求

| 平台 | 认证 |
| --- | --- |
| PlayStation | TRC 合规 |
| Xbox | XR 合规 |
| Nintendo | Lotcheck |

---

## 3. 控制器支持

### 输入抽象

```
映射 ACTIONS，而不是按钮：
- "confirm" → A（Xbox）、Cross（PS）、B（Nintendo）
- "cancel" → B（Xbox）、Circle（PS）、A（Nintendo）
```

### 触觉反馈

| 强度 | 用途 |
| --- | --- |
| 轻 | UI 反馈 |
| 中 | 撞击 |
| 重 | 重大事件 |

---

## 4. 性能优化

### 性能分析优先

| 引擎 | 工具 |
| --- | --- |
| Unity | Profiler Window |
| Godot | Debugger → Profiler |
| Unreal | Unreal Insights |

### 常见瓶颈

| 瓶颈 | 解决方案 |
| --- | --- |
| Draw calls（绘制调用） | Batching（合批）、atlases（图集） |
| GC spikes（GC 峰值） | Object pooling（对象池） |
| Physics（物理） | 更简单的碰撞体 |
| Shaders（着色器） | LOD 着色器 |

---

## 5. 引擎特定原则

### Unity 6

- DOTS 用于性能关键系统
- Burst compiler 用于热路径
- Addressables 用于资产流式传输

### Godot 4

- GDScript 用于快速迭代
- C# 用于复杂逻辑
- Signals 用于解耦

### Unreal 5

- Blueprint（蓝图）给设计师
- C++ 追求性能
- Nanite 用于高多边形环境
- Lumen 用于动态光照

---

## 6. 反模式

| ❌ 禁止 | ✅ 推荐 |
| --- | --- |
| 凭炒作选择引擎 | 按项目需求选择 |
| 忽略平台指南 | 研究认证要求 |
| 硬编码输入按钮 | 抽象为动作 |
| 跳过性能分析 | 尽早并经常分析 |

---

> **记住：** 引擎只是工具。掌握原则，然后适应任何引擎。
