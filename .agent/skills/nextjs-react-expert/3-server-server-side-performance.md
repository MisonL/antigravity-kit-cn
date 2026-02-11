# 3. 服务端性能 (Server-Side Performance)

> **影响:** 高 (HIGH)
> **重点:** 通过优化服务端渲染与数据获取，消除服务端瀑布流并降低响应时间。

---

## 概览

本节包含 **7 条规则**，聚焦服务端性能。

---

## 规则 3.1：像 API 路由一样认证 Server Actions

**影响:** 严重 (CRITICAL)  
**标签:** server, server-actions, authentication, security, authorization  

## 像 API 路由一样认证 Server Actions

**影响：严重 (防止未授权访问服务端变更操作)**

Server Actions（带有 `"use server"` 的函数）和 API 路由一样，都是对外公开端点。必须在每个 Server Action **内部**做认证与鉴权。不要只依赖中间件、布局守卫或页面级检查，因为 Server Actions 可以被直接调用。

Next.js 文档明确指出：“要将 Server Actions 按公开 API 端点同等安全级别对待，并验证用户是否有权限执行该变更。”

**错误示例（未做认证检查）：**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**正确示例（在 Action 内部做认证）：**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()
  
  if (!session) {
    throw unauthorized('Must be logged in')
  }
  
  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }
  
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**结合输入校验：**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)
  
  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }
  
  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })
  
  return { success: true }
}
```

参考： [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)

---

## 规则 3.2：避免在 RSC Props 中重复序列化

**影响:** 低 (LOW)  
**标签:** server, rsc, serialization, props, client-components  

## 避免在 RSC Props 中重复序列化

**影响：低 (通过避免重复序列化来减少网络负载)**

RSC 到客户端的序列化是按对象引用去重，不是按值去重。相同引用只会序列化一次；新引用会再次序列化。像 `.toSorted()`、`.filter()`、`.map()` 这类转换应尽量放在客户端，而不是服务端。

**错误示例（数组被重复序列化）：**

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**正确示例（只发送 3 个字符串）：**

```tsx
// RSC: send once
<ClientList usernames={usernames} />

// Client: transform there
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**嵌套去重行为：**

去重会递归生效，不同数据类型的收益不同：

- `string[]`、`number[]`、`boolean[]`：**高影响**，数组和其中的原始值都会完整重复
- `object[]`：**低影响**，数组结构会重复，但内部对象会按引用去重

```tsx
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

**会破坏去重的操作（会创建新引用）：**

- 数组：`.toSorted()`、`.filter()`、`.map()`、`.slice()`、`[...arr]`
- 对象：`{...obj}`、`Object.assign()`、`structuredClone()`、`JSON.parse(JSON.stringify())`

**更多示例：**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
```

**例外：** 如果转换计算成本较高，或客户端不需要原始数据，可直接传递派生数据。

---

## 规则 3.3：跨请求 LRU 缓存

**影响:** 高 (HIGH)  
**标签:** server, cache, lru, cross-request  

## 跨请求 LRU 缓存

`React.cache()` 仅在单次请求内生效。对于跨连续请求共享的数据（例如用户先点按钮 A 再点按钮 B），应使用 LRU 缓存。

**实现：**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

当用户在几秒内触发的连续操作会命中多个、且需要相同数据的端点时，优先使用这一模式。

**结合 Vercel 的 [Fluid Compute](https://vercel.com/docs/fluid-compute)：** 多个并发请求可共享同一函数实例与缓存，LRU 缓存会更有效，不一定需要 Redis 这类外部存储。

**传统 serverless 场景：** 每次调用相互隔离，跨进程缓存通常需要 Redis。

参考： [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)

---

## 规则 3.4：最小化 RSC 边界的序列化开销

**影响:** 高 (HIGH)  
**标签:** server, rsc, serialization, props  

## 最小化 RSC 边界的序列化开销

React 的服务端/客户端边界会把对象属性序列化为字符串，并注入到 HTML 响应与后续 RSC 请求中。该数据会直接影响页面体积与加载时间，所以 **体积非常关键**。只传客户端真正需要的字段。

**错误示例（序列化了全部 50 个字段）：**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}
```

**正确示例（只序列化 1 个字段）：**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

---

## 规则 3.5：通过组件组合并行获取数据

**影响:** 严重 (CRITICAL)  
**标签:** server, rsc, parallel-fetching, composition  

## 通过组件组合并行获取数据

React Server Components 在组件树内默认按顺序执行。通过重新组织组件结构，可以让数据获取并行进行。

**错误示例（Sidebar 需等待 Page 的 fetch 完成）：**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

**正确示例（两个 fetch 同时执行）：**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

**使用 `children` 的另一种写法：**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```

---

## 规则 3.6：使用 React.cache() 做单请求去重

**影响:** 中 (MEDIUM)  
**标签:** server, cache, react-cache, deduplication  

## 使用 React.cache() 做单请求去重

使用 `React.cache()` 对服务端请求去重。认证检查和数据库查询通常收益最大。

**用法：**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

在同一次请求内，多次调用 `getCurrentUser()` 只会执行一次查询。

**避免以内联对象作为参数：**

`React.cache()` 用浅比较（`Object.is`）判断命中。内联对象每次都会创建新引用，导致无法命中缓存。

**错误示例（始终缓存未命中）：**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss, runs query again
```

**正确示例（缓存命中）：**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive args use value equality
getUser(1)
getUser(1)  // Cache hit, returns cached result
```

如果必须传对象，请复用同一个引用：

```typescript
const params = { uid: 1 }
getUser(params)  // Query runs
getUser(params)  // Cache hit (same reference)
```

**Next.js 特别说明：**

在 Next.js 中，`fetch` 已扩展了请求级 memoization。同一个请求内，URL 和选项相同的 `fetch` 会自动去重，因此 `fetch` 场景通常不需要 `React.cache()`。但对于其他异步任务，`React.cache()` 仍然很关键：

- 数据库查询（Prisma、Drizzle 等）
- 重计算任务
- 认证检查
- 文件系统操作
- 非 fetch 的异步工作

可用 `React.cache()` 在组件树中对这些操作做去重。

参考： [React.cache 文档](https://react.dev/reference/react/cache)

---

## 规则 3.7：使用 `after()` 执行非阻塞操作

**影响:** 中 (MEDIUM)  
**标签:** server, async, logging, analytics, side-effects  

## 使用 `after()` 执行非阻塞操作

使用 Next.js 的 `after()` 安排“响应发送后再执行”的任务。这样日志、埋点和其他副作用就不会阻塞响应返回。

**错误示例（阻塞响应）：**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)
  
  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**正确示例（非阻塞）：**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)
  
  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'
    
    logUserAction({ sessionCookie, userAgent })
  })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

响应会先立即返回，日志在后台异步执行。

**常见场景：**

- 分析埋点
- 审计日志
- 发送通知
- 缓存失效
- 清理任务

**重要说明：**

- 即使响应失败或重定向，`after()` 也会执行
- 适用于 Server Actions、Route Handlers、Server Components

参考： [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
