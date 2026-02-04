# 5. 重渲染优化 (Re-render Optimization)

> **影响:** 中 (MEDIUM)
> **重点:** 减少不必要的重渲染可最大限度地减少浪费的计算并提高 UI 响应能力。

---

## 概览

本节包含 **12 条规则**，专注于重渲染优化。

---

## 规则 5.1: 在渲染期间计算派生状态

**影响:** 中 (MEDIUM)
**标签:** rerender, derived-state, useEffect, state

## 在渲染期间计算派生状态

如果一个值可以从当前的 props/state 计算出来，不要将其存储在 state 中或在 effect 中更新。在渲染期间派生它，以避免额外的渲染和状态漂移。不要仅为了响应 prop 更改而在 effect 中设置 state；首选派生值或带 key 的重置。

**错误示范 (多余的 state 和 effect):**

```tsx
function Form() {
    const [firstName, setFirstName] = useState("First");
    const [lastName, setLastName] = useState("Last");
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        setFullName(firstName + " " + lastName);
    }, [firstName, lastName]);

    return <p>{fullName}</p>;
}
```

**正确示范 (渲染期间派生):**

```tsx
function Form() {
    const [firstName, setFirstName] = useState("First");
    const [lastName, setLastName] = useState("Last");
    const fullName = firstName + " " + lastName;

    return <p>{fullName}</p>;
}
```

参考: [你可能不需要 Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

## 规则 5.2: 将状态读取推迟到使用点

**影响:** 中 (MEDIUM)
**标签:** rerender, searchParams, localStorage, optimization

## 将状态读取推迟到使用点

如果你只在那调函数内部读取动态状态 (searchParams, localStorage)，不要订阅它。

**错误示范 (订阅所有 searchParams 更改):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
    const searchParams = useSearchParams();

    const handleShare = () => {
        const ref = searchParams.get("ref");
        shareChat(chatId, { ref });
    };

    return <button onClick={handleShare}>Share</button>;
}
```

**正确示范 (按需读取，无订阅):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
    const handleShare = () => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        shareChat(chatId, { ref });
    };

    return <button onClick={handleShare}>Share</button>;
}
```

---

## 规则 5.3: 不要将具有原始结果类型的简单表达式包裹在 useMemo 中

**影响:** 中低 (LOW-MEDIUM)
**标签:** rerender, useMemo, optimization

## 不要将具有原始结果类型的简单表达式包裹在 useMemo 中

当表达式很简单 (很少的逻辑或算术运算符) 并且具有原始结果类型 (boolean, number, string) 时，不要将其包裹在 `useMemo` 中。
调用 `useMemo` 和比较 hook 依赖项可能会比表达式本身消耗更多的资源。

**错误示范:**

```tsx
function Header({ user, notifications }: Props) {
    const isLoading = useMemo(() => {
        return user.isLoading || notifications.isLoading;
    }, [user.isLoading, notifications.isLoading]);

    if (isLoading) return <Skeleton />;
    // return some markup
}
```

**正确示范:**

```tsx
function Header({ user, notifications }: Props) {
    const isLoading = user.isLoading || notifications.isLoading;

    if (isLoading) return <Skeleton />;
    // return some markup
}
```

---

## 规则 5.4: 从 Memoized 组件中提取默认非原始参数值到常量

**影响:** 中 (MEDIUM)
**标签:** rerender, memo, optimization

## 从 Memoized 组件中提取默认非原始参数值到常量

当 Memoized 组件对某些非原始可选参数 (如数组、函数或对象) 具有默认值时，如果不带该参数调用组件，会导致 Memoization 失效。这是因为每次重渲染都会创建新的值实例，它们无法通过 `memo()` 中的严格相等比较。

为了解决这个问题，将默认值提取到常量中。

**错误示范 (`onClick` 在每次重渲染时都有不同的值):**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// 不带可选 onClick 使用
<UserAvatar />
```

**正确示范 (稳定的默认值):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// 不带可选 onClick 使用
<UserAvatar />
```

---

## 规则 5.5: 提取到 Memoized 组件

**影响:** 中 (MEDIUM)
**标签:** rerender, memo, useMemo, optimization

## 提取到 Memoized 组件

将昂贵的工作提取到 Memoized 组件中，以便在计算之前尽早返回。

**错误示范 (即使在加载时也计算头像):**

```tsx
function Profile({ user, loading }: Props) {
    const avatar = useMemo(() => {
        const id = computeAvatarId(user);
        return <Avatar id={id} />;
    }, [user]);

    if (loading) return <Skeleton />;
    return <div>{avatar}</div>;
}
```

**正确示范 (加载时跳过计算):**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
    const id = useMemo(() => computeAvatarId(user), [user]);
    return <Avatar id={id} />;
});

function Profile({ user, loading }: Props) {
    if (loading) return <Skeleton />;
    return (
        <div>
            <UserAvatar user={user} />
        </div>
    );
}
```

**注意:** 如果你的项目启用了 [React Compiler](https://react.dev/learn/react-compiler)，则不需要使用 `memo()` 和 `useMemo()` 进行手动记忆化。编译器会自动优化重渲染。

---

## 规则 5.6: 缩小 Effect 依赖范围

**影响:** 低 (LOW)
**标签:** rerender, useEffect, dependencies, optimization

## 缩小 Effect 依赖范围

指定原始类型依赖项而不是对象，以最大限度地减少 Effect 重新运行。

**错误示范 (任何用户字段更改都会重新运行):**

```tsx
useEffect(() => {
    console.log(user.id);
}, [user]);
```

**正确示范 (仅当 id 更改时重新运行):**

```tsx
useEffect(() => {
    console.log(user.id);
}, [user.id]);
```

**对于派生状态，在 Effect 外部计算:**

```tsx
// 错误: 在 width=767, 766, 765... 时都会运行
useEffect(() => {
    if (width < 768) {
        enableMobileMode();
    }
}, [width]);

// 正确: 仅在布尔值转变时运行
const isMobile = width < 768;
useEffect(() => {
    if (isMobile) {
        enableMobileMode();
    }
}, [isMobile]);
```

---

## 规则 5.7: 将交互逻辑放在事件处理程序中

**影响:** 中 (MEDIUM)
**标签:** rerender, useEffect, events, side-effects, dependencies

## 将交互逻辑放在事件处理程序中

如果副作用是由特定的用户操作 (提交、点击、拖动) 触发的，请在该事件处理程序中运行它。不要将操作建模为 state + effect；这会使 effects 在无关紧要的更改上重新运行，并可能重复操作。

**错误示范 (事件被建模为 state + effect):**

```tsx
function Form() {
    const [submitted, setSubmitted] = useState(false);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (submitted) {
            post("/api/register");
            showToast("Registered", theme);
        }
    }, [submitted, theme]);

    return <button onClick={() => setSubmitted(true)}>Submit</button>;
}
```

**正确示范 (在处理程序中做):**

```tsx
function Form() {
    const theme = useContext(ThemeContext);

    function handleSubmit() {
        post("/api/register");
        showToast("Registered", theme);
    }

    return <button onClick={handleSubmit}>Submit</button>;
}
```

参考: [这段代码应该移到事件处理程序吗？](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

---

## 规则 5.8: 订阅派生状态

**影响:** 中 (MEDIUM)
**标签:** rerender, derived-state, media-query, optimization

## 订阅派生状态

订阅派生的布尔状态而不是连续值，以减少重渲染频率。

**错误示范 (每像素变化都重渲染):**

```tsx
function Sidebar() {
    const width = useWindowWidth(); // 持续更新
    const isMobile = width < 768;
    return <nav className={isMobile ? "mobile" : "desktop"} />;
}
```

**正确示范 (仅当布尔值变更时重渲染):**

```tsx
function Sidebar() {
    const isMobile = useMediaQuery("(max-width: 767px)");
    return <nav className={isMobile ? "mobile" : "desktop"} />;
}
```

---

## 规则 5.9: 使用函数式 setState 更新

**影响:** 中 (MEDIUM)
**标签:** react, hooks, useState, useCallback, callbacks, closures

## 使用函数式 setState 更新

当基于当前 state 值更新 state 时，使用 setState 的函数式更新形式，而不是直接引用 state 变量。这可以防止过时的闭包 (stale closures)，消除不必要的依赖，并创建稳定的回调引用。

**错误示范 (需要 state 作为依赖):**

```tsx
function TodoList() {
    const [items, setItems] = useState(initialItems);

    // 回调必须依赖 items，每次 items 变更都会重新创建
    const addItems = useCallback(
        (newItems: Item[]) => {
            setItems([...items, ...newItems]);
        },
        [items],
    ); // ❌ items 依赖导致重建

    // 如果忘记依赖，会有闭包陷阱风险
    const removeItem = useCallback((id: string) => {
        setItems(items.filter((item) => item.id !== id));
    }, []); // ❌ 缺失 items 依赖 - 将使用旧 items！

    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />;
}
```

**正确示范 (稳定的回调，无闭包陷阱):**

```tsx
function TodoList() {
    const [items, setItems] = useState(initialItems);

    // 稳定的回调，从未重新创建
    const addItems = useCallback((newItems: Item[]) => {
        setItems((curr) => [...curr, ...newItems]);
    }, []); // ✅ 无需依赖

    // 总是使用最新 state，无闭包陷阱风险
    const removeItem = useCallback((id: string) => {
        setItems((curr) => curr.filter((item) => item.id !== id));
    }, []); // ✅ 安全且稳定

    return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />;
}
```

**益处:**

1.  **稳定的回调引用** - state 变更时无需重建回调
2.  **无过时闭包** - 总是操作最新的 state 值
3.  **更少的依赖** - 简化依赖数组并减少内存泄漏
4.  **防止 Bug** - 消除 React 闭包 Bug 最常见的来源

**何时使用函数式更新:**

- 任何依赖于当前 state 值的 setState
- 在需要 state 的 useCallback/useMemo 内部
- 引用 state 的事件处理程序
- 更新 state 的异步操作

---

## 规则 5.10: 使用惰性 State 初始化

**影响:** 中 (MEDIUM)
**标签:** react, hooks, useState, performance, initialization

## 使用惰性 State 初始化

将函数传递给 `useState` 用于昂贵的初始值。如果不使用函数形式，初始化程序会在每次渲染时运行，即使值只使用一次。

**错误示范 (每次渲染都运行):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
    // buildSearchIndex() 在每次渲染都运行，即使初始化之后
    const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items));
    const [query, setQuery] = useState("");

    return <SearchResults index={searchIndex} query={query} />;
}
```

**正确示范 (仅运行一次):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
    // buildSearchIndex() 仅在初始渲染运行
    const [searchIndex, setSearchIndex] = useState(() =>
        buildSearchIndex(items),
    );
    const [query, setQuery] = useState("");

    return <SearchResults index={searchIndex} query={query} />;
}
```

当从 localStorage/sessionStorage 计算初始值、构建数据结构 (索引, maps)、读取 DOM 或执行重型转换时，使用惰性初始化。

---

## 规则 5.11: 对非紧急更新使用 Transitions

**影响:** 中 (MEDIUM)
**标签:** rerender, transitions, startTransition, performance

## 对非紧急更新使用 Transitions

将频繁、非紧急的状态更新标记为 transitions，以保持 UI 响应能力。

**错误示范 (每次滚动都阻塞 UI):**

```tsx
function ScrollTracker() {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handler = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);
}
```

**正确示范 (非阻塞更新):**

```tsx
import { startTransition } from "react";

function ScrollTracker() {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handler = () => {
            startTransition(() => setScrollY(window.scrollY));
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);
}
```

---

## 规则 5.12: 对瞬态值使用 useRef

**影响:** 中 (MEDIUM)
**标签:** rerender, useref, state, performance

## 对瞬态值使用 useRef

当一个值频繁变化且你不希望每次更新都重渲染时 (例如：鼠标跟踪器、定时器、瞬态标志)，将其存储在 `useRef` 而不是 `useState` 中。保留组件 state用于 UI；使用 refs 于临时的、DOM 相关的值。更新 ref 不会触发重渲染。

**错误示范 (每次更新都渲染):**

```tsx
function Tracker() {
    const [lastX, setLastX] = useState(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => setLastX(e.clientX);
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return <div style={{ left: lastX }} />;
}
```

**正确示范 (跟踪不触发重渲染):**

```tsx
function Tracker() {
    const lastXRef = useRef(0);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            lastXRef.current = e.clientX;
            const node = dotRef.current;
            if (node) {
                node.style.transform = `translateX(${e.clientX}px)`;
            }
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return <div ref={dotRef} />;
}
```
