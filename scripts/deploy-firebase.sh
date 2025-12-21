#!/bin/bash

# Script om Yannova website te deployen naar Firebase Hosting

set -e

PROJECT_ID="numeric-zoo-481517-s3"

echo "🔥 Firebase Hosting Deployment - Yannova"
echo "===================================="
echo ""

# Controleer of Firebase CLI is geïnstalleerd
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is niet geïnstalleerd."
    echo "   Installeer via: npm install -g firebase-tools"
    exit 1
fi

# Controleer of je bent ingelogd
echo "🔐 Controleren authenticatie..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Je bent niet ingelogd. Log in met:"
    echo "   firebase login"
    exit 1
fi

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

# Deploy naar Firebase Hosting
echo "🚀 Deployen naar Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

echo ""
echo "✅ Deployment voltooid!"
echo ""
echo "🌐 Je website is beschikbaar op:"
echo "   https://$PROJECT_ID.web.app"
echo "   https://$PROJECT_ID.firebaseapp.com"
echo ""
echo "📝 Om een custom domain (www.yannova.be) te koppelen:"
echo "   1. Ga naar: https://console.firebase.google.com/project/$PROJECT_ID/hosting"
echo "   2. Klik op 'Add custom domain'"
echo "   3. Voer in: www.yannova.be"
echo "   4. Volg de DNS instructies"

