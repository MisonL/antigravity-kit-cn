#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_RELATIVE_TARGETS = [
    ".temp_ag_kit",
    "coverage",
    "web/.next",
    "web/node_modules",
    "web/out",
    "web/.turbo",
];

function parseArgs(argv) {
    const options = {
        dryRun: false,
        quiet: false,
    };

    for (const arg of argv) {
        if (arg === "--dry-run") {
            options.dryRun = true;
            continue;
        }
        if (arg === "--quiet") {
            options.quiet = true;
            continue;
        }
        if (arg === "--help" || arg === "-h") {
            options.help = true;
            continue;
        }
        throw new Error(`未知参数: ${arg}`);
    }

    return options;
}

function removeTarget(rootDir, relativePath, options) {
    const absolutePath = path.join(rootDir, relativePath);
    const exists = fs.existsSync(absolutePath);
    const result = {
        path: relativePath,
        absolutePath,
        action: "skipped",
        reason: "",
    };

    if (!exists) {
        result.reason = "not_found";
        return result;
    }

    if (options.dryRun) {
        result.action = "would_remove";
        return result;
    }

    fs.rmSync(absolutePath, { recursive: true, force: true });
    result.action = "removed";
    return result;
}

function runClean(options = {}) {
    const rootDir = path.resolve(options.rootDir || path.join(__dirname, ".."));
    const targets = Array.isArray(options.targets) && options.targets.length > 0
        ? options.targets
        : DEFAULT_RELATIVE_TARGETS;

    const normalizedOptions = {
        dryRun: Boolean(options.dryRun),
        quiet: Boolean(options.quiet),
    };

    const results = targets.map((targetPath) => removeTarget(rootDir, targetPath, normalizedOptions));
    const removedCount = results.filter((item) => item.action === "removed").length;
    const wouldRemoveCount = results.filter((item) => item.action === "would_remove").length;
    const skippedCount = results.filter((item) => item.action === "skipped").length;

    if (!normalizedOptions.quiet) {
        for (const item of results) {
            if (item.action === "removed") {
                console.log(`🧹 已清理: ${item.path}`);
                continue;
            }
            if (item.action === "would_remove") {
                console.log(`[dry-run] 将清理: ${item.path}`);
                continue;
            }
            console.log(`⏭️ 已跳过: ${item.path} (${item.reason})`);
        }
        console.log(`📊 清理完成: removed=${removedCount}, dryRun=${wouldRemoveCount}, skipped=${skippedCount}`);
    }

    return {
        rootDir,
        removedCount,
        wouldRemoveCount,
        skippedCount,
        results,
    };
}

if (require.main === module) {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            console.log("用法: node scripts/clean.js [--dry-run] [--quiet]");
            process.exit(0);
        }
        runClean(options);
    } catch (err) {
        console.error(`❌ ${err.message}`);
        process.exit(1);
    }
}

module.exports = {
    DEFAULT_RELATIVE_TARGETS,
    parseArgs,
    runClean,
};
