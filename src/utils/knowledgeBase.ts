import type { VectorStore } from "../services/vectorStore"

// Sample knowledge base documents
const knowledgeDocuments = [
  {
    id: "typescript-basics",
    content: `TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. TypeScript adds static type definitions to JavaScript, which helps catch errors during development. Key features include:

- Static typing with type inference
- Interfaces and type aliases
- Generics for reusable code
- Decorators for metadata
- Advanced IDE support with IntelliSense
- Compile-time error checking

TypeScript compiles to plain JavaScript and runs anywhere JavaScript runs. It's particularly popular for large-scale applications and provides excellent developer experience.`,
    metadata: { category: "programming", language: "typescript" },
  },
  {
    id: "ai-agents-overview",
    content: `AI agents are autonomous software entities that can perceive their environment, make decisions, and take actions to achieve specific goals. Modern AI agents typically include:

- Natural Language Processing (NLP) for understanding user input
- Memory systems to maintain context across conversations
- Tool/plugin systems for extending capabilities
- Retrieval-Augmented Generation (RAG) for accessing external knowledge
- Planning and reasoning capabilities
- Multi-modal understanding (text, images, audio)

AI agents can be deployed in various domains including customer service, personal assistants, code generation, and automated workflows. They combine large language models with specialized tools and knowledge bases.`,
    metadata: { category: "ai", topic: "agents" },
  },
  {
    id: "vector-databases",
    content: `Vector databases are specialized databases designed to store and query high-dimensional vectors efficiently. They are essential for AI applications that use embeddings:

- Store dense vector representations of data (text, images, audio)
- Support similarity search using metrics like cosine similarity
- Enable semantic search and retrieval
- Scale to billions of vectors with sub-second query times
- Support metadata filtering and hybrid search

Popular vector databases include Pinecone, Weaviate, Chroma, and Qdrant. They are commonly used in RAG systems, recommendation engines, and semantic search applications.`,
    metadata: { category: "databases", topic: "vectors" },
  },
  {
    id: "nodejs-best-practices",
    content: `Node.js best practices for building scalable backend applications:

1. Use TypeScript for type safety and better developer experience
2. Implement proper error handling with try-catch and error middleware
3. Use environment variables for configuration
4. Implement logging with structured logs (JSON format)
5. Use connection pooling for databases
6. Implement rate limiting and security headers
7. Use clustering or PM2 for production deployment
8. Monitor performance with APM tools
9. Implement health checks and graceful shutdowns
10. Use linting and formatting tools (ESLint, Prettier)

Security considerations include input validation, SQL injection prevention, CORS configuration, and keeping dependencies updated.`,
    metadata: { category: "backend", framework: "nodejs" },
  },
  {
    id: "rag-systems",
    content: `Retrieval-Augmented Generation (RAG) is a technique that combines pre-trained language models with external knowledge retrieval:

Architecture components:
- Document ingestion and chunking
- Vector embedding generation
- Vector database for storage
- Similarity search for retrieval
- Context injection into LLM prompts
- Response generation with retrieved context

Benefits:
- Access to up-to-date information
- Reduced hallucinations
- Domain-specific knowledge integration
- Cost-effective compared to fine-tuning
- Transparent and explainable results

RAG systems are widely used in chatbots, question-answering systems, and knowledge management applications.`,
    metadata: { category: "ai", topic: "rag" },
  },
]

export async function initializeKnowledgeBase(vectorStore: VectorStore): Promise<void> {
  console.log("Loading knowledge base documents...")

  for (const doc of knowledgeDocuments) {
    await vectorStore.addDocument(doc.id, doc.content, doc.metadata)
  }

  console.log(`✅ Loaded ${knowledgeDocuments.length} documents into vector store`)
}
