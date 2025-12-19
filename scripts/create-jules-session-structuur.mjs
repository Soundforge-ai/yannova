// Script to create Jules session for project structure improvements
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load API key from .env.local
let JULES_API_KEY;
try {
  const envPath = join(__dirname, '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_JULES_API_KEY=["']?([^"'\n]+)["']?/);
  if (match) {
    JULES_API_KEY = match[1].trim();
  }
} catch (e) {
  // .env.local not found or can't read
}

// Fallback to environment variable
if (!JULES_API_KEY) {
  JULES_API_KEY = process.env.VITE_JULES_API_KEY || process.env.JULES_API_KEY;
}

if (!JULES_API_KEY) {
  console.error('❌ VITE_JULES_API_KEY niet gevonden!');
  console.error('\nVoeg VITE_JULES_API_KEY toe aan .env.local:');
  console.error('   VITE_JULES_API_KEY=your-api-key-here\n');
  process.exit(1);
}

const BASE_URL = 'https://jules.googleapis.com/v1alpha';

// Read the prompt from the markdown file
let prompt;
try {
  const promptPath = join(__dirname, 'JULES_PROMPT_PROJECTSTRUCTUUR.md');
  const promptContent = readFileSync(promptPath, 'utf-8');
  
  // Extract the prompt from the markdown (between the code block markers)
  const promptMatch = promptContent.match(/```\n([\s\S]+?)\n```/);
  if (promptMatch) {
    prompt = promptMatch[1].trim();
  } else {
    // Fallback: use the content after "## Prompt voor Jules"
    const lines = promptContent.split('\n');
    const startIdx = lines.findIndex(line => line.includes('Verbeter de projectstructuur'));
    if (startIdx !== -1) {
      prompt = lines.slice(startIdx).join('\n').replace(/```/g, '').trim();
    }
  }
} catch (e) {
  console.error('❌ Kon prompt bestand niet lezen:', e.message);
  process.exit(1);
}

if (!prompt) {
  console.error('❌ Kon prompt niet extraheren uit JULES_PROMPT_PROJECTSTRUCTUUR.md');
  process.exit(1);
}

async function createJulesSession() {
  try {
    const requestBody = {
      prompt: prompt,
      sourceContext: {
        source: 'sources/github/Soundforge-ai/yannova',
        githubRepoContext: {
          startingBranch: 'main'
        }
      },
      automationMode: 'AUTO_CREATE_PR',
      title: 'Verbeter projectstructuur volgens best practices'
    };

    console.log('🚀 Jules sessie aanmaken voor projectstructuur verbeteringen...\n');
    console.log('📋 Repository: Soundforge-ai/yannova');
    console.log('📋 Branch: main');
    console.log('📋 Mode: AUTO_CREATE_PR\n');

    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': JULES_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      console.error('❌ Jules API error:', response.status);
      console.error('   Message:', errorData.error?.message || errorText);
      
      if (response.status === 404) {
        console.error('\n💡 Mogelijke oorzaken:');
        console.error('   1. Repository is niet verbonden met Jules');
        console.error('   2. API key heeft geen toegang tot deze repository');
        console.error('   3. Repository naam of path is incorrect\n');
        console.error('   Probeer:');
        console.error('   - Ga naar https://jules.google.com');
        console.error('   - Verbind je GitHub repository');
        console.error('   - Of gebruik de Jules Assistant interface in je app (/jules-assistant)\n');
      }
      
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Jules sessie succesvol aangemaakt!\n');
    console.log('📋 Session Details:');
    console.log('   Session ID:', data.id);
    console.log('   Status:', data.status);
    console.log('   Title:', data.title || requestBody.title);
    console.log('\n🔗 Volg de voortgang op: https://jules.google.com');
    console.log('   Of bekijk de pull request op GitHub zodra deze is aangemaakt.\n');
    
    return data;
  } catch (error) {
    console.error('❌ Fout bij aanmaken Jules sessie:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause);
    }
    process.exit(1);
  }
}

createJulesSession();

