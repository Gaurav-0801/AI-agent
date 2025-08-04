# Development Notes

## AI-Generated vs Hand-Written Code

### AI-Generated Components (~60%)
- **Basic TypeScript interfaces and types**: Used AI to generate standard interface definitions
- **Express.js boilerplate setup**: Standard server configuration and middleware setup
- **OpenAI API integration patterns**: Standard API calling patterns and error handling
- **Vector similarity calculations**: Mathematical operations using ml-distance library
- **Plugin interface definitions**: Standard plugin architecture patterns
- **Environment variable handling**: Standard dotenv configuration patterns

### Hand-Written Components (~40%)
- **Core agent orchestration logic**: The main flow in `AgentService.processMessage()` 
- **Custom prompt engineering**: The system prompt building logic in `promptBuilder.ts`
- **Plugin intent detection**: Custom logic for detecting when to trigger plugins
- **Memory management strategy**: Session-based memory with cleanup logic
- **Vector store implementation**: Custom vector search using cosine similarity
- **Weather plugin city extraction**: Regex patterns and fallback logic for city detection
- **Math plugin expression parsing**: Custom logic for extracting mathematical expressions
- **API route design**: RESTful endpoint structure and response formats

## Bugs Faced and Solutions

### 1. Vector Embedding Dimension Mismatch
**Problem**: Initial attempts used different embedding models for indexing vs querying, causing dimension mismatches.

**Solution**: Standardized on `text-embedding-3-small` model throughout the system and added validation for embedding dimensions.

### 2. Memory Leak in Session Storage
**Problem**: Sessions were accumulating without cleanup, causing memory usage to grow indefinitely.

**Solution**: Implemented automatic session cleanup based on last activity timestamp (24-hour timeout) and message count limits (100 messages max per session).

### 3. Plugin Intent Detection Conflicts
**Problem**: Multiple plugins were triggering for the same message, causing duplicate processing.

**Solution**: Refined the `canHandle()` logic for each plugin with more specific keyword matching and added priority ordering in the plugin manager.

### 4. OpenAI API Rate Limiting
**Problem**: Rapid consecutive requests were hitting OpenAI rate limits during testing.

**Solution**: Added proper error handling for rate limit responses and implemented exponential backoff (though not included in this basic version).

### 5. Math Expression Parsing Edge Cases
**Problem**: The math plugin was failing on complex expressions with parentheses and functions.

**Solution**: Integrated the `mathjs` library which handles complex mathematical expressions safely, and added input validation to prevent code injection.

### 6. Vector Search Performance
**Problem**: Linear search through all documents was slow with larger knowledge bases.

**Solution**: While keeping the simple implementation for this demo, documented the need for proper vector indexing (like HNSW) for production use.

### 7. Weather API Dependency Removal
**Problem**: Originally used OpenWeather API which required an additional API key and external service dependency.

**Solution**: Refactored the weather plugin to use OpenAI's knowledge of typical climate patterns. The AI generates realistic weather information based on the city's typical climate and current season, eliminating the need for a separate weather API while still providing useful weather context.

## Agent Architecture Flow

### 1. Message Processing Pipeline
\`\`\`
User Message → Validation → Memory Storage → Context Retrieval → Plugin Processing → Prompt Building → LLM Generation → Response Storage → Return
\`\`\`

### 2. Context Assembly
The agent assembles context from three sources:
- **Recent Memory**: Last 4 messages from the session
- **Vector Retrieval**: Top 3 most similar knowledge base chunks
- **Plugin Results**: Any triggered plugin outputs

### 3. Plugin Routing Logic
Each plugin implements `canHandle(message)` which uses:
- **Keyword matching**: Looking for domain-specific terms
- **Pattern recognition**: Regex patterns for structured queries
- **Intent classification**: Simple rule-based intent detection

### 4. Memory Management Strategy
- **Session-based**: Each user gets isolated conversation history
- **Sliding window**: Maintains recent context while preventing memory bloat
- **Automatic cleanup**: Removes stale sessions to prevent memory leaks
- **Message trimming**: Keeps conversations within reasonable limits

## Production Considerations

### Scalability Improvements Needed
1. **Database persistence**: Replace in-memory storage with Redis/PostgreSQL
2. **Vector indexing**: Use proper vector database like Pinecone or Weaviate
3. **Caching**: Add response caching for common queries
4. **Rate limiting**: Implement per-user rate limiting
5. **Monitoring**: Add APM and logging infrastructure

### Security Enhancements
1. **Input sanitization**: More robust validation and sanitization
2. **Authentication**: Add API key or JWT-based auth
3. **CORS configuration**: Restrict origins in production
4. **Plugin sandboxing**: Isolate plugin execution for security

### Performance Optimizations
1. **Connection pooling**: For database connections
2. **Async processing**: Background processing for non-critical operations
3. **Response streaming**: Stream responses for better UX
4. **Batch processing**: Batch similar operations together

## Key Design Decisions

### 1. Custom Vector Store vs External Service
**Decision**: Implemented custom vector store using cosine similarity
**Reasoning**: Simpler deployment, no external dependencies, sufficient for demo scale
**Trade-off**: Performance and scalability limitations

### 2. In-Memory Session Storage
**Decision**: Used Map-based in-memory storage for sessions
**Reasoning**: Simplicity and no external dependencies
**Trade-off**: Data loss on restart, memory limitations

### 3. Plugin Architecture
**Decision**: Simple interface-based plugin system
**Reasoning**: Easy to extend, clear separation of concerns
**Trade-off**: No plugin isolation or advanced features

### 4. Prompt Engineering Approach
**Decision**: Template-based prompt building with context injection
**Reasoning**: Predictable, debuggable, and maintainable
**Trade-off**: Less dynamic than learned prompt optimization

This implementation demonstrates a solid foundation for an AI agent system while highlighting areas for production enhancement.
