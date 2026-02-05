'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        title: '指南',
        items: [
            { href: '/docs/guide/examples/brainstorm', label: '结构化头脑风暴' },
            { href: '/docs/guide/examples/plan', label: '项目规划' },
            { href: '/docs/guide/examples/create', label: '创建新应用' },
            { href: '/docs/guide/examples/new-feature', label: '新增功能' },
            { href: '/docs/guide/examples/ui-design', label: '高级 UI 设计' },
            { href: '/docs/guide/examples/debugging', label: '系统化调试' },
            { href: '/docs/guide/examples/test', label: '测试生成' },
            { href: '/docs/guide/examples/preview', label: '预览管理' },
            { href: '/docs/guide/examples/status', label: '项目状态' },
            { href: '/docs/guide/examples/orchestration', label: '多智能体编排' },
            { href: '/docs/guide/examples/deployment', label: '生产部署' },
        ],
    },
    {
        title: 'CLI 参考',
        items: [
            { href: '/docs/cli', label: '命令与选项' },
        ],
    },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {navSections.map((section) => (
                <div key={section.title} className="pb-6">
                    <h3 className="mb-3 px-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {section.title}
                    </h3>
                    <div className="space-y-0.5">
                        {section.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    block px-2 py-1.5 text-sm rounded-md transition-colors
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
    );
}
