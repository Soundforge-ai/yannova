import { Message } from '../components/Chatbot';

export interface ChatSession {
    id: string;
    startTime: Date;
    lastMessageTime: Date;
    messages: Message[];
    preview: string; // First few chars of the last user message or distinct interaction
    status: 'active' | 'closed';
    tags: string[]; // e.g., 'Lead', 'Inquiry'
}

const STORAGE_KEY = 'yannova_chat_sessions';

export const chatStorage = {
    // Get all sessions
    getSessions: (): ChatSession[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            // Convert string dates back to Date objects
            return parsed.map((session: any) => ({
                ...session,
                startTime: new Date(session.startTime),
                lastMessageTime: new Date(session.lastMessageTime),
                messages: session.messages.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }))
            })).sort((a: ChatSession, b: ChatSession) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
        } catch (e) {
            console.error('Error reading chat sessions', e);
            return [];
        }
    },

    // Save or update a session
    saveSession: (session: ChatSession) => {
        try {
            const sessions = chatStorage.getSessions();
            const index = sessions.findIndex(s => s.id === session.id);

            if (index >= 0) {
                sessions[index] = session;
            } else {
                sessions.push(session);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            // Dispatch event for real-time updates across tabs/components
            window.dispatchEvent(new Event('chat-storage-updated'));
        } catch (e) {
            console.error('Error saving chat session', e);
        }
    },

    // Helper to create a new session
    createSession: (): ChatSession => {
        const id = Date.now().toString();
        return {
            id,
            startTime: new Date(),
            lastMessageTime: new Date(),
            messages: [],
            preview: 'Nieuw gesprek gestart',
            status: 'active',
            tags: []
        };
    },

    // Clear all sessions (for debug/admin)
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('chat-storage-updated'));
    }
};
