"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
class MemoryManager {
    constructor() {
        this.sessions = new Map();
        this.MAX_MESSAGES_PER_SESSION = 100;
        this.SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
    }
    addMessage(sessionId, role, content) {
        let session = this.sessions.get(sessionId);
        if (!session) {
            session = {
                id: sessionId,
                messages: [],
                createdAt: new Date(),
                lastActivity: new Date(),
            };
            this.sessions.set(sessionId, session);
        }
        const message = {
            role,
            content,
            timestamp: new Date(),
        };
        session.messages.push(message);
        session.lastActivity = new Date();
        // Trim old messages if exceeding limit
        if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
            session.messages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION);
        }
        // Clean up old sessions periodically
        this.cleanupOldSessions();
    }
    getRecentMessages(sessionId, count = 10) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return [];
        }
        return session.messages.slice(-count);
    }
    getSessionHistory(sessionId) {
        const session = this.sessions.get(sessionId);
        return session ? [...session.messages] : [];
    }
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
    }
    getSessionCount() {
        return this.sessions.size;
    }
    cleanupOldSessions() {
        const now = new Date();
        const expiredSessions = [];
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now.getTime() - session.lastActivity.getTime() > this.SESSION_TIMEOUT_MS) {
                expiredSessions.push(sessionId);
            }
        }
        expiredSessions.forEach((sessionId) => {
            this.sessions.delete(sessionId);
        });
        if (expiredSessions.length > 0) {
            console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
        }
    }
}
exports.MemoryManager = MemoryManager;
//# sourceMappingURL=memoryManager.js.map