# Google Gen AI SDK voor Java - Yannova

## Installatie

### Stap 1: Maven Dependency

De dependency is al toegevoegd aan `pom.xml`:

```xml
<dependency>
    <groupId>com.google.genai</groupId>
    <artifactId>google-genai</artifactId>
    <version>0.7.0</version>
</dependency>
```

### Stap 2: Environment Variables Instellen

Stel de volgende environment variables in:

```bash
export GOOGLE_API_KEY=YOUR_API_KEY
export GOOGLE_GENAI_USE_VERTEXAI=True
```

Of maak een `.env` bestand aan (kopieer van `.env.example`):

```bash
cp .env.example .env
# Bewerk .env en voeg je API key toe
```

### Stap 3: Build en Run

```bash
# Build het project
mvn clean compile

# Run het voorbeeld
mvn exec:java -Dexec.mainClass="be.yannova.genai.Example"

# Of package het project
mvn package
```

## Gebruik

### Basis Gebruik

```java
import be.yannova.genai.GenAIClient;

// Maak een client aan
GenAIClient client = new GenAIClient();

// Genereer content
String response = client.generateContent("Jouw prompt hier");
System.out.println(response);
```

### Met Meerdere Prompts

```java
List<String> prompts = Arrays.asList(
    "Prompt 1",
    "Prompt 2"
);
String response = client.generateContent(prompts);
```

## Environment Variables

| Variable | Beschrijving | Vereist |
|----------|--------------|---------|
| `GOOGLE_API_KEY` | Je Google API key | Ja |
| `GOOGLE_GENAI_USE_VERTEXAI` | Gebruik Vertex AI (True/False) | Nee (default: False) |

## Project Structuur

```
java-genai/
├── pom.xml                          # Maven configuratie
├── src/
│   └── main/
│       └── java/
│           └── be/
│               └── yannova/
│                   └── genai/
│                       ├── GenAIClient.java    # Hoofd client class
│                       └── Example.java        # Voorbeeld gebruik
├── .env.example                     # Environment variables template
└── README.md                        # Deze file
```

## Troubleshooting

### "GOOGLE_API_KEY environment variable is niet ingesteld"
- Zorg dat je de environment variable hebt ingesteld: `export GOOGLE_API_KEY=your_key`
- Of gebruik een `.env` file loader

### "Permission denied" of "Invalid API key"
- Controleer of je API key correct is
- Zorg dat de API key de juiste rechten heeft voor Gen AI

### Vertex AI Errors
- Als je Vertex AI gebruikt, zorg dat je project correct is geconfigureerd
- Controleer of `GOOGLE_GENAI_USE_VERTEXAI=True` is ingesteld

## Meer Informatie

- [Google Gen AI SDK Documentation](https://ai.google.dev/docs)
- [Maven Documentation](https://maven.apache.org/)

