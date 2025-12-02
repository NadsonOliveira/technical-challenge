import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import { CreateChatbotDto } from './dto/create-chatbots.dto';
import { Chatbot } from './entities/chatbots.entity';
import { DocumentEntity } from 'src/documents/entities/document.entity';
import { EmbeddingService } from 'src/embeddings/embeddings.service';

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

    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,

    private readonly embeddingService: EmbeddingService,
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

    const topChunks = await this.embeddingService.searchSimilarChunks(
      question,
      documentId,
    );

    const context = topChunks.map((c) => c.chunk).join('\n\n');

    const prompt = `
Você é um assistente que responde SOMENTE com base no documento.

DOCUMENTO:
${context}

PERGUNTA:
${question}
`;

    const answer = await this.askLocalOllama(prompt);

    return { answer };
  }
}
