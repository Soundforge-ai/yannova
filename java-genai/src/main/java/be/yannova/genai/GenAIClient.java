package be.yannova.genai;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import okhttp3.*;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

/**
 * Google Gen AI REST API Client voor Yannova
 * 
 * Environment variables vereist:
 * - GOOGLE_API_KEY: Je Google API key
 * - GOOGLE_GENAI_USE_VERTEXAI: True als je Vertex AI gebruikt (optioneel)
 */
public class GenAIClient {
    
    private static final String VERTEX_AI_BASE_URL = "https://aiplatform.googleapis.com/v1/publishers/google/models";
    private static final String DEFAULT_MODEL = "gemini-2.5-flash-lite";
    
    private final String apiKey;
    private final boolean useVertexAI;
    private final OkHttpClient httpClient;
    private final Gson gson;
    
    public GenAIClient() {
        this.apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GOOGLE_API_KEY environment variable is niet ingesteld");
        }
        
        this.useVertexAI = Boolean.parseBoolean(
            System.getenv("GOOGLE_GENAI_USE_VERTEXAI")
        );
        
        this.httpClient = new OkHttpClient();
        this.gson = new Gson();
    }
    
    /**
     * Genereer content met de Gen AI model via REST API
     * 
     * @param prompt De prompt voor de AI
     * @return Het gegenereerde antwoord
     */
    public String generateContent(String prompt) {
        return generateContent(prompt, DEFAULT_MODEL, false);
    }
    
    /**
     * Genereer content met streaming support
     * 
     * @param prompt De prompt voor de AI
     * @param streamOf true voor streaming response
     * @return Het gegenereerde antwoord
     */
    public String generateContent(String prompt, boolean stream) {
        return generateContent(prompt, DEFAULT_MODEL, stream);
    }
    
    /**
     * Genereer content met een specifiek model
     * 
     * @param prompt De prompt voor de AI
     * @param modelName De model naam (bijv. "gemini-2.5-flash-lite")
     * @param stream true voor streaming response
     * @return Het gegenereerde antwoord
     */
    public String generateContent(String prompt, String modelName, boolean stream) {
        try {
            String url = String.format("%s/%s:%s?key=%s", 
                VERTEX_AI_BASE_URL, 
                modelName,
                stream ? "streamGenerateContent" : "generateContent",
                apiKey
            );
            
            // Build request body
            JsonObject requestBody = new JsonObject();
            JsonArray contents = new JsonArray();
            JsonObject content = new JsonObject();
            content.addProperty("role", "user");
            
            JsonArray parts = new JsonArray();
            JsonObject part = new JsonObject();
            part.addProperty("text", prompt);
            parts.add(part);
            
            content.add("parts", parts);
            contents.add(content);
            requestBody.add("contents", contents);
            
            RequestBody body = RequestBody.create(
                gson.toJson(requestBody),
                MediaType.parse("application/json")
            );
            
            Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code " + response + ": " + response.body().string());
                }
                
                String responseBody = response.body().string();
                return parseResponse(responseBody);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Fout bij het genereren van content: " + e.getMessage(), e);
        }
    }
    
    /**
     * Parse de API response en extraheer de tekst
     */
    private String parseResponse(String jsonResponse) {
        try {
            JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
            
            // Check for candidates array
            if (json.has("candidates")) {
                JsonArray candidates = json.getAsJsonArray("candidates");
                if (candidates.size() > 0) {
                    JsonObject candidate = candidates.get(0).getAsJsonObject();
                    if (candidate.has("content")) {
                        JsonObject content = candidate.getAsJsonObject("content");
                        if (content.has("parts")) {
                            JsonArray parts = content.getAsJsonArray("parts");
                            if (parts.size() > 0) {
                                JsonObject part = parts.get(0).getAsJsonObject();
                                if (part.has("text")) {
                                    return part.get("text").getAsString();
                                }
                            }
                        }
                    }
                }
            }
            
            return "Geen response tekst gevonden in: " + jsonResponse;
            
        } catch (Exception e) {
            return "Fout bij het parsen van response: " + e.getMessage() + "\nResponse: " + jsonResponse;
        }
    }
    
    /**
     * Genereer content met meerdere prompts
     * 
     * @param prompts Lijst van prompts
     * @return Het gegenereerde antwoord
     */
    public String generateContent(List<String> prompts) {
        // Combineer alle prompts in één prompt
        String combinedPrompt = String.join("\n\n", prompts);
        return generateContent(combinedPrompt);
    }
}
