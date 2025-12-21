#!/bin/bash

# Script om Yannova website te deployen naar Google Cloud

set -e

PROJECT_ID="gen-lang-client-0141118397"
BUCKET_NAME="yannova-website"
REGION="europe-west1"
SERVICE_NAME="yannova"

echo "🚀 Google Cloud Deployment - Yannova"
echo "===================================="
echo ""

# Controleer of gcloud CLI is geïnstalleerd
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is niet geïnstalleerd."
    echo "   Installeer via: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Controleer of je bent ingelogd
echo "🔐 Controleren authenticatie..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "⚠️  Je bent niet ingelogd. Log in met:"
    echo "   gcloud auth login"
    exit 1
fi

# Stel project in
echo "📋 Project instellen: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build de applicatie
echo ""
echo "🔨 Building applicatie..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build mislukt - dist folder niet gevonden"
    exit 1
fi

echo "✅ Build succesvol"
echo ""

# Optie 1: Cloud Storage + Cloud CDN (Statische hosting)
echo "📦 OPTIE 1: Deployen naar Cloud Storage (Statische hosting)"
echo "------------------------------------------------------------"
echo "Dit is de beste optie voor een React/Vite app"
echo ""

# Maak bucket aan als deze niet bestaat
if ! gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
    echo "📦 Bucket aanmaken: $BUCKET_NAME"
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME
    
    # Maak bucket publiek
    echo "🌐 Bucket publiek maken..."
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
    
    # Configureer website hosting
    echo "⚙️  Website hosting configureren..."
    gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
else
    echo "✅ Bucket bestaat al: $BUCKET_NAME"
fi

# Upload bestanden
echo ""
echo "📤 Bestanden uploaden naar Cloud Storage..."
gsutil -m rsync -r -d dist/ gs://$BUCKET_NAME/

echo ""
echo "✅ Deployment naar Cloud Storage voltooid!"
echo ""
echo "🌐 Je website is beschikbaar op:"
echo "   https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo ""
echo "📝 Om een custom domain te koppelen:"
echo "   1. Maak een Cloud Load Balancer aan"
echo "   2. Configureer Cloud CDN"
echo "   3. Koppel je domein (www.yannova.be)"
echo ""

# Optie 2: App Engine (als je server-side code hebt)
echo ""
echo "📦 OPTIE 2: Deployen naar App Engine (Server-side)"
echo "--------------------------------------------------"
echo "Gebruik dit als je API routes of server-side code hebt"
echo ""
read -p "Wil je ook naar App Engine deployen? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deployen naar App Engine..."
    gcloud app deploy app.yaml --quiet
    
    echo ""
    echo "✅ Deployment naar App Engine voltooid!"
    echo "🌐 Je website is beschikbaar op:"
    gcloud app browse
fi

echo ""
echo "✨ Deployment voltooid!"

