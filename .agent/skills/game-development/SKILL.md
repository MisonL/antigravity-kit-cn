---
name: game-development
description: 游戏开发编排器，跨平台引擎选择与游戏设计模式
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# 游戏开发 (Game Development)

## 引擎选择指南

- **Web 游戏**: Phaser, PixiJS, Three.js
- **跨平台 (2D/3D)**: Godot (开源, 轻量), Unity (商业, 强大)
- **极简/复古**: Kaboom.js, Pico-8

## 核心循环 (Core Loop)

每个游戏都有一个核心循环。例如 RPG：

1.  **战斗**: 击败怪物。
2.  **奖励**: 获得金币/经验。
3.  **升级**: 购买更强装备。
4.  回到 1。

## 常用模式 (Patterns)

1.  **ECS (Entity-Component-System)**
    - Entity: 只有 ID。
    - Component: 只有数据 (Pos, Vel, Health)。
    - System: 只有逻辑 (MovementSystem, RenderSystem)。
    - _优点_: 组合优于继承，高性能。

2.  **状态机 (State Machine)**
    - Idle -> Run -> Jump -> Attack
    - 每种状态定义进入、退出逻辑。

3.  **对象池 (Object Pool)**
    - 预先创建子弹/敌人，重复使用，避免频繁 GC。
