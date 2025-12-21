import 'dotenv/config';

// 3D Generatie services met API's
export const threeD_Services = {
  // Meshy.ai - Text-to-3D en Image-to-3D
  meshy: {
    name: 'Meshy.ai',
    features: ['text-to-3d', 'image-to-3d'],
    apiUrl: 'https://api.meshy.ai',
    docs: 'https://docs.meshy.ai',
  },
  
  // Tripo3D - Text-to-3D en Image-to-3D
  tripo: {
    name: 'Tripo3D',
    features: ['text-to-3d', 'image-to-3d'],
    apiUrl: 'https://api.tripo3d.ai',
    docs: 'https://platform.tripo3d.ai/docs',
  },
  
  // Luma AI - Dream Machine voor 3D
  luma: {
    name: 'Luma AI',
    features: ['image-to-3d', 'video-to-3d'],
    apiUrl: 'https://lumalabs.ai/api',
    docs: 'https://docs.lumalabs.ai',
  },
  
  // Stability AI - Stable Fast 3D
  stability: {
    name: 'Stability AI',
    features: ['image-to-3d'],
    apiUrl: 'https://api.stability.ai',
    docs: 'https://platform.stability.ai/docs',
  },
};

// Meshy.ai Text-to-3D
export async function meshyTextTo3D(prompt: string, options: {
  artStyle?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture';
  negativePrompt?: string;
} = {}) {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) throw new Error('MESHY_API_KEY not set');

  // Start task
  const response = await fetch('https://api.meshy.ai/v2/text-to-3d', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'preview',
      prompt,
      art_style: options.artStyle || 'realistic',
      negative_prompt: options.negativePrompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Meshy API error: ${response.statusText}`);
  }

  const { result } = await response.json();
  return {
    taskId: result,
    status: 'pending',
    checkUrl: `https://api.meshy.ai/v2/text-to-3d/${result}`,
  };
}

// Meshy.ai Image-to-3D
export async function meshyImageTo3D(imageUrl: string) {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) throw new Error('MESHY_API_KEY not set');

  const response = await fetch('https://api.meshy.ai/v1/image-to-3d', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageUrl,
      enable_pbr: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Meshy API error: ${response.statusText}`);
  }

  const { result } = await response.json();
  return {
    taskId: result,
    status: 'pending',
    checkUrl: `https://api.meshy.ai/v1/image-to-3d/${result}`,
  };
}

// Check Meshy task status
export async function checkMeshyTask(taskId: string, type: 'text-to-3d' | 'image-to-3d' = 'text-to-3d') {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) throw new Error('MESHY_API_KEY not set');

  const version = type === 'text-to-3d' ? 'v2' : 'v1';
  const response = await fetch(`https://api.meshy.ai/${version}/${type}/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Meshy API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    status: data.status, // PENDING, IN_PROGRESS, SUCCEEDED, FAILED
    progress: data.progress,
    modelUrls: data.model_urls, // { glb, fbx, obj, usdz }
    thumbnailUrl: data.thumbnail_url,
  };
}

// Tripo3D Text-to-3D
export async function tripoTextTo3D(prompt: string) {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) throw new Error('TRIPO_API_KEY not set');

  const response = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'text_to_model',
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tripo API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    taskId: data.data.task_id,
    status: 'pending',
  };
}

// Tripo3D Image-to-3D  
export async function tripoImageTo3D(imageUrl: string) {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) throw new Error('TRIPO_API_KEY not set');

  const response = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'image_to_model',
      file: { url: imageUrl },
    }),
  });

  if (!response.ok) {
    throw new Error(`Tripo API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    taskId: data.data.task_id,
    status: 'pending',
  };
}

// Check Tripo task status
export async function checkTripoTask(taskId: string) {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) throw new Error('TRIPO_API_KEY not set');

  const response = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Tripo API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    status: data.data.status, // queued, running, success, failed
    progress: data.data.progress,
    modelUrl: data.data.output?.model,
    renderedImage: data.data.output?.rendered_image,
  };
}

// Export available 3D providers based on env
export function getAvailable3DProviders() {
  return {
    meshy: !!process.env.MESHY_API_KEY,
    tripo: !!process.env.TRIPO_API_KEY,
    stability: !!process.env.STABILITY_API_KEY,
  };
}
