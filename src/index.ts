import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { agentRouter } from "./routes/agent"
import { VectorStore } from "./services/vectorStore"
import { MemoryManager } from "./services/memoryManager"
import { PluginManager } from "./services/pluginManager"
import { initializeKnowledgeBase } from "./utils/knowledgeBase"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: "10mb" }))

// Initialize services
const vectorStore = new VectorStore()
const memoryManager = new MemoryManager()
const pluginManager = new PluginManager()

// Make services available to routes
app.locals.vectorStore = vectorStore
app.locals.memoryManager = memoryManager
app.locals.pluginManager = pluginManager

// Routes
app.use("/agent", agentRouter)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Initialize knowledge base and start server
async function startServer() {
  try {
    console.log("Initializing knowledge base...")
    await initializeKnowledgeBase(vectorStore)

    app.listen(PORT, () => {
      console.log(`🚀 AI Agent Server running on port ${PORT}`)
      console.log(`📚 Knowledge base initialized with vector embeddings`)
      console.log(`🔌 Plugins loaded: Weather, Math`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
