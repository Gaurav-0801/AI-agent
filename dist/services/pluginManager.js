"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
const weatherPlugin_1 = require("../plugins/weatherPlugin");
const mathPlugin_1 = require("../plugins/mathPlugin");
class PluginManager {
    constructor() {
        this.plugins = [];
        // Register built-in plugins
        this.registerPlugin(new weatherPlugin_1.WeatherPlugin());
        this.registerPlugin(new mathPlugin_1.MathPlugin());
    }
    registerPlugin(plugin) {
        this.plugins.push(plugin);
        console.log(`Registered plugin: ${plugin.name}`);
    }
    async processMessage(message) {
        const results = [];
        for (const plugin of this.plugins) {
            if (plugin.canHandle(message)) {
                try {
                    const result = await plugin.execute(message);
                    results.push({
                        pluginName: plugin.name,
                        result,
                        success: true,
                    });
                }
                catch (error) {
                    results.push({
                        pluginName: plugin.name,
                        result: null,
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }
        }
        return results;
    }
    getAvailablePlugins() {
        return this.plugins.map((plugin) => ({
            name: plugin.name,
            description: plugin.description,
        }));
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=pluginManager.js.map