# Google Cloud Deployment - Yannova Website

## Overzicht

Deze handleiding legt uit hoe je de Yannova website deployt naar Google Cloud Platform.

## Opties

Er zijn twee hoofdopties voor deployment:

### 1. Cloud Storage + Cloud CDN (Aanbevolen voor statische sites)
- **Geschikt voor**: React/Vite apps zonder server-side code
- **Voordelen**: Goedkoop, snel, eenvoudig
- **Kosten**: Zeer laag (paar centen per maand voor kleine sites)

### 2. App Engine (Voor server-side code)
- **Geschikt voor**: Apps met API routes of server-side rendering
- **Voordelen**: Volledige server ondersteuning
- **Kosten**: Pay-as-you-go, gratis tier beschikbaar

## Vereisten

1. **Google Cloud Project**
   - Project ID: `gen-lang-client-0141118397`
   - Actief Google Cloud account

2. **gcloud CLI geïnstalleerd**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Of download van: https://cloud.google.com/sdk/docs/install
   ```

3. **Authenticatie**
   ```bash
   gcloud auth login
   gcloud config set project gen-lang-client-0141118397
   ```

## Stap 1: Installeer Dependencies

```bash
npm install
```

## Stap 2: Build de Applicatie

```bash
npm run build
```

Dit maakt een `dist/` folder met alle statische bestanden.

## Stap 3: Deploy naar Google Cloud

### Optie A: Via Deployment Script (Aanbevolen)

```bash
chmod +x scripts/deploy-gcloud.sh
./scripts/deploy-gcloud.sh
```

Het script zal:
1. Controleren of je bent ingelogd
2. De applicatie builden
3. Een Cloud Storage bucket aanmaken (als deze niet bestaat)
4. Bestanden uploaden naar Cloud Storage
5. Optioneel deployen naar App Engine

### Optie B: Handmatig naar Cloud Storage

```bash
# Stel project in
gcloud config set project gen-lang-client-0141118397

# Maak bucket aan (eenmalig)
gsutil mb -p gen-lang-client-0141118397 -c STANDARD -l europe-west1 gs://yannova-website

# Maak bucket publiek
gsutil iam ch allUsers:objectViewer gs://yannova-website

# Configureer website hosting
gsutil web set -m index.html -e index.html gs://yannova-website

# Upload bestanden
gsutil -m rsync -r -d dist/ gs://yannova-website/
```

### Optie C: Via App Engine

```bash
# Deploy naar App Engine
gcloud app deploy app.yaml

# Bekijk je website
gcloud app browse
```

## Stap 4: Custom Domain Koppelen (www.yannova.be)

### Via Cloud Storage + Cloud CDN

1. **Maak een Cloud Load Balancer aan**
   - Ga naar: https://console.cloud.google.com/net-services/loadbalancing
   - Klik op "Create Load Balancer"
   - Kies "HTTP(S) Load Balancing"
   - Configureer backend: Cloud Storage bucket
   - Configureer frontend: HTTPS met je SSL certificaat

2. **Configureer Cloud CDN**
   - Enable Cloud CDN in de Load Balancer configuratie
   - Configureer caching regels

3. **Koppel je domein**
   - Voeg een A record toe in je DNS (Cloudflare):
     - Type: A
     - Name: @
     - Value: [IP van Load Balancer]
   - Voeg een CNAME toe:
     - Type: CNAME
     - Name: www
     - Value: [Load Balancer hostname]

### Via App Engine

1. **Verifieer domein eigendom**
   ```bash
   gcloud app domains verify www.yannova.be
   ```

2. **Koppel domein**
   ```bash
   gcloud app domains map www.yannova.be
   ```

3. **Update DNS records**
   - Voeg een CNAME toe in Cloudflare:
     - Type: CNAME
     - Name: www
     - Value: [App Engine hostname]

## Environment Variables

Voor productie, stel environment variables in via:

### Cloud Storage (via Load Balancer)
- Configureer via Cloud Console → Load Balancer → Backend configuratie

### App Engine
```bash
# Via gcloud CLI
gcloud app deploy app.yaml --set-env-vars KEY1=value1,KEY2=value2

# Of via app.yaml
env_variables:
  VITE_GLM_API_KEY: your_key_here
  GEMINI_API_KEY: your_key_here
```

## Automatische Deployment (CI/CD)

### GitHub Actions

Maak `.github/workflows/deploy-gcloud.yml`:

```yaml
name: Deploy to Google Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Setup gcloud
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: gen-lang-client-0141118397
      
      - name: Deploy to Cloud Storage
        run: |
          gsutil -m rsync -r -d dist/ gs://yannova-website/
```

## Kosten

### Cloud Storage + Cloud CDN
- **Storage**: ~$0.02 per GB/maand
- **Bandwidth**: ~$0.08 per GB (eerste 10TB)
- **CDN**: ~$0.08 per GB
- **Geschat voor kleine site**: €1-5 per maand

### App Engine
- **Free tier**: 28 uur/dag gratis
- **Daarna**: Pay-as-you-go
- **Geschat voor kleine site**: €0-10 per maand

## Troubleshooting

### "Permission denied" bij bucket aanmaken
- Controleer of je bent ingelogd: `gcloud auth list`
- Controleer project rechten: `gcloud projects get-iam-policy gen-lang-client-0141118397`

### Website laadt niet
- Controleer bucket permissions: `gsutil iam get gs://yannova-website`
- Controleer website configuratie: `gsutil web get gs://yannova-website`

### Build errors
- Zorg dat alle dependencies zijn geïnstalleerd: `npm install`
- Controleer Node.js versie: `node --version` (moet 18+ zijn)

## Handige Commands

```bash
# Bekijk deployment status
gcloud app versions list

# Bekijk logs
gcloud app logs tail

# Verwijder oude deployments
gsutil -m rm -r gs://yannova-website/**

# Update bestanden
gsutil -m rsync -r -d dist/ gs://yannova-website/
```

## Meer Informatie

- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Cloud CDN Documentation](https://cloud.google.com/cdn/docs)

