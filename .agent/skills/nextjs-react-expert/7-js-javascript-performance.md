# 7. JavaScript 性能 (JavaScript Performance)

> **影响:** 低到中 (LOW-MEDIUM)
> **重点:** 对热点路径进行微优化，累积后可带来可观性能提升。

---

## 概览

本节包含 **12 条规则**，聚焦 JavaScript 性能。

---

## 规则 7.1：避免布局抖动（Layout Thrashing）

**影响:** 中 (MEDIUM)  
**标签:** javascript, dom, css, performance, reflow, layout-thrashing  

## 避免布局抖动（Layout Thrashing）

避免把样式写入与布局读取交错执行。当你在样式变更之间读取布局属性（如 `offsetWidth`、`getBoundingClientRect()`、`getComputedStyle()`）时，浏览器会被迫触发同步回流（reflow）。

**可接受示例（浏览器可批处理样式变更）：**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 每行都会使样式失效，但浏览器可批量重计算
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**错误示例（读写交错会强制回流）：**
```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // 强制回流
  element.style.height = '200px'
  const height = element.offsetHeight  // 再次强制回流
}
```

**正确示例（先批量写，再统一读）：**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 先批量写入
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
  
  // 全部写完后再读取（单次回流）
  const { width, height } = element.getBoundingClientRect()
}
```

**正确示例（先批量读，再批量写）：**
```typescript
function avoidThrashing(element: HTMLElement) {
  // 读取阶段：先做所有布局查询
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight
  
  // 写入阶段：再做所有样式变更
  element.style.width = '100px'
  element.style.height = '200px'
}
```

**更推荐：使用 CSS class**
```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```
```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')
  
  const { width, height } = element.getBoundingClientRect()
}
```

**React example:**
```tsx
// 错误示例：样式变更与布局查询交错
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // 强制布局计算
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])
  
  return <div ref={ref}>Content</div>
}

// 正确示例：切换 class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

在可行时优先 CSS class 而非内联样式。CSS 文件可被浏览器缓存，class 也更利于关注点分离与维护。

关于会触发布局计算的操作，可参考 [this gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) 与 [CSS Triggers](https://csstriggers.com/)。

---

## 规则 7.2：重复查询应建立索引 Map

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, map, indexing, optimization, performance  

## 重复查询应建立索引 Map

针对同一 key 的多次 `.find()` 查询，应改用 Map。

**错误示例（每次查询 O(n)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

**正确示例（每次查询 O(1)）：**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

先建一次 Map（O(n)），之后每次查询均为 O(1)。
以 1000 orders × 1000 users 为例：约 100 万次操作可降到约 2000 次。

---

## 规则 7.3：循环中缓存属性访问

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, loops, optimization, caching  

## 循环中缓存属性访问

在热点路径中，缓存对象属性读取结果。

**错误示例（3 次属性读取 × N 次循环）：**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**正确示例（总共只读 1 次）：**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

---

## 规则 7.4：缓存重复函数调用

**影响:** 中 (MEDIUM)  
**标签:** javascript, cache, memoization, performance  

## 缓存重复函数调用

当渲染期间同一函数会以相同输入被重复调用时，使用模块级 Map 缓存结果。

**错误示例（重复计算）：**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // 对同名项目会重复调用 slugify() 100+ 次
        const slug = slugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**正确示例（缓存结果）：**

```typescript
// 模块级缓存
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // 每个唯一项目名只计算一次
        const slug = cachedSlugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**单值函数可用更简单写法：**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }
  
  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// 认证状态变化时清空缓存
function onAuthChange() {
  isLoggedInCache = null
}
```

使用 Map（而非 hook）可以在任意上下文复用：工具函数、事件处理器，不只 React 组件。

参考： [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

---

## 规则 7.5：缓存 Storage API 调用

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, localStorage, storage, caching, performance  

## 缓存 Storage API 调用

`localStorage`、`sessionStorage` 与 `document.cookie` 都是同步且开销较高的 API。应把读取结果缓存在内存中。

**错误示例（每次调用都读 storage）：**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// 调用 10 次 = 读取 storage 10 次
```

**正确示例（Map 缓存）：**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // 保持缓存同步
}
```

使用 Map（而非 hook）可以在任意上下文复用：工具函数、事件处理器，不只 React 组件。

**Cookie 缓存：**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

**重要（外部变化时要失效缓存）：**

若 storage 可能被外部改变（其他标签页、服务端写入 cookie），需要使缓存失效：

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```

---

## 规则 7.6：合并多次数组遍历

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, arrays, loops, performance  

## 合并多次数组遍历

多次 `.filter()` / `.map()` 会重复遍历同一数组。可合并为一次循环。

**错误示例（3 次遍历）：**

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

**正确示例（1 次遍历）：**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

---

## 规则 7.7：数组比较先做长度短路判断

**影响:** 中到高 (MEDIUM-HIGH)  
**标签:** javascript, arrays, performance, optimization, comparison  

## 数组比较先做长度短路判断

当数组比较需要昂贵操作（排序、深比较、序列化）时，先比较长度。长度不同就不可能相等。

在真实业务里，若比较发生在热点路径（事件处理器、渲染循环）中，这个优化尤其有价值。

**错误示例（总会执行昂贵比较）：**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 即使长度不同也会执行排序和 join
  return current.sort().join() !== original.sort().join()
}
```

即使 `current.length` 为 5、`original.length` 为 100，也会执行两次 O(n log n) 排序；同时还会有 join 和字符串比较开销。

**正确示例（先做 O(1) 长度检查）：**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 长度不同直接返回
  if (current.length !== original.length) {
    return true
  }
  // 仅在长度相同才排序
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

这种方式更高效，因为：
- 长度不同场景下可避免排序与 join 的额外开销
- 避免为 join 后字符串分配额外内存（大数组下尤为重要）
- 不会修改原数组
- 一旦发现差异可提前返回

---

## 规则 7.8：函数中尽早返回

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, functions, optimization, early-return  

## 函数中尽早返回

当结果已确定时尽早返回，跳过不必要处理。

**错误示例（找到答案后仍处理全部项）：**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''
  
  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // 即使已发现错误仍继续检查所有用户
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**正确示例（首次错误即返回）：**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

---

## 规则 7.9：提升（Hoist）RegExp 创建位置

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, regexp, optimization, memoization  

## 提升（Hoist）RegExp 创建位置

不要在渲染期间创建 RegExp。应提升到模块作用域，或用 `useMemo()` 缓存。

**错误示例（每次渲染都创建新 RegExp）：**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**正确示例（memoize 或 hoist）：**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**警告（全局正则包含可变状态）：**

全局正则（`/g`）的 `lastIndex` 是可变状态：

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

---

## 规则 7.10：求最值用循环，不要用排序

**影响:** 低 (LOW)  
**标签:** javascript, arrays, performance, sorting, algorithms  

## 求最值用循环，不要用排序

查找最小/最大值只需一次遍历。排序既浪费又更慢。

**错误示例（O(n log n)，为找最大值先排序）：**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

为了找最大值却把整个数组排序，开销过大。

**错误示例（O(n log n)，为最旧/最新都先排序）：**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

仅需 min/max 时仍排序，属于不必要开销。

**正确示例（O(n)，单次循环）：**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null
  
  let latest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  
  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }
  
  let oldest = projects[0]
  let newest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }
  
  return { oldest, newest }
}
```

单次遍历，无需复制数组，也无需排序。

**替代方案（小数组可用 Math.min/Math.max）：**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

该方式适合小数组，但在超大数组下受展开运算符限制，可能更慢甚至报错。Chrome 143 约 124000、Safari 18 约 638000（具体会波动），可见 [the fiddle](https://jsfiddle.net/qw1jabsx/4/)；为稳健性建议使用循环方案。

---

## 规则 7.11：使用 Set/Map 做 O(1) 查询

**影响:** 低到中 (LOW-MEDIUM)  
**标签:** javascript, set, map, data-structures, performance  

## 使用 Set/Map 做 O(1) 查询

重复成员判断时，应将数组转为 Set/Map。

**错误示例（每次查询 O(n)）：**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**正确示例（每次查询 O(1)）：**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

---

## 规则 7.12：保持不可变性时用 toSorted() 替代 sort()

**影响:** 中到高 (MEDIUM-HIGH)  
**标签:** javascript, arrays, immutability, react, state, mutation  

## 保持不可变性时用 toSorted() 替代 sort()

`.sort()` 会原地修改数组，这在 React 的 state/props 场景里容易引发问题。应使用 `.toSorted()` 生成新数组并保持不可变。

**错误示例（会修改原数组）：**

```typescript
function UserList({ users }: { users: User[] }) {
  // 会修改 users 这个 props 数组
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**正确示例（创建新数组）：**

```typescript
function UserList({ users }: { users: User[] }) {
  // 创建新排序数组，原数组保持不变
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**为何在 React 中很重要：**

1. 修改 props/state 会破坏 React 的不可变模型，React 期望它们是只读输入
2. 容易触发过期闭包问题，在回调/effect 中修改数组会带来不可预期行为

**浏览器支持（旧环境回退）：**

`.toSorted()` 在现代浏览器均可用（Chrome 110+、Safari 16+、Firefox 115+、Node.js 20+）。旧环境可用展开运算符回退：

```typescript
// 旧浏览器回退方案
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**其他不可变数组方法：**

- `.toSorted()`：不可变排序
- `.toReversed()`：不可变反转
- `.toSpliced()`：不可变 splice
- `.with()`：不可变元素替换
