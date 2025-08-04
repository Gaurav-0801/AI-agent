"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStore = void 0;
const openai_1 = __importDefault(require("openai"));
const { cosine } = require("ml-distance");
class VectorStore {
    constructor() {
        this.documents = [];
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async addDocument(id, content, metadata = {}) {
        try {
            const embedding = await this.getEmbedding(content);
            const document = {
                id,
                content,
                embedding,
                metadata,
            };
            // Remove existing document with same ID
            this.documents = this.documents.filter((doc) => doc.id !== id);
            this.documents.push(document);
            console.log(`Added document: ${id} (${content.length} chars)`);
        }
        catch (error) {
            console.error(`Failed to add document ${id}:`, error);
            throw error;
        }
    }
    async search(query, topK = 3) {
        try {
            if (this.documents.length === 0) {
                return [];
            }
            const queryEmbedding = await this.getEmbedding(query);
            const results = this.documents.map((doc) => ({
                document: doc,
                similarity: 1 - cosine(queryEmbedding, doc.embedding),
            }));
            // Sort by similarity (highest first) and return top K
            return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
        }
        catch (error) {
            console.error("Vector search error:", error);
            return [];
        }
    }
    async getEmbedding(text) {
        try {
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            return response.data[0].embedding;
        }
        catch (error) {
            console.error("Embedding generation error:", error);
            throw error;
        }
    }
    getDocumentCount() {
        return this.documents.length;
    }
    getAllDocuments() {
        return [...this.documents];
    }
}
exports.VectorStore = VectorStore;
//# sourceMappingURL=vectorStore.js.map