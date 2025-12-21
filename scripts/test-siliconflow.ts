import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

// SiliconFlow provider (classic completions API)
const siliconflow = createOpenAI({
  baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.com/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
  compatibility: 'compatible', // Use classic /chat/completions endpoint
});

async function main() {
  console.log('🚀 Test SiliconFlow DeepSeek V3.1 Nex-N1\n');

  const result = streamText({
    model: siliconflow.chat('nex-agi/DeepSeek-V3.1-Nex-N1'),
    prompt: 'Leg in het kort uit wat renovatie is en waarom het belangrijk is voor woningen.',
  });

  console.log('💬 Antwoord:');
  for await (const text of result.textStream) {
    process.stdout.write(text);
  }

  console.log('\n');
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}

main().catch(console.error);
