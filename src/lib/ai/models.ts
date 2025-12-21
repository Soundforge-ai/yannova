import { google } from '@ai-sdk/google';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// SiliconFlow provider (OpenAI-compatible, classic API)
const siliconflow = createOpenAI({
  baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.com/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
  compatibility: 'compatible',
});

// Beschikbare modellen configuratie
export const models = {
  // Google Gemini
  'gemini-2.5-flash-lite': () => google('gemini-2.5-flash-lite'),
  'gemini-2.0-flash': () => google('gemini-2.0-flash'),
  'gemini-1.5-flash': () => google('gemini-1.5-flash'),
  
  // OpenAI
  'gpt-4o': () => openai('gpt-4o'),
  'gpt-4o-mini': () => openai('gpt-4o-mini'),
  'gpt-4-turbo': () => openai('gpt-4-turbo'),
  
  // Anthropic Claude
  'claude-3-5-sonnet': () => anthropic('claude-3-5-sonnet-20241022'),
  'claude-3-5-haiku': () => anthropic('claude-3-5-haiku-20241022'),
  'claude-3-opus': () => anthropic('claude-3-opus-20240229'),
  
  // SiliconFlow / DeepSeek
  'deepseek-v3-nex': () => siliconflow.chat('nex-agi/DeepSeek-V3.1-Nex-N1'),
  'deepseek-v3': () => siliconflow.chat('deepseek-ai/DeepSeek-V3'),
  'deepseek-r1': () => siliconflow.chat('deepseek-ai/DeepSeek-R1'),
  'qwen-2.5-72b': () => siliconflow.chat('Qwen/Qwen2.5-72B-Instruct'),
} as const;

export type ModelId = keyof typeof models;

// Model metadata voor UI
export const modelInfo: Record<ModelId, { name: string; provider: string; description: string; speed: 'fast' | 'medium' | 'slow'; cost: 'low' | 'medium' | 'high' }> = {
  'gemini-2.5-flash-lite': { name: 'Gemini 2.5 Flash Lite', provider: 'Google', description: 'Snelste, goedkoopste', speed: 'fast', cost: 'low' },
  'gemini-2.0-flash': { name: 'Gemini 2.0 Flash', provider: 'Google', description: 'Snel en capabel', speed: 'fast', cost: 'low' },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', provider: 'Google', description: 'Snel, lange context', speed: 'fast', cost: 'low' },
  'gpt-4o': { name: 'GPT-4o', provider: 'OpenAI', description: 'Multimodaal, snel', speed: 'fast', cost: 'medium' },
  'gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'OpenAI', description: 'Compact, efficiënt', speed: 'fast', cost: 'low' },
  'gpt-4-turbo': { name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Krachtig, vision', speed: 'medium', cost: 'high' },
  'claude-3-5-sonnet': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Beste balans', speed: 'fast', cost: 'medium' },
  'claude-3-5-haiku': { name: 'Claude 3.5 Haiku', provider: 'Anthropic', description: 'Snelste Claude', speed: 'fast', cost: 'low' },
  'claude-3-opus': { name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Meest capabel', speed: 'slow', cost: 'high' },
  'deepseek-v3-nex': { name: 'DeepSeek V3.1 Nex-N1', provider: 'SiliconFlow', description: 'Reasoning model', speed: 'medium', cost: 'low' },
  'deepseek-v3': { name: 'DeepSeek V3', provider: 'SiliconFlow', description: 'Krachtig, goedkoop', speed: 'fast', cost: 'low' },
  'deepseek-r1': { name: 'DeepSeek R1', provider: 'SiliconFlow', description: 'Reasoning specialist', speed: 'slow', cost: 'low' },
  'qwen-2.5-72b': { name: 'Qwen 2.5 72B', provider: 'SiliconFlow', description: 'Groot, capabel', speed: 'medium', cost: 'low' },
};

// Helper om model te selecteren
export function getModel(modelId: ModelId) {
  const modelFn = models[modelId];
  if (!modelFn) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  return modelFn();
}

// Beschikbare providers checken op basis van env vars
export function getAvailableProviders() {
  return {
    google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    siliconflow: !!process.env.SILICONFLOW_API_KEY,
  };
}

export function getAvailableModels(): ModelId[] {
  const providers = getAvailableProviders();
  return (Object.keys(models) as ModelId[]).filter(modelId => {
    const info = modelInfo[modelId];
    if (info.provider === 'Google') return providers.google;
    if (info.provider === 'OpenAI') return providers.openai;
    if (info.provider === 'Anthropic') return providers.anthropic;
    if (info.provider === 'SiliconFlow') return providers.siliconflow;
    return false;
  });
}
