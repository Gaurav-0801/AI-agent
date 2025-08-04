"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const openai_1 = __importDefault(require("openai"));
const promptBuilder_1 = require("../utils/promptBuilder");
class AgentService {
    constructor(vectorStore, memoryManager, pluginManager) {
        this.vectorStore = vectorStore;
        this.memoryManager = memoryManager;
        this.pluginManager = pluginManager;
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async processMessage(message, sessionId) {
        try {
            // 1. Store user message in memory
            this.memoryManager.addMessage(sessionId, "user", message);
            // 2. Retrieve relevant context from vector store
            const relevantChunks = await this.vectorStore.search(message, 3);
            // 3. Get recent conversation history
            const recentHistory = this.memoryManager.getRecentMessages(sessionId, 4);
            // 4. Check for plugin intents and execute if needed
            const pluginResults = await this.pluginManager.processMessage(message);
            // 5. Build system prompt with all context
            const systemPrompt = (0, promptBuilder_1.buildSystemPrompt)({
                recentHistory,
                relevantChunks,
                pluginResults,
            });
            // 6. Generate response using OpenAI
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });
            const response = completion.choices[0]?.message?.content || "I apologize, but I could not generate a response.";
            // 7. Store assistant response in memory
            this.memoryManager.addMessage(sessionId, "assistant", response);
            return response;
        }
        catch (error) {
            console.error("Agent processing error:", error);
            throw new Error("Failed to process message");
        }
    }
}
exports.AgentService = AgentService;
//# sourceMappingURL=agentService.js.map