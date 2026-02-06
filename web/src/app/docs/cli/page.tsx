import Link from "next/link";

export default function CLIPage() {
    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">CLI 参考</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    CLI 参考
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    用于管理 Antigravity Kit 安装的命令行工具。
                </p>
            </div>

            {/* 概览 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    概览
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">ag-kit</code> CLI 用于在多个项目中管理 Antigravity Kit 安装。请先按安装指南完成本仓库本地安装。
                </p>
            </section>

            {/* Commands */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    命令
                </h2>

                <div className="space-y-8">
                    {/* init */}
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            <code className="font-mono">ag-kit init</code>
                        </h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            通过安装 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">.agent</code> 文件夹在项目中初始化 Antigravity Kit。
                        </p>

                        <div className="relative group mb-4">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit init</code>
                            </pre>
                        </div>

                        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">行为</div>
                            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                <li>• 在当前目录创建 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.agent/</code> 文件夹</li>
                                <li>• 默认从当前 CLI 包内置模板复制内容（指定 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">--branch</code> 时从 GitHub 拉取）</li>
                                <li>• 若已存在 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.agent/</code> 则跳过（使用 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">--force</code> 覆盖）</li>
                                <li>• 自动扫描并清理 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.gitignore</code> 中会忽略 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.agent</code> 的规则</li>
                                <li>• 自动检测全局是否存在上游英文版 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">@vudovn/ag-kit</code>，并提示命令冲突风险；在全局安装阶段可交互确认是否自动卸载</li>
                            </ul>
                        </div>
                    </div>

                    {/* update */}
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            <code className="font-mono">ag-kit update</code>
                        </h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            将现有的 Antigravity Kit 升级到最新版本。
                        </p>

                        <div className="relative group mb-4">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit update</code>
                            </pre>
                        </div>

                        <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
                            <p className="text-sm text-amber-900 dark:text-amber-200">
                                <strong className="font-semibold">警告：</strong>此操作会删除并替换你的 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono text-xs">.agent/</code> 文件夹，请先备份自定义修改。
                            </p>
                        </div>
                    </div>

                    {/* update-all */}
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            <code className="font-mono">ag-kit update-all</code>
                        </h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            根据全局索引批量更新所有已登记的工作区。
                        </p>

                        <div className="relative group mb-4">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit update-all</code>
                            </pre>
                        </div>

                        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">行为</div>
                            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                <li>• 读取全局索引文件（macOS / Linux / WSL：<code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">~/.ag-kit/workspaces.json</code>；Windows：<code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">%USERPROFILE%\.ag-kit\workspaces.json</code>）</li>
                                <li>• 对每个已登记且存在 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.agent</code> 的工作区执行更新</li>
                                <li>• 输出批量更新汇总（成功/跳过/失败）</li>
                                <li>• 默认自动排除 antigravity-kit 源码目录，避免索引冲突</li>
                                <li>• 历史项目需先执行一次 <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">ag-kit update</code> 才会被纳入索引</li>
                            </ul>
                        </div>
                    </div>

                    {/* exclude */}
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            <code className="font-mono">ag-kit exclude</code>
                        </h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            管理全局索引排除清单，用于阻止特定目录（或目录树）被登记或批量更新。
                        </p>

                        <div className="space-y-3">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit exclude list</code>
                            </pre>
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit exclude add --path /path/to/dir</code>
                            </pre>
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit exclude remove --path /path/to/dir</code>
                            </pre>
                        </div>
                    </div>

                    {/* status */}
                    <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                            <code className="font-mono">ag-kit status</code>
                        </h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                            查看当前安装状态与版本信息。
                        </p>

                        <div className="relative group mb-4">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit status</code>
                            </pre>
                        </div>

                        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">输出内容</div>
                            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                <li>• 安装状态（已安装/未安装）</li>
                                <li>• 当前版本</li>
                                <li>• 智能体数量</li>
                                <li>• 技能数量</li>
                                <li>• 工作流数量</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Options */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    选项
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    可用选项如下：
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 dark:border-zinc-800">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800">选项</th>
                                <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800">说明</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--force</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    覆盖已有的 <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">.agent</code> 文件夹
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--path &lt;dir&gt;</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    安装到指定目录而非当前目录
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--branch &lt;name&gt;</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    使用指定 Git 分支（默认：main）
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--quiet</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    抑制输出（适用于 CI/CD）
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--dry-run</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    预览操作而不执行
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">
                                    <code className="font-mono text-zinc-900 dark:text-zinc-50">--prune-missing</code>
                                </td>
                                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                                    批量更新时清理索引中已不存在的工作区路径（用于 <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">update-all</code>）
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Examples */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    示例
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            强制重装
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit init --force</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            安装到指定目录
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit init --path ./my-project</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            使用开发分支
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit init --branch dev</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            CI/CD 静默安装
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit init --quiet --force</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            批量更新全部工作区
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit update-all</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            批量更新并清理失效索引
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit update-all --prune-missing</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            添加排除路径
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit exclude add --path /path/to/dir</code>
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            查看排除清单
                        </h3>
                        <div className="relative group">
                            <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                                <code className="text-zinc-100">ag-kit exclude list</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    卸载与清理
                </h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            卸载全局 CLI
                        </h3>
                        <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                            <code className="text-zinc-100">{`npm uninstall -g antigravity-kit-cn
npm uninstall -g antigravity-kit @vudovn/ag-kit`}</code>
                        </pre>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            删除项目中的 .agent
                        </h3>
                        <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                            <code className="text-zinc-100">{`cd /path/to/your-project
rm -rf .agent`}</code>
                        </pre>
                        <pre className="mt-3 p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                            <code className="text-zinc-100">{`# Windows PowerShell
Set-Location C:\\path\\to\\your-project
Remove-Item .agent -Recurse -Force

# Windows CMD
cd /d C:\\path\\to\\your-project
rmdir /s /q .agent`}</code>
                        </pre>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                            清理批量更新索引（可选）
                        </h3>
                        <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                            <code className="text-zinc-100">ag-kit exclude add --path /path/to/your-project</code>
                        </pre>
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
                        href="/docs/installation"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">安装指南 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            完整的安装说明
                        </p>
                    </Link>
                    <a
                        href="https://github.com/MisonL/antigravity-kit-cn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">查看 GitHub →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            源码与贡献指南
                        </p>
                    </a>
                </div>
            </section>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <Link
                    href="/docs/workflows"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    工作流
                </Link>
                <a
                    href="https://github.com/MisonL/antigravity-kit-cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    GitHub
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
