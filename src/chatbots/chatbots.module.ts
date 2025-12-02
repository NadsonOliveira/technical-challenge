import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { Chatbot } from './entities/chatbots.entity';
import { ChatbotController } from './chatsbots.controller';
import { EmbeddingEntity } from 'src/embeddings/entities/embedding.entity';
import { DocumentEntity } from 'src/documents/entities/document.entity';
import { EmbeddingService } from 'src/embeddings/embeddings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatbot, EmbeddingEntity, DocumentEntity]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, EmbeddingService],
  exports: [ChatbotService, EmbeddingService],
})
export class ChatbotModule {}
