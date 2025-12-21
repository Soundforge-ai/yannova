import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import 'dotenv/config';

// Gebruik je eigen Google AI API key (gratis via https://aistudio.google.com/apikey)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

async function main() {
  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}

main().catch(console.error);
