# 4. 客户端数据获取

> **影响：** 中高（MEDIUM-HIGH）
> **重点：** 自动去重与高效的数据获取模式能减少重复网络请求。

---

## 概览

本节包含 **4 条规则**，专注于客户端数据获取。

---

## 规则 4.1：去重全局事件监听

**影响：** 低（LOW）  
**标签：** client（客户端）, swr, event-listeners（事件监听）, subscription（订阅）  

## 去重全局事件监听

使用 `useSWRSubscription()` 在多个组件实例之间共享全局事件监听。

**错误示例（N 个实例 = N 个监听器）：**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

当多次使用 `useKeyboardShortcut` 时，每个实例都会注册新的监听器。

**正确示例（N 个实例 = 1 个监听器）：**

```tsx
import useSWRSubscription from 'swr/subscription'

// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  // Register this callback in the Map
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function Profile() {
  // Multiple shortcuts will share the same listener
  useKeyboardShortcut('p', () => { /* ... */ }) 
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```

---

## 规则 4.2：使用被动事件监听提升滚动性能

**影响：** 中（MEDIUM）  
**标签：** client（客户端）, event-listeners（事件监听）, scrolling（滚动）, performance（性能）, touch, wheel  

## 使用被动事件监听提升滚动性能

为 touch 与 wheel 事件添加 `{ passive: true }` 以启用即时滚动。浏览器通常会等待监听器结束来判断是否调用 `preventDefault()`，从而造成滚动延迟。

**错误示例：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**正确示例：**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })
  
  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**适合用被动监听的场景：** 追踪/分析、日志、任何不调用 `preventDefault()` 的监听。

**不适合用被动监听的场景：** 自定义滑动手势、自定义缩放控制、任何需要 `preventDefault()` 的监听。

---

## 规则 4.3：使用 SWR 自动去重

**影响：** 中高（MEDIUM-HIGH）  
**标签：** client（客户端）, swr, deduplication（去重）, data-fetching（数据获取）  

## 使用 SWR 自动去重

SWR 提供请求去重、缓存与重新验证，适用于多个组件实例共享请求。

**错误示例（无去重，每个实例都请求）：**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**正确示例（多个实例共享一个请求）：**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**用于不可变数据：**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**用于变更：**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

参考：<https://swr.vercel.app>

---

## 规则 4.4：版本化并最小化 localStorage 数据

**影响：** 中（MEDIUM）  
**标签：** client（客户端）, localStorage, storage, versioning（版本化）, data-minimization（最小化）  

## 版本化并最小化 localStorage 数据

为 key 添加版本前缀，并只存必要字段，避免结构冲突与误存敏感数据。

**错误示例：**

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

**正确示例：**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**只存必要字段：**

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}
```

**务必用 try-catch 包裹：** `getItem()` 与 `setItem()` 在无痕/隐私模式（Safari, Firefox）、配额超限或被禁用时会抛错。

**收益：** 通过版本化演进结构、降低存储体积、防止存储 token/PII/内部标记。
