import { Controller, Get } from '@nestjs/common';

@Controller('chatsBots')
export class chatsBotsController {
  @Get()
  findAll(): string {
    return 'This action returns all chatsBots';
  }
}
