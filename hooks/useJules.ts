import { useState, useCallback } from 'react';
import {
  createJulesSession,
  createYannovaJulesSession,
  getJulesSession,
  JulesCreateSessionRequest,
  JulesAutomationMode,
  JulesApiResponse,
  JulesSession,
} from '@/lib/api/jules';

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
  isLoading: boolean;
  error: string | null;
}

/**
 * React hook voor het gebruik van Jules API in componenten
 * 
 * @example
 * ```typescript
 * const { createQuickSession, isLoading, error } = useJules();
 * 
 * const handleCreateSession = async () => {
 *   const result = await createQuickSession(
 *     "Voeg een nieuwe component toe voor testimonials",
 *     { automationMode: "AUTO_CREATE_PR" }
 *   );
 *   
 *   if (result.success) {
 *     console.log('Sessie aangemaakt:', result.data);
 *   }
 * };
 * ```
 */
export function useJules(): UseJulesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getSession = useCallback(
    async (sessionId: string): Promise<JulesApiResponse<JulesSession>> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getJulesSession(sessionId);
        if (!result.success) {
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

  return {
    createSession,
    createQuickSession,
    getSession,
    isLoading,
    error,
  };
}

