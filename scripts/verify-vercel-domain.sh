#!/bin/bash

# Script om Vercel domain verificatie te controleren en te helpen met setup

DOMAIN="yannova.be"
SUBDOMAIN="_vercel"
FULL_DOMAIN="${SUBDOMAIN}.${DOMAIN}"

echo "🔍 Vercel Domain Verificatie Helper"
echo "===================================="
echo ""

# Controleer huidige TXT records
echo "📋 Huidige DNS configuratie voor ${FULL_DOMAIN}:"
echo "----------------------------------------"
TXT_RECORDS=$(dig +short TXT "${FULL_DOMAIN}" 2>/dev/null)

if [ -z "$TXT_RECORDS" ]; then
    echo "❌ Geen TXT record gevonden voor ${FULL_DOMAIN}"
    echo ""
    echo "⚠️  Het TXT record moet nog worden toegevoegd in Cloudflare!"
else
    echo "✅ TXT record(s) gevonden:"
    echo "$TXT_RECORDS" | while read -r record; do
        echo "   $record"
        if [[ "$record" == *"vc-domain-verify"* ]]; then
            echo "   ✓ Dit lijkt een Vercel verificatie record te zijn"
        fi
    done
fi

echo ""
echo "📝 Instructies voor Cloudflare:"
echo "----------------------------------------"
echo "1. Ga naar https://dash.cloudflare.com/"
echo "2. Selecteer het domein: ${DOMAIN}"
echo "3. Ga naar DNS → Records"
echo "4. Klik op 'Add record'"
echo "5. Vul in:"
echo "   - Type: TXT"
echo "   - Name: ${SUBDOMAIN}"
echo "   - Content: vc-domain-verify=www.${DOMAIN},012ecdb50e6075119eab..."
echo "   - TTL: Auto"
echo "   - Proxy status: DNS only (grijze wolk)"
echo "6. Klik op 'Save'"
echo ""
echo "⏳ Na het toevoegen kan het enkele minuten duren voordat DNS is gepropageerd."
echo ""

# Controleer CNAME voor www
echo "🌐 CNAME configuratie voor www.${DOMAIN}:"
echo "----------------------------------------"
CNAME=$(dig +short www.${DOMAIN} CNAME 2>/dev/null)
if [ -n "$CNAME" ]; then
    echo "✅ CNAME record gevonden:"
    echo "   www.${DOMAIN} → $CNAME"
    if [[ "$CNAME" == *"vercel"* ]]; then
        echo "   ✓ Dit wijst naar Vercel"
    fi
else
    echo "⚠️  Geen CNAME record gevonden"
fi

echo ""
echo "🔄 Om te controleren of het TXT record werkt, voer dit script opnieuw uit na het toevoegen."

