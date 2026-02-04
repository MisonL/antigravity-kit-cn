# 2. 包体积优化 (Bundle Size Optimization)

> **影响:** 严重 (CRITICAL)
> **重点:** 减小初始包体积可缩短可交互时间 (Time to Interactive) 和最大内容绘制 (LCP)。

---

## 概览

本节包含 **5 条规则**，专注于包体积优化。

---

## 规则 2.1: 避免桶文件 (Barrel File) 导入

**影响:** 严重 (CRITICAL)
**标签:** bundle, imports, tree-shaking, barrel-files, performance

## 避免桶文件 (Barrel File) 导入

直接从源文件导入，而不是从桶文件导入，以避免加载数千个未使用的模块。**桶文件**是重新导出多个模块的入口点 (例如，`index.js` 执行 `export * from './module'`)。

流行的图标和组件库在入口文件中可能有 **多达 10,000 个重新导出**。对于许多 React 包，**仅导入它们就需要 200-800ms**，影响开发速度和生产环境的冷启动。

**为什么 Tree-shaking 没用:** 当库被标记为外部 (不捆绑) 时，捆绑器无法优化它。如果你捆绑它以启用 Tree-shaking，分析整个模块图会使构建变得大大减慢。

**错误示范 (导入整个库):**

```tsx
import { Check, X, Menu } from "lucide-react";
// 加载 1,583 个模块，开发环境额外耗时 ~2.8s
// 运行时成本: 每次冷启动 200-800ms

import { Button, TextField } from "@mui/material";
// 加载 2,225 个模块，开发环境额外耗时 ~4.2s
```

**正确示范 (仅导入你需要的):**

```tsx
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
import Menu from "lucide-react/dist/esm/icons/menu";
// 仅加载 3 个模块 (~2KB vs ~1MB)

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// 仅加载你使用的
```

**替代方案 (Next.js 13.5+):**

```js
// next.config.js - 使用 optimizePackageImports
module.exports = {
    experimental: {
        optimizePackageImports: ["lucide-react", "@mui/material"],
    },
};

// 此时你可以保持便捷的桶文件导入:
import { Check, X, Menu } from "lucide-react";
// 构建时自动转换为直接导入
```

直接导入可提供 15-70% 更快的开发启动速度，28% 更快的构建速度，40% 更快的冷启动速度，以及显著更快的 HMR。

常见受影响的库: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`。

参考: [Next.js 如何优化包导入](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

---

## 规则 2.2: 条件模块加载

**影响:** 高 (HIGH)
**标签:** bundle, conditional-loading, lazy-loading

## 条件模块加载

仅当功能激活时才加载大数据或模块。

**示例 (懒加载动画帧):**

```tsx
function AnimationPlayer({
    enabled,
    setEnabled,
}: {
    enabled: boolean;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [frames, setFrames] = useState<Frame[] | null>(null);

    useEffect(() => {
        if (enabled && !frames && typeof window !== "undefined") {
            import("./animation-frames.js")
                .then((mod) => setFrames(mod.frames))
                .catch(() => setEnabled(false));
        }
    }, [enabled, frames, setEnabled]);

    if (!frames) return <Skeleton />;
    return <Canvas frames={frames} />;
}
```

`typeof window !== 'undefined'` 检查防止了此模块被捆绑到 SSR 中，优化了服务器包体积和构建速度。

---

## 规则 2.3: 推迟非关键的第三方库

**影响:** 中 (MEDIUM)
**标签:** bundle, third-party, analytics, defer

## 推迟非关键的第三方库

分析、日志和错误追踪不会阻塞用户交互。在水合 (Hydration) 之后加载它们。

**错误示范 (阻塞初始包):**

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
```

**正确示范 (水合后加载):**

```tsx
import dynamic from "next/dynamic";

const Analytics = dynamic(
    () => import("@vercel/analytics/react").then((m) => m.Analytics),
    { ssr: false },
);

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
```

---

## 规则 2.4: 对重型组件使用动态导入

**影响:** 严重 (CRITICAL)
**标签:** bundle, dynamic-import, code-splitting, next-dynamic

## 对重型组件使用动态导入

使用 `next/dynamic` 懒加载初始渲染不需要的大型组件。

**错误示范 (Monaco 与主 chunk 捆绑在一起 ~300KB):**

```tsx
import { MonacoEditor } from "./monaco-editor";

function CodePanel({ code }: { code: string }) {
    return <MonacoEditor value={code} />;
}
```

**正确示范 (Monaco 按需加载):**

```tsx
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
    () => import("./monaco-editor").then((m) => m.MonacoEditor),
    { ssr: false },
);

function CodePanel({ code }: { code: string }) {
    return <MonacoEditor value={code} />;
}
```

---

## 规则 2.5: 基于用户意图预加载

**影响:** 中 (MEDIUM)
**标签:** bundle, preload, user-intent, hover

## 基于用户意图预加载

在需要之前预加载繁重的包，以减少感知延迟。

**示例 (悬停/聚焦时预加载):**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
    const preload = () => {
        if (typeof window !== "undefined") {
            void import("./monaco-editor");
        }
    };

    return (
        <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
            Open Editor
        </button>
    );
}
```

**示例 (当功能标志启用时预加载):**

```tsx
function FlagsProvider({ children, flags }: Props) {
    useEffect(() => {
        if (flags.editorEnabled && typeof window !== "undefined") {
            void import("./monaco-editor").then((mod) => mod.init());
        }
    }, [flags.editorEnabled]);

    return (
        <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
    );
}
```

`typeof window !== 'undefined'` 检查防止了预加载模块被捆绑到 SSR 中。
