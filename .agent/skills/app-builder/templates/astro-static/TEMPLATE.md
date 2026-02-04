---
name: astro-static
description: Astro 静态站点模版原则。零 JS，内容集合。
---

# Astro 静态站点模版

## 技术栈

| 组件    | 技术             |
| ------- | ---------------- |
| 框架    | Astro 4+         |
| 样式    | Tailwind CSS     |
| UI 组件 | React (可选)     |
| 内容    | MDX              |
| 部署    | Vercel / Netlify |

---

## 目录结构

```
project-name/
├── src/
│   ├── components/      # UI 组件
│   ├── layouts/         # 页面布局
│   ├── pages/           # 基于文件的路由
│   ├── content/         # 内容集合 (config.ts)
│   │   ├── blog/
│   │   └── docs/
│   └── styles/
├── public/
├── astro.config.mjs
└── package.json
```

---

## 关键概念

| 概念                            | 描述                        |
| ------------------------------- | --------------------------- |
| Content Collections (内容集合)  | 具有 Zod 模式的类型安全内容 |
| Islands Architecture (群岛架构) | 用于交互性的部分水合        |
| Zero JS by default (默认零 JS)  | 除非需要，否则为静态 HTML   |
| MDX Support (MDX 支持)          | 带有组件的 Markdown         |

---

## 设置步骤

1. `npm create astro@latest {{name}}`
2. 添加集成: `npx astro add mdx tailwind sitemap`
3. 配置 `astro.config.mjs`
4. 创建内容集合
5. `npm run dev`

---

## 部署

| 平台             | 方法               |
| ---------------- | ------------------ |
| Vercel           | 自动检测           |
| Netlify          | 自动检测           |
| Cloudflare Pages | 自动检测           |
| GitHub Pages     | 构建 + 部署 Action |

---

## 最佳实践

- 使用 Content Collections 以确保类型安全
- 利用静态生成
- 仅在需要的地方添加 islands
- 使用 Astro Image 优化图像
