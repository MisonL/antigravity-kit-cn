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

function isInteractiveTerminal() {
    return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Prompt user to select targets from a list.
 * Supports multiple selection by comma separated numbers or names.
 * Currently supports 'gemini', 'antigravity', and 'codex'.
 * @param {object} options CLI options
 * @returns {Promise<string[]>} List of selected targets
 */
async function selectTargets(options) {
    if (options.nonInteractive) {
        throw new Error("非交互模式下必须通过 --target 或 --targets 指定目标");
    }

    if (!isInteractiveTerminal()) {
        throw new Error("当前环境不是交互终端，请通过 --target 或 --targets 指定目标");
    }

    const rl = createInterface();
    
    try {
        console.log("\n[select] 请选择要安装的目标 (多选请用逗号分隔):");
        console.log("   1. Gemini (适用于 Cursor/VSCode)");
        console.log("   2. Antigravity (独立体系，项目级复用 .agent)");
        console.log("   3. Codex (兼容性增强版)");
        
        const answer = await askQuestion(rl, "\n请输入序号或名称（必填）: ");
        const input = answer.trim();

        if (!input) {
            throw new Error("必须选择至少一个目标");
        }
        
        const selection = [];
        const parts = input.split(/[,，\s]+/);
        
        for (const part of parts) {
            const p = part.toLowerCase();
            if (p === "1" || p === "gemini") selection.push("gemini");
            else if (p === "2" || p === "antigravity") selection.push("antigravity");
            else if (p === "3" || p === "codex") selection.push("codex");
        }

        if (selection.length === 0) {
            throw new Error("无效的目标选择，请输入 1 / 2 / 3 / gemini / antigravity / codex（可多选）");
        }

        return [...new Set(selection)];
    } finally {
        rl.close();
    }
}

/**
 * Create an interactive prompter for resolving asset conflicts.
 * @param {object} options CLI options
 * @returns {{resolveConflict: function, close: function}|null}
 */
function createConflictPrompter(options) {
    if (options.nonInteractive || !isInteractiveTerminal()) {
        return null;
    }

    const rl = createInterface();
    const categoryDefaults = new Map();

    async function resolveConflict(conflict) {
        const category = String(conflict.category || "default");
        if (categoryDefaults.has(category)) {
            return categoryDefaults.get(category);
        }

        const label = String(conflict.label || "未知资产");
        const location = conflict.path ? ` (${conflict.path})` : "";

        console.log(`\n[confirm] 检测到已存在资产: ${label}${location}`);
        console.log("请选择处理方式:");
        console.log("  k) 保留(跳过此资产)");
        console.log("  b) 备份后移除(推荐)");
        console.log("  r) 直接移除(不备份)");

        while (true) {
            const answer = String(await askQuestion(rl, "请输入 k / b / r: ")).trim().toLowerCase();
            let action = "";
            if (answer === "k") action = "keep";
            if (answer === "b") action = "backup";
            if (answer === "r") action = "remove";

            if (!action) {
                console.log("[warn] 输入无效，请重新输入。");
                continue;
            }

            const applyAnswer = String(await askQuestion(rl, `是否对同类资产(类别: ${category})后续冲突复用该选择? (y/N): `))
                .trim()
                .toLowerCase();
            if (applyAnswer === "y" || applyAnswer === "yes") {
                categoryDefaults.set(category, action);
            }

            return action;
        }
    }

    function close() {
        rl.close();
    }

    return { resolveConflict, close };
}

module.exports = {
    selectTargets,
    createConflictPrompter,
};
