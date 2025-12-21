/**
 * 3D Generator API - Uses HuggingFace Spaces (100% Free)
 * No Colab or external server needed!
 */

interface Generate3DResult {
  success: boolean;
  modelUrl?: string;
  modelBlob?: Blob;
  error?: string;
}

// Generate 3D model from text using Shap-E (via Gradio API)
export async function generateTextTo3D(prompt: string): Promise<Generate3DResult> {
  try {
    // Dynamic import of @gradio/client
    const { Client } = await import('@gradio/client');
    
    const client = await Client.connect("hysts/Shap-E");
    
    const result = await client.predict("/text-to-3d", [
      prompt,  // prompt
      0,       // seed (random)
      15,      // guidance_scale
      64,      // num_inference_steps
    ]);

    const data = result.data as any[];
    if (data && data[0]) {
      const modelUrl = data[0].url || data[0];
      
      // Download the model
      const response = await fetch(modelUrl);
      const modelBlob = await response.blob();
      
      return {
        success: true,
        modelUrl: URL.createObjectURL(modelBlob),
        modelBlob,
      };
    }
    
    return { success: false, error: 'Geen model ontvangen' };
  } catch (error: any) {
    console.error('Text-to-3D error:', error);
    
    // Check for quota error
    if (error.message?.includes('GPU quota')) {
      return { 
        success: false, 
        error: 'GPU quota bereikt. Wacht een paar minuten en probeer opnieuw.' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Fout bij genereren' 
    };
  }
}

// Generate 3D model from image using Shap-E
export async function generateImageTo3D(imageBlob: Blob): Promise<Generate3DResult> {
  try {
    const { Client } = await import('@gradio/client');
    
    const client = await Client.connect("hysts/Shap-E");
    
    const result = await client.predict("/image-to-3d", [
      imageBlob,  // image
      0,          // seed
      3,          // guidance_scale
      64,         // num_inference_steps
    ]);

    const data = result.data as any[];
    if (data && data[0]) {
      const modelUrl = data[0].url || data[0];
      
      const response = await fetch(modelUrl);
      const modelBlob = await response.blob();
      
      return {
        success: true,
        modelUrl: URL.createObjectURL(modelBlob),
        modelBlob,
      };
    }
    
    return { success: false, error: 'Geen model ontvangen' };
  } catch (error: any) {
    console.error('Image-to-3D error:', error);
    
    if (error.message?.includes('GPU quota')) {
      return { 
        success: false, 
        error: 'GPU quota bereikt. Wacht een paar minuten en probeer opnieuw.' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Fout bij genereren' 
    };
  }
}

// Showroom model storage
export interface ShowroomModel {
  id: string;
  name: string;
  description: string;
  prompt: string;
  modelPath: string;
  color: string;
  features: string[];
  price?: string;
  createdAt: Date;
  published: boolean;
}

const SHOWROOM_STORAGE_KEY = 'yannova_showroom_models';

export function getShowroomModels(): ShowroomModel[] {
  const saved = localStorage.getItem(SHOWROOM_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveShowroomModel(model: ShowroomModel): void {
  const models = getShowroomModels();
  const existing = models.findIndex(m => m.id === model.id);
  
  if (existing >= 0) {
    models[existing] = model;
  } else {
    models.push(model);
  }
  
  localStorage.setItem(SHOWROOM_STORAGE_KEY, JSON.stringify(models));
}

export function deleteShowroomModel(id: string): void {
  const models = getShowroomModels().filter(m => m.id !== id);
  localStorage.setItem(SHOWROOM_STORAGE_KEY, JSON.stringify(models));
}

export function publishToShowroom(id: string, published: boolean): void {
  const models = getShowroomModels();
  const model = models.find(m => m.id === id);
  if (model) {
    model.published = published;
    localStorage.setItem(SHOWROOM_STORAGE_KEY, JSON.stringify(models));
  }
}

// Helper to download model as file
export async function downloadModelAsFile(
  modelUrl: string, 
  filename: string
): Promise<void> {
  const response = await fetch(modelUrl);
  const blob = await response.blob();
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
