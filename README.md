# Yannova - Bouw- en Renovatiebedrijf Website

Een moderne website voor Yannova, een Belgisch bouw- en renovatiebedrijf, gebouwd met React 19, TypeScript, Vite en React Router.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite
- **Multi-language Support**: Nederlands (NL) en Frans (FR)
- **AI Chatbot**: Geïntegreerde chatbot met GLM API
- **CMS Integratie**: Sanity CMS voor blog posts
- **Database**: Supabase voor lead management
- **Admin Dashboard**: Beheer van leads en projecten
- **Visual Editor**: Puck editor voor content bewerking
- **SEO Optimized**: Volledige SEO ondersteuning

## 📋 Vereisten

- Node.js (versie 18 of hoger)
- npm of yarn

## 🛠️ Installatie

1. Clone de repository:
```bash
git clone <repository-url>
cd yannova
```

2. Installeer dependencies:
```bash
npm install
```

3. Maak een `.env.local` bestand en voeg je environment variables toe:
```env
VITE_GLM_API_KEY=your_glm_api_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Start de development server:
```bash
npm run dev
```

De applicatie draait nu op `http://localhost:3002` (of een andere poort zoals aangegeven).

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview productie build
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests eenmalig
- `npm run test:coverage` - Run tests met coverage

## 🏗️ Project Structuur

```
yannova/
├── components/      # Herbruikbare React componenten
├── pages/          # Route-specifieke pagina's
├── lib/            # Utility libraries (Sanity, Supabase, API)
├── contexts/       # React contexts (i18n)
├── hooks/          # Custom React hooks
├── i18n/           # Vertalingen (NL/FR)
└── public/         # Statische assets
```

## 🔧 Technologieën

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS
- **CMS**: Sanity CMS
- **Database**: Supabase
- **AI**: GLM API (Naga.ac), Gemini API
- **Editor**: Puck (@measured/puck)
- **Testing**: Vitest, Testing Library

## 📝 Environment Variables

Zorg ervoor dat je de volgende environment variables instelt in `.env.local`:

- `VITE_GLM_API_KEY`: API key voor GLM chatbot service
- `GEMINI_API_KEY`: API key voor Gemini image generation (optioneel)

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is privé eigendom van Yannova.

## 📞 Contact

Voor vragen of ondersteuning, neem contact op via de website.
