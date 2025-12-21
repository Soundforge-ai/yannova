import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';

// Embedding model (Gemini text-embedding)
const embeddingModel = google.textEmbeddingModel('text-embedding-004');

// In-memory vector store (voor productie: gebruik Pinecone, Supabase, etc.)
interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

class VectorStore {
  private documents: VectorDocument[] = [];

  async addDocument(id: string, content: string, metadata?: Record<string, unknown>) {
    const { embedding } = await embed({
      model: embeddingModel,
      value: content,
    });

    this.documents.push({ id, content, embedding, metadata });
    return { id, content, metadata };
  }

  async addDocuments(docs: { id: string; content: string; metadata?: Record<string, unknown> }[]) {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: docs.map(d => d.content),
    });

    docs.forEach((doc, i) => {
      this.documents.push({
        id: doc.id,
        content: doc.content,
        embedding: embeddings[i],
        metadata: doc.metadata,
      });
    });

    return docs;
  }

  async search(query: string, topK: number = 5): Promise<{ document: VectorDocument; score: number }[]> {
    const { embedding: queryEmbedding } = await embed({
      model: embeddingModel,
      value: query,
    });

    // Cosine similarity
    const results = this.documents.map(doc => ({
      document: doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sorteer op score (hoogste eerst)
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getDocuments() {
    return this.documents.map(({ id, content, metadata }) => ({ id, content, metadata }));
  }

  clear() {
    this.documents = [];
  }
}

// Singleton instance
export const vectorStore = new VectorStore();

// Helper voor RAG context
export async function getRelevantContext(query: string, topK: number = 3): Promise<string> {
  const results = await vectorStore.search(query, topK);
  
  if (results.length === 0) {
    return '';
  }

  return results
    .map((r, i) => `[Context ${i + 1}] (relevantie: ${(r.score * 100).toFixed(1)}%)\n${r.document.content}`)
    .join('\n\n');
}
