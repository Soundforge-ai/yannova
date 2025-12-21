# Migratie Status - Supabase Integratie

## ✅ Voltooid

### 1. Leads (Klantgegevens)
- ✅ Database tabel aangemaakt (`002_create_leads_table.sql`)
- ✅ Service functies geïmplementeerd (`src/lib/supabase/leads.ts`)
- ✅ App.tsx gebruikt Supabase voor leads
- ✅ **Status: KLAAR VOOR GEBRUIK**

### 2. Chats (Chat Gesprekken)
- ✅ Database tabel aangemaakt (`003_create_chats_table.sql`)
- ✅ Service functies geïmplementeerd (`src/lib/supabase/chats.ts`)
- ✅ chatStorage.ts gebruikt Supabase met localStorage fallback
- ✅ AdminDashboard.tsx gebruikt async functies
- ⚠️ **Status: CODE KLAAR - MIGRATIE NOG UITVOEREN**

### 3. Pages (Dynamische Pagina's)
- ✅ Database tabel aangemaakt (`004_create_pages_table.sql`)
- ✅ Service functies geïmplementeerd (`src/lib/supabase/pages.ts`)
- ✅ pageStorage.ts gebruikt Supabase met localStorage fallback
- ✅ AdminDashboard.tsx gebruikt async functies
- ⚠️ **Status: CODE KLAAR - MIGRATIE NOG UITVOEREN**

### 4. Settings (App Instellingen)
- ✅ Database tabel aangemaakt (`005_create_settings_table.sql`)
- ✅ Service functies geïmplementeerd (`src/lib/supabase/settings.ts`)
- ✅ settingsStorage.ts gebruikt Supabase met localStorage fallback
- ✅ AdminDashboard.tsx gebruikt async functies
- ⚠️ **Status: CODE KLAAR - MIGRATIE NOG UITVOEREN**

### 5. Media (Foto's & Documenten)
- ⚠️ **Nog niet gemigreerd naar Supabase**
- ✅ Google Cloud Storage integratie bestaat
- ✅ mediaStorage.ts ondersteunt GCS URLs
- ⚠️ **Status: GEBRUIKT NOG LOCALSTORAGE**

---

## ⏳ Te Doen

### Stap 1: Database Migraties Uitvoeren

Voer de volgende migraties uit in Supabase:

1. **Chats Tabel**
   - Bestand: `supabase/migrations/003_create_chats_table.sql`
   - Via Supabase Dashboard → SQL Editor

2. **Pages Tabel**
   - Bestand: `supabase/migrations/004_create_pages_table.sql`
   - Via Supabase Dashboard → SQL Editor

3. **Settings Tabel**
   - Bestand: `supabase/migrations/005_create_settings_table.sql`
   - Via Supabase Dashboard → SQL Editor

**Instructies:**
1. Ga naar: https://supabase.com/dashboard/project/sbp_v0_6793ceacb6909ca9b7ccd580bda88c4a8bc93e3b
2. Klik op **SQL Editor**
3. Open elk migratie bestand
4. Kopieer en plak de SQL code
5. Klik op **Run**

### Stap 2: Verificatie

Na het uitvoeren van de migraties:

1. Controleer in Supabase Dashboard → **Table Editor**:
   - ✅ `leads` tabel bestaat
   - ✅ `chat_sessions` tabel bestaat
   - ✅ `pages` tabel bestaat
   - ✅ `app_settings` tabel bestaat

2. Test de app:
   - Open admin panel
   - Controleer of data wordt opgehaald
   - Maak een test chat sessie
   - Maak een test pagina
   - Wijzig instellingen

### Stap 3: Bestaande Data Migreren (Optioneel)

Als je bestaande localStorage data hebt:

1. Open browser Developer Tools (F12)
2. Ga naar Console
3. Voer uit:
```javascript
// Importeer het migratie script
import { migrateAll } from './lib/migrateToSupabase';
migrateAll().then(results => {
  console.log('Migratie voltooid:', results);
});
```

Of gebruik de automatische migratie die plaatsvindt wanneer je de admin panel opent.

---

## 📊 Huidige Data Locaties

| Data Type | Huidige Locatie | Doel Locatie | Status |
|-----------|----------------|--------------|--------|
| Leads | ✅ Supabase | ✅ Supabase | ✅ Klaar |
| Chats | ⚠️ LocalStorage | ✅ Supabase | ⏳ Code klaar, migratie nodig |
| Pages | ⚠️ LocalStorage | ✅ Supabase | ⏳ Code klaar, migratie nodig |
| Settings | ⚠️ LocalStorage | ✅ Supabase | ⏳ Code klaar, migratie nodig |
| Media | ⚠️ LocalStorage | ⚠️ GCS (toekomst) | ⏳ Nog te implementeren |

---

## 🔧 Troubleshooting

### "Supabase not available" in console

**Oorzaak:** Migraties zijn niet uitgevoerd of Supabase credentials zijn incorrect.

**Oplossing:**
1. Controleer of alle 3 migraties zijn uitgevoerd
2. Controleer `.env.local`:
   ```
   VITE_SUPABASE_URL=je-supabase-url
   VITE_SUPABASE_ANON_KEY=je-supabase-anon-key
   ```
3. Refresh de browser

### Data wordt niet opgehaald

**Oorzaak:** Row Level Security (RLS) policies.

**Oplossing:**
- Voor development: Controleer RLS policies in Supabase
- De policies vereisen `auth.role() = 'authenticated'`
- Voor testing kun je tijdelijk RLS aanpassen (niet voor productie!)

### Async functies geven errors

**Oorzaak:** AdminDashboard gebruikt nog sync functies.

**Oplossing:**
- Alle storage functies zijn al async gemaakt
- Zorg dat alle `await` keywords aanwezig zijn
- Check browser console voor specifieke errors

---

## 📝 Notities

- **Fallback Mechanisme:** De app valt automatisch terug naar localStorage als Supabase niet beschikbaar is
- **Automatische Migratie:** Wanneer Supabase beschikbaar wordt, wordt localStorage data automatisch gemigreerd
- **Media:** Media blijft voorlopig in localStorage, maar kan GCS URLs gebruiken
- **Google OAuth:** Is al geïmplementeerd voor admin login

---

## ✅ Checklist

- [x] Leads migratie code geschreven
- [x] Chats migratie code geschreven
- [x] Pages migratie code geschreven
- [x] Settings migratie code geschreven
- [x] Storage bestanden geüpdatet
- [x] AdminDashboard async gemaakt
- [x] Migratie script geschreven
- [ ] **Database migraties uitvoeren (003, 004, 005)**
- [ ] **Testen of alles werkt**
- [ ] **Bestaande data migreren (optioneel)**

---

**Laatste Update:** Vandaag  
**Volgende Stap:** Database migraties uitvoeren in Supabase Dashboard

