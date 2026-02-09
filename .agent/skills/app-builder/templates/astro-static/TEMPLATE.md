---
name: astro-static
description: Astro 静态站点模板原则。用于内容型网站、博客与文档。
---

# Astro 静态站点模板

## 技术栈

| 组件 | 技术 |
| --- | --- |
| 框架 | Astro 4.x |
| 内容 | MDX + Content Collections |
| 样式 | Tailwind CSS |
| 集成 | Sitemap、RSS、SEO |
| 输出 | Static/SSG |

---

## 目录结构

```
project-name/
├── src/
│   ├── components/      # .astro 组件
│   ├── content/         # MDX 内容
│   │   ├── blog/
│   │   └── config.ts    # 内容集合 Schema
│   ├── layouts/         # 页面布局
│   ├── pages/           # 基于文件的路由
│   └── styles/
├── public/              # 静态资源
├── astro.config.mjs
└── package.json
```

---

## 关键概念

| 概念 | 说明 |
| --- | --- |
| 内容集合（Content Collections） | 使用 Zod Schema 的类型安全内容 |
| 群岛架构（Islands Architecture） | 仅对交互部分进行局部水合 |
| 默认零 JS（Zero JS by default） | 除非需要，否则输出静态 HTML |
| MDX 支持（MDX Support） | 带组件的 Markdown |

---

## 设置步骤

1. `npm create astro@latest {{name}}`
2. 添加集成：`npx astro add mdx tailwind sitemap`
3. 配置 `astro.config.mjs`
4. 创建内容集合
5. `npm run dev`

---

## 部署

| 平台 | 方式 |
| --- | --- |
| Vercel | 自动检测 |
| Netlify | 自动检测 |
| Cloudflare Pages | 自动检测 |
| GitHub Pages | 构建 + 部署 Action（工作流） |

---

## 最佳实践

- 使用 Content Collections 保证类型安全
- 优先使用静态生成
- 仅在需要时添加 Islands
- 使用 Astro Image 优化图片
