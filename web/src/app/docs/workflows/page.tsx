import { Lightbulb } from "lucide-react";
import Link from "next/link";
import workflowsData from "@/services/workflows.json";

export default function WorkflowsPage() {
    // 若 JSON 未提供示例，则使用默认格式
    const workflows = workflowsData.map(wf => ({
        ...wf,
        usage: wf.command + " [args]", // 默认示例
    }));

    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">斜杠工作流</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    斜杠工作流
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    面向常见开发任务的斜杠命令流程。
                </p>
            </div>

            {/* What are Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    什么是工作流？
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    工作流是针对特定开发任务的分步流程，通过斜杠命令触发，确保过程一致且可复用。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    工作流以 Markdown 文件保存，包含标题、描述与一系列步骤指令，并通过 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">/workflow-name</code> 调用。
                    与规则提供的“提示级上下文”不同，工作流提供的是“轨迹级步骤”。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    单个工作流文件限制为 12,000 字符，并且工作流内部可以调用其他工作流来组合复杂流程。
                </p>
            </section>

            {/* How to Use */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    如何使用工作流
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    直接输入斜杠命令并附上你的任务描述即可：
                </p>

                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`/brainstorm 认证系统
/create 带 Hero 的着陆页
/debug 为什么登录失败`}</code>
                    </pre>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100 mb-0">
                        <Lightbulb className="w-4 h-4 inline" />
                        <strong className="font-semibold">提示：</strong>部分工作流可能包含 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 font-mono text-xs">// turbo</code> 标记，用于自动执行安全命令（无需二次确认）。
                    </p>
                </div>
            </section>

            {/* Available Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    可用工作流
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    当前共 {workflows.length} 个工作流，覆盖常见开发场景：
                </p>

                <div className="space-y-6">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.command}
                            className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <code className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                                    {workflow.command}
                                </code>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                                {workflow.description}
                            </p>
                            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-2">
                                    使用示例
                                </div>
                                <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                                    {workflow.usage}
                                </code>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Creating Custom Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    创建自定义工作流
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    在 Antigravity Editor 中，你可以通过 Agent 面板顶部的 “...” 进入 Customizations，然后在 Workflows 面板中创建全局或工作区工作流。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    在 Antigravity Kit 中，工作流以文件形式保存在 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">.agent/workflows/</code>，便于版本控制与团队共享：
                </p>

                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`---
description: 部署到预发布环境
---

# 部署工作流

1. 运行测试
2. 构建生产包
3. 部署到预发布
4. 验证部署`}</code>
                    </pre>
                </div>

                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    保存为 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">.agent/workflows/deploy-staging.md</code>，然后用 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">/deploy-staging</code> 调用。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                    你也可以在工作流步骤中调用其他工作流，例如 “Call /workflow-2”。 
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/cli"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">CLI 参考 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看命令行工具
                        </p>
                    </Link>
                    <Link
                        href="/docs/agents"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">返回智能体 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看专家智能体
                        </p>
                    </Link>
                </div>
            </section>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <Link
                    href="/docs/skills"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    技能
                </Link>
                <Link
                    href="/docs/cli"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    CLI 参考
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
