import Link from "next/link";

export default function ImplementationPlanPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Implementation Plan</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Implementation Plan
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Implementation Plan 是 Agent 规划与落地任务的关键 Artifact，包含完成任务所需的技术调整与实施步骤。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    Implementation Plan 通常会请求用户审核。除非你的“Artifact 审核策略”设置为 “Always Proceed”，否则 Agent 一般会先等待你点击“Proceed”再继续执行。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    如果计划与预期不完全一致，你可以在 Artifact 上直接留言反馈，例如缩小范围、切换技术栈或修正理解偏差。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    你既可以在评论后继续点击 “Proceed” 执行原计划，也可以切换到 “Review” 查看汇总评论并再给出反馈。Agent 会根据反馈迭代计划或进入实施阶段。
                </p>
            </section>

            {/* Related Settings */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    相关设置
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    你可以在 <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/agent-modes-settings">Agent 模式与设置</Link> 中配置 “Artifact 审核策略”。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/task-list"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">任务清单 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解 Task List 产物
                        </p>
                    </Link>
                    <Link
                        href="/docs/artifacts"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Artifacts →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            返回产物概览
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
