import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* 产品 */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">产品</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/docs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    文档
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/agents" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    智能体
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/skills" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    技能
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/workflows" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    斜杠工作流
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 资源 */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">资源</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/docs/installation" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    安装
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/cli" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    CLI 参考
                                </Link>
                            </li>
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    示例
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn/releases" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    更新日志
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 社区 */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">社区</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn/issues" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    问题
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn/discussions" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    讨论
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    贡献指南
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 法律 */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">法律</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="https://github.com/MisonL/antigravity-kit-cn/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    许可证
                                </a>
                            </li>
                            <li>
                                <Link href="#1" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    隐私政策
                                </Link>
                            </li>
                            <li>
                                <Link href="#1" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                                    服务条款
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        © {new Date().getFullYear()} Antigravity Kit by{" "}
                        <a
                            href="https://github.com/vudovn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline">
                            @vudovn
                        </a>。保留所有权利。
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/MisonL/antigravity-kit-cn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            aria-label="GitHub"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="https://facebook.com/vudovn.354"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            aria-label="Facebook"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
