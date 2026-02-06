const fs = require("fs");
const path = require("path");

class BaseAdapter {
    constructor(workspaceRoot, options) {
        this.workspaceRoot = path.resolve(workspaceRoot);
        this.options = options || {};
    }

    /**
     * @returns {string} Target name (e.g., 'gemini', 'codex')
     */
    get targetName() {
        throw new Error("Adapter must implement targetName getter");
    }

    /**
     * @returns {string} Installed version or null if not installed
     */
    getInstalledVersion() {
        throw new Error("Adapter must implement getInstalledVersion");
    }

    /**
     * Install the target to the workspace
     * @param {string} sourceDir - Path to bundled resources
     */
    install(sourceDir) {
        throw new Error("Adapter must implement install");
    }

    /**
     * Update the target
     * @param {string} sourceDir - Path to bundled resources
     */
    update(sourceDir) {
        throw new Error("Adapter must implement update");
    }

    /**
     * Check integrity of the installation
     * @returns {object} status: 'ok'|'broken'|'drift', issues: []
     */
    checkIntegrity() {
        throw new Error("Adapter must implement checkIntegrity");
    }

    /**
     * Fix integrity issues
     * @returns {object} fixed: boolean, summary: string
     */
    fixIntegrity() {
        throw new Error("Adapter must implement fixIntegrity");
    }

    log(message) {
        if (!this.options.quiet) {
            console.log(message);
        }
    }
}

module.exports = BaseAdapter;
