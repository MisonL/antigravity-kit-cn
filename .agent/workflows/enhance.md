---
description: 改进现有代码，添加功能或重构
---

# 增强 (Enhance Workflow)

**触发命令**: `/enhance [instruction]`

## 目的

在现有项目中修改代码、添加新功能或进行重构。与 `/create` 不同，它必须小心不破坏现有逻辑。

## 步骤流程

1. **上下文理解**:
    - 阅读 `task.md` (如果存在)。
    - 分析用户指定的代码文件。
    - 理解现有代码风格。

2. **影响分析**:
    - 如果你要修改 A 文件，会不会影响 B 文件？
    - 检查类型定义和导出。

3. **实施计划**:
    - 描述将要进行的修改。
    - 使用 `render_diffs` 或统一展示修改点。

4. **代码编写**:
    - 使用 `replace_file_content` 或 `multi_replace_file_content` 进行编辑。
    - 保持代码风格一致。

5. **验证**:
    - 运行 Lint 检查。
    - 运行相关测试。

## 示例

> User: /enhance 给登录按钮添加 loading 状态
> AI: 好的，我会修改 `LoginForm.tsx`，添加 `isSubmitting` 状态并更新按钮 UI。

---
