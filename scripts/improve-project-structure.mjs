// Script to create Jules session for project structure improvements
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load API key from .env.local
let JULES_API_KEY;
try {
  const envPath = join(__dirname, '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_JULES_API_KEY=(.+)/);
  if (match) {
    JULES_API_KEY = match[1].trim();
  }
} catch (e) {
  // .env.local not found or can't read
}

// Fallback to environment variable or prompt user
if (!JULES_API_KEY) {
  JULES_API_KEY = process.env.VITE_JULES_API_KEY || process.env.JULES_API_KEY;
}

if (!JULES_API_KEY) {
  console.error('❌ VITE_JULES_API_KEY niet gevonden!');
  console.error('Voeg VITE_JULES_API_KEY toe aan .env.local of als environment variable');
  process.exit(1);
}

const BASE_URL = 'https://jules.googleapis.com/v1alpha';

const prompt = `Verbeter de projectstructuur van het Yannova React project volgens best practices.

HUIDIGE PROBLEMEN:
1. Inconsistente bestandsnamen: Mix van Engels (Home.tsx) en Nederlands (OverOns.tsx, Aanpak.tsx) in pages/
2. Root level bestanden: Scripts (download_images.sh, generate_image_gemini.py) en config bestanden zouden beter georganiseerd moeten worden
3. Duplicatie: Zowel puck.config.ts als puck.config.tsx bestaan in pages/dashboard/editor/
4. Missing directories: Geen utils/, config/, scripts/, docs/ directories
5. Type definitions: types.ts in root zou in types/ directory moeten met meerdere bestanden
6. Test structuur: Alleen test/setup.ts, geen test bestanden bij componenten
7. Documentation: AGENTS.md, README.md, PUCK_SETUP.md verspreid in root, zouden in docs/ kunnen

GEWENSTE STRUCTUUR:
\`\`\`
yannova/
├── src/                          # Nieuwe src directory voor alle source code
│   ├── components/               # React componenten
│   │   ├── common/              # Algemene herbruikbare componenten
│   │   ├── gevel/               # Gevel-specifieke componenten (behouden)
│   │   └── ...
│   ├── pages/                    # Route-specifieke pagina's
│   ├── hooks/                    # Custom React hooks
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Libraries en services
│   │   ├── api/
│   │   ├── sanity/
│   │   └── supabase/
│   ├── types/                    # TypeScript type definities (nieuwe directory)
│   │   ├── index.ts
│   │   ├── components.ts
│   │   └── api.ts
│   ├── utils/                    # Utility functies (nieuwe directory)
│   ├── constants/                # Constants (nieuwe directory, verplaats constants.tsx)
│   └── i18n/                     # Vertalingen
├── scripts/                      # Build scripts en utilities (nieuwe directory)
│   ├── download_images.sh
│   └── generate_image_gemini.py
├── config/                       # Configuratie bestanden (nieuwe directory)
│   └── vite.config.ts (verplaats)
├── docs/                         # Documentatie (nieuwe directory)
│   ├── AGENTS.md
│   ├── README.md
│   └── PUCK_SETUP.md
├── test/                         # Test setup (behouden)
├── public/                       # Statische assets
└── schemas/                      # Sanity schemas (behouden)
\`\`\`

ACTIES:
1. Maak nieuwe directories: src/, src/types/, src/utils/, src/constants/, scripts/, config/, docs/
2. Verplaats bestanden naar juiste locaties:
   - components/ → src/components/
   - pages/ → src/pages/
   - hooks/ → src/hooks/
   - contexts/ → src/contexts/
   - lib/ → src/lib/
   - i18n/ → src/i18n/
   - types.ts → src/types/index.ts (split in meerdere bestanden indien nodig)
   - constants.tsx → src/constants/index.tsx
   - download_images.sh → scripts/
   - generate_image_gemini.py → scripts/
   - vite.config.ts → config/
   - AGENTS.md → docs/
   - PUCK_SETUP.md → docs/
3. Los duplicatie op: Verwijder puck.config.ts of puck.config.tsx (behoud de meest recente/complete versie)
4. Update alle import paths in alle bestanden:
   - Update @/ paths in tsconfig.json en vite.config.ts
   - Update alle relative imports naar nieuwe locaties
   - Update App.tsx lazy imports
5. Standaardiseer bestandsnamen (optioneel, maar consistent):
   - Overweeg om alle page bestanden Engels te maken OF alle Nederlands (kies één taal)
   - Of behoud huidige mix maar documenteer de conventie
6. Update .gitignore indien nodig voor nieuwe structuur
7. Update package.json scripts indien nodig

BELANGRIJK:
- Behoud alle functionaliteit - alleen reorganisatie
- Test dat alle imports correct werken na verplaatsing
- Zorg dat build nog steeds werkt
- Update README.md met nieuwe structuur uitleg

Gebruik automationMode: AUTO_CREATE_PR om automatisch een pull request aan te maken met alle wijzigingen.`;

async function createJulesSession() {
  try {
    const requestBody = {
      prompt: prompt,
      sourceContext: {
        source: 'sources/github/Soundforge-ai/yannova',
        githubRepoContext: {
          startingBranch: 'main'
        }
      },
      automationMode: 'AUTO_CREATE_PR',
      title: 'Verbeter projectstructuur volgens best practices'
    };

    console.log('🚀 Jules sessie aanmaken voor projectstructuur verbeteringen...\n');

    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': JULES_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Jules API error:', response.status, errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Jules sessie succesvol aangemaakt!\n');
    console.log('📋 Session Details:');
    console.log('   Session ID:', data.id);
    console.log('   Status:', data.status);
    console.log('   Title:', data.title);
    console.log('\n🔗 Volg de voortgang op: https://jules.google.com');
    console.log('   Of bekijk de pull request op GitHub zodra deze is aangemaakt.\n');
    
    return data;
  } catch (error) {
    console.error('❌ Fout bij aanmaken Jules sessie:', error.message);
    process.exit(1);
  }
}

createJulesSession();

