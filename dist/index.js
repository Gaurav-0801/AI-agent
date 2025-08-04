"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const agent_1 = require("./routes/agent");
const vectorStore_1 = require("./services/vectorStore");
const memoryManager_1 = require("./services/memoryManager");
const pluginManager_1 = require("./services/pluginManager");
const knowledgeBase_1 = require("./utils/knowledgeBase");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
// Initialize services
const vectorStore = new vectorStore_1.VectorStore();
const memoryManager = new memoryManager_1.MemoryManager();
const pluginManager = new pluginManager_1.PluginManager();
// Make services available to routes
app.locals.vectorStore = vectorStore;
app.locals.memoryManager = memoryManager;
app.locals.pluginManager = pluginManager;
// Routes
app.use("/agent", agent_1.agentRouter);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
// Error handling
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
});
// Initialize knowledge base and start server
async function startServer() {
    try {
        console.log("Initializing knowledge base...");
        await (0, knowledgeBase_1.initializeKnowledgeBase)(vectorStore);
        app.listen(PORT, () => {
            console.log(`🚀 AI Agent Server running on port ${PORT}`);
            console.log(`📚 Knowledge base initialized with vector embeddings`);
            console.log(`🔌 Plugins loaded: Weather, Math`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map