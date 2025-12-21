# Migratie naar Supabase - Complete Guide

## Overzicht

Alle admin panel data wordt nu opgeslagen in Supabase in plaats van browser localStorage. Dit zorgt voor:
- ✅ Permanente opslag (niet verloren bij browser sluiten)
- ✅ Toegankelijk vanaf elke browser/device
- ✅ Backup en recovery mogelijk
- ✅ Schaalbaarheid

## Stap 1: Database Migraties Uitvoeren

Je moet de volgende migraties uitvoeren in je Supabase project:

### Via Supabase Dashboard:

1. Ga naar: https://supabase.com/dashboard/project/sbp_v0_6793ceacb6909ca9b7ccd580bda88c4a8bc93e3b
2. Klik op **SQL Editor** in het menu
3. Voer de volgende migraties uit in volgorde:

#### Migratie 1: Chats
- Open: `supabase/migrations/003_create_chats_table.sql`
- Kopieer de inhoud en voer uit in SQL Editor

#### Migratie 2: Pages
- Open: `supabase/migrations/004_create_pages_table.sql`
- Kopieer de inhoud en voer uit in SQL Editor

#### Migratie 3: Settings
- Open: `supabase/migrations/005_create_settings_table.sql`
- Kopieer de inhoud en voer uit in SQL Editor

### Via Supabase CLI (Alternatief):

```bash
# Installeer Supabase CLI
npm install -g supabase

# Login
supabase login

# Link je project
supabase link --project-ref sbp_v0_6793ceacb6909ca9b7ccd580bda88c4a8bc93e3b

# Push alle migraties
supabase db push
```

## Stap 2: Bestaande Data Migreren

Na het uitvoeren van de migraties, kun je bestaande localStorage data migreren naar Supabase:

### Optie 1: Automatisch (via Browser Console)

1. Open je website in de browser
2. Open Developer Tools (F12)
3. Ga naar de Console tab
4. Voer het volgende in:

```javascript
import { migrateAll } from './lib/migrateToSupabase';
migrateAll().then(results => {
  console.log('Migratie voltooid:', results);
});
```

### Optie 2: Handmatig (via Admin Panel)

Er wordt automatisch een migratie uitgevoerd wanneer je de admin panel opent. De app probeert eerst Supabase, en als dat niet beschikbaar is, valt het terug naar localStorage.

## Stap 3: Verificatie

Controleer of de migratie succesvol was:

1. Ga naar Supabase Dashboard
2. Klik op **Table Editor**
3. Controleer de volgende tabellen:
   - `chat_sessions` - Chat gesprekken
   - `pages` - Dynamische pagina's
   - `app_settings` - App instellingen
   - `leads` - Klantgegevens (al eerder geïmplementeerd)

## Nieuwe Database Structuur

### chat_sessions
- `id` (text) - Unieke identifier
- `start_time` (timestamp) - Start tijd
- `last_message_time` (timestamp) - Laatste bericht tijd
- `messages` (jsonb) - Array van berichten
- `preview` (text) - Preview tekst
- `status` (text) - 'active' of 'closed'
- `tags` (jsonb) - Array van tags

### pages
- `id` (text) - Unieke identifier
- `slug` (text) - URL slug (unique)
- `title` (text) - Pagina titel
- `content` (jsonb) - Puck editor content
- `status` (text) - 'published' of 'draft'
- `parent_id` (text) - Parent pagina ID (voor subpagina's)
- `seo` (jsonb) - SEO metadata

### app_settings
- `id` (text) - Altijd 'default'
- `active_provider` (text) - Actieve AI provider
- `providers` (jsonb) - Provider configuraties
- `bot_name` (text) - Chatbot naam
- `system_prompt` (text) - System prompt
- `knowledge_base` (jsonb) - Kennisbank documenten

## Fallback Mechanisme

De app heeft een intelligent fallback systeem:

1. **Eerst probeert Supabase** - Als Supabase beschikbaar is, wordt data daar opgeslagen
2. **Fallback naar localStorage** - Als Supabase niet beschikbaar is (bijv. geen internet, migratie niet uitgevoerd), valt het terug naar localStorage
3. **Automatische migratie** - Wanneer Supabase weer beschikbaar is, wordt localStorage data automatisch gemigreerd

## Troubleshooting

### "Supabase not available" errors

**Oorzaak:** Migraties zijn niet uitgevoerd of Supabase credentials zijn incorrect.

**Oplossing:**
1. Controleer of migraties zijn uitgevoerd
2. Controleer `.env.local` voor correcte Supabase credentials:
   ```
   VITE_SUPABASE_URL=je-supabase-url
   VITE_SUPABASE_ANON_KEY=je-supabase-anon-key
   ```
3. Controleer browser console voor specifieke errors

### Data wordt niet opgehaald

**Oorzaak:** Row Level Security (RLS) policies blokkeren toegang.

**Oplossing:**
1. Controleer of je ingelogd bent in Supabase
2. Controleer RLS policies in Supabase Dashboard
3. Voor development, kun je tijdelijk RLS uitschakelen (niet aanbevolen voor productie)

### Migratie faalt

**Oorzaak:** Data format incompatibiliteit of database errors.

**Oplossing:**
1. Controleer browser console voor specifieke errors
2. Controleer of alle migraties succesvol zijn uitgevoerd
3. Probeer handmatig één item te migreren om de fout te identificeren

## Media Opslag (Toekomstig)

Media bestanden worden momenteel nog opgeslagen in localStorage (Base64). Voor productie wordt aanbevolen om Supabase Storage te gebruiken:

1. Maak een `media` bucket aan in Supabase Storage
2. Upload bestanden naar de bucket
3. Sla alleen metadata (URL, naam, type) op in de database

Dit is nog niet geïmplementeerd maar kan later worden toegevoegd.

## Backup Aanbevelingen

### Supabase Backups
- Automatische backups via Supabase (afhankelijk van plan)
- Handmatige export via SQL Editor
- Database dumps via Supabase CLI

### Best Practices
- Maak regelmatig backups van je database
- Test restore procedures regelmatig
- Houd migraties in versie controle (Git)

## Volgende Stappen

- [x] Leads migratie naar Supabase
- [x] Chats migratie naar Supabase
- [x] Pages migratie naar Supabase
- [x] Settings migratie naar Supabase
- [ ] Media migratie naar Supabase Storage
- [ ] Authenticatie implementatie voor beveiligde toegang
- [ ] Real-time updates via Supabase Realtime

