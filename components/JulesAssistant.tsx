import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileCode,
  GitBranch,
  Settings,
  Info,
} from 'lucide-react';
import { useJules } from '@/hooks/useJules';
import type { JulesAutomationMode } from '@/lib/api/jules';

interface JulesAssistantProps {
  className?: string;
}

const AUTOMATION_MODES: { value: JulesAutomationMode; label: string; description: string }[] = [
  {
    value: 'MANUAL',
    label: 'Handmatig',
    description: 'Vereist handmatige review en goedkeuring',
  },
  {
    value: 'AUTO_COMMIT',
    label: 'Auto Commit',
    description: 'Commit automatisch naar de branch',
  },
  {
    value: 'AUTO_CREATE_PR',
    label: 'Auto Pull Request',
    description: 'Maakt automatisch een pull request aan',
  },
];

const EXAMPLE_PROMPTS = [
  'Voeg unit tests toe voor de Chatbot component',
  'Refactor de AdminDashboard voor betere performance',
  'Voeg error handling toe aan alle API calls',
  'Maak een nieuwe component voor testimonials',
  'Optimaliseer de image loading in de Gevel componenten',
];

const JulesAssistant: React.FC<JulesAssistantProps> = ({ className = '' }) => {
  const { createQuickSession, isLoading, error } = useJules();
  const [prompt, setPrompt] = useState('');
  const [automationMode, setAutomationMode] = useState<JulesAutomationMode>('MANUAL');
  const [sessionTitle, setSessionTitle] = useState('');
  const [lastResult, setLastResult] = useState<{ success: boolean; sessionId?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setLastResult(null);

    const result = await createQuickSession(prompt.trim(), {
      automationMode,
      title: sessionTitle.trim() || undefined,
    });

    if (result.success && result.data) {
      setLastResult({
        success: true,
        sessionId: result.data.id,
      });
      // Reset form na succesvolle submit
      setPrompt('');
      setSessionTitle('');
    } else {
      setLastResult({
        success: false,
        error: result.error || 'Onbekende fout',
      });
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-dark">Jules AI Assistant</h2>
            <p className="text-sm text-gray-500">AI-powered code generatie en automatisering</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hoe werkt het?</p>
            <p className="text-blue-700">
              Beschrijf wat je wilt dat Jules doet, en Jules zal automatisch code genereren, tests schrijven, of je project verbeteren. 
              Je kunt kiezen voor handmatige review of automatische commit/PR.
            </p>
          </div>
        </div>

        {/* Automation Mode Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Settings className="inline-block mr-2" size={16} />
            Automatiserings Modus
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {AUTOMATION_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setAutomationMode(mode.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  automationMode === mode.value
                    ? 'border-brand-accent bg-brand-accent/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {automationMode === mode.value && (
                    <CheckCircle className="text-brand-accent" size={16} />
                  )}
                  <span className="font-medium text-gray-900">{mode.label}</span>
                </div>
                <p className="text-xs text-gray-500">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title (Optional) */}
          <div>
            <label htmlFor="session-title" className="block text-sm font-medium text-gray-700 mb-2">
              Titel (optioneel)
            </label>
            <input
              id="session-title"
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Bijv: Testimonials Component Toevoegen"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
              disabled={isLoading}
            />
          </div>

          {/* Prompt Input */}
          <div>
            <label htmlFor="jules-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Wat wil je dat Jules doet? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="jules-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschrijf duidelijk wat je wilt dat Jules doet, bijvoorbeeld: 'Voeg unit tests toe voor de Chatbot component' of 'Refactor de AdminDashboard voor betere performance'"
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent resize-none"
              disabled={isLoading}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Wees zo specifiek mogelijk voor betere resultaten
            </p>
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Voorbeeld prompts:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full bg-brand-accent hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Jules sessie wordt aangemaakt...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Start Jules Sessie</span>
              </>
            )}
          </button>
        </form>

        {/* Error Display */}
        {(error || (lastResult && !lastResult.success)) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <p className="font-medium text-red-800 mb-1">Fout</p>
              <p className="text-sm text-red-700">
                {error || lastResult?.error || 'Er ging iets mis bij het aanmaken van de sessie'}
              </p>
            </div>
          </div>
        )}

        {/* Success Display */}
        {lastResult && lastResult.success && lastResult.sessionId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="font-medium text-green-800 mb-1">Sessie succesvol aangemaakt!</p>
                <p className="text-sm text-green-700">
                  Jules heeft je opdracht ontvangen en gaat aan de slag. Je kunt de voortgang volgen via de Jules website.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200 flex items-center gap-2">
              <FileCode className="text-green-600" size={16} />
              <span className="text-xs font-mono text-green-700 bg-green-100 px-2 py-1 rounded">
                Session ID: {lastResult.sessionId}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="https://jules.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
              >
                Open Jules Dashboard
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>Tip:</strong> Voor de beste resultaten, beschrijf je opdracht duidelijk en specifiek. 
            Jules werkt het beste met concrete taken zoals "voeg een component toe" of "refactor deze functie".
          </p>
        </div>
      </div>
    </div>
  );
};

export default JulesAssistant;

