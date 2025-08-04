import OpenAI from "openai"
const { cosine } = require("ml-distance");


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

export class VectorStore {
  private documents: Document[] = []
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async addDocument(id: string, content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const embedding = await this.getEmbedding(content)

      const document: Document = {
        id,
        content,
        embedding,
        metadata,
      }

      // Remove existing document with same ID
      this.documents = this.documents.filter((doc) => doc.id !== id)
      this.documents.push(document)

      console.log(`Added document: ${id} (${content.length} chars)`)
    } catch (error) {
      console.error(`Failed to add document ${id}:`, error)
      throw error
    }
  }

  async search(query: string, topK = 3): Promise<SearchResult[]> {
    try {
      if (this.documents.length === 0) {
        return []
      }

      const queryEmbedding = await this.getEmbedding(query)

      const results: SearchResult[] = this.documents.map((doc) => ({
        document: doc,
        similarity: 1 - cosine(queryEmbedding, doc.embedding),
      }))

      // Sort by similarity (highest first) and return top K
      return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK)
    } catch (error) {
      console.error("Vector search error:", error)
      return []
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      })

      return response.data[0].embedding
    } catch (error) {
      console.error("Embedding generation error:", error)
      throw error
    }
  }

  getDocumentCount(): number {
    return this.documents.length
  }

  getAllDocuments(): Document[] {
    return [...this.documents]
  }
}
