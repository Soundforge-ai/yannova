# Google OAuth - Wat moet er nog gebeuren?

## 🔴 KRITIEKE SECURITY ISSUES

### 1. **Environment Variables Configureren** ⚠️ URGENT
**Status**: ✅ Code is aangepast om env vars te gebruiken

**Vereiste Environment Variables in Vercel**:
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret (alleen server-side)

---

## 📋 GOOGLE CLOUD CONSOLE TAKEN

### 2. **Redirect URIs Controleren**
**Status**: ⚠️ Te verifiëren

**Verwachte Redirect URIs**:
- `https://www.yannova.be/admin`
- `https://www.yannova.be`
- `http://localhost:3002/auth/callback` (voor lokale development)

---

### 3. **OAuth Scopes Verifiëren**
**Status**: ⚠️ Te controleren

**Verwachte Scopes**:
- `openid` - OpenID Connect
- `email` - Email adres
- `profile` - Profiel informatie

---

## 🔧 VERCEL CONFIGURATIE

### 4. **Environment Variables Instellen**
**Status**: ⚠️ Te verifiëren

**Actie vereist**:
1. Ga naar Vercel project dashboard
2. Navigeer naar **Settings** → **Environment Variables**
3. Voeg toe:
   - `VITE_GOOGLE_CLIENT_ID` (Production, Preview, Development)
   - `GOOGLE_CLIENT_SECRET` (Production, Preview, Development)

---

## 📚 HANDIGE LINKS

- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
