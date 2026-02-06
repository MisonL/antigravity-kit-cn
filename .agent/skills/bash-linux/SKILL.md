---
name: bash-linux
description: Bash/Linux 终端命令模式。关键命令、管道操作、错误处理、脚本编写。在 macOS 或 Linux 系统上工作时使用。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Bash Linux Patterns - Bash Linux 模式

> Linux/macOS 上 Bash 的基本模式。

---

## 1. 运算符语法 (Operator Syntax)

### 链式命令

| 运算符 | 含义                 | 示例                                |
| ------ | -------------------- | ----------------------------------- |
| `;`    | 顺序运行             | `cmd1; cmd2`                        |
| `&&`   | 如果上一个成功则运行 | `npm install && npm run dev`        |
| `\|\|` | 如果上一个失败则运行 | `npm test \|\| echo "Tests failed"` |
| `\|`   | 管道输出             | `ls \| grep ".js"`                  |

---

## 2. 文件操作 (File Operations)

### 核心命令

| 任务         | 命令                                 |
| ------------ | ------------------------------------ |
| 列出所有     | `ls -la`                             |
| 查找文件     | `find . -name "*.js" -type f`        |
| 文件内容     | `cat file.txt`                       |
| 前 N 行      | `head -n 20 file.txt`                |
| 后 N 行      | `tail -n 20 file.txt`                |
| 跟踪日志     | `tail -f log.txt`                    |
| 在文件中搜索 | `grep -r "pattern" --include="*.js"` |
| 文件大小     | `du -sh *`                           |
| 磁盘使用     | `df -h`                              |

---

## 3. 进程管理 (Process Management)

| 任务               | 命令                          |
| ------------------ | ----------------------------- |
| 列出进程           | `ps aux`                      |
| 按名称查找         | `ps aux \| grep node`         |
| 按 PID 杀死        | `kill -9 <PID>`               |
| 查找端口占用用户   | `lsof -i :3000`               |
| 杀掉占用端口的进程 | `kill -9 $(lsof -t -i :3000)` |
| 后台运行           | `npm run dev &`               |
| 作业列表           | `jobs -l`                     |
| 调至前台           | `fg %1`                       |

---

## 4. 文本处理 (Text Processing)

### 核心工具

| 工具   | 用途     | 示例                            |
| ------ | -------- | ------------------------------- |
| `grep` | 搜索     | `grep -rn "TODO" src/`          |
| `sed`  | 替换     | `sed -i 's/old/new/g' file.txt` |
| `awk`  | 提取列   | `awk '{print $1}' file.txt`     |
| `cut`  | 剪切字段 | `cut -d',' -f1 data.csv`        |
| `sort` | 排序行   | `sort -u file.txt`              |
| `uniq` | 去重     | `sort file.txt \| uniq -c`      |
| `wc`   | 计数     | `wc -l file.txt`                |

---

## 5. 环境变量 (Environment Variables)

| 任务        | 命令                            |
| ----------- | ------------------------------- |
| 查看所有    | `env` 或 `printenv`             |
| 查看单个    | `echo $PATH`                    |
| 临时设置    | `export VAR="value"`            |
| 脚本内设置  | `VAR="value" command`           |
| 添加到 PATH | `export PATH="$PATH:/new/path"` |

---

## 6. 网络 (Network)

| 任务      | 命令                                                                        |
| --------- | --------------------------------------------------------------------------- |
| 下载      | `curl -O https://example.com/file`                                          |
| API 请求  | `curl -X GET https://api.example.com`                                       |
| POST JSON | `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' URL` |
| 检查端口  | `nc -zv localhost 3000`                                                     |
| 网络信息  | `ifconfig` 或 `ip addr`                                                     |

---

## 7. 脚本模板 (Script Template)

```bash
#!/bin/bash
set -euo pipefail  # 出错、未定义变量、管道失败时退出

# 颜色 (可选)
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 函数
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# 主函数
main() {
    log_info "Starting..."
    # 你的逻辑
    log_info "Done!"
}

main "$@"
```

---

## 8. 常见模式 (Common Patterns)

### 检查命令是否存在

```bash
if command -v node &> /dev/null; then
    echo "Node is installed"
fi
```

### 默认变量值

```bash
NAME=${1:-"default_value"}
```

### 逐行读取文件

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

### 遍历文件

```bash
for file in *.js; do
    echo "Processing $file"
done
```

---

## 9. 与 PowerShell 的区别 (Differences from PowerShell)

| 任务       | PowerShell               | Bash             |
| ---------- | ------------------------ | ---------------- |
| 列出文件   | `Get-ChildItem`          | `ls -la`         |
| 查找文件   | `Get-ChildItem -Recurse` | `find . -type f` |
| 环境       | `$env:VAR`               | `$VAR`           |
| 字符串拼接 | `"$a$b"`                 | `"$a$b"` (相同)  |
| 空检查     | `if ($x)`                | `if [ -n "$x" ]` |
| 管道       | 基于对象                 | 基于文本         |

---

## 10. 错误处理 (Error Handling)

### 设置选项

```bash
set -e          # 出错退出
set -u          # 未定义变量退出
set -o pipefail # 管道失败退出
set -x          # 调试：打印命令
```

### 清理陷阱 (Trap for cleanup)

```bash
cleanup() {
    echo "Cleaning up..."
    rm -f /tmp/tempfile
}
trap cleanup EXIT
```

---

> **记住：** Bash 是基于文本的。使用 `&&` 链接成功操作，使用 `set -e` 保证安全，并且记得给变量加引号！
