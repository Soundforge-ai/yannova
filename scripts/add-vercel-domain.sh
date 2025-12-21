#!/bin/bash

# Script om www.yannova.be toe te voegen aan Vercel project

PROJECT_NAME="yannova"
DOMAIN="www.yannova.be"

echo "🌐 Vercel Domain Toevoegen - $DOMAIN"
echo "===================================="
echo ""

# Controleer of we in het juiste project zijn
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ Geen .vercel/project.json gevonden. Zorg dat je in het project directory bent."
    exit 1
fi

PROJECT_ID=$(cat .vercel/project.json | python3 -c "import sys, json; print(json.load(sys.stdin)['projectId'])" 2>/dev/null)
echo "📋 Project ID: $PROJECT_ID"
echo ""

# Optie 1: Via Vercel Dashboard (aanbevolen)
echo "📝 OPTIE 1: Via Vercel Dashboard (Aanbevolen)"
echo "----------------------------------------"
echo "1. Ga naar: https://vercel.com/onyx-web/$PROJECT_NAME/settings/domains"
echo "2. Klik op 'Add Domain'"
echo "3. Voer in: $DOMAIN"
echo "4. Volg de instructies voor verificatie"
echo ""

# Optie 2: Via CLI (als beschikbaar)
echo "📝 OPTIE 2: Via Vercel CLI"
echo "----------------------------------------"
echo "Probeer het volgende commando:"
echo "  vercel domains add $DOMAIN"
echo ""

# Controleer huidige DNS configuratie
echo "🔍 Huidige DNS Configuratie:"
echo "----------------------------------------"
echo "CNAME voor $DOMAIN:"
CNAME=$(dig +short $DOMAIN CNAME 2>/dev/null)
if [ -n "$CNAME" ]; then
    echo "  ✅ $DOMAIN → $CNAME"
else
    echo "  ⚠️  Geen CNAME record gevonden"
fi

echo ""
echo "TXT record voor _vercel.yannova.be:"
TXT=$(dig +short TXT _vercel.yannova.be 2>/dev/null)
if [ -n "$TXT" ]; then
    echo "  ✅ TXT record gevonden:"
    echo "     $TXT"
else
    echo "  ⚠️  Geen TXT record gevonden - moet worden toegevoegd in Cloudflare"
fi

echo ""
echo "📚 Voor volledige instructies, zie: docs/VERCEL_DOMAIN_VERIFICATION.md"

