import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createJulesSession,
  createYannovaJulesSession,
  getJulesSession,
  JulesCreateSessionRequest,
  JulesAutomationMode,
  JulesApiResponse,
  JulesSession,
} from '@/lib/api/jules';

const SESSION_HISTORY_KEY = 'jules_session_history';
const MAX_HISTORY_ITEMS = 50;

export interface JulesSessionHistoryItem extends JulesSession {
  prompt?: string;
  timestamp: number;
}

interface UseJulesReturn {
  createSession: (request: JulesCreateSessionRequest) => Promise<JulesApiResponse<JulesSession>>;
  createQuickSession: (
    prompt: string,
    options?: {
      automationMode?: JulesAutomationMode;
      title?: string;
    }
  ) => Promise<JulesApiResponse<JulesSession>>;
  getSession: (sessionId: string) => Promise<JulesApiResponse<JulesSession>>;
  pollSessionStatus: (sessionId: string, onUpdate?: (session: JulesSession) => void) => () => void;
  getSessionHistory: () => JulesSessionHistoryItem[];
  clearSessionHistory: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Opslaan van sessie in geschiedenis
 */
function saveSessionToHistory(session: JulesSession, prompt?: string): void {
  try {
    const history = getSessionHistory();
    const newItem: JulesSessionHistoryItem = {
      ...session,
      prompt,
      timestamp: Date.now(),
    };
    
    // Voeg toe aan begin van array
    const updatedHistory = [newItem, ...history.filter(item => item.id !== session.id)].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Fout bij opslaan sessie geschiedenis:', error);
  }
}

/**
 * Haal sessie geschiedenis op
 */
function getSessionHistory(): JulesSessionHistoryItem[] {
  try {
    const stored = localStorage.getItem(SESSION_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Fout bij ophalen sessie geschiedenis:', error);
    return [];
  }
}

/**
 * React hook voor het gebruik van Jules API in componenten
 * 
 * @example
 * ```typescript
 * const { createQuickSession, isLoading, error, pollSessionStatus } = useJules();
 * 
 * const handleCreateSession = async () => {
 *   const result = await createQuickSession(
 *     "Voeg een nieuwe component toe voor testimonials",
 *     { automationMode: "AUTO_CREATE_PR" }
 *   );
 *   
 *   if (result.success && result.data) {
 *     // Start polling voor status updates
 *     pollSessionStatus(result.data.id, (session) => {
 *       console.log('Status update:', session.status);
 *     });
 *   }
 * };
 * ```
 */
export function useJules(): UseJulesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const createSession = useCallback(
    async (request: JulesCreateSessionRequest): Promise<JulesApiResponse<JulesSession>> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await createJulesSession(request);
        if (!result.success) {
          setError(result.error || 'Onbekende fout bij het aanmaken van sessie');
        }
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Onbekende fout';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createQuickSession = useCallback(
    async (
      prompt: string,
      options?: {
        automationMode?: JulesAutomationMode;
        title?: string;
      }
    ): Promise<JulesApiResponse<JulesSession>> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await createYannovaJulesSession(prompt, options);
        if (result.success && result.data) {
          // Sla op in geschiedenis
          saveSessionToHistory(result.data, prompt);
        } else {
          setError(result.error || 'Onbekende fout bij het aanmaken van sessie');
        }
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Onbekende fout';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getSession = useCallback(
    async (sessionId: string): Promise<JulesApiResponse<JulesSession>> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getJulesSession(sessionId);
        if (result.success && result.data) {
          // Update geschiedenis
          saveSessionToHistory(result.data);
        } else {
          setError(result.error || 'Onbekende fout bij het ophalen van sessie');
        }
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Onbekende fout';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Poll sessie status periodiek
   * @returns Stop functie om polling te stoppen
   */
  const pollSessionStatus = useCallback(
    (sessionId: string, onUpdate?: (session: JulesSession) => void, intervalMs: number = 5000): (() => void) => {
      // Stop bestaande polling voor deze sessie
      const existingInterval = pollingIntervals.current.get(sessionId);
      if (existingInterval) {
        clearInterval(existingInterval);
      }

      // Start nieuwe polling
      const interval = setInterval(async () => {
        try {
          const result = await getJulesSession(sessionId);
          if (result.success && result.data) {
            saveSessionToHistory(result.data);
            onUpdate?.(result.data);
            
            // Stop polling als sessie is voltooid of gefaald
            if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(result.data.status)) {
              clearInterval(interval);
              pollingIntervals.current.delete(sessionId);
            }
          }
        } catch (error) {
          console.error('Fout bij polling sessie status:', error);
        }
      }, intervalMs);

      pollingIntervals.current.set(sessionId, interval);

      // Return stop functie
      return () => {
        clearInterval(interval);
        pollingIntervals.current.delete(sessionId);
      };
    },
    []
  );

  /**
   * Clear alle polling intervals bij unmount
   */
  useEffect(() => {
    return () => {
      pollingIntervals.current.forEach(interval => clearInterval(interval));
      pollingIntervals.current.clear();
    };
  }, []);

  const clearSessionHistory = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_HISTORY_KEY);
    } catch (error) {
      console.error('Fout bij wissen sessie geschiedenis:', error);
    }
  }, []);

  return {
    createSession,
    createQuickSession,
    getSession,
    pollSessionStatus,
    getSessionHistory,
    clearSessionHistory,
    isLoading,
    error,
  };
}

