# 3. 服务端性能 (Server-Side Performance)

> **影响:** 高 (HIGH)
> **重点:** 优化服务器端渲染和数据获取，消除服务端瀑布流并减少响应时间。

---

## 概览

本节包含 **7 条规则**，专注于服务端性能。

---

## 规则 3.1: 像 API 路由一样验证 Server Actions

**影响:** 严重 (CRITICAL)
**标签:** server, server-actions, authentication, security, authorization

## 像 API 路由一样验证 Server Actions

**影响: 严重 (防止未经授权访问服务器变更)**

Server Actions (带有 `"use server"` 的函数) 像 API 路由一样作为公开端点暴露。**务必在每个 Server Action 内部**验证认证和授权——不要仅依赖中间件、布局守卫或页面级检查，因为 Server Actions 可以被直接调用。

Next.js 文档明确指出："将 Server Actions 视为面向公众的 API 端点，并采用相同的安全考量，验证用户是否被允许执行变更。"

**错误示范 (无认证检查):**

```typescript
"use server";

export async function deleteUser(userId: string) {
    // 任何人都可以调用！无认证检查
    await db.user.delete({ where: { id: userId } });
    return { success: true };
}
```

**正确示范 (Action 内部认证):**

```typescript
"use server";

import { verifySession } from "@/lib/auth";
import { unauthorized } from "@/lib/errors";

export async function deleteUser(userId: string) {
    // 始终在 Action 内部检查认证
    const session = await verifySession();

    if (!session) {
        throw unauthorized("Must be logged in");
    }

    // 还要检查授权
    if (session.user.role !== "admin" && session.user.id !== userId) {
        throw unauthorized("Cannot delete other users");
    }

    await db.user.delete({ where: { id: userId } });
    return { success: true };
}
```

---

## 规则 3.2: 避免在 RSC Props 中重复序列化

**影响:** 低 (LOW)
**标签:** server, rsc, serialization, props, client-components

## 避免在 RSC Props 中重复序列化

**影响: 低 (通过避免重复序列化减少网络负载)**

RSC→Client 的序列化通过对象引用进行去重，而不是值。相同的引用 = 序列化一次；新的引用 = 再次序列化。在客户端进行转换 (`.toSorted()`, `.filter()`, `.map()`)，而不是服务器。

**错误示范 (重复数组):**

```tsx
// RSC: 发送 6 个字符串 (2 个数组 × 3 个项目)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**正确示范 (发送 3 个字符串):**

```tsx
// RSC: 发送一次
<ClientList usernames={usernames} />;

// Client: 在那里转换
("use client");
const sorted = useMemo(() => [...usernames].sort(), [usernames]);
```

**破坏去重的操作 (创建新引用):**

- 数组: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`
- 对象: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

---

## 规则 3.3: 跨请求 LRU 缓存

**影响:** 高 (HIGH)
**标签:** server, cache, lru, cross-request

## 跨请求 LRU 缓存

`React.cache()` 仅在单个请求内有效。对于跨连续请求共享的数据 (用户点击按钮 A，然后点击按钮 B)，使用 LRU 缓存。

**实现:**

```typescript
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, any>({
    max: 1000,
    ttl: 5 * 60 * 1000, // 5 minutes
});

export async function getUser(id: string) {
    const cached = cache.get(id);
    if (cached) return cached;

    const user = await db.user.findUnique({ where: { id } });
    cache.set(id, user);
    return user;
}
```

当用户的连续操作在几秒钟内命中多个需要相同数据的端点时使用。

---

## 规则 3.4: 在 RSC 边界最小化序列化

**影响:** 高 (HIGH)
**标签:** server, rsc, serialization, props

## 在 RSC 边界最小化序列化

React Server/Client 边界将所有对象属性序列化为字符串，并嵌入 HTML 响应和后续 RSC 请求中。序列化数据直接影响页面重量和加载时间，因此**大小非常重要**。只传递客户端实际使用的字段。

**错误示范 (序列化所有 50 个字段):**

```tsx
async function Page() {
    const user = await fetchUser(); // 50 个字段
    return <Profile user={user} />;
}

("use client");
function Profile({ user }: { user: User }) {
    return <div>{user.name}</div>; // 仅使用了 1 个字段
}
```

**正确示范 (仅序列化 1 个字段):**

```tsx
async function Page() {
    const user = await fetchUser();
    return <Profile name={user.name} />;
}

("use client");
function Profile({ name }: { name: string }) {
    return <div>{name}</div>;
}
```

---

## 规则 3.5: 使用组件组合进行并行数据获取

**影响:** 严重 (CRITICAL)
**标签:** server, rsc, parallel-fetching, composition

## 使用组件组合进行并行数据获取

React Server Components 在树中按顺序执行。通过组合重构以并行化数据获取。

**错误示范 (Sidebar 等待 Page 的 fetch 完成):**

```tsx
export default async function Page() {
    const header = await fetchHeader();
    return (
        <div>
            <div>{header}</div>
            <Sidebar />
        </div>
    );
}

async function Sidebar() {
    const items = await fetchSidebarItems();
    return <nav>{items.map(renderItem)}</nav>;
}
```

**正确示范 (两者同时获取):**

```tsx
async function Header() {
    const data = await fetchHeader();
    return <div>{data}</div>;
}

async function Sidebar() {
    const items = await fetchSidebarItems();
    return <nav>{items.map(renderItem)}</nav>;
}

export default function Page() {
    return (
        <div>
            <Header />
            <Sidebar />
        </div>
    );
}
```

---

## 规则 3.6: 使用 React.cache() 进行每请求去重

**影响:** 中 (MEDIUM)
**标签:** server, cache, react-cache, deduplication

## 使用 React.cache() 进行每请求去重

使用 `React.cache()` 进行服务端请求去重。认证和数据库查询受益最大。

**用法:**

```typescript
import { cache } from "react";

export const getCurrentUser = cache(async () => {
    const session = await auth();
    if (!session?.user?.id) return null;
    return await db.user.findUnique({
        where: { id: session.user.id },
    });
});
```

在单个请求中，对 `getCurrentUser()` 的多次调用只执行一次查询。

**避免使用内联对象作为参数:**

`React.cache()` 使用浅层相等 (`Object.is`) 来确定缓存命中。内联对象每次调用都会创建新引用，导致缓存失效。

**错误示范 (总是未命中缓存):**

```typescript
const getUser = cache(async (params: { uid: number }) => {
    return await db.user.findUnique({ where: { id: params.uid } });
});

// 每次调用创建新对象，永不命中缓存
getUser({ uid: 1 });
getUser({ uid: 1 }); // 缓存未命中，再次运行查询
```

**正确示范 (缓存命中):**

```typescript
const getUser = cache(async (uid: number) => {
    return await db.user.findUnique({ where: { id: uid } });
});

// 原始参数使用值相等
getUser(1);
getUser(1); // 缓存命中，返回缓存结果
```

**Next.js 特别说明:**

在 Next.js 中，`fetch` API 自动扩展了请求记忆化。具有相同 URL 和选项的请求在单个请求中会自动去重，因此不需要对 `fetch` 调用使用 `React.cache()`。但是，`React.cache()` 对其他异步任务仍然至关重要：数据库查询、重型计算、认证检查等。

---

## 规则 3.7: 对非阻塞操作使用 after()

**影响:** 中 (MEDIUM)
**标签:** server, async, logging, analytics, side-effects

## 对非阻塞操作使用 after()

使用 Next.js 的 `after()` 调度应在响应发送后执行的工作。这可以防止日志记录、分析和其他副作用阻塞响应。

**错误示范 (阻塞响应):**

```tsx
import { logUserAction } from "@/app/utils";

export async function POST(request: Request) {
    // 执行变更
    await updateDatabase(request);

    // 日志记录阻塞响应
    const userAgent = request.headers.get("user-agent") || "unknown";
    await logUserAction({ userAgent });

    return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
```

**正确示范 (非阻塞):**

```tsx
import { after } from "next/server";
import { headers, cookies } from "next/headers";
import { logUserAction } from "@/app/utils";

export async function POST(request: Request) {
    // 执行变更
    await updateDatabase(request);

    // 在响应发送后记录日志
    after(async () => {
        const userAgent = (await headers()).get("user-agent") || "unknown";
        const sessionCookie =
            (await cookies()).get("session-id")?.value || "anonymous";

        logUserAction({ sessionCookie, userAgent });
    });

    return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
```

响应立即发送，而日志记录在后台进行。
