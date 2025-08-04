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

export class MemoryManager {
  private sessions: Map<string, Session> = new Map()
  private readonly MAX_MESSAGES_PER_SESSION = 100
  private readonly SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000 // 24 hours

  addMessage(sessionId: string, role: "user" | "assistant", content: string): void {
    let session = this.sessions.get(sessionId)

    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
      }
      this.sessions.set(sessionId, session)
    }

    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    }

    session.messages.push(message)
    session.lastActivity = new Date()

    // Trim old messages if exceeding limit
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      session.messages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION)
    }

    // Clean up old sessions periodically
    this.cleanupOldSessions()
  }

  getRecentMessages(sessionId: string, count = 10): Message[] {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return []
    }

    return session.messages.slice(-count)
  }

  getSessionHistory(sessionId: string): Message[] {
    const session = this.sessions.get(sessionId)
    return session ? [...session.messages] : []
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  getSessionCount(): number {
    return this.sessions.size
  }

  private cleanupOldSessions(): void {
    const now = new Date()
    const expiredSessions: string[] = []

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > this.SESSION_TIMEOUT_MS) {
        expiredSessions.push(sessionId)
      }
    }

    expiredSessions.forEach((sessionId) => {
      this.sessions.delete(sessionId)
    })

    if (expiredSessions.length > 0) {
      console.log(`Cleaned up ${expiredSessions.length} expired sessions`)
    }
  }
}
