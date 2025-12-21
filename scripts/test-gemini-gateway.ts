import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import 'dotenv/config';

async function main() {
  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
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
