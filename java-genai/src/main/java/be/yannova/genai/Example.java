package be.yannova.genai;

/**
 * Voorbeeld gebruik van de Gen AI SDK
 */
public class Example {
    
    public static void main(String[] args) {
        try {
            // Maak een client aan
            GenAIClient client = new GenAIClient();
            
            // Genereer content
            String prompt = "Schrijf een korte beschrijving van een bouw- en renovatiebedrijf in België";
            String response = client.generateContent(prompt);
            
            System.out.println("Prompt: " + prompt);
            System.out.println("Response: " + response);
            
        } catch (Exception e) {
            System.err.println("Fout: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

