import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingController } from './embeddings/embeddings.controller';
import { MessageModule } from './messages/messages.module';
import { DbModule } from './db/db.module';
import { ChatbotController } from './chatbots/chatsbots.controller';
import { ChatbotModule } from './chatbots/chatbots.module';
import { DocumentModule } from './documents/documents.module';
import { DocumentController } from './documents/document.controller';
import { MessageController } from './messages/messages.controller';
import { EmbeddingModule } from './embeddings/embeddings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    ChatbotModule,
    DocumentModule,
    EmbeddingModule,
    MessageModule,
  ],
  controllers: [
    MessageController,
    ChatbotController,
    DocumentController,
    EmbeddingController,
  ],
  providers: [],
})
export class AppModule {}
