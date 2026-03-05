---
name: powershell-windows
description: PowerShell（任务自动化和配置管理框架）Windows 模式。包含关键陷阱、运算符语法（Operator Syntax）和错误处理。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# PowerShell Windows 实践模式

> 针对 Windows PowerShell 的核心模式与关键陷阱。

---

## 1. 运算符语法规则

### 关键：必须使用圆括号（Parentheses）

| ❌ 错误做法                            | ✅ 正确做法                                |
| -------------------------------------- | ------------------------------------------ |
| `if (Test-Path "a" -or Test-Path "b")` | `if ((Test-Path "a") -or (Test-Path "b"))` |
| `if (Get-Item $x -and $y -eq 5)`       | `if ((Get-Item $x) -and ($y -eq 5))`       |

**准则：** 在使用逻辑运算符时，每一个 Cmdlet（命令）的调用**必须**封装在圆括号内。

---

## 2. Unicode（统一码）/Emoji（表情符号）限制

### 关键：脚本中严禁使用 Unicode

| 用途 | ❌ 禁止使用 | ✅ 推荐使用 |
| ---- | ----------- | ----------- |
| 成功 | ✅ ✓        | [OK] [+]    |
| 错误 | ❌ ✗ 🔴     | [!] [X]     |
| 警告 | ⚠️ 🟡       | [*] [WARN]  |
| 信息 | ℹ️ 🔵       | [i] [INFO]  |
| 进度 | ⏳          | [...]       |

**准则：** 在 PowerShell 脚本中仅使用 ASCII（ASCII 码）字符。

---

## 3. 空值检查模式

### 在访问前始终检查

| ❌ 错误做法          | ✅ 正确做法                      |
| -------------------- | -------------------------------- |
| `$array.Count -gt 0` | `$array -and $array.Count -gt 0` |
| `$text.Length`       | `if ($text) { $text.Length }`    |

---

## 4. 字符串内插（Interpolation）

### 复杂表达式的处理

**推荐做法：** 先存储到变量中，再进行内插。

```powershell
$value = $obj.prop.sub
Write-Output "Value: $value"
```

---

## 5. 错误处理

### ErrorActionPreference（错误处理偏好）配置

| 取值             | 使用场景             |
| ---------------- | -------------------- |
| Stop             | 开发阶段（快速失败） |
| Continue         | 生产环境脚本         |
| SilentlyContinue | 预期可能会发生错误时 |

### Try/Catch（错误捕获）最佳实践

- 不要在 try 块内部直接返回。
- 始终使用 finally 块进行资源清理。
- 在 try/catch 结构之后再执行返回操作。

---

## 6. 文件路径处理

### Windows 路径规则

| 模式       | 用途                                    |
| ---------- | --------------------------------------- |
| 字面量路径 | `C:\Users\User\file.txt`                |
| 变量路径   | `Join-Path $env:USERPROFILE "file.txt"` |
| 相对路径   | `Join-Path $ScriptDir "data"`           |

**准则：** 使用 `Join-Path` 以确保跨平台的路径安全性。

---

## 7. 数组操作

### 正确的语法模式

| 操作项         | 语法                           |
| -------------- | ------------------------------ |
| 空数组         | `$array = @()`                 |
| 添加元素       | `$array += $item`              |
| ArrayList 添加 | `$list.Add($item) \| Out-Null` |

---

## 8. JSON（数据交换格式）操作

### 关键：深度参数（Depth Parameter）

| ❌ 错误做法      | ✅ 正确做法                |
| ---------------- | -------------------------- |
| `ConvertTo-Json` | `ConvertTo-Json -Depth 10` |

**准则：** 处理嵌套对象时，务必显式指定 `-Depth`。

### 文件读写操作

| 操作项 | 模式                                                                |
| ------ | ------------------------------------------------------------------- |
| 读取   | `Get-Content "file.json" -Raw \| ConvertFrom-Json`                  |
| 写入   | `$data \| ConvertTo-Json -Depth 10 \| Out-File "file.json" -Encoding UTF8` |

---

## 9. 常见错误速查

| 错误消息               | 原因              | 修复方案                |
| ---------------------- | ----------------- | ----------------------- |
| "parameter 'or'"       | 缺失圆括号        | 使用 () 封装 Cmdlet     |
| "Unexpected token"     | 存在 Unicode 字符 | 仅保留 ASCII 字符       |
| "Cannot find property" | 对象为空（Null）  | 先执行空值检查          |
| "Cannot convert"       | 类型不匹配        | 使用 `.ToString()` 转换 |

---

## 10. 脚本模板

```powershell
# 开启严格模式
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# 路径初始化
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 主程序逻辑
try {
    # 在此处编写业务逻辑
    Write-Output "[OK] Done"
    exit 0
}
catch {
    Write-Warning "Error: $_"
    exit 1
}
```

---

> **谨记：** PowerShell 具有独特的语法规则。圆括号的使用、仅限 ASCII 以及空值检查是不可逾越的底线。

---
