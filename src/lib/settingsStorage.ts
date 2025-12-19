
export interface KnowledgeDocument {
    id: string;
    name: string;
    content: string;
    type: string;
    uploadDate: Date;
}

export type AIProvider = 'naga' | 'huggingface' | 'cloudflare' | 'gemini' | 'siliconflow' | 'custom';

export interface ProviderConfig {
    apiKey: string;
    model: string;
    baseUrl?: string;
    accountId?: string; // For Cloudflare
}

export interface AppSettings {
    activeProvider: AIProvider;
    providers: Record<AIProvider, ProviderConfig>;
    botName: string;
    systemPrompt: string;
    knowledgeBase: KnowledgeDocument[];
}

const SETTINGS_KEY = 'yannova_app_settings';

export const defaultSettings: AppSettings = {
    activeProvider: 'naga',
    providers: {
        naga: {
            apiKey: '',
            model: 'glm-4.5',
            baseUrl: 'https://api.naga.ac/v1'
        },
        huggingface: {
            apiKey: '',
            model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            baseUrl: 'https://api-inference.huggingface.co/models'
        },
        cloudflare: {
            apiKey: '',
            accountId: '',
            model: '@cf/meta/llama-3-8b-instruct',
            baseUrl: 'https://api.cloudflare.com/client/v4/accounts'
        },
        gemini: {
            apiKey: '',
            model: 'gemini-1.5-flash',
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai'
        },
        siliconflow: {
            apiKey: '',
            model: 'nex-agi/DeepSeek-V3.1-Nex-N1',
            baseUrl: 'https://api.siliconflow.com/v1'
        },
        custom: {
            apiKey: '',
            model: '',
            baseUrl: ''
        }
    },
    botName: 'Yannova Assistent',
    systemPrompt: `Je bent een vriendelijke en behulpzame assistent voor Yannova, een Belgisch bouw- en renovatiebedrijf.

Over Yannova:
- Gespecialiseerd in: ramen en deuren, renovaties, isolatiewerken, gevelwerken en crepi
- Contact: +32 412 34 56 78, info@yannova.be

Instructies:
- Antwoord altijd in het Nederlands
- Wees vriendelijk en professioneel
- Houd antwoorden kort en bondig`,
    knowledgeBase: []
};

// Helper for deep merging defaults
const mergeDefaults = (saved: any): AppSettings => {
    // If old format (no providers object), migrate
    const base = { ...defaultSettings };

    // Check if it's the old format with top-level apiKey
    if (saved.apiKey && !saved.providers) {
        base.providers.naga.apiKey = saved.apiKey;
    }

    if (saved.botName) base.botName = saved.botName;
    if (saved.systemPrompt) base.systemPrompt = saved.systemPrompt;
    if (saved.knowledgeBase) base.knowledgeBase = saved.knowledgeBase.map((d: any) => ({
        ...d,
        uploadDate: new Date(d.uploadDate)
    }));
    if (saved.activeProvider) base.activeProvider = saved.activeProvider;

    // Merge providers
    if (saved.providers) {
        (Object.keys(defaultSettings.providers) as AIProvider[]).forEach(key => {
            if (saved.providers[key]) {
                base.providers[key] = {
                    ...defaultSettings.providers[key],
                    ...saved.providers[key]
                };
            }
        });
    }

    return base;
};

export const settingsStorage = {
    getSettings: (): AppSettings => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (!stored) return defaultSettings;

            const parsed = JSON.parse(stored);
            return mergeDefaults(parsed);
        } catch (e) {
            console.error('Error reading settings', e);
            return defaultSettings;
        }
    },

    saveSettings: (settings: AppSettings) => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            window.dispatchEvent(new Event('settings-updated'));
        } catch (e) {
            console.error('Error saving settings', e);
        }
    },

    getFullSystemPrompt: (): string => {
        const settings = settingsStorage.getSettings();
        let prompt = settings.systemPrompt;

        if (settings.knowledgeBase.length > 0) {
            prompt += '\n\nExtra Kennisbasis (gebruik deze informatie om vragen te beantwoorden):\n\n';
            settings.knowledgeBase.forEach(doc => {
                prompt += `--- Bestand: ${doc.name} ---\n${doc.content}\n\n`;
            });
        }

        prompt += `\n\nJouw naam is ${settings.botName}.`;

        return prompt;
    }
};
