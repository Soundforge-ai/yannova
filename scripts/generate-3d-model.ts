import 'dotenv/config';
import { Client } from '@gradio/client';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 🎨 3D Model Generator - Gratis via HuggingFace Spaces
 * 
 * Ondersteunt:
 * - Text → 3D (Shap-E)
 * - Image → 3D (TripoSR)
 */

// ====== TEXT TO 3D ======
async function textTo3D(prompt: string): Promise<string | null> {
  console.log(`\n🎨 Text → 3D: "${prompt}"`);
  console.log('   Connecting to Shap-E...\n');

  try {
    const client = await Client.connect("hysts/Shap-E");
    
    // Get API info to see available endpoints
    const apiInfo = await client.view_api();
    console.log('   Available endpoints:', Object.keys(apiInfo.named_endpoints || {}));
    
    console.log('   ⏳ Generating 3D model (15-30 sec)...');
    
    // Use positional arguments instead of named
    const result = await client.predict("/text-to-3d", [
      prompt,  // prompt
      0,       // seed
      15,      // guidance_scale
      64,      // num_inference_steps
    ]);

    console.log('   ✅ Model generated!');
    
    // Result bevat URL naar GLB file
    const data = result.data as any[];
    if (data && data[0]) {
      const modelUrl = data[0].url || data[0];
      console.log(`   📦 Model URL: ${modelUrl}`);
      return modelUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('   ❌ Error:', error.message || error);
    return null;
  }
}

// ====== IMAGE TO 3D via Shap-E ======
async function imageTo3D(imagePath: string): Promise<string | null> {
  console.log(`\n📷 Image → 3D: "${imagePath}"`);
  console.log('   Using Shap-E image-to-3d endpoint...\n');

  try {
    const client = await Client.connect("hysts/Shap-E");
    
    // Load image
    let imageBlob: Blob;
    
    if (imagePath.startsWith('http')) {
      console.log('   📥 Downloading image...');
      const response = await fetch(imagePath);
      const arrayBuffer = await response.arrayBuffer();
      imageBlob = new Blob([arrayBuffer]);
      console.log(`   ✓ Image size: ${arrayBuffer.byteLength} bytes`);
    } else {
      const buffer = fs.readFileSync(imagePath);
      imageBlob = new Blob([buffer]);
    }
    
    console.log('   ⏳ Generating 3D model (30-60 sec)...');
    
    // Shap-E image-to-3d endpoint
    const result = await client.predict("/image-to-3d", [
      imageBlob,  // image
      0,          // seed
      3,          // guidance_scale
      64,         // num_inference_steps
    ]);

    console.log('   ✅ Model generated!');
    
    const data = result.data as any[];
    if (data && data[0]) {
      const modelUrl = data[0].url || data[0];
      console.log(`   📦 Model URL: ${modelUrl}`);
      return modelUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error('   ❌ Error:', error.message || error);
    console.log('   💡 Alternative: https://huggingface.co/spaces/TencentARC/InstantMesh');
    return null;
  }
}

// ====== DOWNLOAD MODEL ======
async function downloadModel(url: string, outputPath: string): Promise<void> {
  console.log(`\n💾 Downloading model to: ${outputPath}`);
  
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`   ✅ Saved! Size: ${(buffer.byteLength / 1024).toFixed(1)} KB`);
}

// ====== MAIN ======
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     🎨 3D MODEL GENERATOR (100% Gratis)                ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  // Demo 1: Text to 3D
  console.log('\n' + '═'.repeat(56));
  console.log('DEMO 1: Text → 3D met Shap-E');
  console.log('═'.repeat(56));
  
  const textPrompt = "a red sports car";
  const textModelUrl = await textTo3D(textPrompt);
  
  if (textModelUrl) {
    await downloadModel(textModelUrl, './public/models/text-to-3d-car.glb');
  }

  // Demo 2: Image to 3D
  console.log('\n' + '═'.repeat(56));
  console.log('DEMO 2: Image → 3D met Shap-E');
  console.log('═'.repeat(56));
  
  // Use a direct image URL that works
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg';
  const imageModelUrl = await imageTo3D(testImageUrl);
  
  if (imageModelUrl) {
    await downloadModel(imageModelUrl, './public/models/image-to-3d-panda.glb');
  }

  // Summary
  console.log('\n' + '═'.repeat(56));
  console.log('📋 SAMENVATTING');
  console.log('═'.repeat(56));
  console.log('\n✅ Generated models saved to: ./public/models/');
  console.log('   - text-to-3d-car.glb');
  console.log('   - image-to-3d-panda.glb');
  console.log('\n💡 Bekijk de modellen in de browser:');
  console.log('   https://gltf-viewer.donmccurdy.com/');
  console.log('\n🔧 Integreer in je React app met @google/model-viewer:');
  console.log('   <model-viewer src="/models/text-to-3d-car.glb" auto-rotate camera-controls />');
}

main().catch(console.error);
