# Google Cloud Storage Setup voor Yannova

## Overzicht

Deze handleiding legt uit hoe je Google Cloud Storage integreert voor het opslaan en beheren van foto's voor de Yannova website.

## Vereisten

1. Google Cloud Project met OAuth 2.0 credentials
2. Google Cloud Storage bucket aangemaakt
3. Node.js en npm geïnstalleerd

## Stap 1: Google Cloud Storage Bucket Aanmaken

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Selecteer je project: `gen-lang-client-0141118397`
3. Ga naar **Cloud Storage** > **Buckets**
4. Klik op **Create Bucket**
5. Configureer:
   - **Name**: `yannova-media`
   - **Location**: `europe-west1` (België/Nederland)
   - **Storage class**: `Standard`
   - **Access control**: `Uniform`
6. Klik **Create**

## Stap 2: Bucket Publiek Maken (Optioneel)

Voor publieke toegang tot foto's:

1. Ga naar je bucket in Cloud Storage
2. Klik op **Permissions** tab
3. Klik **Add Principal**
4. Voeg toe:
   - **Principal**: `allUsers`
   - **Role**: `Storage Object Viewer`
5. Klik **Save**

⚠️ **Let op**: Dit maakt alle bestanden in de bucket publiek toegankelijk. Gebruik dit alleen voor publieke media.

## Stap 3: Dependencies Installeren

De dependencies zijn al geïnstalleerd:

```bash
npm install @google-cloud/storage googleapis
```

## Stap 4: Foto's Uploaden naar Google Cloud Storage

### Optie A: Via Upload Script (Aanbevolen)

1. Zorg dat je foto's in `/Users/innovarslabo/Desktop/foto's` staan
2. Pas de bucket naam aan in `scripts/upload-photos-to-gcs.mjs` indien nodig
3. Run het script:

```bash
node scripts/upload-photos-to-gcs.mjs
```

Het script zal:
- Alle foto's uit de map lezen
- Uploaden naar Google Cloud Storage
- Publieke URLs genereren
- Resultaten opslaan in `upload-results.json`

### Optie B: Handmatig via Google Cloud Console

1. Ga naar je bucket in Cloud Storage
2. Klik **Upload Files**
3. Selecteer je foto's
4. Upload naar de `images/` folder

## Stap 5: Foto's Importeren in Admin Dashboard

### Methode 1: Via Upload Results

1. Run het upload script (zie Stap 4)
2. Zorg dat `upload-results.json` in de `public/` folder staat
3. Ga naar Admin Dashboard > Media tab
4. Klik op **Importeer GCS**
5. Alle succesvol geüploade foto's worden geïmporteerd

### Methode 2: Via URLs

1. Ga naar Admin Dashboard > Media tab
2. Klik op **Importeer URLs**
3. Plak de Google Cloud Storage URLs (één per regel)
4. Klik OK

Voorbeeld URLs:
```
https://storage.googleapis.com/yannova-media/images/Gemini_Generated_Image_12huit12huit12hu.png
https://storage.googleapis.com/yannova-media/images/Gemini_Generated_Image_16tc0t16tc0t16tc.png
```

## Stap 6: Foto's Gebruiken in Website

1. Ga naar Admin Dashboard > Media tab
2. Hover over een foto
3. Klik op het kopieer-icoon (🔗)
4. De URL wordt gekopieerd
5. Gebruik deze URL in de Pagina Editor bij het toevoegen van afbeeldingen

## Configuratie

### Bucket Naam Aanpassen

Als je een andere bucket naam wilt gebruiken:

1. Pas aan in `scripts/upload-photos-to-gcs.mjs`:
   ```javascript
   const BUCKET_NAME = 'jouw-bucket-naam';
   ```

2. Pas aan in `src/lib/mediaStorage.ts`:
   ```typescript
   const GCS_CONFIG = {
     bucketName: 'jouw-bucket-naam',
     // ...
   };
   ```

### Project ID Aanpassen

Het project ID staat in je credentials file:
- Project ID: `gen-lang-client-0141118397`

## Troubleshooting

### "Bucket bestaat niet" Error

**Oplossing**: Maak de bucket aan in Google Cloud Console (zie Stap 1)

### "Permission denied" Error

**Oplossing**: 
1. Controleer of je OAuth credentials correct zijn
2. Zorg dat de bucket bestaat
3. Controleer bucket permissions

### Foto's zijn niet zichtbaar

**Oplossing**:
1. Controleer of de bucket publiek is (Stap 2)
2. Controleer of de URLs correct zijn
3. Controleer browser console voor CORS errors

### Upload script werkt niet

**Oplossing**:
1. Controleer of Node.js geïnstalleerd is: `node --version`
2. Controleer of dependencies geïnstalleerd zijn: `npm install`
3. Controleer of het credentials bestand bestaat
4. Controleer of de foto's map bestaat

## Best Practices

1. **Organiseer foto's in folders**: Gebruik folders zoals `images/projects/`, `images/team/`, etc.
2. **Optimaliseer foto's**: Comprimeer foto's voordat je ze uploadt (max 2MB per foto)
3. **Gebruik CDN**: Overweeg Cloud CDN voor snellere laadtijden
4. **Backup**: Maak regelmatig backups van je bucket
5. **Security**: Gebruik signed URLs voor private content

## Kosten

Google Cloud Storage pricing:
- **Standard Storage**: €0.020 per GB/maand (eerste 5GB gratis)
- **Operations**: €0.05 per 10,000 operations
- **Network egress**: €0.12 per GB (eerste 1GB/maand gratis)

Voor een kleine website met ~100 foto's (ongeveer 50MB):
- **Storage**: Gratis (onder 5GB)
- **Operations**: ~€0.01/maand
- **Totaal**: ~€0.01-0.05/maand

## Volgende Stappen

- [ ] Bucket aanmaken in Google Cloud Console
- [ ] Upload script testen
- [ ] Foto's uploaden
- [ ] Foto's importeren in Admin Dashboard
- [ ] Foto's gebruiken in website content

## Support

Voor vragen of problemen:
1. Controleer de browser console voor errors
2. Controleer Google Cloud Console logs
3. Raadpleeg [Google Cloud Storage documentatie](https://cloud.google.com/storage/docs)

