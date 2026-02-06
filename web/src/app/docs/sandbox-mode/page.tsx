import Link from "next/link";

export default function SandboxModePage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">Sandboxing</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    终端沙箱（Sandboxing）
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Sandboxing 为 Agent 的终端命令提供内核级隔离，限制文件系统与网络访问，降低误操作风险。
                </p>
            </div>

            <section className="mb-12 space-y-4">
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    该能力当前默认关闭，且仅在 macOS 上可用，使用 Apple 的 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">sandbox-exec</code> 机制。Linux 支持正在规划中。
                </p>
            </section>

            {/* Enabling */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    启用方式
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    在 Antigravity 用户设置中打开 “Enable Terminal Sandboxing” 即可启用/关闭。启用后，可用 “Sandbox Allow Network” 单独控制网络访问。
                </p>
            </section>

            {/* Restrictions */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    限制
                </h2>
                <ul className="space-y-3 text-base text-zinc-600 dark:text-zinc-400">
                    <li><strong className="text-zinc-900 dark:text-zinc-50">文件系统</strong>：只能写入工作区与必要的系统路径，防止越界修改。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">网络访问</strong>：可单独控制允许/拒绝网络访问，同时保持文件系统隔离。</li>
                </ul>
            </section>

            {/* Handling */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    处理沙箱阻断
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    如果命令因沙箱限制失败，会显示提示信息。你可以：
                </p>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                    <li>永久关闭沙箱（在用户设置中关闭）。</li>
                    <li>在 “Request Review” 模式下，对单次命令选择是否绕过沙箱。</li>
                </ul>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                    在 “Request Review” 模式下，执行命令时会出现 “Bypass Sandbox” 选项。
                </p>
            </section>

            {/* Interaction */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    与 Strict Mode 的关系
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    当 Strict Mode 启用时，沙箱会自动启用并默认禁止网络访问，以提供最大化保护。
                </p>
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
                            查看更严格的安全策略
                        </p>
                    </Link>
                    <Link
                        href="/docs/agent-modes-settings"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Agent 模式与设置 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            回到配置入口
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
