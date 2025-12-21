# Google Cloud Console - Stap voor Stap Configuratie

## 📍 Project: `gen-lang-client-0141118397`

---

## Stap 1: Ga naar Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Zorg dat je ingelogd bent met het juiste Google account
3. Selecteer project: **`gen-lang-client-0141118397`**
   - Als je het project niet ziet, gebruik de project selector bovenaan

---

## Stap 2: OAuth 2.0 Client ID Controleren

1. Navigeer naar **APIs & Services** → **Credentials**
   - Link: https://console.cloud.google.com/apis/credentials?project=gen-lang-client-0141118397
2. Zoek naar je **OAuth 2.0 Client ID**
3. Klik op de Client ID om de details te bekijken

**Noteer de volgende informatie:**
- ✅ Client ID: `___________________________`
- ✅ Client Secret: `___________________________` (als deze zichtbaar is)

---

## Stap 3: Redirect URIs Controleren en Toevoegen

### 3.1 Controleer Bestaande Redirect URIs

In de Client ID details, scroll naar **Authorized redirect URIs**

**Verwachte Redirect URIs:**
- ✅ `https://www.yannova.be/admin`
- ✅ `https://www.yannova.be`
- ✅ `https://www.yannova.be/auth/callback` (mogelijk nodig)
- ✅ `http://localhost:3002/auth/callback` (voor lokale development)
- ✅ `http://localhost:5173/auth/callback` (als je Vite dev server op poort 5173 draait)

### 3.2 Ontbrekende URIs Toevoegen

Als een URI ontbreekt:
1. Klik op **+ ADD URI**
2. Voer de exacte URI in (let op http vs https, trailing slashes, etc.)
3. Klik op **SAVE**

**⚠️ Belangrijk:**
- URIs moeten **exact** overeenkomen (inclusief protocol, poort, pad)
- Geen trailing slashes toevoegen tenzij nodig
- Controleer of je `http://` of `https://` gebruikt

---

## Stap 4: OAuth Scopes Verifiëren

### 4.1 Controleer OAuth Consent Screen

1. Navigeer naar **APIs & Services** → **OAuth consent screen**
   - Link: https://console.cloud.google.com/apis/credentials/consent?project=gen-lang-client-0141118397

### 4.2 Verifieer Scopes

De volgende scopes moeten zijn toegevoegd:
- ✅ `openid` - OpenID Connect
- ✅ `email` - Email adres
- ✅ `profile` - Profiel informatie
- ✅ `https://www.googleapis.com/auth/cloud-platform` - Google Cloud Platform toegang (voor Jules API)

**Als scopes ontbreken:**
1. Klik op **EDIT APP**
2. Scroll naar **Scopes**
3. Klik op **ADD OR REMOVE SCOPES**
4. Zoek en selecteer de ontbrekende scopes
5. Klik op **UPDATE** en **SAVE**

---

## Stap 5: OAuth Consent Screen Configureren

### 5.1 Basis Informatie

1. **User Type**: 
   - Kies **External** (voor publieke toegang) of **Internal** (alleen voor je organisatie)
   - Voor productie: meestal **External**

2. **App information**:
   - **App name**: `Yannova Admin` (of een andere naam)
   - **User support email**: Je email adres
   - **App logo**: Optioneel, upload een logo

3. **App domain**:
   - **Application home page**: `https://www.yannova.be`
   - **Application privacy policy link**: Optioneel
   - **Application terms of service link**: Optioneel

4. **Authorized domains**:
   - Voeg toe: `yannova.be`
   - Voeg toe: `localhost` (voor development)

5. **Developer contact information**:
   - **Email addresses**: Je email adres

### 5.2 Test Users (als app in Testing mode staat)

Als je app in **Testing** mode staat:
1. Scroll naar **Test users**
2. Klik op **+ ADD USERS**
3. Voeg de volgende email adressen toe:
   - `innovar.labs7@gmail.com`
   - `windowpro.be@gmail.com`
   - `info@yannova.be`
   - `roustamyandiev00@gmail.com`
4. Klik op **ADD**

### 5.3 Publiceren (voor Productie)

Als je app klaar is voor productie:
1. Scroll naar boven
2. Klik op **PUBLISH APP**
3. Bevestig de publicatie

**⚠️ Let op:** 
- Voor productie moet je mogelijk verificatie aanvragen bij Google
- Dit kan enkele dagen duren
- Voor testing mode kun je tot 100 test users toevoegen

---

## Stap 6: Client Secret Roteren (ALLEEN als nodig)

### ⚠️ WANNEER ROTEREN?

Roteer de client secret **ALLEEN** als:
- ✅ De secret is gecommit naar git (gecheckt in git history)
- ✅ De secret is gedeeld met onbevoegden
- ✅ Je vermoedt dat de secret is gecompromitteerd

### 6.1 Nieuwe Secret Aanmaken

1. Ga naar **APIs & Services** → **Credentials**
2. Klik op je OAuth 2.0 Client ID
3. Klik op **RESET SECRET** (of maak een nieuwe aan)
4. **Kopieer de nieuwe secret** (je ziet deze maar één keer!)
5. Klik op **DONE**

### 6.2 Oude Secret Vervangen

1. Update `GOOGLE_CLIENT_SECRET` in Vercel environment variables
2. Update `.env.local` voor lokale development
3. **Verwijder de oude secret** uit alle plaatsen waar deze is opgeslagen

---

## Stap 7: API's Verifiëren

### 7.1 Controleer Geactiveerde API's

1. Navigeer naar **APIs & Services** → **Library**
   - Link: https://console.cloud.google.com/apis/library?project=gen-lang-client-0141118397

2. Zoek en controleer of de volgende API's zijn geactiveerd:
   - ✅ **Google+ API** (voor user info)
   - ✅ **Google Cloud Platform API** (voor Jules API)
   - ✅ **Identity and Access Management (IAM) API** (als nodig)

3. Als een API niet is geactiveerd:
   - Klik op de API
   - Klik op **ENABLE**

---

## Stap 8: Credentials Noteren

**⚠️ BELANGRIJK: Bewaar deze informatie veilig!**

Noteer de volgende informatie (maar **deel deze nooit** publiekelijk):

```
Client ID: ________________________________
Client Secret: ________________________________
Project ID: gen-lang-client-0141118397
```

**Gebruik deze credentials voor:**
- Environment variables in Vercel
- `.env.local` bestand voor lokale development

---

## ✅ Checklist

Gebruik deze checklist om te verifiëren dat alles is geconfigureerd:

- [ ] Project `gen-lang-client-0141118397` is geselecteerd
- [ ] OAuth 2.0 Client ID is gevonden
- [ ] Alle redirect URIs zijn toegevoegd:
  - [ ] `https://www.yannova.be/admin`
  - [ ] `https://www.yannova.be`
  - [ ] `https://www.yannova.be/auth/callback`
  - [ ] `http://localhost:3002/auth/callback`
  - [ ] `http://localhost:5173/auth/callback` (als nodig)
- [ ] Alle OAuth scopes zijn toegevoegd:
  - [ ] `openid`
  - [ ] `email`
  - [ ] `profile`
  - [ ] `https://www.googleapis.com/auth/cloud-platform`
- [ ] OAuth Consent Screen is geconfigureerd:
  - [ ] App naam is ingesteld
  - [ ] Support email is ingesteld
  - [ ] Test users zijn toegevoegd (als in Testing mode)
  - [ ] App is gepubliceerd (als voor productie)
- [ ] Benodigde API's zijn geactiveerd
- [ ] Client ID en Secret zijn veilig genoteerd
- [ ] Client Secret is geroteerd (als nodig)

---

## 🔗 Handige Links

- **Credentials**: https://console.cloud.google.com/apis/credentials?project=gen-lang-client-0141118397
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent?project=gen-lang-client-0141118397
- **API Library**: https://console.cloud.google.com/apis/library?project=gen-lang-client-0141118397
- **Project Dashboard**: https://console.cloud.google.com/home/dashboard?project=gen-lang-client-0141118397

---

## 🆘 Troubleshooting

### "redirect_uri_mismatch" Error

**Oorzaak**: De redirect URI in je code komt niet overeen met wat is geconfigureerd in Google Cloud Console.

**Oplossing**:
1. Controleer de exacte redirect URI in je code
2. Controleer of deze URI is toegevoegd in Google Cloud Console
3. Let op: http vs https, poort nummers, trailing slashes

### "access_denied" Error

**Oorzaak**: De gebruiker heeft de OAuth toestemming geweigerd, of de app staat in Testing mode en de gebruiker is niet toegevoegd als test user.

**Oplossing**:
1. Controleer of de gebruiker is toegevoegd als test user (als app in Testing mode staat)
2. Controleer of de app is gepubliceerd (als voor productie)

### "invalid_client" Error

**Oorzaak**: Client ID of Client Secret is incorrect.

**Oplossing**:
1. Controleer of de environment variables correct zijn ingesteld
2. Controleer of de Client ID en Secret overeenkomen met Google Cloud Console

---

**Laatste update**: $(date)

