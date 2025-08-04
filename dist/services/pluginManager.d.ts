export interface PluginResult {
    pluginName: string;
    result: any;
    success: boolean;
    error?: string;
}
export interface Plugin {
    name: string;
    description: string;
    canHandle(message: string): boolean;
    execute(message: string): Promise<any>;
}
export declare class PluginManager {
    private plugins;
    constructor();
    registerPlugin(plugin: Plugin): void;
    processMessage(message: string): Promise<PluginResult[]>;
    getAvailablePlugins(): Array<{
        name: string;
        description: string;
    }>;
}
//# sourceMappingURL=pluginManager.d.ts.map