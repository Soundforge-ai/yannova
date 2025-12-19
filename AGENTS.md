# AGENTS.md - Yannova Project

## Project Overzicht

**Yannova** is een Belgisch bouw- en renovatiebedrijf website gebouwd met React 19, TypeScript, Vite, en React Router. De website presenteert de diensten van het bedrijf (ramen, deuren, renovaties, isolatie, gevelwerken, crepi) en biedt functionaliteit voor contactformulieren, blog posts, admin dashboard, en een AI chatbot.

## Technische Stack

- **Frontend Framework**: React 19.2.3 met TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.10.1
- **Styling**: Tailwind CSS (klassen zoals `bg-brand-accent`, `text-brand-dark`)
- **Backend Services**: 
  - Sanity CMS voor blog posts
  - Supabase voor database operaties
- **AI Integraties**: 
  - GLM API (Naga.ac) voor chatbot functionaliteit
  - Gemini API voor image generation
- **CMS/Editor**: Puck (@measured/puck) voor visuele page editor
- **Testing**: Vitest met @testing-library/react

## Project Structuur

```
yannova/
├── components/          # Herbruikbare React componenten
│   ├── Chatbot.tsx     # AI chatbot met GLM API integratie
│   ├── AdminDashboard.tsx  # Admin panel voor lead management
│   ├── Layout.tsx      # Hoofd layout wrapper
│   ├── Navbar.tsx      # Navigatie component
│   ├── Footer.tsx      # Footer component
│   ├── SEO.tsx         # SEO metadata component
│   └── gevel/          # Gevel-specifieke componenten
│       ├── Gevelbepleistering.tsx
│       ├── Gevelbescherming.tsx
│       ├── Gevelisolatie.tsx
│       ├── Steenstrips.tsx
│       └── Gevelrenovatie.tsx
├── pages/              # Route-specifieke pagina's
│   ├── Home.tsx        # Homepage
│   ├── Contact.tsx     # Contact pagina
│   ├── Diensten.tsx    # Diensten overzicht
│   ├── OverOns.tsx     # Over ons pagina
│   ├── Posts.tsx       # Blog posts lijst
│   ├── Post.tsx        # Individuele blog post
│   └── dashboard/      # Admin dashboard pages
│       └── editor/     # Puck editor configuratie
├── lib/                # Utility libraries
│   ├── sanity/         # Sanity CMS client en queries
│   ├── supabase/       # Supabase client
│   └── api/            # API service calls
├── contexts/           # React contexts
│   └── I18nContext.tsx # Internationalisatie (NL/FR)
├── hooks/              # Custom React hooks
│   ├── useI18n.ts      # i18n hook
│   └── useCookieConsent.ts
├── i18n/               # Vertalingen
│   ├── nl.json         # Nederlandse vertalingen
│   └── fr.json         # Franse vertalingen
├── schemas/            # TypeScript type definities
└── public/             # Statische assets (images, video)
```

## Belangrijke Componenten en Functionaliteit

### Chatbot Component (`components/Chatbot.tsx`)
- Gebruikt GLM API (Naga.ac) voor AI responses
- API key via environment variable: `VITE_GLM_API_KEY`
- Floating chat interface met minimize functionaliteit
- System prompt bevat Yannova-specifieke informatie

### Admin Dashboard (`components/AdminDashboard.tsx`)
- Beheer van leads (potentiële klanten)
- Authenticatie via sessionStorage
- Filter en zoek functionaliteit voor leads
- Status tracking (Nieuw, Offerte Verzonden, etc.)

### Routing (`App.tsx`)
- React Router voor navigatie
- Lazy loading van componenten voor performance
- Error boundaries voor foutafhandeling
- Multi-language support (NL/FR)

### Internationalisatie
- Context-based i18n systeem
- Ondersteunt Nederlands (NL) en Frans (FR)
- Language switcher component beschikbaar

### Sanity CMS Integratie (`lib/sanity/`)
- Blog posts via Sanity
- Image URL builder voor geoptimaliseerde afbeeldingen
- Queries voor content fetching

### Supabase Integratie (`lib/supabase/`)
- Database client setup
- Migrations voor database schema

## Environment Variables

- `VITE_GLM_API_KEY`: API key voor GLM chatbot service
- `GEMINI_API_KEY`: API key voor Gemini image generation (gebruikt in Python scripts)

## Development Workflow

### Start Development Server
```bash
npm run dev
```
Server draait op poort 3002 (configureerbaar in vite.config.ts)

### Build voor Productie
```bash
npm run build
```

### Testing
```bash
npm test          # Watch mode
npm run test:run  # Single run
npm run test:coverage  # Met coverage
```

## Code Conventies

- **Components**: Functionele React componenten met TypeScript
- **Styling**: Tailwind CSS met custom brand colors (`brand-accent`, `brand-dark`, etc.)
- **Naming**: 
  - Components: PascalCase (bijv. `Chatbot.tsx`)
  - Files: PascalCase voor components, camelCase voor utilities
- **Type Safety**: Volledige TypeScript implementatie
- **State Management**: React hooks (useState, useEffect, useContext)

## Agents & Tools in Codebase

### 1. Chatbot Agent (`components/Chatbot.tsx`)
**Functie**: AI-powered customer service chatbot
**Input**: Gebruiker vragen via chat interface
**Output**: Antwoorden gebaseerd op Yannova diensten en informatie
**API**: GLM API (Naga.ac) - OpenAI-compatible format
**Interactie**: 
- Gebruikers kunnen vragen stellen over diensten
- Quick questions voor snelle toegang tot veelgestelde vragen
- Error handling met fallback naar contact informatie

### 2. Admin Dashboard (`components/AdminDashboard.tsx`)
**Functie**: Lead management en project tracking
**Input**: Leads van contactformulieren
**Output**: Beheerdersinterface voor lead tracking
**Features**:
- Authenticatie (sessionStorage-based)
- Filter en zoek functionaliteit
- Status updates (Nieuw, Offerte Verzonden, etc.)
- Notificaties systeem

### 3. Sanity CMS Integration (`lib/sanity/`)
**Functie**: Content management voor blog posts
**Input**: Content van Sanity CMS
**Output**: Blog posts op website
**Tools**: 
- `client.ts`: Sanity client configuratie
- `queries.ts`: GROQ queries voor content
- `post.ts` / `posts.ts`: Type-safe content fetching

### 4. Puck Editor (`pages/dashboard/editor/`)
**Functie**: Visuele page builder
**Config**: `puck.config.tsx` definieert beschikbare components
**Features**: Drag-and-drop interface voor content bewerking

## Interactie Instructies voor Jules

### Bij het werken aan dit project:

1. **Respecteer de bestaande architectuur**: Gebruik de component/pages structuur en volg de lazy loading pattern.

2. **TypeScript**: Alle nieuwe code moet volledig getypeerd zijn. Gebruik de bestaande types in `types.ts` waar mogelijk.

3. **Styling**: Gebruik Tailwind CSS met de bestaande brand colors. Referentie in `constants.tsx` of inspecteer bestaande componenten.

4. **Internationalisatie**: Voor user-facing tekst, gebruik het i18n systeem. Voeg vertalingen toe aan zowel `nl.json` als `fr.json`.

5. **API Calls**: 
   - Chatbot API calls gaan via GLM API (zie `Chatbot.tsx` voor voorbeeld)
   - Sanity queries via `lib/sanity/queries.ts`
   - Supabase operaties via `lib/supabase/client.ts`

6. **Testing**: Nieuwe features moeten tests hebben. Gebruik Vitest en Testing Library patterns zoals in bestaande tests.

7. **Error Handling**: Gebruik ErrorBoundary waar nodig en implementeer graceful fallbacks voor API calls.

8. **Performance**: 
   - Lazy load nieuwe routes in `App.tsx`
   - Optimaliseer images via `OptimizedImage.tsx` component
   - Gebruik React.memo waar nodig voor zware componenten

### Common Tasks:

- **Nieuwe pagina toevoegen**: 
  1. Maak component in `pages/`
  2. Voeg route toe in `App.tsx` met lazy loading
  3. Voeg vertalingen toe aan `i18n/`
  4. Update navigatie in `Navbar.tsx` indien nodig

- **Nieuwe API integratie**:
  1. Maak service file in `lib/api/` of gebruik bestaande
  2. Voeg environment variables toe indien nodig
  3. Implementeer error handling

- **Styling wijzigingen**:
  1. Check `constants.tsx` voor brand colors
  2. Gebruik Tailwind utility classes
  3. Voor complexe styling, maak custom CSS classes in `index.css`

## Belangrijke Bestanden om te Begrijpen

- `App.tsx`: Hoofd router en applicatie setup
- `components/Layout.tsx`: Basis layout structuur
- `constants.tsx`: Brand colors en andere constanten
- `types.ts`: TypeScript type definities
- `vite.config.ts`: Build configuratie
- `components/Chatbot.tsx`: Voorbeeld van API integratie

## Dependencies om Rekening Mee te Houden

- **React 19**: Nieuwe features kunnen worden gebruikt, maar check compatibiliteit
- **React Router 7**: Nieuwste versie, gebruik de juiste hooks
- **Vite**: Fast builds, gebruik Vite-specific features waar nuttig
- **TypeScript 5.8**: Moderne TypeScript features beschikbaar

## Jules API Integratie

### Jules Service (`lib/api/jules.ts`)
**Functie**: Integratie met Google's Jules AI voor code generatie en project automatisering
**API Endpoint**: `https://jules.googleapis.com/v1alpha`
**Authenticatie**: API key via `JULES_API_KEY` environment variable

**Beschikbare Functies**:
- `createJulesSession()`: Creëert een nieuwe Jules sessie voor code generatie
- `getJulesSession()`: Haalt de status van een sessie op
- `createGitHubContext()`: Helper voor GitHub repository context
- `createYannovaJulesSession()`: Quick helper specifiek voor dit project

**Gebruik in Code**:
```typescript
import { createYannovaJulesSession } from '@/lib/api/jules';

const result = await createYannovaJulesSession(
  "Voeg unit tests toe voor de Chatbot component",
  { automationMode: "AUTO_CREATE_PR" }
);
```

### Jules Hook (`hooks/useJules.ts`)
**Functie**: React hook voor gebruik van Jules API in componenten
**Features**: Loading states, error handling, easy-to-use interface

**Gebruik in Componenten**:
```typescript
import { useJules } from '@/hooks/useJules';

const { createQuickSession, isLoading, error } = useJules();
```

**Automation Modes**:
- `AUTO_CREATE_PR`: Maakt automatisch een pull request aan
- `AUTO_COMMIT`: Commit automatisch naar de branch
- `MANUAL`: Vereist handmatige review en goedkeuring

**Environment Setup**:
De `JULES_API_KEY` moet zijn geconfigureerd in `.env.local` voor gebruik in de frontend.
Voor backend/server-side gebruik, kan de key worden opgeslagen in `.env` zonder `VITE_` prefix.

