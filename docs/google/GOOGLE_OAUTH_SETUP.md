# Google OAuth 2.0 Setup Instructies

Dit document beschrijft hoe je Google OAuth 2.0 configureert voor het Yannova project.

## ⚠️ SECURITY WARNING

**KRITIEK**: Als je dit project hebt gekloond of toegang hebt tot de repository geschiedenis, en er zijn OAuth credentials gecommit geweest, moet je **onmiddellijk** de client secret roteren in Google Cloud Console:

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Selecteer project: `gen-lang-client-0141118397`
3. Navigeer naar **APIs & Services** → **Credentials**
4. Klik op je OAuth 2.0 Client ID
5. Klik op **Reset Secret** of maak een nieuwe client secret aan
6. Update de `GOOGLE_CLIENT_SECRET` environment variable in Vercel met de nieuwe secret

**Nooit** commit OAuth client secrets naar source control. Ze moeten altijd via environment variables worden geconfigureerd.

## Credentials

De Google OAuth credentials moeten worden geconfigureerd via environment variables. 

**Belangrijk**: De credentials staan niet in de code repository voor veiligheid. Vraag de credentials aan de project administrator of haal ze op uit Google Cloud Console.

- **Project ID**: `gen-lang-client-0141118397`

## Environment Variables

Voeg de volgende environment variables toe aan je `.env.local` bestand (lokaal) of in Vercel (productie):

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Let op**: Vervang `your_google_client_id_here` en `your_google_client_secret_here` met je daadwerkelijke credentials.

### Lokaal Development

1. Maak een `.env.local` bestand in de root van het project
2. Voeg de bovenstaande variabelen toe
3. Herstart de development server

### Vercel (Productie)

1. Ga naar je Vercel project dashboard
2. Navigeer naar **Settings** → **Environment Variables**
3. Voeg de volgende variabelen toe:
   - `VITE_GOOGLE_CLIENT_ID` (voor alle environments)
   - `GOOGLE_CLIENT_SECRET` (alleen voor Production, Preview, en Development)

## Redirect URIs

De volgende redirect URIs zijn geconfigureerd in Google Cloud Console:

- `https://www.yannova.be/admin`
- `https://www.yannova.be`
- `http://localhost:3002/auth/callback` (voor lokale development)

### Nieuwe Redirect URI Toevoegen

Als je een nieuwe redirect URI nodig hebt:

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Selecteer project: `gen-lang-client-0141118397`
3. Navigeer naar **APIs & Services** → **Credentials**
4. Klik op je OAuth 2.0 Client ID
5. Voeg de nieuwe redirect URI toe onder **Authorized redirect URIs**
6. Sla op

## API Endpoints

### OAuth Callback

De OAuth callback wordt afgehandeld door een Vercel serverless function:

- **Endpoint**: `/api/auth/google/callback`
- **Method**: POST
- **Location**: `api/auth/google/callback.ts`

Deze functie:
- Wisselt de authorization code in voor access/refresh tokens
- Haalt gebruikersinformatie op via Google's API
- Gebruikt de client secret veilig (niet blootgesteld aan de client)

## Gebruik in Code

### AdminDashboard Component

De `AdminDashboard` component gebruikt de Google OAuth provider:

```tsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={(credentialResponse) => {
      // Handle success
    }}
    onError={() => {
      // Handle error
    }}
  />
</GoogleOAuthProvider>
```

### Programmatische OAuth Flow

Voor een volledige OAuth flow met refresh tokens, gebruik de functies in `src/lib/auth/google.ts`:

```tsx
import { initiateGoogleLogin, handleOAuthCallback } from '@/lib/auth/google';

// Start login
initiateGoogleLogin();

// Handle callback (in AuthCallback component)
const user = await handleOAuthCallback(code, state);
```

## Scopes

De volgende OAuth scopes worden aangevraagd:

- `openid` - OpenID Connect
- `email` - Email adres
- `profile` - Profiel informatie
- `https://www.googleapis.com/auth/cloud-platform` - Google Cloud Platform toegang (voor Jules API)

## Troubleshooting

### "redirect_uri_mismatch" Error

- Controleer of de redirect URI exact overeenkomt met wat is geconfigureerd in Google Cloud Console
- Zorg dat je de juiste redirect URI gebruikt (http vs https, trailing slash, etc.)

### "invalid_client" Error

- Controleer of `GOOGLE_CLIENT_SECRET` correct is ingesteld in Vercel environment variables
- Zorg dat de client secret niet is geëxporteerd naar de client-side code

### Token Exchange Fails

- Controleer de serverless function logs in Vercel
- Zorg dat de client secret correct is geconfigureerd
- Controleer of de authorization code niet is verlopen (moet binnen enkele minuten worden gebruikt)

## Security Best Practices

1. **Nooit** de client secret in client-side code plaatsen
2. **Altijd** de client secret via environment variables configureren
3. De client secret JSON file staat in `.gitignore` en wordt niet gecommit
4. Gebruik HTTPS in productie
5. Valideer altijd de OAuth state parameter voor CSRF bescherming

## Referenties

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)

