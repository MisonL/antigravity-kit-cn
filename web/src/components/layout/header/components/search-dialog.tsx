'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon, FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandCollection,
    CommandDialog,
    CommandDialogPopup,
    CommandDialogTrigger,
    CommandEmpty,
    CommandFooter,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandList,
    CommandPanel,
    CommandSeparator,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

interface SearchItem {
    value: string;
    label: string;
    href: string;
    keywords?: string;
}

interface SearchGroup {
    value: string;
    items: SearchItem[];
}

const searchGroups: SearchGroup[] = [
    {
        value: '快速开始',
        items: [
            {
                label: '介绍',
                value: 'introduction',
                href: '/docs',
                keywords: 'getting started overview what is 文档 介绍 入门'
            },
            {
                label: '安装',
                value: 'installation',
                href: '/docs/installation',
                keywords: 'install setup init npm npx global cli 安装 初始化'
            },
        ],
    },
    {
        value: '核心概念',
        items: [
            {
                label: '智能体',
                value: 'agents',
                href: '/docs/agents',
                keywords: 'specialist personas orchestrator planner security backend frontend 智能体 专家 编排 前端 后端 安全'
            },
            {
                label: '技能',
                value: 'skills',
                href: '/docs/skills',
                keywords: 'knowledge modules react nextjs tailwind patterns testing 技能 知识 模块'
            },
            {
                label: '斜杠工作流',
                value: 'workflows',
                href: '/docs/workflows',
                keywords: 'slash commands brainstorm create debug deploy enhance 工作流 斜杠命令'
            },
            {
                label: '规则与工作流',
                value: 'rules-workflows',
                href: '/docs/rules-workflows',
                keywords: 'rules workflows constraints global workspace 规则 约束 工作流 斜杠'
            },
            {
                label: '任务组',
                value: 'task-groups',
                href: '/docs/task-groups',
                keywords: 'planning task groups 任务组 规划 模式'
            },
            {
                label: 'Agent 模式与设置',
                value: 'agent-modes-settings',
                href: '/docs/agent-modes-settings',
                keywords: 'planning fast settings review policy allowlist denylist 模式 设置 审核'
            },
            {
                label: '模型',
                value: 'models',
                href: '/docs/models',
                keywords: 'models reasoning gemini claude gpt selector rate limits 模型 推理 选择器'
            },
        ],
    },
    {
        value: '安全控制',
        items: [
            {
                label: 'Strict Mode',
                value: 'strict-mode',
                href: '/docs/strict-mode',
                keywords: 'strict mode allowlist denylist review policy gitignore 隔离 严格模式'
            },
            {
                label: '终端沙箱',
                value: 'sandbox-mode',
                href: '/docs/sandbox-mode',
                keywords: 'sandboxing terminal sandbox network access 隔离 沙箱'
            },
            {
                label: 'URL 允许/拒绝列表',
                value: 'allowlist-denylist',
                href: '/docs/allowlist-denylist',
                keywords: 'allowlist denylist badurlschecker browser security url 允许列表 拒绝列表'
            },
        ],
    },
    {
        value: 'Agent 机制',
        items: [
            {
                label: 'Agent 介绍',
                value: 'agent',
                href: '/docs/agent',
                keywords: 'agent core components reasoning tools artifacts knowledge 智能体 核心'
            },
            {
                label: 'Artifacts',
                value: 'artifacts',
                href: '/docs/artifacts',
                keywords: 'artifacts planning mode review feedback 产物 审核'
            },
            {
                label: 'Task List',
                value: 'task-list',
                href: '/docs/task-list',
                keywords: 'task list artifact checklist progress 任务清单 进度'
            },
            {
                label: 'Implementation Plan',
                value: 'implementation-plan',
                href: '/docs/implementation-plan',
                keywords: 'implementation plan review proceed 计划 审核'
            },
            {
                label: 'Knowledge',
                value: 'knowledge',
                href: '/docs/knowledge',
                keywords: 'knowledge items memory persistent 记忆 知识项'
            },
        ],
    },
    {
        value: '编辑器能力',
        items: [
            {
                label: '浏览器子智能体',
                value: 'browser-subagent',
                href: '/docs/browser-subagent',
                keywords: 'browser subagent tools screenshots dom 浏览器 子智能体'
            },
            {
                label: 'MCP 集成',
                value: 'mcp',
                href: '/docs/mcp',
                keywords: 'model context protocol integrations mcp store servers 上下文 协议'
            },
            {
                label: 'Command',
                value: 'command',
                href: '/docs/command',
                keywords: 'command inline terminal shortcut ctrl i cmd i 命令'
            },
        ],
    },
    {
        value: '参考',
        items: [
            {
                label: 'CLI 参考',
                value: 'cli',
                href: '/docs/cli',
                keywords: 'command line interface init update status options 命令行 选项'
            },
        ],
    },
];

export default function SearchDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    function handleItemClick(item: SearchItem) {
        router.push(item.href);
        setOpen(false);
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <CommandDialog onOpenChange={setOpen} open={open}>
            {/* Mobile/Tablet - Icon Only */}
            <CommandDialogTrigger
                className="md:hidden"
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="搜索"
                    />
                }
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </CommandDialogTrigger>

            {/* Desktop - Full Search Input */}
            <CommandDialogTrigger
                className="hidden md:flex bg-transparent"
                render={
                    <Button
                        variant="outline"
                        className="w-full justify-start text-sm text-muted-foreground font-normal h-9"
                    />
                }
            >
                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="flex-1 text-left">搜索文档...</span>
                <KbdGroup className="hidden sm:inline-flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </CommandDialogTrigger>

            <CommandDialogPopup>
                <Command items={searchGroups}>
                    <CommandInput placeholder="搜索文档..." />
                    <CommandPanel>
                        <CommandEmpty>
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <svg className="w-10 h-10 text-muted-foreground/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium text-foreground mb-1">未找到结果</p>
                                <p className="text-xs text-muted-foreground">请尝试其他关键词</p>
                            </div>
                        </CommandEmpty>
                        <CommandList>
                            {(group: SearchGroup) => (
                                <Fragment key={group.value}>
                                    <CommandGroup items={group.items}>
                                        <CommandGroupLabel>{group.value}</CommandGroupLabel>
                                        <CommandCollection>
                                            {(item: SearchItem) => (
                                                <CommandItem
                                                    key={item.value}
                                                    onClick={() => handleItemClick(item)}
                                                    value={item.value + ' ' + (item.keywords || '')}
                                                >
                                                    <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="flex-1">{item.label}</span>
                                                    <span className="text-xs text-muted-foreground">{item.href}</span>
                                                </CommandItem>
                                            )}
                                        </CommandCollection>
                                    </CommandGroup>
                                    <CommandSeparator />
                                </Fragment>
                            )}
                        </CommandList>
                    </CommandPanel>
                    <CommandFooter>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <KbdGroup>
                                    <Kbd>
                                        <ArrowUpIcon className="h-3 w-3" />
                                    </Kbd>
                                    <Kbd>
                                        <ArrowDownIcon className="h-3 w-3" />
                                    </Kbd>
                                </KbdGroup>
                                <span className="text-xs text-muted-foreground">导航</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Kbd>
                                    <CornerDownLeftIcon className="h-3 w-3" />
                                </Kbd>
                                <span className="text-xs text-muted-foreground">选择</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Kbd>Esc</Kbd>
                            <span className="text-xs text-muted-foreground">关闭</span>
                        </div>
                    </CommandFooter>
                </Command>
            </CommandDialogPopup>
        </CommandDialog>
    );
}
