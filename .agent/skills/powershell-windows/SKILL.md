---
description: PowerShell Windows 脚本编写模式与陷阱
---

# PowerShell (Windows)

## 注意事项

1.  **编码问题 (Encoding)**
    - Windows 默认 GBK/CP936。尽量强制使用 UTF-8。
    - `$OutputEncoding = [System.Text.Encoding]::UTF8`

2.  **执行策略 (Execution Policy)**
    - 脚本可能默认被禁止运行。需运行 `Set-ExecutionPolicy RemoteSigned`。

3.  **动词-名词 结构**
    - PowerShell 命令都遵循 `Verb-Noun` 格式。
    - `Get-Process`, `New-Item`, `Remove-Item`。

## 常用命令对照

| Bash     | PowerShell                    |
| :------- | :---------------------------- |
| `ls`     | `Get-ChildItem` (ls 是别名)   |
| `cp`     | `Copy-Item`                   |
| `rm -rf` | `Remove-Item -Recurse -Force` |
| `grep`   | `Select-String`               |
| `curl`   | `Invoke-WebRequest`           |

## 管道对象

Bash 管道传递所有的都是**字符串 (Text)**，PowerShell 管道传递的是**对象 (.NET Objects)**。
这意味着你可以直接操作对象属性，而不需要 awk/sed 文本处理。

```powershell
Get-Process | Where-Object {$_.CPU -gt 10} | Stop-Process
```
