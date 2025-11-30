import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  async create(dto: CreateMessageDto) {
    const message = this.messageRepo.create(dto);
    return await this.messageRepo.save(message);
  }

  async findByChatbot(chatbotId: string) {
    return await this.messageRepo.find({
      where: { chatbotId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const message = await this.messageRepo.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    return message;
  }

  async remove(id: string) {
    const result = await this.messageRepo.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    return { message: 'Mensagem removida com sucesso.' };
  }

  async clearChatbotMessages(chatbotId: string) {
    await this.messageRepo.delete({ chatbotId });
    return { message: 'Todas as mensagens foram removidas.' };
  }
}
