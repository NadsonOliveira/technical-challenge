import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmbeddingEntity } from './entities/embedding.entity';
import axios from 'axios';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(EmbeddingEntity)
    private readonly embeddingRepo: Repository<EmbeddingEntity>,
  ) {}

  async generateEmbeddings(documentId: string, text?: string) {
    if (!text || text.trim().length === 0) {
      throw new NotFoundException('O texto enviado está vazio ou indefinido.');
    }

    const chunks = this.splitText(text);

    const embeddings: EmbeddingEntity[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const vector = await this.createEmbeddingWithOllama(chunk);

      const emb = this.embeddingRepo.create({
        documentId,
        chunkIndex: i,
        chunk,
        vector,
      });

      embeddings.push(emb);
    }

    await this.embeddingRepo.save(embeddings);
    return embeddings;
  }

  splitText(text: string, size = 500): string[] {
    if (!text) return [];

    const result: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      result.push(text.substring(i, i + size));
    }
    return result;
  }

  async createEmbeddingWithOllama(text: string): Promise<number[]> {
    const response = await axios.post<{ embedding: number[] }>(
      'http://localhost:11434/api/embeddings',
      {
        model: 'nomic-embed-text',
        prompt: text,
      },
    );

    return response.data.embedding;
  }

  async searchSimilarChunks(query: string, documentId: string) {
    const queryEmbedding = await this.createEmbeddingWithOllama(query);

    const embeddings = await this.embeddingRepo.find({
      where: { documentId },
    });

    if (embeddings.length === 0) {
      throw new NotFoundException('Nenhum embedding encontrado.');
    }

    const scored = embeddings
      .map((emb) => ({
        ...emb,
        score: this.cosineSimilarity(queryEmbedding, emb.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return scored;
  }

  cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((acc, v, i) => acc + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
    const normB = Math.sqrt(b.reduce((acc, v) => acc + v * v, 0));
    return dot / (normA * normB);
  }
}
