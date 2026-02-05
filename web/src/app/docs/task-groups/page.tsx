import Link from "next/link";

export default function TaskGroupsPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">任务组</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    任务组（Task Groups）
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    在规划模式下，Agent 会用任务组把复杂问题拆解为可执行的工作单元。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    当 Agent 处于规划模式时，大型复杂任务会被拆分为多个任务组。任务组将问题拆成更小的单元，且 Agent 可能会并行处理多个部分。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    任务组顶部会说明该任务的总体目标与当前变更摘要，并提供已编辑文件的列表，便于你快速审查。点击文件标签即可查看文件当前状态。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    在任务组内部，Agent 会进一步拆分子任务，并在进度更新中展示执行过程。默认情况下，子任务细节不会全部展开，但你可以切换查看具体步骤。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    如果存在待处理步骤（例如浏览器设置或需要批准的终端命令），Agent 会在任务组末尾提供专门的待处理区，方便你集中审核。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/agent-modes-settings"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent 模式与设置 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解规划模式的适用场景
                        </p>
                    </Link>
                    <Link
                        href="/docs/browser-subagent"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">浏览器子智能体 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解浏览器任务如何被执行
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
