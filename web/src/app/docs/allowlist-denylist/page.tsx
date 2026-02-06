import Link from "next/link";

export default function AllowlistDenylistPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Allowlist / Denylist</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Allowlist / Denylist
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    浏览器通过“拒绝列表 + 允许列表”双层安全机制控制可访问 URL。
                </p>
            </div>

            {/* How it works */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    工作机制
                </h2>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 mb-8">
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Denylist（拒绝列表）</strong>：拦截危险/恶意 URL。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Allowlist（允许列表）</strong>：显式允许可信 URL。</li>
                </ul>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Denylist</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            拒绝列表由 Google Superroots 的 BadUrlsChecker 服务维护并在服务端强制执行。浏览器尝试导航时，主机会通过 RPC 与服务端拒绝列表匹配。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-3">
                            注意：若服务不可用，默认拒绝访问（fail closed）。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Allowlist</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-3">
                            允许列表是本地可编辑文本文件，用于显式信任指定 URL。默认仅包含 localhost，可随时修改。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-3">
                            当访问不在允许列表中的 URL 时，界面会提示 “always allow”。你确认后，该 URL 会加入允许列表并允许打开/交互。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            你也可以手动增删 URL，但拒绝列表始终优先：在 Denylist 中的 URL 无法被 Allowlist 覆盖。
                        </p>
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
                        href="/docs/strict-mode"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Strict Mode →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看严格模式下的安全收敛策略
                        </p>
                    </Link>
                    <Link
                        href="/docs/browser-subagent"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">浏览器子智能体 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解浏览器任务执行机制
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
