import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `Je bent een vriendelijke en behulpzame assistent voor Yannova, een Belgisch bouw- en renovatiebedrijf.

Over Yannova:
- Gespecialiseerd in: ramen en deuren, renovaties, isolatiewerken, gevelwerken en crepi
- Actief in heel België (Vlaanderen en Brussel)
- 15+ jaar ervaring
- Contact: +32 412 34 56 78, info@yannova.be
- Adres: Bouwstraat 123, 1000 Brussel

Diensten:
1. Ramen en Deuren - PVC en aluminium profielen
2. Renovatie - Totaalrenovaties van ruwbouw tot afwerking
3. Isolatiewerken - Dak-, muur- en gevelisolatie
4. Gevelwerken - Gevelbepleistering, gevelbescherming, gevelisolatie, steenstrips, gevelrenovatie
5. Crepi - Moderne gevelafwerking met patronen

Instructies:
- Antwoord altijd in het Nederlands
- Wees vriendelijk en professioneel
- Verwijs klanten naar het contactformulier of telefoonnummer voor offertes
- Houd antwoorden kort en bondig (max 2-3 zinnen tenzij meer detail nodig is)
- Als je iets niet weet over Yannova, zeg dat eerlijk en verwijs naar contact`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build messages array for GLM API (OpenAI-compatible format)
      const apiMessages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages
          .filter((msg) => msg.role !== 'assistant' || msg.id !== '1') // Filter out initial greeting
          .map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
        {
          role: 'user',
          content: userMessage.content,
        },
      ];

      // Get API key from environment
      const apiKey = (import.meta as any).env?.VITE_GLM_API_KEY || '811527f3930042a1bbb640cb781698ed.8vd45senzrMRJmhd';
      
      console.log('Making GLM API call with key:', apiKey.substring(0, 20) + '...'); // Debug: show first 20 chars
      
      // Call GLM API (Naga.ac)  
      const response = await fetch('https://api.naga.ac/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4.5', // GLM-4.5 model
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText, status: response.status };
        }
        console.error('GLM API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || `API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('GLM API response:', data); // Debug log
      
      const assistantContent =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.delta?.content ||
        'Sorry, ik kon geen antwoord genereren. Probeer het opnieuw.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // Extract error message for better debugging
      let errorMsg = error.message || 'Onbekende fout';
      if (errorMsg.includes('authentication') || errorMsg.includes('API key')) {
        errorMsg = 'API authenticatie mislukt. Controleer of de API key geldig is.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, er ging iets mis met de chatbot service (${errorMsg}). U kunt ons bereiken via telefoon (+32 412 34 56 78) of email (info@yannova.be).`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
          className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isMinimized
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
                  <h3 className="font-semibold">Yannova Assistent</h3>
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        message.role === 'user'
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
                          setInput(q);
                          setTimeout(() => sendMessage(), 100);
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
