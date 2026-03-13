import Link from "next/link";
import { Lightbulb } from "lucide-react";
import agentsData from "@/services/agents.json";

export default function AgentsPage() {
    const agents = agentsData;

    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">智能体</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    智能体
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    面向特定领域的专业 AI 角色。
                </p>
            </div>

            {/* What are Agents */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    什么是智能体？
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    智能体是具备特定领域知识、工具与行为模式的专业 AI 角色，每个智能体都针对某一类软件开发问题优化。
                </p>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    当你发起请求时，灵轨（Ling） 的<strong>智能路由</strong>会自动识别需要哪些智能体并激活它们。你也可以点名某个智能体来覆盖自动路由。
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    说明：此页介绍的是 灵轨（Ling） 的专家智能体。如需了解 Antigravity 平台级 Agent，请前往 <Link className="text-zinc-900 dark:text-zinc-50 underline underline-offset-4" href="/docs/agent">Agent 介绍</Link>。
                </p>
            </section>

            {/* How to Use */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    如何使用智能体
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    <strong>无需显式提及智能体！</strong>系统会根据你的请求自动选择合适的专家。
                </p>

                <div className="relative group mb-6">
	                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
	                        <code className="text-zinc-100">{`你: "添加 JWT 认证"
	AI: 正在应用 @security-auditor + @backend-specialist...

	你: "修复深色模式按钮"
	AI: 正在使用 @frontend-specialist...

	你: "登录返回 500 错误"
	AI: 正在使用 @debugger 进行系统化分析...`}</code>
	                    </pre>
	                </div>

                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    当然，你仍然可以通过点名来<strong>覆盖</strong>该行为：
                </p>

                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`请使用 security-auditor 来审查认证流程...`}</code>
                    </pre>
                </div>

                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 mb-6">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                        <Lightbulb className="w-4 h-4 inline" />
                        <strong className="font-semibold">提示：</strong>智能体可以协作！复杂任务可使用 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 font-mono text-xs">orchestrator</code> 协调多个专家。
                    </p>
                </div>
            </section>

            {/* Available Agents */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    可用智能体
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    灵轨（Ling） 当前包含 {agents.length} 个专家智能体：
                </p>

                <div className="space-y-4">
                    {agents.map((agent) => (
                        <div
                            key={agent.name}
                            className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <code className="text-base font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                                    {agent.name}
                                </code>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {agent.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Agent Structure */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    智能体结构
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    每个智能体由一个带有 YAML frontmatter 的 Markdown 文件定义：
                </p>

                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`---
name: frontend-specialist
description: 负责前端架构、UI组件和用户体验的专家
tools: Read, Edit, Write, Bash
skills: nextjs-react-expert, tailwind-patterns, frontend-design
---

# 前端开发专家

你是资深前端架构师...`}</code>
                    </pre>
                </div>

                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">skills</code> 字段决定智能体可访问的领域知识模块。
                </p>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/skills"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
	                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">技能 -&gt;</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            了解领域知识模块
                        </p>
                    </Link>
                    <Link
                        href="/docs/workflows"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
	                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">工作流 -&gt;</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            查看斜杠命令流程
                        </p>
                    </Link>
                </div>
            </section>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <Link
                    href="/docs/installation"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    安装
                </Link>
                <Link
                    href="/docs/skills"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    技能
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
