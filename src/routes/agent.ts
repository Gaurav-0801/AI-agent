import { Router } from "express"
import { AgentService } from "../services/agentService"
import { validateMessageRequest } from "../utils/validation"

export const agentRouter = Router()

agentRouter.post("/message", async (req, res) => {
  try {
    const validation = validateMessageRequest(req.body)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    const { message, session_id } = req.body
    const { vectorStore, memoryManager, pluginManager } = req.app.locals

    const agentService = new AgentService(vectorStore, memoryManager, pluginManager)
    const response = await agentService.processMessage(message, session_id)

    res.json({
      response,
      session_id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Agent message error:", error)
    res.status(500).json({ error: "Failed to process message" })
  }
})

// Get session history
agentRouter.get("/session/:session_id/history", (req, res) => {
  try {
    const { session_id } = req.params
    const { memoryManager } = req.app.locals

    const history = memoryManager.getSessionHistory(session_id)
    res.json({ session_id, history })
  } catch (error) {
    console.error("Session history error:", error)
    res.status(500).json({ error: "Failed to get session history" })
  }
})

// Clear session
agentRouter.delete("/session/:session_id", (req, res) => {
  try {
    const { session_id } = req.params
    const { memoryManager } = req.app.locals

    memoryManager.clearSession(session_id)
    res.json({ message: "Session cleared", session_id })
  } catch (error) {
    console.error("Clear session error:", error)
    res.status(500).json({ error: "Failed to clear session" })
  }
})
