---
name: nextjs-static
description: 适用于 Next.js 16、React 19 与 Tailwind v4 的现代模板，针对落地页与作品集优化。
---

# Next.js 静态站点模板（现代版）

## 技术栈

| 组件 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | Next.js 16+ | App Router、Turbopack、静态导出 |
| 核心 | React 19 | 服务端组件（Server Components）、新 Hooks（New Hooks）、编译器（Compiler） |
| 语言 | TypeScript | 严格模式（Strict Mode） |
| 样式 | Tailwind CSS v4 | CSS-first 配置（无 js config）、Oxide Engine |
| 动画 | Framer Motion | 布局动画与手势 |
| 图标 | Lucide React | 轻量 SVG 图标 |
| SEO | Metadata API | 原生 Next.js API（替代 next-seo） |

---

## 目录结构

得益于 Tailwind v4（主题配置位于 CSS 内部），结构更精简。

```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # 包含根级 SEO Metadata
│   │   ├── page.tsx      # 落地页
│   │   ├── globals.css   # 导入 Tailwind v4 与 @theme 配置
│   │   ├── not-found.tsx # 自定义 404 页面
│   │   └── (routes)/     # 路由组（about, contact...）
│   ├── components/
│   │   ├── layout/       # 页头、页脚
│   │   ├── sections/     # 主视觉、功能亮点、价格方案、CTA
│   │   └── ui/           # 原子组件（Button, Card）
│   └── lib/
│       └── utils.ts      # 辅助函数（cn, formatters）
├── content/              # Markdown/MDX 内容
├── public/               # 静态资源（images, fonts）
├── next.config.ts        # Next.js 配置（TypeScript）
└── package.json
```

---

## 静态导出配置

使用 `next.config.ts` 代替 `.js`，获得更好的类型安全。

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // 静态托管（S3、GitHub Pages）必需
  images: { 
    unoptimized: true      // 不使用 Node.js 服务器图像优化时必需
  },
  trailingSlash: true,     // 推荐用于 SEO 并修复某些主机 404
  reactStrictMode: true,
};

export default nextConfig;
```

---

## SEO 实现（Metadata API）

弃用 next-seo，直接在 layout.tsx 或 page.tsx 中配置。

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

## 落地页模块

| 模块 | 作用 | 建议组件 |
| --- | --- | --- |
| 主视觉（Hero） | 第一印象，H1 与主 CTA | `<HeroSection />` |
| 功能亮点（Features） | 产品优势（Grid/Bento） | `<FeaturesGrid />` |
| 社会证明（Social Proof） | 合作伙伴 Logo、用户数量 | `<LogoCloud />` |
| 客户评价（Testimonials） | 用户评价 | `<TestimonialCarousel />` |
| 价格方案（Pricing） | 服务计划 | `<PricingCards />` |
| 常见问题（FAQ） | 问答（利于 SEO） | `<Accordion />` |
| 转化模块（CTA） | 最终转化 | `<CallToAction />` |

---

## 动画模式（Framer Motion）

| 模式 | 用途 | 实现 |
| --- | --- | --- |
| 淡入上移（Fade Up） | 标题、段落 | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| 交错入场（Stagger） | 功能/卡片列表 | 使用带有 `staggerChildren` 的 variants |
| 视差（Parallax） | 背景图像或浮动元素 | `useScroll` & `useTransform` |
| 微交互（Micro-interactions） | 悬停按钮、点击效果 | `whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}` |

---

## 设置步骤

1. 初始化项目：
   ```bash
   npx create-next-app@latest my-site --typescript --tailwind --eslint
   # 选择 “Yes”（App Router）
   # 选择 “No”（是否自定义默认导入别名）
   ```

2. 安装辅助库：
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   # clsx 与 tailwind-merge 用于更好地处理动态 class
   ```

3. 配置 Tailwind v4（位于 `src/app/globals.css`）：
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary: #3b82f6;
     --font-sans: 'Inter', sans-serif;
   }
   ```

4. 开发运行：
   ```bash
   npm run dev --turbopack
   ```

---

## 部署

| 平台 | 方式 | 重要说明 |
| --- | --- | --- |
| Vercel | Git Push（Git 推送） | 自动检测 Next.js，性能最佳 |
| GitHub Pages | GitHub Actions（工作流） | 若非自定义域名，需要在 `next.config.ts` 设置 `basePath` |
| AWS S3 / CloudFront | 上传 out 文件夹 | 确保错误文档（Error Document）配置为 `404.html` |
| Netlify | Git Push（Git 推送） | 构建命令设为 `npm run build` |

---

## 现代最佳实践

- **React Server Components（RSC）**：默认所有组件为 Server Components（服务端组件）。仅在需要状态（`useState`）或事件监听（`onClick`）时添加 `'use client'`。
- **图片优化（Image Optimization）**：使用 `<Image />`，静态导出需设置 `unoptimized: true`，或改用外部图片 CDN（Cloudinary/Imgix）。
- **字体优化（Font Optimization）**：使用 `next/font`（Google Fonts）自动托管字体并避免布局抖动。
- **响应式（Responsive）**：移动优先，使用 Tailwind 前缀如 `sm:`、`md:`、`lg:`。
