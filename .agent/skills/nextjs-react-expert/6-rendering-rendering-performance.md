# 6. 渲染性能 (Rendering Performance)

> **影响:** 中 (MEDIUM)
> **重点:** 优化渲染过程可减少浏览器需要做的工作。

---

## 概览

本节包含 **9 条规则**，专注于渲染性能。

---

## 规则 6.1: 动画化 SVG 包装器而不是 SVG 元素

**影响:** 低 (LOW)
**标签:** rendering, svg, css, animation, performance

## 动画化 SVG 包装器而不是 SVG 元素

许多浏览器没有针对 SVG 元素的 CSS3 动画硬件加速。将 SVG 包裹在 `<div>` 中并动画化包装器。

**错误示范 (直接动画化 SVG - 无硬件加速):**

```tsx
function LoadingSpinner() {
    return (
        <svg
            className="animate-spin"
            //...
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
        </svg>
    );
}
```

**正确示范 (动画化包装 div - 硬件加速):**

```tsx
function LoadingSpinner() {
    return (
        <div className="animate-spin">
            <svg
            //...
            >
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
            </svg>
        </div>
    );
}
```

这就适用于所有 CSS 变换和过渡 (`transform`, `opacity`, `translate`, `scale`, `rotate`)。包装 div 允许浏览器使用 GPU 加速以获得更流畅的动画。

---

## 规则 6.2: 对长列表使用 CSS content-visibility

**影响:** 高 (HIGH)
**标签:** rendering, css, content-visibility, long-lists

## 对长列表使用 CSS content-visibility

应用 `content-visibility: auto` 以推迟屏幕外渲染。

**CSS:**

```css
.message-item {
    content-visibility: auto;
    contain-intrinsic-size: 0 80px;
}
```

对于 1000 条消息，浏览器会跳过 ~990 个屏幕外项目的布局/绘制 (初始渲染快 10 倍)。

---

## 规则 6.3: 提升静态 JSX 元素 (Hoist Static JSX Elements)

**影响:** 低 (LOW)
**标签:** rendering, jsx, static, optimization

## 提升静态 JSX 元素

将静态 JSX 提取到组件外部以避免重新创建。

**错误示范 (每次渲染都重建元素):**

```tsx
function LoadingSkeleton() {
    return <div className="animate-pulse h-20 bg-gray-200" />;
}

function Container() {
    return <div>{loading && <LoadingSkeleton />}</div>;
}
```

**正确示范 (复用相同元素):**

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />;

function Container() {
    return <div>{loading && loadingSkeleton}</div>;
}
```

这对于大型且静态的 SVG 节点特别有用，因为每次渲染都重建它们可能很昂贵。

**注意:** 如果你的项目启用了 [React Compiler](https://react.dev/learn/react-compiler)，则不需要手动提升。

---

## 规则 6.4: 优化 SVG 精度

**影响:** 低 (LOW)
**标签:** rendering, svg, optimization, svgo

## 优化 SVG 精度

降低 SVG 坐标精度以减小文件大小。最佳精度取决于 viewBox 大小，但通常应考虑降低精度。

**错误示范 (过高精度):**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**正确示范 (1 位小数):**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**使用 SVGO 自动化:**

```bash
npx svgo --precision=1 --multipass icon.svg
```

---

## 规则 6.5: 防止水合不匹配且无闪烁

**影响:** 中 (MEDIUM)
**标签:** rendering, ssr, hydration, localStorage, flicker

## 防止水合不匹配且无闪烁

当渲染依赖于客户端存储 (localStorage, cookies) 的内容时，通过注入同步脚本在 React 水合之前更新 DOM，以避免 SSR 破坏和水合后闪烁。

**错误示范 (破坏 SSR):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
    // localStorage 在服务器上不可用 - 抛出错误
    const theme = localStorage.getItem("theme") || "light";

    return <div className={theme}>{children}</div>;
}
```

**错误示范 (视觉闪烁):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // 水合后运行 - 导致可见闪烁
        const stored = localStorage.getItem("theme");
        if (stored) {
            setTheme(stored);
        }
    }, []);

    return <div className={theme}>{children}</div>;
}
```

**正确示范 (无闪烁，无水合不匹配):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
    return (
        <>
            <div id="theme-wrapper">{children}</div>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
                }}
            />
        </>
    );
}
```

内联脚本在显示元素之前同步执行，确保 DOM 已经具有正确的值。

---

## 规则 6.6: 抑制预期的水合不匹配

**影响:** 中低 (LOW-MEDIUM)
**标签:** rendering, hydration, ssr, nextjs

## 抑制预期的水合不匹配

在 SSR 框架 (如 Next.js) 中，某些值在服务器与客户端上故意不同 (随机 ID、日期、本地化/时区格式)。对于这些**预期的**不匹配，将动态文本包裹在具有 `suppressHydrationWarning` 的元素中，以防止噪音警告。不要用这个来隐藏真正的 Bug。不要滥用它。

**错误示范 (已知不匹配警告):**

```tsx
function Timestamp() {
    return <span>{new Date().toLocaleString()}</span>;
}
```

**正确示范 (仅抑制预期不匹配):**

```tsx
function Timestamp() {
    return <span suppressHydrationWarning>{new Date().toLocaleString()}</span>;
}
```

---

## 规则 6.7: 使用 Activity 组件进行显示/隐藏

**影响:** 中 (MEDIUM)
**标签:** rendering, activity, visibility, state-preservation

## 使用 Activity 组件进行显示/隐藏

使用 React 的 `<Activity>` 来保留昂贵组件的状态/DOM，这些组件频繁切换可见性。

**用法:**

```tsx
import { Activity } from "react";

function Dropdown({ isOpen }: Props) {
    return (
        <Activity mode={isOpen ? "visible" : "hidden"}>
            <ExpensiveMenu />
        </Activity>
    );
}
```

避免昂贵的重渲染和状态丢失。

---

## 规则 6.8: 使用显式条件渲染

**影响:** 低 (LOW)
**标签:** rendering, conditional, jsx, falsy-values

## 使用显式条件渲染

当条件可能为 `0`、`NaN` 或其他会渲染的假值时，使用显式三元运算符 (`? :`) 而不是 `&&` 进行条件渲染。

**错误示范 (当 count 为 0 时渲染 "0"):**

```tsx
function Badge({ count }: { count: number }) {
    return <div>{count && <span className="badge">{count}</span>}</div>;
}
// 当 count = 0 时渲染: <div>0</div>
```

**正确示范 (当 count 为 0 时不渲染):**

```tsx
function Badge({ count }: { count: number }) {
    return (
        <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>
    );
}
// 当 count = 0 时渲染: <div></div>
```

---

## 规则 6.9: 使用 useTransition 代替手动 Loading 状态

**影响:** 低 (LOW)
**标签:** rendering, transitions, useTransition, loading, state

## 使用 useTransition 代替手动 Loading 状态

使用 `useTransition` 代替手动 `useState` 来管理加载状态。这提供了内置的 `isPending` 状态并自动管理过渡。

**正确示范 (使用内置 pending 状态的 useTransition):**

```tsx
import { useTransition, useState } from "react";

function SearchResults() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        setQuery(value); // 立即更新输入

        startTransition(async () => {
            // 获取并更新结果
            const data = await fetchResults(value);
            setResults(data);
        });
    };

    return (
        <>
            <input onChange={(e) => handleSearch(e.target.value)} />
            {isPending && <Spinner />}
            <ResultsList results={results} />
        </>
    );
}
```

**益处:**

- **自动 pending 状态**: 无需手动管理 `setIsLoading(true/false)`
- **错误恢复**: 即使转换抛出异常，Pending 状态也能正确重置
- **更好的响应性**: 在更新期间保持 UI 响应
- **中断处理**: 新的转换会自动取消挂起的转换
