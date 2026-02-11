# 5. 重渲染优化 (Re-render Optimization)

> **影响:** 中 (MEDIUM)
> **重点:** 减少不必要的重渲染，降低无效计算并提升 UI 响应性。

---

## 概览

本节包含 **12 条规则**，聚焦重渲染优化。

---

## 规则 5.1：在渲染阶段计算派生状态

**影响:** 中 (MEDIUM)  
**标签:** rerender, derived-state, useEffect, state  

## 在渲染阶段计算派生状态

如果一个值可以由当前 props/state 直接计算得到，就不要再把它存进 state，或通过 effect 去更新它。应在渲染阶段直接派生，避免额外渲染和状态漂移。不要仅因为 prop 变化就在 effect 里 setState；优先使用派生值或基于 key 的重置。

**错误示例（冗余 state + effect）：**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**正确示例（渲染时直接派生）：**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

参考： [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

## 规则 5.2：将状态读取延后到实际使用点

**影响:** 中 (MEDIUM)  
**标签:** rerender, searchParams, localStorage, optimization  

## 将状态读取延后到实际使用点

如果你只在回调里读取动态状态（如 searchParams、localStorage），就不要为其建立订阅。

**错误示例（会订阅所有 searchParams 变化）：**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**正确示例（按需读取，不订阅）：**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

---

## 规则 5.3：简单原始类型表达式不要用 useMemo 包裹

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** rerender, useMemo, optimization  

## 简单原始类型表达式不要用 useMemo 包裹

当表达式本身很简单（仅少量逻辑或算术运算），且返回原始类型（boolean、number、string）时，不要用 `useMemo` 包裹。调用 `useMemo` 及比较依赖项的开销，可能比表达式本身更高。

**错误示例：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

**正确示例：**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```

---

## 规则 5.4：将 memo 组件中的非原始默认参数提取为常量

**影响:** 中 (MEDIUM)  
**标签:** rerender, memo, optimization  

## 将 memo 组件中的非原始默认参数提取为常量

当 memo 组件的可选参数默认值是非原始类型（数组、函数、对象）时，若调用组件时省略该参数，可能导致 memo 失效。原因是每次重渲染都会创建新实例，无法通过 `memo()` 的严格相等比较。

解决方式是把默认值提取到组件外的常量中。

**错误示例（`onClick` 每次重渲染值都不同）：**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**正确示例（稳定默认值）：**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

---

## 规则 5.5：将重计算逻辑提取到 memo 组件

**影响:** 中 (MEDIUM)  
**标签:** rerender, memo, useMemo, optimization  

## 将重计算逻辑提取到 memo 组件

把开销较大的计算提取到 memo 组件中，便于在计算前提前返回。

**错误示例（即使 loading 也计算 avatar）：**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**正确示例（loading 时跳过计算）：**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**说明：** 若项目启用 [React Compiler](https://react.dev/learn/react-compiler)，通常无需手写 `memo()` 与 `useMemo()`；编译器会自动优化重渲染。

---

## 规则 5.6：收窄 Effect 依赖

**影响:** 低 (LOW)  
**标签:** rerender, useEffect, dependencies, optimization  

## 收窄 Effect 依赖

优先依赖原始值，而非对象整体，以减少 effect 的重复执行。

**错误示例（user 任意字段变化都会重跑）：**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**正确示例（仅 id 变化时重跑）：**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**派生状态应在 effect 外计算：**

```tsx
// 错误示例：width=767、766、765...都会运行
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// 正确示例：仅在布尔值切换时运行
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

---

## 规则 5.7：交互逻辑应放在事件处理器中

**影响:** 中 (MEDIUM)  
**标签:** rerender, useEffect, events, side-effects, dependencies  

## 交互逻辑应放在事件处理器中

如果副作用由明确的用户操作触发（提交、点击、拖拽），就应放在对应事件处理器里执行。不要建模成“state + effect”，这会让 effect 因无关变化重跑，甚至重复触发动作。

**错误示例（把事件建模成 state + effect）：**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**正确示例（在 handler 中直接执行）：**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

参考： [Should this code move to an event handler?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

---

## 规则 5.8：订阅派生状态而非连续值

**影响:** 中 (MEDIUM)  
**标签:** rerender, derived-state, media-query, optimization  

## 订阅派生状态而非连续值

用派生布尔状态替代连续值订阅，可以降低重渲染频率。

**错误示例（每个像素变化都会重渲染）：**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**正确示例（仅布尔值切换时重渲染）：**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

---

## 规则 5.9：使用函数式 setState 更新

**影响:** 中 (MEDIUM)  
**标签:** react, hooks, useState, useCallback, callbacks, closures  

## 使用函数式 setState 更新

当状态更新依赖当前状态值时，应使用 setState 的函数式写法，而不是直接引用外层状态变量。这样可以避免过期闭包、减少不必要依赖，并让回调引用更稳定。

**错误示例（必须把 state 放进依赖）：**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // 回调必须依赖 items，items 每次变化都会重建
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ 依赖 items 会导致频繁重建
  
  // 若漏掉依赖会有过期闭包风险
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ 缺少 items 依赖，会读取过期 items
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

第一个回调会在 `items` 每次变化时重建，可能导致子组件不必要重渲染。第二个回调存在过期闭包缺陷，会始终引用初始 `items` 值。

**正确示例（回调稳定、无过期闭包）：**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // 稳定回调，不会被重建
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ 无需依赖
  
  // 总能读取最新状态，无过期闭包风险
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ 安全且稳定
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**收益：**

1. **回调引用稳定**：state 变化时不必重建回调
2. **避免过期闭包**：始终基于最新状态计算
3. **减少依赖复杂度**：依赖数组更简洁，降低隐性问题
4. **减少 Bug**：规避常见 React 闭包问题来源

**适用场景：**

- 任何依赖当前 state 的 setState 更新
- 在 useCallback/useMemo 中需要读取 state
- 事件处理器内引用 state
- 异步流程里更新 state

**可直接赋值的场景：**

- 设置静态值：`setCount(0)`
- 仅由 props/参数得出：`setName(newName)`
- 更新不依赖前值

**说明：** 即使启用 [React Compiler](https://react.dev/learn/react-compiler) 可自动优化部分场景，函数式更新仍推荐用于保证正确性并避免过期闭包。

---

## 规则 5.10：使用惰性状态初始化

**影响:** 中 (MEDIUM)  
**标签:** react, hooks, useState, performance, initialization  

## 使用惰性状态初始化

对于初始化开销较大的 state，应向 `useState` 传函数。若直接传表达式，初始化逻辑会在每次渲染时执行，尽管初始化值只会被用一次。

**错误示例（每次渲染都会运行）：**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() 每次渲染都会执行，即使初始化早已完成
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // query 变化时，buildSearchIndex 仍会被不必要地再次执行
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse 每次渲染都会执行
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**正确示例（只执行一次）：**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() 仅在首次渲染执行
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse 仅在首次渲染执行
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

当初始值来自 localStorage/sessionStorage、需要构建索引/映射等数据结构、读取 DOM 或做重计算转换时，优先用惰性初始化。

对于简单原始值（`useState(0)`）、直接引用（`useState(props.value)`）或廉价字面量（`useState({})`），无需函数形式。

---

## 规则 5.11：对非紧急更新使用 Transition

**影响:** 中 (MEDIUM)  
**标签:** rerender, transitions, startTransition, performance  

## 对非紧急更新使用 Transition

将高频但非紧急的状态更新标记为 transition，保持界面响应流畅。

**错误示例（每次滚动都阻塞 UI）：**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**正确示例（非阻塞更新）：**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

---

## 规则 5.12：临时值使用 useRef

**影响:** 中 (MEDIUM)  
**标签:** rerender, useref, state, performance  

## 临时值使用 useRef

当某个值变化频繁，且你不希望每次变化都触发重渲染（例如鼠标追踪、定时器、瞬时标记）时，应使用 `useRef`，而不是 `useState`。组件 state 用于驱动 UI，ref 用于临时、贴近 DOM 的值。更新 ref 不会触发重渲染。

**错误示例（每次更新都重渲染）：**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```



**正确示例（追踪更新不触发重渲染）：**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```
