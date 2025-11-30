import { Module } from '@nestjs/common';
import { Chatbots } from './entities/chatbots.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatsBotsController } from './chatsbots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chatbots])],
  controllers: [chatsBotsController],
  exports: [TypeOrmModule],
  providers: [],
})
export class ChatBotsModule {}
