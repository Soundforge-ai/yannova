import 'dotenv/config';

/**
 * GRATIS 3D Generatie opties:
 * 
 * 1. Hugging Face Inference API (gratis tier)
 * 2. Replicate (gratis credits bij signup)
 * 3. Lokaal met Colab notebook
 */

// Hugging Face Image-to-3D (TripoSR - gratis)
export async function huggingfaceImageTo3D(imageUrl: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY not set - Get free key at https://huggingface.co/settings/tokens');

  // Fetch image as blob
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();

  // TripoSR model - gratis op Hugging Face
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/TripoSR',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBlob,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  // Returns GLB file
  const glbBlob = await response.blob();
  return {
    format: 'glb',
    blob: glbBlob,
    size: glbBlob.size,
  };
}

// Replicate Image-to-3D (TripoSR - betaal per gebruik, eerste credits gratis)
export async function replicateImageTo3D(imageUrl: string) {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) throw new Error('REPLICATE_API_TOKEN not set - Get free at https://replicate.com');

  // Start prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'tripo-sr-v2', // TripoSR model
      input: {
        image: imageUrl,
        output_format: 'glb',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`);
  }

  const prediction = await response.json();
  return {
    id: prediction.id,
    status: prediction.status,
    getUrl: prediction.urls.get,
  };
}

// Check Replicate prediction status
export async function checkReplicatePrediction(predictionId: string) {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) throw new Error('REPLICATE_API_TOKEN not set');

  const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  return {
    status: data.status, // starting, processing, succeeded, failed
    output: data.output, // URL to GLB file when succeeded
    error: data.error,
  };
}

// SiliconFlow heeft ook 3D modellen (check beschikbaarheid)
export async function siliconflow3D(prompt: string) {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY not set');

  // Check of er 3D modellen beschikbaar zijn
  const modelsResponse = await fetch('https://api.siliconflow.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  
  const models = await modelsResponse.json();
  const models3D = models.data?.filter((m: any) => 
    m.id.toLowerCase().includes('3d') || 
    m.id.toLowerCase().includes('mesh') ||
    m.id.toLowerCase().includes('tripo')
  );

  return {
    available3DModels: models3D || [],
    message: models3D?.length ? 'Found 3D models' : 'No 3D models found on SiliconFlow',
  };
}

// Gratis lokale optie: genereer Colab notebook link
export function getColabNotebookUrl() {
  return {
    triposr: 'https://colab.research.google.com/github/VAST-AI-Research/TripoSR/blob/main/demo.ipynb',
    instantmesh: 'https://colab.research.google.com/github/TencentARC/InstantMesh/blob/main/demo.ipynb',
    description: 'Gratis GPU op Google Colab voor 3D generatie',
  };
}

// Check beschikbare gratis providers
export function getAvailableFree3DProviders() {
  return {
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
    replicate: !!process.env.REPLICATE_API_TOKEN,
    siliconflow: !!process.env.SILICONFLOW_API_KEY,
    colab: true, // Altijd beschikbaar
  };
}
