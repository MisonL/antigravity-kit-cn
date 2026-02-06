import Link from "next/link";
import { Callout } from "@/components/mdx";
import agents from "@/services/agents.json";
import skills from "@/services/skills.json";
import workflows from "@/services/workflows.json";

export const metadata = {
  title: "安装 | Antigravity Kit",
  description: "一分钟内完成 Antigravity Kit 安装。",
};

export default function InstallationPage() {
  return (
    <div className="max-w-3xl">
      <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">文档</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-50">安装</span>
      </nav>

      <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          安装
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          一分钟内完成 Antigravity Kit 安装。
        </p>
      </div>

      <section id="quick-start" className="mb-12 scroll-mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          快速开始
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
          当前中文版本需要先克隆仓库，再进行本地安装：
        </p>

        <pre className="p-4 rounded-lg bg-zinc-950 overflow-x-auto mb-4 text-sm font-mono text-zinc-100">
{`git clone https://github.com/MisonL/antigravity-kit-cn.git
cd antigravity-kit-cn`}
        </pre>

        <Callout type="info">
          <strong>提示：</strong>完成克隆后，请继续执行下方的 CLI 安装步骤。
        </Callout>
      </section>

      <section id="global-install" className="mb-12 scroll-mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          安装 CLI 到本机
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
          在仓库根目录执行本地全局安装，即可在任意位置使用 <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">ag-kit</code>：
        </p>

        <pre className="p-4 rounded-lg bg-zinc-950 overflow-x-auto mb-2 text-sm font-mono text-zinc-100">
{`cd antigravity-kit-cn
npm install -g .`}
        </pre>

        <pre className="p-4 rounded-lg bg-zinc-950 overflow-x-auto mb-4 text-sm font-mono text-zinc-100">
{`cd /path/to/your-project
ag-kit init`}
        </pre>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          不想全局安装时，也可以直接在仓库内执行：
        </p>

        <pre className="p-4 rounded-lg bg-zinc-950 overflow-x-auto mb-4 text-sm font-mono text-zinc-100">
{`cd /path/to/antigravity-kit-cn
node bin/ag-kit.js init --path /path/to/your-project`}
        </pre>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          其他命令请查看 <Link className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" href="/docs/cli">CLI 参考</Link>。
        </p>

        <Callout type="info">
          <strong>自动修复：</strong>安装过程中会扫描项目根目录 <code>.gitignore</code>，并自动移除会忽略 <code>.agent</code> 的规则，避免工作流不生效。CLI 会在终端提示具体处理结果。
        </Callout>

        <Callout type="info">
          <strong>批量更新：</strong>每次执行 <code>ag-kit init</code> / <code>ag-kit update</code> 都会自动登记工作区到全局索引，后续可直接用 <code>ag-kit update-all</code> 一键批量更新所有已登记工作区。默认会排除工具包源码目录；也可用 <code>ag-kit exclude add/remove/list</code> 维护自定义排除清单。冲突检测会在 <code>npm install -g .</code> 阶段（postinstall）和 CLI 执行阶段双重检查上游英文版 <code>@vudovn/ag-kit</code>。
        </Callout>
      </section>

      <section id="structure" className="mb-12 scroll-mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          安装内容
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
          安装后会生成如下结构：
        </p>

        <pre className="p-4 rounded-lg bg-zinc-950 overflow-x-auto mb-4 text-sm font-mono text-zinc-100">
{`.agent/
├── agents/          # ${agents.length} 个专家智能体
├── skills/          # ${skills.length}+ 个技能
├── workflows/       # ${workflows.length} 个斜杠命令
├── rules/           # 工作区规则
└── ARCHITECTURE.md  # 架构文档`}
        </pre>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">agents/</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              包含 {agents.length} 个面向不同领域的专家智能体配置（前端、后端、安全等）
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">skills/</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {skills.length}+ 个可被智能体加载的领域知识模块
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">workflows/</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {workflows.length} 个面向常见任务的斜杠命令流程
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">rules/</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              工作区配置（包含行为规则 <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">GEMINI.md</code>）
            </p>
          </div>
        </div>
      </section>

      <section id="requirements" className="mb-12 scroll-mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          系统要求
        </h2>
        <ul className="space-y-2 text-base text-zinc-600 dark:text-zinc-400 mb-6">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Node.js 16.0 或更高</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>npm 或 yarn 包管理器</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Git（用于更新与版本控制）</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          下一步
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
          安装完成后，可进一步了解核心概念：
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/agents"
            className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">智能体 →</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              了解专家智能体
            </p>
          </Link>
          <Link
            href="/docs/skills"
            className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">技能 →</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              查看领域知识技能
            </p>
          </Link>
        </div>
      </section>

      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/docs"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          介绍
        </Link>
        <Link
          href="/docs/agents"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1"
        >
          智能体
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
