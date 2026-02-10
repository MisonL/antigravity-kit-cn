---
name: bash-linux
description: Bash/Linux terminal patterns（终端模式）。Critical commands, piping, error handling, scripting（核心命令/管道/错误处理/脚本编写）。Use when working on macOS or Linux systems（适用于 macOS 或 Linux 系统）。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Bash Linux Patterns（Bash/Linux 实践模式）

> Essential patterns for Bash on Linux/macOS（适用于 Linux/macOS 的 Bash 核心模式）。

---

## 1. Operator Syntax（操作符语法）

### Chaining Commands（链式命令）

| Operator（操作符） | Meaning（含义） | Example（示例） |
| ------ | ---- | ---- |
| `;` | Run sequentially（顺序执行） | `cmd1; cmd2` |
| `&&` | Run if previous succeeded（前一命令成功后执行） | `npm install && npm run dev` |
| `||` | Run if previous failed（前一命令失败后执行） | `npm test || echo "Tests failed"` |
| `|` | Pipe output（管道输出） | `ls | grep ".js"` |

---

## 2. File Operations（文件操作）

### Essential Commands（核心命令）

| Task（任务） | Command（命令） |
| ---- | ---- |
| List all（列出所有） | `ls -la` |
| Find files（查找文件） | `find . -name "*.js" -type f` |
| File content（查看内容） | `cat file.txt` |
| First N lines（前 N 行） | `head -n 20 file.txt` |
| Last N lines（后 N 行） | `tail -n 20 file.txt` |
| Follow log（跟踪日志） | `tail -f log.txt` |
| Search in files（文件内搜索） | `grep -r "pattern" --include="*.js"` |
| File size（文件大小） | `du -sh *` |
| Disk usage（磁盘占用） | `df -h` |

---

## 3. Process Management（进程管理）

| Task（任务） | Command（命令） |
| ---- | ---- |
| List processes（列出进程） | `ps aux` |
| Find by name（按名查找） | `ps aux | grep node` |
| Kill by PID（按 PID 终止） | `kill -9 <PID>` |
| Find port user（查占用端口） | `lsof -i :3000` |
| Kill port（释放端口） | `kill -9 $(lsof -t -i :3000)` |
| Background（后台运行） | `npm run dev &` |
| Jobs（作业列表） | `jobs -l` |
| Bring to front（切回前台） | `fg %1` |

---

## 4. Text Processing（文本处理）

### Core Tools（核心工具）

| Tool（工具） | Purpose（用途） | Example（示例） |
| ---- | ---- | ---- |
| `grep` | Search（搜索） | `grep -rn "TODO" src/` |
| `sed` | Replace（替换） | `sed -i 's/old/new/g' file.txt` |
| `awk` | Extract columns（列提取） | `awk '{print $1}' file.txt` |
| `cut` | Cut fields（字段切割） | `cut -d',' -f1 data.csv` |
| `sort` | Sort lines（排序） | `sort -u file.txt` |
| `uniq` | Unique lines（去重） | `sort file.txt | uniq -c` |
| `wc` | Count（计数） | `wc -l file.txt` |

---

## 5. Environment Variables（环境变量）

| Task（任务） | Command（命令） |
| ---- | ---- |
| View all（查看全部） | `env` or `printenv` |
| View one（查看单个） | `echo $PATH` |
| Set temporary（临时设置） | `export VAR="value"` |
| Set in script（命令内设置） | `VAR="value" command` |
| Add to PATH（追加 PATH） | `export PATH="$PATH:/new/path"` |

---

## 6. Network（网络操作）

| Task（任务） | Command（命令） |
| ---- | ---- |
| Download（下载） | `curl -O https://example.com/file` |
| API request（API 请求） | `curl -X GET https://api.example.com` |
| POST JSON（发送 JSON） | `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' URL` |
| Check port（检查端口） | `nc -zv localhost 3000` |
| Network info（网络信息） | `ifconfig` or `ip addr` |

---

## 7. Script Template（脚本模板）

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined var, pipe fail（报错即退出、禁用未定义变量、管道错误传播）

# Colors (optional)（配色选项）
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Script directory（脚本所在目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions（日志函数）
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# Main（主逻辑）
main() {
    log_info "Starting..."
    # Your logic here
    log_info "Done!"
}

main "$@"
```

---

## 8. Common Patterns（通用模式）

### Check if command exists（检查命令是否存在）

```bash
if command -v node &> /dev/null; then
    echo "Node is installed"
fi
```

### Default variable value（变量默认值）

```bash
NAME=${1:-"default_value"}
```

### Read file line by line（逐行读取文件）

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

### Loop over files（循环处理文件）

```bash
for file in *.js; do
    echo "Processing $file"
done
```

---

## 9. Differences from PowerShell（与 PowerShell 的差异）

| Task（任务） | PowerShell | Bash |
| ---- | ---------- | ---- |
| List files（列出文件） | `Get-ChildItem` | `ls -la` |
| Find files（查找文件） | `Get-ChildItem -Recurse` | `find . -type f` |
| Environment（环境变量） | `$env:VAR` | `$VAR` |
| String concat（字符串拼接） | `"$a$b"` | `"$a$b"` (same) |
| Null check（空值检查） | `if ($x)` | `if [ -n "$x" ]` |
| Pipeline（管道） | Object-based（对象） | Text-based（文本） |

---

## 10. Error Handling（错误处理）

### Set options（设置选项）

```bash
set -e          # Exit on error（遇错退出）
set -u          # Exit on undefined variable（未定义变量即退出）
set -o pipefail # Exit on pipe failure（管道失败即退出）
set -x          # Debug: print commands（调试模式）
```

### Trap for cleanup（资源清理）

```bash
cleanup() {
    echo "Cleaning up..."
    rm -f /tmp/tempfile
}
trap cleanup EXIT
```

---

> **Remember:** Bash is text-based. Use `&&` for success chains, `set -e` for safety, and quote your variables!（Bash 基于文本处理，使用 `&&` 做成功链式调用，使用 `set -e` 保证安全，并始终对变量加引号。）

---
