import Link from "next/link";

export default function StrictModePage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Strict Mode</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Strict Mode
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Strict Mode 为 Agent 提供更严格的安全控制，限制对外部资源与敏感操作的访问，保护你的环境。
                </p>
            </div>

            {/* Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    功能
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">浏览器 URL 允许/拒绝列表</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            在 Strict Mode 下，Agent 与外部网站交互将受到浏览器 Allowlist/Denylist 约束，包括：
                        </p>
                        <ul className="mt-3 space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li>外部 Markdown 图片：仅允许来自允许列表 URL 的图片渲染。</li>
                            <li>Read URL 工具：只会对允许的 URL 自动执行。</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">终端、浏览器与产物审核策略</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            Strict Mode 会强制以下策略：
                        </p>
                        <ul className="mt-3 space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li>终端自动执行：固定为 “Request Review”，忽略终端允许列表。</li>
                            <li>浏览器 Javascript 执行：固定为 “Request Review”。</li>
                            <li>Artifact 审核：固定为 “Request Review”，执行计划前必须确认。</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">文件系统访问</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            Strict Mode 会限制 Agent 的文件系统访问范围：
                        </p>
                        <ul className="mt-3 space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li>尊重 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">.gitignore</code> 规则，避免访问被忽略文件。</li>
                            <li>工作区隔离：禁止访问工作区外文件，只允许在指定工作区内操作。</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/sandbox-mode"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">终端沙箱 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解内核级隔离机制
                        </p>
                    </Link>
                    <Link
                        href="/docs/agent-modes-settings"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent 模式与设置 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看全局设置项
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
