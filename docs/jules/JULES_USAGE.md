# Jules AI Integration - Gebruiksaanwijzing

## Overzicht
Jules AI is volledig geïntegreerd in het Yannova project en beschikbaar op `/jules`. Deze integration maakt het mogelijk om AI-powered code generatie en project automatisering te gebruiken.

## Wat is geïmplementeerd?

### ✅ Componenten & Bestanden
- **API Service**: `lib/api/jules.ts` - Volledige Jules API integration
- **React Hook**: `hooks/useJules.ts` - State management en API calls
- **UI Component**: `components/JulesAssistant.tsx` - Complete interface
- **Page**: `pages/JulesAssistant.tsx` - Router integration
- **Environment**: `.env` met `JULES_API_KEY` configuratie
- **Vite Config**: `vite.config.ts` met environment variable exposure

### ✅ Features
- **Sessie Aanmaken**: Maak Jules sessies met custom prompts
- **Automatisering Modus**: Kies tussen 'Handmatig' of 'Auto Pull Request'
- **Status Polling**: Real-time updates van sessie status
- **Geschiedenis**: Sessie geschiedenis wordt opgeslagen in localStorage
- **Error Handling**: Complete error handling en user feedback
- **Voorbeeld Prompts**: Vooraf gedefinieerde voorbeelden voor snel gebruik

## Hoe te gebruiken?

### 1. Toegang tot Jules Assistant
Ga naar `http://localhost:3004/jules` in je browser (development) of de deployed URL.

### 2. Automatiseringsmodus kiezen
- **Handmatig**: Vereist handmatige review voordat wijzigingen worden toegepast
- **Auto Pull Request**: Maakt automatisch een pull request aan met de wijzigingen

### 3. Prompt opstellen
Wees specifiek in je prompt voor betere resultaten:
```
Goed: "Voeg unit tests toe voor de Chatbot component"
Slecht: "Fix de bugs"
```

### 4. Sessie starten
Klik op "Start Jules Sessie" en volg de voortgang:
- **Status**: PENDING → RUNNING → COMPLETED/FAILED
- **Session ID**: Unieke identifier voor tracking
- **Pull Request**: Link naar automatisch aangemaakte PR (indien Auto modus)

### 5. Resultaten bekijken
- **Jules Dashboard**: Directe link naar de Jules web interface
- **Pull Request**: Bekijk en merge de wijzigingen in GitHub
- **Geschiedenis**: Vorige sessies zijn beschikbaar in de interface

## Voorbeeld Prompts

### Code Generatie
- "Voeg unit tests toe voor de Chatbot component"
- "Refactor de AdminDashboard voor betere performance"
- "Voeg error handling toe aan alle API calls"
- "Maak een nieuwe component voor testimonials"

### Project Verbeteringen
- "Optimaliseer de image loading in de Gevel componenten"
- "Fix memory leaks in React componenten"
- "Verbeter TypeScript type safety in het project"
- "Voeg accessibility (a11y) verbeteringen toe"

### Performance & SEO
- "Optimaliseer bundle size en code splitting"
- "Voeg loading states toe aan alle async operaties"
- "Verbeter SEO met structured data"
- "Refactor duplicate code naar herbruikbare utilities"

## Technical Details

### API Configuration
```typescript
// Environment variabelen
JULES_API_KEY=AQ.Ab8RN6KlKrl4nmZPUfQ5qXboij3px0ZzNqKsj1EgUj1mIkbv1g

// GitHub repository
Username: Soundforge-ai
Repository: yannova
Branch: main
```

### File Structure
```
yannova/
├── lib/api/jules.ts          # Jules API service
├── hooks/useJules.ts         # React hook
├── components/JulesAssistant.tsx  # UI component
├── pages/JulesAssistant.tsx       # Page component
├── .env                      # Environment variables
└── vite.config.ts             # Build configuration
```

### API Endpoints
- **Create Session**: `POST /v1alpha/sessions`
- **Get Session**: `GET /v1alpha/sessions/{id}`
- **Base URL**: `https://jules.googleapis.com`

## Troubleshooting

### Common Issues
1. **API Key niet gevonden**
   - Controleer of `JULES_API_KEY` in `.env` is ingesteld
   - Verify dat de Vite server is herstart na wijzigingen

2. **CORS fouten**
   - Zorg dat de Jules API key correct is geconfigureerd
   - Controleer de network tab in browser dev tools

3. **Sessie mislukt**
   - Check de prompt op duidelijkheid en specificiteit
   - Verify GitHub repository toegang

### Logging
Alle API calls worden gelogd in de browser console:
- Success logs: Sessie details en responses
- Error logs: Gedetailleerde foutmeldingen
- Status updates: Real-time polling informatie

## Best Practices

### Prompts
- **Specifiek**: Beschrijf precies wat je wilt
- **Context**: Geef relevante achtergrondinformatie
- **Testbaar**: Vermijd te brede, onbepaalde taken

### Security
- **API Key**: Nooit committen naar versiebeheer
- **Environment**: Gebruik `.env.local` voor lokale overrides
- **Access**: Beperk toegang tot Jules functionaliteit

### Performance
- **Polling**: Automatische stop na 5 minuten
- **History**: Maximum 50 items in localStorage
- **Caching**: Status updates worden lokaal gecachet

## Development

### Testing
```bash
# Start development server
npm run dev

# Toegang tot Jules Assistant
open http://localhost:3004/jules
```

### Building
```bash
# Production build
npm run build

# Preview build
npm run preview
```

## Support

Voor vragen of problemen met de Jules integration:
1. Check de browser console voor foutmeldingen
2. Verify de environment variables in `.env`
3. Controleer de GitHub repository settings
4. Raadpleeg de [Jules API Documentation](https://jules.google/docs)

---

**Status**: ✅ Volledig geïmplementeerd en getest
**Versie**: 1.0.0
**Laatste update**: 19-12-2025
