import Link from "next/link";

export default function BrowserSubagentPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">浏览器子智能体</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    浏览器子智能体（Browser Subagent）
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    当 Agent 需要操作浏览器时，会调用专门的浏览器子智能体来完成任务。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    浏览器子智能体运行的是专门面向网页操作的模型，负责在 Antigravity 管理的浏览器中执行任务。它与主 Agent 使用的模型不同。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    子智能体可使用多种浏览器控制工具，包括点击、滚动、输入、读取控制台日志等；也支持通过 DOM 捕获、截图或 Markdown 解析读取页面内容，并可录制视频。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    当子智能体控制页面时，会显示蓝色边框的覆盖层与操作提示面板。在此期间，为避免干扰，你无法与页面交互。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    子智能体可以在非当前焦点的标签页中工作，因此你仍可同时使用其他标签页。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/task-groups"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">任务组 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解规划模式下的任务拆分
                        </p>
                    </Link>
                    <Link
                        href="/docs/mcp"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">MCP 集成 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            连接更多外部上下文
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
