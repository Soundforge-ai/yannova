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
  | 'MANUAL';

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
  prompt?: string;
  prUrl?: string;
  branch?: string;
}

export type JulesSessionStatus = 
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

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
  // Vite requires VITE_ prefix for environment variables exposed to the browser
  const apiKey = (import.meta as any).env?.VITE_JULES_API_KEY || 
                 (import.meta as any).env?.JULES_API_KEY ||
                 process.env?.VITE_JULES_API_KEY ||
                 process.env?.JULES_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_JULES_API_KEY is niet geconfigureerd in environment variables. Voeg VITE_JULES_API_KEY toe aan .env.local');
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
      
      // Maak gebruiksvriendelijke error message
      let errorMessage = errorData.message || errorText || `API request failed: ${response.status}`;
      
      // Specifieke messages voor veelvoorkomende errors
      if (response.status === 404) {
        errorMessage = `404 NOT_FOUND: Repository niet gevonden. Zorg dat de repository "Soundforge-ai/yannova" verbonden is met Jules via https://jules.google.com`;
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = `Authenticatie fout (${response.status}): Controleer je API key en repository toegang`;
      } else if (response.status >= 500) {
        errorMessage = `Server fout (${response.status}): Probeer het later opnieuw`;
      }
      
      return {
        success: false,
        error: errorMessage,
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
  // Jules API verwacht snake_case en specifieke structuur
  const apiRequest: Record<string, any> = {
    prompt: request.prompt,
    title: request.title,
  };

  // Voeg source_context toe als aanwezig (snake_case voor API)
  if (request.sourceContext) {
    apiRequest.source_context = {
      source: request.sourceContext.source || 'sources/',
      github_repo_context: request.sourceContext.githubRepoContext || {},
    };
  } else {
    // Jules vereist altijd een source_context
    apiRequest.source_context = {
      source: 'sources/',
      github_repo_context: {},
    };
  }

  return julesApiCall<JulesSession>('/sessions', {
    method: 'POST',
    body: JSON.stringify(apiRequest),
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
/**
 * Detecteert automatisch de GitHub repository informatie
 * Note: In browser context kunnen we niet direct git commands uitvoeren,
 * dus gebruiken we de bekende repository informatie
 */
export async function detectGitHubRepository(): Promise<{
  username: string;
  repository: string;
  branch: string;
}> {
  // In browser context kunnen we niet git commands uitvoeren
  // Gebruik de bekende repository informatie
  // Dit kan later worden uitgebreid met een API call of config file
  return {
    username: 'Soundforge-ai',
    repository: 'yannova',
    branch: 'main',
  };
}

export async function createYannovaJulesSession(
  prompt: string,
  options: {
    automationMode?: JulesAutomationMode;
    title?: string;
    githubUsername?: string;
    repository?: string;
    branch?: string;
    autoDetectRepo?: boolean;
    skipSourceContext?: boolean; // Nieuw: skip repository context als niet verbonden
  } = {}
): Promise<JulesApiResponse<JulesSession>> {
  const {
    automationMode = 'MANUAL',
    title,
    autoDetectRepo = true,
    branch = 'main',
    // Default naar true om 404 errors te voorkomen wanneer repo niet verbonden is
    skipSourceContext = true,
  } = options;

  // Auto-detect repository als niet expliciet opgegeven
  let githubUsername = options.githubUsername;
  let repository = options.repository;

  if (autoDetectRepo && (!githubUsername || !repository)) {
    const detected = await detectGitHubRepository();
    githubUsername = githubUsername || detected.username;
    repository = repository || detected.repository;
  } else {
    // Defaults als niet gedetecteerd kan worden
    githubUsername = githubUsername || 'Soundforge-ai';
    repository = repository || 'yannova';
  }

  return createJulesSession({
    prompt,
    // Skip sourceContext als skipSourceContext is true of als automationMode MANUAL is
    // Dit voorkomt 404 errors wanneer repository niet verbonden is
    sourceContext: skipSourceContext ? undefined : createGitHubContext(githubUsername, repository, branch),
    automationMode,
    title: title || `Yannova: ${prompt.substring(0, 50)}...`,
  });
}

