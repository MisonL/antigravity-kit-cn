# 响应格式原则（Response Format Principles）

> 一致性是关键——选择一种格式并坚持使用。

## 常见模式

```
请选择一种:
├── 信封模式（Envelope pattern）: { success, data, error }
├── 直接返回数据（Direct data）: 仅返回资源内容
└── HAL/JSON:API（超媒体模式）
```

## 错误响应（Error Response）

```
应包含:
├── 错误代码（Error code）: 用于程序化处理
├── 用户消息（User message）: 用于界面显示
├── 详细信息（Details）: 用于调试、字段级错误
├── 请求 ID（Request ID）: 用于支持查询
└── 绝不包含内部实现细节（安全隐患）
```

## 分页类型（Pagination Types）

| 类型 | 最佳适用场景 | 权衡（Trade-offs） |
| :--- | :----------- | :---------------- |
| **Offset（偏移量）** | 简单，支持跳转页码 | 大数据集性能差 |
| **Cursor（游标）** | 大数据集，无限滚动 | 无法跳转特定页 |
| **Keyset（键集）** | 性能至关重要 | 需要可排序的键 |

### 选择问题

1. 数据集有多大？
2. 用户需要跳转到特定页面吗？
3. 数据是否频繁变化？
