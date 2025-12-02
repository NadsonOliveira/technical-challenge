import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}
  async findByChatbot(chatbotId: string) {
    return await this.messageRepo.find({
      where: { chatbotId },
      order: { createdAt: 'ASC' },
    });
  }
}
