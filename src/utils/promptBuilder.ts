import type { Message } from "../services/memoryManager"
import type { SearchResult } from "../services/vectorStore"
import type { PluginResult } from "../services/pluginManager"

export interface PromptContext {
  recentHistory: Message[]
  relevantChunks: SearchResult[]
  pluginResults: PluginResult[]
}

export function buildSystemPrompt(context: PromptContext): string {
  const { recentHistory, relevantChunks, pluginResults } = context

  let prompt = `You are an intelligent AI assistant with access to a knowledge base and various tools. Your goal is to provide helpful, accurate, and contextual responses.

## Core Instructions:
- Be conversational and helpful
- Use the provided context and memory to give relevant responses
- If you used plugin results, integrate them naturally into your response
- Be concise but thorough
- If you don't know something, say so honestly

`

  // Add conversation memory
  if (recentHistory.length > 0) {
    prompt += `## Recent Conversation History:
`
    recentHistory.forEach((msg, index) => {
      prompt += `${msg.role}: ${msg.content}\n`
    })
    prompt += "\n"
  }

  // Add retrieved context
  if (relevantChunks.length > 0) {
    prompt += `## Relevant Knowledge Base Context:
`
    relevantChunks.forEach((chunk, index) => {
      prompt += `[Context ${index + 1}] (Similarity: ${chunk.similarity.toFixed(3)})
${chunk.document.content}

`
    })
  }

  // Add plugin results
  if (pluginResults.length > 0) {
    prompt += `## Tool/Plugin Results:
`
    pluginResults.forEach((result, index) => {
      if (result.success) {
        prompt += `[${result.pluginName}] ${JSON.stringify(result.result, null, 2)}

`
      } else {
        prompt += `[${result.pluginName}] Error: ${result.error}

`
      }
    })
  }

  prompt += `## Response Guidelines:
- Integrate all available context naturally
- If plugin results are available, use them to enhance your response
- Reference the knowledge base when relevant
- Maintain conversation continuity using the chat history
- Be helpful and engaging

Now respond to the user's message:`

  return prompt
}
