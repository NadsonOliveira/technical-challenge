import { Controller, Get } from '@nestjs/common';

@Controller('documents')
export class DocumentsController {
  @Get()
  findAll(): string {
    return 'This action returns all chatsBots';
  }
}
