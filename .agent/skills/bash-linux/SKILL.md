---
name: bash-linux
description: Bash/Linux 终端模式。包含核心命令、管道 (Piping)、错误处理及脚本编写。适用于 macOS 或 Linux 系统。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Bash Linux 实践模式 (Bash Linux Patterns)

> 适用于 Linux/macOS 的 Bash 核心模式。

---

## 1. 操作符语法 (Operator Syntax)

### 链式命令 (Chaining Commands)

| 操作符 | 含义               | 示例                                |
| ------ | ------------------ | ----------------------------------- |
| `;`    | 顺序执行           | `cmd1; cmd2`                        |
| `&&`   | 前一命令成功后执行 | `npm install && npm run dev`        |
| `\|\|` | 前一命令失败后执行 | `npm test \|\| echo "测试执行失败"` |
| `\|`   | 管道 (Pipe) 输出   | `ls \| grep ".js"`                  |

---

## 2. 文件操作 (File Operations)

### 核心命令 (Essential Commands)

| 任务                  | 命令                                 |
| --------------------- | ------------------------------------ |
| 列出所有文件          | `ls -la`                             |
| 查找文件              | `find . -name "*.js" -type f`        |
| 查看文件内容          | `cat file.txt`                       |
| 查看前 N 行           | `head -n 20 file.txt`                |
| 查看后 N 行           | `tail -n 20 file.txt`                |
| 跟踪日志 (Follow log) | `tail -f log.txt`                    |
| 在文件中搜索          | `grep -r "pattern" --include="*.js"` |
| 查看文件大小          | `du -sh *`                           |
| 查看磁盘占用          | `df -h`                              |

---

## 3. 进程管理 (Process Management)

| 任务               | 命令                          |
| ------------------ | ----------------------------- |
| 列出所有进程       | `ps aux`                      |
| 按名称查找进程     | `ps aux \| grep node`         |
| 按 PID 杀掉进程    | `kill -9 <PID>`               |
| 查找占用端口的程序 | `lsof -i :3000`               |
| 关掉端口占用       | `kill -9 $(lsof -t -i :3000)` |
| 后台运行           | `npm run dev &`               |
| 查看作业 (Jobs)    | `jobs -l`                     |
| 将任务调回前台     | `fg %1`                       |

---

## 4. 文本处理 (Text Processing)

### 核心工具 (Core Tools)

| 工具   | 用途               | 示例                            |
| ------ | ------------------ | ------------------------------- |
| `grep` | 搜索               | `grep -rn "TODO" src/`          |
| `sed`  | 替换               | `sed -i 's/old/new/g' file.txt` |
| `awk`  | 列提取             | `awk '{print $1}' file.txt`     |
| `cut`  | 字段切割           | `cut -d',' -f1 data.csv`        |
| `sort` | 排序               | `sort -u file.txt`              |
| `uniq` | 去重/统计 (Unique) | `sort file.txt \| uniq -c`      |
| `wc`   | 计数 (Count)       | `wc -l file.txt`                |

---

## 5. 环境变量 (Environment Variables)

| 任务             | 命令                            |
| ---------------- | ------------------------------- |
| 查看所有环境变量 | `env` 或 `printenv`             |
| 查看特定变量     | `echo $PATH`                    |
| 设置临时变量     | `export VAR="value"`            |
| 在命令中设置     | `VAR="value" command`           |
| 添加到 PATH      | `export PATH="$PATH:/new/path"` |

---

## 6. 网络操作 (Network)

| 任务           | 命令                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| 下载文件       | `curl -O https://example.com/file`                                          |
| 发起 API 请求  | `curl -X GET https://api.example.com`                                       |
| 发送 POST JSON | `curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' URL` |
| 检查端口       | `nc -zv localhost 3000`                                                     |
| 查看网络信息   | `ifconfig` 或 `ip addr`                                                     |

---

## 7. 脚本模板 (Script Template)

```bash
#!/bin/bash
set -euo pipefail  # 报错即退出、禁用未定义变量、管道错误传播

# 配色选项 (可选)
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
    log_info "正在启动……"
    # 此处编写逻辑
    log_info "已完成！"
}

main "$@"
```

---

## 8. 通用模式 (Common Patterns)

### 检查命令是否存在

```bash
if command -v node &> /dev/null; then
    echo "Node 已安装"
fi
```

### 变量默认值

```bash
NAME=${1:-"默认值"}
```

### 逐行读取文件

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

### 循环处理文件

```bash
for file in *.js; do
    echo "正在处理 $file"
done
```

---

## 9. 与 PowerShell 的差异 (Differences from PowerShell)

| 任务       | PowerShell               | Bash             |
| ---------- | ------------------------ | ---------------- |
| 列出文件   | `Get-ChildItem`          | `ls -la`         |
| 查找文件   | `Get-ChildItem -Recurse` | `find . -type f` |
| 环境变量   | `$env:VAR`               | `$VAR`           |
| 字符串拼接 | `"$a$b"`                 | `"$a$b"` (相同)  |
| 空值检查   | `if ($x)`                | `if [ -n "$x" ]` |
| 管道       | 基于对象                 | 基于文本         |

---

## 10. 错误处理 (Error Handling)

### 设置选项

```bash
set -e          # 遇到错误即退出
set -u          # 遇到未定义变量即退出
set -o pipefail # 管道中任一命令失败即报错退出
set -x          # 调试模式：打印执行的命令
```

### 资源清理 (Trap)

```bash
cleanup() {
    echo "正在清理临时文件……"
    rm -f /tmp/tempfile
}
trap cleanup EXIT
```

---

> **谨记：** Bash 是基于文本处理的。使用 `&&` 进行链式成功调用，使用 `set -e` 保证脚本安全，并确保始终对变量加引号！

---

## Skills 兼容说明 (最小补充)

- **机制基线**：沿用上游 `.agent/skills/bash-linux/SKILL.md`。
- **Codex 适配**：由于 Codex 运行在受限沙箱环境，部分命令（如 `kill -9`）可能触发 `prefix_rule()` 审批拦截。
- **注意**：文档层不应改写 Bash 语法；仅在此提醒 Codex 审批行为。
