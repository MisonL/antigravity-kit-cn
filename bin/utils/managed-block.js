const fs = require("fs");
const path = require("path");

function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectLineEnding(content) {
    return content.includes("\r\n") ? "\r\n" : "\n";
}

function buildMarkers(blockId) {
    const id = String(blockId || "default").trim();
    return {
        begin: `<!-- BEGIN AG-KIT MANAGED BLOCK: ${id} -->`,
        end: `<!-- END AG-KIT MANAGED BLOCK: ${id} -->`,
    };
}

function buildManagedBlock(blockId, body, lineEnding = "\n") {
    const markers = buildMarkers(blockId);
    const normalizedBody = String(body || "").replace(/\r?\n/g, lineEnding).trimEnd();
    return `${markers.begin}${lineEnding}${normalizedBody}${lineEnding}${markers.end}`;
}

function upsertManagedBlock(filePath, blockId, body, options = {}) {
    const dryRun = Boolean(options.dryRun);
    const original = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const lineEnding = detectLineEnding(original);
    const managedBlock = buildManagedBlock(blockId, body, lineEnding);
    const markers = buildMarkers(blockId);
    const blockRegex = new RegExp(
        `${escapeRegex(markers.begin)}[\\s\\S]*?${escapeRegex(markers.end)}`,
        "m",
    );

    let next = "";
    let action = "unchanged";

    if (!original) {
        next = `${managedBlock}${lineEnding}`;
        action = "created";
    } else if (blockRegex.test(original)) {
        next = original.replace(blockRegex, managedBlock);
        action = next === original ? "unchanged" : "updated";
        if (next && !/\r?\n$/.test(next)) {
            next += lineEnding;
        }
    } else {
        next = `${original.replace(/\r?\n?$/, "")}${lineEnding}${lineEnding}${managedBlock}${lineEnding}`;
        action = "appended";
    }

    if (!dryRun && action !== "unchanged") {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, next, "utf8");
    }

    return { action };
}

module.exports = {
    buildManagedBlock,
    upsertManagedBlock,
};
