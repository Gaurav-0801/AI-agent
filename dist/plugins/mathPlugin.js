"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathPlugin = void 0;
const mathjs_1 = require("mathjs");
class MathPlugin {
    constructor() {
        this.name = "Math";
        this.description = "Evaluate mathematical expressions and solve calculations";
    }
    canHandle(message) {
        // Check for mathematical expressions
        const mathPatterns = [
            /\d+\s*[+\-*/^%]\s*\d+/, // Basic operations
            /calculate|math|solve|compute|evaluate/i,
            /what is \d+/i,
            /\d+\s*[+\-*/]\s*\d+\s*=/,
            /sqrt|sin|cos|tan|log|ln/i,
        ];
        return mathPatterns.some((pattern) => pattern.test(message));
    }
    async execute(message) {
        try {
            // Extract mathematical expressions from the message
            const expressions = this.extractMathExpressions(message);
            if (expressions.length === 0) {
                return {
                    error: "No mathematical expression found",
                    message: "Please provide a mathematical expression to evaluate",
                };
            }
            const results = [];
            for (const expr of expressions) {
                try {
                    const result = (0, mathjs_1.evaluate)(expr);
                    results.push({
                        expression: expr,
                        result: result,
                        formatted: this.formatResult(result),
                    });
                }
                catch (error) {
                    results.push({
                        expression: expr,
                        error: "Invalid mathematical expression",
                        message: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }
            return {
                calculations: results,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            throw error;
        }
    }
    extractMathExpressions(message) {
        const expressions = [];
        // Pattern 1: Direct mathematical expressions
        const mathRegex = /[\d+\-*/^$$$$.\s]+(?:[+\-*/^][\d+\-*/^$$$$.\s]+)+/g;
        const matches = message.match(mathRegex);
        if (matches) {
            expressions.push(...matches.map((match) => match.trim()));
        }
        // Pattern 2: "what is X" format
        const whatIsRegex = /what is (.+?)(?:\?|$)/gi;
        let match;
        while ((match = whatIsRegex.exec(message)) !== null) {
            const expr = match[1].trim();
            if (this.isValidMathExpression(expr)) {
                expressions.push(expr);
            }
        }
        // Pattern 3: "calculate X" format
        const calculateRegex = /(?:calculate|compute|evaluate|solve)\s+(.+?)(?:\?|$)/gi;
        while ((match = calculateRegex.exec(message)) !== null) {
            const expr = match[1].trim();
            if (this.isValidMathExpression(expr)) {
                expressions.push(expr);
            }
        }
        return [...new Set(expressions)]; // Remove duplicates
    }
    isValidMathExpression(expr) {
        // Basic validation for mathematical expressions
        const validChars = /^[\d+\-*/^$$$$.\s\w]+$/;
        return validChars.test(expr) && /\d/.test(expr);
    }
    formatResult(result) {
        if (typeof result === "number") {
            // Round to reasonable decimal places
            if (Number.isInteger(result)) {
                return result.toString();
            }
            else {
                return Number.parseFloat(result.toFixed(6)).toString();
            }
        }
        return result.toString();
    }
}
exports.MathPlugin = MathPlugin;
//# sourceMappingURL=mathPlugin.js.map