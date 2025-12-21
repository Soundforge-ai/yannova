# Google Cloud Storage Integratie - Quick Start

## Snelle Start

### 1. Bucket Aanmaken

Ga naar [Google Cloud Console](https://console.cloud.google.com/storage) en maak een bucket aan:
- **Naam**: `yannova-media`
- **Locatie**: `europe-west1` (België)

### 2. Foto's Uploaden

```bash
npm run upload-photos
```

Dit upload alle foto's uit `/Users/innovarslabo/Desktop/foto's` naar Google Cloud Storage.

### 3. Foto's Importeren in Admin Dashboard

1. Ga naar Admin Dashboard > **Media** tab
2. Klik op **Importeer GCS**
3. Alle geüploade foto's worden geïmporteerd

### 4. Foto's Gebruiken

1. Hover over een foto in de Media Bibliotheek
2. Klik op het kopieer-icoon (🔗)
3. Plak de URL in de Pagina Editor

## Handmatige Import via URLs

Als je foto's al in Google Cloud Storage staan:

1. Ga naar Admin Dashboard > **Media** tab
2. Klik op **Importeer URLs**
3. Plak de URLs (één per regel):
   ```
   https://storage.googleapis.com/yannova-media/images/foto1.png
   https://storage.googleapis.com/yannova-media/images/foto2.png
   ```

## Configuratie

### Bucket Naam Aanpassen

Pas aan in:
- `scripts/upload-photos-to-gcs.mjs` → `BUCKET_NAME`
- `src/lib/mediaStorage.ts` → `GCS_CONFIG.bucketName`

## Meer Informatie

Zie [docs/GOOGLE_CLOUD_STORAGE_SETUP.md](docs/GOOGLE_CLOUD_STORAGE_SETUP.md) voor volledige documentatie.

