---
name: astro-static
description: Astro 静态站点模板原则。用于内容型网站、博客与文档。
---

# Astro Static Site Template（静态站点模板）

## Tech Stack（技术栈）

| Component | Technology |
| --- | --- |
| Framework（框架） | Astro 4.x |
| Content（内容） | MDX + Content Collections |
| Styling（样式） | Tailwind CSS |
| Integrations（集成） | Sitemap, RSS, SEO |
| Output（输出） | Static / SSG |

---

## Directory Structure（目录结构）

```
project-name/
├── src/
│   ├── components/      # .astro components
│   ├── content/         # MDX content
│   │   ├── blog/
│   │   └── config.ts    # Collection schemas
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   └── styles/
├── public/              # Static assets
├── astro.config.mjs
└── package.json
```

---

## Key Concepts（关键概念）

| Concept | Description |
| --- | --- |
| Content Collections（内容集合） | 使用 Zod schemas 的类型安全内容 |
| Islands Architecture（群岛架构） | 仅对交互部分进行局部水合 |
| Zero JS by default（默认零 JS） | 非必要不引入 JS |
| MDX Support（MDX 支持） | 带组件的 Markdown |

---

## Setup Steps（设置步骤）

1. `npm create astro@latest {{name}}`
2. 添加集成：`npx astro add mdx tailwind sitemap`
3. 配置 `astro.config.mjs`
4. 创建内容集合
5. `npm run dev`

---

## Deployment（部署）

| Platform | Method |
| --- | --- |
| Vercel | Auto-detected |
| Netlify | Auto-detected |
| Cloudflare Pages | Auto-detected |
| GitHub Pages | Build + deploy action |

---

## Best Practices（最佳实践）

- 使用 Content Collections 保证类型安全
- 尽量使用静态生成
- 仅在需要时添加 islands
- 使用 Astro Image 优化图片
