# Google Cloud Storage Bucket Setup

## ⚠️ Belangrijk: Bucket moet eerst worden aangemaakt!

Het upload script kan de bucket **niet automatisch aanmaken** omdat dit speciale rechten vereist. Volg deze stappen om de bucket handmatig aan te maken.

## Stap-voor-stap Instructies

### 1. Ga naar Google Cloud Console

Open: https://console.cloud.google.com/storage/browser?project=gen-lang-client-0141118397

### 2. Maak Bucket Aan

1. Klik op **"CREATE BUCKET"** (of "BUCKET MAKEN")
2. Vul de volgende gegevens in:

   **Bucket naam:**
   ```
   yannova-media
   ```
   
   **Location type:**
   - Selecteer: **Region**
   - Kies: **europe-west1 (Belgium)** (voor GDPR compliance)
   
   **Storage class:**
   - Selecteer: **Standard**
   
   **Access control:**
   - Selecteer: **Uniform** (aanbevolen)
   
   **Protection:**
   - Laat standaard instellingen staan

3. Klik op **"CREATE"**

### 3. Maak Bucket Publiek (voor publieke foto's)

Na het aanmaken van de bucket:

1. Klik op de bucket naam (`yannova-media`)
2. Ga naar het **"Permissions"** tabblad
3. Klik op **"GRANT ACCESS"** (of "TOEGANG VERLENEN")
4. Voeg toe:
   - **Principal**: `allUsers`
   - **Role**: `Storage Object Viewer`
5. Klik op **"SAVE"**

⚠️ **Let op**: Dit maakt alle bestanden in de bucket publiek toegankelijk. Gebruik dit alleen voor publieke media.

### 4. Test Upload Script

Na het aanmaken van de bucket, run het upload script:

```bash
npm run upload-photos
```

Het script zal nu:
- ✅ De bucket vinden
- ✅ Foto's uit `public/images/` uploaden
- ✅ Foto's uit `Desktop/foto's` uploaden (als deze map bestaat)
- ✅ Publieke URLs genereren
- ✅ Resultaten opslaan in `upload-results.json`

## Troubleshooting

### "Bucket bestaat niet" Error

**Oplossing**: Volg de stappen hierboven om de bucket aan te maken.

### "Permission denied" Error

**Oplossing**: 
1. Controleer of je bent ingelogd met het juiste Google account
2. Controleer of je toegang hebt tot project `gen-lang-client-0141118397`
3. Vraag de project administrator om je de juiste rechten te geven:
   - `Storage Admin` of
   - `Storage Object Admin`

### "Bucket is niet publiek" Error

**Oplossing**: Volg stap 3 hierboven om de bucket publiek te maken.

## Bucket Configuratie Samenvatting

- **Bucket naam**: `yannova-media`
- **Project ID**: `gen-lang-client-0141118397`
- **Location**: `europe-west1` (Belgium)
- **Storage class**: `Standard`
- **Access control**: `Uniform`
- **Public access**: `allUsers` met `Storage Object Viewer` role

## Na Upload

Na het uploaden van foto's:

1. **Check upload-results.json**: Bevat alle geüploade foto's met URLs
2. **Importeer in Admin Dashboard**: 
   - Ga naar Admin Dashboard > Media tab
   - Klik op "Importeer GCS"
   - Alle foto's worden geïmporteerd

## Handige Links

- **Storage Console**: https://console.cloud.google.com/storage/browser?project=gen-lang-client-0141118397
- **Bucket Settings**: https://console.cloud.google.com/storage/browser/yannova-media?project=gen-lang-client-0141118397
- **IAM & Admin**: https://console.cloud.google.com/iam-admin/iam?project=gen-lang-client-0141118397

---

**Laatste update**: $(date)

