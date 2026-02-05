import Link from "next/link";

export default function CommandPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Command</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Antigravity 编辑器：Command
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Command 将自然语言带入你的工作流，让你在编辑器或终端中快速生成代码与命令。
                </p>
            </div>

            {/* How it works */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    工作原理
                </h2>
                <ul className="space-y-3 text-base text-zinc-600 dark:text-zinc-400">
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">触发</strong>：按下 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">Command + I</code>（Mac）或
                        <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono ml-1">Ctrl + I</code>（Windows/Linux）。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">输入</strong>：光标位置会出现输入框。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">指令</strong>：用自然语言描述需求（例如“创建一个排序函数”或“为这段代码添加错误处理”）。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">执行</strong>：Antigravity 会直接生成内联代码或命令，供你审核与接受。
                    </li>
                </ul>
            </section>

            {/* Where to Use */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    使用场景
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">在编辑器中</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-2">
                            生成样板代码、重构复杂函数或编写文档，不打断编码节奏。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            示例：<span className="font-mono">创建一个登录表单的 React 组件</span>
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">在终端中</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-2">
                            在集成终端中通过自然语言生成复杂命令，无需记忆语法。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            示例：<span className="font-mono">找到所有监听 3000 端口的进程并杀掉它们</span>
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
                        href="/docs/mcp"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">MCP 集成 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            连接外部上下文与工具
                        </p>
                    </Link>
                    <Link
                        href="/docs/rules-workflows"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">规则与工作流 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            管理规则并固化流程
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
