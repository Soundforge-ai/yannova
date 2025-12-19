import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  GitBranch,
  Info,
  History,
  RefreshCw,
  Trash2,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { useJules, type JulesSessionHistoryItem } from '@/hooks/useJules';

interface JulesAssistantProps {
  className?: string;
}

const EXAMPLE_PROMPTS = [
  'Voeg unit tests toe voor de Chatbot component',
  'Refactor de AdminDashboard voor betere performance',
  'Voeg error handling toe aan alle API calls',
  'Maak een nieuwe component voor testimonials',
  'Optimaliseer de image loading in de Gevel componenten',
  'Fix memory leaks in React componenten',
];

const JulesAssistant: React.FC<JulesAssistantProps> = ({ className = '' }) => {
  const { getSessionHistory, clearSessionHistory } = useJules();
  const [sessionHistory, setSessionHistory] = useState<JulesSessionHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  useEffect(() => {
    setSessionHistory(getSessionHistory());
  }, []);

  const handleCopyPrompt = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Weet je zeker dat je de sessie geschiedenis wilt wissen?')) {
      clearSessionHistory();
      setSessionHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'FAILED':
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'RUNNING': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Jules AI Assistant</h2>
              <p className="text-sm text-gray-500">AI-powered code generatie</p>
            </div>
          </div>
          {sessionHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-brand-accent hover:bg-gray-50 rounded-lg transition-colors"
            >
              <History size={16} />
              <span>{sessionHistory.length}</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <GitBranch size={14} />
          <span>Soundforge-ai/yannova</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Jules werkt via de web interface</p>
            <p className="text-amber-700">
              Sessies moeten worden aangemaakt op jules.google.com. Kopieer een prompt hieronder en plak deze in Jules.
            </p>
          </div>
        </div>

        {/* Open Jules Button */}
        <a
          href="https://jules.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-brand-accent hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          <span>Open Jules Dashboard</span>
          <ExternalLink size={16} />
        </a>

        {/* Example Prompts */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Klik om te kopiëren:</p>
          <div className="space-y-2">
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyPrompt(prompt)}
                className="w-full text-left text-sm px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-between group"
              >
                <span>{prompt}</span>
                {copiedPrompt === prompt ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-400 group-hover:text-gray-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Session History */}
        {showHistory && sessionHistory.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 text-sm">Recente Sessies</h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={12} />
                Wissen
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sessionHistory.map((item) => (
                <a
                  key={item.id}
                  href={`https://jules.google.com/session/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-brand-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate flex-1">
                      {item.title || 'Geen titel'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ml-2 ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{formatDate(item.timestamp)}</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JulesAssistant;
