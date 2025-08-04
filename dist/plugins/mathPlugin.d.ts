import type { Plugin } from "../services/pluginManager";
export declare class MathPlugin implements Plugin {
    name: string;
    description: string;
    canHandle(message: string): boolean;
    execute(message: string): Promise<any>;
    private extractMathExpressions;
    private isValidMathExpression;
    private formatResult;
}
//# sourceMappingURL=mathPlugin.d.ts.map