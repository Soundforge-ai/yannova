# Instructies: Projectstructuur Verbeteren met Jules

## Stap 1: Start je Development Server

```bash
npm run dev
```

## Stap 2: Open Jules Assistant

Ga naar: **http://localhost:3002/jules-assistant**

## Stap 3: Kopieer de Prompt

Open het bestand `JULES_PROMPT_KLAAR_VOOR_GEBRUIK.txt` en kopieer de volledige inhoud.

## Stap 4: Plak in Jules Assistant

1. Plak de prompt in het grote tekstveld "Wat wil je dat Jules doet?"
2. Kies **"Auto Pull Request"** modus (rechts bovenin)
3. Optioneel: Voeg een titel toe, bijv. "Projectstructuur Verbeteringen"
4. Klik op **"Start Jules Sessie"**

## Stap 5: Wacht op Resultaat

Jules zal:
- Je codebase analyseren
- De nieuwe structuur aanmaken
- Alle bestanden verplaatsen
- Alle imports updaten
- Een pull request aanmaken op GitHub

Je kunt de voortgang volgen op [jules.google.com](https://jules.google.com)

## Alternatief: Repository Verbinden

Als je de repository wilt verbinden met Jules via de API:

1. Ga naar [jules.google.com](https://jules.google.com)
2. Log in met je Google account
3. Verbind je GitHub account
4. Selecteer de repository `Soundforge-ai/yannova`
5. Voeg je API key toe aan `.env.local`:
   ```
   VITE_JULES_API_KEY=your-api-key-here
   ```
6. Run dan: `node create-jules-session-structuur.mjs`

## Troubleshooting

**404 Error bij API call:**
- Repository is niet verbonden met Jules
- Gebruik de interface methode (aanbevolen)

**Prompt werkt niet:**
- Zorg dat je de volledige prompt kopieert
- Controleer of je GitHub repository toegankelijk is
- Zorg dat je een geldige Jules API key hebt

## Belangrijk

De wijzigingen worden automatisch in een pull request gezet, zodat je alles kunt reviewen voordat je merge.

