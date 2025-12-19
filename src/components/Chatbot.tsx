import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import { chatStorage, ChatSession } from '../lib/chatStorage';
import { settingsStorage } from '../lib/settingsStorage';
import { chatService } from '../lib/chatService';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [botName, setBotName] = useState('Yannova Assistent'); // Dynamic bot name

  // Load settings specifically for bot name and updates
  useEffect(() => {
    const loadSettings = () => {
      const settings = settingsStorage.getSettings();
      setBotName(settings.botName);
    };
    loadSettings();
    window.addEventListener('settings-updated', loadSettings);
    return () => window.removeEventListener('settings-updated', loadSettings);
  }, []);

  /* ... existing state ... */
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session
  useEffect(() => {
    // Check for existing active session or create new one
    // For simplicity in this demo, we create a new session on page load
    // In a real app, you might check localStorage for an active session ID first
    const newSession = chatStorage.createSession();
    setSessionId(newSession.id);

    const settings = settingsStorage.getSettings(); // Get current name for greeting if needed, though greeting is hardcoded usually

    // Add initial greeting to the session
    const initialMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `Hallo! 👋 Ik ben ${settings.botName}. Hoe kan ik u helpen met uw bouw- of renovatieproject?`,
      timestamp: new Date(),
    };

    const sessionWithGreeting = {
      ...newSession,
      messages: [initialMessage],
      lastMessageTime: new Date()
    };

    // Initial save
    chatStorage.saveSession(sessionWithGreeting);
    setIsLoading(false); // Ensure loading is false
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hallo! 👋 Ik ben de virtuele assistent van Yannova. Hoe kan ik u helpen met uw bouw- of renovatieproject?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Cleanup functie voor abort controller en timeouts bij unmount
  useEffect(() => {
    return () => {
      // Abort pending fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Clear pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Update local state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Save to storage
    if (sessionId) {
      chatStorage.saveSession({
        id: sessionId,
        startTime: messages[0]?.timestamp || new Date(),
        lastMessageTime: new Date(),
        messages: updatedMessages,
        preview: userMessage.content.substring(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
        status: 'active',
        tags: ['Inquiry']
      });
    }

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // System prompt construction
      const systemPrompt = settingsStorage.getFullSystemPrompt();

      // Build message history
      const historyMessages: any[] = messages
        .filter((msg) => msg.role !== 'assistant' || msg.id !== '1') // Filter out initial greeting logic if needed
        .map((msg) => ({
          role: msg.role as any,
          content: msg.content,
        }));

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: userMessage.content }
      ];

      console.log('Sending message via chatService...');

      // Use the unified chatService
      // Note: chatService returns a string (the content) directly
      const assistantContent = await chatService.sendMessage(apiMessages, abortController.signal);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      // Only update state if request wasn't aborted
      if (!abortController.signal.aborted) {
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        // Save assistant response to storage
        if (sessionId) {
          chatStorage.saveSession({
            id: sessionId,
            startTime: messages[0]?.timestamp || new Date(),
            lastMessageTime: new Date(),
            messages: finalMessages,
            preview: userMessage.content.substring(0, 50) + '...', // Keep preview based on last user input roughly
            status: 'active',
            tags: ['Inquiry']
          });
        }
      }
    } catch (error: any) {
      // Don't handle error if request was aborted (component unmounted)
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Chatbot error:', error);

      // Only update state if request wasn't aborted
      if (!abortController.signal.aborted) {
        // Extract error message for better debugging
        let errorMsg = error.message || 'Onbekende fout';

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, er ging iets mis (${errorMsg}). U kunt ons bereiken via telefoon (+32 412 34 56 78) of email (info@yannova.be).`,
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);

        // Save error response to storage
        if (sessionId) {
          chatStorage.saveSession({
            id: sessionId,
            startTime: messages[0]?.timestamp || new Date(),
            lastMessageTime: new Date(),
            messages: finalMessages,
            preview: userMessage.content.substring(0, 50),
            status: 'active',
            tags: ['Error']
          });
        }
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
      // Clear abort controller reference
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Wat zijn jullie diensten?',
    'Hoe vraag ik een offerte aan?',
    'Wat kost gevelisolatie?',
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-brand-accent hover:bg-orange-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 group"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${isMinimized
            ? 'bottom-6 right-6 w-72 h-14'
            : 'bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh]'
            }`}
        >
          {/* Header */}
          <div className="bg-brand-dark text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              {!isMinimized && (
                <div>
                  <h3 className="font-semibold">{botName}</h3>
                  <p className="text-xs text-gray-300">Online • Antwoordt direct</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? 'Maximaliseren' : 'Minimaliseren'}
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Sluiten"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${message.role === 'user'
                        ? 'bg-brand-accent text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bot size={16} className="text-gray-600" />
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                      <Loader2 size={18} className="animate-spin text-gray-500" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-gray-500 mb-2">Snelle vragen:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Clear previous timeout if it exists
                          if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                          }
                          setInput(q);
                          timeoutRef.current = setTimeout(() => {
                            timeoutRef.current = null;
                            sendMessage();
                          }, 100);
                        }}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Typ uw vraag..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 bg-brand-accent hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-full transition-colors"
                    aria-label="Verstuur"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Powered by GLM AI
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
