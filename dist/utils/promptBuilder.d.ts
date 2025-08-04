import type { Message } from "../services/memoryManager";
import type { SearchResult } from "../services/vectorStore";
import type { PluginResult } from "../services/pluginManager";
export interface PromptContext {
    recentHistory: Message[];
    relevantChunks: SearchResult[];
    pluginResults: PluginResult[];
}
export declare function buildSystemPrompt(context: PromptContext): string;
//# sourceMappingURL=promptBuilder.d.ts.map