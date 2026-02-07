---
name: powershell-windows
description: PowerShell (任务自动化和配置管理框架) Windows 模式。包含关键陷阱、运算符语法 (Operator syntax) 和错误处理。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# PowerShell Windows 模式

> Windows PowerShell 的关键模式与陷阱。

---

## 1. 运算符语法规则 (Operator Syntax Rules)

### 关键：必须使用括号

| ❌ 错误做法                            | ✅ 正确做法                                |
| -------------------------------------- | ------------------------------------------ |
| `if (Test-Path "a" -or Test-Path "b")` | `if ((Test-Path "a") -or (Test-Path "b"))` |
| `if (Get-Item $x -and $y -eq 5)`       | `if ((Get-Item $x) -and ($y -eq 5))`       |

**规则：** 使用逻辑运算符时，每个 Cmdlet (命令) 调用必须放在括号中。

---

## 2. Unicode / 表情符号限制

### 关键：脚本中禁止使用 Unicode

| 用途 | ❌ 禁止使用 | ✅ 建议使用 |
| ---- | ----------- | ----------- |
| 成功 | ✅ ✓        | [OK] [+]    |
| 错误 | ❌ ✗ 🔴     | [!] [X]     |
| 警告 | ⚠️ 🟡       | [*] [WARN]  |
| 信息 | ℹ️ 🔵       | [i] [INFO]  |
| 进度 | ⏳          | [...]       |

**规则：** 在 PowerShell 脚本中仅使用 ASCII 字符。

---

## 3. 空值检查模式 (Null Check Patterns)

### 访问前始终进行检查

| ❌ 错误做法          | ✅ 正确做法                      |
| -------------------- | -------------------------------- |
| `$array.Count -gt 0` | `$array -and $array.Count -gt 0` |
| `$text.Length`       | `if ($text) { $text.Length }`    |

---

## 4. 字符串插值 (String Interpolation)

### 复杂表达式

| ❌ 错误做法                 | ✅ 正确做法 |
| --------------------------- | ----------- |
| `"Value: $($obj.prop.sub)"` | 先存入变量  |

**模式：**

```powershell
$value = $obj.prop.sub
Write-Output "Value: $value"
```

---

## 5. 错误处理

### ErrorActionPreference (错误操作首选项)

| 取值             | 用途                 |
| ---------------- | -------------------- |
| Stop             | 开发环境（快速失败） |
| Continue         | 生产环境脚本         |
| SilentlyContinue | 预期会发生错误时     |

### Try/Catch (捕获异常) 模式

- 不要在 `try` 块内使用 `return`
- 使用 `finally` 进行清理
- 在 `try/catch` 块之后返回结果

---

## 6. 文件路径

### Windows 路径规则

| 模式     | 用途                                    |
| -------- | --------------------------------------- |
| 字面路径 | `C:\Users\User\file.txt`                |
| 变量路径 | `Join-Path $env:USERPROFILE "file.txt"` |
| 相对路径 | `Join-Path $ScriptDir "data"`           |

**规则：** 使用 `Join-Path` 以确保跨平台安全性。

---

## 7. 数组操作

### 正确模式

| 操作           | 语法              |
| -------------- | ----------------- | --------- |
| 空数组         | `$array = @()`    |
| 添加项         | `$array += $item` |
| ArrayList 添加 | `$list.Add($item) | Out-Null` |

---

## 8. JSON 操作

### 关键：Depth 参数

| ❌ 错误做法      | ✅ 正确做法                |
| ---------------- | -------------------------- |
| `ConvertTo-Json` | `ConvertTo-Json -Depth 10` |

**规则：** 针对嵌套对象，始终指定 `-Depth` 参数。

### 文件操作

| 操作 | 模式                          |
| ---- | ----------------------------- | ------------------------ | ------------------------------------ |
| 读取 | `Get-Content "file.json" -Raw | ConvertFrom-Json`        |
| 写入 | `$data                        | ConvertTo-Json -Depth 10 | Out-File "file.json" -Encoding UTF8` |

---

## 9. 常见错误

| 错误消息               | 原因              | 修复方法            |
| ---------------------- | ----------------- | ------------------- |
| "parameter 'or'"       | 缺少括号          | 用 `()` 包裹 Cmdlet |
| "Unexpected token"     | 包含 Unicode 字符 | 仅使用 ASCII        |
| "Cannot find property" | 对象为空          | 先进行空值检查      |
| "Cannot convert"       | 类型不匹配        | 使用 `.ToString()`  |

---

## 10. 脚本模板

```powershell
# 严格模式
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# 路径
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 主逻辑
try {
    # 在此编写逻辑
    Write-Output "[OK] Done"
    exit 0
}
catch {
    Write-Warning "Error: $_"
    exit 1
}
```

---

> **记住：** PowerShell (PowerShell 脚本) 具有独特的语法规则。括号使用、仅限 ASCII 以及空值检查是必须遵守的前提。
