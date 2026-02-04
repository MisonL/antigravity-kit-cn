# 8. 高级模式 (Advanced Patterns)

> **影响:** 可变 (VARIABLE)
> **重点:** 针对需要仔细实现的特定情况的高级模式。

---

## 概览

本节包含 **3 条规则**，专注于高级模式。

---

## 规则 8.1: 初始化应用一次，而不是每次挂载

**影响:** 中低 (LOW-MEDIUM)
**标签:** initialization, useEffect, app-startup, side-effects

## 初始化应用一次，而不是每次挂载

不要将必须在每个应用加载时运行一次的应用级初始化放在组件的 `useEffect([])` 内部。组件可以重新挂载，effect 会重新运行。请改用模块级守卫或入口模块中的顶层初始化。

**错误 (在开发环境中运行两次，在重新挂载时重新运行):**

```tsx
function Comp() {
    useEffect(() => {
        loadFromStorage();
        checkAuthToken();
    }, []);

    // ...
}
```

**正确 (每个应用加载一次):**

```tsx
let didInit = false;

function Comp() {
    useEffect(() => {
        if (didInit) return;
        didInit = true;
        loadFromStorage();
        checkAuthToken();
    }, []);

    // ...
}
```

参考: [初始化应用](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

---

## 规则 8.2: 将事件处理程序存储在 Ref 中

**影响:** 低 (LOW)
**标签:** advanced, hooks, refs, event-handlers, optimization

## 将事件处理程序存储在 Ref 中

当在不应能在回调更改时重新订阅的 effect 中使用回调时，将回调存储在 ref 中。

**错误 (每次渲染都重新订阅):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
    useEffect(() => {
        window.addEventListener(event, handler);
        return () => window.removeEventListener(event, handler);
    }, [event, handler]);
}
```

**正确 (稳定订阅):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
    const handlerRef = useRef(handler);
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (e) => handlerRef.current(e);
        window.addEventListener(event, listener);
        return () => window.removeEventListener(event, listener);
    }, [event]);
}
```

**替代方案: 如果你使用的是最新 React，请使用 `useEffectEvent`:**

```tsx
import { useEffectEvent } from "react";

function useWindowEvent(event: string, handler: (e) => void) {
    const onEvent = useEffectEvent(handler);

    useEffect(() => {
        window.addEventListener(event, onEvent);
        return () => window.removeEventListener(event, onEvent);
    }, [event]);
}
```

`useEffectEvent` 为相同的模式提供了更清晰的 API：它创建一个稳定的函数引用，始终调用处理程序的最新版本。

---

## 规则 8.3: 用于稳定回调 Ref 的 useEffectEvent

**影响:** 低 (LOW)
**标签:** advanced, hooks, useEffectEvent, refs, optimization

## 用于稳定回调 Ref 的 useEffectEvent

在回调中访问最新值，而无需将其添加到依赖数组中。防止 Effect 重新运行，同时避免过时的闭包。

**错误 (effect 在每次回调更改时重新运行):**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => onSearch(query), 300);
        return () => clearTimeout(timeout);
    }, [query, onSearch]);
}
```

**正确 (使用 React 的 useEffectEvent):**

```tsx
import { useEffectEvent } from "react";

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
    const [query, setQuery] = useState("");
    const onSearchEvent = useEffectEvent(onSearch);

    useEffect(() => {
        const timeout = setTimeout(() => onSearchEvent(query), 300);
        return () => clearTimeout(timeout);
    }, [query]);
}
```
