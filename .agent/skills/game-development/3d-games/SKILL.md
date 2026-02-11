---
name: 3d-games
description: 3D 游戏开发原则。渲染（Rendering）、着色器（Shader）、物理（Physics）、相机（Camera）。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# 3D 游戏开发

> 3D 游戏系统的原则。

---

## 1. 渲染管线（Rendering Pipeline）

### 阶段

```
1. Vertex Processing → Transform geometry
2. Rasterization → Convert to pixels
3. Fragment Processing → Color pixels
4. Output → To screen
```

### 优化原则

| 技术 | 用途 |
|-----------|---------|
| **视锥裁剪（Frustum culling）** | 不渲染屏幕外区域 |
| **遮挡裁剪（Occlusion culling）** | 不渲染被遮挡部分 |
| **LOD（Level of Detail）** | 距离远时降低细节 |
| **批处理（Batching）** | 合并绘制调用 |

---

## 2. 着色器原则（Shader Principles）

### 着色器类型

| 类型 | 用途 |
|------|---------|
| **顶点（Vertex）** | 位置、法线 |
| **片元/像素（Fragment/Pixel）** | 颜色、光照 |
| **计算（Compute）** | 通用计算 |

### 何时编写自定义着色器

- 特效（水、火、传送门）
- 风格化渲染（Toon、Sketch）
- 性能优化
- 独特视觉风格

---

## 3. 3D 物理（3D Physics）

### 碰撞体形状

| 形状 | 使用场景 |
|-------|----------|
| **盒体（Box）** | 建筑、箱体 |
| **球体（Sphere）** | 球、快速检测 |
| **胶囊体（Capsule）** | 角色 |
| **网格（Mesh）** | 地形（成本高） |

### 原则

- 碰撞体用简单形状，视觉用复杂模型
- 分层过滤（Layer-based filtering）
- 视线检测用射线（Raycasting）

---

## 4. 相机系统（Camera Systems）

### 相机类型

| 类型 | 用途 |
|------|-----|
| **第三人称（Third-person）** | 动作、冒险 |
| **第一人称（First-person）** | 沉浸、FPS |
| **等距（Isometric）** | 策略、RPG |
| **轨道（Orbital）** | 检视、编辑器 |

### 相机手感

- 平滑跟随（lerp）
- 碰撞回避（Collision avoidance）
- 运动前瞻（Look-ahead）
- 用 FOV 变化体现速度

---

## 5. 光照（Lighting）

### 光源类型

| 类型 | 用途 |
|------|-----|
| **方向光（Directional）** | 太阳、月亮 |
| **点光（Point）** | 灯、火把 |
| **聚光（Spot）** | 手电、舞台 |
| **环境光（Ambient）** | 基础照明 |

### 性能考量

- 实时阴影开销大
- 尽量烘焙（Bake）
- 大场景用级联阴影（Shadow cascades）

---

## 6. 细节层级（LOD）

### LOD 策略

| 距离 | 模型 |
|----------|-------|
| 近 | 全细节 |
| 中 | 50% 三角形 |
| 远 | 25% 或看板（billboard） |

---

## 7. 反模式（Anti-Patterns）

| ❌ 不要 | ✅ 要做 |
|----------|-------|
| 到处使用网格碰撞体（Mesh colliders） | 使用简单形状 |
| 移动端全开实时阴影 | 选择烘焙或投影（Blob）阴影 |
| 所有距离只用一个 LOD | 按距离分级 LOD |
| 未优化的着色器 | 性能分析（Profiling）后简化 |

---

> **提示：** 3D 追求的是错觉，营造细节的印象，而非细节本身。
