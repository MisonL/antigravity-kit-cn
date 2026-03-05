const BaseAdapter = require("./base");
const CodexAdapter = require("./codex");

class GeminiAdapter extends BaseAdapter {
    get targetName() {
        return "gemini";
    }

    _delegate() {
        return new CodexAdapter(this.workspaceRoot, {
            ...this.options,
            compatibilityEntry: "gemini",
        });
    }

    getInstalledVersion() {
        return this._delegate().getInstalledVersion();
    }

    install(sourceDir) {
        this._delegate().install(sourceDir);
    }

    update(sourceDir) {
        this._delegate().update(sourceDir);
    }

    checkIntegrity() {
        return this._delegate().checkIntegrity();
    }

    fixIntegrity() {
        return this._delegate().fixIntegrity();
    }
}

module.exports = GeminiAdapter;
