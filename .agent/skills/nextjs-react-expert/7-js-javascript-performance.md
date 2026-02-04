# 7. JavaScript 性能 (JavaScript Performance)

> **影响:** 中低 (LOW-MEDIUM)
> **重点:** 针对热点路径的微优化可以累积成有意义的改进。

---

## 概览

本节包含 **12 条规则**，专注于 JavaScript 性能。

---

## 规则 7.1: 避免布局抖动 (Layout Thrashing)

**影响:** 中 (MEDIUM)
**标签:** javascript, dom, css, performance, reflow, layout-thrashing

## 避免布局抖动

避免将样式写入与布局读取交错进行。当你在样式更改之间读取布局属性 (如 `offsetWidth`, `getBoundingClientRect()`, 或 `getComputedStyle()`) 时，浏览器被迫触发同步重排 (Reflow)。

**正确 (浏览器批处理样式更改):**

```typescript
function updateElementStyles(element: HTMLElement) {
    // 每一行都使样式无效，但浏览器会批处理重新计算
    element.style.width = "100px";
    element.style.height = "200px";
    element.style.backgroundColor = "blue";
    element.style.border = "1px solid black";
}
```

**错误 (交错的读写强制重排):**

```typescript
function layoutThrashing(element: HTMLElement) {
    element.style.width = "100px";
    const width = element.offsetWidth; // 强制重排
    element.style.height = "200px";
    const height = element.offsetHeight; // 强制另一次重排
}
```

**正确 (批处理写入，然后读取一次):**

```typescript
function updateElementStyles(element: HTMLElement) {
    // 批处理所有写入
    element.style.width = "100px";
    element.style.height = "200px";
    element.style.backgroundColor = "blue";
    element.style.border = "1px solid black";

    // 在所有写入完成后读取 (单次重排)
    const { width, height } = element.getBoundingClientRect();
}
```

**正确 (批处理读取，然后写入):**

```typescript
function avoidThrashing(element: HTMLElement) {
    // 读取阶段 - 先进行所有布局查询
    const rect1 = element.getBoundingClientRect();
    const offsetWidth = element.offsetWidth;
    const offsetHeight = element.offsetHeight;

    // 写入阶段 - 之后进行所有样式更改
    element.style.width = "100px";
    element.style.height = "200px";
}
```

**更好: 使用 CSS 类**

```typescript
function updateElementStyles(element: HTMLElement) {
    element.classList.add("highlighted-box");

    const { width, height } = element.getBoundingClientRect();
}
```

**React 示例:**

```tsx
// 错误: 将样式更改与布局查询交错
function Box({ isHighlighted }: { isHighlighted: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && isHighlighted) {
            ref.current.style.width = "100px";
            const width = ref.current.offsetWidth; // 强制布局
            ref.current.style.height = "200px";
        }
    }, [isHighlighted]);

    return <div ref={ref}>Content</div>;
}

// 正确: 切换类
function Box({ isHighlighted }: { isHighlighted: boolean }) {
    return (
        <div className={isHighlighted ? "highlighted-box" : ""}>Content</div>
    );
}
```

尽可能优先使用 CSS 类而不是内联样式。

---

## 规则 7.2: 为重复查找建立索引 Map

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, map, indexing, optimization, performance

## 为重复查找建立索引 Map

按相同键进行的多次 `.find()` 调用应使用 Map。

**错误 (每次查找 O(n)):**

```typescript
function processOrders(orders: Order[], users: User[]) {
    return orders.map((order) => ({
        ...order,
        user: users.find((u) => u.id === order.userId),
    }));
}
```

**正确 (每次查找 O(1)):**

```typescript
function processOrders(orders: Order[], users: User[]) {
    const userById = new Map(users.map((u) => [u.id, u]));

    return orders.map((order) => ({
        ...order,
        user: userById.get(order.userId),
    }));
}
```

建立 Map 一次 (O(n))，然后所有查找都是 O(1)。
对于 1000 个订单 × 1000 个用户: 1M 次操作 → 2K 次操作。

---

## 规则 7.3: 在循环中缓存属性访问

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, loops, optimization, caching

## 在循环中缓存属性访问

在热点路径中缓存对象属性查找。

**错误 (3 次查找 × N 次迭代):**

```typescript
for (let i = 0; i < arr.length; i++) {
    process(obj.config.settings.value);
}
```

**正确 (总共 1 次查找):**

```typescript
const value = obj.config.settings.value;
const len = arr.length;
for (let i = 0; i < len; i++) {
    process(value);
}
```

---

## 规则 7.4: 缓存重复的函数调用

**影响:** 中 (MEDIUM)
**标签:** javascript, cache, memoization, performance

## 缓存重复的函数调用

当在渲染期间使用相同的输入重复调用相同的函数时，使用模块级 Map 来缓存函数结果。

**错误 (已计算过):**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // 对于相同的项目名称，slugify() 被调用 100+ 次
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**正确 (缓存结果):**

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
        // 每个唯一项目名称只计算一次
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**单值函数的更简单模式:**

```typescript
let isLoggedInCache: boolean | null = null;

function isLoggedIn(): boolean {
    if (isLoggedInCache !== null) {
        return isLoggedInCache;
    }

    isLoggedInCache = document.cookie.includes("auth=");
    return isLoggedInCache;
}

// 当 auth 变更时清除缓存
function onAuthChange() {
    isLoggedInCache = null;
}
```

---

## 规则 7.5: 缓存 Storage API 调用

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, localStorage, storage, caching, performance

## 缓存 Storage API 调用

`localStorage`, `sessionStorage`, 和 `document.cookie` 是同步且昂贵的。在内存中缓存读取。

**错误 (每次调用都读取 storage):**

```typescript
function getTheme() {
    return localStorage.getItem("theme") ?? "light";
}
// 调用 10 次 = 10 次 storage 读取
```

**正确 (Map 缓存):**

```typescript
const storageCache = new Map<string, string | null>();

function getLocalStorage(key: string) {
    if (!storageCache.has(key)) {
        storageCache.set(key, localStorage.getItem(key));
    }
    return storageCache.get(key);
}

function setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
    storageCache.set(key, value); // 保持缓存同步
}
```

**Cookie 缓存:**

```typescript
let cookieCache: Record<string, string> | null = null;

function getCookie(name: string) {
    if (!cookieCache) {
        cookieCache = Object.fromEntries(
            document.cookie.split("; ").map((c) => c.split("=")),
        );
    }
    return cookieCache[name];
}
```

**重要 (在外部变更时失效):**

如果 storage 可以在外部变更 (另一个标签页，服务器设置的 cookies)，使缓存失效:

```typescript
window.addEventListener("storage", (e) => {
    if (e.key) storageCache.delete(e.key);
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        storageCache.clear();
    }
});
```

---

## 规则 7.6: 合并多个数组迭代

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, arrays, loops, performance

## 合并多个数组迭代

多个 `.filter()` 或 `.map()` 调用会多次迭代数组。合并为一个循环。

**错误 (3 次迭代):**

```typescript
const admins = users.filter((u) => u.isAdmin);
const testers = users.filter((u) => u.isTester);
const inactive = users.filter((u) => !u.isActive);
```

**正确 (1 次迭代):**

```typescript
const admins: User[] = [];
const testers: User[] = [];
const inactive: User[] = [];

for (const user of users) {
    if (user.isAdmin) admins.push(user);
    if (user.isTester) testers.push(user);
    if (!user.isActive) inactive.push(user);
}
```

---

## 规则 7.7: 数组比较的早期长度检查

**影响:** 中高 (MEDIUM-HIGH)
**标签:** javascript, arrays, performance, optimization, comparison

## 数组比较的早期长度检查

当使用昂贵的操作 (排序、深层相等、序列化) 比较数组时，首先检查长度。如果长度不同，数组不可能相等。

**错误 (总是运行昂贵的比较):**

```typescript
function hasChanges(current: string[], original: string[]) {
    // 即使长度不同，也总是排序和连接
    return current.sort().join() !== original.sort().join();
}
```

**正确 (首先进行 O(1) 长度检查):**

```typescript
function hasChanges(current: string[], original: string[]) {
    // 如果长度不同，提前返回
    if (current.length !== original.length) {
        return true;
    }
    // 仅在长度匹配时排序
    const currentSorted = current.toSorted();
    const originalSorted = original.toSorted();
    for (let i = 0; i < currentSorted.length; i++) {
        if (currentSorted[i] !== originalSorted[i]) {
            return true;
        }
    }
    return false;
}
```

---

## 规则 7.8: 从函数提前返回

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, functions, optimization, early-return

## 从函数提前返回

当确定结果时提前返回，以跳过不必要的处理。

**错误 (即使找到答案后也处理所有项目):**

```typescript
function validateUsers(users: User[]) {
    let hasError = false;
    let errorMessage = "";

    for (const user of users) {
        if (!user.email) {
            hasError = true;
            errorMessage = "Email required";
        }
        // 即使发现错误也继续检查所有用户
    }

    return hasError ? { valid: false, error: errorMessage } : { valid: true };
}
```

**正确 (在第一个错误时立即返回):**

```typescript
function validateUsers(users: User[]) {
    for (const user of users) {
        if (!user.email) {
            return { valid: false, error: "Email required" };
        }
    }

    return { valid: true };
}
```

---

## 规则 7.9: 提升 RegExp 创建

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, regexp, optimization, memoization

## 提升 RegExp 创建

不要在渲染内部创建 RegExp。提升到模块作用域或使用 `useMemo()` 进行记忆化。

**错误 (每次渲染都创建新 RegExp):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**正确 (记忆化或提升):**

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

**警告 (全局 regex 具有可变状态):**

全局 regex (`/g`) 具有可变的 `lastIndex` 状态，请小心使用。

---

## 规则 7.10: 使用循环进行 Min/Max 而不是 Sort

**影响:** 低 (LOW)
**标签:** javascript, arrays, performance, sorting, algorithms

## 使用循环进行 Min/Max 而不是 Sort

找到最小或最大元素只需要遍历数组一次。排序既浪费又慢。

**错误 (O(n log n) - 排序以找到最新):**

```typescript
function getLatestProject(projects: Project[]) {
    const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
    return sorted[0];
}
```

**正确 (O(n) - 单次循环):**

```typescript
function getLatestProject(projects: Project[]) {
    if (projects.length === 0) return null;

    let latest = projects[0];

    for (let i = 1; i < projects.length; i++) {
        if (projects[i].updatedAt > latest.updatedAt) {
            latest = projects[i];
        }
    }

    return latest;
}
```

---

## 规则 7.11: 使用 Set/Map 进行 O(1) 查找

**影响:** 中低 (LOW-MEDIUM)
**标签:** javascript, set, map, data-structures, performance

## 使用 Set/Map 进行 O(1) 查找

将数组转换为 Set/Map 以进行重复的成员资格检查。

**错误 (每次检查 O(n)):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**正确 (每次检查 O(1)):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

---

## 规则 7.12: 使用 toSorted() 代替 sort() 以保持不可变性

**影响:** 中高 (MEDIUM-HIGH)
**标签:** javascript, arrays, immutability, react, state, mutation

## 使用 toSorted() 代替 sort() 以保持不可变性

`.sort()` 会就地改变数组，这在使用 React state 和 props 时可能会导致 Bug。使用 `.toSorted()` 创建一个新的排序数组而不进行突变。

**错误 (突变原始数组):**

```typescript
function UserList({ users }: { users: User[] }) {
  // 突变 users prop 数组！
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**正确 (创建新数组):**

```typescript
function UserList({ users }: { users: User[] }) {
  // 创建新的排序数组，原始不变
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

`.toSorted()` 在所有现代浏览器 (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+) 中都可用。对于旧环境，使用展开运算符: `[...items].sort(...)`。
