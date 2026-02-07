---
description: 在现有应用中新增或更新功能。用于迭代开发。
---

# /enhance - 更新应用 (Update Application)

$ARGUMENTS

---

## 任务 (Task)

此命令用于在现有应用中新增功能或进行迭代更新。

### 具体步骤：

1. **了解当前状态 (Understand Current State)**
    - 使用 `python .agent/scripts/session_manager.py info` 加载项目状态。
    - 理解现有功能及技术栈 (Tech stack)。

2. **规划变更 (Plan Changes)**
    - 确定需要新增/变更的内容。
    - 检测受影响的文件。
    - 检查依赖关系。

3. **向老板展示计划**（针对重大变更）

    ```
    “为了添加管理后台：
    - 我将创建 15 个新文件
    - 更新 8 个文件
    - 预计耗时约 10 分钟

    老板，我可以开始了吗？”
    ```

4. **应用变更 (Apply)**
    - 调用相关的专家代理。
    - 执行代码变更。
    - 进行测试。

5. **更新预览 (Update Preview)**
    - 执行热重载 (Hot reload) 或重启预览服务。

---

## 使用示例 (Usage Examples)

```
/enhance 添加深色模式
/enhance 构建管理后台
/enhance 集成支付系统
/enhance 添加搜索功能
/enhance 编辑个人资料页面
/enhance 进行响应式适配
```

---

## 警告/注意事项 (Caution)

- 对于重大变更，**必须**获得审批。
- 对冲突的需求进行预警（例如：在项目使用 PostgreSQL 时要求“使用 Firebase”）。
- 每一项变更都应使用 Git 进行提交。
