import Link from "next/link";

const supportedServers = [
    "Airweave",
    "Arize",
    "AlloyDB for PostgreSQL",
    "Atlassian",
    "BigQuery",
    "Cloud SQL for PostgreSQL",
    "Cloud SQL for MySQL",
    "Cloud SQL for SQL Server",
    "Dart",
    "Dataplex",
    "Figma Dev Mode MCP",
    "Firebase",
    "GitHub",
    "Harness",
    "Heroku",
    "Linear",
    "Locofy",
    "Looker",
    "MCP Toolbox for Databases",
    "MongoDB",
    "Neon",
    "Netlify",
    "Notion",
    "PayPal",
    "Perplexity Ask",
    "Pinecone",
    "Prisma",
    "Redis",
    "Sequential Thinking",
    "SonarQube",
    "Spanner",
    "Stripe",
    "Supabase",
];

export default function McpPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">MCP 集成</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Antigravity 编辑器：MCP 集成
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Antigravity 支持 Model Context Protocol（MCP），可以安全连接本地工具、数据库与外部服务，让 AI 获得实时上下文。
                </p>
            </div>

            {/* What is MCP */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    什么是 MCP？
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    MCP 充当 Antigravity 与更广泛开发环境之间的桥梁。你无需手动粘贴数据库结构或日志，MCP 可以在需要时直接获取所需信息。
                </p>
            </section>

            {/* Core Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    核心能力
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">1. 上下文资源</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            AI 可读取已连接 MCP 服务器的数据来提升建议质量。
                        </p>
                        <ul className="mt-3 space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li>示例：编写 SQL 时检查 Neon 或 Supabase 的实时 Schema，给出正确表名与列名。</li>
                            <li>示例：调试时读取 Netlify 或 Heroku 的近期构建日志。</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">2. 自定义工具</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            MCP 允许 Antigravity 执行由服务器定义的安全操作。
                        </p>
                        <ul className="mt-3 space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                            <li>示例：为这条 TODO 创建 Linear Issue</li>
                            <li>示例：在 Notion 或 GitHub 中搜索认证相关模式</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How to Connect */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    如何连接
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    连接入口位于内置的 MCP Store：
                </p>
                <ol className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                    <li>在编辑器侧边栏顶部点击 “...” 打开 MCP Store 面板。</li>
                    <li>浏览列表并点击 Install 安装支持的服务器。</li>
                    <li>按提示完成账号授权（如需要）。</li>
                </ol>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                    安装后，该服务器提供的资源与工具会自动出现在编辑器中。
                </p>
            </section>

            {/* Custom MCP Servers */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    连接自定义 MCP 服务器
                </h2>
                <ol className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                    <li>在编辑器的 Agent 面板顶部点击 “...” 打开 MCP Store。</li>
                    <li>点击 “Manage MCP Servers”。</li>
                    <li>点击 “View raw config”。</li>
                    <li>在 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">mcp_config.json</code> 中添加你的服务器配置。</li>
                </ol>
            </section>

            {/* Supported Servers */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    支持的服务器
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    MCP Store 当前提供以下集成：
                </p>
                <ul className="grid gap-2 sm:grid-cols-2 text-base text-zinc-600 dark:text-zinc-400">
                    {supportedServers.map((server) => (
                        <li key={server} className="rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-900/40">
                            {server}
                        </li>
                    ))}
                </ul>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/command"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Command →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            使用自然语言生成代码与命令
                        </p>
                    </Link>
                    <Link
                        href="/docs/browser-subagent"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">浏览器子智能体 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解浏览器任务执行方式
                        </p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
