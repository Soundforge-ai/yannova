#!/bin/bash

# Build script voor Java Gen AI project

export GOOGLE_API_KEY=AQ.Ab8RN6JwFfUDrVT9hAjL-jnq9SAYxJFS9ApjDC-Xla-CF_qX8Q
export GOOGLE_GENAI_USE_VERTEXAI=True

echo "🔨 Building Java Gen AI project..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Build succesvol!"
    echo ""
    echo "📝 Om het voorbeeld te runnen:"
    echo "   ./run.sh"
else
    echo "❌ Build mislukt"
    exit 1
fi

