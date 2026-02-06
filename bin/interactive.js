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

/**
 * Prompt user to select targets from a list.
 * Supports multiple selection by comma separated numbers or names.
 * Currently simplified for 'gemini' and 'codex'.
 * @param {object} options CLI options
 * @returns {Promise<string[]>} List of selected targets
 */
async function selectTargets(options) {
    if (options.nonInteractive) {
        throw new Error("非交互模式下必须通过 --target 或 --targets 指定目标");
    }

    const rl = createInterface();
    
    try {
        console.log("\n🎯 请选择要安装的目标 (多选请用逗号分隔):");
        console.log("   1. Gemini (适用于 Cursor/VSCode)");
        console.log("   2. Codex (兼容性增强版)");
        
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
            else if (p === "2" || p === "codex") selection.push("codex");
        }

        if (selection.length === 0) {
            throw new Error("无效的目标选择，请输入 1 / 2 / gemini / codex（可多选）");
        }

        return [...new Set(selection)];
    } finally {
        rl.close();
    }
}

module.exports = {
    selectTargets
};
