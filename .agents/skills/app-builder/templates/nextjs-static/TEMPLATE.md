---
name: nextjs-static
description: Modern template for Next.js 16, React 19 & Tailwind v4（现代模板）。Optimized for Landing pages（落地页） and Portfolios（作品集）。
---

# Next.js Static Site Template（Modern Edition，现代版）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） | Notes（说明） |
| --- | --- | --- |
| Framework（框架） | Next.js 16+ | App Router（应用路由）、Turbopack、Static Exports（静态导出） |
| Core（核心） | React 19 | Server Components（服务端组件）、New Hooks（新 Hooks）、Compiler（编译器） |
| Language（语言） | TypeScript | Strict Mode（严格模式） |
| Styling（样式） | Tailwind CSS v4 | CSS-first configuration（无 js 配置）、Oxide Engine |
| Animations（动画） | Framer Motion | 布局动画与手势 |
| Icons（图标） | Lucide React | 轻量 SVG 图标 |
| SEO | Metadata API | Native Next.js API（替代 next-seo） |

---

## Directory Structure（目录结构）

Streamlined structure thanks to Tailwind v4（主题配置位于 CSS 内）。

```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Contains root SEO Metadata（根级 SEO 元数据）
│   │   ├── page.tsx      # Landing Page（落地页）
│   │   ├── globals.css   # Import Tailwind v4 & @theme config（导入 Tailwind v4 与 @theme 配置）
│   │   ├── not-found.tsx # Custom 404 page（自定义 404 页面）
│   │   └── (routes)/     # Route groups（路由组，about, contact...）
│   ├── components/
│   │   ├── layout/       # Header, Footer（页头、页脚）
│   │   ├── sections/     # Hero, Features, Pricing, CTA（主视觉、功能亮点、价格方案、CTA）
│   │   └── ui/           # Atomic components（Button, Card）
│   └── lib/
│       └── utils.ts      # Helper functions（cn, formatters）
├── content/              # Markdown/MDX content（内容）
├── public/               # Static assets（images, fonts）
├── next.config.ts        # Next.js Config（TypeScript）
└── package.json
```

---

## Static Export Config（静态导出配置）

Using `next.config.ts` instead of `.js` for better type safety（更好的类型安全）。

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // Required for Static Hosting（S3、GitHub Pages）
  images: { 
    unoptimized: true      // Required if not using Node.js server image optimization（不使用 Node.js 服务器图像优化时必需）
  },
  trailingSlash: true,     // Recommended for SEO and fixing 404s on some hosts（推荐用于 SEO 并修复某些主机 404）
  reactStrictMode: true,
};

export default nextConfig;
```

---

## SEO Implementation（Metadata API）

Deprecated next-seo. Configure directly in layout.tsx or page.tsx（直接在 layout.tsx 或 page.tsx 中配置）。

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Product Name',
    default: 'Home - Product Name',
  },
  description: 'SEO optimized description for the landing page.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mysite.com',
    siteName: 'My Brand',
  },
};
```

---

## Landing Page Sections（落地页模块）

| Section（模块） | Purpose（作用） | Suggested Component（建议组件） |
| --- | --- | --- |
| Hero（主视觉） | First impression, H1 & Main CTA（第一印象、主 CTA） | `<HeroSection />` |
| Features（功能亮点） | Product benefits（Grid/Bento 布局） | `<FeaturesGrid />` |
| Social Proof（社会证明） | Partner logos, User numbers（合作伙伴 Logo、用户数量） | `<LogoCloud />` |
| Testimonials（客户评价） | Customer reviews（用户评价） | `<TestimonialCarousel />` |
| Pricing（价格方案） | Service plans（服务计划） | `<PricingCards />` |
| FAQ（常见问题） | Questions & Answers（利于 SEO） | `<Accordion />` |
| CTA（转化模块） | Final conversion（最终转化） | `<CallToAction />` |

---

## Animation Patterns（Framer Motion）

| Pattern（模式） | Usage（用途） | Implementation（实现） |
| --- | --- | --- |
| Fade Up（淡入上移） | Headlines, paragraphs（标题、段落） | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| Stagger（交错入场） | Lists of Features/Cards（功能/卡片列表） | Use variants with `staggerChildren`（使用 variants） |
| Parallax（视差） | Background images or floating elements（背景图像/浮动元素） | `useScroll` & `useTransform` |
| Micro-interactions（微交互） | Hover buttons, click effects（悬停/点击效果） | `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}` |

---

## Setup Steps（设置步骤）

1. Initialize Project（初始化项目）：
   ```bash
   npx create-next-app@latest my-site --typescript --tailwind --eslint
   # Select "Yes" for App Router（选择 Yes 以启用 App Router）
   # Select "No" for default import alias（选择 No 以保持默认导入别名）
   ```

2. Install Auxiliary Libraries（安装辅助库）：
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   # clsx and tailwind-merge help handle dynamic classes（更好处理动态 class）
   ```

3. Configure Tailwind v4（位于 `src/app/globals.css`）：
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: #3b82f6;
     --font-sans: 'Inter', sans-serif;
   }
   ```

4. Development（开发运行）：
   ```bash
   npm run dev --turbopack
   ```

---

## Deployment（部署）

| Platform（平台） | Method（方式） | Important Notes（重要说明） |
| --- | --- | --- |
| Vercel | Git Push（Git 推送） | Auto-detects Next.js. Best for performance（性能最佳） |
| GitHub Pages | GitHub Actions（工作流） | If not using a custom domain, set `basePath` in `next.config.ts` |
| AWS S3 / CloudFront | Upload out folder（上传 out 文件夹） | Ensure Error Document is configured to `404.html` |
| Netlify | Git Push（Git 推送） | Set build command to `npm run build` |

---

## Best Practices (Modern)（现代最佳实践）

- **React Server Components (RSC)**: Default all components to Server Components（服务端组件）. Only add `'use client'` when you need state (`useState`) or event listeners (`onClick`).
- **Image Optimization（图片优化）**: Use the `<Image />` component but remember `unoptimized: true` for static export or use an external image CDN（Cloudinary/Imgix）.
- **Font Optimization（字体优化）**: Use `next/font`（Google Fonts） to automatically host fonts and prevent layout shift.
- **Responsive（响应式）**: Mobile-first design using Tailwind prefixes like `sm:`, `md:`, `lg:`.
