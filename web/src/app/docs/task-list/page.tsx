import Link from "next/link";

export default function TaskListPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Task List</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Task List
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Task List 是一种 Artifact，用于处理复杂任务并跟踪多个行动项的进展。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    该产物通常以 Markdown 列表形式呈现，涵盖研究、实现、验证等阶段。你可以在其中看到 Agent 的实时工作快照。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    Task List 主要用于帮助 Agent 维持与用户目标一致的执行轨迹，一般不需要你直接干预。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/implementation-plan"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">实施计划 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解可审核的计划产物
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
