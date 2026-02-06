import Link from "next/link";

const reasoningModels = [
    "Gemini 3 Pro（high）",
    "Gemini 3 Pro（low）",
    "Gemini 3 Flash",
    "Claude Sonnet 4.5",
    "Claude Sonnet 4.5（thinking）",
    "Claude Opus 4.5（thinking）",
    "GPT-OSS",
];

export default function ModelsPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">模型</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    模型（Models）
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Antigravity 提供可选的推理模型，并在底层使用多种专用模型支撑不同能力。
                </p>
            </div>

            {/* Reasoning Model */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    推理模型
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    核心推理模型来自 Google Vertex Model Garden，可选：
                </p>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    {reasoningModels.map((model) => (
                        <li key={model}>{model}</li>
                    ))}
                </ul>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    你可以在会话输入框下方的模型下拉中选择推理模型。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    模型选择在同一轮用户消息中是“粘性”的：即使你在 Agent 运行中切换模型，当前这轮仍会使用之前的模型，直到该轮执行完成或被你取消。
                </p>
            </section>

            {/* Additional Models */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    其他模型
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    还有一些用于特定子系统的模型，这些模型通常不可在设置中手动切换：
                </p>
                <ul className="space-y-3 text-base text-zinc-600 dark:text-zinc-400">
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">Nano Banana Pro：</strong>
                        用于生成式图像任务，如 UI mockup、页面素材、系统架构图等。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">Gemini 2.5 Pro UI Checkpoint：</strong>
                        用于 <Link href="/docs/browser-subagent" className="underline underline-offset-4 text-zinc-900 dark:text-zinc-50">浏览器子智能体</Link> 执行点击、滚动、输入等网页操作。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">Gemini 2.5 Flash：</strong>
                        用于后台的 checkpoint 与上下文摘要。
                    </li>
                    <li>
                        <strong className="text-zinc-900 dark:text-zinc-50">Gemini 2.5 Flash Lite：</strong>
                        用于代码库语义检索工具。
                    </li>
                </ul>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/agent-modes-settings"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent 模式与设置 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看策略与自动执行配置
                        </p>
                    </Link>
                    <Link
                        href="/docs/browser-subagent"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">浏览器子智能体 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解浏览器操作使用的专用模型
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
