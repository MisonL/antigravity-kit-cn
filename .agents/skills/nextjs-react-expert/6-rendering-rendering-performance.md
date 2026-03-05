# 6. 渲染性能 (Rendering Performance)

> **影响:** 中 (MEDIUM)
> **重点:** 优化渲染过程可以减少浏览器需要执行的工作量。

---

## 概览

本节包含 **9 条规则**，聚焦渲染性能。

---

## 规则 6.1：优先动画化 SVG 外层容器，而非 SVG 元素本身

**影响:** 低 (LOW)  
**标签:** rendering, svg, css, animation, performance  

## 优先动画化 SVG 外层容器，而非 SVG 元素本身

许多浏览器对 SVG 元素上的 CSS3 动画缺少硬件加速。应将 SVG 包裹在 `<div>` 中，并对外层容器做动画。

**错误示例（直接对 SVG 动画，无硬件加速）：**

```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**正确示例（对外层 div 动画，可硬件加速）：**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

这适用于所有 CSS transform/transition（`transform`、`opacity`、`translate`、`scale`、`rotate`）。外层容器能让浏览器更容易走 GPU 加速路径，动画更流畅。

---

## 规则 6.2：长列表使用 CSS `content-visibility`

**影响:** 高 (HIGH)  
**标签:** rendering, css, content-visibility, long-lists  

## 长列表使用 CSS `content-visibility`

应用 `content-visibility: auto` 来延迟屏幕外内容的渲染。

**CSS：**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**示例：**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

在 1000 条消息场景中，浏览器可跳过约 990 个屏幕外项的 layout/paint，首屏渲染可提升约 10 倍。

---

## 规则 6.3：提升（Hoist）静态 JSX 元素

**影响:** 低 (LOW)  
**标签:** rendering, jsx, static, optimization  

## 提升（Hoist）静态 JSX 元素

把静态 JSX 抽离到组件外部，避免每次渲染都重新创建。

**错误示例（每次渲染都重建元素）：**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

**正确示例（复用同一个元素）：**

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

这对大型静态 SVG 节点尤其有价值，因为它们在每次渲染中重建成本较高。

**说明：** 若项目启用 [React Compiler](https://react.dev/learn/react-compiler)，编译器会自动提升静态 JSX 并优化重渲染，通常无需手动 hoist。

---

## 规则 6.4：优化 SVG 精度

**影响:** 低 (LOW)  
**标签:** rendering, svg, optimization, svgo  

## 优化 SVG 精度

降低 SVG 坐标精度可减小文件体积。最佳精度与 viewBox 大小相关，但通常都应评估是否可降精度。

**错误示例（精度过高）：**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**正确示例（保留 1 位小数）：**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**使用 SVGO 自动化：**

```bash
npx svgo --precision=1 --multipass icon.svg
```

---

## 规则 6.5：无闪烁地避免 Hydration 不匹配

**影响:** 中 (MEDIUM)  
**标签:** rendering, ssr, hydration, localStorage, flicker  

## 无闪烁地避免 Hydration 不匹配

当渲染依赖客户端存储（localStorage、cookies）时，可注入同步脚本，在 React hydration 前更新 DOM，以同时避免 SSR 崩溃和 hydration 后闪烁。

**错误示例（会破坏 SSR）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage 在服务端不可用，会抛错
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

由于 `localStorage` 在服务端为 undefined，服务端渲染会失败。

**错误示例（出现视觉闪烁）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // 在 hydration 后执行，会造成明显闪烁
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

组件先以默认值（`light`）渲染，hydration 后再更新，会出现错误内容的闪现。

**正确示例（无闪烁、无 hydration 不匹配）：**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
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
  )
}
```

内联脚本会在元素展示前同步执行，确保 DOM 已经具备正确值，因此不会闪烁，也不会出现 hydration 不匹配。

这种模式特别适合主题切换、用户偏好、认证状态，以及其他需要“立即正确渲染”的纯客户端数据。

---

## 规则 6.6：抑制可预期的 Hydration 不匹配

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** rendering, hydration, ssr, nextjs  

## 抑制可预期的 Hydration 不匹配

在 SSR 框架（如 Next.js）中，某些值本就会在服务端与客户端不同（随机 ID、日期、本地化/时区格式等）。对于这类“可预期”不匹配，可用 `suppressHydrationWarning` 包裹动态文本以避免噪声告警。不要用它掩盖真实 Bug，也不要滥用。

**错误示例（会产生已知不匹配告警）：**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**正确示例（仅抑制可预期不匹配）：**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

---

## 规则 6.7：显示/隐藏场景使用 Activity 组件

**影响:** 中 (MEDIUM)  
**标签:** rendering, activity, visibility, state-preservation  

## 显示/隐藏场景使用 Activity 组件

对于频繁切换可见性且渲染代价高的组件，使用 React 的 `<Activity>` 保留其 state/DOM。

**用法：**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

可避免高成本重渲染和状态丢失。

---

## 规则 6.8：使用显式条件渲染

**影响:** 低 (LOW)  
**标签:** rendering, conditional, jsx, falsy-values  

## 使用显式条件渲染

当条件值可能为 `0`、`NaN` 或其他可被渲染的 falsy 值时，应使用三元表达式（`? :`）而非 `&&`。

**错误示例（count 为 0 时会渲染出 "0"）：**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// count = 0 时渲染：<div>0</div>
// count = 5 时渲染：<div><span class="badge">5</span></div>
```

**正确示例（count 为 0 时不渲染内容）：**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// count = 0 时渲染：<div></div>
// count = 5 时渲染：<div><span class="badge">5</span></div>
```

---

## 规则 6.9：优先使用 useTransition，而不是手动 Loading State

**影响:** 低 (LOW)  
**标签:** rendering, transitions, useTransition, loading, state  

## 优先使用 useTransition，而不是手动 Loading State

用 `useTransition` 替代手写 `useState` 的 loading 管理。它提供内建 `isPending`，并自动处理 transition 生命周期。

**错误示例（手动维护 loading 状态）：**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**正确示例（使用 useTransition 的内建 pending 状态）：**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // 立即更新输入框
    
    startTransition(async () => {
      // 拉取并更新结果
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**收益：**

- **自动 pending 状态**：无需手动 `setIsLoading(true/false)`
- **更强容错**：即使 transition 抛错，pending 状态也能正确复位
- **更好响应性**：更新过程中 UI 更流畅
- **中断处理**：新 transition 会自动中断旧的等待流程

参考： [useTransition](https://react.dev/reference/react/useTransition)
