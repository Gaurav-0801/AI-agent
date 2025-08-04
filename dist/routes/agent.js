"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRouter = void 0;
const express_1 = require("express");
const agentService_1 = require("../services/agentService");
const validation_1 = require("../utils/validation");
exports.agentRouter = (0, express_1.Router)();
exports.agentRouter.post("/message", async (req, res) => {
    try {
        const validation = (0, validation_1.validateMessageRequest)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }
        const { message, session_id } = req.body;
        const { vectorStore, memoryManager, pluginManager } = req.app.locals;
        const agentService = new agentService_1.AgentService(vectorStore, memoryManager, pluginManager);
        const response = await agentService.processMessage(message, session_id);
        res.json({
            response,
            session_id,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Agent message error:", error);
        res.status(500).json({ error: "Failed to process message" });
    }
});
// Get session history
exports.agentRouter.get("/session/:session_id/history", (req, res) => {
    try {
        const { session_id } = req.params;
        const { memoryManager } = req.app.locals;
        const history = memoryManager.getSessionHistory(session_id);
        res.json({ session_id, history });
    }
    catch (error) {
        console.error("Session history error:", error);
        res.status(500).json({ error: "Failed to get session history" });
    }
});
// Clear session
exports.agentRouter.delete("/session/:session_id", (req, res) => {
    try {
        const { session_id } = req.params;
        const { memoryManager } = req.app.locals;
        memoryManager.clearSession(session_id);
        res.json({ message: "Session cleared", session_id });
    }
    catch (error) {
        console.error("Clear session error:", error);
        res.status(500).json({ error: "Failed to clear session" });
    }
});
//# sourceMappingURL=agent.js.map