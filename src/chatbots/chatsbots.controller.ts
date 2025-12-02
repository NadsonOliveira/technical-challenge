import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbots.dto';
import { AskRagDto } from './dto/askrag.dto';

@Controller('chatbots')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  create(@Body() dto: CreateChatbotDto) {
    return this.chatbotService.create(dto);
  }

  @Post(':chatbotId/ask')
  async ask(@Param('chatbotId') chatbotId: string, @Body() dto: AskRagDto) {
    return this.chatbotService.askRag(chatbotId, dto.documentId, dto.question);
  }

  @Get()
  findAll() {
    return this.chatbotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(id);
  }
}
