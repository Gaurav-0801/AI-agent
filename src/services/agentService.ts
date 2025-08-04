import OpenAI from "openai"
import type { VectorStore } from "./vectorStore"
import type { MemoryManager } from "./memoryManager"
import type { PluginManager } from "./pluginManager"
import { buildSystemPrompt } from "../utils/promptBuilder"

export class AgentService {
  private openai: OpenAI

  constructor(
    private vectorStore: VectorStore,
    private memoryManager: MemoryManager,
    private pluginManager: PluginManager,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async processMessage(message: string, sessionId: string): Promise<string> {
    try {
      // 1. Store user message in memory
      this.memoryManager.addMessage(sessionId, "user", message)

      // 2. Retrieve relevant context from vector store
      const relevantChunks = await this.vectorStore.search(message, 3)

      // 3. Get recent conversation history
      const recentHistory = this.memoryManager.getRecentMessages(sessionId, 4)

      // 4. Check for plugin intents and execute if needed
      const pluginResults = await this.pluginManager.processMessage(message)

      // 5. Build system prompt with all context
      const systemPrompt = buildSystemPrompt({
        recentHistory,
        relevantChunks,
        pluginResults,
      })

      // 6. Generate response using OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const response = completion.choices[0]?.message?.content || "I apologize, but I could not generate a response."

      // 7. Store assistant response in memory
      this.memoryManager.addMessage(sessionId, "assistant", response)

      return response
    } catch (error) {
      console.error("Agent processing error:", error)
      throw new Error("Failed to process message")
    }
  }
}
