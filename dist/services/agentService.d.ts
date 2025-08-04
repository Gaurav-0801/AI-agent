import type { VectorStore } from "./vectorStore";
import type { MemoryManager } from "./memoryManager";
import type { PluginManager } from "./pluginManager";
export declare class AgentService {
    private vectorStore;
    private memoryManager;
    private pluginManager;
    private openai;
    constructor(vectorStore: VectorStore, memoryManager: MemoryManager, pluginManager: PluginManager);
    processMessage(message: string, sessionId: string): Promise<string>;
}
//# sourceMappingURL=agentService.d.ts.map