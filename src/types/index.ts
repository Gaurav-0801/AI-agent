// Core type definitions for the AI Agent Server

export interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Session {
  id: string
  messages: Message[]
  createdAt: Date
  lastActivity: Date
}

export interface Document {
  id: string
  content: string
  embedding: number[]
  metadata: Record<string, any>
}

export interface SearchResult {
  document: Document
  similarity: number
}

export interface PluginResult {
  pluginName: string
  result: any
  success: boolean
  error?: string
}

export interface Plugin {
  name: string
  description: string
  canHandle(message: string): boolean
  execute(message: string): Promise<any>
}

export interface PromptContext {
  recentHistory: Message[]
  relevantChunks: SearchResult[]
  pluginResults: PluginResult[]
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface AgentResponse {
  response: string
  session_id: string
  timestamp: string
}

export interface MessageRequest {
  message: string
  session_id: string
}
