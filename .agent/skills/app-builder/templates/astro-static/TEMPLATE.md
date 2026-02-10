---
name: astro-static
description: Astro static site template principles（静态站点模板原则）。Content-focused websites（内容型网站）、blogs（博客）、documentation（文档）。
---

# Astro Static Site Template（静态站点模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Framework（框架） | Astro 4.x |
| Content（内容） | MDX + Content Collections |
| Styling（样式） | Tailwind CSS |
| Integrations（集成） | Sitemap（站点地图）、RSS、SEO |
| Output（输出） | Static/SSG（静态/SSG） |

---

## Directory Structure（目录结构）

```
project-name/
├── src/
│   ├── components/      # .astro components（.astro 组件）
│   ├── content/         # MDX content（MDX 内容）
│   │   ├── blog/
│   │   └── config.ts    # Collection schemas（内容集合 Schema）
│   ├── layouts/         # Page layouts（页面布局）
│   ├── pages/           # File-based routing（基于文件的路由）
│   └── styles/
├── public/              # Static assets（静态资源）
├── astro.config.mjs
└── package.json
```

---

## Key Concepts（关键概念）

| Concept（概念） | Description（说明） |
| --- | --- |
| Content Collections（内容集合） | Type-safe content with Zod schemas（使用 Zod Schema 的类型安全内容） |
| Islands Architecture（群岛架构） | Partial hydration for interactivity（仅对交互部分局部水合） |
| Zero JS by default（默认零 JS） | Static HTML unless needed（除非需要，否则输出静态 HTML） |
| MDX Support（MDX 支持） | Markdown with components（带组件的 Markdown） |

---

## Setup Steps（设置步骤）

1. `npm create astro@latest {{name}}`
2. Add integrations（添加集成）：`npx astro add mdx tailwind sitemap`
3. Configure `astro.config.mjs`（配置）
4. Create content collections（创建内容集合）
5. `npm run dev`

---

## Deployment（部署）

| Platform（平台） | Method（方式） |
| --- | --- |
| Vercel | Auto-detected（自动检测） |
| Netlify | Auto-detected（自动检测） |
| Cloudflare Pages | Auto-detected（自动检测） |
| GitHub Pages | Build + deploy action（构建 + 部署工作流） |

---

## Best Practices（最佳实践）

- Use Content Collections for type safety（保证类型安全）
- Leverage static generation（优先使用静态生成）
- Add islands only where needed（仅在需要时添加 Islands）
- Optimize images with Astro Image（使用 Astro Image 优化图片）
