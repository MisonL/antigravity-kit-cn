---
description: 调试命令。激活 DEBUG 模式，系统化调查问题。
---

# /debug - 系统化问题排查

$ARGUMENTS

---

## 目的

此命令会激活 DEBUG 模式，用于系统化调查问题、错误或非预期行为。

---

## 行为

当触发 `/debug` 时：

1. **收集信息**
   - 错误信息
   - 复现步骤
   - 预期行为 vs 实际行为
   - 最近改动

2. **构建假设**
   - 列出可能原因
   - 按可能性排序

3. **系统化排查**
   - 逐条验证假设
   - 检查日志与数据流
   - 使用排除法定位

4. **修复并预防**
   - 实施修复
   - 解释根因
   - 增加预防措施

---

## 输出格式

```markdown
## 🔍 Debug: [Issue]

### 1. Symptom
[What's happening]

### 2. Information Gathered
- Error: `[error message]`
- File: `[filepath]`
- Line: [line number]

### 3. Hypotheses
1. ❓ [Most likely cause]
2. ❓ [Second possibility]
3. ❓ [Less likely cause]

### 4. Investigation

**Testing hypothesis 1:**
[What I checked] → [Result]

**Testing hypothesis 2:**
[What I checked] → [Result]

### 5. Root Cause
🎯 **[Explanation of why this happened]**

### 6. Fix
```[language]
// Before
[broken code]

// After
[fixed code]
```

### 7. Prevention
🛡️ [How to prevent this in the future]
```

---

## 示例

```
/debug login not working
/debug API returns 500
/debug form doesn't submit
/debug data not saving
```

---

## 关键原则

- **先问再假设** - 先拿到完整错误上下文
- **验证假设** - 不要随机猜测
- **解释原因** - 不只说怎么改，还要说为什么
- **防止复发** - 增加测试与校验
