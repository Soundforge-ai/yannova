# Puck Editor Integratie Setup

Dit document beschrijft hoe de Puck editor integratie is opgezet in dit Vite/React project.

## Stappen om te voltooien

### 1. Database Setup (Supabase)

Voer de migratie uit in je Supabase SQL Editor:

**Gebruik het migration bestand**: `supabase/migrations/001_create_sites_table.sql`

Kopieer de inhoud van dit bestand en voer het uit in de Supabase SQL Editor. Dit maakt:
- De `sites` tabel aan met alle benodigde kolommen (`id`, `user_id`, `content`, `is_published`, `created_at`, `updated_at`)
- Indexen voor betere performance
- Row Level Security (RLS) policies zodat gebruikers alleen hun eigen sites kunnen beheren
- Een trigger om `updated_at` automatisch bij te werken

**Belangrijk**: Als je lokaal Supabase gebruikt, voer dan `supabase migration up` uit. Voor remote Supabase, kopieer de SQL en voer het handmatig uit in de SQL Editor.

### 2. Environment Variables

Maak een `.env` bestand in de root van het project en voeg toe:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Deze waarden kun je vinden in je Supabase project instellingen (Settings > API).

### 3. Bestanden Overzicht

- **`lib/supabase/client.ts`** - Supabase client setup
- **`lib/api/site-actions.ts`** - API functies voor site operaties (save/get)
- **`pages/dashboard/editor/puck.config.tsx`** - Puck configuratie met componenten
- **`pages/dashboard/editor/EditorPage.tsx`** - Puck editor pagina component
- **`components/PublicRenderer.tsx`** - Component om gepubliceerde sites te renderen
- **`pages/SiteView.tsx`** - Pagina om gepubliceerde sites te bekijken

### 4. Routes

De volgende routes zijn toegevoegd aan `App.tsx`:

- `/dashboard/editor/:siteId` - Editor pagina voor een specifieke site
- `/site/:siteId` - Publieke view van een gepubliceerde site

### 5. Veiligheid

De `saveSiteContent` functie controleert:
- Of de gebruiker ingelogd is
- Of de site behoort tot de ingelogde gebruiker (via `user_id` check)

**Belangrijk**: Zorg dat je Row Level Security (RLS) policies hebt ingesteld in Supabase om dit extra te beveiligen!

### 6. Puck Configuratie Aanpassen

Pas `pages/dashboard/editor/puck.config.tsx` aan om je eigen componenten toe te voegen. De huidige config bevat alleen basis voorbeelden (Heading, Text, Image).

### 7. Gebruik

1. Navigeer naar `/dashboard/editor/[siteId]` om de editor te openen
2. Bewerk je site in de Puck editor
3. Klik op "Publiceer" om op te slaan
4. Bekijk de gepubliceerde versie op `/site/[siteId]`

## Notities

- Deze implementatie gebruikt client-side Supabase calls (geen server actions zoals in Next.js)
- Zorg voor goede RLS policies in Supabase voor extra beveiliging
- De Puck configuratie moet worden aangepast met je eigen componenten

