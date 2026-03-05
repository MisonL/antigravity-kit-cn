const crypto = require("crypto");
const os = require("os");
const path = require("path");

const DEFAULT_BACKUP_DIR = path.join(".ag-kit", "backups");
const LEGACY_LOCAL_BACKUP_DIR = ".agents-backup";

function resolveAbsolutePath(value, fallback) {
    if (typeof value !== "string" || value.trim() === "") {
        return path.resolve(fallback);
    }
    if (path.isAbsolute(value)) {
        return path.resolve(value);
    }
    return path.resolve(process.cwd(), value);
}

function normalizeWorkspaceRoot(workspaceRoot) {
    return path.resolve(workspaceRoot || process.cwd());
}

function normalizeForHash(absPath) {
    if (process.platform === "win32") {
        return absPath.toLowerCase();
    }
    return absPath;
}

function slugify(input) {
    const raw = String(input || "").trim();
    const lowered = raw.toLowerCase();
    const slug = lowered.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || "workspace";
}

function getBackupBaseDir() {
    const customPath = process.env.AG_KIT_BACKUP_ROOT;
    if (customPath && customPath.trim() !== "") {
        return resolveAbsolutePath(customPath, process.cwd());
    }
    return path.join(os.homedir(), DEFAULT_BACKUP_DIR);
}

function getWorkspaceBackupBucket(workspaceRoot) {
    const normalizedRoot = normalizeWorkspaceRoot(workspaceRoot);
    const digest = crypto.createHash("sha256")
        .update(normalizeForHash(normalizedRoot))
        .digest("hex")
        .slice(0, 16);
    const bucketName = `${slugify(path.basename(normalizedRoot))}-${digest}`;
    return path.join(getBackupBaseDir(), bucketName);
}

function getLegacyWorkspaceBackupBucket(workspaceRoot) {
    return path.join(normalizeWorkspaceRoot(workspaceRoot), LEGACY_LOCAL_BACKUP_DIR);
}

module.exports = {
    LEGACY_LOCAL_BACKUP_DIR,
    getBackupBaseDir,
    getWorkspaceBackupBucket,
    getLegacyWorkspaceBackupBucket,
};
