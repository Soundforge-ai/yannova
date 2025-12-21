import { Message } from '../components/Chatbot';
import { settingsStorage } from './settingsStorage';
import { chatService } from './chatService';

export const generateSEO = async (pageContent: string): Promise<{ title: string; description: string; keywords: string }> => {
    const prompt = `
    Analyseer de volgende webpagina content en genereer SEO metadata.
    Content: "${pageContent.substring(0, 1000)}..."
    
    Geef het resultaat in JSON formaat:
    {
      "title": "Pakkende titel (max 60 tekens)",
      "description": "Wervende meta beschrijving (max 160 tekens)",
      "keywords": "5 relevante zoekwoorden gescheiden door komma's"
    }
  `;

    try {
        const response = await chatService.sendMessage([
            { role: 'system', content: 'Je bent een SEO expert.' },
            { role: 'user', content: prompt }
        ]);

        // Attempt to extract JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Geen geldig JSON gevonden');
    } catch (e) {
        console.error('SEO Gen Error', e);
        return { title: '', description: '', keywords: '' };
    }
};

export const generateAdCopy = async (topic: string): Promise<{ headline: string; body: string; cta: string }> => {
    const prompt = `
      Schrijf een advertentietekst voor: "${topic}".
      Doelgroep: Huiseigenaren in België.
      Tone of voice: Professioneel maar overtuigend.
      
      Geef JSON resultaat:
      {
        "headline": "Korte kop",
        "body": "Wervende tekst (2-3 zinnen)",
        "cta": "Call to Action"
      }
    `;

    try {
        const response = await chatService.sendMessage([
            { role: 'system', content: 'Je bent een ervaren copywriter.' },
            { role: 'user', content: prompt }
        ]);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { headline: 'Fout bij genereren', body: response, cta: 'Probeer opnieuw' };
    } catch (e) {
        return { headline: 'Error', body: '', cta: '' };
    }
};

export const analyzeConversation = async (messages: Message[]): Promise<string> => {
    if (messages.length === 0) return 'Geen berichten om te analyseren.';

    const conversationText = messages
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

    const prompt = `
    Je bent een AI-analist voor Yannova (een bouw- en renovatiebedrijf).
    Analyseer het volgende chatgesprek tussen een potentiële klant (USER) en de assistent.
    
    Geef een samenvatting in het Nederlands met de volgende punten:
    1. **Samenvatting**: Kort overzicht van waar het gesprek over ging.
    2. **Klantbehoefte**: Waar is de klant specifiek naar op zoek? (Bv. gevelisolatie, ramen, etc.)
    3. **Sentiment**: Is de klant positief, twijfelend, of gefrustreerd?
    4. **Actiepunten**: Moet er een offerte worden gemaakt? Moet er contact worden opgenomen?
    5. **Lead Kwalificatie**: Schat in hoe "warm" deze lead is (Laag/Midden/Hoog).

    Gesprek:
    ${conversationText}
  `;

    try {
        const settings = settingsStorage.getSettings();
        const activeProvider = settings.activeProvider;
        const apiKey = settings.providers[activeProvider]?.apiKey || (import.meta as any).env?.VITE_GLM_API_KEY || '811527f3930042a1bbb640cb781698ed.8vd45senzrMRJmhd';

        // If no key is set anywhere, we can't analyze
        if (!apiKey && activeProvider === 'naga') { /* allow fallback */ }
        else if (!apiKey) return 'Kan niet analyseren: Geen API key ingesteld.';

        const response = await fetch('https://api.naga.ac/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'glm-4.5',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3, // Lower temperature for more analytical/consistent output
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Kon geen analyse genereren.';

    } catch (error) {
        console.error('AI Analysis failed:', error);

        return 'Fout bij het analyseren van het gesprek. Controleer de API connectie.';
    }
};

export const generate3DModel = async (prompt: string, imageBase64?: string): Promise<{ success: boolean; model?: string; error?: string }> => {
    try {
        const settings = await settingsStorage.getSettings();
        const apiUrl = settings.threeDApiUrl;

        if (!apiUrl) {
            return { success: false, error: 'Geen 3D API URL ingesteld. Start de Colab notebook en voer de URL in bij instellingen.' };
        }

        // Ensure URL doesn't end with slash if we append /generate, or just handle it
        const endpoint = apiUrl.endsWith('/') ? `${apiUrl}generate` : `${apiUrl}/generate`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ prompt, image: imageBase64 })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error: any) {
        console.error('3D Generation failed:', error);
        return { success: false, error: error.message || 'Fout bij genereren van 3D model.' };
    }
};
