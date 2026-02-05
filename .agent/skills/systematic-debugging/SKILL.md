---
name: systematic-debugging
description: 系统化调试方法论、根因分析
---

# 系统化调试 (Systematic Debugging)

## 调试心法

**不仅是修复 Bug，而是理解系统。**

如果只是试错修好了 Bug，但不知道原因，这个 Bug 还会回来。

## 调试四步法

1.  **复现 (Reproduce)**
    - 找到导致 Bug 的最小输入集合。
    - 自动化复现步骤（编写一个脚本）。

2.  **定位 (Locate)**
    - **二分法 (Binary Search)**:
        - 时间二分：Git Bisect。
        - 空间二分：注释掉一半代码。

3.  **理解 (Understand)**
    - 阅读代码，画出状态流转图。
    - 解释为什么现在的输入导致了错误输出。

4.  **修复 (Fix)**
    - 修复根本原因。
    - 添加回归测试 (Regression Test)。

## 橡皮鸭调试法 (Rubber Ducking)

对着桌子上的橡皮鸭（或者我）一行一行解释你的代码。通常讲到一半你就发现问题了。
