const fs = require("fs");
const path = require("path");
const os = require("os");

class AtomicWriter {
    /**
     * Atomically copy a directory structure.
     * 1. Copies source to a temp directory.
     * 2. Renames temp directory to target directory (atomic on POSIX, nearly atomic win32 move).
     * 
     * @param {string} sourceDir Source directory path
     * @param {string} targetDir Target directory path
     * @param {object} options { logger: function, force: boolean }
     */
    static atomicCopyDir(sourceDir, targetDir, options = {}) {
        const log = options.logger || console.log;
        const tempName = `.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const tempTarget = path.join(path.dirname(targetDir), tempName);

        try {
            // 1. Prepare temp dir
            // Use copy logic (recursive)
            AtomicWriter._copyDirRecursive(sourceDir, tempTarget);

            // 2. Backup if exists (optional strategy, but standard atomic replace usually implies overwrite)
            // If target exists, we need to remove it OR rename it away before renaming temp in?
            // fs.rename overwrite behavior:
            // - Linux/Mac: Atomic replacement if target exists (directory replacement rules apply).
            // - Windows: rename fails if target exists.
            
            // 2. Atomic replacement logic:
            // To be cross-platform safe and minimize the "missing target" window:
            // 1. Rename existing targetDir to a temporary backup name.
            // 2. Rename tempTarget to targetDir.
            // 3. Delete the backup if 1 & 2 succeed.
            if (fs.existsSync(targetDir)) {
                const backupPath = `${targetDir}.bak-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
                try {
                    fs.renameSync(targetDir, backupPath);
                } catch (err) {
                    // In some cases (e.g. Windows EPERM/EBUSY), rename might fail.
                    // If we can't rename, the only fallback is direct deletion, but we prefer failing 
                    // and asking user to stop processes than being non-atomic.
                    throw new Error(`无法先行重命名旧目标目录 (${targetDir}): ${err.message}`);
                }

                try {
                    fs.renameSync(tempTarget, targetDir);
                } catch (err) {
                    // Failed to move new content into place after moving old one out.
                    // Attempt to restore the backup.
                    try {
                        fs.renameSync(backupPath, targetDir);
                    } catch (restoreErr) {
                        throw new Error(`临界失败: 无法将新版本移入目标且无法恢复旧版本。旧版本位于 ${backupPath}。错误: ${err.message}`);
                    }
                    throw err;
                }

                // Step 3: Success! Cleanup backup.
                try {
                    fs.rmSync(backupPath, { recursive: true, force: true });
                } catch (cleanupErr) {
                    // Not a critical failure for the operation itself, just messy.
                    if (options.logger) options.logger(`[warn] 无法清理备份目录 ${backupPath}: ${cleanupErr.message}`);
                }
                return;
            }
            
            // If target didn't exist or was removed (Win32 path)
            fs.renameSync(tempTarget, targetDir);

        } catch (err) {
            // Cleanup temp
            if (fs.existsSync(tempTarget)) {
                fs.rmSync(tempTarget, { recursive: true, force: true });
            }
            throw new Error(`原子写入失败: ${err.message}`);
        }
    }

    static _copyDirRecursive(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                AtomicWriter._copyDirRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

module.exports = AtomicWriter;
