---
description: 在现有应用中新增或更新功能。用于迭代开发。
---

# /enhance - 更新应用

$ARGUMENTS

---

## 任务

此命令用于在现有应用中添加功能或进行更新。

### 步骤：

1. **理解当前状态**
   - 通过 `python .agent/scripts/session_manager.py info` 加载项目状态
   - 理解现有功能与技术栈

2. **规划变更**
   - 明确将新增/修改哪些内容
   - 识别受影响文件
   - 检查依赖关系

3. **向用户展示计划**（针对较大改动）
   ```
   "To add admin panel:
   - I'll create 15 new files
   - Update 8 files
   - Takes ~10 minutes
   
   Should I start?"
   ```

4. **执行**
   - 调用相关 agent
   - 实施改动
   - 执行测试

5. **更新预览**
   - 热重载或重启服务

---

## 使用示例

```
/enhance add dark mode
/enhance build admin panel
/enhance integrate payment system
/enhance add search feature
/enhance edit profile page
/enhance make responsive
```

---

## 注意事项

- 对重大改动先获得用户确认
- 对冲突请求给出警告（例如项目使用 PostgreSQL 却要求改用 Firebase）
- 每次改动都通过 git 提交
