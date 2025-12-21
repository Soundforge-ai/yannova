# Google Gen AI SDK voor Java - Setup

## Installatie

### Stap 1: Maven Dependency

Voeg de volgende dependency toe aan je `pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>com.google.genai</groupId>
    <artifactId>google-genai</artifactId>
    <version>0.7.0</version>
  </dependency>
</dependencies>
```

### Stap 2: Environment Variables

Stel de volgende environment variables in:

```bash
export GOOGLE_API_KEY=YOUR_API_KEY
export GOOGLE_GENAI_USE_VERTEXAI=True
```

**Belangrijk**: 
- Vervang `YOUR_API_KEY` met je daadwerkelijke Google API key
- `GOOGLE_GENAI_USE_VERTEXAI=True` betekent dat je Vertex AI gebruikt
- Zet dit op `False` of laat het weg als je de standaard API gebruikt

### Stap 3: Build

```bash
cd java-genai
mvn clean install
```

## Project Locatie

Het Java project staat in: `/Users/innovarslabo/Desktop/yannova/java-genai/`

## Gebruik

Zie `java-genai/README.md` voor volledige gebruiksinstructies.

## API Key Ophalen

1. Ga naar: https://aistudio.google.com/apikey
2. Maak een nieuwe API key aan
3. Kopieer de key en gebruik deze voor `GOOGLE_API_KEY`

## Vertex AI vs Standaard API

- **Vertex AI**: Vereist Google Cloud project setup, meer features
- **Standaard API**: Eenvoudiger, directe API calls

Voor de meeste use cases is de standaard API voldoende.

