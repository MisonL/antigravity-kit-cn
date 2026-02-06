'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DonateDialog from '@/components/layout/header/components/donate-dialog';
import { GithubIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navSections = [
    {
        title: '快速开始',
        items: [
            { href: '/docs', label: '介绍' },
            { href: '/docs/installation', label: '安装' },
        ],
    },
    {
        title: '核心概念',
        items: [
            { href: '/docs/agents', label: '智能体' },
            { href: '/docs/skills', label: '技能' },
            { href: '/docs/rules-workflows', label: '规则与工作流' },
            { href: '/docs/workflows', label: '斜杠工作流' },
            { href: '/docs/task-groups', label: '任务组' },
            { href: '/docs/agent-modes-settings', label: 'Agent 模式与设置' },
            { href: '/docs/models', label: '模型' },
        ],
    },
    {
        title: '安全控制',
        items: [
            { href: '/docs/strict-mode', label: 'Strict Mode' },
            { href: '/docs/sandbox-mode', label: '终端沙箱' },
            { href: '/docs/allowlist-denylist', label: 'URL 允许/拒绝列表' },
        ],
    },
    {
        title: 'Agent 机制',
        items: [
            { href: '/docs/agent', label: 'Agent 介绍' },
            { href: '/docs/artifacts', label: 'Artifacts' },
            { href: '/docs/task-list', label: 'Task List' },
            { href: '/docs/implementation-plan', label: 'Implementation Plan' },
            { href: '/docs/knowledge', label: 'Knowledge' },
        ],
    },
    {
        title: '编辑器能力',
        items: [
            { href: '/docs/browser-subagent', label: '浏览器子智能体' },
            { href: '/docs/mcp', label: 'MCP 集成' },
            { href: '/docs/command', label: 'Command' },
        ],
    },
    {
        title: 'CLI 参考',
        items: [
            { href: '/docs/cli', label: '命令与选项' },
        ],
    },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false);
        }, 0);
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="切换菜单"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Dropdown - Renders in parent header component */}
            {isOpen && (
                <div className="lg:hidden absolute left-0 right-0 top-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg animate-in slide-in-from-top-2 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Navigation */}
                        <nav className="space-y-6">
                            {navSections.map((section) => (
                                <div key={section.title}>
                                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        {section.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`
                                                        block px-3 py-2 text-sm rounded-md transition-colors
                                                        ${isActive
                                                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium'
                                                            : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                        }
                                                    `}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Mobile Action Buttons */}
                        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                            <DonateDialog className="" />
                            <Link href="https://github.com/MisonL/antigravity-kit-cn" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full justify-start">
                                    <GithubIcon className="w-4 h-4 mr-2" />
                                    GitHub
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
