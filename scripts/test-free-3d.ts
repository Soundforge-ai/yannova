import 'dotenv/config';

/**
 * 🎨 Gratis 3D Generatie - Overzicht & Test
 * 
 * Dit script toont alle GRATIS opties voor Text/Image → 3D
 */

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║     🎨 GRATIS 3D GENERATIE OPTIES                      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// ====== IMAGE TO 3D (Gratis) ======
console.log('📷 IMAGE → 3D (Volledig Gratis)\n');

const imageToD = [
  {
    name: 'TripoSR (Stability AI)',
    url: 'https://huggingface.co/spaces/stabilityai/TripoSR',
    quality: '⭐⭐⭐⭐⭐',
    speed: 'Snel (~10 sec)',
    output: 'GLB/OBJ mesh',
    notes: 'Beste gratis optie! Hoge kwaliteit meshes.'
  },
  {
    name: 'OpenLRM',
    url: 'https://huggingface.co/spaces/zxhezexin/OpenLRM',
    quality: '⭐⭐⭐⭐',
    speed: 'Medium (~20 sec)',
    output: 'GLB mesh',
    notes: 'Large Reconstruction Model, goed voor objecten.'
  },
  {
    name: 'Wonder3D',
    url: 'https://huggingface.co/spaces/flamehaze1115/Wonder3D-demo',
    quality: '⭐⭐⭐⭐',
    speed: 'Langzaam (~60 sec)',
    output: 'Multi-view + mesh',
    notes: 'Genereert eerst multi-view images, dan 3D.'
  },
  {
    name: 'Zero123++',
    url: 'https://huggingface.co/spaces/sudo-ai/zero123plus-demo-space',
    quality: '⭐⭐⭐⭐',
    speed: 'Medium',
    output: 'Multi-view images',
    notes: 'Genereert 6 views van 1 image.'
  },
  {
    name: 'One-2-3-45++',
    url: 'https://huggingface.co/spaces/One-2-3-45/One-2-3-45',
    quality: '⭐⭐⭐⭐⭐',
    speed: 'Langzaam (~2 min)',
    output: 'Textured mesh',
    notes: 'Hoogste kwaliteit, maar trager.'
  }
];

for (const opt of imageToD) {
  console.log(`🔹 ${opt.name}`);
  console.log(`   Quality: ${opt.quality}`);
  console.log(`   Speed: ${opt.speed}`);
  console.log(`   Output: ${opt.output}`);
  console.log(`   URL: ${opt.url}`);
  console.log(`   💡 ${opt.notes}\n`);
}

// ====== TEXT TO 3D (Gratis) ======
console.log('\n📝 TEXT → 3D (Volledig Gratis)\n');

const textTo3D = [
  {
    name: 'Shap-E (OpenAI)',
    url: 'https://huggingface.co/spaces/hysts/Shap-E',
    quality: '⭐⭐⭐',
    speed: 'Snel (~15 sec)',
    output: 'GLB/PLY mesh',
    notes: 'OpenAI model, simpele 3D shapes van tekst.'
  },
  {
    name: 'Point-E (OpenAI)',
    url: 'https://huggingface.co/spaces/openai/point-e',
    quality: '⭐⭐⭐',
    speed: 'Medium',
    output: 'Point cloud → mesh',
    notes: 'Twee-staps proces: points dan mesh.'
  },
  {
    name: 'MVDream',
    url: 'https://huggingface.co/spaces/MVDream/MVDream',
    quality: '⭐⭐⭐⭐',
    speed: 'Langzaam',
    output: 'Multi-view images',
    notes: 'Multi-view diffusion, hoge kwaliteit.'
  }
];

for (const opt of textTo3D) {
  console.log(`🔹 ${opt.name}`);
  console.log(`   Quality: ${opt.quality}`);
  console.log(`   Speed: ${opt.speed}`);
  console.log(`   Output: ${opt.output}`);
  console.log(`   URL: ${opt.url}`);
  console.log(`   💡 ${opt.notes}\n`);
}

// ====== CODE INTEGRATIE ======
console.log('\n💻 CODE INTEGRATIE\n');
console.log('Om HuggingFace Spaces programmatisch te gebruiken:\n');
console.log('```bash');
console.log('npm install @gradio/client');
console.log('```\n');

console.log('```typescript');
console.log(`import { Client } from "@gradio/client";

// TripoSR Image-to-3D
async function imageToD(imageFile: Blob) {
  const client = await Client.connect("stabilityai/TripoSR");
  const result = await client.predict("/run", {
    image: imageFile,
    foreground_ratio: 0.85,
    mc_resolution: 256,
  });
  return result.data; // GLB model
}

// Shap-E Text-to-3D  
async function textTo3D(prompt: string) {
  const client = await Client.connect("hysts/Shap-E");
  const result = await client.predict("/text-to-3d", {
    prompt: prompt,
    seed: 42,
    guidance_scale: 15,
    num_steps: 64,
  });
  return result.data; // 3D model
}`);
console.log('```\n');

// ====== AANBEVELING ======
console.log('═'.repeat(56));
console.log('\n🏆 AANBEVELING:\n');
console.log('   📷 Image → 3D: Gebruik TripoSR');
console.log('      https://huggingface.co/spaces/stabilityai/TripoSR\n');
console.log('   📝 Text → 3D: Gebruik Shap-E');
console.log('      https://huggingface.co/spaces/hysts/Shap-E\n');
console.log('   Beide zijn 100% gratis, geen account nodig,');
console.log('   en werken direct in de browser! 🎉\n');

// ====== LOKAAL DRAAIEN ======
console.log('═'.repeat(56));
console.log('\n🖥️ LOKAAL DRAAIEN (Google Colab - Gratis GPU)\n');
console.log('   TripoSR Colab:');
console.log('   https://colab.research.google.com/github/VAST-AI-Research/TripoSR/blob/main/demo.ipynb\n');
console.log('   Shap-E Colab:');
console.log('   https://colab.research.google.com/github/openai/shap-e/blob/main/notebooks/sample_text_to_3d.ipynb\n');
