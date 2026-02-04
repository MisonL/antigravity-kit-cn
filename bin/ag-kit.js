#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const command = args[0];

if (command === "init") {
    console.log("🚀 Initializing Antigravity Kit (Chinese Version)...");

    const sourceDir = path.join(__dirname, "../.agent");
    const targetDir = path.join(process.cwd(), ".agent");

    if (fs.existsSync(targetDir)) {
        console.log("⚠️  .agent directory already exists.");
        // Simple check for force flag
        if (!args.includes("--force")) {
            console.log("   Use --force to overwrite.");
            process.exit(1);
        }
    }

    // Recursive copy function
    function copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        let entries = fs.readdirSync(src, { withFileTypes: true });

        for (let entry of entries) {
            let srcPath = path.join(src, entry.name);
            let destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    try {
        copyDir(sourceDir, targetDir);
        console.log("✅ Successfully installed .agent folder!");
        console.log('👉 You can now use "/brainstorm", "/create", etc.');
    } catch (err) {
        console.error("❌ Error copying files:", err);
        process.exit(1);
    }
} else if (command === "status") {
    console.log("✅ Antigravity Kit is installed and ready.");
    console.log("   Version: 2.0.1 (CN-Local)");
} else {
    console.log("Usage: ag-kit init [--force]");
    console.log("       ag-kit status");
}
