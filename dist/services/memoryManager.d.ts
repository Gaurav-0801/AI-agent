export interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}
export interface Session {
    id: string;
    messages: Message[];
    createdAt: Date;
    lastActivity: Date;
}
export declare class MemoryManager {
    private sessions;
    private readonly MAX_MESSAGES_PER_SESSION;
    private readonly SESSION_TIMEOUT_MS;
    addMessage(sessionId: string, role: "user" | "assistant", content: string): void;
    getRecentMessages(sessionId: string, count?: number): Message[];
    getSessionHistory(sessionId: string): Message[];
    clearSession(sessionId: string): void;
    getSessionCount(): number;
    private cleanupOldSessions;
}
//# sourceMappingURL=memoryManager.d.ts.map