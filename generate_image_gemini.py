#!/usr/bin/env python3
"""
Script om afbeeldingen te genereren met Google Gemini API
"""
import os
import sys
import google.generativeai as genai
import requests

# Gemini API Key
API_KEY = "AIzaSyCxHmlMwpV6hsEyKrF7Luac1VQplYV38W4"

# Configureer de API
genai.configure(api_key=API_KEY)

def generate_image(prompt, output_path="generated_image.jpg", model="gemini-2.5-flash-image"):
    """
    Genereer een afbeelding met Gemini API
    """
    try:
        # Gebruik de image generation model
        # Let op: Gemini image generation werkt via een specifiek endpoint
        # We proberen eerst met de generateContent API
        
        # Voor image generation moeten we de juiste model gebruiken
        # Gemini 2.5 Flash Image of Gemini 3 Pro Image Preview
        
        # Direct API call naar image generation endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=300)
        response.raise_for_status()
        
        result = response.json()
        
        # Extract image URL from response
        # De response structuur kan variëren, we zoeken naar image data of URL
        if "candidates" in result and len(result["candidates"]) > 0:
            candidate = result["candidates"][0]
            if "content" in candidate:
                content = candidate["content"]
                if "parts" in content:
                    for part in content["parts"]:
                        # Check voor inline image data
                        if "inlineData" in part:
                            import base64
                            image_data = part["inlineData"]["data"]
                            mime_type = part["inlineData"].get("mimeType", "image/png")
                            image_bytes = base64.b64decode(image_data)
                            
                            # Bepaal extensie op basis van mime type
                            ext = ".png"
                            if "jpeg" in mime_type or "jpg" in mime_type:
                                ext = ".jpg"
                            elif "webp" in mime_type:
                                ext = ".webp"
                            
                            if not output_path.endswith(ext):
                                output_path = output_path.rsplit(".", 1)[0] + ext
                            
                            with open(output_path, "wb") as f:
                                f.write(image_bytes)
                            print(f"✅ Image saved to {output_path}")
                            return output_path
                        
                        # Check voor text met URL
                        if "text" in part:
                            text = part["text"]
                            # Zoek naar URL in de text
                            import re
                            urls = re.findall(r'https?://[^\s]+', text)
                            if urls:
                                # Download de image van de URL
                                img_url = urls[0]
                                img_response = requests.get(img_url, timeout=60)
                                img_response.raise_for_status()
                                with open(output_path, "wb") as f:
                                    f.write(img_response.content)
                                print(f"✅ Image downloaded from URL and saved to {output_path}")
                                return output_path
                            else:
                                print(f"Response text: {text}")
        
        print("⚠️  No image data found in response")
        print(f"Full response: {result}")
        return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    prompt = "Professional high-quality photograph of modern windows and doors, architectural detail, natural lighting, clean design, residential building facade, European style windows and doors, beautiful craftsmanship, realistic photo"
    
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
    
    output_path = "/Users/innovarslabo/Desktop/yannova/public/images/ramen-deuren-gemini.jpg"
    
    print(f"Generating image with prompt: {prompt}")
    result = generate_image(prompt, output_path)
    
    if result:
        print(f"✅ Image successfully generated: {result}")
    else:
        print("❌ Failed to generate image")

