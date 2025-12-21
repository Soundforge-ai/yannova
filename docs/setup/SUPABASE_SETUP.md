# Supabase Setup voor Klantgegevens Opslag

## Overzicht

Je klantgegevens (leads) worden nu opgeslagen in Supabase, een PostgreSQL database. Dit betekent dat je gegevens permanent worden bewaard, ook na het sluiten van de browser.

## Database Setup

### 1. Migratie Uitvoeren

De database migratie moet worden uitgevoerd in je Supabase project:

1. Ga naar je Supabase Dashboard: https://supabase.com/dashboard
2. Selecteer je project
3. Ga naar **SQL Editor**
4. Open het bestand: `supabase/migrations/002_create_leads_table.sql`
5. Kopieer de inhoud en voer deze uit in de SQL Editor

Of gebruik de Supabase CLI:

```bash
# Installeer Supabase CLI (als je die nog niet hebt)
npm install -g supabase

# Login
supabase login

# Link je project
supabase link --project-ref je-project-ref

# Push de migratie
supabase db push
```

### 2. Row Level Security (RLS)

De tabel heeft Row Level Security ingeschakeld. Dit betekent dat alleen geauthenticeerde gebruikers toegang hebben tot de leads.

**Belangrijk:** Voor productie moet je mogelijk de RLS policies aanpassen afhankelijk van je authenticatie setup.

## Gebruik

### Leads Ophalen

```typescript
import { getLeads } from './lib/supabase/leads';

const leads = await getLeads();
```

### Nieuwe Lead Toevoegen

```typescript
import { createLead } from './lib/supabase/leads';

const newLead = await createLead({
  name: 'Jan Janssen',
  email: 'jan@example.com',
  phone: '0478 12 34 56',
  project: 'Ramen vervangen'
});
```

### Lead Status Updaten

```typescript
import { updateLeadStatus } from './lib/supabase/leads';

await updateLeadStatus('lead-id', 'Offerte Verzonden');
```

## Database Structuur

De `leads` tabel heeft de volgende velden:

- `id` (uuid) - Unieke identifier
- `name` (text) - Naam van de klant
- `email` (text) - Email adres
- `phone` (text) - Telefoonnummer
- `project` (text) - Project beschrijving
- `status` (text) - Status: 'Nieuw', 'Contact Gehad', 'Offerte Verzonden', of 'Afgerond'
- `notes` (jsonb) - Optionele notities (array)
- `created_at` (timestamp) - Aanmaakdatum
- `updated_at` (timestamp) - Laatste update datum

## Environment Variables

Zorg ervoor dat je `.env.local` bestand de volgende variabelen bevat:

```
VITE_SUPABASE_URL=je-supabase-url
VITE_SUPABASE_ANON_KEY=je-supabase-anon-key
```

## Troubleshooting

### Leads worden niet opgehaald

1. Controleer of de migratie is uitgevoerd
2. Controleer of je Supabase credentials correct zijn in `.env.local`
3. Controleer de browser console voor errors
4. Controleer of RLS policies correct zijn ingesteld

### Authenticatie Problemen

Als je problemen hebt met authenticatie, kun je de RLS policies tijdelijk aanpassen voor testing:

```sql
-- Tijdelijk alle toegang toestaan (alleen voor development!)
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
CREATE POLICY "Allow all access" ON public.leads FOR ALL USING (true);
```

**Waarschuwing:** Gebruik dit niet in productie!

## Volgende Stappen

- [ ] Voeg authenticatie toe voor beveiligde toegang
- [ ] Voeg email notificaties toe bij nieuwe leads
- [ ] Voeg export functionaliteit toe (CSV, Excel)
- [ ] Voeg zoek en filter functionaliteit toe
- [ ] Voeg statistieken en rapporten toe

