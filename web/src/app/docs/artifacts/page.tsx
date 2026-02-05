import Link from "next/link";

export default function ArtifactsPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Artifacts</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Artifacts
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Artifacts 指 Agent 为完成任务或与用户沟通而生成的各类产物，例如富文本文档、diff 视图、架构图、图片、浏览器录屏等。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    随着 Agent 更加自动化、任务执行时间更长，Artifacts 让 Agent 可以异步地向用户汇报工作成果，而不需要用户同步跟进每一个步骤。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    Artifacts 通常在规划模式下产生，并同时出现在 Agent Manager 与编辑器中。Agent Manager 更适合浏览、组织与管理这些产物。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    反馈是 Artifacts 的关键环节。根据你的设置，Agent 可能会在中间阶段请求你审核产物，以确认方向是否符合目标。不同类型的 Artifact 在 UI/UX 上提供不同的反馈方式。
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
                        href="/docs/implementation-plan"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">实施计划 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解可审核的计划产物
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
