#!/bin/bash

# Download isolatie werken afbeeldingen
echo "Downloading isolatie werken images..."

# Isolatie werken - van Unsplash (gratis stock images)
curl -L -o "public/images/downloads/isolatie-1.jpg" "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" 2>/dev/null
curl -L -o "public/images/downloads/isolatie-2.jpg" "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80" 2>/dev/null
curl -L -o "public/images/downloads/isolatie-3.jpg" "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" 2>/dev/null

# Crepi gevel - van Unsplash
echo "Downloading crepi gevel images..."
curl -L -o "public/images/downloads/crepi-1.jpg" "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 2>/dev/null
curl -L -o "public/images/downloads/crepi-2.jpg" "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" 2>/dev/null
curl -L -o "public/images/downloads/crepi-3.jpg" "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" 2>/dev/null

echo "Download complete!"
ls -lh public/images/downloads/

