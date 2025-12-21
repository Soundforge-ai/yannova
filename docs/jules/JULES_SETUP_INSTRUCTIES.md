# Jules Setup Instructies - Stap voor Stap

## Probleem
Je krijgt een 404 error omdat de GitHub repository `Soundforge-ai/yannova` niet verbonden is met Jules.

## Oplossing: Repository Verbinden met Jules

### Stap 1: Ga naar Jules Dashboard
1. Open je browser en ga naar: **[https://jules.google.com](https://jules.google.com)**
2. Log in met je Google account (gebruik hetzelfde account als je API key)

### Stap 2: GitHub Account Verbinden
1. Klik op je **profiel/instellingen** (meestal rechts bovenin)
2. Zoek naar **"Integrations"** of **"Connections"** in het menu
3. Klik op **"Connect GitHub"** of **"GitHub Integration"**
4. Autoriseer Jules om toegang te krijgen tot je GitHub repositories
   - Kies "All repositories" OF specifiek "Soundforge-ai/yannova"

### Stap 3: Repository Selecteren/Verifiëren
1. Ga terug naar het Jules Dashboard
2. Controleer of de repository `Soundforge-ai/yannova` zichtbaar is
3. Als de repository niet verschijnt:
   - Zorg dat je toegang hebt tot de `Soundforge-ai` GitHub organisatie
   - Controleer of de repository bestaat en toegankelijk is
   - Herhaal Stap 2 en zorg dat je de juiste repositories selecteert

### Stap 4: API Key Configureren
Zorg dat je API key in `.env.local` staat:

```bash
# .env.local
VITE_JULES_API_KEY=your-jules-api-key-here
```

Je kunt je API key vinden in:
- Jules Dashboard → Account Settings → API Keys

### Stap 5: Test
1. Start je dev server: `npm run dev`
2. Ga naar: `http://localhost:3002/jules-assistant`
3. Probeer een sessie aan te maken
4. De 404 error zou nu weg moeten zijn!

---

## Optioneel: Render.com Setup (alleen als je Render gebruikt voor hosting)

**Let op:** Render.com is een hostingplatform en heeft **NIETS** te maken met Jules. Je hoeft dit alleen te doen als je Render gebruikt om je website te hosten.

### Als je Render.com gebruikt voor hosting:

1. **Ga naar Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. **Selecteer je service** (bijv. "yannova-web" of je frontend service)
3. **Ga naar de "Previews" tab**
4. **Enable Pull Request Previews**:
   - Kies "Manual" (alleen met `[render preview]` label) OF
   - Kies "Automatic" (voor elke PR)
5. **Bekijk de documentatie**: [Render Service Previews](https://render.com/docs/service-previews)

**Belangrijk:** 
- Dit is alleen nodig als je je website op Render host
- Dit lost de Jules 404 error NIET op
- Dit is een aparte feature voor deployment previews

---

## Troubleshooting

### Fout: "404 NOT_FOUND"
- ✅ Controleer of GitHub account verbonden is met Jules
- ✅ Controleer of je toegang hebt tot de repository
- ✅ Verifieer de repository naam: `Soundforge-ai/yannova`

### Fout: "API_KEY not configured"
- ✅ Zorg dat `VITE_JULES_API_KEY` in `.env.local` staat
- ✅ Herstart de dev server na het toevoegen van de key

### Repository niet zichtbaar in Jules
- Controleer GitHub permissions
- Zorg dat je admin/owner rechten hebt op de repository
- Probeer de GitHub connectie opnieuw te autoriseren

---

## Verschil tussen Jules en Render

| Feature | Jules | Render |
|---------|-------|--------|
| **Doel** | AI code assistent | Hosting platform |
| **Werkt met** | GitHub repositories | GitHub repositories |
| **Functie** | Code genereren/refactoren | Website deployen |
| **Voorbeeld** | "Voeg tests toe" → genereert code | Push naar GitHub → deployed website |
| **Nodig voor 404 fix?** | ✅ Ja | ❌ Nee |

---

## Hulp Nodig?

- **Jules documentatie**: [https://jules.google/docs](https://jules.google/docs)
- **Jules Dashboard**: [https://jules.google.com](https://jules.google.com)
- **Render docs** (alleen voor hosting): [https://render.com/docs](https://render.com/docs)

