# 移动端后端模式（Mobile Backend Patterns）

> **本文件专门覆盖移动端客户端所需的后端/API 模式。**
> 通用后端模式请参考 `nodejs-best-practices` 与 `api-patterns`。
> **移动端后端 ≠ Web 后端，约束不同，模式不同。**

---

## 🧠 移动端后端思维（MOBILE BACKEND MINDSET）

```
移动端客户端与 Web 完全不同：
├── 网络不稳定（2G/地铁/电梯）
├── 电量敏感（减少唤醒）
├── 存储有限（不能全量缓存）
├── 会话频繁中断（电话/通知）
├── 设备差异极大（老机到旗舰）
└── 二进制更新很慢（App Store 审核）
```

**后端必须补偿以上全部问题。**

---

## 🚫 AI 移动端后端反模式（ANTI-PATTERNS）

### AI 常见移动端后端错误

| ❌ AI 默认 | 为什么错 | ✅ 移动端正确做法 |
|-----------|----------|------------------|
| Web 与移动共用同一 API | 移动端需要更紧凑响应 | 独立移动端接口或字段选择 |
| 全对象返回 | 浪费带宽与电量 | 部分字段 + 分页 |
| 不考虑离线 | 断网即崩 | Offline-first + 同步队列 |
| 全用 WebSocket | 电量消耗大 | Push + 轮询兜底 |
| 不做版本管理 | 无法强更，破坏兼容 | 版本头 + 最低版本检查 |
| 泛化错误信息 | 用户无法自救 | 移动端错误码 + 复原动作 |
| Session 认证 | App 重启丢状态 | Token + Refresh |
| 忽略设备信息 | 无法定位问题 | 设备 ID/版本入 Header |

---

## 1. 推送通知（Push Notifications）

### 平台架构（Platform Architecture）

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                         │                                        │
│              ┌──────────┴──────────┐                            │
│              ▼                     ▼                            │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │   FCM (Google)  │   │  APNs (Apple)   │                    │
│    │   Firebase      │   │  Direct or FCM  │                    │
│    └────────┬────────┘   └────────┬────────┘                    │
│             │                     │                              │
│             ▼                     ▼                              │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │ Android Device  │   │   iOS Device    │                    │
│    └─────────────────┘   └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Push 类型（Push Types）

| 类型（Type） | 场景（Use Case） | 用户可见（User Sees） |
|-------------|------------------|-----------------------|
| **Display** | 新消息、订单更新 | 通知横幅 |
| **Silent** | 后台同步、内容更新 | 用户不可见（后台） |
| **Data** | App 自定义处理 | 由 App 决定 |

### 反模式（Anti-Patterns）

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| 推送中携带敏感数据 | Push 只提示“新消息”，内容由 App 拉取 |
| 高强度推送轰炸 | 合并、去重、尊重静默时段 |
| 所有人同文案 | 按用户偏好/时区分组 |
| 忽略失效 token | 定期清理无效 token |
| iOS 不走 APNs | 仅 FCM 无法保证 iOS 投递 |

### Token 管理（Token Management）

```
TOKEN 生命周期：
├── App 注册 → 获取 token → 回传后端
├── Token 可能变化 → App 启动需重新注册
├── Token 过期 → 从数据库清理
├── 用户卸载 → token 失效（靠错误反馈识别）
└── 多设备登录 → 同一用户多 token
```

---

## 2. 离线同步与冲突处理（Offline Sync & Conflict Resolution）

### 同步策略选择（Sync Strategy Selection）

```
数据类型是什么？
        │
        ├── 只读（新闻、目录）
        │   └── 简单缓存 + TTL
        │       └── ETag/Last-Modified 做失效
        │
        ├── 用户私有（笔记、待办）
        │   └── Last-write-wins（简单）
        │       └── 或时间戳合并
        │
        ├── 协作（共享文档）
        │   └── 必须 CRDT 或 OT
        │       └── 可考虑 Firebase/Supabase
        │
        └── 关键交易（支付、库存）
            └── 服务器为事实源
                └── Optimistic UI + 服务端确认
```

### 冲突处理策略（Conflict Resolution Strategies）

| 策略（Strategy） | 机制（How It Works） | 适用（Best For） |
|------------------|----------------------|------------------|
| **Last-write-wins** | 最新时间戳覆盖 | 单人简单数据 |
| **Server-wins** | 服务端绝对权威 | 关键交易 |
| **Client-wins** | 优先离线变更 | 离线重应用 |
| **Merge** | 字段级合并 | 文档、富文本 |
| **CRDT** | 数学级无冲突 | 实时协作 |

### 同步队列模式（Sync Queue Pattern）

```
客户端：
├── 用户操作 → 写本地 DB
├── 入同步队列 → { action, data, timestamp, retries }
├── 网络可用 → FIFO 处理队列
├── 成功 → 移除队列
├── 失败 → 退避重试（最多 5 次）
└── 冲突 → 应用冲突策略

服务端：
├── 接收带客户端时间戳的数据
├── 与服务端版本比较
├── 应用冲突策略
├── 返回合并结果
└── 客户端以服务端结果更新本地
```

---

## 3. 移动端 API 优化（Mobile API Optimization）

### 响应体积缩减（Response Size Reduction）

| 技术（Technique） | 节省（Savings） | 实现（Implementation） |
|------------------|----------------|------------------------|
| **字段选择** | 30-70% | `?fields=id,name,thumbnail` |
| **压缩** | 60-80% | gzip/brotli（自动） |
| **分页** | 视情况 | 移动端优先 Cursor |
| **图像变体** | 50-90% | `/image?w=200&q=80` |
| **Delta 同步** | 80-95% | 仅拉变更记录 |

### 分页：Cursor vs Offset

```
OFFSET（移动端不友好）：
├── Page 1: OFFSET 0 LIMIT 20
├── Page 2: OFFSET 20 LIMIT 20
├── 问题：新增数据会重复/错位
└── 问题：offset 越大越慢

CURSOR（移动端友好）：
├── First: ?limit=20
├── Next: ?limit=20&after=cursor_abc123
├── Cursor = 编码后的 id + sort
├── 数据变化不重复
└── 性能稳定
```

### 批量请求（Batch Requests）

```
不要这样：
GET /users/1
GET /users/2
GET /users/3
（3 次往返，3 倍延迟）

应该这样：
POST /batch
{ requests: [
    { method: "GET", path: "/users/1" },
    { method: "GET", path: "/users/2" },
    { method: "GET", path: "/users/3" }
]}
（1 次往返）
```

---

## 4. 应用版本管理（App Versioning）

### 版本检查接口（Version Check Endpoint）

```
GET /api/app-config
Headers:
  X-App-Version: 2.1.0
  X-Platform: ios
  X-Device-ID: abc123

Response:
{
  "minimum_version": "2.0.0",
  "latest_version": "2.3.0",
  "force_update": false,
  "update_url": "https://apps.apple.com/...",
  "feature_flags": {
    "new_player": true,
    "dark_mode": true
  },
  "maintenance": false,
  "maintenance_message": null
}
```

### 版本比较逻辑（Version Comparison Logic）

```
CLIENT VERSION vs MINIMUM VERSION:
├── client >= minimum → 正常继续
├── client < minimum → 强制更新页
│   └── 未更新不可用
└── client < latest → 弹出可选升级提示

FEATURE FLAGS：
├── 不用发版就能开关功能
├── 按版本/设备做 A/B
└── 灰度发布（10% → 50% → 100%）
```

---

## 5. 移动端认证（Authentication for Mobile）

### Token 策略（Token Strategy）

```
ACCESS TOKEN：
├── 短期（15 分钟 - 1 小时）
├── 存内存（非持久化）
├── API 请求使用
└── 过期自动刷新

REFRESH TOKEN：
├── 长期（30-90 天）
├── 存 SecureStore/Keychain
├── 仅用于换新 access token
└── 每次使用轮换（安全）

DEVICE TOKEN：
├── 标识设备
├── 支持“一键登出所有设备”
├── 与 refresh token 绑定
└── 服务端追踪设备列表
```

### 静默续期（Silent Re-authentication）

```
请求流程：
├── 带 access token 请求
├── 401 Unauthorized？
│   ├── 有 refresh token？
│   │   ├── Yes → 调 /auth/refresh
│   │   │   ├── 成功 → 重试原请求
│   │   │   └── 失败 → 强制登出
│   │   └── No → 强制登出
│   └── 仅过期（非失效）
│       └── 静默刷新，用户无感
└── 成功 → 继续
```

---

## 6. 移动端错误处理（Error Handling for Mobile）

### 移动端错误格式（Mobile-Specific Error Format）

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "Your payment was declined",
    "user_message": "Please check your card details or try another payment method",
    "action": {
      "type": "navigate",
      "destination": "payment_methods"
    },
    "retry": {
      "allowed": true,
      "after_seconds": 5
    }
  }
}
```

### 错误分类（Error Categories）

| 码段（Code Range） | 分类 | 移动端处理 |
|--------------------|------|------------|
| 400-499 | 客户端错误 | 提示用户并要求操作 |
| 401 | 认证过期 | 静默刷新或重新登录 |
| 403 | 无权限 | 显示升级/权限页 |
| 404 | 不存在 | 本地移除缓存 |
| 409 | 冲突 | 显示冲突处理 UI |
| 429 | 限流 | 读取 Retry-After 退避 |
| 500-599 | 服务端错误 | 退避重试 + 稍后再试 |
| Network | 无网络 | 用缓存 + 入队同步 |

---

## 7. 媒体与二进制处理（Media & Binary Handling）

### 图片优化（Image Optimization）

```
CLIENT REQUEST:
GET /images/{id}?w=400&h=300&q=80&format=webp

SERVER RESPONSE:
├── 动态裁剪或 CDN 变体
├── Android 用 WebP（更小）
├── iOS 14+ 可用 HEIC（支持时）
├── JPEG 兜底
└── Cache-Control: max-age=31536000
```

### 分片上传（Chunked Upload, 大文件）

```
UPLOAD FLOW:
1. POST /uploads/init
   { filename, size, mime_type }
   → { upload_id, chunk_size }

2. PUT /uploads/{upload_id}/chunks/{n}
   → 上传每个分片（1-5 MB）
   → 可断点续传

3. POST /uploads/{upload_id}/complete
   → 服务端拼装分片
   → 返回最终文件 URL
```

### 音视频流媒体（Streaming Audio/Video）

```
要求：
├── iOS 使用 HLS
├── Android 用 DASH 或 HLS
├── 多码率自适应
├── 支持 Range 请求（seek）
└── 支持离线下载分片

接口：
GET /media/{id}/manifest.m3u8  → HLS manifest
GET /media/{id}/segment_{n}.ts → 视频分片
GET /media/{id}/download       → 离线完整文件
```

---

## 8. 移动端安全（Security for Mobile）

### 设备证明（Device Attestation）

```
验证真机（非模拟器/机器人）：
├── iOS：DeviceCheck API
│   └── 服务端向 Apple 验证
├── Android：Play Integrity API（替代 SafetyNet）
│   └── 服务端向 Google 验证
└── 失败即拒绝（Fail closed）
```

### 请求签名（Request Signing）

```
CLIENT：
├── signature = HMAC(timestamp + path + body, secret)
├── 发送：X-Signature: {signature}
├── 发送：X-Timestamp: {timestamp}
└── 发送：X-Device-ID: {device_id}

SERVER：
├── 校验时间戳（5 分钟内）
├── 用同样规则生成签名
├── 比对签名
└── 不匹配则拒绝（篡改）
```

### 限流（Rate Limiting）

```
移动端建议限流维度：
├── 每设备（X-Device-ID）
├── 每用户（鉴权后）
├── 每接口（敏感接口更严）
└── 推荐滑动窗口

返回 Header：
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
Retry-After: 60（当 429）
```

---

## 9. 监控与分析（Monitoring & Analytics）

### 移动端必须携带的 Header

```
每个移动请求必须包含：
├── X-App-Version: 2.1.0
├── X-Platform: ios | android
├── X-OS-Version: 17.0
├── X-Device-Model: iPhone15,2
├── X-Device-ID: uuid（持久）
├── X-Request-ID: uuid（单次请求追踪）
├── Accept-Language: tr-TR
└── X-Timezone: Europe/Istanbul
```

### 需要记录的内容（What to Log）

```
每个请求：
├── 上述 Header
├── Endpoint / method / status
├── 响应时间
├── 错误细节（如有）
└── User ID（已登录）

告警：
├── 版本级错误率 > 5%
├── P95 延迟 > 2s
├── 某版本崩溃突增
├── 认证失败异常（可能攻击）
└── Push 投递失败激增
```

---

## 📝 移动端后端清单（MOBILE BACKEND CHECKLIST）

### API 设计前
- [ ] 已识别移动端特有需求？
- [ ] 离线行为已规划？
- [ ] 同步策略已设计？
- [ ] 带宽约束已考虑？

### 每个接口
- [ ] 响应尽量小？
- [ ] 分页是 cursor-based？
- [ ] 缓存头正确？
- [ ] 错误格式含行动指引？

### 认证
- [ ] Token 刷新机制？
- [ ] 静默续期流程？
- [ ] 多设备登出？
- [ ] 安全存储指引？

### 推送通知
- [ ] FCM + APNs 配置？
- [ ] Token 生命周期管理？
- [ ] Silent/Display 分工明确？
- [ ] Push 不含敏感数据？

### 发布
- [ ] 版本检查接口已就绪？
- [ ] Feature flags 配置？
- [ ] 强制更新机制？
- [ ] 监控 Header 强制要求？

---

> **记住（Remember）**：移动端后端必须能在差网环境、低电量、会话中断的情况下仍可用。客户端不可完全信任，但也不能“挂死”；要提供离线能力与清晰可恢复的错误路径。
