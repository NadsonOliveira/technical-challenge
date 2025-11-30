import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova mensagem' })
  @ApiBody({ type: CreateMessageDto })
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Get('chatbot/:chatbotId')
  @ApiOperation({ summary: 'Lista todas as mensagens de um chatbot' })
  @ApiParam({ name: 'chatbotId', required: true })
  findByChatbot(@Param('chatbotId') chatbotId: string) {
    return this.messageService.findByChatbot(chatbotId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma mensagem pelo ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma mensagem pelo ID' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }

  @Delete('chatbot/:chatbotId/clear')
  @ApiOperation({ summary: 'Remove TODAS as mensagens de um chatbot' })
  @ApiParam({ name: 'chatbotId' })
  clear(@Param('chatbotId') chatbotId: string) {
    return this.messageService.clearChatbotMessages(chatbotId);
  }
}
