import { settingsStorage, AIProvider, AppSettings } from './settingsStorage';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const chatService = {
    sendMessage: async (messages: ChatMessage[], signal?: AbortSignal) => {
        const settings = settingsStorage.getSettings();
        const provider = settings.activeProvider;
        const config = settings.providers[provider];

        if (!config.apiKey && provider !== 'naga') {
            // Fallback for naga if hardcoded key exists in env
            // But for others, throw error
            throw new Error(`Geen API key ingesteld voor ${provider}`);
        }

        switch (provider) {
            case 'naga':
            case 'siliconflow':
            case 'gemini':
            case 'custom':
                return chatService.sendOpenAICompatible(messages, config, settings.activeProvider, signal);
            case 'huggingface':
                return chatService.sendHuggingFace(messages, config, signal);
            case 'cloudflare':
                return chatService.sendCloudflare(messages, config, signal);
            default:
                throw new Error('Onbekende provider');
        }
    },

    sendOpenAICompatible: async (messages: ChatMessage[], config: any, provider: string, signal?: AbortSignal) => {
        // Fallback key for Naga/Demo
        let apiKey = config.apiKey;
        if (provider === 'naga' && !apiKey) {
            apiKey = (import.meta as any).env?.VITE_GLM_API_KEY || '811527f3930042a1bbb640cb781698ed.8vd45senzrMRJmhd';
        }

        const url = provider === 'gemini'
            ? `${config.baseUrl}/chat/completions`
            : `${config.baseUrl}/chat/completions`;

        // Normalize base URL if it already contains chat/completions or not
        let finalUrl = config.baseUrl;
        if (!finalUrl.endsWith('/chat/completions')) {
            finalUrl = finalUrl.replace(/\/+$/, '') + '/chat/completions';
        }

        const body: any = {
            model: config.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        };

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
            signal
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`API error (${provider}): ${response.status} - ${txt}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Geen antwoord ontvangen.';
    },

    sendHuggingFace: async (messages: ChatMessage[], config: any, signal?: AbortSignal) => {
        // HF Inference API usually takes a single string input for casual models, 
        // OR a list of messages for "conversational" pipeline models.
        // Let's try the conversational format for standard models like Llama-3-Instruct

        // However, many HF endpoints just want inputs.
        // We will construct a prompt.
        const prompt = messages.map(m =>
            m.role === 'user' ? `User: ${m.content}` :
                m.role === 'assistant' ? `Assistant: ${m.content}` :
                    `System: ${m.content}`
        ).join('\n') + '\nAssistant:';

        const response = await fetch(`${config.baseUrl}/${config.model}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false
                }
            }),
            signal
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`HF API error: ${response.status} - ${txt}`);
        }

        const data = await response.json();
        // HF returns array [{ generated_text: "..." }]
        if (Array.isArray(data)) {
            return data[0].generated_text || 'Geen tekst gegenereerd.';
        }
        return data.generated_text || JSON.stringify(data);
    },

    sendCloudflare: async (messages: ChatMessage[], config: any, signal?: AbortSignal) => {
        if (!config.accountId) throw new Error('Cloudflare Account ID ontbreekt');

        const url = `${config.baseUrl}/${config.accountId}/ai/run/${config.model}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                messages: messages
            }),
            signal
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(`Cloudflare API error: ${response.status} - ${txt}`);
        }

        const data = await response.json();
        return data.result?.response || 'Geen antwoord ontvangen.';
    }
};
