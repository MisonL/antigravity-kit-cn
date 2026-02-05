---
name: mobile-design
description: 移动端优先设计思维、触摸交互与平台规范 (iOS/Android)
---

# 移动端设计 (Mobile Design)

> 掌握移动端优先设计思维、触摸交互与平台规范 (iOS/Android)。

---

## 核心思维

**手指不是鼠标 (Touch != Mouse)**

1.  **触控目标 (Hit Targets)**
    - 最小点击区域：**44x44 pt** (iOS) 或 **48x48 dp** (Android)。
    - 按钮之间要有足够间距，防止误触。

2.  **屏幕区域 (Thumb Zones)**
    - **拇指热区**: 屏幕底部和中部是易操作区。主要操作按钮应放在这里。
    - **顶部死角**: 屏幕顶部较难触达，适合放置"查看"类信息，不适合放置频繁操作的按钮。

---

## 平台规范

### iOS (Human Interface Guidelines)

- **导航**: 底部 Tab Bar，左上角返回。
- **动效**: 物理感强，有回弹 (Rubber banding) 效果。
- **字体**: San Francisco (SF Pro)。

### Android (Material Design 3)

- **导航**: 底部 Navigation Bar，可以使用 Navigation Drawer。
- **动效**: 涟漪效果 (Ripple)，纸墨隐喻，海拔 (Elevation)。
- **字体**: Roboto。

---

## 性能考量

- 列表必须使用虚拟化 (FlatList / VirtualList)。
- 图片必须懒加载和按需裁剪。
- 避免过度复杂的阴影和透明度 (尤其在 Android 低端机上)。

---

## 移动端技能索引

- **决策指南**: [decision-trees.md](decision-trees.md)
- **色彩系统**: [mobile-color-system.md](mobile-color-system.md)
- **排版系统**: [mobile-typography.md](mobile-typography.md)
- **触摸心理学**: [touch-psychology.md](touch-psychology.md)
- **iOS 平台指南**: [platform-ios.md](platform-ios.md)
- **Android 平台指南**: [platform-android.md](platform-android.md)
