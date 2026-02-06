import Link from "next/link";

export default function RulesWorkflowsPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">规则与工作流</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    规则与工作流
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    用规则约束 Agent 行为，用工作流固化重复性流程。
                </p>
            </div>

            {/* Rules */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    规则（Rules）
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    规则是你手动定义的约束，可作用于本地或全局，帮助 Agent 遵循你的使用场景与风格。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    规则文件本质上是 Markdown 文档，用于描述你希望 Agent 贯彻的约束。每个规则文件限制为 12,000 个字符。
                </p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">快速开始</h3>
                        <ol className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                            <li>在编辑器的 Agent 面板顶部，点击 “...” 打开自定义面板。</li>
                            <li>进入「Rules」面板。</li>
                            <li>点击 + Global 新建全局规则，或 + Workspace 新建工作区规则。</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">全局规则</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            全局规则存放在 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">~/.gemini/GEMINI.md</code>，适用于所有工作区。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">工作区规则</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            工作区规则存放在当前工作区或 Git 根目录的
                            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono ml-1">.agent/rules</code>
                            文件夹。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-2">你可以为规则指定激活方式：</p>
                        <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li><strong className="text-zinc-900 dark:text-zinc-50">Manual</strong>：通过在 Agent 输入框中 @ 提及手动启用。</li>
                            <li><strong className="text-zinc-900 dark:text-zinc-50">Always On</strong>：始终启用。</li>
                            <li><strong className="text-zinc-900 dark:text-zinc-50">Model Decision</strong>：根据规则的自然语言描述，由模型决定是否应用。</li>
                            <li><strong className="text-zinc-900 dark:text-zinc-50">Glob</strong>：根据你设定的 glob 模式（如 *.js、src/**/*.ts）匹配文件时自动应用。</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">@ 引用（Mentions）</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            你可以在规则文件中通过 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">@filename</code> 引用其他文件。
                            若为相对路径，将相对于规则文件位置解析；若为绝对路径，则优先解析为真实绝对路径，否则回退为仓库内路径。
                            例如：<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">@/path/to/file.md</code>
                            会先尝试 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">/path/to/file.md</code>，若不存在则解析为
                            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono ml-1">workspace/path/to/file.md</code>。
                        </p>
                    </div>
                </div>
            </section>

            {/* Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    工作流（Workflows）
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    工作流用于定义一系列步骤，引导 Agent 完成重复性任务，例如部署服务或回复 PR 评论。工作流以 Markdown 文件保存，并通过斜杠命令
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono ml-1">/workflow-name</code>
                    调用。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    与规则提供的「提示级上下文」不同，工作流提供的是「轨迹级步骤」，用于串联多个相关动作。
                </p>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">创建工作流</h3>
                        <ol className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                            <li>在编辑器的 Agent 面板顶部，点击 “...” 打开自定义面板。</li>
                            <li>进入「Workflows」面板。</li>
                            <li>点击 + Global 创建全局工作流，或 + Workspace 创建工作区工作流。</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">执行工作流</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            在 Agent 中输入 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">/workflow-name</code> 即可执行。
                            工作流内部还可以调用其他工作流，例如在步骤中写入 “Call /workflow-2” 或 “Call /workflow-3”。
                            调用后，Agent 会按顺序处理每一步。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                            工作流文件包含标题、描述以及一系列步骤说明，每个文件同样限制为 12,000 个字符。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Agent 生成工作流</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            你也可以直接让 Agent 为你生成工作流。该能力在你已经手动完成一系列步骤之后尤其有效，Agent 可以基于会话上下文快速整理为可复用流程。
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
                        href="/docs/workflows"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">斜杠工作流 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看可复用的命令流程
                        </p>
                    </Link>
                    <Link
                        href="/docs/skills"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">技能 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解技能规范与目录结构
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
