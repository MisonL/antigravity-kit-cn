# 1. 消除瀑布流

> **影响：** 严重（CRITICAL）
> **重点：** 瀑布流是头号性能杀手。每一次串行 await 都会增加完整网络延迟。消除它们收益最大。

---

## 概览

本节包含 **5 条规则**，专注于消除瀑布流。

---

## 规则 1.1：延迟 await 到需要时

**影响：** 高（HIGH）  
**标签：** async（异步）, await, conditional（条件）, optimization（优化）  

## 延迟 await 到需要时

将 `await` 操作移动到实际使用它们的分支，避免阻塞不需要它们的路径。

**错误示例（阻塞两个分支）：**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }
  
  // Only this branch uses userData
  return processUserData(userData)
}
```

**正确示例（仅在需要时阻塞）：**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }
  
  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**另一个例子（提前返回优化）：**

```typescript
// Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}

// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  const permissions = await fetchPermissions(userId)
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}
```

当跳过的分支经常发生，或被延后的操作很昂贵时，这种优化价值很大。

---

## 规则 1.2：基于依赖的并行化

**影响：** 严重（CRITICAL）  
**标签：** async（异步）, parallelization（并行化）, dependencies（依赖）, better-all  

## 基于依赖的并行化

对于存在部分依赖的操作，使用 `better-all` 最大化并行度。它会在最早时刻启动每个任务。

**错误示例（profile 不必要地等待 config）：**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**正确示例（config 与 profile 并行）：**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**不引入额外依赖的替代方案：**

也可以先创建全部 Promise，最后再 `Promise.all()`。

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

参考：<https://github.com/shuding/better-all>

---

## 规则 1.3：防止 API 路由中的瀑布链

**影响：** 严重（CRITICAL）  
**标签：** api-routes, server-actions, waterfalls, parallelization  

## 防止 API 路由中的瀑布链

在 API 路由与 Server Actions 中，立即启动独立操作，即使暂时不 await。

**错误示例（config 等待 auth，data 等待两者）：**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**正确示例（auth 与 config 立即开始）：**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

对更复杂依赖链，使用 `better-all` 自动最大化并行度（见“基于依赖的并行化”）。

---

## 规则 1.4：独立操作使用 Promise.all()

**影响：** 严重（CRITICAL）  
**标签：** async（异步）, parallelization（并行化）, promises, waterfalls  

## 独立操作使用 Promise.all()

当异步操作之间无依赖时，用 `Promise.all()` 并发执行。

**错误示例（串行执行，3 次往返）：**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**正确示例（并行执行，1 次往返）：**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

---

## 规则 1.5：策略性 Suspense 边界

**影响：** 高（HIGH）  
**标签：** async（异步）, suspense, streaming（流式）, layout-shift（布局偏移）  

## 策略性 Suspense 边界

不要在 async 组件中先 await 数据再返回 JSX。用 Suspense 边界让外层 UI 先显示、数据后流入。

**错误示例（外层被数据阻塞）：**

```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page
  
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

整个布局会等待数据，即便只有中间区域需要它。

**正确示例（外层立即渲染，数据流式进入）：**

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
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Sidebar、Header、Footer 立即渲染，只有 DataDisplay 等待数据。

**替代方案（跨组件共享 Promise）：**

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()
  
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
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

两个组件共享同一个 promise，因此只发生一次请求。布局立即渲染，两个组件一起等待。

**何时不使用该模式：**

- 布局决策所需的关键数据（影响定位）
- 首屏（Above the fold）对 SEO 至关重要的内容
- 极小且很快的查询（Suspense 开销不值得）
- 当你想避免布局偏移（加载 → 内容跳动）

**权衡：** 更快的首屏绘制 vs 潜在的布局偏移。根据你的 UX 优先级选择。
