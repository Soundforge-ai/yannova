#!/bin/bash

# Run script voor Java Gen AI project

export GOOGLE_API_KEY=AQ.Ab8RN6JwFfUDrVT9hAjL-jnq9SAYxJFS9ApjDC-Xla-CF_qX8Q
export GOOGLE_GENAI_USE_VERTEXAI=True

echo "🚀 Running Gen AI Example..."
mvn exec:java -Dexec.mainClass="be.yannova.genai.Example"

