import { MessageService } from './message.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, Param } from '@nestjs/common';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('chatbot/:chatbotId')
  @ApiOperation({ summary: 'Lista todas as mensagens de um chatbot' })
  @ApiParam({ name: 'chatbotId', required: true })
  findByChatbot(@Param('chatbotId') chatbotId: string) {
    return this.messageService.findByChatbot(chatbotId);
  }
}
