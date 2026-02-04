# 4. 客户端数据获取 (Client-Side Data Fetching)

> **影响:** 中高 (MEDIUM-HIGH)
> **重点:** 自动去重和高效的数据获取模式可减少多余的网络请求。

---

## 概览

本节包含 **4 条规则**，专注于客户端数据获取。

---

## 规则 4.1: 去重全局事件监听器

**影响:** 低 (LOW)
**标签:** client, swr, event-listeners, subscription

## 去重全局事件监听器

使用 `useSWRSubscription()` 在组件实例之间共享全局事件监听器。

**错误示范 (N 个实例 = N 个监听器):**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.metaKey && e.key === key) {
                callback();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [key, callback]);
}
```

当多次使用 `useKeyboardShortcut` hook 时，每个实例都会注册一个新的监听器。

**正确示范 (N 个实例 = 1 个监听器):**

```tsx
import useSWRSubscription from "swr/subscription";

// 模块级 Map 跟踪每个按键的回调
const keyCallbacks = new Map<string, Set<() => void>>();

function useKeyboardShortcut(key: string, callback: () => void) {
    // 在 Map 中注册此回调
    useEffect(() => {
        if (!keyCallbacks.has(key)) {
            keyCallbacks.set(key, new Set());
        }
        keyCallbacks.get(key)!.add(callback);

        return () => {
            const set = keyCallbacks.get(key);
            if (set) {
                set.delete(callback);
                if (set.size === 0) {
                    keyCallbacks.delete(key);
                }
            }
        };
    }, [key, callback]);

    useSWRSubscription("global-keydown", () => {
        const handler = (e: KeyboardEvent) => {
            if (e.metaKey && keyCallbacks.has(e.key)) {
                keyCallbacks.get(e.key)!.forEach((cb) => cb());
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    });
}

function Profile() {
    // 多个快捷键将共享同一个监听器
    useKeyboardShortcut("p", () => {
        /* ... */
    });
    useKeyboardShortcut("k", () => {
        /* ... */
    });
    // ...
}
```

---

## 规则 4.2: 为了滚动性能使用被动事件监听器 (Passive Event Listeners)

**影响:** 中 (MEDIUM)
**标签:** client, event-listeners, scrolling, performance, touch, wheel

## 为了滚动性能使用被动事件监听器

向 touch 和 wheel 事件监听器添加 `{ passive: true }` 以启用立即滚动。浏览器通常会等待监听器完成以检查是否调用了 `preventDefault()`，这会导致滚动延迟。

**错误示范:**

```typescript
useEffect(() => {
    const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX);
    const handleWheel = (e: WheelEvent) => console.log(e.deltaY);

    document.addEventListener("touchstart", handleTouch);
    document.addEventListener("wheel", handleWheel);

    return () => {
        document.removeEventListener("touchstart", handleTouch);
        document.removeEventListener("wheel", handleWheel);
    };
}, []);
```

**正确示范:**

```typescript
useEffect(() => {
    const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX);
    const handleWheel = (e: WheelEvent) => console.log(e.deltaY);

    document.addEventListener("touchstart", handleTouch, { passive: true });
    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
        document.removeEventListener("touchstart", handleTouch);
        document.removeEventListener("wheel", handleWheel);
    };
}, []);
```

**何时使用 passive:** 追踪/分析、日志记录、任何不调用 `preventDefault()` 的监听器。

**何时不使用 passive:** 实现自定义滑动手势、自定义缩放控制或任何需要 `preventDefault()` 的监听器。

---

## 规则 4.3: 使用 SWR 进行自动去重

**影响:** 中高 (MEDIUM-HIGH)
**标签:** client, swr, deduplication, data-fetching

## 使用 SWR 进行自动去重

SWR 支持跨组件实例的请求去重、缓存和重新验证。

**错误示范 (无去重，每个实例都 fetch):**

```tsx
function UserList() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch("/api/users")
            .then((r) => r.json())
            .then(setUsers);
    }, []);
}
```

**正确示范 (多个实例共享一个请求):**

```tsx
import useSWR from "swr";

function UserList() {
    const { data: users } = useSWR("/api/users", fetcher);
}
```

**对于不可变数据:**

```tsx
import { useImmutableSWR } from "@/lib/swr";

function StaticContent() {
    const { data } = useImmutableSWR("/api/config", fetcher);
}
```

**对于变更 (Mutations):**

```tsx
import { useSWRMutation } from "swr/mutation";

function UpdateButton() {
    const { trigger } = useSWRMutation("/api/user", updateUser);
    return <button onClick={() => trigger()}>Update</button>;
}
```

参考: [https://swr.vercel.app](https://swr.vercel.app)

---

## 规则 4.4: 对 localStorage 数据进行版本控制和最小化

**影响:** 中 (MEDIUM)
**标签:** client, localStorage, storage, versioning, data-minimization

## 对 localStorage 数据进行版本控制和最小化

为 key 添加版本前缀，只存储需要的字段。防止 Schema 冲突和意外存储敏感数据。

**错误示范:**

```typescript
// 无版本，存储所有内容，无错误处理
localStorage.setItem("userConfig", JSON.stringify(fullUserObject));
const data = localStorage.getItem("userConfig");
```

**正确示范:**

```typescript
const VERSION = "v2";

function saveConfig(config: { theme: string; language: string }) {
    try {
        localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config));
    } catch {
        // 在隐身/隐私浏览模式、配额超出或禁用时抛出异常
    }
}

function loadConfig() {
    try {
        const data = localStorage.getItem(`userConfig:${VERSION}`);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

// 从 v1 迁移到 v2
function migrate() {
    try {
        const v1 = localStorage.getItem("userConfig:v1");
        if (v1) {
            const old = JSON.parse(v1);
            saveConfig({
                theme: old.darkMode ? "dark" : "light",
                language: old.lang,
            });
            localStorage.removeItem("userConfig:v1");
        }
    } catch {}
}
```

**仅存储服务器响应中的最小字段:**

```typescript
// 用户对象有 20+ 个字段，只存储 UI 需要的
function cachePrefs(user: FullUser) {
    try {
        localStorage.setItem(
            "prefs:v1",
            JSON.stringify({
                theme: user.preferences.theme,
                notifications: user.preferences.notifications,
            }),
        );
    } catch {}
}
```

**始终包裹在 try-catch 中:** `getItem()` 和 `setItem()` 在隐身/隐私浏览模式 (Safari, Firefox)、配额超出或被禁用时会抛出异常。

**益处:** 通过版本控制进行 Schema 演进、减少存储大小、防止存储令牌/PII/内部标志。
