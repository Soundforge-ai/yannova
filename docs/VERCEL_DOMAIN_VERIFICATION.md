# Vercel Domain Verificatie - www.yannova.be

## 📋 Situatie

Het domein `www.yannova.be` is momenteel gekoppeld aan een ander Vercel account en moet worden geverifieerd om het te kunnen gebruiken met het huidige project.

## 🔧 Stappen om het domein te verifiëren

### Stap 1: Haal de volledige verificatiewaarde op

1. Ga naar [Vercel Dashboard](https://vercel.com/onyx-web/yannova/settings/domains)
2. Zoek het domein `www.yannova.be`
3. Klik op de **kopieer knop** naast de **Value** in het TXT record
4. De volledige waarde ziet er zo uit:
   ```
   vc-domain-verify=www.yannova.be,012ecdb50e6075119eab[rest van de waarde]
   ```

### Stap 2: Voeg TXT record toe in Cloudflare

1. **Log in op Cloudflare**
   - Ga naar: https://dash.cloudflare.com/
   - Selecteer het account waar `yannova.be` staat

2. **Selecteer het domein**
   - Klik op `yannova.be` in je dashboard

3. **Ga naar DNS instellingen**
   - Klik op **DNS** in de linker navigatie
   - Klik op **Records**

4. **Voeg nieuw TXT record toe**
   - Klik op **Add record**
   - Vul in:
     - **Type**: `TXT`
     - **Name**: `_vercel` (alleen `_vercel`, niet `_vercel.yannova.be`)
     - **Content/Value**: Plak de volledige waarde die je hebt gekopieerd uit Vercel
     - **TTL**: `Auto` of `3600`
     - **Proxy status**: Zorg dat de wolk **grijs** is (DNS only), niet oranje (proxied)
   - Klik op **Save**

### Stap 3: Wacht op DNS propagatie

- DNS wijzigingen kunnen 1-15 minuten duren om te propageren
- Soms kan het langer duren (tot 24 uur, maar meestal veel sneller)

### Stap 4: Verifieer in Vercel

1. Ga terug naar [Vercel Dashboard](https://vercel.com/onyx-web/yannova/settings/domains)
2. Klik op **Refresh** naast het domein `www.yannova.be`
3. Als de verificatie succesvol is, zie je een groene checkmark ✅

## 🔍 Controleren of het werkt

Je kunt het verificatie script gebruiken:

```bash
./scripts/verify-vercel-domain.sh
```

Of controleer handmatig:

```bash
dig +short TXT _vercel.yannova.be
```

Je zou dan de verificatiewaarde moeten zien.

## ⚠️ Belangrijke opmerkingen

- **Proxy status**: Het TXT record moet **DNS only** zijn (grijze wolk), niet geproxied (oranje wolk)
- **Name veld**: Gebruik alleen `_vercel`, niet `_vercel.yannova.be` (Cloudflare voegt automatisch het domein toe)
- **Volledige waarde**: Zorg dat je de **volledige** verificatiewaarde kopieert, inclusief alles na de komma

## 🐛 Problemen oplossen

### Het TXT record wordt niet gevonden
- Wacht 5-10 minuten en probeer opnieuw
- Controleer of de proxy status op "DNS only" staat
- Verifieer dat de Name exact `_vercel` is

### Vercel toont nog steeds "Verification Needed"
- Klik op **Refresh** in Vercel
- Wacht nog een paar minuten
- Controleer of het TXT record correct is met: `dig +short TXT _vercel.yannova.be`

### Het domein werkt niet na verificatie
- Controleer of het CNAME record voor `www.yannova.be` nog correct is
- Het zou moeten wijzen naar: `a41093cb64c5c9a2.vercel-dns-017.com.`

## 📞 Hulp nodig?

Als het na 30 minuten nog steeds niet werkt:
1. Controleer de DNS records met het verificatie script
2. Neem contact op met Vercel support
3. Controleer of er geen conflicterende records zijn in Cloudflare

