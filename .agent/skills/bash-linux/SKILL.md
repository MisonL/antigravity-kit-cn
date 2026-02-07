---
name: bash-linux
description: Bash/Linux 终端命令模式。关键命令、管道操作、错误处理、脚本编写。在 macOS 或 Linux 系统上工作时使用。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Bash Linux Patterns

> Linux/macOS 上 Bash 的基本使用模式。

---

## 1. Operator Syntax

### Chaining Commands

| Operator | Meaning            | Example                      |
| -------- | ------------------ | ---------------------------- | ------------------ | ----------- | --- | -------------------- |
| `;`      | 按顺序运行         | `cmd1; cmd2`                 |
| `&&`     | 前一个成功后再运行 | `npm install && npm run dev` |
| `        |                    | `                            | 前一个失败后再运行 | `npm test   |     | echo "Tests failed"` |
| `        | `                  | 管道输出                     | `ls                | grep ".js"` |

---

## 2. File Operations

### Essential Commands

| Task         | Command                              |
| ------------ | ------------------------------------ |
| 列出所有     | `ls -la`                             |
| 查找文件     | `find . -name "*.js" -type f`        |
| 查看内容     | `cat file.txt`                       |
| 前 N 行      | `head -n 20 file.txt`                |
| 后 N 行      | `tail -n 20 file.txt`                |
| 实时跟踪日志 | `tail -f log.txt`                    |
| 文件内搜索   | `grep -r "pattern" --include="*.js"` |
| 查看文件大小 | `du -sh *`                           |
| 磁盘占用     | `df -h`                              |

---

## 3. Process Management

| Task          | Command                       |
| ------------- | ----------------------------- | ---------- |
| 列出进程      | `ps aux`                      |
| 按名称查找    | `ps aux                       | grep node` |
| 按 PID 杀进程 | `kill -9 <PID>`               |
| 查找端口占用  | `lsof -i :3000`               |
| 杀死端口占用  | `kill -9 $(lsof -t -i :3000)` |
| 后台运行      | `npm run dev &`               |
| 查看任务      | `jobs -l`                     |
| 调回前台      | `fg %1`                       |

---

## 4. Text Processing

### Core Tools

| Tool   | Purpose       | Example                         |
| ------ | ------------- | ------------------------------- | -------- |
| `grep` | 搜索          | `grep -rn "TODO" src/`          |
| `sed`  | 替换          | `sed -i 's/old/new/g' file.txt` |
| `awk`  | 提取列        | `awk '{print $1}' file.txt`     |
| `cut`  | 切割字段      | `cut -d',' -f1 data.csv`        |
| `sort` | 排序行        | `sort -u file.txt`              |
| `uniq` | 去重/统计重复 | `sort file.txt                  | uniq -c` |
| `wc`   | 统计 (行数)   | `wc -l file.txt`                |

---

## 5. Environment Variables

| Task         | Command                         |
| ------------ | ------------------------------- |
| 查看所有     | `env` or `printenv`             |
| 查看特定变量 | `echo $PATH`                    |
| 设置临时变量 | `export VAR="value"`            |
| 在脚本中设置 | `VAR="value" command`           |
| 添加到 PATH  | `export PATH="$PATH:/new/path"` |

---

## 6. Network

| Task           | Command                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| 下载文件       | `curl -O https://example.com/file`                                          |
| API 请求       | `curl -X GET https://api.example.com`                                       |
| POST JSON 数据 | `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' URL` |
| 检查端口       | `nc -zv localhost 3000`                                                     |
| 网络信息       | `ifconfig` or `ip addr`                                                     |

---

## 7. Script Template

```bash
#!/bin/bash
set -euo pipefail  # 出错退出、未定义变量报错、管道错误退出

# 颜色设置 (可选)
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日志函数
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# 主逻辑
main() {
    log_info "正在启动..."
    # 此处编写逻辑
    log_info "完成！"
}

main "$@"
```

---

## 8. Common Patterns

### Check if command exists

```bash
if command -v node &> /dev/null; then
    echo "Node 已安装"
fi
```

### Default variable value

```bash
NAME=${1:-"default_value"}
```

### Read file line by line

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

### Loop over files

```bash
for file in *.js; do
    echo "正在处理 $file"
done
```

---

## 9. Differences from PowerShell

| Task       | PowerShell               | Bash             |
| ---------- | ------------------------ | ---------------- |
| 列出文件   | `Get-ChildItem`          | `ls -la`         |
| 查找文件   | `Get-ChildItem -Recurse` | `find . -type f` |
| 环境变量   | `$env:VAR`               | `$VAR`           |
| 字符串拼接 | `"$a$b"`                 | `"$a$b"` (相同)  |
| 空检查     | `if ($x)`                | `if [ -n "$x" ]` |
| 管道       | 基于对象                 | 基于文本         |

---

## 10. Error Handling

### Set options

```bash
set -e          # 出错退出
set -u          # 未定义变量退出
set -o pipefail # 管道失败退出
set -x          # 调试：打印命令
```

### Trap for cleanup

```bash
cleanup() {
    echo "正在清理..."
    rm -f /tmp/tempfile
}
trap cleanup EXIT
```

---

> **记住：** Bash 是基于文本的。使用 `&&` 链接成功操作，使用 `set -e` 保证安全，并且记得给变量加引号！
