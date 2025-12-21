import { streamText, generateText } from 'ai';
import { getModel, ModelId, modelInfo, getAvailableModels } from './models';
import { getRelevantContext, vectorStore } from './embeddings';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  model?: ModelId;
  useRAG?: boolean;
  ragTopK?: number;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_SYSTEM_PROMPT = `Je bent een behulpzame AI-assistent. Beantwoord vragen accuraat en beknopt.`;

// Streaming chat met optionele RAG
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
) {
  const {
    model: modelId = 'gemini-2.5-flash-lite',
    useRAG = false,
    ragTopK = 3,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  let system = systemPrompt;

  // RAG: voeg relevante context toe
  if (useRAG && messages.length > 0) {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      const context = await getRelevantContext(lastUserMessage.content, ragTopK);
      if (context) {
        system = `${systemPrompt}\n\n--- RELEVANTE CONTEXT ---\n${context}\n--- EINDE CONTEXT ---\n\nGebruik bovenstaande context om vragen te beantwoorden als relevant.`;
      }
    }
  }

  const result = streamText({
    model: getModel(modelId),
    system,
    messages,
    temperature,
    maxTokens,
  });

  return result;
}

// Niet-streaming versie
export async function generate(
  prompt: string,
  options: ChatOptions = {}
) {
  const {
    model: modelId = 'gemini-2.5-flash-lite',
    useRAG = false,
    ragTopK = 3,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  let system = systemPrompt;

  if (useRAG) {
    const context = await getRelevantContext(prompt, ragTopK);
    if (context) {
      system = `${systemPrompt}\n\n--- RELEVANTE CONTEXT ---\n${context}\n--- EINDE CONTEXT ---\n\nGebruik bovenstaande context om vragen te beantwoorden als relevant.`;
    }
  }

  const result = await generateText({
    model: getModel(modelId),
    system,
    prompt,
    temperature,
    maxTokens,
  });

  return result;
}

// Export alles
export { models, modelInfo, getAvailableModels, ModelId } from './models';
export { vectorStore, getRelevantContext } from './embeddings';
