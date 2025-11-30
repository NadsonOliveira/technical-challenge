import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { EmbeddingService } from './embeddings.service';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';

@ApiTags('Embeddings')
@Controller('embeddings')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Post(':documentId/generate')
  @ApiOperation({ summary: 'Gera embeddings para um documento processado' })
  @ApiBody({ type: CreateEmbeddingDto })
  generate(@Body() dto: CreateEmbeddingDto) {
    return this.embeddingService.generateEmbeddings(dto.documentId, dto.text);
  }

  @Post(':documentId/search')
  @ApiOperation({ summary: 'Busca chunks mais similares ao texto informado' })
  search(
    @Param('documentId') documentId: string,
    @Body('query') query: string,
  ) {
    return this.embeddingService.searchSimilarChunks(query, documentId);
  }
}
