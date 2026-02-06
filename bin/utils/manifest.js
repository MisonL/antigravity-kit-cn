const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class ManifestManager {
    constructor(manifestPath, options = {}) {
        this.manifestPath = manifestPath;
        this.options = options;
        this.manifest = {
            version: 2,
            target: typeof options.target === "string" ? options.target : "",
            kitVersion: typeof options.kitVersion === "string" ? options.kitVersion : "",
            updatedAt: "",
            files: {},
        };
    }

    /**
     * Compute SHA-256 hash of a string or buffer
     * @param {string|Buffer} content 
     * @returns {string} sha256 hash
     */
    static computeHash(content) {
        return crypto.createHash("sha256").update(content).digest("hex");
    }

    static normalizeFileEntry(entry) {
        if (typeof entry === "string") {
            return { hash: entry, source: "" };
        }
        if (!entry || typeof entry !== "object") {
            return null;
        }
        const hash = typeof entry.hash === "string" ? entry.hash : "";
        const source = typeof entry.source === "string" ? entry.source : "";
        if (!hash) {
            return null;
        }
        return { hash, source };
    }

    static extractHash(entry) {
        if (typeof entry === "string") {
            return entry;
        }
        if (entry && typeof entry === "object" && typeof entry.hash === "string") {
            return entry.hash;
        }
        return "";
    }

    static normalizeManifestShape(input) {
        const output = {
            version: typeof input.version === "number" ? input.version : 2,
            target: typeof input.target === "string" ? input.target : "",
            kitVersion: typeof input.kitVersion === "string" ? input.kitVersion : "",
            updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : "",
            files: {},
        };

        if (!input.files || typeof input.files !== "object") {
            return output;
        }

        for (const [relPath, entry] of Object.entries(input.files)) {
            const normalized = ManifestManager.normalizeFileEntry(entry);
            if (!normalized) {
                continue;
            }
            output.files[relPath] = normalized;
        }

        return output;
    }

    /**
     * Load manifest from disk
     */
    load() {
        if (fs.existsSync(this.manifestPath)) {
            try {
                const raw = fs.readFileSync(this.manifestPath, "utf8");
                this.manifest = ManifestManager.normalizeManifestShape(JSON.parse(raw));
            } catch (err) {
                this.manifest = {
                    version: 2,
                    target: typeof this.options.target === "string" ? this.options.target : "",
                    kitVersion: typeof this.options.kitVersion === "string" ? this.options.kitVersion : "",
                    updatedAt: "",
                    files: {},
                };
            }
        }
        return this.manifest;
    }

    /**
     * Save manifest to disk
     */
    save() {
        this.manifest.updatedAt = new Date().toISOString();
        if (!this.manifest.target && this.options.target) {
            this.manifest.target = this.options.target;
        }
        if (!this.manifest.kitVersion && this.options.kitVersion) {
            this.manifest.kitVersion = this.options.kitVersion;
        }
        const dir = path.dirname(this.manifestPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.manifestPath, `${JSON.stringify(this.manifest, null, 2)}\n`, "utf8");
    }

    /**
     * Generate manifest entries from a directory recursively
     * @param {string} rootDir Directory to scan
     * @param {string} [baseDir] Base directory for relative paths (default: rootDir)
     * @returns {object} { file: hash } map
     */
    static generateFromDir(rootDir, baseDir = rootDir) {
        const entries = ManifestManager.generateFileEntriesFromDir(rootDir, {
            baseDir,
        });
        const hashes = {};
        for (const [relPath, entry] of Object.entries(entries)) {
            hashes[relPath] = entry.hash;
        }
        return hashes;
    }

    /**
     * Generate managed file entries from a directory recursively
     * @param {string} rootDir Directory to scan
     * @param {object} options
     * @param {string} [options.baseDir=rootDir] Base directory for relative paths
     * @param {string} [options.sourcePrefix=""] Prefix recorded in `source` field
     * @returns {object} { file: { hash, source } } map
     */
    static generateFileEntriesFromDir(rootDir, options = {}) {
        const baseDir = options.baseDir || rootDir;
        const sourcePrefix = typeof options.sourcePrefix === "string" ? options.sourcePrefix.trim() : "";
        const files = {};
        
        function scan(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    scan(fullPath);
                } else if (entry.isFile()) {
                    const content = fs.readFileSync(fullPath);
                    const hash = ManifestManager.computeHash(content);
                    const relPath = path.relative(baseDir, fullPath).split(path.sep).join("/");
                    files[relPath] = {
                        hash,
                        source: sourcePrefix ? `${sourcePrefix}/${relPath}` : relPath,
                    };
                }
            }
        }
        
        if (fs.existsSync(rootDir)) {
            scan(rootDir);
        }
        return files;
    }

    /**
     * Compare existing manifest with current file system state to detect user changes
     * @param {string} projectRoot 
     * @returns {object} { modified: [], missing: [], unknown: [] } 
     */
    checkDrift(projectRoot) {
        // This checks if the files listed in the manifest (which should match what we installed)
        // still match what is currently on disk.
        // Useful for doctor or update pre-check.
        const drift = {
            modified: [], // Hash mismatch
            missing: [],  // File in manifest but not on disk
        };

        for (const [relPath, entry] of Object.entries(this.manifest.files || {})) {
            const expectedHash = ManifestManager.extractHash(entry);
            if (!expectedHash) {
                continue;
            }
            const absPath = path.join(projectRoot, relPath);
            if (!fs.existsSync(absPath)) {
                drift.missing.push(relPath);
            } else {
                const content = fs.readFileSync(absPath);
                const currentHash = ManifestManager.computeHash(content);
                if (currentHash !== expectedHash) {
                    drift.modified.push(relPath);
                }
            }
        }
        return drift;
    }

    /**
     * Select user-modified files to backup during overwrite:
     * currentHash != manifestHash AND currentHash != incomingHash
     * @param {string} projectRoot
     * @param {object} incomingFiles Next manifest files map
     * @returns {string[]} relative file paths
     */
    collectSmartOverwriteConflicts(projectRoot, incomingFiles = {}) {
        const modified = [];
        const existingFiles = this.manifest.files || {};

        for (const [relPath, manifestEntry] of Object.entries(existingFiles)) {
            const expectedHash = ManifestManager.extractHash(manifestEntry);
            if (!expectedHash) {
                continue;
            }

            const absPath = path.join(projectRoot, relPath);
            if (!fs.existsSync(absPath)) {
                continue;
            }

            const currentHash = ManifestManager.computeHash(fs.readFileSync(absPath));
            if (currentHash === expectedHash) {
                continue;
            }

            const incomingHash = ManifestManager.extractHash(incomingFiles[relPath]);
            if (incomingHash && currentHash === incomingHash) {
                continue;
            }

            modified.push(relPath);
        }

        return modified;
    }
}

module.exports = ManifestManager;
