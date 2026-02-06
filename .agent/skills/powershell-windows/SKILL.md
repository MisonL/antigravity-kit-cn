---
name: powershell-windows
description: PowerShell Windows 脚本编写模式与陷阱
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# PowerShell Windows Patterns - PowerShell Windows 模式

> Windows PowerShell 的关键模式与陷阱。

---

## 1. 运算符语法规则 (Operator Syntax Rules)

### 关键：括号是必须的

| ❌ 错误                                | ✅ 正确                                    |
| -------------------------------------- | ------------------------------------------ |
| `if (Test-Path "a" -or Test-Path "b")` | `if ((Test-Path "a") -or (Test-Path "b"))` |
| `if (Get-Item $x -and $y -eq 5)`       | `if ((Get-Item $x) -and ($y -eq 5))`       |

**规则:** 使用逻辑运算符时，每个 cmdlet 调用**必须**放在括号中。

---

## 2. Unicode/Emoji 限制

### 关键：脚本中禁止 Unicode

| 用途            | ❌ 不要使用 | ✅ 使用    |
| --------------- | ----------- | ---------- |
| 成功 (Success)  | ✅ ✓        | [OK] [+]   |
| 错误 (Error)    | ❌ ✗ 🔴     | [!] [X]    |
| 警告 (Warning)  | ⚠️ 🟡       | [*] [WARN] |
| 信息 (Info)     | ℹ️ 🔵       | [i] [INFO] |
| 进度 (Progress) | ⏳          | [...]      |

**规则:** PowerShell 脚本中仅使用 ASCII 字符。

---

## 3. 空值检查模式 (Null Check Patterns)

### 访问前始终检查

| ❌ 错误              | ✅ 正确                          |
| -------------------- | -------------------------------- |
| `$array.Count -gt 0` | `$array -and $array.Count -gt 0` |
| `$text.Length`       | `if ($text) { $text.Length }`    |

---

## 4. 字符串插值 (String Interpolation)

### 复杂表达式

| ❌ 错误                     | ✅ 正确    |
| --------------------------- | ---------- |
| `"Value: $($obj.prop.sub)"` | 先存入变量 |

**模式:**

```powershell
$value = $obj.prop.sub
Write-Output "Value: $value"
```

---

## 5. 错误处理 (Error Handling)

### ErrorActionPreference

| 值               | 用途                        |
| ---------------- | --------------------------- |
| Stop             | 开发 (快速失败 - fail fast) |
| Continue         | 生产脚本                    |
| SilentlyContinue | 预期会出错时                |

### Try/Catch 模式

- 不要从 try 块内部返回
- 使用 finally 进行清理
- 在 try/catch 之后返回

---

## 6. 文件路径 (File Paths)

### Windows 路径规则

| 模式          | 用途                                    |
| ------------- | --------------------------------------- |
| Literal path  | `C:\Users\User\file.txt`                |
| Variable path | `Join-Path $env:USERPROFILE "file.txt"` |
| Relative      | `Join-Path $ScriptDir "data"`           |

**规则:** 使用 Join-Path 以确保跨平台安全。

---

## 7. 数组操作 (Array Operations)

### 正确模式

| 操作           | 语法              |
| -------------- | ----------------- | --------- |
| 空数组         | `$array = @()`    |
| 添加项         | `$array += $item` |
| ArrayList 添加 | `$list.Add($item) | Out-Null` |

---

## 8. JSON 操作 (JSON Operations)

### 关键：Depth 参数

| ❌ 错误          | ✅ 正确                    |
| ---------------- | -------------------------- |
| `ConvertTo-Json` | `ConvertTo-Json -Depth 10` |

**规则:** 始终为嵌套对象指定 `-Depth`。

### 文件操作

| 操作       | 模式                          |
| ---------- | ----------------------------- | ------------------------ | ------------------------------------ |
| 读 (Read)  | `Get-Content "file.json" -Raw | ConvertFrom-Json`        |
| 写 (Write) | `$data                        | ConvertTo-Json -Depth 10 | Out-File "file.json" -Encoding UTF8` |

---

## 9. 常见错误 (Common Errors)

| 错误消息               | 原因         | 修复                          |
| ---------------------- | ------------ | ----------------------------- |
| "parameter 'or'"       | 缺少括号     | 将 cmdlets 包裹在括号 `()` 中 |
| "Unexpected token"     | Unicode 字符 | 仅使用 ASCII                  |
| "Cannot find property" | 空对象       | 先检查是否为空                |
| "Cannot convert"       | 类型不匹配   | 使用 `.ToString()`            |

---

## 10. 脚本模板 (Script Template)

```powershell
# Strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# Paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Main
try {
    # Logic here
    Write-Output "[OK] Done"
    exit 0
}
catch {
    Write-Warning "Error: $_"
    exit 1
}
```

---

> **记住:** PowerShell 具有独特的语法规则。括号、仅 ASCII 和空值检查是不可协商的。
