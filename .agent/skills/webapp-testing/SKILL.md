---
description: Web 应用测试原则、E2E 测试策略
---

# Web 应用测试 (Web App Testing)

## E2E 测试工具推荐

- **Playwright**: 微软出品，现代、快速、支持多浏览器。**首选**。
- **Cypress**: 开发者体验好，但有一些限制。
- **Selenium**: 老牌，较慢，不推荐。

## 什么是好的 E2E 测试？

1.  **关注用户行为**: 测试"用户点击登录"，而不是"调用登录函数"。
2.  **使用可见定位器**: `getByText('Login')`, `getByRole('button')`。避免使用 CSS Selector (`.btn-primary`)，因为类名会变，但用户看到的内容不会变。
3.  **独立性**: 每个测试用例应该负责自己的数据创建和清理。

## Visual Regression Testing (视觉回归测试)

不仅仅测试功能，还要测试样子。

- Playwright 支持截图对比：
  `expect(page).toHaveScreenshot()`

这能发现 CSS 更改导致的意外布局崩坏。
