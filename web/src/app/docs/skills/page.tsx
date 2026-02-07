import { Lightbulb } from "lucide-react";
import Link from "next/link";
import skillsData from "@/services/skills.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent 技能 - Antigravity Kit 文档",
  description: "了解如何通过技能扩展您的 Agent 能力。",
};

export default function SkillsPage() {
    const skillsByCategory = skillsData.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, typeof skillsData>);

    const categoryOrder = [
        "前端与 UI",
        "后端与 API",
        "数据库",
        "云与基础设施",
        "测试与质量",
        "安全",
        "架构与规划",
        "移动端",
        "游戏开发",
        "SEO 与增长",
        "Shell/CLI",
        "其他",
    ];

    return (
        <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-50">技能</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    Agent 技能
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    技能是扩展 Agent 能力的开放标准，每个技能都是一个包含 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">SKILL.md</code> 的文件夹。
                </p>
            </div>

            {/* What are skills */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    什么是技能？
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    技能是可复用的知识包，用于扩展 Agent 能力。每个技能包含：
                </p>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    <li>针对特定任务类型的执行说明</li>
                    <li>最佳实践与约定</li>
                    <li>可选的脚本与资源</li>
                </ul>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    开始对话后，Agent 会看到可用技能的名称与描述，并在任务相关时读取完整指引并执行。
                </p>
            </section>

            {/* Where skills live */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    技能存放位置
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    Antigravity 支持两类技能：
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border border-zinc-200 dark:border-zinc-800">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/40">
                            <tr>
                                <th className="px-4 py-2 text-zinc-900 dark:text-zinc-50">位置</th>
                                <th className="px-4 py-2 text-zinc-900 dark:text-zinc-50">作用范围</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-zinc-200 dark:border-zinc-800">
                                <td className="px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300">&lt;workspace-root&gt;/.agent/skills/&lt;skill-folder&gt;/</td>
                                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">工作区内</td>
                            </tr>
                            <tr className="border-t border-zinc-200 dark:border-zinc-800">
                                <td className="px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300">~/.gemini/antigravity/skills/&lt;skill-folder&gt;/</td>
                                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">全局（所有工作区）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                    工作区技能适合项目专用流程（如团队部署规范或测试约定）；全局技能适合跨项目通用工具。
                </p>
            </section>

            {/* Creating a skill */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    创建技能
                </h2>
                <ol className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 list-decimal list-inside mb-6">
                    <li>在技能目录下创建一个技能文件夹。</li>
                    <li>在文件夹中添加 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">SKILL.md</code> 文件。</li>
                </ol>
                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`.agent/skills/
└── my-skill/
    └── SKILL.md`}</code>
                    </pre>
                </div>

                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    每个技能都必须包含带有 YAML frontmatter 的 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">SKILL.md</code>：
                </p>
                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`---
name: my-skill
description: Helps with a specific task. Use when you need to do X or Y.
---

# My Skill

Detailed instructions for the agent go here.

## When to use this skill

- Use this when...
- This is helpful for...

## How to use it

Step-by-step guidance, conventions, and patterns the agent should follow.`}</code>
                    </pre>
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Frontmatter 字段</h3>
                <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left text-sm border border-zinc-200 dark:border-zinc-800">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/40">
                            <tr>
                                <th className="px-4 py-2 text-zinc-900 dark:text-zinc-50">字段</th>
                                <th className="px-4 py-2 text-zinc-900 dark:text-zinc-50">必填</th>
                                <th className="px-4 py-2 text-zinc-900 dark:text-zinc-50">说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-zinc-200 dark:border-zinc-800">
                                <td className="px-4 py-2 font-mono">name</td>
                                <td className="px-4 py-2">否</td>
                                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">技能唯一标识（小写、用短横线分隔），默认取文件夹名。</td>
                            </tr>
                            <tr className="border-t border-zinc-200 dark:border-zinc-800">
                                <td className="px-4 py-2 font-mono">description</td>
                                <td className="px-4 py-2">是</td>
                                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">描述技能的用途与适用场景，Agent 会基于它判断是否使用。</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-2 p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-sm text-blue-900 dark:text-blue-100 mb-0">
                        <Lightbulb className="w-4 h-4 inline" />
                        <strong className="font-semibold">提示：</strong>描述建议使用第三人称并包含关键词，例如：使用 pytest 约定为 Python 代码生成单元测试。
                    </p>
                </div>
            </section>

            {/* Skill folder structure */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    技能目录结构
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    除 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">SKILL.md</code> 外，还可以包含：
                </p>
                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`.agent/skills/my-skill/
├── SKILL.md       # 主指引（必需）
├── scripts/       # 辅助脚本（可选）
├── examples/      # 参考实现（可选）
└── resources/     # 模板与资源（可选）`}</code>
                    </pre>
                </div>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                    Agent 会在执行技能时读取这些文件。
                </p>
            </section>

            {/* How agent uses skills */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    智能体如何使用技能
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    技能遵循“渐进披露”模式：
                </p>
                <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400">
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Discovery</strong>：对话开始时，Agent 看到可用技能的名称与描述。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Activation</strong>：若技能与任务相关，Agent 会读取完整 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">SKILL.md</code>。</li>
                    <li><strong className="text-zinc-900 dark:text-zinc-50">Execution</strong>：Agent 在执行任务时遵循技能指引。</li>
                </ul>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mt-4">
                    你无需显式要求使用技能，Agent 会根据上下文自动决定；如需强制使用，可直接点名技能。
                </p>
            </section>

            {/* Best practices */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    最佳实践
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">保持技能聚焦</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            每个技能应聚焦于单一目标，避免“全能技能”。将不同任务拆成多个技能更易复用。
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">写清晰的描述</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            描述决定了 Agent 是否会选择该技能。请具体说明技能做什么、何时适用。
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">脚本作为黑盒</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            如果技能包含脚本，建议先运行 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">--help</code>，而非阅读完整源码，以减少上下文占用。
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">包含决策树</h3>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">
                            对复杂技能，建议加入决策分支，帮助 Agent 根据场景选取正确路径。
                        </p>
                    </div>
                </div>
            </section>

            {/* Example */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    示例：代码评审技能
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                    下面是一个用于代码评审的示例技能：
                </p>
                <div className="relative group mb-6">
                    <pre className="p-4 rounded-lg bg-zinc-900 dark:bg-zinc-950 overflow-x-auto border border-zinc-800 font-mono text-sm">
                        <code className="text-zinc-100">{`---
name: code-review
description: Reviews code changes for bugs, style issues, and best practices. Use when reviewing PRs or checking code quality.
---

# Code Review Skill

When reviewing code, follow these steps:

## Review checklist

1. **Correctness**: Does the code do what it's supposed to?
2. **Edge cases**: Are error conditions handled?
3. **Style**: Does it follow project conventions?
4. **Performance**: Are there obvious inefficiencies?

## How to provide feedback

- Be specific about what needs to change
- Explain why, not just what
- Suggest alternatives when possible`}</code>
                    </pre>
                </div>
            </section>

            {/* Project skills */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    本项目内置技能
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                    当前共 {skillsData.length} 个技能，按领域划分如下：
                </p>

                <div className="space-y-8">
                    {categoryOrder.map((category) => {
                        const skills = skillsByCategory[category];
                        if (!skills) return null;

                        return (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2 inline-block">
                                    {category}
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {skills.map((skill) => (
                                        <div key={skill.name} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                            <code className="text-sm font-mono text-zinc-900 dark:text-zinc-50 font-semibold block mb-1">
                                                {skill.name}
                                            </code>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                {skill.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 下一步 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                    下一步
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/docs/rules-workflows"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">规则与工作流 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            使用规则与流程约束 Agent
                        </p>
                    </Link>
                    <Link
                        href="/docs/mcp"
                        className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">MCP 集成 →</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            连接外部上下文与工具
                        </p>
                    </Link>
                </div>
            </section>

            {/* Footer Navigation */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <Link
                    href="/docs/agents"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    智能体
                </Link>
                <Link
                    href="/docs/rules-workflows"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
                >
                    规则与工作流
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
