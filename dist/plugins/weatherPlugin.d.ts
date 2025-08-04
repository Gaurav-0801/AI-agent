import type { Plugin } from "../services/pluginManager";
export declare class WeatherPlugin implements Plugin {
    name: string;
    description: string;
    private openai;
    constructor();
    canHandle(message: string): boolean;
    execute(message: string): Promise<any>;
    private extractCityName;
}
//# sourceMappingURL=weatherPlugin.d.ts.map