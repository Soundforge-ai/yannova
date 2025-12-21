# Google Cloud Setup - numeric-zoo-481517-s3

## Project Informatie

- **Project ID**: `numeric-zoo-481517-s3`
- **Client ID**: `[REDACTED]`
- **Client Secret**: `[REDACTED]`

## Stappen om Deployment uit te voeren

### Stap 1: Log in met het juiste Google Account

Het project `numeric-zoo-481517-s3` is gekoppeld aan een ander Google account.

**Optie A: Wissel naar het juiste account**
```bash
# Bekijk beschikbare accounts
gcloud auth list

# Wissel naar het juiste account (vervang met het juiste email)
gcloud config set account [jouw-email@gmail.com]

# Log opnieuw in indien nodig
gcloud auth login
```

**Optie B: Log in met het account dat toegang heeft tot het project**
```bash
gcloud auth login
# Volg de instructies in de browser
```

### Stap 2: Activeer Billing Account

Het project heeft momenteel geen actief billing account. Dit is nodig voor Cloud Storage.

1. Ga naar: https://console.cloud.google.com/billing?project=numeric-zoo-481517-s3
2. Koppel een billing account aan het project
3. Of maak een nieuw billing account aan

### Stap 3: Stel Project in

```bash
gcloud config set project numeric-zoo-481517-s3
```

### Stap 4: Deploy naar Cloud Storage

```bash
# Maak bucket aan
gsutil mb -p numeric-zoo-481517-s3 -c STANDARD -l europe-west1 gs://yannova-website

# Maak bucket publiek
gsutil iam ch allUsers:objectViewer gs://yannova-website

# Configureer website hosting
gsutil web set -m index.html -e index.html gs://yannova-website

# Upload bestanden
gsutil -m rsync -r -d dist/ gs://yannova-website/
```

### Stap 5: Of gebruik het deployment script

```bash
# Update het script met het juiste project ID
# Dan run:
./scripts/deploy-gcloud.sh
```

## Troubleshooting

### "Permission denied" Error
- Controleer of je bent ingelogd met het juiste account
- Controleer of je toegang hebt tot het project
- Vraag de project owner om je toegang te geven

### "Billing account disabled" Error
- Activeer billing voor het project
- Koppel een billing account

### "Project not found" Error
- Controleer of het project ID correct is: `numeric-zoo-481517-s3`
- Controleer of je toegang hebt tot het project

## Handige Commands

```bash
# Bekijk huidige account
gcloud auth list

# Wissel account
gcloud config set account [email]

# Bekijk huidig project
gcloud config get-value project

# Stel project in
gcloud config set project numeric-zoo-481517-s3

# Test toegang
gcloud projects describe numeric-zoo-481517-s3
```
