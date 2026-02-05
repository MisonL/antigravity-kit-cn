import Link from "next/link";

export default function AgentPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Agent</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Antigravity Agent
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Agent 是 Antigravity 的核心 AI 能力，由前沿大模型驱动，支持多步推理、工具调用（含浏览器）并通过任务、产物等形式与用户协作。
                </p>
            </div>

            {/* Core Components */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    核心组成
                </h2>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                    <li><strong className="text-zinc-900 dark:text-zinc-50">推理模型</strong>：多步推理与策略规划的核心能力。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">工具</strong>：终端、浏览器、文件系统、MCP 等可控工具。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Artifacts</strong>：用于传达思考与成果的产物（计划、diff、图示、录屏等）。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Knowledge</strong>：跨会话沉淀的知识项与总结。</li>
                </ul>
            </section>

            {/* Customizations */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    可定制项
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    你可以通过以下能力定制 Agent 行为：
                </p>
                <ul className="space-y-3 text-base text-zinc-600 dark:text-zinc-400">
                    <li>
                        <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/agent-modes-settings">Agent 模式与设置</Link>
                        ：控制规划模式、终端自动执行策略等。
                    </li>
                    <li>
                        <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/mcp">MCP 集成</Link>
                        ：连接外部上下文与工具。
                    </li>
                    <li>
                        <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/rules-workflows">规则与工作流</Link>
                        ：通过规则约束与工作流流程化任务。
                    </li>
                </ul>
            </section>

            {/* Conversations */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    多会话管理
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    你可以并行开启多个 Agent 会话。在 Agent Manager 中右键 “Delete Conversation” 或在编辑器的 Agent 面板点击垃圾桶图标即可删除会话。
                </p>
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
                            了解规划模式下的产物机制
                        </p>
                    </Link>
                    <Link
                        href="/docs/agent-modes-settings"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent 模式与设置 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            配置规划与执行策略
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
