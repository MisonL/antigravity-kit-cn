# 1. 消除瀑布流 (Eliminating Waterfalls)

> **影响:** 严重 (CRITICAL)
> **重点:** 瀑布流是头号性能杀手。每个顺序的 await 都会增加完整的网络延迟。消除它们能带来最大的收益。

---

## 概览

本节包含 **5 条规则**，专注于消除瀑布流。

---

## 规则 1.1: 延迟 Await 直到需要时

**影响:** 高 (HIGH)
**标签:** async, await, conditional, optimization

## 延迟 Await 直到需要时

将 `await` 操作移动到实际使用它们的条件分支中，避免阻塞不需要它们的代码路径。

**错误示范 (阻塞所有分支):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
    const userData = await fetchUserData(userId);

    if (skipProcessing) {
        // 立即返回，但也等待了 userData
        return { skipped: true };
    }

    // 只有这个分支使用了 userData
    return processUserData(userData);
}
```

**正确示范 (仅在需要时阻塞):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
    if (skipProcessing) {
        // 立即返回，无需等待
        return { skipped: true };
    }

    // 仅在需要时获取
    const userData = await fetchUserData(userId);
    return processUserData(userData);
}
```

**另一个例子 (提前返回优化):**

```typescript
// 错误: 总是获取 permissions
async function updateResource(resourceId: string, userId: string) {
    const permissions = await fetchPermissions(userId);
    const resource = await getResource(resourceId);

    if (!resource) {
        return { error: "Not found" };
    }

    if (!permissions.canEdit) {
        return { error: "Forbidden" };
    }

    return await updateResourceData(resource, permissions);
}

// 正确: 仅在需要时获取
async function updateResource(resourceId: string, userId: string) {
    const resource = await getResource(resourceId);

    if (!resource) {
        return { error: "Not found" };
    }

    const permissions = await fetchPermissions(userId);

    if (!permissions.canEdit) {
        return { error: "Forbidden" };
    }

    return await updateResourceData(resource, permissions);
}
```

当跳过的分支经常被执行，或者被推迟的操作很昂贵时，这种优化特别有价值。

---

## 规则 1.2: 基于依赖的并行化

**影响:** 严重 (CRITICAL)
**标签:** async, parallelization, dependencies, better-all

## 基于依赖的并行化

对于具有部分依赖关系的操作，使用 `better-all` 来最大化并行度。它会在尽可能早的时刻自动启动每个任务。

**错误示范 (profile 不必要地等待 config):**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
const profile = await fetchProfile(user.id);
```

**正确示范 (config 和 profile 并行运行):**

```typescript
import { all } from "better-all";

const { user, config, profile } = await all({
    async user() {
        return fetchUser();
    },
    async config() {
        return fetchConfig();
    },
    async profile() {
        return fetchProfile((await this.$.user).id);
    },
});
```

**不引入额外依赖的替代方案:**

我们要先创建所有的 Promise，最后再执行 `Promise.all()`。

```typescript
const userPromise = fetchUser();
const profilePromise = userPromise.then((user) => fetchProfile(user.id));

const [user, config, profile] = await Promise.all([
    userPromise,
    fetchConfig(),
    profilePromise,
]);
```

参考: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)

---

## 规则 1.3: 防止 API 路由中的瀑布链

**影响:** 严重 (CRITICAL)
**标签:** api-routes, server-actions, waterfalls, parallelization

## 防止 API 路由中的瀑布链

在 API 路由和 Server Actions 中，立即启动独立的操作，即使你还不需要 `await` 它们。

**错误示范 (config 等待 auth，data 等待两者):**

```typescript
export async function GET(request: Request) {
    const session = await auth();
    const config = await fetchConfig();
    const data = await fetchData(session.user.id);
    return Response.json({ data, config });
}
```

**正确示范 (auth 和 config 立即开始):**

```typescript
export async function GET(request: Request) {
    const sessionPromise = auth();
    const configPromise = fetchConfig();
    const session = await sessionPromise;
    const [config, data] = await Promise.all([
        configPromise,
        fetchData(session.user.id),
    ]);
    return Response.json({ data, config });
}
```

对于具有更复杂依赖链的操作，使用 `better-all` 来自动最大化并行度 (参见基于依赖的并行化)。

---

## 规则 1.4: 对独立操作使用 Promise.all()

**影响:** 严重 (CRITICAL)
**标签:** async, parallelization, promises, waterfalls

## 对独立操作使用 Promise.all()

当异步操作没有相互依赖时，使用 `Promise.all()`并发执行它们。

**错误示范 (顺序执行，3 次往返):**

```typescript
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();
```

**正确示范 (并行执行，1 次往返):**

```typescript
const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
]);
```

---

## 规则 1.5: 策略性 Suspense 边界

**影响:** 高 (HIGH)
**标签:** async, suspense, streaming, layout-shift

## 策略性 Suspense 边界

与其在返回 JSX 之前在异步组件中等待数据，不如使用 Suspense 边界在数据加载时更快地显示外层 UI。

**错误示范 (外层被数据获取阻塞):**

```tsx
async function Page() {
    const data = await fetchData(); // 阻塞整个页面

    return (
        <div>
            <div>Sidebar</div>
            <div>Header</div>
            <div>
                <DataDisplay data={data} />
            </div>
            <div>Footer</div>
        </div>
    );
}
```

尽管只有中间部分需要数据，但整个布局都在等待。

**正确示范 (外层立即显示，数据流式传输):**

```tsx
function Page() {
    return (
        <div>
            <div>Sidebar</div>
            <div>Header</div>
            <div>
                <Suspense fallback={<Skeleton />}>
                    <DataDisplay />
                </Suspense>
            </div>
            <div>Footer</div>
        </div>
    );
}

async function DataDisplay() {
    const data = await fetchData(); // 仅阻塞此组件
    return <div>{data.content}</div>;
}
```

Sidebar, Header 和 Footer 立即渲染。只有 DataDisplay 等待数据。

**替代方案 (跨组件共享 Promise):**

```tsx
function Page() {
    // 立即开始获取，但不要 await
    const dataPromise = fetchData();

    return (
        <div>
            <div>Sidebar</div>
            <div>Header</div>
            <Suspense fallback={<Skeleton />}>
                <DataDisplay dataPromise={dataPromise} />
                <DataSummary dataPromise={dataPromise} />
            </Suspense>
            <div>Footer</div>
        </div>
    );
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
    const data = use(dataPromise); // 解包 promise
    return <div>{data.content}</div>;
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
    const data = use(dataPromise); // 复用同一个 promise
    return <div>{data.summary}</div>;
}
```

两个组件共享同一个 promise，因此只发生一次获取。布局立即渲染，而两个组件一起等待。

**何时不使用此模式:**

- 布局决策所需的关键数据 (影响定位)
- 首屏 (Above the fold) 对 SEO 至关重要的内容
- 极快的小查询，Suspense 的开销不值得
- 当你想避免布局偏移时 (加载中 → 内容跳动)

**权衡:** 更快的首次绘制 vs 潜在的布局偏移。根据你的 UX 优先级进行选择。
