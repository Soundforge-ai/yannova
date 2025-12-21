import { streamText, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { vectorStore, getRelevantContext } from '../src/lib/ai/embeddings';
import { getModel, modelInfo, getAvailableModels, ModelId } from '../src/lib/ai/models';
import 'dotenv/config';

async function main() {
  console.log('🚀 Multi-Model + RAG Demo\n');

  // 1. Toon beschikbare modellen
  console.log('📋 Beschikbare modellen:');
  const available = getAvailableModels();
  available.forEach(id => {
    const info = modelInfo[id];
    console.log(`   - ${info.name} (${info.provider}) - ${info.description}`);
  });
  console.log();

  // 2. Voeg documenten toe aan vector store (je eigen data)
  console.log('📚 Documenten toevoegen aan vector store...');
  await vectorStore.addDocuments([
    {
      id: 'doc1',
      content: 'Yannova is een innovatief renovatiebedrijf gevestigd in België. We zijn gespecialiseerd in duurzame renovaties en energiebesparende oplossingen voor woningen.',
      metadata: { source: 'about' },
    },
    {
      id: 'doc2',
      content: 'Onze diensten omvatten: dakisolatie, gevelisolatie, zonnepanelen installatie, warmtepompen, en complete badkamer- en keukenrenovaties.',
      metadata: { source: 'services' },
    },
    {
      id: 'doc3',
      content: 'Yannova biedt gratis offertes en advies aan huis. Onze experts komen langs om uw situatie te bekijken en een gepersonaliseerd renovatieplan op te stellen.',
      metadata: { source: 'contact' },
    },
    {
      id: 'doc4',
      content: 'We werken met erkende aannemers en bieden garantie op al onze werkzaamheden. Gemiddeld besparen onze klanten 30-40% op hun energiekosten na renovatie.',
      metadata: { source: 'guarantee' },
    },
  ]);
  console.log(`   ✓ ${vectorStore.getDocuments().length} documenten toegevoegd\n`);

  // 3. Test RAG zoeken
  const query = 'Wat voor diensten biedt Yannova aan?';
  console.log(`🔍 Zoekquery: "${query}"`);
  const context = await getRelevantContext(query, 2);
  console.log('\n📄 Gevonden context:');
  console.log(context);
  console.log();

  // 4. Genereer antwoord met RAG + gekozen model
  const selectedModel: ModelId = 'gemini-2.5-flash-lite';
  console.log(`🤖 Genereren met ${modelInfo[selectedModel].name} + RAG...\n`);

  const result = streamText({
    model: getModel(selectedModel),
    system: `Je bent een behulpzame assistent voor Yannova. Gebruik de context om vragen te beantwoorden.
    
--- CONTEXT ---
${context}
--- EINDE ---`,
    prompt: query,
  });

  console.log('💬 Antwoord:');
  for await (const text of result.textStream) {
    process.stdout.write(text);
  }
  console.log('\n');

  // 5. Vergelijk met ander model (als beschikbaar)
  if (available.includes('gemini-2.0-flash')) {
    console.log(`🔄 Vergelijken met ${modelInfo['gemini-2.0-flash'].name}...\n`);
    
    const result2 = await generateText({
      model: getModel('gemini-2.0-flash'),
      system: `Je bent een behulpzame assistent voor Yannova. Gebruik de context om vragen te beantwoorden.
      
--- CONTEXT ---
${context}
--- EINDE ---`,
      prompt: query,
    });

    console.log('💬 Antwoord (gemini-2.0-flash):');
    console.log(result2.text);
  }

  console.log('\n✅ Demo compleet!');
}

main().catch(console.error);
