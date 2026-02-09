---
name: nextjs-static
description: Next.js 16、React 19 与 Tailwind v4 的现代模板。针对落地页与作品集优化。
---

# Next.js Static Site Template（现代版）

## Tech Stack（技术栈）

| Component | Technology | Notes |
| --- | --- | --- |
| Framework（框架） | Next.js 16+ | App Router（应用路由）、Turbopack、Static Exports（静态导出） |
| Core（核心） | React 19 | Server Components（服务端组件）、New Hooks（新 Hooks）、Compiler（编译器） |
| Language（语言） | TypeScript | Strict Mode（严格模式） |
| Styling（样式） | Tailwind CSS v4 | CSS-first 配置（无 js config / 无配置文件）、Oxide Engine（氧化引擎） |
| Animations（动画） | Framer Motion | 布局动画与手势 |
| Icons（图标） | Lucide React | 轻量 SVG 图标 |
| SEO | Metadata API | 原生 Next.js API（替代 next-seo） |

---

## Directory Structure（目录结构）

得益于 Tailwind v4（主题配置位于 CSS 内部），结构更精简。

```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # 包含根 SEO Metadata
│   │   ├── page.tsx      # Landing Page
│   │   ├── globals.css   # 导入 Tailwind v4 与 @theme 配置
│   │   ├── not-found.tsx # 自定义 404 页面
│   │   └── (routes)/     # 路由组（about, contact...）
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Hero, Features, Pricing, CTA
│   │   └── ui/           # Atomic components（Button, Card）
│   └── lib/
│       └── utils.ts      # Helper functions（cn, formatters）
├── content/              # Markdown/MDX content
├── public/               # Static assets（images, fonts）
├── next.config.ts        # Next.js Config（TypeScript）
└── package.json
```

---

## Static Export Config（静态导出配置）

使用 `next.config.ts` 代替 `.js`，获得更好的类型安全。

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // 静态托管（S3, GitHub Pages）必需
  images: {
    unoptimized: true      // 不使用 Node.js 服务器图像优化时必需
  },
  trailingSlash: true,     // 推荐用于 SEO 并修复某些主机 404
  reactStrictMode: true,
};

export default nextConfig;
```

---

## SEO Implementation（Metadata API）

弃用 next-seo，直接在 layout.tsx 或 page.tsx 中配置。

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

## Landing Page Sections（落地页模块）

| Section | Purpose | Suggested Component |
| --- | --- | --- |
| Hero | 第一印象，H1 与主 CTA | `<HeroSection />` |
| Features | 产品优势（Grid/Bento） | `<FeaturesGrid />` |
| Social Proof | 合作伙伴 Logo、用户数量 | `<LogoCloud />` |
| Testimonials | 用户评价 | `<TestimonialCarousel />` |
| Pricing | 服务计划 | `<PricingCards />` |
| FAQ | 问答（利于 SEO） | `<Accordion />` |
| CTA | 最终转化 | `<CallToAction />` |

---

## Animation Patterns（Framer Motion）

| Pattern | Usage | Implementation |
| --- | --- | --- |
| Fade Up | 标题、段落 | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| Stagger | Features/Cards 列表 | 使用带有 `staggerChildren` 的 variants |
| Parallax | 背景图像或浮动元素 | `useScroll` & `useTransform` |
| Micro-interactions | 悬停按钮、点击效果 | `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}` |

---

## Setup Steps（设置步骤）

1. Initialize Project（初始化项目）:
   ```bash
   npx create-next-app@latest my-site --typescript --tailwind --eslint
   # 选择 “Yes”（App Router）
   # 选择 “No”（Would you like to customize the default import alias? / 是否自定义默认导入别名）
   ```

2. Install Auxiliary Libraries（安装辅助库）:
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   # clsx 和 tailwind-merge 用于更好地处理动态 class
   ```

3. Configure Tailwind v4（`src/app/globals.css`）:
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: #3b82f6;
     --font-sans: "Inter", sans-serif;
   }
   ```

4. Development（开发运行）:
   ```bash
   npm run dev --turbopack
   ```

---

## Deployment（部署）

| Platform | Method | Important Notes |
| --- | --- | --- |
| Vercel | Git Push | 自动检测 Next.js，性能最佳 |
| GitHub Pages | GitHub Actions | 若非自定义域名，需要在 `next.config.ts` 设置 `basePath` |
| AWS S3 / CloudFront | Upload out folder | 确保 Error Document 配置为 `404.html` |
| Netlify | Git Push | Build 命令设为 `npm run build` |
