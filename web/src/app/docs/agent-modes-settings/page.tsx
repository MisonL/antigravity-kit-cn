import Link from "next/link";

export default function AgentModesSettingsPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Agent 模式与设置</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Agent 模式与设置
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    了解对话级模式选择与全局设置项，确保 Agent 的行为符合你的需求。
                </p>
            </div>

            {/* Conversation-Level */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    对话级模式
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    启动新的 Agent 会话时，可以在多个模式之间选择：
                </p>
                <ul className="space-y-4 text-base text-zinc-600 dark:text-zinc-400">
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">规划模式（Planning）</strong>：
                        Agent 会在执行前先规划。适合深度研究、复杂任务或协作型工作。在该模式下，Agent 会组织任务组（Task Groups）、产出 Artifacts，并通过充分的研究与推演来提升质量。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">快速模式（Fast）</strong>：
                        Agent 直接执行任务。适合简单、局部且对速度要求更高的任务，例如重命名变量、执行少量 Bash 命令等。
                    </li>
                </ul>
            </section>

            {/* Overall Settings */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    全局设置
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    全部会话通用的设置位于设置面板的「Agent」标签页。以下是常见核心设置：
                </p>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Artifact 审核策略</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">可选项：</p>
                        <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li><strong className="text-zinc-900 dark:text-zinc-50">始终继续（Always Proceed）</strong>：Agent 不会请求审核。</li>
                            <li><strong className="text-zinc-900 dark:text-zinc-50">请求审核（Request Review）</strong>：Agent 总是请求审核。</li>
                        </ul>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                            当 Agent 认为需要对实施计划进行审核时，该策略决定其行为。设置为“请求审核”时，Agent 会在通知后终止输出，以便你充分审查并补充意见。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            若你不需要人工审核，可设置为“始终继续”，此时 Agent 会在请求审核时直接继续执行计划。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                            更多细节见 <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/implementation-plan">Implementation Plan</Link>。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">终端命令自动执行</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">针对终端命令生成工具的策略：</p>
                        <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li><strong className="text-zinc-900 dark:text-zinc-50">请求审核（Request Review）</strong>：默认不自动执行终端命令（除非命令在允许列表中）。</li>
                            <li><strong className="text-zinc-900 dark:text-zinc-50">始终继续（Always Proceed）</strong>：默认自动执行终端命令（除非命令在拒绝列表中）。</li>
                        </ul>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                            允许列表与拒绝列表可在「Agent」标签页中配置，用于更精细的权限控制。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            注意：该设置的变更只对新消息生效，正在生成的响应仍会沿用之前的设置。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            在 Unix shell 中，允许/拒绝规则会与命令的空格分词前缀匹配；在 PowerShell 中，规则可匹配命令分词的任意连续子序列。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">非工作区文件访问</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            允许 Agent 查看与编辑当前工作区之外的文件。默认情况下，Agent 仅能访问工作区文件以及应用根目录
                            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono ml-1">~/.antigravity/</code>，
                            其中包含 Artifacts、Knowledge Items 等 Antigravity 数据。
                        </p>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                            请谨慎开启此项，因为它可能暴露本地的敏感信息或机密数据。
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
                        href="/docs/task-groups"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">任务组 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解规划模式下的任务拆分
                        </p>
                    </Link>
                    <Link
                        href="/docs/rules-workflows"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">规则与工作流 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            掌控约束与可复用流程
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
