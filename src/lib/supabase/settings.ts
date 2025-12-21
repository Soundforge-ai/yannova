import { supabase } from './client';
import { AppSettings } from '../settingsStorage';

const DEFAULT_SETTINGS_ID = 'default';

// Converteer database settings naar AppSettings type
function dbSettingsToAppSettings(dbSettings: any): AppSettings {
  return {
    activeProvider: dbSettings.active_provider as AppSettings['activeProvider'],
    providers: dbSettings.providers || {},
    botName: dbSettings.bot_name || 'Yannova Assistent',
    systemPrompt: dbSettings.system_prompt || '',
    knowledgeBase: (dbSettings.knowledge_base || []).map((doc: any) => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate)
    }))
  };
}

// Haal instellingen op
export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('id', DEFAULT_SETTINGS_ID)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return defaults
      return await createDefaultSettings();
    }
    console.error('Error fetching settings:', error);
    throw error;
  }

  return dbSettingsToAppSettings(data);
}

// Maak default instellingen aan
async function createDefaultSettings(): Promise<AppSettings> {
  const defaultSettings: AppSettings = {
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
- Contact: +32 489 96 00 01, info@yannova.be

Instructies:
- Antwoord altijd in het Nederlands
- Wees vriendelijk en professioneel
- Houd antwoorden kort en bondig`,
    knowledgeBase: []
  };

  await saveSettings(defaultSettings);
  return defaultSettings;
}

// Sla instellingen op
export async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      id: DEFAULT_SETTINGS_ID,
      active_provider: settings.activeProvider,
      providers: settings.providers,
      bot_name: settings.botName,
      system_prompt: settings.systemPrompt,
      knowledge_base: settings.knowledgeBase.map(doc => ({
        ...doc,
        uploadDate: doc.uploadDate.toISOString()
      }))
    }, {
      onConflict: 'id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving settings:', error);
    throw error;
  }

  return dbSettingsToAppSettings(data);
}

