const readline = require("readline");

function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function askChoice(promptTitle, options) {
    const rl = createInterface();
    try {
        console.log(`\n${promptTitle}`);
        for (let i = 0; i < options.length; i++) {
            const item = options[i];
            console.log(`   ${i + 1}. ${item.label}`);
            if (item.hint) {
                console.log(`      ${item.hint}`);
            }
        }

        while (true) {
            const answer = (await askQuestion(rl, "\n请输入序号（必填）: ")).trim();
            if (!answer) {
                console.log("   请输入有效序号。");
                continue;
            }

            const index = Number.parseInt(answer, 10);
            if (!Number.isFinite(index) || index < 1 || index > options.length) {
                console.log(`   无效输入: ${answer}`);
                continue;
            }

            return options[index - 1].value;
        }
    } finally {
        rl.close();
    }
}

/**
 * 统一 full 安装模式下，保留兼容返回。
 * @returns {Promise<string[]>}
 */
async function selectTargets() {
    return ["full"];
}

/**
 * 冲突：已有 .agent 且无法确定是否托管时，询问处理策略。
 * @returns {Promise<"backup_replace"|"replace"|"keep"|"rename_disable"|"disable">}
 */
async function selectAgentConflictPolicy() {
    return askChoice("检测到已有 .agent 目录，请选择处理方式:", [
        {
            value: "backup_replace",
            label: "备份后替换（推荐）",
            hint: "将现有 .agent 备份后，用 .agents 投影覆盖",
        },
        {
            value: "replace",
            label: "直接替换（不备份）",
            hint: "删除现有 .agent 后重建投影，速度更快但不可回退此冲突目录",
        },
        {
            value: "keep",
            label: "保留不动",
            hint: "跳过 .agent 投影，继续安装 .agents",
        },
        {
            value: "rename_disable",
            label: "改名失效后创建新投影",
            hint: "把原目录改名为 .agent.user.<ts>，再生成新的 .agent 投影",
        },
        {
            value: "disable",
            label: "停用 .agent 投影",
            hint: "移除/改名 .agent 并停止同步该兼容目录，避免规则重复加载",
        },
    ]);
}

/**
 * 冲突：已有 .gemini/agents 时，询问处理策略。
 * @returns {Promise<"append"|"backup_replace"|"skip">}
 */
async function selectGeminiAgentsPolicy() {
    return askChoice("检测到已有 .gemini/agents 目录，请选择处理方式:", [
        {
            value: "append",
            label: "追加 ag-kit-*.md（推荐）",
            hint: "保留用户文件，仅追加/更新本项目 namespaced agents",
        },
        {
            value: "backup_replace",
            label: "备份后替换",
            hint: "备份现有 .gemini/agents 后，仅写入本项目 agents",
        },
        {
            value: "skip",
            label: "跳过写入",
            hint: "不触碰 .gemini/agents",
        },
    ]);
}

/**
 * 当仅检测到 legacy .agent 且无托管证据时，询问是否执行 v3 迁移。
 * @returns {Promise<boolean>}
 */
async function confirmLegacyAgentMigration() {
    return askChoice("检测到疑似旧版仅 .agent 安装，是否迁移到 v3 统一 .agents 体系？", [
        {
            value: true,
            label: "迁移到 v3（推荐）",
            hint: "会创建 rollback 快照并把 .agents 作为唯一主目录，随后重建 .agent/.gemini 投影",
        },
        {
            value: false,
            label: "不迁移（退出）",
            hint: "保持现状，不执行 update；你也可以改用 ag-kit init --force 手动升级",
        },
    ]);
}

module.exports = {
    selectTargets,
    selectAgentConflictPolicy,
    selectGeminiAgentsPolicy,
    confirmLegacyAgentMigration,
};
