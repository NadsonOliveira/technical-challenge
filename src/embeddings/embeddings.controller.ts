import { Controller, Get } from '@nestjs/common';

@Controller('embeddings')
export class EmbeddingsController {
  @Get()
  findAll(): string {
    return 'This action returns all chatsBots';
  }
}
