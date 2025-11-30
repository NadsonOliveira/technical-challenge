import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { CreateChatbotDto } from './dto/create-chatbots.dto';
import { Chatbot } from './entities/chatbots.entity';
import { EmbeddingEntity } from 'src/embeddings/entities/embedding.entity';
import { DocumentEntity } from 'src/documents/entities/document.entity';

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    @InjectRepository(Chatbot)
    private readonly chatbotRepo: Repository<Chatbot>,

    @InjectRepository(EmbeddingEntity)
    private readonly embeddingRepo: Repository<EmbeddingEntity>,

    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  async create(dto: CreateChatbotDto): Promise<Chatbot> {
    const chatbot = this.chatbotRepo.create(dto);
    return this.chatbotRepo.save(chatbot);
  }

  async findAll(): Promise<Chatbot[]> {
    return this.chatbotRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Chatbot> {
    const chatbot = await this.chatbotRepo.findOne({ where: { id } });
    if (!chatbot) throw new NotFoundException('Chatbot não encontrado.');
    return chatbot;
  }

  async update(id: string, dto: UpdateChatbotDto): Promise<Chatbot> {
    const chatbot = await this.findOne(id);
    Object.assign(chatbot, dto);
    return this.chatbotRepo.save(chatbot);
  }

  async remove(id: string): Promise<{ message: string }> {
    const chatbot = await this.findOne(id);
    await this.chatbotRepo.remove(chatbot);
    return { message: 'Chatbot removido com sucesso.' };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
  }

  private async askLocalOllama(prompt: string): Promise<string> {
    try {
      const response: AxiosResponse<OllamaGenerateResponse> = await axios.post(
        'http://localhost:11434/api/generate',
        {
          prompt,
          model: 'llama2',
          stream: false,
        },
      );

      this.logger.debug('Resposta do Ollama:', response.data);
      if (response.data && response.data.response) {
        return response.data.response;
      }
      return 'Sem resposta.';
    } catch (err) {
      this.logger.error('Erro ao chamar Ollama local:', err);
      return 'Erro ao gerar resposta.';
    }
  }

  async askRag(
    chatbotId: string,
    documentId: string,
    question: string,
  ): Promise<{ answer: string }> {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });
    if (!document) throw new NotFoundException('Documento não encontrado.');

    const chatbot = await this.chatbotRepo.findOne({
      where: { id: chatbotId },
    });
    if (!chatbot) throw new NotFoundException('Chatbot não encontrado.');

    const questionVector: number[] = [];

    const embeddings = await this.embeddingRepo.find({ where: { documentId } });

    const topChunks = embeddings
      .map((e) => ({
        chunk: e.chunk,
        score: this.cosineSimilarity(questionVector, e.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((e) => e.chunk);

    const prompt = `
Você é um assistente que responde apenas com base neste documento.

Contexto:
${topChunks.join('\n\n')}

Pergunta:
${question}
`;

    const answer = await this.askLocalOllama(prompt);
    return { answer };
  }
}
