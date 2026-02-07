---
description: 调试命令。激活 DEBUG 模式并系统化排查问题。
---

# /debug - 系统化问题排查 (Systematic Problem Investigation)

$ARGUMENTS

---

## 目的 (Purpose)

该命令用于激活 DEBUG 模式，以系统化调查异常、报错或非预期行为。

---

## 行为 (Behavior)

触发 `/debug` 后：

1. **收集信息**
   - 错误信息
   - 复现步骤
   - 预期行为 vs 实际行为
   - 最近代码变更

2. **提出假设**
   - 列出可能原因
   - 按概率排序

3. **系统化调查**
   - 逐条验证假设
   - 检查日志与数据流
   - 用排除法收敛根因

4. **修复并预防**
   - 应用修复
   - 解释根因
   - 增加预防措施

---

## 输出格式 (Output Format)

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

## 示例 (Examples)

```
/debug login not working
/debug API returns 500
/debug form doesn't submit
/debug data not saving
```

---

## 关键原则 (Key Principles)

- **先问再判** - 先拿到完整错误上下文
- **验证假设** - 不要凭感觉乱改
- **解释原因** - 不只说“怎么修”，还要说“为何坏”
- **防止复发** - 补上测试与校验策略
