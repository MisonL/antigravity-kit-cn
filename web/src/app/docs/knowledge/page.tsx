import Link from "next/link";

export default function KnowledgePage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Knowledge</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Knowledge
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Knowledge Items 是 Antigravity 的持久记忆系统，会自动捕捉并整理你在编码过程中的关键洞察、模式与解决方案。
                </p>
            </div>

            <section className="mb-12 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">什么是 Knowledge Item？</h2>
                    <p className="text-base text-zinc-600 dark:text-zinc-400">
                        Knowledge Item 是围绕特定主题的一组相关信息，包含标题与摘要，并附带一组可参考的 artifacts，例如自动生成文档、代码示例或对用户偏好的持久化记录。
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">如何生成？</h2>
                    <p className="text-base text-zinc-600 dark:text-zinc-400">
                        当你与 Agent 交互时，Antigravity 会自动分析对话内容，并生成新的 Knowledge Item 或更新已有条目。
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">在哪里查看？</h2>
                    <p className="text-base text-zinc-600 dark:text-zinc-400">
                        你可以在 Antigravity Agent Manager 中查看 Knowledge Items。
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Agent 如何使用？</h2>
                    <p className="text-base text-zinc-600 dark:text-zinc-400">
                        Agent 可以访问所有 Knowledge Items 的摘要，并在识别到相关主题时自动阅读其 artifacts，从而在后续对话中复用有效信息。
                    </p>
                </div>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/artifacts"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Artifacts →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看产物与反馈机制
                        </p>
                    </Link>
                    <Link
                        href="/docs/agent"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解 Agent 核心能力
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
