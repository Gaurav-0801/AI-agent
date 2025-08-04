export interface Document {
    id: string;
    content: string;
    embedding: number[];
    metadata: Record<string, any>;
}
export interface SearchResult {
    document: Document;
    similarity: number;
}
export declare class VectorStore {
    private documents;
    private openai;
    constructor();
    addDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void>;
    search(query: string, topK?: number): Promise<SearchResult[]>;
    private getEmbedding;
    getDocumentCount(): number;
    getAllDocuments(): Document[];
}
//# sourceMappingURL=vectorStore.d.ts.map