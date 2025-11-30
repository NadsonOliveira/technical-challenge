import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBotsModule } from './chatbots/chatbots.module';
import { chatsBotsController } from './chatbots/chatsbots.controller';
import { DocumentsModule } from './documents/documents.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { EmbeddingsController } from './embeddings/embeddings.controller';
import { DocumentsController } from './documents/documents.controller';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +(configService.get<number>('DB_PORT') ?? 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ChatBotsModule,
    DocumentsModule,
    EmbeddingsModule,
    MessagesModule,
  ],
  controllers: [chatsBotsController, DocumentsController, EmbeddingsController],
  providers: [],
})
export class AppModule {}
