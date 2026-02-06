import Link from "next/link";
import agents from '@/services/agents.json';
import skills from '@/services/skills.json';
import workflows from '@/services/workflows.json';

export default function DocsPage() {
    return (
        <div className="max-w-3xl">
            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    文档
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    欢迎来到 <span className="before:-inset-x-1 before:-rotate-1 relative z-4 before:pointer-events-none before:absolute before:inset-y-0 before:z-4 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-orange-500 before:opacity-16 before:mix-blend-hard-light">
                        Antigravity Kit
                    </span> 文档。
                </p>
            </div>

            {/* What is Antigravity Kit */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    什么是 <span className="before:-inset-x-1 before:-rotate-1 relative z-4 before:pointer-events-none before:absolute before:inset-y-0 before:z-4 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-orange-500 before:opacity-16 before:mix-blend-hard-light">
                        Antigravity Kit
                    </span>？
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    <span className="before:-inset-x-1 before:-rotate-1 relative z-4 before:pointer-events-none before:absolute before:inset-y-0 before:z-4 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-orange-500 before:opacity-16 before:mix-blend-hard-light">
                        Antigravity Kit
                    </span>{" "}
                    是一套包含 Skills、Agents 与 Workflows 的 AI Agent 模板集合，旨在为{" "}
                    <a
                        href="https://antigravity.google/t"
                        className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-50 transition-colors"
                    >
                        Antigravity
                    </a>{" "}
                    提供更强的开发辅助能力。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    无论你是个人开发者还是团队成员，Antigravity Kit 都能通过 {skills.length}+ 个技能、{agents.length}+ 位专家智能体与 {workflows.length}+ 条生产级工作流，帮助你更快构建更好的软件。
                </p>
            </section>

            {/* What's Included */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    包含内容
                </h2>
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                    <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{agents.length}+</div>
                        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">专家智能体</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                            覆盖前端、后端、安全等领域
                        </p>
                    </div>
                    <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{skills.length}+</div>
                        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">领域技能</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                            React、Next.js、测试等知识模块
                        </p>
                    </div>
                    <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{workflows.length}+</div>
                        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">工作流</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                            常见开发任务的斜杠命令流程
                        </p>
                    </div>
                </div>
            </section>

            {/* How to Use the Docs */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    如何使用文档
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    文档分为 6 个主要板块：
                </p>
                <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/installation" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            快速开始
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            快速安装与配置
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/agents" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            核心概念
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            了解智能体、技能、模型与规则/工作流
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/agent" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            Agent 机制
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Artifacts、Task List 与知识记忆
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/strict-mode" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            安全控制
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Strict Mode、终端沙箱与 URL 允许/拒绝列表
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/command" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            编辑器能力
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Command、MCP 与浏览器子智能体
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Link href="/docs/cli" className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
                            CLI 参考
                        </Link>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            详细的命令行文档
                        </p>
                    </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    使用侧边栏浏览内容，或使用 <kbd className="px-2 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">Ctrl+K / ⌘K</kbd> 快速搜索。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/installation"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">安装 →</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            一分钟内完成安装
                        </p>
                    </Link>
                    <Link
                        href="/docs/agents"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">了解核心概念 →</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            理解智能体、技能与规则/工作流
                        </p>
                    </Link>
                </div>
            </section>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="text-sm text-zinc-500 dark:text-zinc-500">
                    快速开始
                </div>
                <Link
                    href="/docs/installation"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    安装
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
