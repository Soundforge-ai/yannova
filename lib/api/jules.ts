/**
 * Jules API Service
 * 
 * Integratie met Google's Jules AI voor code generatie en project automatisering.
 * Zie: https://jules.google/docs/api/reference/
 */

// Types voor Jules API
export interface JulesSourceContext {
  source: string; // e.g., "sources/github/username/repository"
  githubRepoContext?: {
    startingBranch?: string;
  };
}

export type JulesAutomationMode = 
  | 'AUTO_CREATE_PR'
  | 'MANUAL'
  | 'AUTO_COMMIT';

export interface JulesCreateSessionRequest {
  prompt: string;
  sourceContext?: JulesSourceContext;
  automationMode?: JulesAutomationMode;
  title?: string;
}

export interface JulesSession {
  id: string;
  status: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JulesApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Haalt de Jules API key op uit environment variables
 */
function getJulesApiKey(): string {
  const apiKey = (import.meta as any).env?.JULES_API_KEY || 
                 process.env?.JULES_API_KEY;
  
  if (!apiKey) {
    throw new Error('JULES_API_KEY is niet geconfigureerd in environment variables');
  }
  
  return apiKey;
}

/**
 * Basis functie voor Jules API calls met error handling
 */
async function julesApiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<JulesApiResponse<T>> {
  try {
    const apiKey = getJulesApiKey();
    const baseUrl = 'https://jules.googleapis.com/v1alpha';
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('Jules API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      
      return {
        success: false,
        error: errorData.message || errorText || `API request failed: ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (error: any) {
    console.error('Jules API call error:', error);
    return {
      success: false,
      error: error.message || 'Onbekende fout bij Jules API call',
    };
  }
}

/**
 * Creëert een nieuwe Jules sessie voor code generatie/automatisering
 * 
 * @param request - De sessie request configuratie
 * @returns Promise met de sessie response
 * 
 * @example
 * ```typescript
 * const result = await createJulesSession({
 *   prompt: "Voeg een nieuwe component toe voor testimonials",
 *   sourceContext: {
 *     source: "sources/github/username/yannova",
 *     githubRepoContext: {
 *       startingBranch: "main"
 *     }
 *   },
 *   automationMode: "AUTO_CREATE_PR",
 *   title: "Nieuwe Testimonials Component"
 * });
 * 
 * if (result.success) {
 *   console.log('Sessie aangemaakt:', result.data);
 * }
 * ```
 */
export async function createJulesSession(
  request: JulesCreateSessionRequest
): Promise<JulesApiResponse<JulesSession>> {
  return julesApiCall<JulesSession>('/sessions', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Haalt de status van een Jules sessie op
 * 
 * @param sessionId - De ID van de sessie
 * @returns Promise met de sessie status
 */
export async function getJulesSession(
  sessionId: string
): Promise<JulesApiResponse<JulesSession>> {
  return julesApiCall<JulesSession>(`/sessions/${sessionId}`);
}

/**
 * Helper functie om een GitHub repository context te maken
 * 
 * @param username - GitHub gebruikersnaam
 * @param repository - Repository naam
 * @param branch - Branch naam (optioneel, default: "main")
 * @returns SourceContext object
 */
export function createGitHubContext(
  username: string,
  repository: string,
  branch: string = 'main'
): JulesSourceContext {
  return {
    source: `sources/github/${username}/${repository}`,
    githubRepoContext: {
      startingBranch: branch,
    },
  };
}

/**
 * Helper functie om een snel een sessie aan te maken voor dit project
 * 
 * @param prompt - De prompt/opdracht voor Jules
 * @param options - Optionele configuratie
 * @returns Promise met de sessie response
 * 
 * @example
 * ```typescript
 * // Quick sessie met default GitHub context
 * const result = await createYannovaJulesSession(
 *   "Voeg unit tests toe voor de Chatbot component",
 *   { automationMode: "AUTO_CREATE_PR" }
 * );
 * ```
 */
export async function createYannovaJulesSession(
  prompt: string,
  options: {
    automationMode?: JulesAutomationMode;
    title?: string;
    githubUsername?: string;
    repository?: string;
    branch?: string;
  } = {}
): Promise<JulesApiResponse<JulesSession>> {
  const {
    automationMode = 'MANUAL',
    title,
    githubUsername = 'innovarslabo', // Default, kan worden aangepast
    repository = 'yannova',
    branch = 'main',
  } = options;

  return createJulesSession({
    prompt,
    sourceContext: createGitHubContext(githubUsername, repository, branch),
    automationMode,
    title: title || `Yannova: ${prompt.substring(0, 50)}...`,
  });
}

