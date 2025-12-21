import 'dotenv/config';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function testHuggingFace3D() {
  console.log('🚀 Test Hugging Face 3D Generatie (GRATIS)\n');

  if (!HF_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not set');
    return;
  }

  // Test image URL (een simpele afbeelding)
  const testImageUrl = 'https://huggingface.co/datasets/dylanebert/3d-arena/resolve/main/inputs/37_panda.png';

  console.log('📥 Downloading test image...');
  const imageResponse = await fetch(testImageUrl);
  const imageBlob = await imageResponse.arrayBuffer();
  console.log(`   ✓ Image size: ${imageBlob.byteLength} bytes\n`);

  console.log('🔄 Sending to TripoSR (Image-to-3D)...');
  console.log('   This may take 30-60 seconds on first run (model loading)...\n');

  try {
    // New HF router endpoint (api-inference is deprecated)
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/stabilityai/TripoSR',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: imageBlob,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      
      // Check if model is loading
      if (response.status === 503) {
        console.log('⏳ Model is loading, please wait...');
        const error = JSON.parse(errorText);
        console.log(`   Estimated time: ${error.estimated_time || 'unknown'} seconds`);
        console.log('   Try again in a minute!');
        return;
      }
      
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log(`📦 Response type: ${contentType}`);

    if (contentType?.includes('application/octet-stream') || contentType?.includes('model/gltf-binary')) {
      const glbData = await response.arrayBuffer();
      console.log(`✅ SUCCESS! Got 3D model: ${glbData.byteLength} bytes`);
      
      // Save to file
      const fs = await import('fs');
      const outputPath = './public/models/test-output.glb';
      fs.writeFileSync(outputPath, Buffer.from(glbData));
      console.log(`💾 Saved to: ${outputPath}`);
    } else {
      const text = await response.text();
      console.log('Response:', text.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Alternative: Test met Hugging Face Spaces API (TripoSR demo)
async function testTripoSRSpace() {
  console.log('\n🔄 Alternative: Testing TripoSR via Gradio Space...\n');
  
  const spaceUrl = 'https://stabilityai-triposr.hf.space/api/predict';
  
  try {
    // Check if space is running
    const infoResponse = await fetch('https://stabilityai-triposr.hf.space/info');
    if (infoResponse.ok) {
      console.log('✅ TripoSR Space is online!');
      console.log('   Visit: https://huggingface.co/spaces/stabilityai/TripoSR');
      console.log('   You can upload images there for free 3D generation');
    }
  } catch (error) {
    console.log('⚠️ Space may be sleeping, visit to wake it up');
  }
}

async function main() {
  await testHuggingFace3D();
  await testTripoSRSpace();
  
  console.log('\n📋 Gratis 3D opties:');
  console.log('   1. Hugging Face TripoSR: https://huggingface.co/spaces/stabilityai/TripoSR');
  console.log('   2. Google Colab: https://colab.research.google.com/github/VAST-AI-Research/TripoSR/blob/main/demo.ipynb');
  console.log('   3. Meshy.ai free tier: https://meshy.ai (200 credits/maand)');
}

main().catch(console.error);
