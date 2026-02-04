---
name: nextjs-static
description: Next.js 16, React 19 & Tailwind v4 的现代模版。针对落地页和作品集进行了优化。
---

# Next.js 静态站点模版 (现代版)

## 技术栈

| 组件 | 技术            | 备注                                    |
| ---- | --------------- | --------------------------------------- |
| 框架 | Next.js 16+     | App Router, Turbopack, 静态导出         |
| 核心 | React 19        | Server Components, 新 Hooks, Compiler   |
| 语言 | TypeScript      | 严格模式                                |
| 样式 | Tailwind CSS v4 | CSS 优先配置 (无 js config), Oxide 引擎 |
| 动画 | Framer Motion   | 布局动画 & 手势                         |
| 图标 | Lucide React    | 轻量级 SVG 图标                         |
| SEO  | Metadata API    | 原生 Next.js API (替代 next-seo)        |

---

## 目录结构

得益于 Tailwind v4 (主题配置位于 CSS 内部)，结构更加精简。

```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # 包含根 SEO Metadata
│   │   ├── page.tsx      # 落地页
│   │   ├── globals.css   # 导入 Tailwind v4 & @theme 配置
│   │   ├── not-found.tsx # 自定义 404 页面
│   │   └── (routes)/     # 路由组 (about, contact...)
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Hero, Features, Pricing, CTA
│   │   └── ui/           # 原子组件 (Button, Card)
│   └── lib/
│       └── utils.ts      # 助手函数 (cn, formatters)
├── content/              # Markdown/MDX 内容
├── public/               # 静态资产 (images, fonts)
├── next.config.ts        # Next.js 配置 (TypeScript)
└── package.json
```

---

## 静态导出配置

使用 `next.config.ts` 代替 `.js` 以获得更好的类型安全。

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export", // 静态托管 (S3, GitHub Pages) 必需
    images: {
        unoptimized: true, // 如果不使用 Node.js 服务器图像优化则必需
    },
    trailingSlash: true, // 推荐用于 SEO 并修复某些主机上的 404
    reactStrictMode: true,
};

export default nextConfig;
```

---

## SEO 实现 (Metadata API)

弃用 next-seo。直接在 layout.tsx 或 page.tsx 中配置。

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Product Name",
        default: "Home - Product Name",
    },
    description: "SEO optimized description for the landing page.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://mysite.com",
        siteName: "My Brand",
    },
};
```

---

## 落地页部分

| 部分         | 目的                       | 建议组件                  |
| ------------ | -------------------------- | ------------------------- |
| Hero         | 第一印象, H1 & 主 CTA      | `<HeroSection />`         |
| Features     | 产品优势 (网格/Bento 布局) | `<FeaturesGrid />`        |
| Social Proof | 合作伙伴 Logo, 用户数量    | `<LogoCloud />`           |
| Testimonials | 以此客户评论               | `<TestimonialCarousel />` |
| Pricing      | 服务计划                   | `<PricingCards />`        |
| FAQ          | 问答 (利于 SEO)            | `<Accordion />`           |
| CTA          | 最终转化                   | `<CallToAction />`        |

---

## 动画模式 (Framer Motion)

| 模式               | 用法               | 实现                                                             |
| ------------------ | ------------------ | ---------------------------------------------------------------- |
| Fade Up            | 标题, 段落         | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| Stagger            | 特性/卡片列表      | 使用带有 `staggerChildren` 的 variants                           |
| Parallax           | 背景图像或浮动元素 | `useScroll` & `useTransform`                                     |
| Micro-interactions | 悬停按钮, 点击效果 | `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}`        |

---

## 设置步骤

1. 初始化项目:

    ```bash
    npx create-next-app@latest my-site --typescript --tailwind --eslint
    # 选择 'Yes' (App Router)
    # 选择 'No' (自定义默认导入别名)
    ```

2. 安装辅助库:

    ```bash
    npm install framer-motion lucide-react clsx tailwind-merge
    # clsx 和 tailwind-merge 帮助更好地处理动态类
    ```

3. 配置 Tailwind v4 (在 `src/app/globals.css` 中):

    ```css
    @import "tailwindcss";

    @theme {
        --color-primary: #3b82f6;
        --font-sans: "Inter", sans-serif;
    }
    ```

4. 开发:
    ```bash
    npm run dev --turbopack
    ```

---

## 部署

| 平台                | 方法            | 重要说明                                    |
| ------------------- | --------------- | ------------------------------------------- |
| Vercel              | Git Push        | 自动检测 Next.js。性能最佳。                |
| GitHub Pages        | GitHub Actions  | 如果不使用自定义域名，需要设置 `basePath`。 |
| AWS S3 / CloudFront | 上传 out 文件夹 | 确保错误文档配置为 `404.html`。             |
| Netlify             | Git Push        | 将构建命令设置为 `npm run build`。          |

---

## 最佳实践 (现代)

- **React Server Components (RSC)**: 默认所有组件为服务端组件。仅在需要状态 (`useState`) 或事件监听器 (`onClick`) 时添加 `'use client'`。
- **图像优化**: 使用 `<Image />` 组件，但对于静态导出请记住 `unoptimized: true`，或使用外部图像 CDN (Cloudinary/Imgix)。
- **字体优化**: 使用 `next/font` (Google Fonts) 自动托管字体并防止布局偏移。
- **响应式**: 移动优先设计，使用 Tailwind 前缀如 `sm:`, `md:`, `lg:`。
